import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import GoogleLogin from "react-google-login";
import FacebookLogin from 'react-facebook-login';
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import {
  googleLogin,
  signUpInfo,
  loginInfo,
  forgetInfo,
  facebookLogin
  
} from "../../../service/login/action";
   
import InputField from "../../Fields/TextField";

class SignIn extends Component {
  static propTypes = {
    onHide: PropTypes.func,
    isdivHide: PropTypes.bool,
    isLandingSingup: PropTypes.bool
  };

  state = {
    isdivHide: true,
    isSignUpHide: false,
    isforget:false
 
  };


  handleSignUp = event => {
    event.preventDefault();
    this.setState({ isSignUpHide: true });
    this.setState({ isdivHide: false });
  };
  
 handleForget=event=>{
   event.preventDefault();
   this.setState({ isforget: !this.state.isforget  });
   this.setState({isSignUpHide:false})
   this.setState({ isdivHide: false });
 }

  fSignIn = (event) => {
    event.preventDefault();

    this.setState({ isSignUpHide: false });
    this.setState({ isdivHide: true });
    this.setState({ isforget: false });
  }
  SignIn = event => {
    event.preventDefault();
    this.setState({ isSignUpHide: false });
    this.setState({ isdivHide: true });

    this.handleFormInitialValues()
  };

  handleFormInitialValues = () => {
    this.props.initialize({
      email: "",
      password: "",
      name: "",
      isActive: false,
      isSignup: false,
      emailSignUp: "",
      passwordSignup: ""
    });
  };

  signUpSubmit = value => {

     const payload = {
      name: value.name,
      email: value.emailSignUp ? value.emailSignUp.toLowerCase() : "",
      password: value.passwordSignup
    };
    sessionStorage.setItem("signUpInfo" ,JSON.stringify(payload))
    this.props.signUpInfo(payload);
    this.props.onHide();

  };

  forgetSubmit=value=>{
       const payload = {
           email: value.forgetEmail,
       }
   this.props.forgetInfo(payload);
   this.props.onHide();

  }

  signInSubmit = value => { 
    console.log(value)
       const payload = {
        email :value.email ? value.email.toLowerCase(): "",
        password : value.password
       };
      this.props.loginInfo(payload);
      this.props.onHide();


  };

  responseGoogle = response => {
    if (response && response.profileObj) {
      const loginInfo = {
        email:  response.profileObj.email,
        name:   response.profileObj.name
      };
      this.props.googleLogin(loginInfo);
      this.props.onHide();
    }
  };

  responseFacebook =(response)=> {
    if (response) {
      const loginInfo = {
        email: response.email,
        name: response.name
      };
      if(response.email && response.name){
        this.props.facebookLogin(loginInfo);
        this.props.onHide();
      }
           
    }

  }

  componentDidMount(){
    if(this.props.emailAuto){
      this.props.initialize({
        email:this.props.emailAuto,
      });
    }
  }
  render() {
    const { handleSubmit ,pristine , submitting} = this.props;

    return (
      <div
        className="modal backgroundDark"
        id="myModal"
        style={{ display: "block" }}
      >
        <div className="modal-dialog signInPopup">
          {this.state.isdivHide === true && (
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">SIGN IN</h4>
                <button
                  type="button"
                  onClick={this.props.onHide}
                  className="close"
                >
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <div className="socialBtnGroup">
           
                  {/* <button type="button">
                    <img src="images/facebook.png" alt="" /> Facebook
                  </button> */}
                  {/* 707462947564-qtf2jjoh79k1mlqcjkmh6tlanjeu30rn.apps.googleusercontent.com  - local*/}
                  {/* 185146778875-qlgp8o649sibhifmvj3nrtv99bujmrjt.apps.googleusercontent.com  -live*/}
                  		<div className="row">
                        <div className="col-6">
                        <FacebookLogin
					
          textButton="Facebook"
          cssClass="facebookbtn"
          icon="fa-facebook-official faceiconSize"
          appId="480006115898320"
          autoLoad={false}
              
          fields="name,email,picture"
          callback={this.responseFacebook}
          />

                        </div>
                        <div className="col-6">
                        <GoogleLogin
                    clientId="643382598190-67fbmn63hpuida5kblv2vcgim9cb2oke.apps.googleusercontent.com"
                    buttonText="Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                  >
                    Google
                  </GoogleLogin>

                        </div>
                      </div>
               
                
                </div>
                <div className="signWithEmail">
                  <hr />
                  <h6>or Sign in with Email</h6>
                  <hr />
                </div>
                <form onSubmit={handleSubmit(this.signInSubmit)}>
                  <div className="signInForm">
                    <div className="form-group mailIcon">
                      <Field
                        id="emailsignup"
                        name="email"
                        type="text"
                        value=""
                        label="Email Address"
                        component={InputField}
                        placeholder="Email Address"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group passwordIcon">
                      <Field
                        name="password"
                        type="password"
                        value=""
                        label="Password"
                        component={InputField}
                        placeholder="Password"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      {/* <Field
                        name="isActive"
                        type="checkbox"
                        label="Keep me signed in"
                        component={CheckField}
                      /> */}
                      {/* <NavLink
                        to={"/ForgotPassword"}
                        href=""
                        className="forgotLink commonLink"
                      >
                        Forgot Password
                      </NavLink> */}
                      <a href="/" onClick={this.handleForget}>
                        {" "}
                        Forgot Password
                      </a>{" "}
                    </div>
                    <div className="form-group">
                      <button className="searchBtn" type="submit" disabled={pristine || submitting}>
                        SIGN IN
                      </button>
                      <div className="dontHaveAccount">
                        Don't have an acount?{" "}
                        <a href="/" onClick={this.handleSignUp}>
                          {" "}
                          Create Account
                        </a>{" "}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {this.state.isSignUpHide === true && (
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">CREATE YOUR ACCOUNT</h4>
                <button
                  type="button"
                  className="close"
                  onClick={this.props.onHide}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <h6>Create an account for members-only deals </h6>
                <div className="socialBtnGroup">
                  {/* <button type="button">
                    <img src="images/facebook.png" alt="" /> Facebook
                  </button> */}
                     		 <div className="row">
                          <div className="col-6"> <FacebookLogin
                 
                 textButton="Facebook"
                 cssClass="facebookbtn"
                 icon="fa-facebook-official faceiconSize"
                 appId="480006115898320"
                 autoLoad={false}
                     
                 fields="name,email,picture"
                 callback={this.responseFacebook}
                 /></div>
                         <div className="col-6">  <GoogleLogin
                    clientId="643382598190-67fbmn63hpuida5kblv2vcgim9cb2oke.apps.googleusercontent.com"      
                   buttonText="Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                  >
                    Google
                  </GoogleLogin></div>
                        
                          </div>
                
                
                </div>
                <div className="signWithEmail">
                  <hr />
                  <h6>or Sign Up with Email</h6>
                  <hr />
                </div>
                <form onSubmit={handleSubmit(this.signUpSubmit)}>
                  <div className="signInForm">
                    <div className="form-group userIcon">
                      <Field
                        name="name"
                        type="text"
                        label="Name"
                        component={InputField}
                        placeholder="Name"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group mailIcon">
                      <Field
                        name="emailSignUp"
                        type="text"
                        label="Email Address"
                        component={InputField}
                        placeholder="Email Address"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group passwordIcon">
                      <Field
                        name="passwordSignup"
                        type="password"
                        label="Password"
                        component={InputField}
                        placeholder="Password"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <NavLink
                        to={"/"}
                        href=""
                        className="forgotLink commonLink"
                      >
                        {" "}
                        {/* Forgot Password */}
                      </NavLink>
                    </div>
                    <div className="form-group">
                      <button className="searchBtn" type="submit" disabled={pristine || submitting}>
                        CREATE ACCOUNT
                      </button>
                      <div className="dontHaveAccount">
                        Already a member?{" "}
                        <a href="/" onClick={this.SignIn}>
                          Sign In{" "}
                        </a>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {this.state.isSignUpHide == false && this.state.isdivHide === false && this.state.isforget ===true && (
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">FORGOT PASSWORD</h4>
                <button
                  type="button"
                   onClick={this.props.onHide} 
                  className="close"
                >
                  &times;
                </button>
               
              </div>
   {this.props.isforget == true && <span style={{color:'red',float:"left"}}>{this.props.forgetPasswordDetails.data}</span>}
              <div className="modal-body">
                <form onSubmit={handleSubmit(this.forgetSubmit)}>
                  <div className="signInForm">
                    <div className="form-group mailIcon">
                      <Field
                        name="forgetEmail"
                        type="text"
                        value=""
                        label="Email Address"
                        component={InputField}
                        placeholder="Email Address"
                        className="form-control"
                      />
                    </div>
                    <div className="dontHaveAccount">
                      
                      <a href="/" onClick={this.fSignIn}>
                       Go to Sign In
                      </a>
                    </div>

                    <div className="form-group">
                      <button className="searchBtn" type="submit" disabled={pristine || submitting}>
                        SEND
                      </button>
                      
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const signInValidate = formProps => {
  const errors = {};

  if (!formProps.name) {
        errors.name = "Required";
  } else if(!/(.*[a-z]){3}/i.test(formProps.name)){
    errors.name = "Name must be mininum of two characters";
  }
  if (!formProps.forgetEmail) {
    errors.forgetEmail = "Required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formProps.forgetEmail)
  ) {
    errors.forgetEmail = "Invalid email address";
  } 

  if (!formProps.email) {
    errors.email = "Required";
  } else if ( !/^[a-zA-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formProps.email))
  {
    errors.email = "Invalid email address";
  }

  if (!formProps.password) {
    errors.password = "Required";
  }
  if (!formProps.emailSignUp) {
    errors.emailSignUp = "Required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formProps.emailSignUp)
  ) {
    errors.emailSignUp = "Invalid email address";
  }

  if (!formProps.passwordSignup) {
    errors.passwordSignup = "Required";
  }

  // if (!formProps.passwordSignup) {
  //   errors.passwordSignup = "Required";
  // } else if (
  //    !/^[0-9A-Za-z]{6,}$/.test(
  //     formProps.passwordSignup
  //   )
  // ) {
  //   errors.passwordSignup = "Password must be minimum of 8 characters";
  // }

  return errors;
};

const mapStateToProps = state => ({
  loginDetails: state.loginReducer.loginDetails,
  signupDetails: state.loginReducer.signupDetails,
  isSignUp: state.loginReducer.isSignUp,
  forgetPasswordDetails: state.loginReducer.forgetPasswordDetails,
  isforget: state.loginReducer.isforget
});

const mapDispatchToProps = dispatch => ({
  googleLogin: loginInfo => dispatch(googleLogin(loginInfo)),
  signUpInfo: value => dispatch(signUpInfo(value)),
  loginInfo: (value) => dispatch(loginInfo(null ,value ,null)),
  forgetInfo:value=>dispatch(forgetInfo(value)),
  facebookLogin: value => dispatch(facebookLogin(value))

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: "signIn",
    validate: signInValidate
  })(SignIn)
);
