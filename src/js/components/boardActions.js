/* Copyright 2016 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */
export const MOVE_PIECE = 'MOVE_PIECE';
export const CAPTURE_PIECE = 'CAPTURE_PIECE';

export function movePiece(piece, toX, toY, oldX, oldY, type) {
    return {
        type: MOVE_PIECE,
        payload: {
            piece,
            newCol: toX,
            newRow: toY,
            oldCol: oldX,
            oldRow: oldY,
            type,
        },
    };
}

export function capturePiece(piece, killedPiece, toX, toY, oldX, oldY, type) {
    return {
        type: CAPTURE_PIECE,
        payload: {
            piece,
            killedPiece,
            newCol: toX,
            newRow: toY,
            oldCol: oldX,
            oldRow: oldY,
            type,
        },
    };
}
