import {appendExportButton, makeDialogInstance} from './modules/ui-elements';
import {fetchUntilComplete, mutateResults} from './modules/pnc-fetch';
import {downloadCSV, getExceptionMessage, utils} from './support/utils';
import selectors from './support/selectors';

/* Bootstrap */

const state = {
  lastRequest: null,
};

const dialog = makeDialogInstance();

/* Listeners */

chrome.runtime.onMessage.addListener(request => {
  if (request && request.type && request.type === 'pnc') {
    console.log(
      `[ZyCSV] Intercepted request: ${JSON.stringify(request.payload)}`,
    );
    state.lastRequest = request.payload;
  }
});

/* Start */

const startExtension = async () => {
  console.log('[ZyCSV] Starting extension...');

  try {
    const onExportClick = async () => {
      if (!state.lastRequest) {
        dialog.show(
          'We did not intercept any requests. Please refresh the page and try again.',
        );
        return;
      }

      dialog.show('Please wait while we prepare your data...');
      const response = await fetchUntilComplete(state.lastRequest);
      console.log(`[ZyCSV] Total result set size is ${response.length}`);
      downloadCSV(mutateResults(response), 'zywave-export.csv');
      dialog.show('Done! CSV file has been downloaded.');
    };

    setInterval(() => {
      if (!utils.get(selectors.exportButton)) {
        console.log('[ZyCSV] Export button not found, rendering new one!');
        appendExportButton(onExportClick);
      }
    }, 5000);
  } catch (e: unknown) {
    dialog.show(getExceptionMessage(e));
    throw e;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startExtension);
} else {
  void startExtension();
}

export {};
