import React from 'react';
import { Route } from 'react-router-dom';

interface AdditionalPropType {
  type: string;
}

interface LoggedInObject {
  status: boolean;
  fromAuth: boolean;
}

interface Props {
  component: React.ComponentType<any>;
  additionalProps?: AdditionalPropType;
  path: string[] | string;
  exact?: boolean;
}

const PrivateRoute: React.FC<Props> = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => <Component {...props} {...rest.additionalProps} />} />
);

export default PrivateRoute; 