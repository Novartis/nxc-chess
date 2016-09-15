/* Copyright 2016 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

/* eslint no-undef: 0 */
/**
 * Entry point for LOCAL development using the default gulp task.
 *
 * This file will not be part of the final npm publish bundle. See
 * /lib after running `gulp bundle:component` for publishable files.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import BoardRootContainer from './root/BoardRootContainer';

ReactDOM.render(<div>
        <BoardRootContainer />
    </div>,
    document.getElementById('content')
);
