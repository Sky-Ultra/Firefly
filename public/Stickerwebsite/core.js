(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EditorCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  function clone(value) {
    if (Array.isArray(value)) return value.map(clone);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,clone(item)]));
    return value;
  }
  function equal(a,b) {
    if(a===b)return true;
    if(!a||!b||typeof a!=='object'||typeof b!=='object')return false;
    const keys=Object.keys(a);
    return keys.length===Object.keys(b).length && keys.every(key=>Object.hasOwn(b,key)&&equal(a[key],b[key]));
  }
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  function validateSize(width, height) {
    width = Number(width); height = Number(height);
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 8192 || height > 8192) throw new Error('宽高需为 1–8192 之间的整数');
    if (width * height > 32000000) throw new Error('画布总像素不能超过 3200 万，请适当减小宽高');
    return { width, height };
  }
  function resizeScene(scene, width, height, scaleContent) {
    validateSize(width, height);
    const copy = clone(scene);
    if (scaleContent) {
      const sx = width / scene.width, sy = height / scene.height;
      copy.layers.forEach(l => {
        l.x = clamp(l.x*sx,-100000,100000); l.y = clamp(l.y*sy,-100000,100000); l.width = clamp(l.width*sx,1,32768); l.height = clamp(l.height*sy,1,32768);
        if (l.type === 'text') l.fontSize = clamp(l.fontSize*Math.min(sx,sy),4,2000);
      });
    }
    copy.width = Number(width); copy.height = Number(height);
    return copy;
  }
  function createBlankScene(width=1080,height=1350){validateSize(width,height);return {width,height,background:'#ffffff',sizeMode:'photo',basePhotoId:null,layers:[]};}
  function clearScene(scene){const next={...scene,layers:[]};if(Object.hasOwn(next,'basePhotoId'))next.basePhotoId=null;return next;}
  function fitCanvasToPhoto(scene,id,width,height){
    validateSize(width,height);const next=clone(scene);const photo=next.layers.find(l=>l.id===id&&l.type==='image');
    if(!photo)throw new Error('请先选择一张照片');
    const scale=Math.min(width/scene.width,height/scene.height);
    next.layers=next.layers.map(l=>{
      if(l.id===id)return constrainLayer({...l,role:'photo',photoWidth:width,photoHeight:height,x:width/2,y:height/2,width,height,rotation:0});
      return constrainLayer({...l,x:width/2+(l.x-scene.width/2)*scale,y:height/2+(l.y-scene.height/2)*scale,width:l.width*scale,height:l.height*scale,...(l.type==='text'?{fontSize:l.fontSize*scale}:{})});
    });
    next.width=width;next.height=height;next.sizeMode='photo';next.basePhotoId=id;return next;
  }
  function addPhotoToScene(scene,layer,width,height){
    validateSize(width,height);const next=clone(scene),photo=constrainLayer({...layer,role:'photo',assetId:layer.assetId||layer.id,photoWidth:width,photoHeight:height});
    const hasPrimary=next.layers.some(l=>l.id===next.basePhotoId&&l.type==='image');
    const follow=next.sizeMode!=='custom'&&!hasPrimary;
    if(follow)next.layers.unshift(photo);else next.layers.push(photo);
    if(follow)return fitCanvasToPhoto(next,photo.id,width,height);
    if(!hasPrimary)next.basePhotoId=photo.id;return next;
  }
  function removeSceneLayers(scene,ids){
    const next=clone(scene),deleted=new Set(ids);next.layers=next.layers.filter(l=>!deleted.has(l.id));
    if(deleted.has(next.basePhotoId)){
      next.basePhotoId=null;const photo=next.layers.find(l=>l.type==='image'&&l.role==='photo');
      if(photo){next.basePhotoId=photo.id;if(next.sizeMode==='photo'&&Number.isInteger(photo.photoWidth)&&Number.isInteger(photo.photoHeight))return fitCanvasToPhoto(next,photo.id,photo.photoWidth,photo.photoHeight);}
    }
    return next;
  }
  function removePhotoAsset(scene,assetId){
    if(typeof assetId!=='string'||!assetId)return clone(scene);
    return removeSceneLayers(scene,scene.layers.filter(l=>l.type==='image'&&l.role==='photo'&&l.assetId===assetId).map(l=>l.id));
  }
  function previewDimensions(width,height,zoom,dpr) {
    const scale=Math.min(zoom*Math.min(dpr||1,2),2400/Math.max(width,height));
    return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};
  }
  function toLocal(layer, point) {
    const a = -(layer.rotation || 0) * Math.PI / 180;
    const dx = point.x - layer.x, dy = point.y - layer.y;
    return { x: dx * Math.cos(a) - dy * Math.sin(a), y: dx * Math.sin(a) + dy * Math.cos(a) };
  }
  function toWorld(layer, point) {
    const a = (layer.rotation || 0) * Math.PI / 180;
    return { x: layer.x + point.x*Math.cos(a)-point.y*Math.sin(a), y:layer.y+point.x*Math.sin(a)+point.y*Math.cos(a) };
  }
  function hitTest(layer, point) {
    if (layer.visible === false) return false;
    const local = toLocal(layer,point);
    return Math.abs(local.x) <= layer.width/2 && Math.abs(local.y) <= layer.height/2;
  }
  function moveLayer(layers, id, delta) {
    const next = layers.slice(), i = next.findIndex(l=>l.id===id);
    if (i < 0) return next;
    const j = clamp(i+delta,0,next.length-1);
    const [layer] = next.splice(i,1); next.splice(j,0,layer); return next;
  }
  class DraftSaveTracker {
    constructor(){this.revision=0;this.savedRevision=0;this.ready=false;}
    change(){return ++this.revision;}
    get dirty(){return this.revision>this.savedRevision;}
    get canSave(){return this.ready&&this.dirty;}
    finishLoading(){this.ready=true;}
    markSaved(revision){if(Number.isInteger(revision))this.savedRevision=Math.max(this.savedRevision,Math.min(revision,this.revision));}
  }
  class History {
    constructor(limit=40) { this.limit=limit; this.entries=[]; this.index=-1; }
    push(value) {
      const snapshot = clone(value);
      if (equal(this.entries[this.index], snapshot)) return false;
      this.entries = this.entries.slice(0,this.index+1);
      this.entries.push(snapshot);
      if (this.entries.length > this.limit) this.entries.shift();
      this.index = this.entries.length-1; return true;
    }
    replaceCurrent(value){if(this.index<0)return this.push(value);this.entries[this.index]=clone(value);}
    undo() { if (!this.canUndo) return null; return clone(this.entries[--this.index]); }
    redo() { if (!this.canRedo) return null; return clone(this.entries[++this.index]); }
    get canUndo() { return this.index > 0; }
    get canRedo() { return this.index < this.entries.length-1; }
  }
  const MAX_IMAGE_DATA_LENGTH=64000000, MAX_PROJECT_ASSET_BYTES=90000000;
  function constrainLayer(layer){
    const next={...layer};
    for(const [key,min,max,fallback] of [['x',-100000,100000,0],['y',-100000,100000,0],['width',1,32768,1],['height',1,32768,1],['rotation',-360000,360000,0],['opacity',0,1,1]])next[key]=clamp(Number.isFinite(next[key])?next[key]:fallback,min,max);
    if(next.type==='text')next.fontSize=clamp(Number.isFinite(next.fontSize)?next.fontSize:24,4,2000);
    return next;
  }
  function assetBytes(scene){return [...new Set(scene.layers.filter(l=>l.type==='image').map(l=>l.src))].reduce((total,src)=>total+src.length,0);}
  function packProject(scene,name){
    const clean=validateProject({version:1,scene});const assets={},references=new Map();
    clean.layers=clean.layers.map(l=>{
      if(l.type!=='image')return l;
      if(!references.has(l.src)){const key='a'+references.size;references.set(l.src,key);assets[key]=l.src;}
      return {...l,src:'asset:'+references.get(l.src)};
    });
    return {app:'tiedian',version:1,name:String(name||'我的拼贴').slice(0,40),scene:clean,assets};
  }
  function validateProject(project) {
    if (!project || project.version !== 1 || !project.scene) throw new Error('这不是有效的贴点工程文件（版本 1）');
    const s = project.scene; validateSize(s.width,s.height);
    if (!/^(transparent|#[\da-f]{6}|#[\da-f]{3})$/i.test(s.background)) throw new Error('工程背景颜色无效');
    if (!Array.isArray(s.layers) || s.layers.length > 150) throw new Error('工程最多支持 150 个图层');
    const ids = new Set();
    const layers = s.layers.map(l=> {
      if (!l || !['image','text'].includes(l.type) || typeof l.id !== 'string' || l.id.length>100 || ids.has(l.id)) throw new Error('工程图层数据无效');
      ids.add(l.id);
      for (const k of ['x','y','width','height','rotation','opacity']) if (!Number.isFinite(l[k])) throw new Error('工程包含无效的图层数值');
      if (Math.abs(l.x)>100000 || Math.abs(l.y)>100000 || l.width<1 || l.height<1 || l.width>32768 || l.height>32768 || l.opacity<0 || l.opacity>1 || Math.abs(l.rotation)>360000) throw new Error('工程图层数值超出范围');
      const base = {id:l.id,type:l.type,name:String(l.name||'图层').slice(0,100),x:l.x,y:l.y,width:l.width,height:l.height,rotation:l.rotation,opacity:l.opacity,visible:l.visible!==false,locked:!!l.locked,flipX:!!l.flipX,flipY:!!l.flipY};
      if (l.type==='image') {
        const source=typeof l.src==='string'&&l.src.startsWith('asset:')&&project.assets&&Object.hasOwn(project.assets,l.src.slice(6))?project.assets[l.src.slice(6)]:l.src;
        if (typeof source!=='string' || !/^data:image\/(png|jpeg|webp|gif);base64,[a-z\d+/=\s]+$/i.test(source) || source.length>MAX_IMAGE_DATA_LENGTH) throw new Error('工程图片格式无效，请使用嵌入的图片');
        base.src=source;
        if(l.role!==undefined){if(!['photo','sticker'].includes(l.role))throw new Error('图片用途无效');base.role=l.role;}
        if(l.assetId!==undefined){if(typeof l.assetId!=='string'||l.assetId.length>100||!l.assetId)throw new Error('照片标识无效');base.assetId=l.assetId;}
        if(l.photoWidth!==undefined||l.photoHeight!==undefined){validateSize(l.photoWidth,l.photoHeight);base.photoWidth=Number(l.photoWidth);base.photoHeight=Number(l.photoHeight);}
        if(l.adjustments){
          if(typeof l.adjustments!=='object'||Array.isArray(l.adjustments))throw new Error('图片调色数据无效');
          base.adjustments={};
          for(const [key,fallback,max] of [['brightness',100,200],['contrast',100,200],['saturation',100,200],['grayscale',0,100],['sepia',0,100]]){
            const value=l.adjustments[key]??fallback;
            if(!Number.isFinite(value)||value<0||value>max)throw new Error('图片调色数值超出范围');
            base.adjustments[key]=value;
          }
        }
      } else {
        if (typeof l.text!=='string' || l.text.length>3000 || !Number.isFinite(l.fontSize) || l.fontSize<4 || l.fontSize>2000 || !/^#[\da-f]{6}$/i.test(l.color)) throw new Error('工程文字数据无效');
        Object.assign(base,{text:l.text,fontSize:l.fontSize,color:l.color,fontFamily:['sans','serif','mono','hand'].includes(l.fontFamily)?l.fontFamily:'sans',bold:!!l.bold,italic:!!l.italic,align:['left','center','right'].includes(l.align)?l.align:'center'});
      }
      return base;
    });
    if(assetBytes({layers})>MAX_PROJECT_ASSET_BYTES)throw new Error('工程素材过大，请减少大图片后再保存');
    const sizeMode=['photo','custom'].includes(s.sizeMode)?s.sizeMode:'custom';
    const basePhotoId=typeof s.basePhotoId==='string'&&layers.some(l=>l.type==='image'&&l.role!=='sticker'&&l.id===s.basePhotoId)?s.basePhotoId:null;
    return {width:Number(s.width),height:Number(s.height),background:s.background,sizeMode,basePhotoId,layers};
  }
  return {MAX_IMAGE_DATA_LENGTH,MAX_PROJECT_ASSET_BYTES,constrainLayer,assetBytes,packProject,createBlankScene,clearScene,fitCanvasToPhoto,addPhotoToScene,removePhotoAsset,removeSceneLayers,clone,clamp,validateSize,resizeScene,previewDimensions,toLocal,toWorld,hitTest,moveLayer,DraftSaveTracker,History,validateProject};
});
