// Tab navigation + lazy init
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.section');
const initialized = {};

function activateSection(id) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.section === id));
  sections.forEach(s => s.classList.toggle('active', s.id === id));

  if (!initialized[id]) {
    initialized[id] = true;
    if (id === 'composer') initWaveComposer();
    if (id === 'winding')  initCircleWinding();
    if (id === 'spectrum') initSpectrum();
  }
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => activateSection(tab.dataset.section));
});

// init first section on load
activateSection('composer');
