import React from "react";
import {connect} from "react-redux";
import Footer from "../../Footer";
import TopNav from "../TopNav";
import moment from "moment";

import {cancelledBooking, cancelledConfirmReset} from "../../../service/dashboard/action";

import img_clock from "../../../asset/images/Time.svg";
import img_DateArrow from "../../../asset/images/Date Arrow.png";
import img_Date from "../../../asset/images/Date Arrow.png";

import Loading from "../../Loading";

let currencies = require('country-data').currencies;

class CancelBooking extends React.Component {
    state = {
        selectedValue: "",
        selectReasonMsg: ""
    };

    componentDidMount() {
        window.scrollTo(0, 0)
        this.props.cancelledConfirmReset();
    }

    componentWillReceiveProps(nextPorps) {
        if (nextPorps.cancelledConfirm === "sucess") {
            this.props.history.push("/CancelledBooking")
        } else if (nextPorps.cancelledConfirm === "failure") {
            this.props.history.push("/cancelBooking");
        }
    }

    handleSignIn = () => {
        this.setState({isVisibleSignIn: true});
        this.setState({isdivHide: true});
    };

    getSelectValue = e => {
        this.setState({selectedValue: e.target.value});
    };

    bookingCancelation = (flag, value) => {
        if (this.state.selectedValue === "") {
            this.setState({selectReasonMsg: "Required"});
        } else {
            this.setState({selectReasonMsg: ""}, () => {
                const {loginDetails, refundList} = this.props;

                if (flag === true) {
                    if (value.refundability === "Refundable") {
                        const payLoad = {
                            bookingId: value.bookingId,
                            email: loginDetails.email || "",
                            reason: this.state.selectedValue || "",
                            penality_rules: refundList ? refundList.data.penality_rules : "",
                            refund_amount: refundList ? refundList.data.refund_amount : "",
                            sessionId: value.sessionId
                        };
                        this.props.cancelledBooking(payLoad);
                    } else if (value.refundability === "NonRefundable") {
                        const payLoad = {
                            bookingId: value.bookingId,
                            email: loginDetails.email || "",
                            reason: this.state.selectedValue || "",
                            penality_rules: "",
                            refund_amount: "",
                            sessionId: value.sessionId
                        };
                        this.props.cancelledBooking(payLoad);
                    }
                }
            });
        }
    };

    render() {
        const {cancelRouteInfo, refundList, loginDetails, selectedCurrency} = this.props;
        var date1 = new Date(
            cancelRouteInfo &&
            cancelRouteInfo.length != 0 &&
            cancelRouteInfo.stayPeriod.start
        );
        var date2 = new Date(
            cancelRouteInfo &&
            cancelRouteInfo.length != 0 &&
            cancelRouteInfo.stayPeriod.end
        );
        var stayPeriod = date2.getDate() - date1.getDate();
        const selectedCurrencyVal =
            currencies[this.props.cancelRouteInfo.fareBreakup.currency].symbol;
        return (
            <React.Fragment>
                <TopNav
                    isSignUpHide={this.state.isSignCancel}
                    onClick={this.props.onSignIn}
                />
                {<Loading/>}

                <section className="searchSection">
                    <div className="container">
                        <div className="bookingConfirmation">
                            <div className="bookingStatus">
                                <div className="d-flex flex-row justify-content-between">
                                    <div className="flex-column">
                                        <div className="bookingStatusContent cancelBook">
                                            <h3>Cancel this Hotel Booking</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-row">
                                    <div className="bookingHotelName">
                                        <h5>
                                            {cancelRouteInfo && cancelRouteInfo.hotel_address &&
                                            cancelRouteInfo.hotel_address.name
                                                ? cancelRouteInfo.hotel_address.name
                                                : "null"}
                                        </h5>
                                    </div>
                                    <ul className="bookingHotelInfo">
                                        <li className="borderRight">

                                            {moment(cancelRouteInfo && cancelRouteInfo.stayPeriod && cancelRouteInfo.stayPeriod.start)
                                                .format("MMM DD")
                                                .toUpperCase()}
                                            {moment(cancelRouteInfo && cancelRouteInfo.stayPeriod && cancelRouteInfo.stayPeriod.start).format("dddd")}
                                            <span> &nbsp;</span> <img src={img_Date} alt="arrow"/> <span> &nbsp;</span>
                                            {moment(cancelRouteInfo && cancelRouteInfo.stayPeriod && cancelRouteInfo.stayPeriod.end)
                                                .format("MMM DD")
                                                .toUpperCase()}
                                            {moment(cancelRouteInfo && cancelRouteInfo.stayPeriod && cancelRouteInfo.stayPeriod.end).format("dddd")}
                                        </li>
                                        <li className="borderRight">
                                            Total Cost : {selectedCurrencyVal}
                                            {parseFloat(cancelRouteInfo && cancelRouteInfo.totalAmount && cancelRouteInfo.totalAmount).toFixed(2)}
                                        </li>
                                        <li> Booking Id # {cancelRouteInfo && cancelRouteInfo.bookingId}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bookingStatus">
                                <div className="d-flex flex-row smallTabColumn justify-content-between">
                                    <div className="flex-column hotelImage">
                                        <img
                                            src={cancelRouteInfo && cancelRouteInfo.hotel_images[0] && cancelRouteInfo.hotel_images[0].URL}
                                            alt="No images available"
                                        />
                                    </div>
                                    <div className="flex-column bookingConfirmRoom">
                                        <div className="d-flex flex-row">
                                            <div className="flex-column infoDiv cancebookName">
                                                <h6>{cancelRouteInfo && cancelRouteInfo.hotel_address && cancelRouteInfo.hotel_address.name}</h6>

                                                <p>{cancelRouteInfo && cancelRouteInfo.hotel_address && cancelRouteInfo.hotel_address.contact && cancelRouteInfo.hotel_address.contact.address && cancelRouteInfo.hotel_address.contact.address.line1} {cancelRouteInfo && cancelRouteInfo.hotel_address && cancelRouteInfo.hotel_address.contact.address && cancelRouteInfo.hotel_address.contact.address.city && cancelRouteInfo.hotel_address.contact.address.city.name}  </p>

                                                {/* <p><img src={img_call} /> <b>(212) 586-7000</b></p><br/> */}

                                                <span>Booking for {stayPeriod} Nights</span>
                                                <ul>
                                                    <li className="border">
                                                        <h5>
                                                            {moment(cancelRouteInfo && cancelRouteInfo.stayPeriod && cancelRouteInfo.stayPeriod !== undefined && cancelRouteInfo.stayPeriod.start)
                                                                .format("MMM DD")
                                                                .toUpperCase()}
                                                        </h5>
                                                        <p>
                                                            {moment(cancelRouteInfo && cancelRouteInfo.stayPeriod && cancelRouteInfo.stayPeriod !== undefined && cancelRouteInfo.stayPeriod.start).format(
                                                                "dddd"
                                                            )}
                                                        </p>
                                                    </li>
                                                    <li>
                                                        <img src={img_DateArrow}/>
                                                    </li>
                                                    <li className="border">
                                                        <h5>
                                                            {moment(cancelRouteInfo && cancelRouteInfo.stayPeriod && cancelRouteInfo.stayPeriod.end)
                                                                .format("MMM DD")
                                                                .toUpperCase()}
                                                        </h5>
                                                        <p>
                                                            {moment(cancelRouteInfo && cancelRouteInfo.stayPeriod && cancelRouteInfo.stayPeriod.end).format(
                                                                "dddd"
                                                            )}
                                                        </p>
                                                    </li>
                                                </ul>
                                                <ul className="checkInOut">
                                                    <li>
                                                        <img src={img_clock}/>
                                                        <span>
                              Check In
                              <b>

                                {cancelRouteInfo && cancelRouteInfo.checkinCheckoutPolicy.length
                                    ? cancelRouteInfo && cancelRouteInfo.checkinCheckoutPolicy[0] && cancelRouteInfo.checkinCheckoutPolicy[0]
                                    .inTime + 0
                                    : "12.00am"}
                              </b>
                            </span>
                                                    </li>
                                                    <li>
                                                        <img src={img_clock}/>
                                                        <span>
                              Check Out
                              <b>

                                {cancelRouteInfo && cancelRouteInfo.checkinCheckoutPolicy.length
                                    ? cancelRouteInfo && cancelRouteInfo.checkinCheckoutPolicy[0] && cancelRouteInfo.checkinCheckoutPolicy[0]
                                    .outTime + 0
                                    : "06.00pm"}
                              </b>
                            </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bookingCollapse cancelBookCollapse marginRight">
                                <div className="bookingCollapseTitle">
                                    <h5>Guest</h5>
                                </div>
                                <div className="bookingCollapseContent">
                                    <div className="d-flex flex-row justify-content-start">
                                        <div className="flex-column bookingCntentwidth">
                                            <p>
                                                Reserved Under :
                                                <b>
                                                    {
                                                        loginDetails.name

                                                    }
                                                </b>
                                            </p>
                                            {/* <p>1 Adult, 1 Child</p> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bookingCollapse cancelBookCollapse">
                                <div className="bookingCollapseTitle">
                                    <h5>Room</h5>
                                </div>
                                <div className="bookingCollapseContent">
                                    <div className="d-flex flex-row justify-content-start">
                                        <div className="flex-column ">
                                            <p> {cancelRouteInfo && cancelRouteInfo.rooms_info[0] && cancelRouteInfo.rooms_info[0].name} </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bookingCollapse">
                                <div className="bookingCollapseTitle">
                                    <h5>CANCEL BOOKING</h5>
                                </div>
                                <div className="bookingCollapseContent">
                                    <div className="d-flex flex-row justify-content-start">
                                        <div className="flex-column bookingCntentwidth">
                                            <h6>Hotel Cancellation Policy</h6>
                                            <p> {cancelRouteInfo && cancelRouteInfo.cancellationPolicy && cancelRouteInfo.cancellationPolicy.text}</p>
                                            <div className="totalBookingCost d-flex justify-content-between">
                                                <h5>TOTAL BOOKING COST :</h5>

                                                <p> {selectedCurrencyVal}&nbsp;{parseFloat(cancelRouteInfo && cancelRouteInfo.totalAmount).toFixed(2)}  </p>


                                            </div>
                                            <div className="totalBookingCost d-flex justify-content-between">
                                                <h5>REFUNDABLE AMOUNT :</h5>
                                                <p> {selectedCurrencyVal}&nbsp;{refundList.data ? parseFloat(refundList.data.refund_amount).toFixed(2) : {selectedCurrencyVal} + " 0.00"} </p>
                                                {/* {cancelRouteInfo.refundability === "Refundable" ? <p> $  { parseFloat(refundList.data.refund_amount).toFixed(2)}</p>:"$ 0.00" }  */}
                                            </div>
                                            <p>Please provide a reason for the cancellation</p>

                                            <select
                                                className="form-control"
                                                onChange={this.getSelectValue}
                                            >
                                                <option value="">Select Reason</option>
                                                <option value="duplicate">Duplicate</option>
                                                <option value="fraudulent">Fraudulent</option>
                                                <option value="requested_by_customer">
                                                    Requested by Customer
                                                </option>
                                            </select>
                                            <span style={{color: "red"}}>
                        {this.state.selectReasonMsg}
                      </span>
                                            <div className="flex-row">
                                                <button
                                                    type="submit"
                                                    className="searchBtn mr-2"
                                                    onClick={() =>
                                                        this.bookingCancelation(true, cancelRouteInfo)
                                                    }
                                                >

                                                    CANCEL BOOKING
                                                </button>
                                                {/* <a href="">KEEP BOOKING</a> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    cancelRouteInfo: state.dashboardReducer.cancelRouteInfo,
    refundList: state.dashboardReducer.refundList,
    loginDetails: state.loginReducer.loginDetails,
    cancelledConfirm: state.dashboardReducer.cancelledConfirm,
    // TODO : need to get currency value from transaction list api
    selectedCurrency: state.commonReducer.selectedCurrency
});

const mapDispatchToProps = dispatch => ({
    cancelledBooking: data => dispatch(cancelledBooking(data)),
    cancelledConfirmReset: () => dispatch(cancelledConfirmReset())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CancelBooking);
