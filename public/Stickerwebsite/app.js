'use strict';
(() => {
  const C=window.EditorCore, R=window.EditorRenderer, A=window.EditorAssets;
  const $=id=>document.getElementById(id);
  const sceneCanvas=$('canvas'), selectionCanvas=$('selection-canvas'), stage=$('stage');
  const ctx=sceneCanvas.getContext('2d'), sel=selectionCanvas.getContext('2d');
  let scene=C.createBlankScene(), selected=null;
  let history=new C.History(26), zoom=.4, fitMode=true, tool='select', spaceDown=false, gesture=null;
  let ratioLocked=true, projectName='未命名拼贴', saveTimer=null, textTimer=null, toastTimer=null, db=null;
  const draftSave=new C.DraftSaveTracker();
  let recoveryProject=null, autoSaveBlocked=false, lastDraft=null, previousDraft=null, draftBackedUp=false;
  let contentEpoch=0, cutoutSession=null, cutoutVersion=0, cutoutTimer=null;
  let initialized=false, importing=false, confirmation=null, activePanel='photos', stickerCategory='全部';
  const library={photos:[],stickers:[]}, stickerCache=new Map();
  const icon=(name,extra='')=>`<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const uid=()=>globalThis.crypto?.randomUUID?.()||'layer-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
  const current=()=>scene.layers.find(l=>l.id===selected);
  const snapshot=()=>({scene,selected,photos:library.photos,stickers:library.stickers});
  function toast(message,error=false) {
    clearTimeout(toastTimer);const el=$('toast');el.querySelector('span').textContent=message;el.classList.toggle('error',error);el.hidden=false;
    toastTimer=setTimeout(()=>{el.hidden=true;},error?5000:2700);
  }
  function makeLayer(data) {return {id:uid(),name:'新图层',x:scene.width/2,y:scene.height/2,width:240,height:240,rotation:0,opacity:1,visible:true,locked:false,flipX:false,flipY:false,...data};}
  function commit(message) {
    clearTimeout(textTimer);textTimer=null;
    scene.layers=scene.layers.map(C.constrainLayer);
    if(history.push(snapshot())){draftSave.change();scheduleSave();}
    refresh();if(message)toast(message);
  }
  function refresh() {draw();refreshCanvasFields();refreshSelection();refreshLayers();refreshHistory();}
  function draw() {
    if(!initialized && !scene.layers.length)return;
    const renderScale=Math.min(2,window.devicePixelRatio||1);
    const {width:bw,height:bh}=C.previewDimensions(scene.width,scene.height,zoom,renderScale);
    if(sceneCanvas.width!==bw||sceneCanvas.height!==bh){sceneCanvas.width=bw;sceneCanvas.height=bh;selectionCanvas.width=bw;selectionCanvas.height=bh;}
    $('artboard').style.width=Math.round(scene.width*zoom)+'px';$('artboard').style.height=Math.round(scene.height*zoom)+'px';
    ctx.setTransform(bw/scene.width,0,0,bh/scene.height,0,0);R.drawScene(ctx,scene);drawSelection();
    $('artboard-title').textContent=scene.layers.length?'我的画布':'空白画布';
    $('zoom-value').textContent=Math.round(zoom*100)+'%';$('canvas-dimensions').textContent=`${scene.width} × ${scene.height} px`;
    $('canvas-label').textContent=scene.width===scene.height?'方形画布':scene.width>scene.height?'横版画布':'竖版画布';
  }
  function handles(layer) {
    const corners=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y],index)=>({type:'resize',index,hx:x,hy:y,...C.toWorld(layer,{x:x*layer.width/2,y:y*layer.height/2})}));
    corners.push({type:'rotate',...C.toWorld(layer,{x:0,y:-layer.height/2-27/zoom})});return corners;
  }
  function drawSelection() {
    const sw=selectionCanvas.width,sh=selectionCanvas.height;
    sel.setTransform(1,0,0,1,0,0);sel.clearRect(0,0,sw,sh);
    const layer=current();if(!layer||layer.visible===false)return;
    const s=sw/scene.width;sel.setTransform(s,0,0,s,0,0);
    sel.save();sel.translate(layer.x,layer.y);sel.rotate(layer.rotation*Math.PI/180);
    sel.strokeStyle=layer.locked?'#959e8a':'#d65d3b';sel.lineWidth=1/zoom;sel.setLineDash(layer.locked?[4/zoom,4/zoom]:[]);
    sel.strokeRect(-layer.width/2,-layer.height/2,layer.width,layer.height);
    if(!layer.locked){sel.beginPath();sel.moveTo(0,-layer.height/2);sel.lineTo(0,-layer.height/2-27/zoom);sel.stroke();}
    sel.restore();
    if(!layer.locked)for(const handle of handles(layer)){
      sel.fillStyle='#fffaf2';sel.strokeStyle='#d65d3b';sel.lineWidth=1/zoom;
      if(handle.type==='rotate'){sel.beginPath();sel.arc(handle.x,handle.y,3.8/zoom,0,Math.PI*2);sel.fill();sel.stroke();}
      else{const size=6/zoom;sel.fillRect(handle.x-size/2,handle.y-size/2,size,size);sel.strokeRect(handle.x-size/2,handle.y-size/2,size,size);}
    }
    if(gesture?.guides){sel.strokeStyle='#a6ac89';sel.lineWidth=1/zoom;sel.setLineDash([4/zoom,4/zoom]);for(const axis of gesture.guides){sel.beginPath();if(axis==='x'){sel.moveTo(scene.width/2,0);sel.lineTo(scene.width/2,scene.height);}else{sel.moveTo(0,scene.height/2);sel.lineTo(scene.width,scene.height/2);}sel.stroke();}sel.setLineDash([]);}
  }
  function fitView() {
    const padding=window.innerWidth<=720?{x:58,y:128}:{x:120,y:143};
    zoom=C.clamp(Math.min((stage.clientWidth-padding.x)/scene.width,(stage.clientHeight-padding.y)/scene.height,.9),.05,3);fitMode=true;
    draw();requestAnimationFrame(centerView);
  }
  function centerView(){stage.scrollLeft=Math.max(0,(stage.scrollWidth-stage.clientWidth)/2);stage.scrollTop=Math.max(0,(stage.scrollHeight-stage.clientHeight)/2);}
  function setZoom(value){zoom=C.clamp(value,.05,3);fitMode=false;draw();requestAnimationFrame(centerView);}
  function refreshHistory(){$('undo').disabled=!history.canUndo;$('redo').disabled=!history.canRedo;$('clear-canvas').disabled=!scene.layers.length;}
  function photoForSizing(){
    const l=current();if(l?.type==='image'&&l.role!=='sticker')return l;
    return scene.layers.find(l=>l.id===scene.basePhotoId&&l.type==='image')||scene.layers.find(l=>l.type==='image'&&l.role==='photo');
  }
  function refreshCanvasFields(){
    $('canvas-width').value=scene.width;$('canvas-height').value=scene.height;
    const custom=scene.sizeMode==='custom',photo=photoForSizing();
    $('size-mode-label').textContent=custom?'自定义尺寸':scene.basePhotoId?'照片尺寸':'跟随照片';
    $('size-mode-note').textContent=custom?'已保留你设置的尺寸。':scene.basePhotoId?'画布与主照片的像素一致。':'上传第一张照片后，自动匹配照片尺寸。';
    $('use-photo-size').disabled=!photo||photo.locked;
    document.querySelectorAll('[data-color]').forEach(b=>b.classList.toggle('active',b.dataset.color===scene.background));
    if(scene.background!=='transparent')$('background-color').value=scene.background;
  }
  function refreshSelection(){
    const l=current();$('selection-empty').hidden=!!l;$('selection-fields').hidden=!l;
    for(const id of ['duplicate-layer','delete-layer','layer-up','layer-down'])$(id).disabled=!l||l.locked;
    $('canvas-hint').innerHTML=l?.locked?'<i></i> 图层已锁定，点击图层右侧的小锁解锁。':'<i></i> 拖一拖，转一转，贴出你的风格。';
    if(!l)return;
    $('selection-fields').disabled=l.locked;$('layer-name').value=l.name;
    $('delete-selected-object').querySelector('span').textContent=l.type==='text'?'删除这段文字':l.role==='sticker'?'删除这张贴纸':'删除这张照片';
    for(const key of ['x','y','width','height','rotation'])$('layer-'+key).value=Math.round(l[key]*10)/10;
    $('layer-opacity').value=Math.round(l.opacity*100);$('opacity-value').value=Math.round(l.opacity*100)+'%';$('layer-opacity').style.setProperty('--range',Math.round(l.opacity*100)+'%');
    $('flip-x').classList.toggle('active',!!l.flipX);$('flip-y').classList.toggle('active',!!l.flipY);
    refreshAdjustments(l);
    $('text-properties').hidden=l.type!=='text';
    if(l.type==='text'){
      $('text-content').value=l.text;$('text-font').value=l.fontFamily;$('text-size').value=Math.round(l.fontSize);$('text-color').value=l.color;$('text-align').value=l.align;
      $('text-bold').classList.toggle('active',l.bold);$('text-italic').classList.toggle('active',l.italic);
    }
  }
  function refreshLayers(){
    const list=$('layer-list');list.replaceChildren();$('layer-count').textContent=scene.layers.length;
    if(!scene.layers.length){const p=document.createElement('p');p.className='selection-empty';p.textContent='画布还很空，放一张照片试试。';list.append(p);return;}
    for(const l of [...scene.layers].reverse()){
      const row=document.createElement('div');row.className='layer-row'+(l.id===selected?' selected':'')+(l.visible===false?' hidden-layer':'');row.tabIndex=0;row.setAttribute('role','button');row.setAttribute('aria-label','选择图层 '+l.name);row.setAttribute('aria-pressed',l.id===selected);row.dataset.layerId=l.id;
      const thumb=document.createElement('span');thumb.className='layer-thumb';
      if(l.type==='image'){const img=document.createElement('img');img.src=l.src;img.alt='';thumb.append(img);}else{const t=document.createElement('span');t.textContent='T';thumb.append(t);}
      const name=document.createElement('span');name.className='layer-row-name';name.textContent=l.name;name.title=l.name;
      const lock=document.createElement('button');lock.className='icon-button layer-lock'+(l.locked?' is-locked':'');lock.title=l.locked?'解锁图层':'锁定图层';lock.setAttribute('aria-label',lock.title+' '+l.name);lock.innerHTML=icon(l.locked?'lock':'unlock');lock.onclick=e=>{e.stopPropagation();l.locked=!l.locked;selected=l.id;commit();};
      const eye=document.createElement('button');eye.className='icon-button';eye.title=l.visible===false?'显示图层':'隐藏图层';eye.setAttribute('aria-label',eye.title+' '+l.name);eye.innerHTML=icon(l.visible===false?'eye-off':'eye');eye.onclick=e=>{e.stopPropagation();l.visible=l.visible===false;commit();};
      row.append(thumb,name,lock,eye);row.onclick=()=>selectLayer(l.id);row.onkeydown=e=>{if(e.target===row&&(e.key==='Enter'||e.key===' ')){e.preventDefault();selectLayer(l.id);}};list.append(row);
    }
  }
  function selectLayer(id){flushText();selected=id;setTool('select');drawSelection();refreshCanvasFields();refreshSelection();refreshLayers();}
  function switchPanel(panel){activePanel=panel;document.querySelectorAll('[data-panel]').forEach(b=>b.classList.toggle('active',b.dataset.panel===panel));for(const name of ['photos','stickers','text'])$('panel-'+name).hidden=name!==panel;}
  function setTool(next){tool=next;$('select-tool').classList.toggle('active',next==='select');$('hand-tool').classList.toggle('active',next==='hand');$('select-tool').setAttribute('aria-pressed',next==='select');$('hand-tool').setAttribute('aria-pressed',next==='hand');updateCursor();}
  function updateCursor(cursor){const value=cursor||(tool==='hand'||spaceDown?'grab':'default');selectionCanvas.style.cursor=value;stage.style.cursor=value;}
  async function stickerAsset(sticker){
    if(stickerCache.has(sticker.id))return stickerCache.get(sticker.id);
    const box=sticker.markup.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);const height=Math.round(960*box[3]/box[2]);
    const svg=sticker.markup.replace('<svg ',`<svg width="960" height="${height}" `);
    const promise=R.rasterize('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg));stickerCache.set(sticker.id,promise);return promise;
  }
  function renderStickers(category=stickerCategory){
    stickerCategory=category;refreshStickerSections();
    const grid=$('sticker-grid');grid.replaceChildren();for(const sticker of A.stickers.filter(s=>category==='全部'||s.category===category)){
      const b=document.createElement('button');b.className='sticker-card';b.title='添加 '+sticker.name;b.setAttribute('aria-label','添加贴纸 '+sticker.name);b.dataset.sticker=sticker.id;
      const img=document.createElement('img');img.src=sticker.url;img.alt=sticker.name;img.draggable=false;const plus=document.createElement('span');plus.className='add-symbol';plus.textContent='+';b.append(img,plus);
      b.onclick=async()=>{b.disabled=true;try{const asset=await stickerAsset(sticker);addImage(asset,sticker.name,true);}catch(e){toast(e.message,true);}finally{b.disabled=false;}};grid.append(b);
    }
  }
  function refreshStickerSections(){
    const mine=stickerCategory==='我的贴纸',count=library.stickers.length;
    $('uploaded-stickers-section').hidden=!(mine||(stickerCategory==='全部'&&count>0));
    $('my-stickers-empty').hidden=count>0;$('uploaded-sticker-count').textContent=count+' 张';
    $('builtin-stickers-section').hidden=mine;
    const builtinCount=A.stickers.filter(s=>stickerCategory==='全部'||s.category===stickerCategory).length;
    $('builtin-stickers-title').textContent=stickerCategory==='全部'?'全部贴纸':stickerCategory+'贴纸';$('builtin-sticker-count').textContent=builtinCount+' 张';
    document.querySelectorAll('[data-category]').forEach(button=>{const active=button.dataset.category===stickerCategory;button.classList.toggle('active',active);button.setAttribute('aria-pressed',active);});
  }
  function addLayer(layer,message){
    if(scene.layers.length>=150){toast('画布最多支持 150 个图层，请先删除一些图层',true);return false;}
    if(C.assetBytes({layers:[...scene.layers,layer]})>C.MAX_PROJECT_ASSET_BYTES){toast('当前工程素材较大，请先减少一些大图片再添加',true);return false;}
    flushText();const oldWidth=scene.width,oldHeight=scene.height;
    if(layer.type==='image'&&layer.role==='photo')scene=C.addPhotoToScene(scene,layer,layer.photoWidth,layer.photoHeight);
    else scene.layers.push(C.constrainLayer(layer));
    selected=layer.id;setTool('select');commit(message);
    if(scene.width!==oldWidth||scene.height!==oldHeight)fitView();return true;
  }
  function addImage(asset,name,isSticker=false){
    asset.id=asset.id||uid();
    const maxW=scene.width*(isSticker?.26:1),maxH=scene.height*(isSticker?.26:1),scale=Math.min(maxW/asset.width,maxH/asset.height);
    return addLayer(makeLayer({type:'image',src:asset.src,name,assetId:asset.id,role:isSticker?'sticker':'photo',...(isSticker?{}:{photoWidth:asset.width,photoHeight:asset.height}),width:Math.max(1,asset.width*scale),height:Math.max(1,asset.height*scale),rotation:isSticker?-6:0}),isSticker?'贴纸已加入画布。':'照片已完整放入画布。');
  }
  const filterPresets={original:{brightness:100,contrast:100,saturation:100,grayscale:0,sepia:0},film:{brightness:106,contrast:88,saturation:78,grayscale:0,sepia:16},mono:{brightness:103,contrast:115,saturation:100,grayscale:100,sepia:0},warm:{brightness:106,contrast:97,saturation:108,grayscale:0,sepia:28}};
  function refreshAdjustments(layer){
    $('image-properties').hidden=layer.type!=='image';if(layer.type!=='image')return;
    const a=layer.adjustments||filterPresets.original;
    $('image-filter').value=Object.entries(filterPresets).find(([,p])=>Object.keys(p).every(k=>p[k]===a[k]))?.[0]||'custom';
    for(const key of ['brightness','contrast','saturation']){$('image-'+key).value=a[key];$(key+'-value').value=a[key];$('image-'+key).style.setProperty('--range',a[key]/2+'%');}
  }
  function setFilter(preset){const l=current();if(l?.type==='image'&&!l.locked&&filterPresets[preset]){l.adjustments={...filterPresets[preset]};commit();}}
  function addText(preset='title',text){
    const factor=scene.width/1080;const serif=preset==='serif',hand=preset==='hand';
    const layer=makeLayer({type:'text',name:'文字 · '+(text||'写下你的心情').slice(0,12),text:text||(hand?'just a little note.':serif?'把这一刻，留在这里。':'写下你的心情'),fontSize:C.clamp((hand?52:serif?50:68)*factor,4,2000),fontFamily:hand?'hand':serif?'serif':'sans',bold:!serif&&!hand,italic:hand,color:'#36432f',align:'center',width:scene.width*.8,height:scene.height*.22});
    if(addLayer(layer,'双击文字，或在右侧修改内容')){switchPanel('text');if(window.innerWidth>720){$('text-content').focus();$('text-content').select();}}
  }
  function readFile(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('文件读取失败，请重试'));reader.readAsDataURL(file);});}
  async function importImages(files,isSticker){
    if(importing){toast('正在读取上一批图片，请稍等一下');return;}
    importing=true;let count=0,cutouts=0;const epoch=contentEpoch,automatic=isSticker&&$('auto-remove-white').checked;
    try{for(const file of Array.from(files).slice(0,30)){
      try{
        if(epoch!==contentEpoch)break;
        if(scene.layers.length>=150)throw new Error('画布最多支持 150 个图层');
        if(!/^image\/(png|jpe?g|webp|gif|svg\+xml)$/i.test(file.type)&&!(/\.(png|jpe?g|webp|gif|svg)$/i.test(file.name)&&!file.type))throw new Error(file.name+'：暂不支持这个图片格式');
        if(file.size>30*1024*1024)throw new Error(file.name+'：单张图片请控制在 30 MB 以内');if(!file.size)throw new Error('这张图片是空文件');
        const original=await R.rasterize(await readFile(file));if(epoch!==contentEpoch)break;
        const item={...original,id:uid(),name:file.name},group=isSticker?'stickers':'photos';library[group].push(item);
        if(!addImage(item,file.name.replace(/\.[^.]+$/,'').slice(0,80),isSticker)){library[group].pop();continue;}
        const layerId=selected;let asset=original;
        if(automatic){
          try{
            const result=await R.makeCutout(original.src,{tolerance:32,preserveInterior:true,skipTransparent:true});
            if(epoch!==contentEpoch)break;
            if(result.changedPixels&&await replaceLayerSource(layerId,original.src,result)){asset=result;cutouts++;}
          }catch(e){toast('贴纸已上传，自动去白底未完成，可在图层设置中重试',true);}
        }
        if(epoch!==contentEpoch)break;
        count++;Object.assign(item,asset);history.replaceCurrent(snapshot());
        if(original.reduced)toast('大图已优化，方便流畅编辑');
      }catch(e){toast(e.message,true);}
    }}finally{importing=false;refreshLibrary();if(count){switchPanel(isSticker?'stickers':'photos');if(isSticker)renderStickers('我的贴纸');toast(cutouts?`已上传 ${count} 张贴纸，其中 ${cutouts} 张已自动去白底`:`已上传 ${count} 张${isSticker?'贴纸':'照片'}`);}}
  }
  function refreshLibrary(){
    const photos=$('photo-library');photos.replaceChildren();
    for(const item of library.photos){
      const card=document.createElement('article');card.className='photo-card';
      const preview=document.createElement('button');preview.className='photo-preview';preview.title='添加到画布 '+item.name;preview.setAttribute('aria-label',preview.title);
      const img=document.createElement('img');img.src=item.src;img.alt=item.name;img.draggable=false;preview.append(img);preview.onclick=()=>addImage(item,item.name.replace(/\.[^.]+$/,''),false);
      const caption=document.createElement('p');caption.className='photo-caption';caption.textContent=item.name;caption.title=item.name;
      const actions=document.createElement('div');actions.className='photo-card-actions';
      const add=document.createElement('button');add.innerHTML=icon('plus','tiny')+'添加';add.setAttribute('aria-label','再次添加照片 '+item.name);add.onclick=()=>addImage(item,item.name.replace(/\.[^.]+$/,''),false);
      const remove=document.createElement('button');remove.className='delete-photo';remove.innerHTML=icon('trash','tiny')+'删除';remove.setAttribute('aria-label','删除照片 '+item.name);remove.title='从素材区及画布删除这张照片（包括副本），可撤销';remove.onclick=()=>deletePhoto(item.id);
      actions.append(add,remove);card.append(preview,caption,actions);photos.append(card);
    }
    if(!library.photos.length){const empty=document.createElement('p');empty.className='empty-library';empty.textContent='还没有上传照片';photos.append(empty);}
    const stickers=$('uploaded-stickers');stickers.replaceChildren();
    for(const item of library.stickers){
      const b=document.createElement('button');b.className='sticker-card';b.title='再次添加 '+item.name;b.setAttribute('aria-label',b.title);
      const img=document.createElement('img');img.src=item.src;img.alt=item.name;img.draggable=false;const p=document.createElement('span');p.textContent='+';b.append(img,p);b.onclick=()=>addImage(item,item.name.replace(/\.[^.]+$/,''),true);stickers.append(b);
    }
    $('photo-count').textContent=library.photos.length?library.photos.length+' 张照片':'还没有上传';refreshStickerSections();
  }
  function deletePhoto(assetId){
    flushText();const item=library.photos.find(p=>p.id===assetId);if(!item)return;
    const oldWidth=scene.width,oldHeight=scene.height;
    library.photos=library.photos.filter(p=>p.id!==assetId);scene=C.removePhotoAsset(scene,assetId);
    if(!scene.layers.some(l=>l.id===selected))selected=null;
    commit('照片已删除，点击撤销可恢复。');refreshLibrary();if(scene.width!==oldWidth||scene.height!==oldHeight)fitView();
  }
  function usePhotoSize(){
    const photo=photoForSizing();if(!photo||photo.locked)return;
    const image=R.cache.get(photo.src),width=photo.photoWidth||image?.naturalWidth,height=photo.photoHeight||image?.naturalHeight;
    try{flushText();scene=C.fitCanvasToPhoto(scene,photo.id,width,height);commit('画布已按照片尺寸匹配，完整显示整张照片。');fitView();}catch(e){toast(e.message,true);}
  }
  function hydratePhotoState(next){
    const images=next.layers.filter(l=>l.type==='image');
    const primary=images.find(l=>l.id===next.basePhotoId)||images.filter(l=>l.role==='photo').sort((a,b)=>b.width*b.height-a.width*a.height)[0]||images.filter(l=>!l.role).sort((a,b)=>b.width*b.height-a.width*a.height)[0];
    const idsBySource=new Map(),items=new Map();
    for(const l of images){
      if(!l.role)l.role=l===primary?'photo':'sticker';if(l.role!=='photo')continue;
      l.assetId=l.assetId||idsBySource.get(l.src)||uid();idsBySource.set(l.src,l.assetId);
      const image=R.cache.get(l.src);
      if(!l.photoWidth||!l.photoHeight){const ratio=Math.min(1,8192/Math.max(image.naturalWidth,image.naturalHeight),Math.sqrt(32000000/(image.naturalWidth*image.naturalHeight)));l.photoWidth=Math.max(1,Math.floor(image.naturalWidth*ratio));l.photoHeight=Math.max(1,Math.floor(image.naturalHeight*ratio));}
      if(!items.has(l.assetId))items.set(l.assetId,{id:l.assetId,src:l.src,width:l.photoWidth,height:l.photoHeight,name:l.name});
    }
    if(primary&&!next.basePhotoId)next.basePhotoId=primary.id;
    library.photos=[...items.values()];return next;
  }
  function duplicateLayer(){const l=current();if(!l||l.locked)return;const copy={...l,id:uid(),name:l.name+' 副本',x:l.x+scene.width*.025,y:l.y+scene.height*.025};addLayer(copy,'已复制图层');}
  function deleteLayer(){const l=current();if(!l||l.locked)return;const w=scene.width,h=scene.height;scene=C.removeSceneLayers(scene,[selected]);selected=null;commit('已删除所选图层，可撤销。');if(scene.width!==w||scene.height!==h)fitView();}
  function reorder(delta){const l=current();if(!l||l.locked)return;scene.layers=C.moveLayer(scene.layers,l.id,delta);commit();}
  function undo(redo=false){flushText();const previous=redo?history.redo():history.undo();if(!previous)return;scene=previous.scene;selected=previous.selected;library.photos=previous.photos||[];library.stickers=previous.stickers||[];refreshLibrary();draftSave.change();scheduleSave();refresh();if(fitMode)fitView();}
  function point(event){const rect=selectionCanvas.getBoundingClientRect();return{x:(event.clientX-rect.left)*scene.width/rect.width,y:(event.clientY-rect.top)*scene.height/rect.height};}
  function handleAt(p,l=current()){if(!l||l.locked||l.visible===false)return null;return handles(l).find(h=>Math.hypot(h.x-p.x,h.y-p.y)<11/zoom);}
  function pointerDown(e){
    if(!initialized||e.button!==0||!e.isPrimary||gesture)return;
    if(tool==='hand'||spaceDown){gesture={type:'pan',pointer:e.pointerId,x:e.clientX,y:e.clientY,sx:stage.scrollLeft,sy:stage.scrollTop};stage.setPointerCapture(e.pointerId);updateCursor('grabbing');e.preventDefault();return;}
    if(e.target!==selectionCanvas){selectLayer(null);return;}
    e.preventDefault();flushText();selectionCanvas.focus({preventScroll:true});const p=point(e);let l=current(),handle=handleAt(p,l);
    if(!handle){l=[...scene.layers].reverse().find(layer=>C.hitTest(layer,p));selectLayer(l?.id||null);}
    if(!l||l.locked||l.visible===false)return;
    const original={...l};gesture={type:handle?.type||'move',pointer:e.pointerId,start:p,original,moved:false,handle};
    if(handle?.type==='rotate')gesture.startAngle=Math.atan2(p.y-l.y,p.x-l.x);
    stage.setPointerCapture(e.pointerId);updateCursor(handle?.type==='rotate'?'crosshair':handle?.type==='resize'?'nwse-resize':'grabbing');
  }
  function pointerMove(e){
    if(!gesture){if(e.target===selectionCanvas&&tool==='select'&&!spaceDown){const p=point(e),h=handleAt(p);updateCursor(h?(h.type==='rotate'?'crosshair':'nwse-resize'):[...scene.layers].reverse().some(l=>!l.locked&&C.hitTest(l,p))?'move':'default');}return;}
    if(gesture.pointer!==e.pointerId)return;
    if(gesture.type==='pan'){stage.scrollLeft=gesture.sx-(e.clientX-gesture.x);stage.scrollTop=gesture.sy-(e.clientY-gesture.y);return;}
    const l=current();if(!l)return;const p=point(e),o=gesture.original;
    if(gesture.type==='move'){
      let dx=p.x-gesture.start.x,dy=p.y-gesture.start.y;if(e.shiftKey){if(Math.abs(dx)>Math.abs(dy))dy=0;else dx=0;}
      l.x=C.clamp(o.x+dx,-scene.width,scene.width*2);l.y=C.clamp(o.y+dy,-scene.height,scene.height*2);gesture.guides=[];
      if(!e.altKey){if(Math.abs(l.x-scene.width/2)<5/zoom){l.x=scene.width/2;gesture.guides.push('x');}if(Math.abs(l.y-scene.height/2)<5/zoom){l.y=scene.height/2;gesture.guides.push('y');}}
    }else if(gesture.type==='rotate'){
      let angle=o.rotation+(Math.atan2(p.y-o.y,p.x-o.x)-gesture.startAngle)*180/Math.PI;if(e.shiftKey)angle=Math.round(angle/15)*15;l.rotation=Math.round(angle*10)/10;
    }else if(gesture.type==='resize'){
      const {hx,hy}=gesture.handle,local=C.toLocal(o,p),anchor={x:-hx*o.width/2,y:-hy*o.height/2};
      let w=C.clamp(hx*(local.x-anchor.x),8,32768),h=C.clamp(hy*(local.y-anchor.y),8,32768);
      if(!e.shiftKey){const scale=Math.min(32768/Math.max(o.width,o.height),Math.max(w/o.width,h/o.height));w=Math.max(1,o.width*scale);h=Math.max(1,o.height*scale);}
      l.width=w;l.height=h;const center=C.toWorld(o,{x:anchor.x+hx*w/2,y:anchor.y+hy*h/2});l.x=center.x;l.y=center.y;if(l.type==='text')l.fontSize=C.clamp(o.fontSize*Math.min(w/o.width,h/o.height),4,2000);
    }
    gesture.moved=true;draw();refreshSelection();
  }
  function pointerUp(e){
    if(!gesture||gesture.pointer!==e.pointerId)return;const previous=gesture;gesture=null;if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);updateCursor();
    if(previous.type!=='pan'&&previous.moved)commit();else drawSelection();
  }
  stage.addEventListener('pointerdown',pointerDown);stage.addEventListener('pointermove',pointerMove);stage.addEventListener('pointerup',pointerUp);
  stage.addEventListener('pointercancel',e=>{if(gesture&&gesture.pointer===e.pointerId){if(gesture.original&&current())Object.assign(current(),gesture.original);gesture=null;updateCursor();refresh();}});
  selectionCanvas.addEventListener('dblclick',()=>{const l=current();if(l?.type==='text'&&!l.locked){if(window.innerWidth<=720)mobilePanel('inspector');$('text-content').focus();$('text-content').select();}});
  stage.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();setZoom(zoom*(e.deltaY>0?.9:1.1));}},{passive:false});
  let dragDepth=0;
  stage.addEventListener('dragenter',e=>{if(e.dataTransfer?.types.includes('Files')){e.preventDefault();dragDepth++;$('drop-overlay').hidden=false;}});
  stage.addEventListener('dragover',e=>{if(e.dataTransfer?.types.includes('Files')){e.preventDefault();e.dataTransfer.dropEffect='copy';}});
  stage.addEventListener('dragleave',()=>{if(--dragDepth<=0){dragDepth=0;$('drop-overlay').hidden=true;}});
  stage.addEventListener('drop',e=>{e.preventDefault();dragDepth=0;$('drop-overlay').hidden=true;if(e.dataTransfer.files.length)importImages(e.dataTransfer.files,activePanel==='stickers');});
  document.addEventListener('dragover',e=>{if(e.dataTransfer?.types.includes('Files'))e.preventDefault();});document.addEventListener('drop',e=>e.preventDefault());
  function confirmClearCanvas(){
    if(!scene.layers.length&&!importing)return;
    confirmReplace(`确定移除画布中的 ${scene.layers.length} 个图层吗？照片、贴纸和文字都会清空，素材库、尺寸与底色会保留。确认后仍可撤销。`,clearCanvas,{title:'清空画布？',acceptLabel:'确认清空'});
  }
  function clearCanvas(){
    if(!scene.layers.length&&!importing)return;
    flushText();contentEpoch++;scene=C.clearScene(scene);selected=null;commit('画布已清空，点击撤销可恢复。');
  }
  async function replaceLayerSource(id,expectedSrc,asset){
    const target=scene.layers.find(l=>l.id===id);
    if(!target||target.locked||target.src!==expectedSrc)return false;
    const candidate={layers:scene.layers.map(l=>l.id===id?{...l,src:asset.src}:l)};
    if(C.assetBytes(candidate)>C.MAX_PROJECT_ASSET_BYTES)throw new Error('去白底结果超出工程容量，请先减少大图片');
    await R.loadImage(asset.src);
    const active=scene.layers.find(l=>l.id===id);
    if(!active||active.locked||active.src!==expectedSrc)return false;
    active.src=asset.src;commit();return true;
  }
  function openCutout(){
    const layer=current();if(layer?.type!=='image'||layer.locked)return;
    flushText();cutoutSession={id:layer.id,src:layer.src,name:layer.name,asset:null};
    $('cutout-before').src=layer.src;$('cutout-after').src=layer.src;$('cutout-tolerance').value=32;$('cutout-tolerance-value').value=32;$('cutout-preserve').checked=true;
    $('cutout-dialog').showModal();queueCutout();
  }
  function queueCutout(){
    if(!cutoutSession)return;clearTimeout(cutoutTimer);const version=++cutoutVersion,session=cutoutSession;
    $('cutout-tolerance-value').value=$('cutout-tolerance').value;
    $('cutout-tolerance').style.setProperty('--range',($('cutout-tolerance').value-5)/95*100+'%');
    $('cutout-apply').disabled=true;$('cutout-status').textContent='正在生成预览…';$('cutout-dialog').dataset.busy='true';
    const settings={tolerance:Number($('cutout-tolerance').value),preserveInterior:$('cutout-preserve').checked};
    cutoutTimer=setTimeout(async()=>{
      try{
        if(session!==cutoutSession||version!==cutoutVersion)return;
        const asset=await R.makeCutout(session.src,settings);
        if(session!==cutoutSession||version!==cutoutVersion||!$('cutout-dialog').open)return;
        session.asset=asset;$('cutout-after').src=asset.src;
        $('cutout-status').textContent=asset.changedPixels?`已处理约 ${Math.round(asset.changedPixels/asset.totalPixels*100)}% 的像素 · 输出 ${asset.width} × ${asset.height} px`:'没有找到可去除的白底。可提高容差，或取消保留内部白色。';
        $('cutout-apply').disabled=!asset.changedPixels;
      }catch(e){if(session===cutoutSession&&version===cutoutVersion)$('cutout-status').textContent=e.message;}
      finally{if(session===cutoutSession&&version===cutoutVersion)$('cutout-dialog').dataset.busy='false';}
    },120);
  }
  async function applyCutout(){
    const session=cutoutSession;if(!session?.asset?.changedPixels)return;
    $('cutout-apply').disabled=true;
    try{
      await R.loadImage(session.asset.src);
      if(cutoutSession!==session||!$('cutout-dialog').open)return;
      if(!await replaceLayerSource(session.id,session.src,session.asset))throw new Error('这张图层已改变，请重新打开去白底预览');
      if(!library.stickers.some(item=>item.src===session.asset.src)){library.stickers.push({...session.asset,id:uid(),name:session.name+'（去白底）'});history.replaceCurrent(snapshot());refreshLibrary();}
      $('cutout-dialog').close();toast('白底已去除，原图效果可通过撤销恢复。');
    }catch(e){if(cutoutSession===session){$('cutout-status').textContent=e.message;$('cutout-apply').disabled=false;}}
  }
  async function restoreLastDraft(draft=lastDraft){
    if(!draft)return;flushText();
    try{
      const restored=C.validateProject(draft);await R.prepare(restored);contentEpoch++;scene=hydratePhotoState(restored);refreshLibrary();selected=null;projectName=String(draft.name||'上次的拼贴').slice(0,40);$('project-name').value=projectName;commit('已恢复保存的画布，可撤销。');fitView();setMenu(false);
    }catch(e){
      recoveryProject=draft;$('download-recovery').hidden=false;
      if(db)try{await writeStored('recovery',draft);}catch{autoSaveBlocked=true;}
      toast('这份工程暂时无法恢复，原始数据已保留，可从工程菜单下载备份。',true);
    }
  }
  function bindEvents(){
    document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>switchPanel(b.dataset.panel));
    document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>renderStickers(b.dataset.category));
    $('clear-canvas').onclick=confirmClearCanvas;$('remove-white').onclick=openCutout;$('cutout-tolerance').oninput=queueCutout;$('cutout-preserve').onchange=queueCutout;$('cutout-apply').onclick=applyCutout;$('cutout-cancel').onclick=()=>$('cutout-dialog').close();$('restore-draft').onclick=()=>restoreLastDraft();$('restore-previous').onclick=()=>restoreLastDraft(previousDraft);
    $('cutout-dialog').addEventListener('close',()=>{clearTimeout(cutoutTimer);cutoutVersion++;cutoutSession=null;$('cutout-before').removeAttribute('src');$('cutout-after').removeAttribute('src');});
    $('upload-sticker').onclick=()=>$('sticker-input').click();$('upload-photo').onclick=()=>$('photo-input').click();$('quick-photo').onclick=()=>$('photo-input').click();
    $('photo-input').onchange=e=>{importImages(e.target.files,false);e.target.value='';};$('sticker-input').onchange=e=>{importImages(e.target.files,true);e.target.value='';};
    document.querySelectorAll('[data-text-preset]').forEach(b=>b.onclick=()=>addText(b.dataset.textPreset));document.querySelectorAll('[data-quote]').forEach(b=>b.onclick=()=>addText('serif',b.dataset.quote));
    $('quick-text').onclick=()=>addText();$('select-tool').onclick=()=>setTool('select');$('hand-tool').onclick=()=>setTool('hand');
    $('undo').onclick=()=>undo();$('redo').onclick=()=>undo(true);$('fit-view').onclick=fitView;$('zoom-value').onclick=fitView;$('zoom-in').onclick=()=>setZoom(zoom*1.2);$('zoom-out').onclick=()=>setZoom(zoom/1.2);
    $('ratio-lock').onclick=()=>{ratioLocked=!ratioLocked;$('ratio-lock').classList.toggle('active',ratioLocked);$('ratio-lock').setAttribute('aria-pressed',ratioLocked);$('ratio-lock').innerHTML=icon(ratioLocked?'lock':'unlock','small');};
    for(const key of ['width','height'])$('canvas-'+key).addEventListener('input',()=>{if(ratioLocked){const other=key==='width'?'height':'width';$('canvas-'+other).value=Math.round(Number($('canvas-'+key).value)*scene[other]/scene[key]);}});
    $('apply-size').onclick=()=>applySize(Number($('canvas-width').value),Number($('canvas-height').value));$('use-photo-size').onclick=usePhotoSize;$('delete-selected-object').onclick=deleteLayer;
    document.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{scene.background=b.dataset.color;commit();});$('background-color').oninput=e=>{scene.background=e.target.value;draw();};$('background-color').onchange=()=>commit();
    $('duplicate-layer').onclick=duplicateLayer;$('delete-layer').onclick=deleteLayer;$('layer-up').onclick=()=>reorder(1);$('layer-down').onclick=()=>reorder(-1);
    $('center-layer').onclick=()=>{const l=current();if(l&&!l.locked){l.x=scene.width/2;l.y=scene.height/2;commit();}};
    $('layer-name').onchange=e=>{const l=current();if(l&&!l.locked){l.name=e.target.value.trim()||'未命名图层';commit();}};
    for(const key of ['x','y','width','height','rotation'])$('layer-'+key).onchange=e=>{
      const l=current();if(!l||l.locked)return;const n=Number(e.target.value);if(!Number.isFinite(n)){refreshSelection();return;}
      let value=C.clamp(n,key==='width'||key==='height'?1:-100000,key==='width'||key==='height'?32768:100000);
      if((key==='width'||key==='height')&&$('layer-ratio').checked){const other=key==='width'?'height':'width',factor=value/l[key];l[other]=C.clamp(l[other]*factor,1,32768);if(l.type==='text')l.fontSize=C.clamp(l.fontSize*factor,4,2000);}
      l[key]=value;commit();
    };
    for(const axis of ['x','y'])$('flip-'+axis).onclick=()=>{const l=current();if(l&&!l.locked){const k=axis==='x'?'flipX':'flipY';l[k]=!l[k];commit();}};
    $('layer-opacity').oninput=e=>{const l=current();if(l&&!l.locked){l.opacity=Number(e.target.value)/100;$('opacity-value').value=e.target.value+'%';e.target.style.setProperty('--range',e.target.value+'%');draw();}};$('layer-opacity').onchange=()=>commit();
    $('text-content').oninput=e=>{const l=current();if(l?.type==='text'&&!l.locked){l.text=e.target.value;draw();clearTimeout(textTimer);textTimer=setTimeout(()=>commit(),600);}};$('text-content').onchange=()=>flushText();
    for(const [id,key] of [['text-font','fontFamily'],['text-align','align'],['text-size','fontSize'],['text-color','color']])$(id).onchange=e=>{const l=current();if(l?.type==='text'&&!l.locked){l[key]=key==='fontSize'?C.clamp(Number(e.target.value)||4,4,2000):e.target.value;commit();}};
    for(const key of ['bold','italic'])$('text-'+key).onclick=()=>{const l=current();if(l?.type==='text'&&!l.locked){l[key]=!l[key];commit();}};
    $('image-filter').onchange=e=>setFilter(e.target.value);$('reset-adjustments').onclick=()=>setFilter('original');
    for(const key of ['brightness','contrast','saturation']){
      $('image-'+key).oninput=e=>{const l=current();if(l?.type==='image'&&!l.locked){l.adjustments={...(l.adjustments||filterPresets.original),[key]:Number(e.target.value)};$(key+'-value').value=e.target.value;$('image-filter').value='custom';e.target.style.setProperty('--range',Number(e.target.value)/2+'%');draw();}};
      $('image-'+key).onchange=()=>commit();
    }
    $('project-name').onchange=e=>{projectName=e.target.value.trim()||'未命名拼贴';e.target.value=projectName;draftSave.change();scheduleSave();};
    $('project-menu-button').onclick=()=>setMenu($('project-menu').hidden);$('save-project').onclick=()=>{setMenu(false);saveProject();};$('open-project').onclick=()=>{setMenu(false);$('project-input').click();};
    $('new-project').onclick=()=>confirmReplace('当前工程会被替换。建议先通过「工程 → 保存工程文件」留一份副本。',()=>newProject());
    $('project-input').onchange=e=>{if(e.target.files[0])openProject(e.target.files[0]);e.target.value='';};
    $('open-export').onclick=openExport;$('download-image').onclick=downloadImage;$('export-format').onchange=refreshExport;$('export-scale').onchange=refreshExport;$('export-quality').oninput=e=>{$('quality-value').value=e.target.value+'%';e.target.style.setProperty('--range',e.target.value+'%');};
    $('download-recovery').onclick=()=>{if(recoveryProject){download(new Blob([JSON.stringify(recoveryProject)],{type:'application/json'}),'贴点-恢复备份.tiedian');setMenu(false);toast('原始工程备份已下载');}};
    $('help-button').onclick=()=>$('help-dialog').showModal();$('confirm-cancel').onclick=()=>$('confirm-dialog').close();$('confirm-accept').onclick=async()=>{const action=confirmation;confirmation=null;$('confirm-dialog').close();try{await action?.();}catch(e){toast(e.message,true);}};
    $('confirm-dialog').addEventListener('close',()=>{confirmation=null;});
    document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
    document.addEventListener('click',e=>{if(!e.target.closest('#project-menu')&&!e.target.closest('#project-menu-button'))setMenu(false);});
    $('mobile-materials').onclick=()=>mobilePanel('materials');$('mobile-canvas').onclick=()=>mobilePanel('canvas');$('mobile-inspector').onclick=()=>mobilePanel('inspector');
    document.querySelector('.brand').onclick=e=>{e.preventDefault();fitView();mobilePanel('canvas');};
    document.addEventListener('keydown',keyboard);document.addEventListener('keyup',e=>{if(e.code==='Space'){spaceDown=false;updateCursor();}});window.addEventListener('blur',()=>{spaceDown=false;updateCursor();});
    window.addEventListener('resize',()=>{if(window.innerWidth>720)mobilePanel('canvas');if(fitMode)fitView();else draw();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){flushText();saveNow();}});
  }
  function applySize(w,h){try{C.validateSize(w,h);flushText();scene=C.resizeScene(scene,w,h,$('scale-content').checked);scene.sizeMode='custom';commit('画布尺寸已更新');fitView();}catch(e){toast(e.message,true);}}
  function flushText(){if(textTimer){clearTimeout(textTimer);textTimer=null;commit();}}
  function setMenu(open){$('project-menu').hidden=!open;$('project-menu-button').setAttribute('aria-expanded',open);}
  function mobilePanel(panel){$('materials-sidebar').classList.toggle('mobile-open',panel==='materials');$('inspector').classList.toggle('mobile-open',panel==='inspector');for(const name of ['materials','canvas','inspector'])$('mobile-'+name).classList.toggle('active',name===panel);}
  function confirmReplace(message,action,{title='确认替换画布？',acceptLabel='继续'}={}){flushText();setMenu(false);confirmation=action;$('confirm-title').textContent=title;$('confirm-accept').textContent=acceptLabel;$('confirm-message').textContent=message;$('confirm-dialog').showModal();}
  function newProject(){contentEpoch++;scene=C.createBlankScene();selected=null;projectName='未命名拼贴';$('project-name').value=projectName;commit('空白画布准备好了');fitView();setMenu(false);}
  function keyboard(e){
    if(document.querySelector('dialog[open]'))return;
    const typing=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable;
    const ctrl=e.ctrlKey||e.metaKey,key=e.key.toLowerCase();
    if(ctrl&&key==='s'){e.preventDefault();saveProject();return;}
    if(typing)return;
    if(ctrl&&key==='z'){e.preventDefault();undo(e.shiftKey);return;}if(ctrl&&key==='y'){e.preventDefault();undo(true);return;}if(ctrl&&key==='d'){e.preventDefault();duplicateLayer();return;}
    if(e.code==='Space'){e.preventDefault();spaceDown=true;updateCursor();return;}
    if(key==='escape'){selectLayer(null);setMenu(false);mobilePanel('canvas');return;}
    if(key==='delete'||key==='backspace'){e.preventDefault();deleteLayer();return;}
    if(key==='v')setTool('select');if(key==='h')setTool('hand');if(key==='t'){e.preventDefault();addText();}if(key==='0')fitView();if(key==='+'||key==='='){e.preventDefault();setZoom(zoom*1.2);}if(key==='-'){e.preventDefault();setZoom(zoom/1.2);}if(key===']')reorder(1);if(key==='[')reorder(-1);
    const l=current();if(l&&!l.locked&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const step=e.shiftKey?10:1;if(e.key==='ArrowUp')l.y-=step;if(e.key==='ArrowDown')l.y+=step;if(e.key==='ArrowLeft')l.x-=step;if(e.key==='ArrowRight')l.x+=step;commit();}
  }
  function projectData(){return C.packProject(scene,projectName);}
  function safeFilename(name){return (name||'我的拼贴').replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').trim().slice(0,60)||'我的拼贴';}
  function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);}
  function saveProject(){flushText();try{download(new Blob([JSON.stringify(projectData())],{type:'application/json'}),safeFilename(projectName)+'.tiedian');toast('工程文件已下载，下次打开可以接着贴。');}catch(e){toast('工程保存失败，请先减少一些大图片',true);}}
  async function openProject(file){
    try{
      if(file.size>100*1024*1024)throw new Error('工程文件过大，请控制在 100 MB 以内');
      const data=JSON.parse(await file.text()),next=C.validateProject(data);await R.prepare(next);
      confirmReplace('打开工程会替换当前画布。当前内容也可以通过撤销找回。',()=>{contentEpoch++;scene=hydratePhotoState(next);refreshLibrary();selected=null;projectName=String(data.name||'打开的拼贴').slice(0,40);$('project-name').value=projectName;commit('工程已打开，接着创作吧。');fitView();});
    }catch(e){toast(e instanceof SyntaxError?'工程文件内容有误，请选择 .tiedian 文件':e.message,true);}
  }
  function exportSize(){const scale=Number($('export-scale').value);return C.validateSize(Math.round(scene.width*scale),Math.round(scene.height*scale));}
  async function openExport(){
    flushText();try{await R.prepare(scene);const small=document.createElement('canvas');const scale=Math.min(300/scene.width,180/scene.height,1);small.width=Math.round(scene.width*scale);small.height=Math.round(scene.height*scale);const p=small.getContext('2d');p.scale(scale,scale);R.drawScene(p,scene);$('export-preview-image').src=small.toDataURL('image/png');small.width=small.height=1;$('export-name').value=projectName;$('export-scale').value='1';refreshExport();$('export-dialog').showModal();}catch(e){toast('预览生成失败：'+e.message,true);}
  }
  function refreshExport(){
    const format=$('export-format').value;$('quality-control').hidden=format==='image/png';$('export-transparent-note').textContent=format==='image/jpeg'?'无水印 · 透明处转为白色':scene.background==='transparent'?'无水印 · 保留透明':'无水印 · 高清原图';
    try{const size=exportSize();$('export-dimensions').textContent=`${size.width} × ${size.height} px`;document.querySelector('.export-summary').classList.remove('error');$('download-image').disabled=false;}catch(e){$('export-dimensions').textContent=e.message;document.querySelector('.export-summary').classList.add('error');$('download-image').disabled=true;}
  }
  async function downloadImage(){
    const button=$('download-image');button.disabled=true;const previous=button.innerHTML;button.textContent='正在把喜欢存下来…';let out;
    try{
      const size=exportSize(),format=$('export-format').value;await R.prepare(scene);out=document.createElement('canvas');out.width=size.width;out.height=size.height;const output=out.getContext('2d');if(!output)throw new Error('内存不足，请降低导出倍率');output.scale(size.width/scene.width,size.height/scene.height);R.drawScene(output,scene,{flatten:format==='image/jpeg'});
      const blob=await new Promise((resolve,reject)=>out.toBlob(b=>b?resolve(b):reject(new Error('浏览器未能生成图片，请降低分辨率后重试')),format,Number($('export-quality').value)/100));
      const ext={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'}[blob.type];if(!ext)throw new Error('当前浏览器不支持此图片格式');
      download(blob,safeFilename($('export-name').value)+'.'+ext);$('export-dialog').close();toast(`保存好了！${size.width} × ${size.height}，没有水印。`);
    }catch(e){toast(e.message||'导出失败，请降低分辨率后重试',true);}finally{if(out){out.width=1;out.height=1;}button.innerHTML=previous;button.disabled=false;}
  }
  function openDB(){return new Promise((resolve,reject)=>{if(!window.indexedDB){reject(new Error('当前浏览器不支持自动保存'));return;}const req=indexedDB.open('tiedian-local-workspace',1);req.onupgradeneeded=()=>req.result.createObjectStore('projects');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(new Error('自动保存被其他窗口占用'));});}
  function scheduleSave(){clearTimeout(saveTimer);$('save-state').innerHTML='<i></i> 正在保存…';saveTimer=setTimeout(saveNow,850);}
  async function saveNow(){
    clearTimeout(saveTimer);saveTimer=null;if(!initialized||!draftSave.canSave)return;
    if(!db){$('save-state').textContent='请通过「工程」保存文件';return;}
    if(autoSaveBlocked){$('save-state').textContent='原工程已保留，请手动保存新工程';return;}
    const savingRevision=draftSave.revision;
    try{const data=projectData();if(lastDraft&&!draftBackedUp){const emptyDraft=lastDraft.scene&&Array.isArray(lastDraft.scene.layers)&&lastDraft.scene.layers.length===0;if(!emptyDraft||!previousDraft){await writeStored('previous',lastDraft);previousDraft=lastDraft;$('restore-previous').hidden=false;}draftBackedUp=true;}await new Promise((resolve,reject)=>{const tx=db.transaction('projects','readwrite');tx.objectStore('projects').put(data,'current');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});draftSave.markSaved(savingRevision);if(savingRevision===draftSave.revision)$('save-state').innerHTML='<i></i> 已自动保存在本地';}
    catch(e){$('save-state').textContent='未能自动保存，请另存工程';}
  }
  function readStored(key){return new Promise((resolve,reject)=>{const req=db.transaction('projects').objectStore('projects').get(key);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
  function writeStored(key,data){return new Promise((resolve,reject)=>{const tx=db.transaction('projects','readwrite');tx.objectStore('projects').put(data,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
  async function restore(){
    try{
      db=await openDB();recoveryProject=await readStored('recovery');if(recoveryProject)$('download-recovery').hidden=false;
      lastDraft=await readStored('current');previousDraft=await readStored('previous');$('restore-draft').hidden=!lastDraft;$('restore-previous').hidden=!previousDraft;
    }catch(e){if(db)autoSaveBlocked=true;}finally{draftSave.finishLoading();}
  }
  async function init(){
    bindEvents();renderStickers();switchPanel('photos');initialized=true;history.push(snapshot());refresh();fitView();document.documentElement.dataset.ready='true';
    await restore();
    if(draftSave.dirty)scheduleSave();
    else $('save-state').innerHTML=lastDraft?'<i></i> 空白画布 · 可恢复上次工程':'<i></i> 空白画布 · 本地处理';
  }
  init();
})();
