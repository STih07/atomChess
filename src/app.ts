
type Piece = 'pawn' | 'rook'|'king'|'knight'| 'bishop'|'queen';
enum Color{
    WHITE = 'w',
    BLACK = 'b'
}

const app = document.getElementById('app') as HTMLElement;

const range = (amount: number): Array<number> => Array.from<number>(Array(amount).keys());

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const positions: {[key:string]: string} = {
    'a1':'w rook',
    'b1':'w knight',
    'c1':'w bishop',
    'd1':'w king',
    'e1':'w queen',
    'f1':'w bishop',
    'g1':'w knight',
    'h1':'w rook',

    'a8':'b rook',
    'b8':'b knight',
    'c8':'b bishop',
    'd8':'b king',
    'e8':'b queen',
    'f8':'b bishop',
    'g8':'b knight',
    'h8':'b rook',

    'a2': 'w pawn',
    'b2': 'w pawn',
    'c2': 'w pawn',
    'd2': 'w pawn',
    'e2': 'w pawn',
    'f2': 'w pawn',
    'g2': 'w pawn',
    'h2': 'w pawn',

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
    (number)=>letters.map(
        letter => ({letter: letter, number: 8 - number})
    )
);

app.innerHTML = 

        rows.map(
            (row,index)=>(
                `<div class="row">
                    <div class = "infosquare">${row.length - index}</div>
                    ${row.map(
                        square => `<div class="square" id="${square.letter +square.number}">
                        ${
                            positions[square.letter + square.number]?
                            `<div draggable="true" class = "piece ${positions[square.letter + square.number]}"></div>`
                            : ''
                        }
                        </div> `
                    ).join('')}
                </div>`      
            )
        ).join(' ')
        +
        `<div class="row">
            <div class="infosquare"></div>
            ${letters.map(
                letter=>`<div class="infosquare">${letter}</div>`
            ).join('')}
           </div>`;
 
let draggedPiece: HTMLElement | null;

const pieses = Array.from(document.getElementsByClassName('piece'));
pieses.forEach(
    piece=>{
        piece.addEventListener('dragend', (ev:Event)=>{
            ev.preventDefault();
            if(draggedPiece){
                draggedPiece = null;
            }
        })

        piece.addEventListener('dragstart', (ev:Event)=>{
            draggedPiece = ev.target as HTMLElement;
        })
    }
)

const square = Array.from(document.getElementsByClassName('square'));
square.forEach(
    square=>{
        square.addEventListener('dragover', (ev)=>{
            ev.preventDefault();
        });
        square.addEventListener('drop', (ev)=>{
            ev.preventDefault();
            const placeBlock = (ev.target as HTMLElement);
            if(draggedPiece && placeBlock){
                movePiece(draggedPiece, placeBlock);
                draggedPiece = null;
            }
        })
    }
)

const isEndPosClosedByFriend = (endPosRef: HTMLElement, color: Color)=>{
    const child = endPosRef.lastElementChild;
    return child && child.classList.contains(color);
}

const movePiece = (pieceRef:HTMLElement, placeBlock : HTMLElement)=>{
    const [,color, piece] = pieceRef.className.split(' ');
    const startPosithion = pieceRef.parentElement?. id as string;
    const endPosithion = placeBlock.id;
    if(pieceMoveAllowed(piece as Piece, color as Color, pieceRef as HTMLElement, placeBlock as HTMLElement)){
        placeBlock.appendChild(pieceRef);
    }
}

const pieceMoveAllowed = (piece: Piece, color: Color, startPosithionRef : HTMLElement, endPosithionRef: HTMLElement)=>{
    const startPosithion = startPosithionRef.parentElement?. id as string;
    const endPosithion = endPosithionRef.id;

    if(!isEndPosClosedByFriend(endPosithionRef, color)){
        const diffByX = +startPosithion[1] - +endPosithion[1];
        const diffByY = letters.indexOf(startPosithion[0]) - letters.indexOf(endPosithion[0]);

        switch(piece){
            case 'rook':
                return diffByX===0|| diffByY===0;
            case 'bishop':
                return Math.abs(diffByX) === Math.abs(diffByY);
            case 'knight':
                const diffByCords = Math.abs(Math.abs(diffByX) - Math.abs(diffByY));
                return diffByY <= 2 && diffByX <= 2 && diffByCords === 1;
            case 'queen':
                return (diffByX===0|| diffByY===0) ||(Math.abs(diffByX) === Math.abs(diffByY));
            case 'king':
                return Math.abs(diffByX) <=1 && Math.abs(diffByY) <=1;
            default: 
                return false;
        }
    }
}
