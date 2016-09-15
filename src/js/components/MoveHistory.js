/* Copyright 2016 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */
import React, { Component, PropTypes as Type } from 'react';
import { connect } from 'react-redux';

class MoveHistory extends Component {
    static propTypes = {
        completedMoves: Type.array,
    };

    renderMove(move, number) {
        const turn = number + 1; // Start at 1 not 0.
        const color = move.color;
        const action = move.killedPiece ? `captured ${move.killedPiece} at ` : 'to';
        // Column letter: a - h is char code 97 - 104.
        // Row number: chess notation will be opposite of the numbers in the logical grid.
        const position = `${String.fromCharCode(move.newCol + 97)}${8 - move.newRow}`;
        const string = `${turn}. ${color}: ${move.piece} ${action} ${position}`;
        const key = string; // Enforced uniqueness by move and turn number.
        return (
            <div key={key} style={{ fontSize: '10px' }}>
                { string }
            </div>);
    }

    render() {
        const { completedMoves } = this.props;
        const completedMoveViews = [];

        const numMoves = completedMoves.length;

        for (let key = 0; key < numMoves; key++) {
            const move = completedMoves[key];
            const moveView = this.renderMove(move, Math.floor(key / 2));
            completedMoveViews.push(moveView);
        }

        return (
            <div style={{ overflow: 'hidden', padding: '10px', paddingTop: '0px' }}>
                <h2 style={{ marginTop: '0px', marginBottom: '5px' }} > Move History </h2>
                { completedMoveViews }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { completedMoves: state.pieces.completedMoves };
}

export default connect(mapStateToProps)(MoveHistory);
