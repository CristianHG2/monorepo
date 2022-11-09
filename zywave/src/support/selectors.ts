export const btnId = 'zycsv-export-button';

export default {
  table: '.ag-root.ag-unselectable.ag-layout-normal[ref="gridBody"]',
  headers: '.ag-header',
  menuItems:
    '.MuiPaper-root.MuiAppBar-root > .MuiToolbar-root > div > .MuiButtonBase-root',
  exportButton: `#${btnId}`,
};
