function initCircleWinding() {
  let sigFreq  = 3;
  let windFreq = 1;

  const sigFreqSlider  = document.getElementById('sig-freq');
  const windFreqSlider = document.getElementById('wind-freq');
  const sigFreqVal     = document.getElementById('sig-freq-val');
  const windFreqVal    = document.getElementById('wind-freq-val');

  sigFreqSlider.addEventListener('input', () => {
    sigFreq = parseFloat(sigFreqSlider.value);
    sigFreqVal.textContent = sigFreq + ' Hz';
    updateWindingInterp(sigFreq, windFreq);
  });
  windFreqSlider.addEventListener('input', () => {
    windFreq = parseFloat(windFreqSlider.value);
    windFreqVal.textContent = windFreq.toFixed(1) + ' Hz';
    updateWindingInterp(sigFreq, windFreq);
  });

  function computeCOM(sf, wf) {
    const T = 3, N = 600, dt = T / N;
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
    let animT = 0;

    p.setup = () => {
      const parent = document.getElementById('winding-canvas');
      const W = parent.offsetWidth || 800;
      const cnv = p.createCanvas(W, 300);
      cnv.parent('winding-canvas');
      p.frameRate(60);
    };

    p.windowResized = () => {
      const parent = document.getElementById('winding-canvas');
      p.resizeCanvas(parent.offsetWidth, 300);
    };

    p.draw = () => {
      const W = p.width, H = p.height;
      const halfW = Math.floor(W / 2);
      p.background(9, 13, 18);

      // divider
      p.stroke(40, 50, 62);
      p.strokeWeight(1);
      p.line(halfW, 16, halfW, H - 16);

      // ===== LEFT: circle winding =====
      p.push();
      p.translate(halfW / 2, H / 2);

      const R = Math.min(halfW, H) * 0.33;

      // guide circle
      p.noFill(); p.stroke(35, 44, 56); p.strokeWeight(1);
      p.ellipse(0, 0, R * 2, R * 2);
      // axes
      p.stroke(30, 40, 52); p.strokeWeight(0.7);
      p.line(-R * 1.2, 0, R * 1.2, 0);
      p.line(0, -R * 1.2, 0, R * 1.2);

      // wound curve
      const T = 3, N = 500, dt = T / N;
      p.stroke(88, 166, 255, 150); p.strokeWeight(1.5); p.noFill();
      p.beginShape();
      for (let k = 0; k < N; k++) {
        const t = k * dt;
        const r = R * (1 + 0.7 * Math.sin(2 * Math.PI * sigFreq * t));
        const angle = -2 * Math.PI * windFreq * t;
        p.vertex(r * Math.cos(angle), r * Math.sin(angle));
      }
      p.endShape();

      // COM
      const com = computeCOM(sigFreq, windFreq);
      const isMatch = Math.abs(sigFreq - windFreq) < 0.2;
      const comX = com.x * R * 0.45;
      const comY = com.y * R * 0.45;
      const comDist = Math.sqrt(comX * comX + comY * comY);

      p.stroke(248, 81, 73, 160); p.strokeWeight(1.5);
      p.line(0, 0, comX, comY);

      p.noStroke();
      p.fill(248, 81, 73);
      p.ellipse(comX, comY, isMatch ? 14 : 10, isMatch ? 14 : 10);
      if (isMatch) {
        p.fill(248, 81, 73, 60);
        p.ellipse(comX, comY, 26, 26);
      }

      p.fill(120, 130, 145); p.ellipse(0, 0, 5, 5);

      // label
      p.noStroke(); p.fill(140, 149, 158); p.textSize(10); p.textAlign(p.CENTER);
      p.text('질량 중심', comX, comY - 12);
      p.textAlign(p.LEFT); p.textSize(10);
      p.fill(88, 166, 255, 180);
      p.text(`신호: ${sigFreq} Hz`, -R * 1.15, -R - 8);
      p.fill(227, 179, 65, 180);
      p.text(`감기: ${windFreq.toFixed(1)} Hz`, -R * 1.15, -R + 6);

      p.pop();

      // ===== RIGHT: time-domain signal =====
      p.push();
      p.translate(halfW, 0);
      const midY = H / 2;
      const duration = 2;

      p.stroke(25, 32, 42); p.strokeWeight(1);
      p.line(0, midY, halfW, midY);

      p.stroke(88, 166, 255); p.strokeWeight(2); p.noFill();
      p.beginShape();
      for (let px = 0; px < halfW; px++) {
        const t = (px / halfW) * duration;
        const y = midY - 0.7 * (H * 0.36) * Math.sin(2 * Math.PI * sigFreq * t);
        p.vertex(px, y);
      }
      p.endShape();

      // current time cursor
      const cursorX = ((animT % duration) / duration) * halfW;
      p.stroke(255, 255, 255, 80); p.strokeWeight(1);
      p.line(cursorX, 20, cursorX, H - 20);

      // label
      p.noStroke(); p.fill(140, 149, 158); p.textSize(10); p.textAlign(p.CENTER);
      p.text('시간 도메인 신호', halfW / 2, H - 8);
      p.pop();

      animT += 0.018;
    };
  };

  new p5(sketch);
  updateWindingInterp(sigFreq, windFreq);
}

function updateWindingInterp(sigFreq, windFreq) {
  const el = document.getElementById('winding-interp-text');
  if (!el) return;
  const diff = Math.abs(sigFreq - windFreq);
  if (diff < 0.2) {
    el.innerHTML = `<span class="match-text">✓ 일치!</span> 감기 주파수(${windFreq.toFixed(1)} Hz) = 신호 주파수(${sigFreq} Hz). 모든 봉우리가 오른쪽 방향으로 쏠리면서 질량 중심(빨간 점)이 원점에서 멀리 튀어나왔습니다. 이것이 푸리에 변환이 특정 주파수를 '발견'하는 핵심 순간입니다.`;
  } else if (diff < 1) {
    el.textContent = `감기 주파수(${windFreq.toFixed(1)} Hz)가 신호 주파수(${sigFreq} Hz)에 가깝지만 아직 일치하지 않습니다. 질량 중심이 약간 이동했지만 크지 않습니다. 더 정확하게 맞춰보세요.`;
  } else {
    el.textContent = `감기 주파수(${windFreq.toFixed(1)} Hz)와 신호 주파수(${sigFreq} Hz)가 다릅니다. 파형의 봉우리들이 원 전체에 고루 퍼지면서 질량 중심(빨간 점)이 원점 근처에 머뭅니다. 감기 주파수 슬라이더를 ${sigFreq} Hz로 맞춰보세요.`;
  }
}
