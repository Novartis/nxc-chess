/* Copyright 2016 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */
import pieceInfo from './pieceCodes';

function checkArrayForPosition(array, X, Y) {
    let goodPosition = false;
    array.forEach(pos => {
        const [x, y] = pos;
        if (x === X && y === Y) {
            goodPosition = true;
        }
    });
    return goodPosition;
}

function removeOutsideBoard(array) {
    const newArray = array.filter(spot => {
        const [x, y] = spot;
        if (x < 0 || y < 0 || x > 7 || y > 7) {
            return false;
        }
        return true;
    });
    return newArray;
}

function horizontalPathClear(x1, x2, y, boardLocs) {
    if (x1 < x2) {
        for (let between = x1 + 1; between <= x2 - 1; between++) {
            if (boardLocs[between][y]) {
                return false;
            }
        }
    } else {
        for (let between = x2 + 1; between <= x1 - 1; between++) {
            if (boardLocs[between][y]) {
                return false;
            }
        }
    }
    return true;
}

function verticalPathClear(y1, y2, x, boardLocs) {
    if (y1 < y2) {
        for (let between = y1 + 1; between <= y2 - 1; between++) {
            if (boardLocs[x][between]) {
                return false;
            }
        }
    } else {
        for (let between = y2 + 1; between <= y1 - 1; between++) {
            if (boardLocs[x][between]) {
                return false;
            }
        }
    }
    return true;
}

function rookPathAccessible(oldX, oldY, newX, newY, boardLocs, color) {
    if (!horizontalPathClear(newX, oldX, oldY, boardLocs)) { return false; }
    if (!verticalPathClear(newY, oldY, oldX, boardLocs)) { return false; }
    if ((boardLocs[newX][newY] !== color) && ((newX === oldX) || (newY === oldY))) {
        return true;
    }
    return (newX === oldX) || (newY === oldY);
}

function bishopPathAccessible(oldX, oldY, newX, newY, boardLocs) {
    let posPaths = [];
    [...Array(8).keys()].forEach(i => {
        if (i === 0) return;
        posPaths.push([oldX + i, oldY + i]);
        posPaths.push([oldX + i, oldY - i]);
        posPaths.push([oldX - i, oldY - i]);
        posPaths.push([oldX - i, oldY + i]);
    });

    posPaths = removeOutsideBoard(posPaths);
    const takenPositions = posPaths.filter(loc => boardLocs[loc[0]][loc[1]]);

    takenPositions.forEach(pos => {
        const [badX, badY] = pos;
        const directionX = oldX - badX;
        const directionY = oldY - badY;
        if (directionX > 0 && directionY > 0) {
            posPaths = posPaths.filter(
                loc => (loc[0] >= badX && loc[1] >= badY) || !(loc[0] < oldX && loc[1] < oldY));
        } else if (directionX < 0 && directionY > 0) {
            posPaths = posPaths.filter(
                loc => (loc[0] <= badX && loc[1] >= badY) || !(loc[0] > oldX && loc[1] < oldY));
        } else if (directionX > 0 && directionY < 0) {
            posPaths = posPaths.filter(
                loc => (loc[0] >= badX && loc[1] <= badY) || !(loc[0] < oldX && loc[1] > oldY));
        } else if (directionX < 0 && directionY < 0) {
            posPaths = posPaths.filter(
                loc => (loc[0] <= badX && loc[1] <= badY) || !(loc[0] > oldX && loc[1] > oldY));
        }
    });

    return checkArrayForPosition(posPaths, newX, newY);
}

function canPieceMove(
    oldX,
    oldY,
    pieceCode,
    newX,
    newY,
    squareOccupied,
    boardLocs,
    originalPawns,
    pieceId) {
    const { type, color } = pieceInfo[pieceCode];
    if (oldX === newX && oldY === newY) {
        return false;
    }
    if (squareOccupied) {
        if (squareOccupied === color) {
            return false;
        }
    }
    switch (type) {
        case 'knight': {
            const dx = newX - oldX;
            const dy = newY - oldY;
            return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
            (Math.abs(dx) === 1 && Math.abs(dy) === 2);
        }
        case 'rook': {
            return rookPathAccessible(oldX, oldY, newX, newY, boardLocs, color);
        }
        case 'bishop': {
            return bishopPathAccessible(oldX, oldY, newX, newY, boardLocs, color);
        }
        case 'queen': {
            return bishopPathAccessible(oldX, oldY, newX, newY, boardLocs, color) ||
            rookPathAccessible(oldX, oldY, newX, newY, boardLocs, color);
        }
        case 'king': {
            if (color === 'black') {
                if (boardLocs[5][0] === null
                    && boardLocs[6][0] === null
                    && boardLocs[7][0] === 'black') {
                    if (newX === 6 && newY === 0) {
                        return true;
                    }
                }
                if (horizontalPathClear(4, 0, 0, boardLocs) && boardLocs[0][0] === 'black') {
                    if (newX === 1 && newY === 0) {
                        return true;
                    }
                }
            } else {
                if (boardLocs[1][7] === null
                    && boardLocs[2][7] === null
                    && boardLocs[0][7] === 'white') {
                    if (newX === 1 && newY === 7) {
                        return true;
                    }
                }
                if (horizontalPathClear(3, 7, 7, boardLocs) && boardLocs[7][7] === 'white') {
                    if (newX === 6 && newY === 7) {
                        return true;
                    }
                }
            }

            const dx = Math.abs(newX - oldX);
            const dy = Math.abs(newY - oldY);
            return (dx + dy <= 2) && ((dx === 1) || (dy === 1));
        }
        case 'pawn': {
            let forwardMove = false;
            let attackMove = false;
            let firstMove = false;

            if (color === 'black') {
                forwardMove = (newY === oldY + 1) && (oldX === newX) && (!boardLocs[newX][newY]);
                attackMove = ((newY === oldY + 1)
                    && (Math.abs(oldX - newX) === 1)
                    && (boardLocs[newX][newY]));
                if (originalPawns[pieceId]) {
                    firstMove = (newY === oldY + 2) && (oldX === newX) && (!boardLocs[newX][newY]);
                }
            } else {
                forwardMove = (newY === oldY - 1) && (oldX === newX) && (!boardLocs[newX][newY]);
                attackMove = ((newY === oldY - 1)
                    && (Math.abs(oldX - newX) === 1)
                    && (boardLocs[newX][newY]));
                if (originalPawns[pieceId]) {
                    firstMove = (newY === oldY - 2) && (oldX === newX) && (!boardLocs[newX][newY]);
                }
            }
            return forwardMove || attackMove || firstMove;
        }
        default: {
            return false;
        }
    }
}
export default canPieceMove;
