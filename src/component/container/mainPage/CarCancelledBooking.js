import React from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import Footer from '../../Footer';
import TopNav from '../TopNav';
import { map as _map } from 'lodash';
import moment from "moment";
import PropTypes from "prop-types";

import { cancelledBooking } from "../../../service/dashboard/action"
import ImageCarousel from "../../presentational/ImageCarousel";
import SignIn from "../../../component/container/login/SignInModal"

import img_location from '../../../asset/images/Where Icon (Map Marker).svg';
import img_clock from '../../../asset/images/Time.svg';
import img_arrow from '../../../asset/images/bookingConfirm/Shapearrow.png';
import img_hotel from '../../../asset/images/dashboard/hotelPic.jpg';
import img_DateArrow from "../../../asset/images/Date Arrow.png";
import img_call from "../../../asset/images/bookingConfirm/call-answer.png";
import img_Date from "../../../asset/images/Date Arrow.png";
import img_close from "../../../asset/images/bookingConfirm/close.png";
// import Loading from "../component/Loading";
import Loading from "../../Loading";

import { carPrice, carBookingCancel } from '../../../service/car/action';
import queryString from "query-string";

var currencies = require('country-data').currencies;

class CarCancelledBooking extends React.Component {

    state = {
        selectedValue: "",
    }

    componentWillReceiveProps(nextPorps) {
        //   if(nextPorps.hasOwnProperty("carBookedDetails"))
        //   {
        //       if(nextPorps.carBookedDetails.status==true){
        //         this.props.history.push('/carCancelledBooking')
        //       }

        //     }
    }

    handleSignIn = () => {
        this.setState({ isVisibleSignIn: true });
        this.setState({ isdivHide: true });
    };

    getSelectValue = (e) => {
        this.setState({ selectedValue: e.target.value })
    }

    bookingCancelation = () => {

        const { loginDetails } = this.props;
        const payLoad = {
            "bookingId": this.props.carBookedDetails.bookingId,
            "email": loginDetails.email || "",
            "reason": this.state.selectedValue || "",
        }
        this.props.carBookingCancel(payLoad);
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        let { bookingId } = queryString.parse(this.props.location.search)
        bookingId && this.props.getPriceDetails({ bookingId })
    }

    render() {
        const { carDetails, bookingId, amountToRefund } = this.props.carBookedDetails;
        const { selectedCurrency } = this.props;
       const selectedCurrencyVal =carDetails && currencies[carDetails.currency].symbol;

        return (
            <React.Fragment>
                <TopNav isSignUpHide={this.state.isSignCancel} onClick={this.props.onSignIn} />
                {<Loading />}

                <section className="searchSection">
                    {carDetails &&
                        <div className="container">
                            <div className="bookingConfirmation">
                                <div className="bookingStatus">
                                    <div className="d-flex flex-row justify-content-between">
                                        <div className="flex-column">
                                            <div className="bookingStatusContent cancelledBook">

                                                <h3>Your booking has been cancelled sucessfully</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-row">
                                        <div className="bookingHotelName">
                                            <h5>{carDetails.vehicle.name}</h5>
                                        </div>
                                        <ul className="bookingHotelInfo">
                                            <li className="borderRight">
                                                {moment(carDetails.carPickUpDate).format('ddd')},{moment(carDetails.carPickUpDate).format('MMM DD')}
                                                <span> &nbsp; </span> <img src={img_arrow} alt="arrow" /> <span> &nbsp; </span>

                                                {moment(carDetails.carDropDate).format('ddd')},{moment(carDetails.carDropDate).format('MMM DD')}
                                            </li>
                                            <li className="borderRight">Total Cost : {selectedCurrencyVal}&nbsp;{+carDetails.quotedTotalFare} </li>
                                            <li> Booking Id # {bookingId}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bookingStatus">
                                    <div className="d-flex flex-row smallTabColumn justify-content-between">
                                        <div className="flex-column hotelImage">
                                            <img src={carDetails.vehicle.images[0]} alt="hotelImage" />
                                        </div>
                                        <div className="flex-column bookingConfirmRoom">
                                            <div className="d-flex flex-row">
                                                <div className="flex-column infoDiv cancebookName">

                                                    <h6> <h4>{carDetails.vehicle.type}</h4></h6>
                                                    <p>
                                                        <img src={img_location} />
                                                        <a target="_blank" rel="noreferrer">
                                                            {/* {cancelRouteInfo.hotel_address.contact.address.city.name}  */}

                                                            {carDetails.rentalLocations[0].name}
                                                        </a>
                                                    </p>
                                                    {/* <p><img src={img_call} /> <b>(212) 586-7000</b></p><br/> */}

                                                    <span>Booked For {moment(carDetails.carDropDate).diff(moment(carDetails.carPickUpDate), 'days')} Days</span>
                                                    <ul>
                                                        <li className="border"><h5>{moment(carDetails.carPickUpDate).format('MMM DD')}</h5><p>{moment(carDetails.carPickUpDate).format('dddd')}</p></li>
                                                        <li><img src={img_DateArrow} /></li>
                                                        <li className="border"><h5>{moment(carDetails.carDropDate).format('MMM DD')} </h5><p>{moment(carDetails.carDropDate).format('dddd')}</p></li>
                                                    </ul>
                                                    <ul className="checkInOut">
                                                        <li>
                                                            <img src={img_clock} />
                                                            <span>Pick Up Time  <b>{moment(carDetails.carPickUpTime, "hh:mm").format("LT")}</b></span>
                                                        </li>
                                                        <li>
                                                            <img src={img_clock} />
                                                            <span>Drop Off Time  <b>{moment(carDetails.carDropTime, "hh:mm").format("LT")}</b></span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bookingStatus">

                                    <h5>Your Car has been Cancelled</h5>
                                    <p>{carDetails.vendor.name} vendor has charged you a cancellation fee of  <b>{selectedCurrencyVal}&nbsp;{(+carDetails.quotedTotalFare - +this.props.carBookedDetails.amountToRefund).toFixed(2)} </b></p><br />
                                    <p className="text-center">We have sent a confirmation of the cancellation to: <b>{this.props.loginDetails.email}</b></p><br />
                                    {/* <div className="d-flex flex-row smallColumn justify-content-center" >
                                <button type="button" className="defaultBtnBook"> <img src={img_hotelBuild} alt="hotel"/>REBOOK AT THIS HOTEL</button>
                                <button type="button" className="defaultBtnBook"><img src={img_search}  alt="search"/> SEARCH HOTELS IN NEW YORK </button>
                            </div> */}
                                </div>
                            </div>
                        </div>}
                    <Footer />

                </section>
            </React.Fragment>);
    }
}

const mapStateToProps = state => ({
    carBookedDetails: state.carReducer.carBookedDetails,
    paymentDetails: state.carReducer.carBookingResult,
    loginDetails: state.loginReducer.loginDetails,
    // TODO : need to get currency value from transaction list api
    selectedCurrency: state.commonReducer.selectedCurrency
});

const mapDispatchToProps = dispatch => ({
    getPriceDetails: payloadInfo => dispatch(carPrice(payloadInfo)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CarCancelledBooking));




