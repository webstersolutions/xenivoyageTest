import React from 'react';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import Footer from '../../Footer';
import TopNav from '../TopNav';
import Loading from "../../Loading";

import queryString from "query-string";
import {getSingleBookingTripInformation, cancelActivity, getCancellationCode} from "../../../service/activities/action";
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import _get from "lodash/get";
const currencies = require("country-data").currencies;
class ActivityCancelBooking extends React.Component {


    state = {
        selectedCode: 78
    };

    componentDidMount() {
        this.props.getCancellationCode();
        window.scrollTo(0, 0);
        let queryParam = queryString.parse(this.props.location.search);
        if (!_isEmpty(queryParam)) {
            this.props.getBookingStatus(queryParam);
        } else {
            this.props.history.push('/activity');
        }
    }

    handleSignIn = () => {
        this.setState({isVisibleSignIn: true});
        this.setState({isdivHide: true});
    };

    bookingCancel = (obj) => {
        const {distributorItemRef, distributorRef, response} = obj
        let payload = {
            itineraryId: response.data.itineraryId,
            distributorRef,
            cancelItems: [
                {
                    itemId: response.data.itemSummaries[0].itemId,
                    distributorItemRef: distributorItemRef,
                    cancelCode: this.state.selectedCode,
                    cancelDescription: "test"
                }
            ],
            email: this.props.loginDetails.email
        };
        let queryParam = queryString.parse(this.props.location.search);
        this.props.cancelActivity(payload, queryParam)
    };

    render() {
        const {activityBookingStatus, activityCancelReasonList, refundStatus, refundAmount} = this.props;
        console.log(";;;;;activityBookingStatus",activityBookingStatus)
        return (
            <React.Fragment>
                <TopNav/>
                {<Loading/>}
                {
                    activityBookingStatus !== null && activityBookingStatus !== undefined &&
                    <section className="searchSection">
                        <div className="container">
                            <div className="bookingConfirmation">
                                <div className="bookingStatus">
                                    <div className="d-flex flex-row justify-content-between">
                                        <div className="flex-column">
                                            <div className="bookingStatusContent cancelledBook">
                                                { activityBookingStatus.booking_status && !activityBookingStatus.isCancel &&
                                                <h3 className="text-success">
                                                    Your Booking has Been Confirmed
                                                </h3>}

                                                {activityBookingStatus.booking_status && activityBookingStatus.isCancel &&
                                                <h3 className="text-danger">
                                                    Your booking has been cancelled successfully
                                                </h3>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-row">
                                        <div className="bookingHotelName">
                                            <h5>{activityBookingStatus.response.data.itemSummaries[0].productTitle}</h5>
                                        </div>
                                        <div className="clearfix"/>
                                        <ul className="bookingHotelInfo mt-5 mb-4">
                                            <li className="borderRight">
                                                <b> Travel Date :</b>
                                                {activityBookingStatus.response.data.itemSummaries[0].travelDate}
                                            </li>
                                            <li className="borderRight">
                                                <b> Total Cost :</b>  {currencies[activityBookingStatus.currencyCode].symbol}{activityBookingStatus.fare}
                                            </li>
                                            <li>
                                                Xeniapp Booking Id : <b>#{activityBookingStatus.distributorRef.substr(0, 6).toUpperCase()}</b>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bookingStatus">
                                    <div className="d-flex flex-row smallTabColumn justify-content-between">
                                        <div className="flex-column hotelImage">
                                            <img src={activityBookingStatus.images[0].photoURL}/>
                                        </div>
                                        <div className="flex-column bookingConfirmRoom">
                                            <div className="d-flex flex-row">
                                                <div className="flex-row">
                                                    <div className="bookingHotelName">
                                                        <h5>Booking Information </h5>
                                                    </div>
                                                    <ul className="">
                                                        <li className="borderRight">
                                                            <b> Travel Date</b>:&nbsp;
                                                            <b>{activityBookingStatus.response.data.itemSummaries[0].travelDate}</b>
                                                        </li>
                                                        {activityBookingStatus.response.data.itemSummaries[0].startingTime !== null &&
                                                        <li className="borderRight">
                                                            <b>Starting Time</b>:&nbsp;
                                                            <b>{activityBookingStatus.response.data.itemSummaries[0].startingTime}</b>
                                                        </li>}
                                                        <li className="borderRight">
                                                            <b>Price Formatted</b>:&nbsp;
                                                            {/* <b>{activityBookingStatus.response.data.itemSummaries[0].priceFormatted}</b> */}
                                                            <b>{currencies[activityBookingStatus.currencyCode].symbol}{activityBookingStatus.fare}</b>
                                                        </li>
                                                    </ul>
                                                    <ul className="">
                                                        <li className="borderRight">
                                                            <b> Departs From</b>:&nbsp;
                                                            <b>{activityBookingStatus.response.data.itemSummaries[0].departsFrom}</b>
                                                        </li>
                                                        <li className="borderRight">
                                                            <b>Booking Date</b>:&nbsp;
                                                            <b>{activityBookingStatus.response.data.bookingDate}</b>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bookingStatus">
                                    <h5> Cancellation Policy</h5>
                                    <span
                                        dangerouslySetInnerHTML={{__html: _get(activityBookingStatus.response.data.itemSummaries, "merchantTermsAndConditions.termsAndConditions", '')}}/>
                                    <b>Refund : {refundAmount} % </b>
                                    <br/>

                                    {!activityBookingStatus.isCancel && <div className="row">
                                        <div className="col-md-3 mt-5">
                                            <select className="form-control selectWidth" style={{width: 300}} onChange={e =>
                                                this.setState({
                                                    selectedCode: e.target.value
                                                })
                                            } defaultValue={this.state.selectedCode}>
                                                <option>Select Reason</option>
                                                {_map(activityCancelReasonList, (obj, i) => {
                                                    return (
                                                        <option value={i}>{obj}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                        <div className="col-md-3 marginCancell" style={{marginLeft: -10, paddingLeft: -10}}>
                                            <button type="submit"
                                                    onClick={() => this.bookingCancel(activityBookingStatus)}
                                                    className="searchBtn completebtn float-right mt-5"> Cancel
                                            </button>
                                        </div>
                                    </div>}
                                    <p className="text-center">We have sent a confirmation of the cancellation
                                        to: <b>{this.props.loginDetails.email}</b>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Footer/>

                    </section>}
            </React.Fragment>);
    }
}

const mapStateToProps = state => ({
    selectedCurrency: state.commonReducer.selectedCurrency,
    loginDetails: state.loginReducer.loginDetails,
    activityBookingStatus: state.activityReducer.activityBookingStatus,
    activityCancelReasonList: state.activityReducer.activityCancelReasonList,
    refundStatus: state.activityReducer.refundStatus,
    refundAmount: state.activityReducer.refundAmount,
});

const mapDispatchToProps = dispatch => ({
    getBookingStatus: (requestParam) => dispatch(getSingleBookingTripInformation(requestParam)),
    cancelActivity: (payload, requestParam) => dispatch(cancelActivity(payload, requestParam)),
    getCancellationCode: (payload) => dispatch(getCancellationCode(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActivityCancelBooking));
