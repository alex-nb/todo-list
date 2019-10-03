import axios from 'axios';
import { setAlert } from './alert';
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

export const add = (data) => ({
    type: 'ADD_TASK',
    payload: data
});

export const update = (data) => ({
    type: 'UPDATE_TASK',
    payload: data
});

export const remove = (data) => ({
    type: 'DELETE_TASK',
    payload: data
});


export const getTodoList = () => async dispatch => {
    try {
        const res = await axios.get('/todo/tasks');
        dispatch({
            type: 'TASKS_GET',
            payload: res.data.tasks
        });
    } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.errors) {
            const errors = err.response.data.errors;
            if (errors) {
                await errors.forEach(error => dispatch(setAlert(error.msg)));
            }
        }
        dispatch({
            type: 'TASK_ERROR',
            payload: err
        });
    }
};

export const getTask = id => async dispatch => {
    try {
        const res = await axios.get(`/todo/task/${id}`);
        dispatch({
            type: 'TASK_GET',
            payload: res.data.task
        });
    } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.errors) {
            const errors = err.response.data.errors;
            if (errors) {
                await errors.forEach(error => dispatch(setAlert(error.msg)));
            }
        }
        dispatch({
            type: 'TASK_ERROR',
            payload: err
        });
    }
};

export const addTask = formData => async dispatch => {
    const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    try {
        const res = await axios.post('/todo/task', formData, config);
        //dispatch(add(res.data.task));
    } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.errors) {
            const errors = err.response.data.errors;
            if (errors) {
                await errors.forEach(error => dispatch(setAlert(error.msg)));
            }
        }
        dispatch({
            type: 'TASK_ERROR',
            payload: err
        });
    }
};

//update, close task
export const updateTask = (formData, history=null) => async dispatch => {
    const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    try {
        const res = await axios.put(`/todo/task/${formData.id}`, formData.data, config);
        //dispatch(update(res.data.task));
        if (history) {
            history.push('/');
          }
    } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.errors) {
            const errors = err.response.data.errors;
            if (errors) {
                await errors.forEach(error => dispatch(setAlert(error.msg)));
            }
        }
        dispatch({
            type: 'TASK_ERROR',
            payload: err
        });
    }
};

export const deleteTask = id => async dispatch => {
    try {
        await axios.delete(`/todo/task/${id}`);
        //dispatch(remove(id));
    } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.errors) {
            const errors = err.response.data.errors;
            if (errors) {
                await errors.forEach(error => dispatch(setAlert(error.msg)));
            }
        }
        dispatch({
            type: 'TASK_ERROR',
            payload: err
        });
    }
};