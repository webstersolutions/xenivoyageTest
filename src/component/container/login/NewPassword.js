import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import { reduxForm, Field } from "redux-form";
import InputField from "../../Fields/TextField";
import {
  newpasswordInfo,
  forgotPwdVality
} from "../../../service/login/action";
import queryString from "query-string";
import Cryptr from "cryptr";

class NewPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: true,
      email: ""
    };
  }

  componentWillMount = () => {
    const { emailId } = queryString.parse(this.props.location.search);
    this.setState({ email: new Cryptr("myTotalySecretKey").decrypt(emailId) });
  };

  componentDidMount() {
    this.props.forgotPwdVality(this.state.email);
  }

  modelClose = () => {
    this.setState({ model: false });
  };
  newpasswordSubmit = value => {
    const payload = {
      emailId: this.state.email,
      password: value.newPassword,
      confirm_password: value.confirmPassword
    };
    this.props.newpasswordInfo(payload);
    this.modelClose();
    this.props.history.push("/home");
  };

  renderForgetContent = () => {
    const { handleSubmit, forget_validity } = this.props;
    if (forget_validity) {
      return (
        <div className="modal-dialog signInPopup">
          {this.state.model && (
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">FORGOT PASSWORD</h4>
                <button
                  type="button"
                  /* onClick={this.modelClose} */
                  className="close"
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit(this.newpasswordSubmit)}>
                  <div className="signInForm">
                    <div className="form-group mailIcon">
                      <Field
                        name="newPassword"
                        type="password"
                        value=""
                        label="New Password"
                        component={InputField}
                        placeholder="New Password"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group mailIcon">
                      <Field
                        name="confirmPassword"
                        type="password"
                        value=""
                        label="Confirm Password"
                        component={InputField}
                        placeholder="Confirm Password"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <button className="searchBtn" type="submit">
                        SEND
                      </button>
                    </div>
                  </div>
                  <NavLink
                    to={"/home"}
                    href=""
                    className="forgotLink commonLink"
                  >
                    GO BACK HOMEPAGE
                  </NavLink>
                  {/* <a href="/">GO BACK HOMEPAGE</a> */}
                </form>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <section className="errorPageBg">
          <div className="errorPageContent">
            <h1 style={{ fontSize: "58px" }}>Reset link expired</h1>
            <h5 style={{ fontSize: "25px" }}>
              Your password reset link has expired. Please try again
            </h5>
            <NavLink to="/" className="errorPageBtn">
              Back To Home
            </NavLink>
          </div>
        </section>
      );
    }
  };

  render() {
    const { forget_validity } = this.props;

    return (
      <div
        className="modal backgroundDark"
        id="myModal1"
        style={{ display: "block" }}
      >
        {this.renderForgetContent()}
      </div>
    );
  }
}

const forgetValidate = formProps => {
  const errors = {};

  if (!formProps.newPassword) {
    errors.newPassword = "Required";
  }
  if (!formProps.confirmPassword) {
    errors.confirmPassword = "Required";
  } else if (!(formProps.newPassword === formProps.confirmPassword)) {
    errors.confirmPassword = "Password mismatch";
  }
  return errors;
};

const mapStateToProps = state => ({
  loginDetails: state.loginReducer.loginDetails,
  newPasswordDetails: state.loginReducer.newPasswordDetails,
  forget_validity: state.loginReducer.forget_validity
});

const mapDispatchToProps = dispatch => ({
  newpasswordInfo: value => dispatch(newpasswordInfo(value)),
  forgotPwdVality: value => dispatch(forgotPwdVality(value))
});
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(
//   reduxForm({
//     form: "NewPassword",
//     validate: forgetValidate
//   })(NewPassword)
// );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    reduxForm({
      form: "NewPassword",
      validate: forgetValidate
    })(NewPassword)
  )
);
