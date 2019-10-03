import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import {addTask} from '../actions/tasks';

const TodoForm = ({addTask}) => {

    const [title, setTitle] = useState('');

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                addTask({title: title});
                setTitle('');
            }}
        >
        <TextField
            className="new-task"
            variant="outlined"
            placeholder="New task"
            margin="normal"
            onChange={e => setTitle(e.target.value)}
            value={title}
        />
        </form>
    );
};

export default connect(null, { addTask })(TodoForm);
