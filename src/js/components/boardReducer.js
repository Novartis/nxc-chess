/* Copyright 2016 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */
import { MOVE_PIECE, CAPTURE_PIECE } from './boardActions';

const initialState = {
    deadPieces: {
    },
    turn: 'white',
    win: 'null',
    pieces: {
        RB1: [0, 0, 'blackRook'],
        RB2: [7, 0, 'blackRook'],
        BB1: [2, 0, 'blackBishop'],
        BB2: [5, 0, 'blackBishop'],
        KB1: [1, 0, 'blackKnight'],
        KB2: [6, 0, 'blackKnight'],
        PB1: [0, 1, 'blackPawn'],
        PB2: [1, 1, 'blackPawn'],
        PB3: [2, 1, 'blackPawn'],
        PB4: [3, 1, 'blackPawn'],
        PB5: [4, 1, 'blackPawn'],
        PB6: [5, 1, 'blackPawn'],
        PB7: [6, 1, 'blackPawn'],
        PB8: [7, 1, 'blackPawn'],
        QB: [3, 0, 'blackQueen'],
        KB: [4, 0, 'blackKing'],
        RW1: [0, 7, 'whiteRook'],
        RW2: [7, 7, 'whiteRook'],
        BW1: [2, 7, 'whiteBishop'],
        BW2: [5, 7, 'whiteBishop'],
        KW1: [1, 7, 'whiteKnight'],
        KW2: [6, 7, 'whiteKnight'],
        PW1: [0, 6, 'whitePawn'],
        PW2: [1, 6, 'whitePawn'],
        PW3: [2, 6, 'whitePawn'],
        PW4: [3, 6, 'whitePawn'],
        PW5: [4, 6, 'whitePawn'],
        PW6: [5, 6, 'whitePawn'],
        PW7: [6, 6, 'whitePawn'],
        PW8: [7, 6, 'whitePawn'],
        QW: [4, 7, 'whiteQueen'],
        KW: [3, 7, 'whiteKing'],
    },
    originalPawns: {
        PB1: true,
        PB2: true,
        PB3: true,
        PB4: true,
        PB5: true,
        PB6: true,
        PB7: true,
        PB8: true,
        PW1: true,
        PW2: true,
        PW3: true,
        PW4: true,
        PW5: true,
        PW6: true,
        PW7: true,
        PW8: true,
    },
    boardLocs: [
        ['black', 'black', null, null, null, null, 'white', 'white'],
        ['black', 'black', null, null, null, null, 'white', 'white'],
        ['black', 'black', null, null, null, null, 'white', 'white'],
        ['black', 'black', null, null, null, null, 'white', 'white'],
        ['black', 'black', null, null, null, null, 'white', 'white'],
        ['black', 'black', null, null, null, null, 'white', 'white'],
        ['black', 'black', null, null, null, null, 'white', 'white'],
        ['black', 'black', null, null, null, null, 'white', 'white'],
    ],
    completedMoves: [],
};

export default function piecesMap(state = initialState, action = {}) {
    const payload = action.payload;
    const { pieces, boardLocs, deadPieces, win } = state;
    const boardLocsCopy = JSON.parse(JSON.stringify(boardLocs));
    let completedMove;
    if (payload) {
        completedMove = {
            piece: payload.piece,
            killedPiece: payload.killedPiece,
            newCol: payload.newCol,
            newRow: payload.newRow,
            color: state.turn,
        };
    }

    switch (action.type) {
        case MOVE_PIECE: {
            const movedColor = boardLocs[payload.oldCol][payload.oldRow];
            const pawnsLocations = JSON.parse(JSON.stringify(state.originalPawns));
            if (payload.piece.charAt(0) === 'P') {
                pawnsLocations[payload.piece] = false;
            }
            if (payload.piece.charAt(0) === 'K') {
                if (payload.newCol === 6 && payload.newRow === 0) {
                    if (pieces.RB2[0] === 7 && pieces.RB2[1] === 0 && boardLocs[5][0] === null) {
                        boardLocsCopy[payload.oldCol][payload.oldRow] = null;
                        boardLocsCopy[payload.newCol][payload.newRow] = movedColor;
                        boardLocsCopy[5][0] = movedColor;
                        return {
                            pieces: {
                                ...pieces,
                                [payload.piece]: [payload.newCol, payload.newRow, payload.type],
                                RB2: [5, 0, 'blackRook'],
                            },
                            boardLocs: boardLocsCopy,
                            turn: state.turn === 'white' ? 'black' : 'white',
                            originalPawns: pawnsLocations,
                            win: state.win,
                            deadPieces,
                            completedMoves: [
                                ...state.completedMoves,
                                completedMove,
                            ],
                        };
                    }
                }
                if (payload.newCol === 1 && payload.newRow === 7) {
                    if (pieces.RW1[0] === 0 && pieces.RW1[1] === 7 && boardLocs[2][7] === null) {
                        boardLocsCopy[payload.oldCol][payload.oldRow] = null;
                        boardLocsCopy[payload.newCol][payload.newRow] = movedColor;
                        boardLocsCopy[2][7] = movedColor;
                        return {
                            pieces: {
                                ...pieces,
                                [payload.piece]: [payload.newCol, payload.newRow, payload.type],
                                RW1: [2, 7, 'whiteRook'],
                            },
                            boardLocs: boardLocsCopy,
                            turn: state.turn === 'white' ? 'black' : 'white',
                            originalPawns: pawnsLocations,
                            win: state.win,
                            deadPieces,
                            completedMoves: [
                                ...state.completedMoves,
                                completedMove,
                            ],
                        };
                    }
                }
                if (payload.newCol === 1 && payload.newRow === 0) {
                    if (pieces.RB1[0] === 0
                        && pieces.RB1[1] === 0
                        && boardLocs[2][0] === null
                        && boardLocs[3][0] === null
                    ) {
                        boardLocsCopy[payload.oldCol][payload.oldRow] = null;
                        boardLocsCopy[payload.newCol][payload.newRow] = movedColor;
                        boardLocsCopy[2][0] = movedColor;
                        return {
                            pieces: {
                                ...pieces,
                                [payload.piece]: [payload.newCol, payload.newRow, payload.type],
                                RB1: [2, 0, 'blackRook'],
                            },
                            boardLocs: boardLocsCopy,
                            turn: state.turn === 'white' ? 'black' : 'white',
                            originalPawns: pawnsLocations,
                            win: state.win,
                            deadPieces,
                            completedMoves: [
                                ...state.completedMoves,
                                completedMove,
                            ],
                        };
                    }
                }
                if (payload.newCol === 6 && payload.newRow === 7) {
                    if (pieces.RW2[0] === 7
                        && pieces.RW2[1] === 7
                        && boardLocs[6][7] === null
                        && boardLocs[5][7] === null
                    ) {
                        boardLocsCopy[payload.oldCol][payload.oldRow] = null;
                        boardLocsCopy[payload.newCol][payload.newRow] = movedColor;
                        boardLocsCopy[5][7] = movedColor;
                        return {
                            pieces: {
                                ...pieces,
                                [payload.piece]: [payload.newCol, payload.newRow, payload.type],
                                RW2: [5, 7, 'whiteRook'],
                            },
                            boardLocs: boardLocsCopy,
                            turn: state.turn === 'white' ? 'black' : 'white',
                            originalPawns: pawnsLocations,
                            win: state.win,
                            deadPieces,
                            completedMoves: [
                                ...state.completedMoves,
                                completedMove,
                            ],
                        };
                    }
                }
            }
            boardLocsCopy[payload.oldCol][payload.oldRow] = null;
            boardLocsCopy[payload.newCol][payload.newRow] = movedColor;

            return {
                pieces: {
                    ...pieces,
                    [payload.piece]: [payload.newCol, payload.newRow, payload.type],
                },
                boardLocs: boardLocsCopy,
                turn: state.turn === 'white' ? 'black' : 'white',
                originalPawns: pawnsLocations,
                win: state.win,
                deadPieces,
                completedMoves: [
                    ...state.completedMoves,
                    completedMove,
                ],
            };
        }
        case CAPTURE_PIECE: {
            const capturingColor = boardLocs[payload.oldCol][payload.oldRow];
            boardLocsCopy[payload.oldCol][payload.oldRow] = null;
            boardLocsCopy[payload.newCol][payload.newRow] = capturingColor;
            let gameOver = win;
            const deadPieceCode = pieces[payload.killedPiece][2];
            if (payload.killedPiece === 'KB' || payload.killedPiece === 'KW') {
                gameOver = capturingColor;
            }
            return {
                pieces: {
                    ...pieces,
                    [payload.killedPiece]: null,
                    [payload.piece]: [payload.newCol, payload.newRow, payload.type],
                },
                boardLocs: boardLocsCopy,
                originalPawns: state.originalPawns,
                turn: state.turn === 'white' ? 'black' : 'white',
                win: gameOver,
                deadPieces: {
                    ...deadPieces,
                    [payload.killedPiece]: deadPieceCode,
                },
                completedMoves: [
                    ...state.completedMoves,
                    completedMove,
                ],
            };
        }

        default: return state;
    }
}
