import React from 'react';
import './App.css';
import { Router, Switch, Route } from 'react-router';
import history from './shared/history';
import PrivateRoute from './shared/PrivateRoute';
import PublicRoute from './shared/PublicRoute';
import Authentication from './features/auth/components/Authentication';
import Registration from './features/auth/components/Registration';
import 'bootstrap/dist/css/bootstrap.min.css';
import FrontPage from './features/frontpage/components/FrontPage';
import { selectAuthUser } from './features/auth/authSlice';
import { useSelector } from 'react-redux';
import ScrollToTop from './shared/ScrollToTop';
import CreatePost from './features/create-post/components/CreatePost';
import { Container } from 'react-bootstrap';
import Thread from './features/thread/components/Thread';

function App() {
  const authUser = useSelector(selectAuthUser);

  return (
    <Container className="h-100">
      <Router history={history}>
        <Switch>
          <Route path='/auth'>
            <PublicRoute authUser={authUser} component={Authentication} path='/auth' />
          </Route>
          <Route path='/register'>
            <PublicRoute authUser={authUser} component={Registration} path='/register' />
          </Route>
          <Route path="/p/:page">
            <ScrollToTop />
            <PrivateRoute path='/p/:page' exact component={FrontPage} />
          </Route>
          <Route path="/t/:thread">
            <PrivateRoute path='/t/:thread' exact component={Thread} />
          </Route>
          <Route path="/create_post">
            <PrivateRoute path='/create_post' exact component={CreatePost} />
          </Route>
          <Route component={() => <h1>404!</h1>} />
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
