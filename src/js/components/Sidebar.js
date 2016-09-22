/* Copyright 2016 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */
import React, { Component, PropTypes as Type } from 'react';
import { connect } from 'react-redux';
import Piece from './Piece';
import pieceCodes from './pieceCodes';


class Sidebar extends Component {
    static propTypes = {
        turn: Type.string,
        win: Type.string,
        deadPieces: Type.object,
    };
    renderDeadPiece(pieceId, color, type, unicode) {
        return (
            <div
              key={pieceId}
              style={{ height: '50px', width: '50px', float: 'left', position: 'relative' }}
            >
                <Piece id={pieceId} color={color} type={type} unicode={unicode} />
            </div>);
    }
    render() {
        const { turn, win } = this.props;
        if (win !== 'null') {
            return (
                <div>
                {win} Wins!
                </div>
            );
        }
        const deadPieceViews = [];

        const numDeadPieces = Object.keys(this.props.deadPieces).length;

        for (let key = 0; key < numDeadPieces; key++) {
            const desiredPiece = Object.keys(this.props.deadPieces)[key];
            const pieceType = this.props.deadPieces[desiredPiece];
            const { color, type, unicode } = pieceCodes[pieceType];
            const deadPieceView = this.renderDeadPiece(desiredPiece, color, type, unicode);
            deadPieceViews.push(deadPieceView);
        }


        return (
            <div style={{ height: '75px', width: '500px', position: 'relative' }}>
                <h> Right now it is {turn}'s turn. </h>
                <div style={{ height: '75px', width: '500px', display: 'flex', flexWrap: 'wrap' }}>
                    {deadPieceViews}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { turn: state.pieces.turn,
            deadPieces: state.pieces.deadPieces };
}

export default connect(mapStateToProps)(Sidebar);
