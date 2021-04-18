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
type ColoredPiece = {
    piece: Piece,
    color: Color
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

type Move = {
    piece: ColoredPiece,
    start: string,
    end: string,
    defeat: ColoredPiece | null
}

const moves: Array<Move> = [];

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
        moves.push({
            piece: {
                piece: piece as Piece,
                color: color as Color
            },
            start: pieceRef.parentElement?.id as string,
            end: pieceRef.parentElement?.id as string,
            defeat: placeBlock.lastElementChild ? {
                piece: placeBlock.lastElementChild?.classList[2] as Piece,
                color: placeBlock.lastElementChild?.classList[1] as Color
            } : null
        })
        placeBlock.innerHTML = '';
        placeBlock.appendChild(pieceRef);
    }
}

const isEndPositionClosedByPiece = (endPositionRef: HTMLElement, color:Color, enemy:boolean) => {
    const child = endPositionRef.lastElementChild;
    return child && (child.classList.contains(color) !== enemy);
}

const pieceMoveAllowed = (piece: Piece, color: Color, startPositionRef: HTMLElement, endPositionRef: HTMLElement) => {
    const startPosition = startPositionRef.parentElement?.id as string;
    const endPosition = endPositionRef.id;
    
    if (!isEndPositionClosedByPiece(endPositionRef, color, false)){
        const diffByY = +startPosition[1] - +endPosition[1]; //0
        const diffByX = letters.indexOf(startPosition[0]) - letters.indexOf(endPosition[0]);
        
        switch (piece) {
            case 'rook':
                return (diffByY === 0 || diffByX === 0)
            case 'bishop':
                return Math.abs(diffByY) === Math.abs(diffByX);
            case 'knight':
                const diffByCords = Math.abs(Math.abs(diffByY) - Math.abs(diffByX));
                return (Math.abs(diffByY)===2 && Math.abs(diffByX)===1) || (Math.abs(diffByY)===1 && Math.abs(diffByX)===2);
                //return diffByY <= 2 && diffByX <=2 && diffByCords === 1; 
            case 'king':
                return Math.abs(diffByX) <= 1 && Math.abs(diffByY) <= 1;
            case 'queen':
                return (diffByY === 0 || diffByX === 0) || (Math.abs(diffByY) === Math.abs(diffByX));
            case 'pawn':
                const firstStartPos = color === Color.WHITE ? '2' : '7';
                const firstEndPos = color === Color.WHITE ? '4' : '5';
                const oneForward = color === Color.WHITE ? -1 : 1;
                const firstMoveOnTwo = diffByX === 0 && startPosition[1] === firstStartPos && endPosition[1] === firstEndPos; 
                const newPosHasEnemy = isEndPositionClosedByPiece(endPositionRef, color, true);
                const newPosIsEmpty = isEndPositionClosedByPiece(endPositionRef, color, true) === null;

                const lastMove = moves[moves.length -1]
                const lastIsPassant = lastMove && lastMove.piece.piece === 'pawn' && 
                                    lastMove.start[2] === firstStartPos && 
                                    lastMove.end[1] === firstEndPos;
                //return firstMoveOnTwo || (diffByX === 0 && (newPosIsEmpty && !newPosHasEnemy) && diffByY === 1);
                // ============================================
                return (diffByX === 0 && (!newPosHasEnemy || newPosIsEmpty) && (firstMoveOnTwo || diffByY === oneForward)) ||
                        Math.abs(diffByX) === 1 && ((newPosHasEnemy && !newPosIsEmpty) && diffByY === oneForward) 
                            //|| (diffByY === oneForward && lastIsPassant && )

            default:
                return true;
        }
    }
}