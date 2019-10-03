import { combineReducers } from 'redux';

import alert from './alert';
import todoList from './tasks';

export default combineReducers({
    todoList,
    alert
});