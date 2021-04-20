// Enable the Quokka.js jsdom plugin and parse index.html

// eslint-disable-next-line no-unused-expressions
// ({
//   plugins: ['jsdom-quokka-plugin'],
//   jsdom: { file: './index.html' },
// });

// document.body.innerHTML = `<b>Hello</b>`;

type Piece = 'pawn' | 'rook' | 'bishop' | 'knight' | 'queen' | 'king';

enum Color {
    WHITE = 'w',
    BLACK = 'b'
}

type ColoredPiece = {
    piece: Piece,
    color: Color
};

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
};


const rows = range(8).map(
    (number) => letters.map(
        letter => ({letter: letter, number: 8 - number}))
);


type Move = {
    piece: ColoredPiece,
    start: string,
    end: string,
    defeat: ColoredPiece | null
};

const moves: Array<Move> = [];


app.innerHTML = 
    rows.map(
    (row, index) => (
        `<div class="row"> 
            <div class="infosquare">${row.length - index}</div> 
            ${row.map(
                square => `<div class="square" id="${square.letter + square.number}">
                ${
                    positions[square.letter + square.number] ? 
                    `<div draggable="true" class="piece ${positions[square.letter + square.number]}"></div>` 
                    : ''
                }
                </div>`
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
            const piece = ev.target as HTMLElement; 
            tookPiece(piece);
        })
    }
)

let draggedPiece: HTMLElement | null;
let activeSquare: HTMLElement | null;

const squares = Array.from(document.getElementsByClassName('square')) as Array<HTMLElement>;
squares.forEach(
    (square) => {
        square.addEventListener('click', (ev) => {
            ev.preventDefault();
            const piece = square.lastElementChild as HTMLElement;

            if (piece) {
                tookPiece(piece);
            } else if (square.classList.contains('active')) {
                putPiece(square);
            }
        });

        square.addEventListener('dragover', (ev) => {
            ev.preventDefault();
        });
        square.addEventListener('drop', (ev) => {
            ev.preventDefault();
            putPiece(square);
    })
    }
)


const tookPiece = (piece: HTMLElement) => {
    draggedPiece = piece;
    changeActiveSquare(piece.parentElement as HTMLElement);
};

const putPiece = (square: HTMLElement) => {
    console.log(draggedPiece);
    if (draggedPiece) {
        movePiece(draggedPiece, square);
    }
    draggedPiece = null;
}

// @TODO optimize forEach on each square
const changeActiveSquare = (square: HTMLElement) => {
    const pieceRef = square?.lastElementChild as HTMLElement;
    const [, color, piece] = pieceRef.classList; // ['piece', 'w/b', 'pieceName']
    activeSquare = square;
    squares.forEach(
        square => {
            square.classList.remove('active');
            if (pieceMoveAllowed(piece as Piece, color as Color, pieceRef, square)) {
                square.classList.add('active');
            }
        }
    );
    activeSquare.classList.add('active');
}

const movePiece = (pieceRef: HTMLElement, placeBlock: HTMLElement) => {
    console.log('works2');
    const [, color, piece] = pieceRef.classList; // ['piece', 'w/b', 'pieceName']
    console.log(color, piece);
    if (pieceMoveAllowed(piece as Piece, color as Color, pieceRef, placeBlock)) {
        moves.push({
            piece: {
                piece: piece as Piece,
                color: color as Color,
            },
            start: pieceRef.parentElement?.id as string,
            end: placeBlock.id,
            defeat: placeBlock.lastElementChild ? {
                piece: placeBlock.lastElementChild.classList[2] as Piece,
                color: placeBlock.lastElementChild.classList[1] as Color
            } : null
        });
        placeBlock.innerHTML = '';
        placeBlock.appendChild(pieceRef);
    }
    console.log(moves);
}


const isEndPosClosedByPiece = (endPosRef: HTMLElement, color: Color, isEnemy: boolean) => {
    const child = endPosRef.lastElementChild;
    // Если Чайлд
    // Проверяем, что (у чайлда такой же цвет, как у нас) равно значению (враг ли)
    // Мы - white, Чайлд - White, enemy - true  => false
    // Мы - white, Чайлд - Black, enemy - true  => true
    // Мы - white, Чайлд - White, enemy - false => true  
    // 
    return child && (child.classList.contains(color) !== isEnemy);
}                    

const pieceMoveAllowed = (piece: Piece, color: Color, startPositionRef: HTMLElement, endPositionRef: HTMLElement) => {
    const startPosition = startPositionRef.parentElement?.id as string; // e4 => ['e', '4']
    const endPosition = endPositionRef.id; // e5 => ['e', '4']

    if (!isEndPosClosedByPiece(endPositionRef, color, false)) {
        const diffByY = +startPosition[1] - +endPosition[1];
        const diffByX = letters.indexOf(startPosition[0]) - letters.indexOf(endPosition[0]);

        switch (piece) {
            case 'rook':
                return (diffByX === 0 || diffByY === 0);
            case 'bishop':
                return Math.abs(diffByY) === Math.abs(diffByX);
            case 'knight':
                const diffByCords = Math.abs(Math.abs(diffByY) - Math.abs(diffByX));
                const x = Math.abs(diffByX);
                const y = Math.abs(diffByY);
                return (x === 1 && y === 2) || (x === 2 && y === 1);
            case 'king':
                return Math.abs(diffByX) <= 1 && Math.abs(diffByY) <= 1;
            case 'queen':
                return (diffByX === 0 || diffByY === 0) || (Math.abs(diffByY) === Math.abs(diffByX));
            case 'pawn':
                const firstStartPos = color === Color.WHITE ? '2' : '7';
                const firstEndPos = color === Color.WHITE ? '4' : '5';
                const oneForward = color === Color.WHITE ? -1 : 1;
                const firstMoveOnTwo = diffByX === 0 && startPosition[1] === firstStartPos && endPosition[1] === firstEndPos;
                const newPosHasEnemy = isEndPosClosedByPiece(endPositionRef, color, true); 
                const newPosIsEmpty = isEndPosClosedByPiece(endPositionRef, color, true) === null;
                
                const lastMove = moves[moves.length - 1];
                const lastIsPassant = lastMove && lastMove.piece.piece === 'pawn' && 
                                      lastMove.start[1] === firstStartPos && 
                                      lastMove.end[1] === firstEndPos;
                // return firstMoveOnTwo || (diffByX === 0 && (newPosIsEmpty && !newPosHasEnemy) && diffByY === 1);
                return (diffByX === 0 && newPosIsEmpty && (firstMoveOnTwo || diffByY === oneForward)) ||
                       Math.abs(diffByX) === 1 && ((!newPosIsEmpty && newPosHasEnemy) && diffByY === oneForward);
                ;
            default:
                return true;
        }
    }
}



// const pieceBetweenSquares = (startSquare, endSquare, piece)