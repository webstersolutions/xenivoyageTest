import React, { Component } from 'react';
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import InputField from '../../../component/Fields/TextField'
import propTypes from 'prop-types';

import {
  
    forgetInfo
    
  } from "../../../service/login/action";
class ResetPassword extends Component {
    static propTypes = {
        resetPassword: propTypes.func
    }
    handleFormInitialValues = () => {
        this.props.initialize({
            current_password: "",
            new_password: "",
            confirm_password: ""
        })
    }

    getPassword = (event) => {
        event.preventDefault();
        const { loginDetails } = this.props;
        const payload = {
            email: loginDetails.email,
        }
        this.props.forgetInfo(payload);
     

    }

    render() {
        const { handleSubmit } = this.props;
        const userSession = JSON.parse(sessionStorage.getItem('loginInfo'));
        
        return (
            <div>
                <h5>Change Password</h5>
                <form onSubmit={handleSubmit(this.props.resetPassword)}>
                    <div className="row">
                        <div className="col-sm-12 col-md-4 col-lg-4">
                            <div className="form-group passwordIcon">
                                <Field
                                    name="current_password"
                                    type="password"
                                    label="Current Password"
                                    component={InputField}
                                    placeholder="Current Password"
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4 col-lg-4">
                            <div className="form-group passwordIcon">
                                <Field
                                    name="new_password"
                                    type="password"
                                    label="New Password"
                                    component={InputField}
                                    placeholder="New Password"
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4 col-lg-4">
                            <div className="form-group passwordIcon">
                                <Field
                                    name="confirm_password"
                                    type="password"
                                    label="Confirm New Password"    
                                    component={InputField}
                                    placeholder="Confirm New Password"
                                    className="form-control"
                                />
                            </div>
                        </div>
                        
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <p> If you signed up for Xeniapp using Google, please <a href="/" onClick={this.getPassword}> create an account password</a> </p>
                            <button className="searchBtn float-right mb-3">Change Password</button>
                        </div>
                    </div>
                </form>
            </div>

        )
    }


}

const validatePassword = formProps => {
    const errors = {};
    if(!formProps.current_password){
        errors.current_password = "Required";
    }
  
   if (!formProps.new_password) {
      errors.new_password = "Required";
    }
    //  else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.{8,})/.test(formProps.new_password )) {
    //   errors.new_password = "Password must be minimum of 8 characters and should contain 1 uppercase 1 lowercase 1 digit 1 special character";
    // }
    if(!formProps.confirm_password)
    {
      errors.confirm_password="Required"
    }else if(!(formProps.new_password === formProps.confirm_password))
    {
       errors.confirm_password="password mismatch"
    }
    return errors;
  };


const mapStateToProps = state => ({

    loginDetails: state.loginReducer.loginDetails,
    
  });
  
  const mapDispatchToProps = dispatch => ({
    forgetInfo:value=>dispatch(forgetInfo(value)),
     
  });


export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    reduxForm({
      form: "resetForm",
      validate: validatePassword
    })(ResetPassword)
  );
  