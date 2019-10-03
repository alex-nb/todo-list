import React, { useEffect } from 'react';
import openSocket from 'socket.io-client';
import {List, ListItem, ListItemSecondaryAction, ListItemText, Checkbox, IconButton, Typography} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import TaskForm from './task-form';
import {getTodoList, deleteTask, updateTask, add, update, remove} from '../actions/tasks';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from './layout/spinner';
import './style.css';

const TodoList = ({ getTodoList, deleteTask, updateTask, tasks, loading, add, update, remove }) => {

    useEffect(() => {
        const socket = openSocket(process.env.REACT_APP_BASE_URL);
        socket.on('task', data => {
            if (data.action === 'create') {
                add(data.task);
            } else if (data.action === 'update') {
                update(data.task);
            } else if (data.action === 'delete') {
                remove(data.task);
            }
        });
    }, []);

    useEffect(() => {
        getTodoList();
    }, [getTodoList]);

    return loading ? (<Spinner/>) :
    (
        <List className="container">
            <Typography component="h1" variant="h2">
                Todos
            </Typography>
            <TaskForm />
            {tasks.map((task) => (
                <ListItem key={task._id} dense className="list-item">
                    <Checkbox 
                        tabIndex={-1} 
                        disableRipple 
                        onClick={() => {updateTask({id: task._id, data: {completed: !task.completed}})}}
                        checked={task.completed}
                    />
                    <Link to={`/${task._id}`} className='task'>
                        <ListItemText  
                            className={task.completed ? 'close-task' : 'task'} 
                            primary={task.title}
                        />
                    </Link>
                    
                    
                    <ListItemSecondaryAction>
                    <IconButton
                        aria-label="Delete"
                        onClick={() => {deleteTask(task._id)}}
                    >
                        <DeleteIcon />
                    </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
        ))}
        </List>
    );
};

const mapStateToProps = ({ todoList }) => {
    const { tasks, loading } = todoList;
    return { tasks, loading };
};

export default connect(mapStateToProps, {getTodoList, deleteTask, updateTask, add, update, remove})(TodoList);