// RELOAD PAGE ON ctrl+shift+R

// Enable the Quokka.js jsdom plugin and parse index.html

// eslint-disable-next-line no-unused-expressions
// ({
//   plugins: ['jsdom-quokka-plugin'],
//   jsdom: { file: './index.html' },
// });
/*
console.log('Hello!');
const app: HTMLElement = document.getElementById('app') as HTMLElement;
console.log(app);
app.innerHTML = `<b>Hello Chess!</b>`;*/

const app = document.getElementById('app') as HTMLElement;

const range = (amount: number): Array<number> => Array.from<number>(Array(amount).keys());

const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map( 
    (letter) => range(8).map(number => ({letter:letter, number: number + 1}))
);


app.innerHTML = columns.map(
    column => (`<div clas="row">` +
        column.map(square => `<div class="square"></div>`).join('') +
    `</div>`)
).join('');