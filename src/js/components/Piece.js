/* Copyright 2016 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */
import React, { Component, PropTypes as Type } from 'react';
import { DragSource } from 'react-dnd';
import { connect as connectRedux } from 'react-redux';
import ItemTypes from './Constants';

const pieceSource = {
    beginDrag(props) {
        return { id: props.id };
    },
    canDrag(props) {
        const { color, turn } = props;
        return turn === color;
    },
};
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    };
}

class Piece extends Component {
    static propTypes = {
        type: Type.string,
        color: Type.string,
        unicode: Type.number,
        id: Type.string,
        connectDragSource: Type.func,
        isDragging: Type.bool,
        turn: Type.string,
    };
    render() {
        const { connectDragSource, isDragging } = this.props;
        const style = {
            fontSize: '30px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'move',
            opacity: isDragging ? 0.2 : 1,
        };

        return connectDragSource(<div
          style={style}
        >
                {String.fromCharCode(this.props.unicode)}
            </div>);
    }
}

function mapStateToProps(state) {
    return { turn: state.pieces.turn };
}

export default connectRedux(mapStateToProps)(DragSource(
    ItemTypes.PIECE, pieceSource, collect)(Piece));
