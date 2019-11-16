import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import Footer from "../component/Footer";
import TopNav from "../component/container/TopNav";
import img_call from "../asset/images/aboutUs/call.png";
import img_mail from "../asset/images/aboutUs/email.png";
import img_address from "../asset/images/aboutUs/address.png";
import img_paymentCard from "../asset/images/paymentCard1.png";
import {connect } from 'react-redux'
import {paymentPro } from '../../src/service/login/action'
import Subscription from '../component/Subscription'
import SignIn from '../component/container/login/SignInModal'

class PaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isgoPro: false,
      card_Number: "",
      card_cvv: "",
      expiry_month: "",
      expiry_year: "",
      card_Name: "",
      formErrors: {
        card_Number: "",
        card_cvv: "",
        expiry_month: "",
        expire_year: "",
        card_Name: ""
      },
      card_NumberValid: false,
      card_cvvValid: false,
      expiry_monthValid: false,
      expiry_yearValid: false,
      card_NameValid: false,
      formValid: false,
      // isVisibleSignIn: false,
      // isdivHide: false
    };
  }

  // handleSignIn = () => {
  //   this.setState({ isVisibleSignIn: true });
  //   this.setState({ isdivHide: true });
  // };

  // onClose = () => {
  //   this.setState({ isVisibleSignIn: false });
  // };
  componentWillReceiveProps(newProps) {

    if (newProps.goproStatus == true) {
      this.props.history.push("/dashboard/mySubscription");
    }
  }
  handleGopro = value => {
    this.setState({ isgoPro: !this.state.isgoPro });
  };

  // componentDidMount() {
  //   window.scrollTo(0, 0);
  // }
  validateField = (fieldName, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let {
      card_cvvValid,
      card_NameValid,
      card_NumberValid,
      expiry_monthValid,
      expiry_yearValid
    } = this.state;

    switch (fieldName) {
      case "card_Number":
        if (value) card_NumberValid = /^[0-9]*$/.test(value);
        fieldValidationErrors.card_Number = card_NumberValid
          ? ""
          : " Enter valid numbers ";
        break;
      case "card_Name":
        card_NameValid = /^[a-zA-Z_ ]*$/.test(value);
        fieldValidationErrors.card_Name = card_NameValid
          ? ""
          : "Enter valid name";
        break;
      case "card_cvv":
        card_cvvValid = /^(\d{3})(\d{1})?$/.test(value);
        fieldValidationErrors.card_cvv = card_cvvValid
          ? ""
          : "CVV should contain 3-4 digit";
        break;
      case "expiry_month":
        expiry_monthValid = "";
        fieldValidationErrors.expiry_month = expiry_monthValid
          ? "required"
          : "";
        break;
      case "expiry_year":
        expiry_monthValid = "";
        fieldValidationErrors.expire_year = expiry_yearValid ? "required" : "";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        card_NumberValid: card_NumberValid,
        card_NameValid: card_NameValid
      },
      this.validateForm
    );
  };
  validateForm = () => {
    let {
      card_cvvValid,
      card_NameValid,
      card_NumberValid,
      expiry_monthValid,
      expiry_yearValid
    } = this.state;
    this.setState({
      formValid:
        card_cvvValid &&
        card_NameValid &&
        card_NumberValid &&
        expiry_monthValid &&
        expiry_yearValid
    });
  };
  handleUserInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };

  handleSelectInput = e => {
    const name = e.target.name;
    let value;
    if (name === "expiry_month") {
      value = e.target.value;
      this.setState({ expiry_month: value }, () => {
        this.validateField(name, value);
      });
    } else {
      value = e.target.value;
      this.setState({ expiry_year: value }, () => {
        this.validateField(name, value);
      });
    }
  };

  handlePayment = () => {
    const { state } = this.props.location;
    const { email } = this.props.loginDetails;
    let {
      card_cvv,
      card_Name,
      card_Number,
      expiry_month,
      expiry_year
    } = this.state;
    const payload = {
      email: email,
      planId: state.id,
      totalAmount: state.amount,
      paymentBreakup: [
        {
          currency: state.currency
        }
      ],
      paymentMethod: {
        cards: [
          {
            num: card_Number,
            nameOnCard: card_Name,
            cvv: card_cvv,
            expiry: {
              month: expiry_month,
              year: expiry_year
            }
          }
        ]
      }
    };

    this.props.paymentPro(payload);
  };

  render() {
    //   const {isVisibleSignIn , isdivHide } =this.state
    // const renderSignInModal =isVisibleSignIn && <SignIn onHide={this.onClose} isdivHide={isdivHide}/>
     var years = [],
      year = new Date().getFullYear();

    for (var i = year; i < year + 12; i++) {
      years.push(i);
    }

    var months = [];

    for (var i = 1; i <= 12; i++) {
      months.push(i);
    }
    const { state } = this.props.location;
    const {
      card_Name,
      card_Number,
      card_cvv,
      expire_year,
      expiry_month
    } = this.state.formErrors;
    return (
      <React.Fragment>
        <TopNav onClick={this.props.onSignIn} handleGopro={this.handleGopro} />
         {/* {renderSignInModal} */}

        {/* {this.state.isgoPro && <Subscription handleGopro={this.handleGopro} />} */}
        <section className="contactUsBg">
          <div className="container">
            {/* <div className="contactUsTitle">
              <h3>Contact Us</h3>
            </div> */}
            <h6 className="text-center mt-3">
              Select a Payment Method Credit/Debit Cards
            </h6>

            <div className="row mt-4">
              <div className="col-12 col-sm-12 col-md-1 col-lg-1" />
              <div className="col-12 col-sm-12 col-md-5 col-lg-5">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="card_Number"
                    placeholder="XXXX XXXX XXXX XXXX"
                    onChange={this.handleUserInput}
                  />
                  <span style={{ color: "red" }}>{card_Number}</span>
                </div>
                <div className="form-group">
                  <label>Card Holder Name</label>
                  <input
                    type="text"
                    name="card_Name"
                    placeholder="Name"
                    onChange={this.handleUserInput}
                  />
                  <span style={{ color: "red" }}>{card_Name}</span>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-5 col-lg-5">
                <label>Valid Thru</label>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <select
                        name="expiry_month"
                        value={this.state.expiry_month}
                        onChange={this.handleSelectInput}
                      >
                        <option>Select Month</option>
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="04">04</option>
                        <option value="05">05</option>
                        <option value="06">06</option>
                        <option value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                      {/* <select
                        name="expiry_month"
                        value={this.state.expiry_month}
                        onChange={this.handleSelectInput}
                      >
                        <option>Select Month</option>
                        {months &&
                          months.map((each, i) => (
                            <option value={each}>{each}</option>
                          ))}
                      </select> */}
                      <span style={{ color: "red" }}>{expiry_month}</span>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <select
                        name="expiry_year"
                        value={this.state.expiry_year}
                        onChange={this.handleSelectInput}
                      >
                        <option>Select Year</option>
                        {years &&
                          years.map((each, i) => (
                            <option value={each}>{each}</option>
                          ))}
                      </select>
                      <span style={{ color: "red" }}>{expire_year}</span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    name="card_cvv"
                    placeholder="CVV"
                    onChange={this.handleUserInput}
                  />
                  <span style={{ color: "red" }}>{card_cvv}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-1 col-lg-1" />
              <div className="col-12 col-sm-12 col-md-10 col-lg-10">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group">
                      <small>Supported Cards</small>
                      <img src={img_paymentCard} alt="payment Type cards" />
                    </div>
                    <small>
                      Note : Your Membership will renew automatically upon
                      expiry
                    </small>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group text-right">
                      <button
                        type="button"
                        className="searchBtn"
                        onClick={this.handlePayment}
                        /* disabled={this.state.formErrors} */
                      >
                        Pay ${state.amount/100}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    loginDetails: state.loginReducer.loginDetails,
    paymentDetails: state.loginReducer.paymentDetails,
    goproStatus:state.loginReducer.goproStatus
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    paymentPro: payload => dispatch(paymentPro(payload))
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PaymentPage));




// validateForm() {
//   this.setState({formValid: this.state.emailValid && this.state.passwordValid});
// }