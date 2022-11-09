import {build} from 'vite';

const libraries = [
  {
    entry: 'src/extension.ts',
    fileName: 'extension',
  },
  {
    entry: 'src/background.ts',
    fileName: 'background',
  },
];

libraries.forEach(async library => {
  await build({
    build: {
      emptyOutDir: false,
      lib: {
        ...library,
        formats: ['es'],
      },
      ...(
        process.argv.includes('--watch') ? {
          watch: {}
        } : {}
      )
    },
  });
});
