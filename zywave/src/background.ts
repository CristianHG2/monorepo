chrome.tabs.onActivated.addListener(() => {
  chrome.webRequest.onBeforeRequest.addListener(
    details => {
      if (
        details.method === 'POST' &&
        details.requestBody &&
        details.requestBody.raw &&
        details.requestBody.raw.length > 0 &&
        details.requestBody.raw[0].bytes
      ) {
        const json = String.fromCharCode.apply(
          null,
          Array.from<number>(new Uint8Array(details.requestBody.raw[0].bytes)),
        );

        (async () => {
          const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true,
          });
          const tab = tabs[0];

          if (tab.id) {
            const payload = JSON.parse(json);

            if (payload && payload.entity_search_criteria && !payload._zycsv) {
              await chrome.tabs.sendMessage(tab.id, {
                type: 'pnc',
                payload,
              });
            }
          }
        })();
      }
    },
    {urls: ['https://miedge.net/*']},
    ['requestBody'],
  );
});

export {};
