import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
 

const AuthRoute = ({ component: Component, ...rest }) => {
 
  return <Route {...rest} render={(props) => (
    
      rest.loginStatus === true ? 
        <Component {...props} /> : <Redirect to={{ pathname: '/', state: { from: props.location }}} />   
  )} />
}
const mapStateToProps = state => ({
  loginStatus: state.loginReducer.loginStatus,
    
})
export default connect(mapStateToProps)(AuthRoute)