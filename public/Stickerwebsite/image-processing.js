(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ImageProcessing=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const MAX_PIXELS=2048*2048;
  function validate(data,width,height){
    if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width*height>MAX_PIXELS)throw new Error('去白底图片需在 2048×2048 像素以内');
    if(!(data instanceof Uint8ClampedArray||data instanceof Uint8Array)||data.length!==width*height*4)throw new Error('图片像素数据无效');
  }
  function hasTransparentBorder(data,width,height){
    validate(data,width,height);let total=0,transparent=0;
    function inspect(x,y){total++;if(data[(y*width+x)*4+3]<245)transparent++;}
    for(let x=0;x<width;x++){inspect(x,0);if(height>1)inspect(x,height-1);}
    for(let y=1;y<height-1;y++){inspect(0,y);if(width>1)inspect(width-1,y);}
    return transparent/total>=.85;
  }
  function removeWhiteBackground(source,width,height,options={}){
    validate(source,width,height);
    const tolerance=Math.max(1,Math.min(120,Number.isFinite(options.tolerance)?options.tolerance:32));
    const softness=Math.max(1,Math.min(tolerance,Number.isFinite(options.softness)?options.softness:8));
    const preserveInterior=options.preserveInterior!==false;
    const count=width*height,mask=new Uint8Array(count),data=new Uint8ClampedArray(source);
    const chromaLimit=tolerance*.6+8;
    for(let i=0;i<count;i++){
      const p=i*4,min=Math.min(source[p],source[p+1],source[p+2]),max=Math.max(source[p],source[p+1],source[p+2]);
      if(source[p+3]>8&&(255-min>tolerance||max-min>chromaLimit))mask[i]=2;
    }
    if(preserveInterior){
      const queue=new Int32Array(count);let head=0,tail=0;
      function add(i){if(mask[i]===0){mask[i]=1;queue[tail++]=i;}}
      for(let x=0;x<width;x++){add(x);add((height-1)*width+x);}
      for(let y=1;y<height-1;y++){add(y*width);add(y*width+width-1);}
      while(head<tail){const i=queue[head++],x=i%width;if(x>0)add(i-1);if(x<width-1)add(i+1);if(i>=width)add(i-width);if(i<count-width)add(i+width);}
    }else for(let i=0;i<count;i++)if(mask[i]===0)mask[i]=1;
    let changedPixels=0;
    for(let i=0;i<count;i++){
      if(mask[i]!==1)continue;const p=i*4,oldAlpha=source[p+3];if(oldAlpha===0)continue;
      const distance=255-Math.min(source[p],source[p+1],source[p+2]);
      const t=Math.max(0,Math.min(1,(distance-(tolerance-softness))/softness));
      const coverage=oldAlpha<=8?0:t*t*(3-2*t),alpha=Math.round(oldAlpha*coverage);
      if(alpha===oldAlpha)continue;changedPixels++;data[p+3]=alpha;
      if(alpha===0){data[p]=data[p+1]=data[p+2]=0;}
      else if(coverage>.01)for(let c=0;c<3;c++)data[p+c]=Math.max(0,Math.min(255,Math.round((source[p+c]-255*(1-coverage))/coverage)));
    }
    return {data,changedPixels,totalPixels:count};
  }
  return {MAX_PIXELS,hasTransparentBorder,removeWhiteBackground};
});
