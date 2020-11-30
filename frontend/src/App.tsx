import React from 'react';
import './App.css';
import { Router, Switch, Route } from 'react-router';
import history from './shared/history';
import PrivateRoute from './shared/PrivateRoute';
import PublicRoute from './shared/PublicRoute';
import Authentication from './features/auth/components/Authentication';
import Registration from './features/auth/components/Registration';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FrontPage } from './features/frontpage/FrontPage';
import { selectAuthUser } from './features/auth/authSlice';
import { useSelector } from 'react-redux';

function App() {
  const authUser = useSelector(selectAuthUser);

  return (
    <Router history={history}>
      <Switch>
        <Route path='/auth'>
          <PublicRoute authUser={authUser} component={Authentication} path='/auth' />
        </Route>
        <Route path='/register'>
          <PublicRoute authUser={authUser} component={Registration} path='/register' />
        </Route>
        <Route path="/">
          <PrivateRoute path='/' exact component={FrontPage} />
        </Route>
        <Route component={() => <h1>404!</h1>} />
      </Switch>
    </Router>
  );
}

export default App;
