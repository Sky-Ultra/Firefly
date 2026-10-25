'use strict';
window.EditorRenderer = (() => {
  const fonts = {sans:'"Microsoft YaHei", "PingFang SC", Arial, sans-serif',serif:'"Noto Serif SC", "Songti SC", SimSun, Georgia, serif',mono:'"Courier New", "Microsoft YaHei", monospace',hand:'Georgia, "KaiTi", "STKaiti", serif'};
  const cache = new Map();
  function loadImage(src) {
    if (cache.has(src)) return cache.get(src);
    const pending = new Promise((resolve,reject)=>{
      const image=new Image();
      image.onload=()=>{cache.set(src,image);resolve(image);};
      image.onerror=()=>{cache.delete(src);reject(new Error('图片无法读取，请换一张 PNG、JPG 或 WebP 图片'));};
      image.src=src;
    });
    cache.set(src,pending);return pending;
  }
  async function prepare(scene) { await Promise.all(scene.layers.filter(l=>l.type==='image').map(l=>loadImage(l.src))); }
  async function rasterize(src,max=8192) {
    const image=await loadImage(src);
    let ratio=Math.min(1,max/Math.max(image.naturalWidth,image.naturalHeight),Math.sqrt(32000000/(image.naturalWidth*image.naturalHeight)));
    const canvas=document.createElement('canvas');let data,width,height;
    try{
      while(true){
        width=Math.max(1,Math.floor(image.naturalWidth*ratio));height=Math.max(1,Math.floor(image.naturalHeight*ratio));
        canvas.width=width;canvas.height=height;
        const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(image,0,0,width,height);
        const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('图片过大，浏览器暂时无法处理，请先缩小后重试')),'image/png'));
        if(blob.size*4/3+64<=EditorCore.MAX_IMAGE_DATA_LENGTH){
          data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('图片读取失败'));reader.readAsDataURL(blob);});
          break;
        }
        ratio*=.8;
      }
      await loadImage(data);if(src!==data)cache.delete(src);
      return {src:data,width,height,reduced:ratio<1};
    }finally{canvas.width=1;canvas.height=1;}
  }
  async function makeCutout(src,options={}){
    const image=await loadImage(src),scale=Math.min(1,2048/Math.max(image.naturalWidth,image.naturalHeight));
    const width=Math.max(1,Math.round(image.naturalWidth*scale)),height=Math.max(1,Math.round(image.naturalHeight*scale));
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
    try{
      const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0,width,height);
      const pixels=context.getImageData(0,0,width,height);
      if(options.skipTransparent&&ImageProcessing.hasTransparentBorder(pixels.data,width,height))return {src,width:image.naturalWidth,height:image.naturalHeight,changedPixels:0,skipped:true,reduced:false};
      await new Promise(resolve=>setTimeout(resolve,0));
      const result=ImageProcessing.removeWhiteBackground(pixels.data,width,height,options);
      if(!result.changedPixels)return {src,width:image.naturalWidth,height:image.naturalHeight,changedPixels:0,totalPixels:width*height,reduced:false};
      context.putImageData(new ImageData(result.data,width,height),0,0);
      const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('去白底结果生成失败，请换一张较小的图片')),'image/png'));
      const output=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('去白底结果读取失败'));reader.readAsDataURL(blob);});
      return {src:output,width,height,changedPixels:result.changedPixels,totalPixels:result.totalPixels,reduced:scale<1};
    }finally{canvas.width=canvas.height=1;}
  }
  function lines(ctx,text,maxWidth) {
    const result=[];
    for(const paragraph of text.split('\n')) {
      if (!paragraph) {result.push('');continue;}
      let line='';
      for(const char of Array.from(paragraph)) {
        if (line && ctx.measureText(line+char).width>maxWidth) {result.push(line);line=char;} else line+=char;
      }
      result.push(line);
    }
    return result;
  }
  function drawScene(ctx,scene,options={}) {
    ctx.save();
    ctx.clearRect(0,0,scene.width,scene.height);
    if (scene.background!=='transparent' || options.flatten) {
      ctx.fillStyle=scene.background==='transparent'?'#ffffff':scene.background;ctx.fillRect(0,0,scene.width,scene.height);
    }
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    for(const layer of scene.layers) {
      if(layer.visible===false)continue;
      ctx.save();ctx.globalAlpha=layer.opacity;ctx.translate(layer.x,layer.y);ctx.rotate(layer.rotation*Math.PI/180);ctx.scale(layer.flipX?-1:1,layer.flipY?-1:1);
      if(layer.type==='image') {
        const a=layer.adjustments;
        if(a)ctx.filter=`brightness(${a.brightness}%) contrast(${a.contrast}%) saturate(${a.saturation}%) grayscale(${a.grayscale}%) sepia(${a.sepia}%)`;
        const image=cache.get(layer.src);
        if(image instanceof HTMLImageElement)ctx.drawImage(image,-layer.width/2,-layer.height/2,layer.width,layer.height);
      } else if(layer.type==='text') {
        ctx.fillStyle=layer.color;ctx.textAlign=layer.align||'center';ctx.textBaseline='top';
        ctx.font=`${layer.italic?'italic ':''}${layer.bold?'700':'400'} ${layer.fontSize}px ${fonts[layer.fontFamily]||fonts.sans}`;
        const wrapped=lines(ctx,layer.text,Math.max(1,layer.width));
        const lh=layer.fontSize*1.3;const y=-Math.min(layer.height,wrapped.length*lh)/2;
        const x=layer.align==='left'?-layer.width/2:layer.align==='right'?layer.width/2:0;
        ctx.beginPath();ctx.rect(-layer.width/2,-layer.height/2,layer.width,layer.height);ctx.clip();
        wrapped.forEach((line,i)=>ctx.fillText(line,x,y+i*lh,layer.width));
      }
      ctx.restore();
    }
    ctx.restore();
  }
  return {fonts,cache,loadImage,prepare,rasterize,makeCutout,drawScene};
})();
