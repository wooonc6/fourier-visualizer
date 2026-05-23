// 섹션 1: 파형 합성기
const WAVE_COLORS = ['#58a6ff', '#3fb950', '#d29922', '#f85149', '#bc8cff'];

let composerWaves = [
  { freq: 3, amp: 0.6 },
];

function initWaveComposer() {
  const sketch = (p) => {
    let t = 0;
    const W = 880, H = 260;

    p.setup = () => {
      const cnv = p.createCanvas(W, H);
      cnv.parent('composer-canvas');
      p.frameRate(60);
    };

    p.draw = () => {
      p.background(9, 13, 18);

      const midY = H / 2;
      const xScale = W;
      const duration = 2; // seconds shown

      // draw grid
      p.stroke(30, 36, 44);
      p.strokeWeight(1);
      p.line(0, midY, W, midY);
      for (let f = 0; f <= 10; f++) {
        const x = (f / duration / 10) * W;
        p.line(x, 0, x, H);
      }

      // draw individual waves
      composerWaves.forEach((wave, i) => {
        const col = p.color(WAVE_COLORS[i % WAVE_COLORS.length]);
        col.setAlpha(120);
        p.stroke(col);
        p.strokeWeight(1.5);
        p.noFill();
        p.beginShape();
        for (let px = 0; px < W; px++) {
          const sec = (px / W) * duration + t;
          const y = midY - wave.amp * (H * 0.38) * Math.sin(2 * Math.PI * wave.freq * sec);
          p.vertex(px, y);
        }
        p.endShape();
      });

      // draw combined wave
      p.stroke(230, 237, 243);
      p.strokeWeight(2.5);
      p.noFill();
      p.beginShape();
      for (let px = 0; px < W; px++) {
        const sec = (px / W) * duration + t;
        const sum = composerWaves.reduce((acc, w) => acc + w.amp * Math.sin(2 * Math.PI * w.freq * sec), 0);
        const maxAmp = composerWaves.reduce((acc, w) => acc + w.amp, 0) || 1;
        const y = midY - (sum / maxAmp) * (H * 0.38);
        p.vertex(px, y);
      }
      p.endShape();

      t += 0.015;
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
        <label>주파수 <input type="range" min="1" max="10" step="0.5" value="${wave.freq}" data-i="${i}" data-prop="freq" />
          <span>${wave.freq} Hz</span>
        </label>
        <label>진폭 <input type="range" min="0.1" max="1" step="0.05" value="${wave.amp}" data-i="${i}" data-prop="amp" />
          <span>${wave.amp.toFixed(2)}</span>
        </label>
      </div>
      <button class="wave-remove" data-i="${i}" title="제거">✕</button>
    `;
    list.appendChild(div);
  });

  list.querySelectorAll('input[type="range"]').forEach(el => {
    el.addEventListener('input', (e) => {
      const i = +e.target.dataset.i;
      const prop = e.target.dataset.prop;
      composerWaves[i][prop] = parseFloat(e.target.value);
      e.target.nextElementSibling.textContent = prop === 'freq'
        ? `${composerWaves[i].freq} Hz`
        : composerWaves[i].amp.toFixed(2);
    });
  });

  list.querySelectorAll('.wave-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = +e.target.dataset.i;
      composerWaves.splice(i, 1);
      renderWaveList();
    });
  });
}

function setupComposerControls() {
  document.getElementById('add-wave').addEventListener('click', () => {
    if (composerWaves.length >= 5) return;
    composerWaves.push({ freq: Math.floor(Math.random() * 5) + 2, amp: 0.5 });
    renderWaveList();
  });

  document.getElementById('reset-waves').addEventListener('click', () => {
    composerWaves = [{ freq: 3, amp: 0.6 }];
    renderWaveList();
  });
}
