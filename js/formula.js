function initFormula() {
  const K = katex;
  const opts = { throwOnError: false, displayMode: true };
  const inOpts = { throwOnError: false, displayMode: false };

  // Main formula (full + short)
  const formulaFull = document.getElementById('formula-full');
  if (formulaFull) {
    formulaFull.innerHTML =
      K.renderToString(
        '\\hat{g}(f) = \\int_{-\\infty}^{\\infty} g(t)\\, e^{-2\\pi i f t}\\, dt',
        opts
      ) +
      '<div style="margin-top:0.6rem; font-size:0.85rem; color:#8b949e;">간략: ' +
      K.renderToString('\\hat{g}(f) = \\int g(t)\\, e^{-2\\pi i f t}\\, dt', { ...inOpts }) +
      '</div>';
  }

  // Component breakdowns
  const components = [
    { id: 'fb-ghat',    tex: '\\hat{g}(f)',           display: true  },
    { id: 'fb-gt',      tex: 'g(t)',                   display: true  },
    { id: 'fb-euler',   tex: 'e^{-2\\pi i f t}',       display: true  },
    { id: 'fb-integral',tex: '\\int_{-\\infty}^{\\infty} \\cdots\\, dt', display: true },
  ];
  components.forEach(({ id, tex, display }) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = K.renderToString(tex, display ? opts : inOpts);
  });

  // Euler formula
  const euler = document.getElementById('euler-formula');
  if (euler) {
    euler.innerHTML = K.renderToString(
      'e^{i\\theta} = \\cos\\theta + i\\sin\\theta',
      opts
    );
  }

  // Inline clockwise rotation
  const cw = document.getElementById('cw-rot');
  if (cw) {
    cw.innerHTML = K.renderToString('e^{-2\\pi i f t}', inOpts);
  }
}
