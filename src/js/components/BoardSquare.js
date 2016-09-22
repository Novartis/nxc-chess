/* Copyright 2016 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */
/* eslint new-cap: 0 */
import React, { Component, PropTypes as Type } from 'react';
import { bindActionCreators } from 'redux';
import { connect as connectRedux } from 'react-redux';
import { DropTarget } from 'react-dnd';
import Square from './Square';
import * as boardActions from './boardActions';
import ItemTypes from './Constants';
import canPieceMove from './pieceMoves';

class BoardSquare extends Component {
    renderOverlay(color) {
        return (
            <div
              style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '100%',
                  zIndex: 1,
                  opacity: 0.5,
                  backgroundColor: color,
              }}
            />
        );
    }
    render() {
        const { x, y, connectDropTarget, isOver, canDrop } = this.props;
        const dark = (x + y) % 2 === 1;

        return connectDropTarget(
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Square dark={dark}>
                {this.props.children}
            </Square>
            {!isOver && canDrop && this.renderOverlay('gray')}
            {isOver && this.renderOverlay('darkGray')}
            </div>
        );
    }
}

const squareTarget = {
    drop(props, monitor, component) {
        const item = monitor.getItem();
        const [oldX, oldY, type] = props.pieces[item.id];
        if (component.props.children) {
            props.capturePiece(
                item.id,
                component.props.children.props.id,
                props.x,
                props.y,
                oldX,
                oldY,
                type);
        } else {
            props.movePiece(item.id, props.x, props.y, oldX, oldY, type);
        }
    },
    canDrop(props, monitor) {
        const item = monitor.getItem();
        const [oldX, oldY, type] = props.pieces[item.id];
        return canPieceMove(
            oldX,
            oldY,
            type,
            props.x,
            props.y,
            props.squareOccupied,
            props.boardLocs,
            props.originalPawns,
            item.id);
    },
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    };
}
BoardSquare.propTypes = {
    x: Type.number,
    y: Type.number,
    occupied: Type.bool,
    connectDropTarget: Type.func,
    canDrop: Type.bool,
    isOver: Type.bool,
    children: Type.node,
};

function mapStateToProps(state) {
    return { pieces: state.pieces.pieces,
        boardLocs: state.pieces.boardLocs,
        originalPawns: state.pieces.originalPawns };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        capturePiece: boardActions.capturePiece,
        movePiece: boardActions.movePiece,
    }, dispatch);
}

export default connectRedux(mapStateToProps, mapDispatchToProps)(
    DropTarget(ItemTypes.PIECE, squareTarget, collect)(BoardSquare)
);
