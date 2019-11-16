import React from 'react';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import Footer from '../../Footer';
import TopNav from '../TopNav';

import moment from "moment";


import img_clock from '../../../asset/images/Time.svg';
import img_arrow from '../../../asset/images/bookingConfirm/Shapearrow.png';

import img_DateArrow from "../../../asset/images/Date Arrow.png";
import Loading from "../../Loading";

import queryString from "query-string";

import { transferGetBooking, transferCancelBooking } from '../../../service/transfer/action'
import img_carUser from "../../../asset/images/dashboard/carUser.png";
import img_door from "../../../asset/images/dashboard/door.png";
import img_luggage from "../../../asset/images/dashboard/luggage.png";

let currencies = require('country-data').currencies;

class TransferCancelBooking extends React.Component {

    state = {
        selectedValue: "",
        cancelFailed: false,
    };


    componentWillReceiveProps(nextPorps) {
        if (nextPorps.hasOwnProperty("transferCancelBookStatus")) {
            if (nextPorps.transferCancelBookStatus) {
                if (nextPorps.transferCancelBookStatus.status == true) {
                    let {bookingId} = queryString.parse(this.props.location.search);
                    this.props.history.push('/transferCancelledBooking?' + queryString.stringify({bookingId}))
                } else if (nextPorps.transferCancelBookStatus.status == false) {
                    this.setState({
                        cancelFailed: true,
                    });
                    window.scrollTo(0, 0);
                }
            }

        }
    }

    handleSignIn = () => {
        this.setState({isVisibleSignIn: true});
        this.setState({isdivHide: true});
    };

    getSelectValue = (e) => {
        this.setState({selectedValue: e.target.value})
    };

    bookingCancelation = () => {
        const {loginDetails} = this.props;

        if (!this.state.selectedValue) {
            document.getElementById("reasonView").setAttribute("STYLE", "border-color:red;");
            setTimeout(() => {
                document.getElementById("reasonView").removeAttribute("STYLE")
            }, 3000)
        } else {
            let {bookingId} = queryString.parse(this.props.location.search);
            const payLoad = {
                "bookingId": bookingId,
                "email": loginDetails.email || "",
                "reason": this.state.selectedValue,
            };
            this.props.transferCancelBooking(payLoad);
        }

    };

    componentDidMount() {
        window.scrollTo(0, 0);
        let {bookingId} = queryString.parse(this.props.location.search);
        bookingId && this.props.transferGetBooking({bookingId});
    }

    render() {
        const { transferBookedDetails } = this.props;
        let {bookingId} = queryString.parse(this.props.location.search);
        const selectedCurrencyVal = transferBookedDetails
            ? transferBookedDetails.currency
                ? currencies[transferBookedDetails.currency].symbol
                : transferBookedDetails.currency_symbol
            : null;
        const price = transferBookedDetails
            ? transferBookedDetails.total_price
                ? transferBookedDetails.total_price
                : transferBookedDetails.price
            : null;
        const { cancelFailed } = this.state;

        return (

            <React.Fragment>

                <TopNav isSignUpHide={this.state.isSignCancel} onClick={this.props.onSignIn}/>
                {<Loading/>}

                <section className="searchSection">
                    {transferBookedDetails &&
                    <div className="container">
                        <div className="bookingConfirmation">
                            <div className="bookingStatus">
                                <div className="d-flex flex-row justify-content-between">
                                    <div className="flex-column">
                                        <div className="bookingStatusContent cancelBook">
                                            <h3 style={cancelFailed ? { color: 'red' } : {}}>
                                                {cancelFailed ? 'Cancellation failed please try after sometime' : 'Cancel this Chauffeur Booking'}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-row">
                                    <div className="bookingHotelName">
                                        <h5>{transferBookedDetails.booking_category}</h5>

                                    </div>
                                    <ul className="bookingHotelInfo">
                                        <li className="borderRight">
                                            {moment(transferBookedDetails.start_time).format('ddd')},{moment(transferBookedDetails.start_time).format('MMM DD')}
                                            <img src={img_arrow} alt="arrow"/>

                                            {moment(transferBookedDetails.end_time).format('ddd')},{moment(transferBookedDetails.end_time).format('MMM DD')}
                                        </li>
                                        <li className="borderRight">Total Cost
                                            : {currencies[transferBookedDetails.currency].symbol}&nbsp;{+price} </li>
                                        <li> Booking Id # {bookingId}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bookingStatus">
                                <div className="d-flex flex-row smallTabColumn justify-content-between">
                                    <div className="flex-column hotelImage">

                                        <img src={transferBookedDetails.image} alt="hotelImage"/>

                                    </div>
                                    <div className="flex-column bookingConfirmRoom">
                                        <div className="d-flex flex-row">
                                            <div className="flex-column confirmRoomRight hotelTrips flex-column infoDiv cancebookName">

                                                <h6><h4>{transferBookedDetails.booking_category}</h4></h6>
                                                <ul className="carInfraStru">
                                                    <li>
                                                        <img src={img_carUser} /> 1
                                                        {/* {singleCar.vehicle.passengerCapacity} */}
                                                    </li>
                                                    <li>
                                                        <img src={img_door} /> -
                                                        <li>
                                                            <img src={img_luggage} />1
                                                            {/* {singleCar.vehicle.baggageCapacity} */}
                                                        </li>
                                                    </li>
                                                </ul>

                                                <ul className="pickupDropDet">
                                                    <li className="pickUpTransfer">
                                                        <h6 style={{ textAlign: "center" }}>Pick-Up</h6>
                                                        <p >{transferBookedDetails.start_point.address}</p>
                                                    </li>
                                                    <li className="pickUpTransfer">
                                                        <h6 style={{ textAlign: "center" }}>Drop-Off</h6>
                                                        <p >{transferBookedDetails.end_point.address}</p>
                                                    </li>

                                                </ul>
                                                <ul>
                                                    <li className="border">
                                                        <h5>{moment(transferBookedDetails.start_time).format('MMM DD')}</h5>
                                                        <p>{moment(transferBookedDetails.start_time).format('dddd')}</p></li>
                                                    <li><img src={img_DateArrow}/></li>
                                                    <li className="border">
                                                        <h5>{moment(transferBookedDetails.end_time).format('MMM DD')} </h5>
                                                        <p>{moment(transferBookedDetails.end_time).format('dddd')}</p></li>
                                                </ul>
                                                <ul className="checkInOut">
                                                    <li>
                                                        <img src={img_clock}/>
                                                        <span>Pick Up Time  <b>{moment(transferBookedDetails.start_time, "hh:mm").format("LT")}</b></span>
                                                    </li>
                                                    <li>
                                                        <img src={img_clock}/>
                                                        <span>Drop Off Time  <b>{moment(transferBookedDetails.end_time, "hh:mm").format("LT")}</b></span>
                                                    </li>
                                                </ul>
                                            </div>
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
                                        <div className="flex-column ">
                                            <h6>Chauffeur Cancellation Policy</h6>
                                            <p>
                                                {" "}
                                                <h6 style={{ fontSize: "11px", fontWeight: "600" }}>
                                                    1. You can cancel the Transfer 24 Hrs before your travel.
                                                </h6>
                                                <h6 style={{ fontSize: "11px", fontWeight: "600" }}>
                                                    2. For any changes to your reservation, please drop us an
                                                    email or contact help line immediately.
                                                </h6>
                                            </p>
                                            <div className="totalBookingCost d-flex justify-content-between">
                                                <h5>TOTAL BOOKING COST :</h5>

                                                {/* <p> {parseFloat(cancelRouteInfo.totalAmount).toFixed(2)}</p> */}
                                                <p>{currencies[transferBookedDetails.currency].symbol}&nbsp;{price}</p>

                                            </div>
                                            <div className="totalBookingCost d-flex justify-content-between">

                                                <h5>REFUNDABLE AMOUNT :</h5>
                                                {/* <p> {selectedCurrencyVal} {refundList.data?  parseFloat(refundList.data.refund_amount).toFixed(2):"{selectedCurrencyVal} 0.00"} </p> */}
                                                <p> {currencies[transferBookedDetails.currency].symbol}&nbsp;{price}</p>


                                                {/* {cancelRouteInfo.refundability === "Refundable" ? <p> {selectedCurrencyVal}  { parseFloat(refundList.data.refund_amount).toFixed(2)}</p>:"{selectedCurrencyVal} 0.00" }  */}
                                            </div>
                                            <p>Please provide a reason for the cancellation</p>

                                            <select id="reasonView" className="form-control"
                                                    onChange={this.getSelectValue}>
                                                <option value="">Select Reason</option>
                                                <option value="duplicate">Duplicate</option>
                                                <option value="fraudulent">Fraudulent</option>
                                                <option value="requested_by_customer">Requested by Customer</option>

                                            </select>
                                            <div className="flex-row">
                                                {/* <button type="submit" className="searchBtn mr-2" onClick={() => this.bookingCancelation(true ,cancelRouteInfo)} > CANCEL BOOKING </button> */}

                                                <button type="submit" className="searchBtn mr-2"
                                                        onClick={this.bookingCancelation}> CANCEL BOOKING
                                                </button>
                                                {/* <a href="">KEEP BOOKING</a> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                    <Footer/>

                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    transferBookedDetails: state.transferReducer.transferBookedDetails,
    loginDetails: state.loginReducer.loginDetails,
    // TODO : need to get currency value from transaction list api
    selectedCurrency: state.commonReducer.selectedCurrency,
    transferCancelBookStatus: state.transferReducer.transferCancelBookStatus,
});

const mapDispatchToProps = dispatch => ({
    transferGetBooking: payloadInfo => dispatch(transferGetBooking(payloadInfo)),
    transferCancelBooking: payloadInfo => dispatch(transferCancelBooking(payloadInfo)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransferCancelBooking));
