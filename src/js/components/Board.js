/* Copyright 2016 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */
import React, { Component, PropTypes as Type } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import BoardSquare from './BoardSquare';
import pieceCodes from './pieceCodes';
import Piece from './Piece';

import Sidebar from './Sidebar';

/**
 * This is the root react component. Replace everything in here
 * with your logic. Displayed below is a Pure React component
 * which is likely too simple for most needs so replace it with
 * a full class instead.
 *
 * Both index.js (the dev file) and main.js (the prod exporting
 * file) import the default class exported by this file so feel
 * free to change anything but always `export default` your root
 * component.
 */
class Board extends Component {
    static propTypes = {
        pieces: Type.object,
        win: Type.string,
    };

    renderPiece(x, y) {
        const numPieces = Object.keys(this.props.pieces).length;

        for (let key = 0; key < numPieces; key++) {
            const desiredPiece = Object.keys(this.props.pieces)[key];
            if (this.props.pieces[desiredPiece]) {
                const [pieceX, pieceY, pieceType] = this.props.pieces[desiredPiece];
                const { color, type, unicode } = pieceCodes[pieceType];

                if ((pieceX === x) && (pieceY === y)) {
                    return <Piece id={desiredPiece} color={color} type={type} unicode={unicode} />;
                }
            }
        }
        return null;
    }

    renderSquare(i) {
        const x = i % 8;
        const y = Math.floor(i / 8);

        const piece = this.renderPiece(x, y);
        return (
            <div
              key={i}
              style={{ height: '12.5%', width: '12.5%' }}
            >
                <BoardSquare x={x} y={y} squareOccupied={piece ? piece.props.color : 'null'} >
                    {piece}
                </BoardSquare>
            </div>
        );
    }

    render() {
        const { win } = this.props;
        const squares = [];
        for (let i = 0; i < 64; i++) {
            const square = this.renderSquare(i);
            squares.push(square);
        }
        return (
            <div style={{ height: '100%', width: '100%', display: 'flex', flexWrap: 'wrap' }}>

                {squares}
                <Sidebar win={win} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { pieces: state.pieces.pieces,
            win: state.pieces.win };
}

export default connect(mapStateToProps)(DragDropContext(HTML5Backend)(Board));

