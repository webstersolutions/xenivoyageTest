import React from 'react';
import { connect } from "react-redux";
import moment from "moment";

import img_location from '../../../asset/images/Where Icon (Map Marker).svg';
import img_clock from '../../../asset/images/Time.svg';
import img_arrow from '../../../asset/images/bookingConfirm/Shapearrow.png';
import img_hotel from '../../../asset/images/dashboard/hotelPic.jpg';
import img_DateArrow from "../../../asset/images/Date Arrow.png";
import img_close from "../../../asset/images/bookingConfirm/close.png";
import img_print from '../../../asset/images/dashboard/print.png';

import img_call from "../../../asset/images/bookingConfirm/call-answer.png";
import img_hotelBuild from '../../../asset/images/hotel-building.png';
import img_search from '../../../asset/images/search.png';
import Footer from '../../Footer';
import TopNav from '../TopNav';

var currencies = require('country-data').currencies;

class CancelledBooking extends React.Component {

    componentDidMount() {
        window.scrollTo(0, 0)
    }
    print = (event) => {
        event.preventDefault();
        window.print();
    }

    render() {

        const { loginDetails, refundList, cancelledBookingInfo, selectedCurrency } = this.props;

        const cancelRouteInfo = cancelledBookingInfo && cancelledBookingInfo.length != 0 && cancelledBookingInfo.data.result

        var date1 = new Date(cancelRouteInfo && cancelRouteInfo.length != 0 && cancelRouteInfo.stayPeriod.start);
        var date2 = new Date(cancelRouteInfo && cancelRouteInfo.length != 0 && cancelRouteInfo.stayPeriod.end);
        var stayPeriod = date2.getDate() - date1.getDate();
        
        const selectedCurrencyVal = currencies[this.props.cancelRouteInfo.fareBreakup.currency].symbol;

        return (
            <React.Fragment>
                <TopNav onClick={this.props.onSignIn} />
                <section className="searchSection">
                    <div className="container">
                        <div className="bookingConfirmation">
                            <div className="bookingStatus">
                                <div className="d-flex flex-row smallTabColumn justify-content-between">
                                    <div className="flex-column">
                                        <div className="bookingStatusContent cancelledBook">

                                            <h3 style={{ textTransform: "capitalize" }}>{cancelledBookingInfo.data.message}</h3>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <ul className="bookingShare">
                                            <li onClick={this.print}><img src={img_print} alt="print" /> Print</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex-row">
                                    <div className="bookingHotelName">
                                        {/* <h5>{hotelName}</h5> */}
                                    </div>
                                    <li className="borderRight"> {moment(cancelRouteInfo && cancelRouteInfo ? cancelRouteInfo.stayPeriod.start : "")
                                        .format("MMM DD YYYY")
                                        .toUpperCase()} {moment(cancelRouteInfo && cancelRouteInfo ? cancelRouteInfo.stayPeriod.start : "").format("dddd")} <img src={img_DateArrow} alt="arrow" />  {moment(cancelRouteInfo.stayPeriod.end)
                                            .format("MMM DD YYYY")
                                            .toUpperCase()} {moment(cancelRouteInfo && cancelRouteInfo ? cancelRouteInfo.stayPeriod.end : "").format("dddd")}</li>
                                    <li className="borderRight">Total Cost : {selectedCurrencyVal}&nbsp;{parseFloat(cancelRouteInfo && cancelRouteInfo.totalAmount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </li>
                                    <li> Booking ID #  {cancelRouteInfo && cancelRouteInfo.bookingId}</li>
                                </div>
                            </div>

                            <div className="bookingStatus">
                                <div className="d-flex flex-row smallTabColumn justify-content-between">
                                    <div className="flex-column hotelImage">

                                        <img src={cancelRouteInfo && cancelRouteInfo.hotel_images[0] && cancelRouteInfo.hotel_images[0].URL} alt="No images available" />

                                    </div>
                                    <div className="flex-column bookingConfirmRoom">
                                        <div className="d-flex flex-row">
                                            <div className="flex-column infoDiv cancebookName">

                                                <h6>{cancelRouteInfo && cancelRouteInfo.hotel_address.name === undefined ? "" : cancelRouteInfo.hotel_address.name}</h6>
                                                <p>

                                                    <a target="_blank" rel="noreferrer">
                                                        <p>{cancelRouteInfo && cancelRouteInfo.hotel_address && cancelRouteInfo.hotel_address.contact && cancelRouteInfo.hotel_address.contact.address && cancelRouteInfo.hotel_address.contact.address.line1}    {cancelRouteInfo && cancelRouteInfo.hotel_address && cancelRouteInfo.hotel_address.contact && cancelRouteInfo.hotel_address.contact.address && cancelRouteInfo.hotel_address.contact.address.city && cancelRouteInfo.hotel_address.contact.address.city.name}</p>
                                                    </a>
                                                </p>
                                                {/* <p><img src={img_call} /> <b>(212) 586-7000</b></p><br/> */}

                                                <span>Booking for {stayPeriod}  Nights</span>
                                                <ul>
                                                    <li className="border">
                                                        <h5>{moment(cancelRouteInfo && cancelRouteInfo.length != 0 && cancelRouteInfo.stayPeriod.start)
                                                            .format("MMM DD")
                                                            .toUpperCase()}</h5>
                                                        <p>{moment(cancelRouteInfo && cancelRouteInfo.length != 0 && cancelRouteInfo.stayPeriod.start).format("dddd")} </p>
                                                    </li>
                                                    <li>
                                                        <img src={img_DateArrow} />
                                                    </li>
                                                    <li className="border">
                                                        <h5>{moment(cancelRouteInfo && cancelRouteInfo.length != 0 && cancelRouteInfo.stayPeriod.end)
                                                            .format("MMM DD")
                                                            .toUpperCase()}</h5>
                                                        <p>{moment(cancelRouteInfo && cancelRouteInfo.length != 0 && cancelRouteInfo.stayPeriod.end).format("dddd")} </p>
                                                    </li>
                                                </ul>
                                                <ul className="checkInOut">
                                                    <li>
                                                        <img src={img_clock} />
                                                        <span>Check In<b>  {cancelRouteInfo.checkinCheckoutPolicy.length
                                                            ? cancelRouteInfo.checkinCheckoutPolicy[0].inTime + 0
                                                            : "12.00am"}</b></span>
                                                    </li>
                                                    <li>
                                                        <img src={img_clock} />
                                                        <span>Check Out <b> {cancelRouteInfo.checkinCheckoutPolicy.length
                                                            ? cancelRouteInfo.checkinCheckoutPolicy[0].outTime + 0
                                                            : "06.00pm"} </b></span>
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
                                        <div className="flex-column ">
                                            <p>Reserved Under <b>{loginDetails && loginDetails.name}</b></p>
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
                                            <p> {cancelRouteInfo && cancelRouteInfo.rooms_info[0] && cancelRouteInfo.rooms_info[0].name}</p>

                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="bookingStatus">

                                <h5>Your Hotel Room has been Cancelled</h5>
                                <p>{cancelRouteInfo && cancelRouteInfo.hotel_address.name === undefined ? "" : cancelRouteInfo.hotel_address.name} has charged you a cancellation fee of  - <b>{cancelRouteInfo.refundability === "Refundable" ? <b>  {selectedCurrencyVal}&nbsp;{parseFloat(cancelRouteInfo && cancelRouteInfo.cancelledCharge).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b> : { selectedCurrencyVal } + 0.00} </b></p><br />
                                <p className="text-center">We have sent a confirmation of the cancellation to: <b>{loginDetails.email}</b></p><br />
                                {/* <div className="d-flex flex-row smallColumn justify-content-center" >
                                <button type="button" className="defaultBtnBook"> <img src={img_hotelBuild} alt="hotel"/>REBOOK AT THIS HOTEL</button>
                                <button type="button" className="defaultBtnBook"><img src={img_search}  alt="search"/> SEARCH HOTELS IN NEW YORK </button>
                            </div> */}

                            </div>

                        </div>
                    </div>
                    <Footer />
                </section>
            </React.Fragment>);
    }
}

// export default CancelledBooking;

const mapStateToProps = state => ({
    cancelRouteInfo: state.dashboardReducer.cancelRouteInfo,
    refundList: state.dashboardReducer.refundList,
    loginDetails: state.loginReducer.loginDetails,
    // TODO : need to get currency value from transaction list api
    selectedCurrency: state.commonReducer.selectedCurrency,
    cancelledBookingInfo: state.dashboardReducer.cancelledBookingInfo

});

export default connect(mapStateToProps, null)(CancelledBooking);