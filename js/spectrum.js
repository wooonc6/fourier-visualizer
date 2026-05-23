// 섹션 3: 주파수 스펙트럼
const SPEC_COLORS = ['#58a6ff', '#3fb950', '#d29922', '#f85149', '#bc8cff'];

let specWaves = [
  { freq: 2, amp: 0.5 },
  { freq: 5, amp: 0.7 },
];

let specScanning = false;
let specScanFreq = 0;
let specHistory = []; // { freq, magnitude }

function computeSpecCOM(waves, wf) {
  const T = 4;
  const N = 600;
  const dt = T / N;
  let cx = 0, cy = 0;
  for (let k = 0; k < N; k++) {
    const t = k * dt;
    const sig = waves.reduce((acc, w) => acc + w.amp * Math.sin(2 * Math.PI * w.freq * t), 0);
    const angle = -2 * Math.PI * wf * t;
    cx += sig * Math.cos(angle);
    cy += sig * Math.sin(angle);
  }
  return Math.sqrt((cx / N) ** 2 + (cy / N) ** 2);
}

function initSpectrum() {
  const sketch = (p) => {
    const W = 880, H = 340;
    const topH = 130, bottomH = H - topH - 10;

    p.setup = () => {
      const cnv = p.createCanvas(W, H);
      cnv.parent('spectrum-canvas');
      p.frameRate(60);
    };

    p.draw = () => {
      p.background(9, 13, 18);

      // --- TOP: signal waveform ---
      const midY = topH / 2;
      p.stroke(30, 36, 44);
      p.strokeWeight(1);
      p.line(0, midY, W, midY);

      const duration = 2;
      specWaves.forEach((wave, i) => {
        const col = p.color(SPEC_COLORS[i % SPEC_COLORS.length]);
        col.setAlpha(100);
        p.stroke(col);
        p.strokeWeight(1.2);
        p.noFill();
        p.beginShape();
        for (let px = 0; px < W; px++) {
          const t = (px / W) * duration;
          const y = midY - wave.amp * (topH * 0.42) * Math.sin(2 * Math.PI * wave.freq * t);
          p.vertex(px, y);
        }
        p.endShape();
      });

      p.stroke(230, 237, 243);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      const maxA = specWaves.reduce((a, w) => a + w.amp, 0) || 1;
      for (let px = 0; px < W; px++) {
        const t = (px / W) * duration;
        const sum = specWaves.reduce((acc, w) => acc + w.amp * Math.sin(2 * Math.PI * w.freq * t), 0);
        const y = midY - (sum / maxA) * (topH * 0.42);
        p.vertex(px, y);
      }
      p.endShape();

      p.stroke(48, 54, 61);
      p.strokeWeight(1);
      p.line(0, topH, W, topH);

      // --- BOTTOM: spectrum ---
      const specTop = topH + 10;
      const specMid = specTop + bottomH;
      const maxFreq = 10;

      // axes
      p.stroke(48, 54, 61);
      p.strokeWeight(1);
      p.line(40, specTop, 40, specMid);
      p.line(40, specMid, W - 10, specMid);

      // freq labels
      p.noStroke();
      p.fill(90, 100, 120);
      p.textSize(10);
      p.textAlign(p.CENTER);
      for (let f = 0; f <= maxFreq; f++) {
        const x = 40 + ((f / maxFreq) * (W - 50));
        p.text(f, x, specMid + 14);
      }
      p.textAlign(p.RIGHT);
      p.text('Hz', 40, specTop - 4);

      // current scan line
      if (specScanning) {
        const scanX = 40 + (specScanFreq / maxFreq) * (W - 50);
        p.stroke(255, 200, 0, 180);
        p.strokeWeight(1.5);
        p.line(scanX, specTop, scanX, specMid);
      }

      // magnitude bars
      const maxMag = 0.35;
      specHistory.forEach(pt => {
        const x = 40 + (pt.freq / maxFreq) * (W - 50);
        const barH = Math.min((pt.magnitude / maxMag) * (bottomH - 20), bottomH - 20);
        const ratio = Math.min(pt.magnitude / maxMag, 1);
        const r = p.lerp(88, 248, ratio);
        const g = p.lerp(166, 81, ratio);
        const b = p.lerp(255, 73, ratio);
        p.stroke(r, g, b);
        p.strokeWeight(2);
        p.line(x, specMid, x, specMid - barH);
      });

      // advance scan
      if (specScanning) {
        const mag = computeSpecCOM(specWaves, specScanFreq);
        specHistory.push({ freq: specScanFreq, magnitude: mag });
        specScanFreq += 0.05;
        if (specScanFreq > maxFreq) {
          specScanning = false;
          specScanFreq = 0;
          document.getElementById('spec-scan').textContent = '▶ 스캔 시작';
          document.getElementById('spec-scan').style.background = '';
        }
      }
    };
  };

  new p5(sketch);
  renderSpecWaveList();
  setupSpecControls();
}

function renderSpecWaveList() {
  const list = document.getElementById('spec-wave-list');
  list.innerHTML = '';
  specWaves.forEach((wave, i) => {
    const color = SPEC_COLORS[i % SPEC_COLORS.length];
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
      specWaves[i][prop] = parseFloat(e.target.value);
      e.target.nextElementSibling.textContent = prop === 'freq'
        ? `${specWaves[i].freq} Hz`
        : specWaves[i].amp.toFixed(2);
      specHistory = [];
    });
  });

  list.querySelectorAll('.wave-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = +e.target.dataset.i;
      specWaves.splice(i, 1);
      specHistory = [];
      renderSpecWaveList();
    });
  });
}

function setupSpecControls() {
  document.getElementById('spec-add-wave').addEventListener('click', () => {
    if (specWaves.length >= 5) return;
    specWaves.push({ freq: Math.floor(Math.random() * 6) + 1, amp: 0.5 });
    specHistory = [];
    renderSpecWaveList();
  });

  document.getElementById('spec-scan').addEventListener('click', () => {
    if (specScanning) return;
    specHistory = [];
    specScanFreq = 0;
    specScanning = true;
    document.getElementById('spec-scan').textContent = '⏳ 스캔 중...';
    document.getElementById('spec-scan').style.background = '#d29922';
  });

  document.getElementById('spec-reset').addEventListener('click', () => {
    specWaves = [{ freq: 2, amp: 0.5 }, { freq: 5, amp: 0.7 }];
    specHistory = [];
    specScanning = false;
    specScanFreq = 0;
    document.getElementById('spec-scan').textContent = '▶ 스캔 시작';
    document.getElementById('spec-scan').style.background = '';
    renderSpecWaveList();
  });
}
