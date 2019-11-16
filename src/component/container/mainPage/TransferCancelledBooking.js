import React from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import Footer from '../../Footer';
import TopNav from '../TopNav';
import moment from "moment";
import PropTypes from "prop-types";

import img_clock from '../../../asset/images/Time.svg';
import img_arrow from '../../../asset/images/bookingConfirm/Shapearrow.png';
import img_DateArrow from "../../../asset/images/Date Arrow.png";
import Loading from "../../Loading";

import queryString from "query-string";
import img_carUser from "../../../asset/images/dashboard/carUser.png";
import img_door from "../../../asset/images/dashboard/door.png";
import img_luggage from "../../../asset/images/dashboard/luggage.png";
import {transferGetBooking} from "../../../service/transfer/action";

var currencies = require('country-data').currencies;

class TransferCancelledBooking extends React.Component {

    state = {
        selectedValue: "",
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        let {bookingId} = queryString.parse(this.props.location.search);
        bookingId && this.props.transferGetBooking({bookingId});
    }

    handleSignIn = () => {
        this.setState({ isVisibleSignIn: true });
        this.setState({ isdivHide: true });
    };

    render() {
        const { transferBookedDetails } = this.props;
        let {bookingId} = queryString.parse(this.props.location.search);
        const selectedCurrencyVal = transferBookedDetails
            ? transferBookedDetails.currency
                ? currencies[transferBookedDetails.currency].symbol
                : transferBookedDetails.currency_symbol
            : null;
        const price = transferBookedDetails
            ?transferBookedDetails.convertedPrice
                ? transferBookedDetails.total_price
                : transferBookedDetails.price
            : null;

        return (
            <React.Fragment>
                <TopNav isSignUpHide={this.state.isSignCancel} onClick={this.props.onSignIn} />
                {<Loading />}

                <section className="searchSection">
                    {transferBookedDetails &&
                    <div className="container">
                        <div className="bookingConfirmation">
                            <div className="bookingStatus">
                                <div className="d-flex flex-row justify-content-between">
                                    <div className="flex-column">
                                        <div className="bookingStatusContent cancelledBook">

                                            <h3>Your booking has been cancelled successfully</h3>
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
                                            : {selectedCurrencyVal}&nbsp;{+price} </li>
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
                                                    <li>
                                                        <h6 style={{ textAlign: "center" }}>Pick-Up</h6>
                                                        <p >{transferBookedDetails.start_point.address}</p>
                                                    </li>
                                                    <li>
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
                            <div className="bookingStatus">

                                <h5>Your Car has been Cancelled</h5>
                                <p>{transferBookedDetails.booking_origin} vendor has charged you a cancellation fee of  <b>{selectedCurrencyVal}&nbsp;{0} </b></p><br />
                                <p className="text-center">We have sent a confirmation of the cancellation to: <b>{this.props.loginDetails.email}</b></p><br />
                            </div>
                        </div>
                    </div>}
                    <Footer />

                </section>
            </React.Fragment>);
    }
}

const mapStateToProps = state => ({
    transferBookedDetails: state.transferReducer.transferBookedDetails,
    // TODO : need to get currency value from transaction list api
    selectedCurrency: state.commonReducer.selectedCurrency,
    loginDetails: state.loginReducer.loginDetails,
});

const mapDispatchToProps = dispatch => ({
    transferGetBooking: payloadInfo => dispatch(transferGetBooking(payloadInfo)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransferCancelledBooking));
