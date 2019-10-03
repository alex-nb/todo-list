import React, { Fragment } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import TodoList from './components/todo-list';
import Task from './components/task';
import Alert from './components/layout/alert';

function App() {
  return (
    <Fragment>
      <Alert />
      <Switch>
        <Route
          path='/'
          exact
          render={()=>(<TodoList/>)}
        />
        <Route
          path='/:taskId'
          exact
          render={(props)=>(<Task {...props}/>)}
        />
        <Redirect to="/" />
      </Switch>
    </Fragment>
  );
}

export default withRouter(App);
