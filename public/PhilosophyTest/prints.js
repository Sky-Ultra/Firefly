/* Three small editorial plates, drawn locally at the resolution of the screen. */
(() => {
  "use strict";
  let unmount = () => {};
  const hover = matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  function drawPlate(canvas, amount) {
    const size = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(300 * size), height = Math.round(230 * size);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(width / 300, 0, 0, height / 230, 0, 0);
    ctx.clearRect(0, 0, 300, 230);
    const ink = "#3d3933";
    ctx.lineWidth = 1.25;
    ctx.lineJoin = "round";
    function path(points, color, fill) {
      ctx.beginPath();
      points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
      if (fill) { ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
      if (color) { ctx.strokeStyle = color; ctx.stroke(); }
    }
    function ellipse(x,y,a,b,stroke,fill,rotation=0) {
      ctx.beginPath(); ctx.ellipse(x,y,a,b,rotation,0,Math.PI*2);
      if (fill) { ctx.fillStyle=fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle=stroke; ctx.stroke(); }
    }
    const kind = canvas.dataset.print;
    if (kind === "freedom") {
      // Two intersecting flights, in an oblique architectural projection.
      const proj = (x,y,z) => [150 + x*14 - y*11, 171 + x*5.3 + y*6.7 - z*11.5];
      const face = (p,c) => path(p.map(v=>proj(...v)),ink,c);
      const step = (x,y,z,w,d) => {
        face([[x,y+d,0],[x+w,y+d,0],[x+w,y+d,z],[x,y+d,z]], "#bfa16e");
        face([[x+w,y,0],[x+w,y+d,0],[x+w,y+d,z],[x+w,y,z]], "#806c4e");
        face([[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z]], "#f5e9c9");
        ctx.lineWidth=.55;
        for(let a=.2; a<w; a+=.23)path([proj(x+a,y+d,.12),proj(x+a,y+d,z-.12)],"#816d52");
        ctx.lineWidth=1.25;
      };
      for(let i=0;i<8;i++) step(-4,i-5,9-i+amount*(8-i)*.09,3,1);
      for(let i=0;i<6;i++) step(i-1,2,2+i+amount*(i+1)*.15,1,2);
      const sunX = 227 - amount * 12, sunY = 49 - amount * 10;
      ellipse(sunX,sunY,20,20,null,"#a75c37");
      path([[sunX-20,sunY],[sunX+25,sunY]],"#c9ad88");
    } else if (kind === "justice") {
      const green="#385548",pale="#cbd1b7";
      path([[148,184],[151,32],[154,184]],ink,ink);
      path([[112,190],[148,179],[184,190],[171,195],[124,195]],ink,green);
      const angle = amount * .135;
      function pivot(x,y) {
        const dx=x-151, dy=y-63;
        return [151+dx*Math.cos(angle)-dy*Math.sin(angle),63+dx*Math.sin(angle)+dy*Math.cos(angle)];
      }
      path([[56,78],[237,45],[236,49],[57,82]].map(p=>pivot(...p)),ink,green);
      ellipse(151,63,4,4,ink,pale);
      [[65,79,124,40],[228,47,93,36]].forEach(([startX,startY,bottom,r])=>{
        const [x,y] = pivot(startX,startY);
        const end = bottom + y - startY;
        path([[x-r,end],[x,y],[x+r,end]],ink);
        ctx.beginPath();ctx.moveTo(x-r,end);ctx.bezierCurveTo(x-r*.7,end+25,x+r*.7,end+25,x+r,end);ctx.closePath();ctx.fillStyle=green;ctx.fill();ctx.strokeStyle=ink;ctx.stroke();
        ellipse(x,end,r,4.5,ink,pale);
        ctx.lineWidth=.6;
        for(let i=-r+3;i<r-2;i+=3.4)path([[x+i,end+5],[x+i*.83,end+16*(1-(i/r)**2)]],pale);
        ctx.lineWidth=1.25;
      });
      const [panX,panY]=pivot(228,47);
      ellipse(panX-14,panY+35,8,8,ink,"#73836a");ellipse(panX+4,panY+33,11,11,ink,"#62755d");
    } else {
      // Meridian lines on a folded, hollow torus.
      const cos = Math.cos(amount*.29), sin = Math.sin(amount*.29);
      const mesh=(u,v)=>{
        const r=55+21*Math.cos(v), x=r*Math.cos(u), y=r*Math.sin(u), z=21*Math.sin(v)+14*Math.sin(2*u);
        const turnedX = x * cos - y * sin, turnedY = x * sin + y * cos;
        const px=turnedX*.91-turnedY*.17+z*.35,py=turnedX*.22+turnedY*.40-z*.95;
        return [148+px*1.35,125+py*1.35];
      };
      for(let i=0;i<79;i++){
        const u=i/79*Math.PI*2;
        const curve=Array.from({length:85},(_,j)=>mesh(u,j/84*Math.PI*2));
        path(curve,"#554567");
      }
      ctx.lineWidth=.65;
      for(let i=0;i<12;i++)path(Array.from({length:121},(_,j)=>mesh(j/120*Math.PI*2,i*Math.PI/6)),"#776489");
      ellipse(228-amount*6,63-amount*5,7,7,null,"#655079");
    }
  }

  window.drawPrints = function drawPrints() {
    unmount();
    const lifetime = new AbortController();
    const cleanups = [];
    unmount = () => { lifetime.abort(); cleanups.forEach(stop => stop()); };
    const options = {signal:lifetime.signal, passive:true};
    document.querySelectorAll("canvas[data-print]").forEach(canvas => {
      const button = canvas.closest(".plate");
      drawPlate(canvas, 0);
      if (!button) return;
      let amount = 0, target = 0, frame = 0, previous = 0;
      function stop() { cancelAnimationFrame(frame); frame = 0; }
      cleanups.push(stop);
      function tick(now) {
        if (!canvas.isConnected) { stop(); return; }
        // The printed lines only need to be redrawn while the plate is settling.
        const elapsed = now - previous;
        if (elapsed >= 30) {
          previous = now;
          amount += (target - amount) * (1 - Math.exp(-Math.min(elapsed,70)/95));
          if (Math.abs(target - amount) < .004) amount = target;
          drawPlate(canvas, amount);
        }
        frame = amount === target ? 0 : requestAnimationFrame(tick);
      }
      function aim(value) {
        target = value;
        if (!frame && target !== amount) { previous = performance.now()-30; frame = requestAnimationFrame(tick); }
      }
      button.addEventListener("pointerenter", e => {
        if (!reduced.matches && hover.matches && e.pointerType !== "touch") aim(1);
      }, options);
      button.addEventListener("pointerleave", () => aim(0), options);
      reduced.addEventListener("change", () => {
        if (reduced.matches) { stop(); amount = target = 0; drawPlate(canvas, 0); }
      }, options);
    });
  };
})();