import selectors, {btnId} from '../support/selectors';
import {utils, waitForElement} from '../support/utils';

export const appendExportButton = async (onClick: () => void) => {
  const button = await waitForElement(selectors.menuItems);
  const container = button.parentElement;

  if (!container) {
    throw new Error('Unable to create download button');
  }

  const exportButton = utils.create('a', {
    class: 'MuiButtonBase-root MuiButton-root MuiButton-text',
    href: '#',
    id: btnId,
  });

  const iconUri = chrome.runtime.getURL('static/csv-icon.png');

  exportButton.innerHTML = `
      <span class="MuiButton-label">
        <img src="${iconUri}" style="width: 20px; height: 20px; margin-right: 5px;" alt="CSV" />
        <span class="MuiTypography-root jss7 MuiTypography-button" style="color: #fff">Export</span>
      </span>
      <span class="MuiTouchRipple-root"></span>
  `;

  exportButton.addEventListener('click', onClick);

  container.prepend(exportButton);
};

export const makeDialogInstance = () => {
  const dialog = utils.create('dialog', {
    style: [
      'border-radius: 1rem',
      'border: 1px solid #d3d3d3',
      'padding: 1.5rem',
      'color: #2f2f2f',
    ].join(';'),
  });
  const body = utils.create('p', {style: 'font-size: 1rem'});

  const btn = utils.create('button', {
    style: [
      'background: #2777D3',
      'color: #fff',
      'font-weight: bold',
      'border: 0',
      'padding: 0.5rem 2rem',
      'border-radius: 1rem',
      'float: right',
    ].join(';'),
  });

  btn.innerText = 'OK';
  btn.addEventListener('click', () => (dialog.hidden = true));

  dialog.append(body, btn);
  document.body.appendChild(dialog);

  return {
    show: (message: string) => {
      body.innerHTML = message;

      if (dialog.open) {
        return;
      }

      dialog.showModal();
    },
  };
};
