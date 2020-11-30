import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { User } from '../models/User';

interface LoggedInObject {
  status: boolean;
  fromAuth: boolean;
}

interface Props {
  component: React.ComponentType<any>;
  authUser: User | null;
  path: string[] | string;
}

const PublicRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const { authUser } = rest;
  let to: string = '/';

  return (
    <Route {...rest} render={props => authUser ? (<Redirect to={to} />) : ( <Component {...props} /> )} />
  );
};

export default PublicRoute;