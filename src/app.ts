// Enable the Quokka.js jsdom plugin and parse index.html

// eslint-disable-next-line no-unused-expressions
// ({
//   plugins: ['jsdom-quokka-plugin'],
//   jsdom: { file: './index.html' },
// });

export function test(x: number): number {
  return x + 1;
}

const app = document.getElementById('app') as HTMLElement;
console.log(app);
app.innerHTML = `<b>HELLO CHESS</b>`;