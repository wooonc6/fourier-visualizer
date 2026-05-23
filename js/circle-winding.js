// 섹션 2: 원에 감기
function initCircleWinding() {
  let sigFreq = 3;
  let windFreq = 1;
  let animTime = 0;

  const sigFreqSlider  = document.getElementById('sig-freq');
  const windFreqSlider = document.getElementById('wind-freq');
  const sigFreqVal     = document.getElementById('sig-freq-val');
  const windFreqVal    = document.getElementById('wind-freq-val');
  const matchIndicator = document.getElementById('match-indicator');

  sigFreqSlider.addEventListener('input', () => {
    sigFreq = parseFloat(sigFreqSlider.value);
    sigFreqVal.textContent = sigFreq + ' Hz';
    checkMatch();
  });

  windFreqSlider.addEventListener('input', () => {
    windFreq = parseFloat(windFreqSlider.value);
    windFreqVal.textContent = windFreq.toFixed(1) + ' Hz';
    checkMatch();
  });

  function checkMatch() {
    const isMatch = Math.abs(sigFreq - windFreq) < 0.15;
    matchIndicator.classList.toggle('hidden', !isMatch);
  }

  function computeCOM(sf, wf) {
    const T = 2;
    const N = 400;
    const dt = T / N;
    let cx = 0, cy = 0;
    for (let k = 0; k < N; k++) {
      const t = k * dt;
      const r = 1 + 0.7 * Math.sin(2 * Math.PI * sf * t);
      const angle = -2 * Math.PI * wf * t;
      cx += r * Math.cos(angle);
      cy += r * Math.sin(angle);
    }
    return { x: cx / N, y: cy / N };
  }

  const sketch = (p) => {
    const W = 880, H = 340;
    const halfW = W / 2;

    p.setup = () => {
      const cnv = p.createCanvas(W, H);
      cnv.parent('winding-canvas');
      p.frameRate(60);
    };

    p.draw = () => {
      p.background(9, 13, 18);

      // --- LEFT: circle winding ---
      p.push();
      p.translate(halfW / 2, H / 2);

      const R = 85;
      // guide circle
      p.noFill();
      p.stroke(40, 48, 60);
      p.strokeWeight(1);
      p.ellipse(0, 0, R * 2, R * 2);

      // wound curve
      const T = 2;
      const N = 500;
      const dt = T / N;
      const pts = [];
      for (let k = 0; k < N; k++) {
        const t = k * dt;
        const r = R * (1 + 0.7 * Math.sin(2 * Math.PI * sigFreq * t));
        const angle = -2 * Math.PI * windFreq * t;
        pts.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) });
      }

      p.stroke(88, 166, 255, 160);
      p.strokeWeight(1.5);
      p.noFill();
      p.beginShape();
      pts.forEach(pt => p.vertex(pt.x, pt.y));
      p.endShape();

      // center of mass
      const com = computeCOM(sigFreq, windFreq);
      const comX = com.x * R * 0.48;
      const comY = com.y * R * 0.48;

      // line from origin to COM
      p.stroke(248, 81, 73, 180);
      p.strokeWeight(1.5);
      p.line(0, 0, comX, comY);

      // COM dot
      p.noStroke();
      p.fill(248, 81, 73);
      p.ellipse(comX, comY, 12, 12);

      // origin dot
      p.fill(140, 149, 158);
      p.ellipse(0, 0, 5, 5);

      // label
      p.noStroke();
      p.fill(140, 149, 158);
      p.textSize(11);
      p.textAlign(p.CENTER);
      p.text('질량 중심', comX, comY - 10);

      p.pop();

      // --- RIGHT: time-domain signal ---
      p.push();
      p.translate(halfW, 0);

      const midY = H / 2;
      const xScale = halfW;
      const duration = 2;

      // axis
      p.stroke(30, 36, 44);
      p.strokeWeight(1);
      p.line(0, midY, xScale, midY);

      // signal
      p.stroke(88, 166, 255);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      for (let px = 0; px < xScale; px++) {
        const t = (px / xScale) * duration;
        const y = midY - 0.7 * (H * 0.38) * Math.sin(2 * Math.PI * sigFreq * t);
        p.vertex(px, y);
      }
      p.endShape();

      // time cursor
      const cursorX = ((animTime % duration) / duration) * xScale;
      p.stroke(255, 255, 255, 120);
      p.strokeWeight(1);
      p.line(cursorX, 0, cursorX, H);

      // label
      p.noStroke();
      p.fill(140, 149, 158);
      p.textSize(11);
      p.textAlign(p.CENTER);
      p.text(`신호: ${sigFreq} Hz`, xScale / 2, 18);
      p.text(`감기: ${windFreq.toFixed(1)} Hz`, xScale / 2, 32);

      p.pop();

      // divider
      p.stroke(48, 54, 61);
      p.strokeWeight(1);
      p.line(halfW, 20, halfW, H - 20);

      animTime += 0.02;
    };
  };

  new p5(sketch);
}
