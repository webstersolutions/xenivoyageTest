import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import GoogleLogin from "react-google-login";
import FacebookLogin from 'react-facebook-login';
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { googleLogin, signUpInfo, loginInfo , facebookLogin } from "../../../service/login/action";
import InputField from "../../Fields/TextField";

class LandingSignin extends Component {
  static propTypes = {
    onHide: PropTypes.func,
    isdivHide: PropTypes.bool,
    isLandingSingup: PropTypes.bool
  };

  state = {
    isdivHide: this.props.isdivHide,
    isSignUpHide: false
  };

  handleSignUp = event => {
    event.preventDefault();
    this.setState({ isSignUpHide: true });
    this.setState({ isdivHide: false });
  };

  SignIn = event => {
    event.preventDefault();
    this.setState({ isSignUpHide: false });
    this.setState({ isdivHide: true });
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

  signInSubmit = value => {
    this.props.loginInfo(value);
    this.props.onHide();

  };

  responseGoogle = response => {
    if (response) {
      const loginInfo = {
        email: response.profileObj.email,
        name: response.profileObj.name
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

  render() {
    const { handleSubmit } = this.props;

    return (
      <div
        className="modal backgroundDark"
        id="myModal"
        style={{ display: "block" }}
      >
    <div className="modal-dialog signInPopup">
     
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
                     		
                 <FacebookLogin
                 
                 textButton="Facebook"
                 cssClass="facebookbtn"
                 icon="fa-facebook-official faceiconSize"
                 appId="480006115898320"
                 autoLoad={false}
                     
                 fields="name,email,picture"
                 callback={this.responseFacebook}
                 />
                  <GoogleLogin
                    clientId="643382598190-67fbmn63hpuida5kblv2vcgim9cb2oke.apps.googleusercontent.com"
                    buttonText="Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                  >
                    Google
                  </GoogleLogin>
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
                      {/* <Field
                        name="isSignup"
                        type="checkbox"
                        label="Keep me signed in"
                        component={CheckField}
                      /> */}
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
                      <button className="searchBtn" type="submit">
                     Sign Up
                      </button>
                    
                    </div>
                  </div>
                </form>
              </div>
            </div>
         </div>
      </div>
    );
  }
}

const signInValidate = formProps => {
  const errors = {};
  if (!formProps.name) {
    errors.name = "Required";
  }
  if (!formProps.email) {
    errors.email = "Required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formProps.email)
  ) {
    errors.email = "Invalid Email Address";
  }
  if (!formProps.password) {
    errors.password = "Required";
  }
  if (!formProps.emailSignUp) {
    errors.emailSignUp = "Required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formProps.emailSignUp)
  ) {
    errors.emailSignUp = "Invalid Email Address";
  }

  if (!formProps.passwordSignup) {
    errors.passwordSignup = "Required";
  }
  //  else if (!/^[0-9A-Za-z]{6,}$/.test(
  //     formProps.passwordSignup
  //   )
  // ) {
  //   errors.passwordSignup = "Password must be minimum of 8 characters";
  // }
  return errors;
};

const mapStateToProps = state => ({
  loginDetails: state.loginReducer.loginDetails
 
});
const mapDispatchToProps = dispatch => ({
  googleLogin: loginInfo => dispatch(googleLogin(loginInfo)),
  signUpInfo: value => dispatch(signUpInfo(value)),
  loginInfo: value => dispatch(loginInfo(value)),
  facebookLogin: value => dispatch(facebookLogin(value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: "signIn",
    validate: signInValidate
  })(LandingSignin)
);
