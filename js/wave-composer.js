const WAVE_COLORS = ['#58a6ff', '#3fb950', '#e3b341', '#f85149', '#bc8cff'];

let composerWaves = [
  { freq: 3, amp: 0.6 },
  { freq: 5, amp: 0.4 },
];

function initWaveComposer() {
  const sketch = (p) => {
    let t = 0;

    p.setup = () => {
      const parent = document.getElementById('composer-canvas');
      const W = parent.offsetWidth || 800;
      const cnv = p.createCanvas(W, 240);
      cnv.parent('composer-canvas');
      p.frameRate(60);
    };

    p.windowResized = () => {
      const parent = document.getElementById('composer-canvas');
      p.resizeCanvas(parent.offsetWidth, 240);
    };

    p.draw = () => {
      const W = p.width, H = p.height;
      p.background(9, 13, 18);
      const midY = H / 2;
      const duration = 2;

      // grid
      p.stroke(25, 32, 42);
      p.strokeWeight(1);
      p.line(0, midY, W, midY);
      p.line(0, midY - H * 0.38, W, midY - H * 0.38);
      p.line(0, midY + H * 0.38, W, midY + H * 0.38);

      // individual waves
      composerWaves.forEach((wave, i) => {
        const col = p.color(WAVE_COLORS[i % WAVE_COLORS.length]);
        col.setAlpha(100);
        p.stroke(col);
        p.strokeWeight(1.5);
        p.noFill();
        p.beginShape();
        for (let px = 0; px < W; px++) {
          const sec = (px / W) * duration + t;
          const y = midY - wave.amp * (H * 0.34) * Math.sin(2 * Math.PI * wave.freq * sec);
          p.vertex(px, y);
        }
        p.endShape();

        // legend dot
        p.noStroke();
        const lcol = p.color(WAVE_COLORS[i % WAVE_COLORS.length]);
        lcol.setAlpha(200);
        p.fill(lcol);
        p.ellipse(10, 14 + i * 16, 8, 8);
        p.fill(200, 210, 220);
        p.textSize(10);
        p.textAlign(p.LEFT);
        p.text(`${wave.freq} Hz`, 20, 18 + i * 16);
      });

      // combined wave
      const maxA = composerWaves.reduce((a, w) => a + w.amp, 0) || 1;
      p.stroke(230, 237, 243);
      p.strokeWeight(2.5);
      p.noFill();
      p.beginShape();
      for (let px = 0; px < W; px++) {
        const sec = (px / W) * duration + t;
        const sum = composerWaves.reduce((acc, w) => acc + w.amp * Math.sin(2 * Math.PI * w.freq * sec), 0);
        const y = midY - (sum / maxA) * (H * 0.34);
        p.vertex(px, y);
      }
      p.endShape();

      // "합성 파형" label
      p.noStroke();
      p.fill(230, 237, 243, 180);
      p.textSize(10);
      p.textAlign(p.RIGHT);
      p.text('합성 파형 (흰색)', W - 8, 14);

      t += 0.016;
    };
  };

  new p5(sketch);
  renderWaveList();
  setupComposerControls();
}

function renderWaveList() {
  const list = document.getElementById('wave-list');
  list.innerHTML = '';
  composerWaves.forEach((wave, i) => {
    const color = WAVE_COLORS[i % WAVE_COLORS.length];
    const div = document.createElement('div');
    div.className = 'wave-item';
    div.innerHTML = `
      <div class="wave-color-dot" style="background:${color}"></div>
      <div class="wave-sliders">
        <label>주파수 <input type="range" min="1" max="10" step="0.5" value="${wave.freq}" data-i="${i}" data-prop="freq" /><span>${wave.freq} Hz</span></label>
        <label>진폭&nbsp;&nbsp; <input type="range" min="0.1" max="1" step="0.05" value="${wave.amp}" data-i="${i}" data-prop="amp" /><span>${wave.amp.toFixed(2)}</span></label>
      </div>
      <button class="wave-remove" data-i="${i}">✕</button>`;
    list.appendChild(div);
  });

  list.querySelectorAll('input[type="range"]').forEach(el => {
    el.addEventListener('input', e => {
      const i = +e.target.dataset.i, prop = e.target.dataset.prop;
      composerWaves[i][prop] = parseFloat(e.target.value);
      e.target.nextElementSibling.textContent = prop === 'freq' ? `${composerWaves[i].freq} Hz` : composerWaves[i].amp.toFixed(2);
      updateComposerInterp();
    });
  });

  list.querySelectorAll('.wave-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      composerWaves.splice(+e.target.dataset.i, 1);
      renderWaveList();
      updateComposerInterp();
    });
  });
}

function updateComposerInterp() {
  const el = document.getElementById('composer-interp-text');
  if (!el) return;
  const n = composerWaves.length;
  if (n === 0) {
    el.textContent = '파형이 없습니다. 파형 추가 버튼을 눌러 사인파를 추가해보세요.';
    return;
  }
  const freqs = composerWaves.map(w => `${w.freq} Hz`).join(', ');
  const desc = n === 1
    ? `현재 ${freqs} 순수 사인파 하나만 있습니다. 흰색 선과 파란 선이 거의 겹칩니다. 파형을 하나 더 추가해보세요.`
    : `현재 ${freqs}의 사인파 ${n}개가 합쳐진 상태입니다. 각 색깔 선은 순수한 사인파이고, 흰색 굵은 선이 마이크가 실제로 기록하는 합성 파형입니다. 이 흰색 선만 보고서 원래 ${n}개의 주파수를 어떻게 알아낼 수 있을까요? — 그것이 바로 푸리에 변환이 하는 일입니다.`;
  el.textContent = desc;
}

function setupComposerControls() {
  document.getElementById('add-wave').addEventListener('click', () => {
    if (composerWaves.length >= 5) return;
    composerWaves.push({ freq: Math.floor(Math.random() * 7) + 1, amp: 0.5 });
    renderWaveList();
    updateComposerInterp();
  });
  document.getElementById('reset-waves').addEventListener('click', () => {
    composerWaves = [{ freq: 3, amp: 0.6 }, { freq: 5, amp: 0.4 }];
    renderWaveList();
    updateComposerInterp();
  });
  updateComposerInterp();
}
