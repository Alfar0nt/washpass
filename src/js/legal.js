import { initFooter } from './components/footer.js';

function init() {
  initFooter(document.getElementById('footer'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
