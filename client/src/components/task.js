import React, { Fragment, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from './layout/spinner';
import { getTask, updateTask } from '../actions/tasks';
import {TextField, Button, Typography} from '@material-ui/core';
import './style.css';

const Task = ({getTask, updateTask, task, match, history}) => {
    const [title, setTitle] = useState('');

    useEffect(() => {
        getTask(match.params.taskId);
    }, [getTask]);

    useEffect(() => {
        if (task && title !== task.title) setTitle(task.title);
    }, [task])

    return task === null ? (
        <Spinner />
      ) : (
        <Fragment>
            <Typography component="h2" variant="h3" className='container'>
                Edit task
            </Typography>
          <form
                onSubmit={e => {
                    e.preventDefault();
                    updateTask({id: match.params.taskId, data: {title: title}}, history);
                    setTitle('');
                }}
           >
                <TextField
                    className="edit-task"
                    variant="outlined"
                    margin="normal"
                    onChange={e => setTitle(e.target.value)}
                    value={title}
                />
                <div className='buttons'>
                    <Link to='/' className='task'>
                        <Button size="large" className='button-left' variant="contained">
                            Back
                        </Button>
                    </Link>
                    <Button size="large" className='button-right' type="submit" variant="contained" color="primary">Save</Button>
                </div>
            </form>
        </Fragment>
      );
};

const mapStateToProps = ({ todoList }) => {
    const { task } = todoList;
    return { task };
};

export default connect(mapStateToProps, { getTask, updateTask })(withRouter(Task));
  