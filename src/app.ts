// RELOAD PAGE ON ctrl+shift+R

// Enable the Quokka.js jsdom plugin and parse index.html

// eslint-disable-next-line no-unused-expressions
// ({
//   plugins: ['jsdom-quokka-plugin'],
//   jsdom: { file: './index.html' },
// });
// http://127.0.0.1:8080/

type Piece = 'pawn' | 'rook' | 'bishop' | 'knight' | 'queen' | 'king';
enum Color {
    WHITE = 'w', 
    BLACK = 'b'
}
const app = document.getElementById('app') as HTMLElement;
const range = (amount: number): Array<number> => Array.from<number>(Array(amount).keys());
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const positions: {[key: string]: string} = {
    'a1': 'w rook',
    'b1': 'w knight',
    'c1': 'w bishop',
    'd1': 'w king',
    'e1': 'w queen',
    'f1': 'w bishop',
    'g1': 'w knight',
    'h1': 'w rook',

    'a2': 'w pawn',
    'b2': 'w pawn',
    'c2': 'w pawn',
    'd2': 'w pawn',
    'e2': 'w pawn',
    'f2': 'w pawn',
    'g2': 'w pawn',
    'h2': 'w pawn',

    'a8': 'b rook',
    'b8': 'b knight',
    'c8': 'b bishop',
    'd8': 'b king',
    'e8': 'b queen',
    'f8': 'b bishop',
    'g8': 'b knight',
    'h8': 'b rook', 

    'a7': 'b pawn',
    'b7': 'b pawn',
    'c7': 'b pawn',
    'd7': 'b pawn',
    'e7': 'b pawn',
    'f7': 'b pawn',
    'g7': 'b pawn',
    'h7': 'b pawn',
}

const rows = range(8).map( 
    (number) => letters.map(letter => ({letter:letter, number: 8 - number}))
);

app.innerHTML =
    rows.map(
        (row, index) => (`<div class="row">
            <div class="infosquare">${(rows.length - index)}</div>
                ${row.map(
                     square => `<div class="square" id="${square.letter + square.number}">
                    ${
                        positions[square.letter + square.number] ? 
                        `<div draggable="true" class="piece ${positions[square.letter + square.number]}"></div>` 
                        : ''
                    }
                    </div>`
                ).join('')}
        </div>`)
    ).join('')
    +
    `<div class="row">
    <div class="infosquare"></div>
        ${letters.map(
            letter => `<div class="infosquare">` + letter + `</div>`
        ).join('')}
    </div>`;




const pieces = Array.from(document.getElementsByClassName('piece'));
pieces.forEach(
    piece => {
        piece.addEventListener('dragend', (ev: Event) => {
            ev.preventDefault();
            if (draggedPiece){
                draggedPiece = null;
            }
        })
        piece.addEventListener('dragstart', (ev: Event) => {
            //ev.preventDefault();
            draggedPiece = ev.target as HTMLElement;
        })
    }
)

let draggedPiece : HTMLElement | null;

const square = Array.from(document.getElementsByClassName('square'));
square.forEach(square => {
    square.addEventListener('dragover', (ev) => {
        ev.preventDefault();
    })
    square.addEventListener('drop', (ev) => {
        ev.preventDefault();
        const placeBlock = (square as HTMLElement);
        if (draggedPiece && placeBlock){
            movePiece(draggedPiece, placeBlock);
            draggedPiece = null;
        }
        })
    }
)

const movePiece = (pieceRef: HTMLElement, placeBlock: HTMLElement) =>{
    const [, color, piece] = pieceRef.classList; // [piece w pawn]
    
    if (pieceMoveAllowed(piece as Piece, color as Color, pieceRef, placeBlock)){
        placeBlock.appendChild(pieceRef);
    }
}

const isEndPositionClosedByFriend = (endPositionRef: HTMLElement, color:Color) => {
    const child = endPositionRef.lastElementChild;
    return child && child.classList.contains(color);
}

const pieceMoveAllowed = (piece: Piece, color: Color, startPositionRef: HTMLElement, endPositionRef: HTMLElement) => {
    const startPosition = startPositionRef.parentElement?.id as string;
    const endPosition = endPositionRef.id;
    
    if (!isEndPositionClosedByFriend(endPositionRef, color)){
        switch (piece) {
            case 'rook':
                return (startPosition[0] === endPosition[0] || startPosition[1] === endPosition[1])
            case 'bishop':
                return (startPosition[0] === endPosition[0] || startPosition[1] === endPosition[1])
            default:
                return true;
        }
    }
}