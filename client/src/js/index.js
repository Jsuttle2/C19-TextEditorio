import { Workbox } from 'workbox-window';
import Editor from './editor';
import './database';
import '../css/style.css';

const main = document.querySelector('#main');
main.innerHTML = '';

const loadSpinner = () => {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.innerHTML = `
  <div class="loading-container">
  <div class="loading-spinner" />
  </div>
  `;
  main.appendChild(spinner);
};

const editor = new Editor();

if (typeof editor === 'undefined') {
  loadSpinner();
}

window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/src-sw.js');

    wb.addEventListener('waiting', () => {
      if (confirm('A new version is available. Refresh to update?')) {
        wb.messageSkipWaiting();
        window.location.reload();
      }
    });

    wb.register();
  } else {
    console.error('Service workers are not supported in this browser.');
  }

  window.addEventListener('beforeunload', () => {
    putDb(localStorage.getItem('content'));
  });
});
