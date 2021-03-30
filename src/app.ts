// Enable the Quokka.js jsdom plugin and parse index.html

// eslint-disable-next-line no-unused-expressions
// ({
//   plugins: ['jsdom-quokka-plugin'],
//   jsdom: { file: './index.html' },
// });

// document.body.innerHTML = `<b>Hello</b>`;

const app = document.getElementById('app') as HTMLElement;

const range = (amount: number): Array<number> => Array.from<number>(Array(amount).keys());

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const rows = range(8).map(
    (number) => letters.map(
        letter => ({letter: letter, number: 8 - number}))
);


app.innerHTML = 
    rows.map(
    (row, index) => (
        `<div class="row"> 
            <div class="infosquare">${row.length - index}</div> 
            ${row.map(
                square => `<div class="square" id="${square.letter + square.number}"></div>`
            ).join('')} 
        </div>`
        )
    ).join('')
    +
    `<div class="row">
        <div class="infosquare"></div>
        ${letters.map(
            letter => `<div class="infosquare">${letter}</div>`
        ).join('')}
    </div>`;


const pieces = Array.from(document.getElementsByClassName('piece'));
pieces.forEach(
    piece => {
        piece.addEventListener('dragend', (ev: Event) => {
            ev.preventDefault();
            if (draggedPiece) {
                draggedPiece = null;
            }
        })

        piece.addEventListener('dragstart', (ev: Event) => {
            // ev.preventDefault();
            draggedPiece = ev.target as HTMLElement;
        })
    }
)

let draggedPiece: HTMLElement | null;

const square = Array.from(document.getElementsByClassName('square'));
square.forEach(
    square => {
        square.addEventListener('dragover', (ev) => {
            ev.preventDefault();
        });
        square.addEventListener('drop', (ev) => {
            ev.preventDefault();
            if (draggedPiece) {
                (ev.target as HTMLElement)?.appendChild(draggedPiece);
                draggedPiece = null;
            }
    })
    }
)