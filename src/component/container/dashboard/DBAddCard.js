import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import InputField from "../../Fields/TextField";
// import CheckField from "../../Fields/CheckField";
import SelectField from "../../Fields/SelectField";

// import { addcart } from "../../../service/addCart/action";
import { addCard, getCard } from '../../../service/card/action'
import moment from 'moment'
class DBAddCard extends React.Component {
  handleFormInitialValues = () => {
    this.props.initialize({
      card_number: "",
      cardholder_name: "",
      validity: ""
    });
  };
  cardSubmit = value => {
    // let loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    const { loginDetails } = this.props;
    const payload = {
      number: value.card_number,
      name: value.cardholder_name,
      exp_year: value.year,
      exp_month: value.month,
      cvv: value.card_cvv,
      email: loginDetails.email
    };
    this.props.addCard(payload);
    this.props.getCard(loginDetails.email);
    this.props.handleModal();
  };
  render() {
    const { modal, handleModal, handleSubmit, loginDetails, getCardDetails } = this.props;
      var years = [],
        year = new Date().getFullYear();

      for (var i = year; i < year + 15; i++) {
        years.push(i);
      }
    return (
      <React.Fragment>
        {/* {getCardDetails&& getCardDetails.map((each,index) => ( */}
        <form>
          <div
            className="modal backgroundDark"
            id="myAddCard"
            style={{ display: "block" }} >
            <div className="modal-dialog myNewAddCard">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">NEW CARD</h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    onClick={handleModal}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <div className="cardDetailForm">
                    <div className="row">
                      <div className="col-sm-9 col-md-9 col-lg-9">
                        <div className="form-group">
                          <Field
                            name="card_number"
                            type="text"
                            label="Card Number"
                            value={""}
                            component={InputField}
                            placeholder="xxxx xxxx xxxx xxxx"
                            className="form-control"
                          />
                          {/* <label>Card Number</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="xxxx xxxx xxxx xxxx"
                            name="card_number"
                          />  */}
                        </div>
                      </div>
                      <div className="col-sm-3 col-md-3 col-lg-3">
                        <div className="form-group">
                          <Field
                            name="card_cvv"
                            type="password"
                            label="CVV"
                            value={""}
                            component={InputField}
                            placeholder="CVV"
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-12 col-md-8 col-lg-8">
                        <div className="form-group">
                          <Field
                            name="cardholder_name"
                            type="text"
                            label="Cardholder Name"
                            component={InputField}
                            placeholder="Enter your name"
                            className="form-control"
                          />
                          {/* <label>Cardholder Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="John Doe"
                            name="cardholder_name"
                          /> */}
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 col-lg-4">
                        <div className="form-group">
                          {/* <Field
                            name="validity"
                            type="text"
                            label="Vaild Thru"
                            component={InputField}
                            placeholder="MM/YY"
                            className="form-control"
                          /> */}
                          <Field
                            name="month"
                            label="Vaild Thru"
                            component={SelectField}
                            placeholder="MM"
                            className="form-control selectCard borderRight"
                          >
                            <option value="" disable>MM</option>
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
                          </Field>

                              <Field
                                name="year"
                                type="text"
                                component={SelectField}
                                placeholder="YY"
                                className="form-control selectCard"
                              ><option value="0">YYYY</option>
                              {years&& years.map((each,i)=>(
                                <option value={each}>{each}</option>
                              ))}
                          </Field>
                          {/* <label>Vaild Thru</label>
                          <select className="form-control selectCard borderRight">
                            <option>MM</option>
                          </select>
                          <select className="form-control selectCard">
                            <option>YY</option>
                          </select> */}
                          {/* <label>Vaild Thru</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="MM/YY"
                            name="validity"
                          /> */}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <button
                            className="searchBtn"
                            type="button"
                            onClick={handleSubmit(this.cardSubmit)}
                          >
                            Add Card
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6">
                        {/* <Field
                          name="isActive"
                          type="checkbox"
                          label="Set as Primary"
                          component={CheckField}
                        /> */}
                        {/* <input
                            className="filtercheckbox"
                            id="check"
                            type="checkbox"
                            value=""
                          /> */}
                        {/* <label for="check">Set as Primary</label> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        {/* ))} */}
      </React.Fragment>
    );
  }
}

const addcardValidate = formProps => {
  const errors = {};
  if (!formProps.cardholder_name) {
    errors.cardholder_name = "Required";
  }

  if (!formProps.card_number) {
    errors.card_number = "Required";
  } else if (!/^[0-9]*$/.test(formProps.card_number)) {
    errors.card_number = "only Number allowed";
  }

  if (!formProps.validity) {
    errors.validity = "Required";
  }
  if(!formProps.card_cvv)
  {
    errors.card_cvv="Required"
  }
  
  return errors;
};

const mapStateToProps = state => ({
  loginDetails: state.loginReducer.loginDetails
});
const mapDispatchToProps = dispatch => ({
  addCard: value => dispatch(addCard(value)),
  getCard: value => dispatch(getCard(value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: "DBAddCard",
    validate: addcardValidate
  })(DBAddCard)
);
