import React from 'react';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import Footer from '../../Footer';
import TopNav from '../TopNav';

import moment from "moment";


import img_location from '../../../asset/images/Where Icon (Map Marker).svg';
import img_clock from '../../../asset/images/Time.svg';
import img_arrow from '../../../asset/images/bookingConfirm/Shapearrow.png';

import img_DateArrow from "../../../asset/images/Date Arrow.png";
import Loading from "../../Loading";

import {carPrice, carBookingCancel} from '../../../service/car/action';
import queryString from "query-string";

let currencies = require('country-data').currencies;

class CarCancelBooking extends React.Component {

    state = {
        selectedValue: "",
    };


    componentWillReceiveProps(nextPorps) {
        if (nextPorps.hasOwnProperty("carBookingCancelResult")) {
            if (nextPorps.carBookingCancelResult.status == true) {
                let {bookingId} = queryString.parse(this.props.location.search)
                this.props.history.push('/carCancelledBooking?' + queryString.stringify({bookingId}))
            }

        }
    }

    handleSignIn = () => {
        this.setState({isVisibleSignIn: true});
        this.setState({isdivHide: true});
    };

    getSelectValue = (e) => {
        this.setState({selectedValue: e.target.value})
    }

    bookingCancelation = () => {
        const {loginDetails} = this.props;

        if (!this.state.selectedValue) {
            document.getElementById("reasonView").setAttribute("STYLE", "border-color:red;")
            setTimeout(() => {
                document.getElementById("reasonView").removeAttribute("STYLE")
            }, 3000)
        } else {
            const payLoad = {
                "bookingId": this.props.carBookedDetails.bookingId,
                "email": loginDetails.email || "",
                "reason": this.state.selectedValue,
                "sessionId": this.props.carBookedDetails.sessionId
            };
            this.props.carBookingCancel(payLoad);
        }

    }

    componentDidMount() {
        window.scrollTo(0, 0)
        let {bookingId} = queryString.parse(this.props.location.search)
        bookingId && this.props.getPriceDetails({bookingId})
        this.props.deletePayloadCancelBooking()
    }

    render() {

        const {carDetails, bookingId, amountToRefund} = this.props.carBookedDetails;
        const {selectedCurrency} = this.props;
        const selectedCurrencyVal = carDetails && currencies[carDetails.currency].symbol;

        return (

            <React.Fragment>

                <TopNav isSignUpHide={this.state.isSignCancel} onClick={this.props.onSignIn}/>
                {<Loading/>}

                <section className="searchSection">
                    {carDetails &&
                    <div className="container">
                        <div className="bookingConfirmation">
                            <div className="bookingStatus">
                                <div className="d-flex flex-row justify-content-between">
                                    <div className="flex-column">
                                        <div className="bookingStatusContent cancelBook">
                                            <h3>Cancel this Car Booking</h3>
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
                                            <img src={img_arrow} alt="arrow"/>

                                            {moment(carDetails.carDropDate).format('ddd')},{moment(carDetails.carDropDate).format('MMM DD')}
                                        </li>
                                        <li className="borderRight">Total Cost
                                            : {selectedCurrencyVal}&nbsp;{+carDetails.quotedTotalFare} </li>
                                        <li> Booking Id # {bookingId}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bookingStatus">
                                <div className="d-flex flex-row smallTabColumn justify-content-between">
                                    <div className="flex-column hotelImage">

                                        <img src={carDetails.vehicle.images[0]} alt="hotelImage"/>

                                    </div>
                                    <div className="flex-column bookingConfirmRoom">
                                        <div className="d-flex flex-row">
                                            <div className="flex-column infoDiv cancebookName">

                                                <h6><h4>{carDetails.vehicle.type}</h4></h6>
                                                <p>
                                                    <img src={img_location}/>
                                                    <a target="_blank" rel="noreferrer">
                                                        {/* {cancelRouteInfo.hotel_address.contact.address.city.name}  */}

                                                        {carDetails.rentalLocations[0].name}
                                                    </a>
                                                </p>
                                                {/* <p><img src={img_call} /> <b>(212) 586-7000</b></p><br/> */}

                                                <span>Booked For {moment(carDetails.carDropDate).diff(moment(carDetails.carPickUpDate), 'days')} Days</span>
                                                <ul>
                                                    <li className="border">
                                                        <h5>{moment(carDetails.carPickUpDate).format('MMM DD')}</h5>
                                                        <p>{moment(carDetails.carPickUpDate).format('dddd')}</p></li>
                                                    <li><img src={img_DateArrow}/></li>
                                                    <li className="border">
                                                        <h5>{moment(carDetails.carDropDate).format('MMM DD')} </h5>
                                                        <p>{moment(carDetails.carDropDate).format('dddd')}</p></li>
                                                </ul>
                                                <ul className="checkInOut">
                                                    <li>
                                                        <img src={img_clock}/>
                                                        <span>Pick Up Time  <b>{moment(carDetails.carPickUpTime, "hh:mm").format("LT")}</b></span>
                                                    </li>
                                                    <li>
                                                        <img src={img_clock}/>
                                                        <span>Drop Off Time  <b>{moment(carDetails.carDropTime, "hh:mm").format("LT")}</b></span>
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
                                            <h6>Hotel Cancellation Policy</h6>
                                            {/* <p> {cancelRouteInfo.cancellationPolicy.text}</p> */}
                                            <p>{carDetails.carRental.cancellationPolicy.text}</p>
                                            <div className="totalBookingCost d-flex justify-content-between">
                                                <h5>TOTAL BOOKING COST :</h5>

                                                {/* <p> {parseFloat(cancelRouteInfo.totalAmount).toFixed(2)}</p> */}
                                                <p>{selectedCurrencyVal}&nbsp;{carDetails.quotedTotalFare}</p>

                                            </div>
                                            <div className="totalBookingCost d-flex justify-content-between">

                                                <h5>REFUNDABLE AMOUNT :</h5>
                                                {/* <p> {selectedCurrencyVal} {refundList.data?  parseFloat(refundList.data.refund_amount).toFixed(2):"{selectedCurrencyVal} 0.00"} </p> */}
                                                <p> {selectedCurrencyVal}&nbsp;{amountToRefund.toFixed(2)}</p>


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
            </React.Fragment>);
    }
}

const mapStateToProps = state => ({
    carBookedDetails: state.carReducer.carBookedDetails,
    carBookingCancelResult: state.carReducer.carBookingCancelResult,
    paymentDetails: state.carReducer.carBookingResult,
    loginDetails: state.loginReducer.loginDetails,
    // TODO : need to get currency value from transaction list api
    selectedCurrency: state.commonReducer.selectedCurrency
});

const mapDispatchToProps = dispatch => ({
    deletePayloadCancelBooking: () => dispatch({
        type: "CAR_BOOKING_CANCEL_FAILURE",
        payload: {}
    }),
    getPriceDetails: payloadInfo => dispatch(carPrice(payloadInfo)),
    carBookingCancel: payloadInfo => dispatch(carBookingCancel(payloadInfo)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CarCancelBooking));




