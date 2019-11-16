import React, { Component } from 'react';
import { connect } from "react-redux"

import ResetPassword from '../../container/dashboard/ResetPassword';
import InputField from '../../../component/Fields/TextField';
import { withRouter } from 'react-router-dom';
import { getSubscriptionList, deleteUserSubscription, updateUserCardDetails } from '../../../service/subscription/action';
import moment from 'moment';
import { reduxForm, Field } from "redux-form";
import SelectField from "../../Fields/SelectField";
import { getCard } from "../../../service/card/action"

class DBMySubscription extends Component {

    state = {
        showPayment: false
    };
    handleFormInitialValues = () => {
        this.props.initialize({
            card_number: "",
            cardholder_name: "",
            validity: ""
        });
    };
    componentWillMount() {
        window.scrollTo(0,0);
        const userSession = JSON.parse(sessionStorage.getItem('loginInfo'));
        const { email } = userSession;
       // const {email} = this.props.loginDetails;
        this.props.getSubscriptionList(email);
        this.props.getCard(email);
    }
    deleteSubscription = (list) => {
      
       // const {email} = this.props.loginDetails;
       const userSession = JSON.parse(sessionStorage.getItem('loginInfo'));
        const { email } = userSession;
        const deletepayload = {
            email: email,
            subscriptionId: list.subscriptionDetails.id
        }
      
        this.props.deleteUserSubscription(deletepayload)
    }
    updateCardSubmit = (value, list) => {

        const { loginDetails, subscriptionList } = this.props;
        const { showPayment } = this.state;
      
        const payload = {
            num: value.card_number,
            nameOnCard: value.cardholder_name,
            expiry: {
                month: value.month,
                year: value.year
            },
            cvv: value.card_cvv,
        };
        const updatedata = {
            customerId: loginDetails.customer_id,
            email: loginDetails.email,
            cardId:subscriptionList[0].subscriptionList.updatedCardDetails ?subscriptionList[0].subscriptionList.updatedCardDetails.id  : subscriptionList[0].paymentDetails.id,
            // cardId: "card_1EJfYUBzRXQmf85acyXO4mAs",
            subscriptionId: subscriptionList.length == 0 ? '' : subscriptionList[0].subscriptionDetails.id,
            paymentMethod: {
                cards: [payload]
            }
        }
        this.props.updateUserCardDetails(updatedata);
        this.setState({showPayment:!showPayment})
    }

    render() {
        const { handleSubmit, getCardDetails,subscriptionList,loginDetails} = this.props;
        const { showPayment } = this.state;
       
        var years = [],
            year = new Date().getFullYear();

        for (var i = year; i < year + 15; i++) {
            years.push(i);
        }
        const {subscription_type}=loginDetails
        return (
          
            <div className="dashRightSide align-self-start">
                <div className="profileSetting">
                    <h5>Subscription Details </h5>
                    {( subscriptionList.length >= 1 || subscriptionList == undefined || subscriptionList == null) > 0 ? 
                        <div>
                            <div className="row mb-3">
                                <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                    <div className="subscriptInfo">
                                        <label>Plan Type </label>

                                        <span>{subscriptionList[0] && subscriptionList[0].subscriptionDetails && subscriptionList[0].subscriptionDetails.plan ? subscriptionList[0].subscriptionDetails.plan.name:"FREE"}</span>
                                    </div>
                                </div>
                                {subscriptionList[0].status == 'Active' && <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                    <div className="subscriptInfo">
                                        <label>Plan Start Date </label>
                                        <span>{moment.unix(subscriptionList[0].subscriptionDetails.current_period_start).format("MM/DD/YYYY")}</span>
                                    </div>
                                </div>}
                                {subscriptionList[0].status == 'Active' && <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                    {/* <input type="checkbox" className="subscripAutoRenewal" id="autoRenew"/>
                                <label for="autoRenew"> If you want auto renewal for this plan</label> */}
                                    <div className="subscriptInfo">
                                        <label>Renewal Date </label>
                                        <span>{moment.unix(subscriptionList[0].subscriptionDetails && subscriptionList[0].subscriptionDetails.current_period_end).format("MM/DD/YYYY")}</span>
                                    </div>
                                </div>}
                                <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                    <div className="subscriptInfo">
                                        <label>Status </label>
                                        <span>{subscriptionList[0].status?subscriptionList[0].status : "FREE"}</span>
                                    </div>
                                </div>
                                {subscriptionList[0].status == 'Active' && <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                                    <button type="button" className="searchBtn float-right" onClick={() => this.deleteSubscription(subscriptionList[0])}>Cancel Subscription</button>
                                </div>}
                            </div>

                            {subscription_type !="FREE" && <React.Fragment>
                            <h5>Payment Selection</h5>
                            <div className="row">
                                <div className="col-12 col-xl-12 col-sm-12 col-lg-12 col-md-12">
                                    <div className="subscriptCardShow">
                                        {subscriptionList[0].subscriptionList && subscriptionList[0].subscriptionList.updatedCardDetails ? <div className="cardinfoAlready">
                                            <input type="radio" name="payemntselect" id="test1" />
                                            <label for="test1"></label>
                                            <span class="visaCard"></span>
                                            <h6>XXXX XXXX XXXX {subscriptionList[0].subscriptionList.updatedCardDetails.last4}</h6>
                                        </div> : <div className="cardinfoAlready">
                                                <input type="radio" name="payemntselect" id="test1" />
                                                <label for="test1"></label>
                                                <span class="visaCard"></span>
                                                <h6>XXXX XXXX XXXX {subscriptionList[0].paymentDetails && subscriptionList[0].paymentDetails.last4}</h6>
                                            </div>
                                        }
                                         <a onClick={()=>this.setState({showPayment:!showPayment})}>Change Payment Information</a>
                                    </div>


                                </div>

                            </div>
                            </React.Fragment>}
                            {showPayment && <div className="row">
                                {/* <form > */}
                                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="form-group">
                                        {/* <label>Card No</label> */}
                                        {/* <input type="text" className="form-control" /> */}
                                        <Field
                                            name="card_number"
                                            type="text"
                                            label="Card Number"
                                            value={""}
                                            component={InputField}
                                            placeholder="xxxx xxxx xxxx xxxx"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="form-group">
                                        {/* <label>CVV</label> */}
                                        {/* <input type="text" className="form-control" /> */}
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
                                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="form-group">
                                        {/* <label>Card Holder Name</label> */}
                                        {/* <input type="text" className="form-control" /> */}
                                        <Field
                                            name="cardholder_name"
                                            type="text"
                                            label="Cardholder Name"
                                            component={InputField}
                                            placeholder="John Doe"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    {/* <label>Vaild Thru</label> */}
                                    <div className="row">
                                        <div className="col-xl-6 col-sm-12 col-12">
                                            <div className="form-group">
                                                {/* <select className="form-control">
                                                    <option>Select Month</option>
                                                </select> */}
                                                <Field
                                                    name="month"
                                                    label="Vaild Thru"
                                                    component={SelectField}
                                                    placeholder="MM"
                                                    className="form-control"
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
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-sm-12 col-12">
                                            <div className="form-group">
                                                {/* <select className="form-control">
                                                    <option>Select Year</option>
                                                </select> */}
                                                <Field
                                                    name="year"
                                                    type="text"
                                                    component={SelectField}
                                                    placeholder="YY"
                                                    className="form-control"
                                                ><option value="0">YYYY</option>
                                                    {years && years.map((each, i) => (
                                                        <option value={each}>{each}</option>
                                                    ))}
                                                </Field>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                    <button type="button" className="searchBtn float-right" onClick={handleSubmit(this.updateCardSubmit)}>Save</button>
                                </div>
                                {/* </form> */}
                            </div>
                            }
                        </div> :
                        <div className="row mb-3">
                            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                <div className="subscriptInfo">
                                    <label>Currently You are in Free Plan</label>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }

}
const validateUpdatecard = formProps => {
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
    if (!formProps.card_cvv) {
        errors.card_cvv = "Required"
    }

    return errors;
}
const mapStateToProps = state => ({
    subscriptionList: state.subscriptionReducer.subscriptionList,
    loginDetails: state.loginReducer.loginDetails,
    getCardDetails: state.cardReducer.getCardDetails,

})
const mapDispatchToProps = dispatch => ({
    getSubscriptionList: email => dispatch(getSubscriptionList(email)),
    deleteUserSubscription: deletepayload => dispatch(deleteUserSubscription(deletepayload)),
    updateUserCardDetails: updatedata => dispatch(updateUserCardDetails(updatedata)),
    getCard: value => dispatch(getCard(value))
})
export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(

        reduxForm({
            form: "updateCard",
            validate: validateUpdatecard
        })(DBMySubscription)
    )
);

