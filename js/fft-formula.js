document.addEventListener('DOMContentLoaded', () => {
  const K = katex;
  const d = { throwOnError: false, displayMode: true };
  const i = { throwOnError: false, displayMode: false };

  const set = (id, tex, opts) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = K.renderToString(tex, opts);
  };

  set('dft-formula',
    'X[k] = \\sum_{n=0}^{N-1} x[n] \\cdot \\omega_N^{nk} \\qquad (k = 0, 1, \\ldots, N-1)',
    d);

  set('fft-formula',
    '\\begin{aligned} X[k] &= E[k] + \\omega_N^k \\cdot O[k] \\\\ X[k + N/2] &= E[k] - \\omega_N^k \\cdot O[k] \\end{aligned}',
    d);

  set('conv-formula',
    '(f * g)(x) = \\mathcal{F}^{-1}\\!\\left(\\, \\mathcal{F}(f) \\cdot \\mathcal{F}(g) \\,\\right)',
    d);
});
