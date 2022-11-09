import JSZip from 'jszip';
import * as fs from 'fs';

const zip = new JSZip();

const importFolder = (folder, files) => {
  const dir = zip.folder(folder);
  files.forEach(file => dir.file(file, fs.readFileSync(`${folder}/${file}`)));
};

importFolder('dist', ['background.mjs', 'extension.mjs']);
importFolder('static', ['icon.png', 'csv-icon.png', 'popup.html']);
zip.file('manifest.json', fs.readFileSync('manifest.json'));

zip.generateAsync({ type: "uint8array" })
  .then(content => fs.writeFileSync('zywave-extension.zip', content));

