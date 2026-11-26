const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
const brandLogo = document.getElementById('brand-logo');
const logos = {
  suministros: {
    src: 'assets/logo_isystems_ajustado_dark.svg',
    alt: 'ISYSTEMS S.A.S. — Suministros, Logística & Soluciones'
  },
  gestion: {
    src: 'assets/logo_isystems_sistemas_dark.svg',
    alt: 'ISYSTEMS S.A.S. — Sistemas de Gestión'
  }
};

function activateTab(tab, updateHash = true) {
  const selectedPanel = document.getElementById(tab.getAttribute('aria-controls'));

  if (!selectedPanel) {
    return;
  }

  tabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });

  panels.forEach((panel) => {
    const active = panel === selectedPanel;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });

  const logo = logos[tab.dataset.tab];
  if (brandLogo && logo) {
    brandLogo.src = logo.src;
    brandLogo.alt = logo.alt;
  }

  if (updateHash) {
    history.replaceState(null, '', `#${tab.dataset.tab}`);
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));

  tab.addEventListener('keydown', (event) => {
    const movesForward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const movesBackward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';

    if (!movesForward && !movesBackward && event.key !== 'Home' && event.key !== 'End') {
      return;
    }

    event.preventDefault();
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : (index + (movesForward ? 1 : -1) + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    activateTab(tabs[nextIndex]);
  });
});

const initialTab = tabs.find((tab) => tab.dataset.tab === window.location.hash.slice(1));
if (initialTab) {
  activateTab(initialTab, false);
}
