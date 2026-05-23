const SPEC_COLORS = ['#58a6ff', '#3fb950', '#e3b341', '#f85149', '#bc8cff'];

let specWaves = [
  { freq: 2, amp: 0.5 },
  { freq: 5, amp: 0.7 },
];
let specScanning = false;
let specScanFreq = 0;
let specHistory  = [];

function computeSpecMag(waves, wf) {
  const T = 4, N = 600, dt = T / N;
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
    const maxFreq = 10;

    p.setup = () => {
      const parent = document.getElementById('spectrum-canvas');
      const W = parent.offsetWidth || 800;
      const cnv = p.createCanvas(W, 300);
      cnv.parent('spectrum-canvas');
      p.frameRate(60);
    };

    p.windowResized = () => {
      const parent = document.getElementById('spectrum-canvas');
      p.resizeCanvas(parent.offsetWidth, 300);
    };

    p.draw = () => {
      const W = p.width, H = p.height;
      const topH = 110;
      const specTop = topH + 8;
      const specH = H - specTop - 24;
      const axLeft = 44;
      const axW = W - axLeft - 12;

      p.background(9, 13, 18);

      // ===== TOP: signal =====
      const midY = topH / 2;
      p.stroke(22, 30, 42); p.strokeWeight(1);
      p.line(0, midY, W, midY);

      const dur = 2;
      specWaves.forEach((wave, i) => {
        const col = p.color(SPEC_COLORS[i % SPEC_COLORS.length]);
        col.setAlpha(90); p.stroke(col); p.strokeWeight(1.3); p.noFill();
        p.beginShape();
        for (let px = 0; px < W; px++) {
          const t = (px / W) * dur;
          p.vertex(px, midY - wave.amp * (topH * 0.4) * Math.sin(2 * Math.PI * wave.freq * t));
        }
        p.endShape();
      });

      const maxA = specWaves.reduce((a, w) => a + w.amp, 0) || 1;
      p.stroke(230, 237, 243); p.strokeWeight(2); p.noFill();
      p.beginShape();
      for (let px = 0; px < W; px++) {
        const t = (px / W) * dur;
        const sum = specWaves.reduce((acc, w) => acc + w.amp * Math.sin(2 * Math.PI * w.freq * t), 0);
        p.vertex(px, midY - (sum / maxA) * (topH * 0.4));
      }
      p.endShape();

      p.stroke(36, 44, 56); p.strokeWeight(1);
      p.line(0, topH, W, topH);

      // ===== BOTTOM: spectrum =====
      // axes
      p.stroke(44, 54, 66); p.strokeWeight(1);
      p.line(axLeft, specTop, axLeft, specTop + specH);
      p.line(axLeft, specTop + specH, W - 12, specTop + specH);

      // freq tick labels
      p.noStroke(); p.fill(80, 95, 115); p.textSize(9); p.textAlign(p.CENTER);
      for (let f = 0; f <= maxFreq; f += 1) {
        const x = axLeft + (f / maxFreq) * axW;
        p.text(f, x, specTop + specH + 14);
        p.stroke(28, 36, 46); p.strokeWeight(0.5);
        p.line(x, specTop, x, specTop + specH);
        p.noStroke();
      }
      p.textAlign(p.RIGHT); p.fill(60, 75, 95); p.textSize(9);
      p.text('Hz', axLeft - 2, specTop + specH + 14);
      p.textAlign(p.LEFT); p.text('|강도|', axLeft + 2, specTop - 3);

      // scan line
      if (specScanning && specScanFreq <= maxFreq) {
        const sx = axLeft + (specScanFreq / maxFreq) * axW;
        p.stroke(255, 200, 50, 200); p.strokeWeight(1.5);
        p.line(sx, specTop, sx, specTop + specH);
      }

      // magnitude bars
      const normFactor = 0.28;
      specHistory.forEach(pt => {
        const x = axLeft + (pt.freq / maxFreq) * axW;
        const bh = Math.min((pt.magnitude / normFactor) * specH, specH);
        const ratio = Math.min(pt.magnitude / normFactor, 1);
        const r = p.lerp(80, 248, ratio);
        const g = p.lerp(166, 81, ratio);
        const b = p.lerp(255, 73, ratio);
        p.stroke(r, g, b, 200); p.strokeWeight(2.2);
        p.line(x, specTop + specH, x, specTop + specH - bh);
      });

      // advance scan
      if (specScanning) {
        const step = 0.06;
        if (specScanFreq <= maxFreq) {
          const mag = computeSpecMag(specWaves, specScanFreq);
          specHistory.push({ freq: specScanFreq, magnitude: mag });
          specScanFreq += step;
        } else {
          specScanning = false;
          document.getElementById('spec-scan').textContent = '▶ 다시 스캔';
          document.getElementById('spec-scan').style.background = '';
          updateSpectrumInterp(true);
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
        <label>주파수 <input type="range" min="1" max="10" step="0.5" value="${wave.freq}" data-i="${i}" data-prop="freq" /><span>${wave.freq} Hz</span></label>
        <label>진폭&nbsp;&nbsp; <input type="range" min="0.1" max="1" step="0.05" value="${wave.amp}" data-i="${i}" data-prop="amp" /><span>${wave.amp.toFixed(2)}</span></label>
      </div>
      <button class="wave-remove" data-i="${i}">✕</button>`;
    list.appendChild(div);
  });

  list.querySelectorAll('input[type="range"]').forEach(el => {
    el.addEventListener('input', e => {
      const i = +e.target.dataset.i, prop = e.target.dataset.prop;
      specWaves[i][prop] = parseFloat(e.target.value);
      e.target.nextElementSibling.textContent = prop === 'freq' ? `${specWaves[i].freq} Hz` : specWaves[i].amp.toFixed(2);
      specHistory = [];
      updateSpectrumInterp(false);
    });
  });

  list.querySelectorAll('.wave-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      specWaves.splice(+e.target.dataset.i, 1);
      specHistory = [];
      renderSpecWaveList();
      updateSpectrumInterp(false);
    });
  });
}

function updateSpectrumInterp(done) {
  const el = document.getElementById('spectrum-interp-text');
  if (!el) return;
  if (!done) {
    const freqs = specWaves.map(w => `${w.freq} Hz`).join(', ');
    el.textContent = `스캔 시작을 누르면, 감기 주파수를 0 Hz에서 10 Hz까지 자동으로 높이면서 각 지점에서 질량 중심의 크기를 측정합니다. 현재 신호는 ${freqs}로 구성되어 있으므로, 스캔 후 그 주파수들에서 스파이크가 나타날 것입니다.`;
    return;
  }
  // find peaks
  if (specHistory.length === 0) return;
  const maxMag = Math.max(...specHistory.map(p => p.magnitude));
  const threshold = maxMag * 0.5;
  const peaks = [];
  for (let i = 1; i < specHistory.length - 1; i++) {
    const prev = specHistory[i - 1].magnitude;
    const curr = specHistory[i].magnitude;
    const next = specHistory[i + 1].magnitude;
    if (curr > threshold && curr >= prev && curr >= next) {
      peaks.push(specHistory[i].freq.toFixed(1));
    }
  }
  const peakStr = peaks.length > 0 ? peaks.join(' Hz, ') + ' Hz' : '검출 없음';
  el.innerHTML = `스캔 완료! 스파이크가 발생한 주파수: <strong style="color:#58a6ff">${peakStr}</strong>. 이 주파수들이 원래 신호에 포함된 성분입니다. 파형을 바꿔서 다시 스캔하면 결과가 달라지는 것을 확인할 수 있습니다.`;
}

function setupSpecControls() {
  document.getElementById('spec-add-wave').addEventListener('click', () => {
    if (specWaves.length >= 5) return;
    specWaves.push({ freq: Math.floor(Math.random() * 7) + 1, amp: 0.5 });
    specHistory = [];
    renderSpecWaveList();
    updateSpectrumInterp(false);
  });

  document.getElementById('spec-scan').addEventListener('click', () => {
    if (specScanning) return;
    specHistory = [];
    specScanFreq = 0;
    specScanning = true;
    document.getElementById('spec-scan').textContent = '⏳ 스캔 중...';
    document.getElementById('spec-scan').style.background = '#e3b341';
    const el = document.getElementById('spectrum-interp-text');
    if (el) el.textContent = '스캔 진행 중... 노란색 선이 0 Hz에서 10 Hz로 이동하면서 각 주파수의 강도를 측정하고 있습니다.';
  });

  document.getElementById('spec-reset').addEventListener('click', () => {
    specWaves = [{ freq: 2, amp: 0.5 }, { freq: 5, amp: 0.7 }];
    specHistory = [];
    specScanning = false;
    specScanFreq = 0;
    document.getElementById('spec-scan').textContent = '▶ 스캔 시작';
    document.getElementById('spec-scan').style.background = '';
    renderSpecWaveList();
    updateSpectrumInterp(false);
  });

  updateSpectrumInterp(false);
}
