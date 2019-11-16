import React from "react";
import img_tick from "../../../asset/images/bookingConfirm/checked.png";
import img_share from "../../../asset/images/dashboard/socialClick.png";
import img_print from "../../../asset/images/dashboard/print.png";
import img_download from "../../../asset/images/download-icon.jpg";
import img_location from "../../../asset/images/Where Icon (Map Marker).svg";
import img_rating from "../../../asset/images/yellowStar4.png";
import img_clock from "../../../asset/images/Time.svg";
import img_arrow from "../../../asset/images/bookingConfirm/Shapearrow.png";
import img_hotel from "../../../asset/images/dashboard/hotelPic.jpg";
import img_DateArrow from "../../../asset/images/Date Arrow.png";
import img_extrabed from "../../../asset/images/selectRoom/extrabed.png";
import img_info from "../../../asset/images/information.png";
import img_user from "../../../asset/images/dashboard/carUser.png";
import img_xenni from "../../../asset/images/bookingConfirm/Xennies-Text-3D.png";
import img_help from "../../../asset/images/CVV Help.png";
import { map as _map } from "lodash";
import Html2Canvas from 'html2canvas';
import JSPdf from 'jspdf';


import ImageCarousel from "../../../component/presentational/ImageCarousel";
import UserRating from "../../../component/presentational/UserRating";

import img_info_car from '../../../asset/images/Important Information.svg';
import img_carLogo from '../../../asset/images/car/carlogo.png';
import img_carImg from '../../../asset/images/car/carImg.png';
import img_carUser from '../../../asset/images/dashboard/carUser.png';
import img_door from '../../../asset/images/dashboard/door.png';
import img_luggage from '../../../asset/images/dashboard/luggage.png';
import openNewTab from "../../../asset/images/dashboard/resize.png";
import img_Time from "../../../asset/images/Time.svg";


import queryString from "query-string";
import moment from "moment";
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import Footer from "../../Footer";
import TopNav from "../TopNav";

import { carPrice } from '../../../service/car/action';

var currencies = require('country-data').currencies;

class CarBookingConfirmation extends React.Component {
  state = { booking_result: {}, bookingArray: [] };

  rmvHtmlFunc = str => {
    if (str === null || str === "") return "No Description Available";
    else str = str.toString();
    return str.replace(/<[^>]*>/g, "");
  };

  print = event => {
    event.preventDefault();
    window.print();
  };

  download = event => {
    event.preventDefault();
    Html2Canvas(document.getElementById("print"))
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new JSPdf({
            orientation: 'landscape',
          });
          const width = pdf.internal.pageSize.getWidth();
          const height = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
          pdf.save("booking.pdf");
        });
  };


  componentDidMount() {
    window.scrollTo(0, 0)
    const values = queryString.parse(this.props.location.search)
    let sessionId;
    if (this.props.sessionId) {
      sessionId = this.props.sessionId
    } else {
      sessionId = values.sessionId
    }

    this.props.getPrice({
      sessionId: sessionId,
      rentalId: values.rentalId,
      currency: this.props.selectedCurrency
    })
  }
  componentWillReceiveProps(newProps) {

    if (this.props.location !== newProps.location) {
      //  this.getCarList(newProps.location);

    }
  }

  onCancelBooking = () => {
    const { bookingId } = queryString.parse(this.props.location.search)
    this.props.history.push("/carCancelBooking?" + queryString.stringify({ bookingId }));
  }

  render() {

    const carResponse = this.props.carPricedetails;
   
    let { carDropDate, carDropTime, carPickUpDate, carPickUpTime, driverAge, dropOffLocation, pickUpLocation, selectedDropoff, selectedPickup } = queryString.parse(this.props.location.search)
    const { bookingId } = queryString.parse(this.props.location.search)
    const { selectedCurrency } = this.props;
    const selectedCurrencyVal = currencies[this.props.selectedCurrencyApi].symbol;

    return (

      <React.Fragment>
        <TopNav onClick={this.props.onSignIn} />
        {carResponse &&
          <section className="searchSection">
            <div className="container">
              <div id="print" className="bookingConfirmation">
                <div className="bookingStatus">
                  <div className="d-flex flex-row smallTabColumn justify-content-between">
                    <div className="flex-column">
                      <div className="bookingStatusContent">
                        <img src={img_tick} alt="tick" />
                        <h3>Your Booking has Been Confirmed</h3>
                      </div>
                    </div>
                    <div className="flex-column">
                      <ul className="bookingShare">
                        <li onClick={this.print}>
                          <img src={img_print} alt="print" /> Print
                      </li>
                        <li onClick={this.download}>
                          <img src={img_download} alt="download" /> Download
                        </li>
                        {/* <li>
                          <img src={img_share} alt="Share" /> Share
                      </li> */}
                      </ul>
                    </div>
                  </div>
                  <div className="flex-row">
                    <div className="bookingHotelName">
                      <h5>
                        <h5> {carResponse.vehicle.name}</h5>
                        {/* <h4>{carResponse.vehicle.type}</h4> */}
                      </h5>
                    </div>
                    <ul className="bookingHotelInfo">
                      <li className="borderRight">
                        {moment(carPickUpDate).format('ddd')},{moment(carPickUpDate).format('MMM DD')}
                        <img src={img_arrow} alt="arrow" />

                        {moment(carDropDate).format('ddd')},{moment(carDropDate).format('MMM DD')}
                      </li>
                      <li className="borderRight">Total Cost : {selectedCurrencyVal}&nbsp;{+carResponse.quotedTotalFare} </li>
                      <li> Xeniapp Booking Id # {bookingId}</li>
                      <li> Supplier Confirmation # {carResponse.supplierId}</li>
                    </ul>
                  </div>
                </div>
                <div className="bookingStatus">

                  <div className="selectRoomItemsBg carSelRoom d-flex flex-row smallColumn " >
                    <div className="flex-column  carConfirmLeft" style={{ flex: 1 }}>
                      <div className="carConfirmImgDiv">
                        <img src={carResponse.vendor.logo} className="carLogoWidth" />
                        <div className="carImageOnly"><img src={carResponse.vehicle.images[0]} className="carImgWid" /></div>


                      </div>
                      <div className="confirmScreenPick">
                        <ul className="pickupDropDet">
                          <li>
                            <h6>Pick-Up</h6>
                            <p>{selectedPickup}</p>
                          </li>
                          <li><h6>Hours of Operation</h6>
                          {carResponse.rentalLocations[0].hasOwnProperty("hoursOfOperation") && carResponse.rentalLocations[0].hoursOfOperation[moment(carPickUpDate).day()]  ? <p>{moment(carResponse.rentalLocations[0].hoursOfOperation[moment(carPickUpDate).day()].workingHours[0].openTime, 'hh:mm').format("LT")} - {moment(carResponse.rentalLocations[0].hoursOfOperation[moment(carPickUpDate).day()].workingHours[0].closeTime, 'hh:mm').format("LT")}</p>:<p>Not operated</p>}
                             </li>
                          <li><h6>Shuttle to counter and car</h6>
                            <p>Free shuttle to the rental car counter and car loacted off the airport</p>
                          </li>
                        </ul>
                        <ul className="pickupDropDet">
                          <li>
                            <h6>Drop-Off</h6>
                            <p>{selectedDropoff}</p>
                          </li>
                          <li><h6>Hours of Operation</h6>
                          {carResponse.rentalLocations[0].hasOwnProperty("hoursOfOperation") && carResponse.rentalLocations[0].hoursOfOperation[moment(carDropDate).day()] ? <p>{moment(carResponse.rentalLocations[0].hoursOfOperation[moment(carDropDate).day()].workingHours[0].openTime, 'hh:mm').format("LT")} - {moment(carResponse.rentalLocations[0].hoursOfOperation[moment(carDropDate).day()].workingHours[0].closeTime, 'hh:mm').format("LT")}</p>:<p>Not operated</p>}
                             </li>
                        </ul>
                      </div>
                    </div>
                    <div style={{ flex: 1 }} className="flex-column confirmRoomRight carConfirmRight">
                      <div className="carInfo">

                        <h4>{carResponse.vehicle.type}</h4>
                        <h6> {carResponse.vehicle.name}</h6>

                        <ul className="carInfraStru">
                          <li>
                            <img src={img_carUser} /> {carResponse.vehicle.passengerCapacity}
                          </li>
                          <li>
                            <img src={img_door} /> -
																  </li>
                          <li>
                            <img src={img_luggage} /> {carResponse.vehicle.baggageCapacity}
                          </li>
                        </ul>
                      </div>
                      <p>Booked for {moment(carDropDate).diff(moment(carPickUpDate), 'days')} Days</p>
                      <ul className="checkInOut">
									<li><img src={img_Time} /><span>Pick Up<b>{moment(carPickUpTime, "hh:mm").format("LT")}</b></span></li>
									<li><img src={img_Time} /><span>Drop Off<b>{moment(carDropTime, "hh:mm").format("LT")}</b></span></li>
								</ul>
                      <ul>
                        <li className="border"><h5>{moment(carPickUpDate).format('MMM DD')}</h5><p>{moment(carPickUpDate).format('dddd')}</p></li>
                        <li><img src={img_DateArrow} /></li>
                        <li className="border"><h5>{moment(carDropDate).format('MMM DD')} </h5><p>{moment(carDropDate).format('dddd')}</p></li>
                      </ul>
                      {/* <ul className="checkInOut">
                          <li><img src={img_Time} /><span>Check In <b>12.00pm</b></span></li>
                          <li><img src={img_Time} /><span>Check Out <b>06.00pm</b></span></li>
                        </ul> */}
                      <div className="carInfoDiv">
                        <img src={img_info_car} />
                        <p>Important Information about your rental</p>
                      </div>
                      {/* <div className="mt-2"> */}
                        {/* <button type="button" className="searchBtn addIteinary"> <NavLink 
                            to="/car"
                          >
                          Make New booking 
                          </NavLink></button> */}
                        {/* <button type="button" onClick={this.onCancelBooking} className="searchBtn continueBook">Cancel Booking</button> */}
                      {/* </div> */}
                    </div>


                  </div>
                  {/* <div className="d-flex flex-row smallTabColumn justify-content-between">
                  <div className="flex-column hotelImage">
                  </div>        
                </div> */}
                </div>

                <div className="bookingCollapse">
                  <div className="bookingCollapseTitle">
                    <h5>Price Summary & Rewards</h5>
                  </div>
                  <div className="bookingCollapseContent">
                    <div className="d-flex flex-row smallTabColumn justify-content-center">
                      <div className="flex-column checkDiv">
                        <ul className="totalAmountDis" style={{margin: "0 auto"}}>
                          {/* <li>
                            <span>Standard Room, 1 king</span>
                            <span>{selectedCurrencyVal}150/night</span>
                          </li> 
                         <li>
                            <span> 7 Nights</span>
                            <span>{selectedCurrencyVal} 175.25</span>
                          </li> */}

                          <li><span>{moment(carDropDate).diff(moment(carPickUpDate), 'days')} days</span><span>{selectedCurrencyVal}&nbsp;{+carResponse.pricedTotalFare}</span> </li>
                          <li><span>Taxes & Fees</span> <span>{selectedCurrencyVal}&nbsp;{(+carResponse.quotedTotalFare - +carResponse.pricedTotalFare).toFixed(2)}</span></li>
                          <li><span>Total Cost</span> <span>{selectedCurrencyVal}&nbsp;{+carResponse.quotedTotalFare}</span></li>


                        </ul>
                        <p>
                          {/* make dynamic */}
                          Taxes and fees included, except VAT. Local citizens must
                        pay VAT at the hotel. Foreigners may be exempt. Unless
                        specified otherwise, rates are quoted in US dollars.{" "}
                        </p>
                      </div>
                      {/* <div className="flex-column checkDiv">
                        <h6>Xeniapp Rewards</h6>
                        <div className="poweredBy">
                          <span>Powered By</span>
                          <img src={img_xenni} alt="xenni coin" />
                        </div>
                        <div className="earnedXeni">
                          <p>You Earned</p>
                          <h2>120 Xennies</h2>
                          <p>on Trip</p>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="bookingCollapse">
                  <div className="bookingCollapseTitle">
                    <h5>Rules & Restrictions</h5>
                  </div>
                  <div className="bookingCollapseContent">
                    <div className="d-flex flex-row justify-content-start">
                      <div className="flex-column">
                        <h6>Cancellations and Changes</h6>
                        <p>
                          {carResponse.carRental.cancellationPolicy.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>



                <div className="bookingCollapse">
                  <div className="bookingCollapseTitle">
                    <h5>
                      <img src={img_help} alt="help" />  Need more Help ? 
                  </h5>
                  </div>
                  <div className="bookingCollapseContent">
                    <div className="d-flex flex-row justify-content-start">
                      <div className="flex-column">
                        <ul className="needHelp">
                          <li>
                            Visit our  <a href="http://help.xeniapp.com/support/home" target="_blank">Help Desk</a> Page.
                        </li>
                          <li>
                            Xeniapp Customer Care at <b>1800 936 2927</b>.
                        </li>
                          <li>
                            For more efficient support remember your{" "}
                            {/* <b>Booking ID # {bookingId}</b> */}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>}
        <Footer />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  sessionId: state.carReducer.sessionId,
  carPricedetails: state.carReducer.carPrice,
  selectedCurrency: state.commonReducer.selectedCurrency,
  selectedCurrencyApi: state.carReducer.selectedCurrency,
  paymentDetails: state.carReducer.carBookingResult
});
const mapDispatchToProps = dispatch => ({
  getPrice: payloadInfo => dispatch(carPrice(payloadInfo)),
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CarBookingConfirmation));