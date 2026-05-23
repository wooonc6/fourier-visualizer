// ── O() 성장 곡선 ──────────────────────────────────────────────
function initComplexityChart() {
  let nMax = 256;
  const slider = document.getElementById('n-max');
  const valEl  = document.getElementById('n-max-val');

  slider.addEventListener('input', () => {
    nMax = +slider.value;
    valEl.textContent = nMax;
    updateComplexityInterp(nMax);
  });

  const sketch = (p) => {
    p.setup = () => {
      const parent = document.getElementById('complexity-canvas');
      p.createCanvas(parent.offsetWidth || 800, 240).parent('complexity-canvas');
      p.frameRate(30);
    };
    p.windowResized = () => {
      p.resizeCanvas(document.getElementById('complexity-canvas').offsetWidth, 240);
    };
    p.draw = () => {
      const W = p.width, H = p.height;
      const pad = { l: 52, r: 16, t: 16, b: 28 };
      const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;
      p.background(9, 13, 18);

      const maxY = nMax * nMax;
      const toX = (n) => pad.l + (n / nMax) * cW;
      const toY = (v) => pad.t + cH - Math.min(v / maxY, 1) * cH;

      // grid
      p.stroke(22, 30, 42); p.strokeWeight(1);
      for (let i = 0; i <= 4; i++) {
        const y = pad.t + (i / 4) * cH;
        p.line(pad.l, y, pad.l + cW, y);
      }
      // axes
      p.stroke(44, 54, 66); p.strokeWeight(1);
      p.line(pad.l, pad.t, pad.l, pad.t + cH);
      p.line(pad.l, pad.t + cH, pad.l + cW, pad.t + cH);

      // x labels
      p.noStroke(); p.fill(70, 85, 105); p.textSize(9); p.textAlign(p.CENTER);
      [0, 0.25, 0.5, 0.75, 1].forEach(r => {
        p.text(Math.round(r * nMax), pad.l + r * cW, pad.t + cH + 14);
      });

      const curves = [
        { label: 'O(N)',       fn: n => n,                col: [63, 185, 80]  },
        { label: 'O(N log N)', fn: n => n * Math.log2(n), col: [88, 166, 255] },
        { label: 'O(N²)',      fn: n => n * n,            col: [248, 81, 73]  },
      ];

      curves.forEach(({ fn, col }) => {
        p.stroke(col[0], col[1], col[2]); p.strokeWeight(2); p.noFill();
        p.beginShape();
        for (let px = 0; px <= cW; px++) {
          const n = (px / cW) * nMax;
          if (n < 1) continue;
          p.vertex(pad.l + px, toY(fn(n)));
        }
        p.endShape();
      });

      // legend
      curves.forEach(({ label, col }, i) => {
        p.stroke(col[0], col[1], col[2]); p.strokeWeight(2);
        p.line(pad.l + 8, pad.t + 12 + i * 16, pad.l + 22, pad.t + 12 + i * 16);
        p.noStroke(); p.fill(col[0], col[1], col[2]);
        p.textSize(10); p.textAlign(p.LEFT);
        p.text(label, pad.l + 26, pad.t + 16 + i * 16);
      });
    };
  };
  new p5(sketch);
  updateComplexityInterp(nMax);
}

function updateComplexityInterp(nMax) {
  const el = document.getElementById('complexity-interp');
  if (!el) return;
  const n2 = nMax * nMax;
  const nlogn = Math.round(nMax * Math.log2(nMax));
  const ratio = (n2 / nlogn).toFixed(1);
  el.textContent = `N = ${nMax}일 때: O(N²) = ${n2.toLocaleString()}번, O(N log N) = ${nlogn.toLocaleString()}번. O(N²)이 O(N log N)보다 약 ${ratio}배 더 많은 연산이 필요합니다. N이 커질수록 이 격차는 기하급수적으로 벌어집니다.`;
}

// ── DFT 연산 카운터 ────────────────────────────────────────────
function initDFTCounter() {
  const nValues = [4, 8, 16, 32, 64, 128, 256, 512, 1024];
  let idx = 5; // 64

  const slider = document.getElementById('dft-n');
  const valEl  = document.getElementById('dft-n-val');

  slider.max = nValues.length - 1;
  slider.value = idx;
  valEl.textContent = nValues[idx];

  slider.addEventListener('input', () => {
    idx = +slider.value;
    valEl.textContent = nValues[idx];
    updateDFTInterp(nValues[idx]);
  });

  const sketch = (p) => {
    p.setup = () => {
      const parent = document.getElementById('dft-counter-canvas');
      p.createCanvas(parent.offsetWidth || 800, 180).parent('dft-counter-canvas');
      p.frameRate(30);
    };
    p.windowResized = () => {
      p.resizeCanvas(document.getElementById('dft-counter-canvas').offsetWidth, 180);
    };
    p.draw = () => {
      const W = p.width, H = p.height;
      p.background(9, 13, 18);
      const n = nValues[idx];
      const ops = n * n;

      // bar
      const barW = Math.min(W * 0.6, 400);
      const barH = 36;
      const barX = (W - barW) / 2;
      const barY = H / 2 - barH / 2 - 20;
      const maxOps = 1024 * 1024;
      const fillW = (ops / maxOps) * barW;

      p.noStroke();
      p.fill(30, 36, 46);
      p.rect(barX, barY, barW, barH, 6);
      p.fill(248, 81, 73);
      p.rect(barX, barY, Math.max(fillW, 4), barH, 6);

      // label
      p.fill(230, 237, 243); p.noStroke();
      p.textSize(20); p.textAlign(p.CENTER);
      p.text(`N² = ${ops.toLocaleString()}번`, W / 2, barY + barH + 28);
      p.fill(140, 149, 158); p.textSize(12);
      p.text(`N = ${n}`, W / 2, barY - 8);
    };
  };
  new p5(sketch);
  updateDFTInterp(nValues[idx]);
}

function updateDFTInterp(n) {
  const el = document.getElementById('dft-interp');
  if (!el) return;
  const ops = n * n;
  const msg = ops > 1_000_000
    ? `N = ${n}일 때 DFT는 약 ${(ops / 1_000_000).toFixed(1)}백만 번 연산이 필요합니다. 실시간 처리에 쓰기 어려운 수준입니다.`
    : `N = ${n}일 때 DFT는 ${ops.toLocaleString()}번 연산이 필요합니다.`;
  el.textContent = msg;
}

// ── DFT vs FFT 비교 ────────────────────────────────────────────
function initCompareChart() {
  const nValues = [4, 8, 16, 32, 64, 128, 256, 512, 1024];
  let idx = 5; // 64

  const slider = document.getElementById('compare-n');
  const valEl  = document.getElementById('compare-n-val');

  slider.max = nValues.length - 1;
  slider.value = idx;
  valEl.textContent = nValues[idx];

  slider.addEventListener('input', () => {
    idx = +slider.value;
    valEl.textContent = nValues[idx];
    updateCompareInterp(nValues[idx]);
  });

  const sketch = (p) => {
    p.setup = () => {
      const parent = document.getElementById('compare-canvas');
      p.createCanvas(parent.offsetWidth || 800, 220).parent('compare-canvas');
      p.frameRate(30);
    };
    p.windowResized = () => {
      p.resizeCanvas(document.getElementById('compare-canvas').offsetWidth, 220);
    };
    p.draw = () => {
      const W = p.width, H = p.height;
      p.background(9, 13, 18);
      const n = nValues[idx];
      const dftOps = n * n;
      const fftOps = Math.round(n * Math.log2(n));
      const maxOps = nValues[nValues.length - 1] ** 2;

      const barH = 32, gap = 16;
      const maxBarW = W * 0.55;
      const startX = 110, startY = H / 2 - barH - gap / 2;

      const labels = ['DFT (N²)', 'FFT (N log N)'];
      const ops    = [dftOps, fftOps];
      const cols   = [[248, 81, 73], [88, 166, 255]];

      labels.forEach((label, i) => {
        const y = startY + i * (barH + gap);
        const bw = (ops[i] / maxOps) * maxBarW;

        // bg bar
        p.noStroke(); p.fill(22, 30, 42);
        p.rect(startX, y, maxBarW, barH, 5);
        // fill bar
        p.fill(cols[i][0], cols[i][1], cols[i][2]);
        p.rect(startX, y, Math.max(bw, 4), barH, 5);

        // label
        p.fill(cols[i][0], cols[i][1], cols[i][2]);
        p.noStroke(); p.textSize(11); p.textAlign(p.RIGHT);
        p.text(label, startX - 6, y + barH / 2 + 4);

        // value
        p.fill(230, 237, 243); p.textSize(11); p.textAlign(p.LEFT);
        p.text(ops[i].toLocaleString() + '번', startX + Math.max(bw, 4) + 6, y + barH / 2 + 4);
      });

      // speedup
      const speedup = (dftOps / fftOps).toFixed(1);
      p.noStroke(); p.fill(63, 185, 80);
      p.textSize(14); p.textAlign(p.CENTER);
      p.text(`FFT가 DFT보다 ${speedup}배 빠름`, W / 2, H - 12);
    };
  };
  new p5(sketch);
  updateCompareInterp(nValues[idx]);
}

function updateCompareInterp(n) {
  const el = document.getElementById('compare-interp');
  if (!el) return;
  const dft = n * n;
  const fft = Math.round(n * Math.log2(n));
  const ratio = (dft / fft).toFixed(1);
  el.textContent = `N = ${n}일 때 DFT는 ${dft.toLocaleString()}번, FFT는 ${fft.toLocaleString()}번 연산합니다. FFT가 약 ${ratio}배 빠릅니다.`;
}

// ── 초기화 ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initComplexityChart();
  initDFTCounter();
  initCompareChart();
});
