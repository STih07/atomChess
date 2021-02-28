// Enable the Quokka.js jsdom plugin and parse index.html

// eslint-disable-next-line no-unused-expressions
// ({
//   plugins: ['jsdom-quokka-plugin'],
//   jsdom: { file: './index.html' },
// });

export function test(x: number): number {
  document.body.innerHTML = 'Hello!'
  return x + 1;
}
