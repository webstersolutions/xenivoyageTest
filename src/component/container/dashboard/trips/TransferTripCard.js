import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { sumBy as _sumBy, map as _map, get as _get } from "lodash";
import moment from "moment";

import {
  getRefundAmount,
  getCancelInfo
} from "../../../../service/dashboard/action";

import ImageCarousel from "../../../presentational/ImageCarousel";
import Dashboard from "../../../../view/dashboard";
import MainContainer from "../../../container/mainPage/MainContainer";
import DBTrips from "../../../container/dashboard/DBTrips";
// E:\xeni_react_rebo\xeniapp-ui\src\view\dashboard.js

//E:\xeni_react_rebo\xeniapp-ui\src\view\MainPage.js

import { RawHtmlToJSON } from "../../../presentational/RawHtmlToJSON";
import img_DateArrow from "../../../../asset/images/Date Arrow.png";
import img_gmail from "../../../../asset/images/dashboard/gmail.png";
import img_whatsapp from "../../../../asset/images/dashboard/whatsapp.png";
import img_google from "../../../../asset/images/dashboard/google-plus.png";
import img_calend from "../../../../asset/images/dashboard/calend.png";
import img_extrabed from "../../../../asset/images/selectRoom/extrabed.png";
import img_print from "../../../../asset/images/dashboard/print.png";
import img_socialClick from "../../../../asset/images/dashboard/socialClick.png";
import img_plane from "../../../../asset/images/plane.png";
import img_Date from "../../../../asset/images/Date Arrow.png";
import img_Departure from "../../../../asset/images/Departure.svg";
import img_Time from "../../../../asset/images/Time.svg";
import img_Airlines from "../../../../asset/images/United-Airlines.png";
import img_Arrival from "../../../../asset/images/Arrival.svg";
import img_car from "../../../../asset/images/car.png";
import img_transfer from "../../../../asset/images/chauffeur.png";
import img_hotel from "../../../../asset/images/hotel-building.png";
import img_television from "../../../../asset/images/television.png";
import img_signal from "../../../../asset/images/selectRoom/signal.png";
import img_icon from "../../../../asset/images/selectRoom/icon.png";
import img_parking from "../../../../asset/images/selectRoom/parking-sign(1).png";
import img_tick from "../../../../asset/images/roundTick.png";
import img_info from "../../../../asset/images/information.png";
import img_discount from "../../../../asset/images/discount.png";
import img_noSmoke from "../../../../asset/images/no-smoking-sign (1).png";
import img_close from "../../../../asset/images/cancel.png";
import img_reserve from "../../../../asset/images/online-booking.png";
import img_carUser from "../../../../asset/images/dashboard/carUser.png";
import img_door from "../../../../asset/images/dashboard/door.png";
import img_luggage from "../../../../asset/images/dashboard/luggage.png";

import queryString from "query-string";
var currencies = require("country-data").currencies;
const _typeIcon = {
  hotel: img_hotel,
  car: img_car,
  flight: img_plane,
  transfer: img_transfer
};

class TransferTripCard extends Component {
  state = {
    isExpand: false,
    isExpendDiv: true,
    isCancellation: false,
    isCancelBook: false,
    isHideDiv: false
  };

  handleExpand = event => {
    event.preventDefault();
    this.setState({ isExpand: !this.state.isExpand });
  };

  divOpen = () => {
    this.setState({ isExpendDiv: !this.state.isExpendDiv });
  };

  print = () => {
    var content = document.getElementById("divcontents");
    var pri = document.getElementById("ifmcontentstoprint").contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
  };

  bookingCancel = (flag, cancelInfo) => {
    let { booking_number: bookingId } = this.props.transferDetails;
    this.props.history.push(
      "/transferCancelBooking?" + queryString.stringify({ bookingId })
    );
  };

  render() {
    const { isHideDiv } = this.state;
    const { selectedCurrency } = this.props;
    return <React.Fragment>{this.renderCard()}</React.Fragment>;
  }

  renderCard = () => {
    const { transferDetails, index, selectedCurrency } = this.props;

    const singleCar = transferDetails.taxi;
    //  const selectedCurrencyVal = currencies[singleCar.currency_symbol].symbol;

    // const roomName = TransList.rooms_info[0].length && TransList.rooms_info[0].name;
    //    let roomName;
    //    if(TransList.hasOwnProperty("rooms_info[0]")){
    //     roomName= TransList.rooms_info[0].name;
    //    }

    //    const baseFare = TransList.amtAfterdiscount;
    //    const tax_fee = TransList.fareBreakup.taxes[0] && TransList.fareBreakup.taxes[0].amount + TransList.farebreakupAmount;
    //    const totalAmount = baseFare + tax_fee;

    const { isExpand, isExpendDiv } = this.state;
    // var noOfNights = moment(TransList.stayPeriod.end).diff(moment(TransList.stayPeriod.start), 'days');

    // let  roomDesc=[];
    // if(TransList.rooms_info[0].hasOwnProperty("desc")){
    //     roomDesc = TransList.rooms_info[0].desc.split("<p>");
    //  }

    let selectedCurrencyVal = transferDetails.currency_symbol;
    let price = singleCar.price;

    if (transferDetails.currency && transferDetails.total_price) {
      selectedCurrencyVal = currencies[transferDetails.currency].symbol;
      price = transferDetails.total_price;
    }

    console.log("singleCar::::::", singleCar)

    return (
      <React.Fragment>
        {/* <iframe id="ifmcontentstoprint"  style={{height:'0px' , width:'0px',position:"Absolute"}}></iframe> */}
        {/* <span id="divcontents"> */}
        <tr
          id="divcontents"
          className={index % 2 ? "even" : "odd"}
          onClick={this.handleExpand}
        >
          <td data-label="SI">
            <img src={_typeIcon["transfer"]} alt={"no"} />
          </td>
          <td data-label="Title"> {singleCar.booking_category}</td>

          <td data-label="Location"> {singleCar.end_point.address} </td>
          <td data-label="Date Booked">
            {moment(transferDetails.booked_date).format("MM/DD/YYYY")}
          </td>
          <td data-label="Travel Date">
            {moment(singleCar.start_time).format("MM/DD/YYYY")}{" "}
            <img src={img_Date} alt="date" />{" "}
            {moment(singleCar.end_time).format("MM/DD/YYYY")}
          </td>
          <td data-label="Price">
            {selectedCurrencyVal}
            {parseFloat(price).toFixed(2)}
          </td>
          <td data-label="Booking Id">{singleCar.booking_number}</td>
          {/* <td data-label="Co-relation Id">{singleCar.correlationId}</td>
                    <td data-label="Cancellation Id">{singleCar.cancellationId}</td> */}
          <td data-label="Booking Status">{transferDetails.booking_type}</td>

          {/* <td> <button type="submit" className="primary" onClick= { () =>this.props.onCancel(TransList)}>  </button> </td> */}
        </tr>

        <tr className={isExpand ? "collapseRow" : "collapseRow collapse"}>
          <td colSpan="10">
            <div
              id="collapseOne"
              className="detailsShow"
              data-parent="#accordion"
            >
              <div className="d-flex flex-row resWrap">
                <div className="flex-column confirmRoomLeft">
                  <div className="carImgShow">
                    <img src={transferDetails.image} className="carImg" />
                    {/* <img src={singleCar.vehicle} className="carLogoImg" /> */}
                  </div>
                  {/* {TransList.hotel_images.length ? (
                        <ImageCarousel
                            imageList={_map(TransList.hotel_images, each => ({
                                name: each.imageCaption,
                                url: each.URL
                            }))}
                        />
                    ) : (
                            
                        )} */}

                  <div className="flex-column">
                    {/* <ul> 
                        
                                {roomDesc.length > 0 && roomDesc[1] ? <li><img style={{ width: '18px' }} src={img_extrabed} alt="" /> &nbsp;<p>{rmvHtmlFunc(roomDesc[1])}</p></li> : null}
                                        {TransList.refundability === 'Refundable' ?
                                            <React.Fragment>
                                            <li><img style={{ width: '16px' }} src={img_tick} alt="" /> <p>Free Cancellation till {moment(TransList.cancellationPolicy.penaltyRules[0].window.start).format('MM-DD-YYYY')}</p> </li>  <p style={{marginLeft:"20px"}}>{TransList.refundability}</p>
                                            </React.Fragment> : <li> <img style={{ width: '18px' }} src={img_close} alt="" /> <p> Non Refundable </p></li>
                                        }
                                        {TransList.rooms_info[0].smokingIndicator ? TransList.rooms_info[0].smokingIndicator !== 'Unknown' ?
                                    <li><img style={{ width: '18px' }} src={img_noSmoke} alt="" /> &nbsp;<p>{TransList.rooms_info[0].smokingIndicator}</p></li>
                                : <li><img style={{ width: '18px' }} src={img_noSmoke} alt="" /> &nbsp;<p>Smoking/ Non Smoking</p></li> : null}

                                {roomDesc.length > 0 ? <li><img style={{ width: '18px' }} src={img_hotel} alt="" /> &nbsp;<p>{rmvHtmlFunc(roomDesc[3])}</p></li> : null}
                                {roomDesc.length > 0 ? <li><img style={{ width: '18px' }} src={img_television} alt="" /> &nbsp;<p>{rmvHtmlFunc(roomDesc[4])}</p></li> : null}
                            </ul> */}

                    {/* <ul>
                               
                                {TransList.rooms_info ? <React.Fragment>
                                    <li><img style={{ width: '18px' }} src={img_hotcoffee} alt="" />&nbsp; <p>{rate.boardBasis.desc}</p> </li></React.Fragment> :
                                    <li><img style={{ width: '18px' }} src={img_extrabed} alt="" /> &nbsp;<p>Room Only</p></li>}
                                {rate.inclusions ? _map(rate.inclusions, (each, i) => {
                                    return (
                                        <li key={i}><img style={{ width: '18px' }} src={img_signal} alt="" /> &nbsp;<p>{each}</p></li>
                                    )
                                }) : roomDescription[5] ? <li><img style={{ width: '18px' }} src={img_hotel} alt="" /> &nbsp;<p>{rmvHtmlFunc(roomDescription[5])}</p></li> : null}
                            </ul> */}
                  </div>
                </div>
                <div className="flex-column confirmRoomRight hotelTrips">
                  <div>
                    {/* <h4>{singleCar.booking_origin}</h4> */}
                    <h4>{singleCar.booking_category} </h4>

                    <ul className="carInfraStru">
                      <li>
                        <img src={img_carUser} />
                        {singleCar.passengers}
                      </li>
                      <li>
                        <img src={img_door} /> -
                      </li>
                      <li>
                          <img src={img_luggage} />
                          {singleCar.luggage}
                        </li>
                    </ul>

                    <ul className="pickupDropDet">
                      <li className="pickUpWidth1">
                        <h6 style={{ textAlign: "center" }}>Pick-Up</h6>
                        <p>{singleCar.start_point.address}</p>
                      </li>
                      <li className="pickUpWidth1">
                        <h6 style={{ textAlign: "center" }}>Drop-Off</h6>
                        <p>{singleCar.end_point.address}</p>
                      </li>
                    </ul>

                    <ul>
                      <li className="border">
                        <h5>
                          {moment(singleCar.start_time, "YYYY-MM-DD hh:mm:ss")
                            .format("MMM DD")
                            .toUpperCase()}
                        </h5>
                        <p>
                          {moment(
                            singleCar.start_time,
                            "YYYY-MM-DD hh:mm:ss"
                          ).format("dddd")}
                        </p>
                      </li>
                      <li>
                        <img src={img_DateArrow} />
                      </li>
                      <li className="border">
                        <h5>
                          {moment(singleCar.end_time, "YYYY-MM-DD hh:mm:ss")
                            .format("MMM DD")
                            .toUpperCase()}
                        </h5>
                        <p>
                          {moment(
                            singleCar.end_time,
                            "YYYY-MM-DD hh:mm:ss"
                          ).format("dddd")}
                        </p>
                      </li>
                    </ul>
                    <ul className="checkInOut">
                      <li>
                        <img src={img_Time} />
                        <span>
                          Pick Up
                          <b>
                            {moment(
                              singleCar.start_time,
                              "YYYY-MM-DD hh:mm:ss"
                            ).format("LT")}
                          </b>
                        </span>
                      </li>
                      <li>
                        <img src={img_Time} />
                        <span>
                          Drop Off
                          <b>
                            {moment(
                              singleCar.end_time,
                              "YYYY-MM-DD hh:mm:ss"
                            ).format("LT")}
                          </b>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex-column priceDetails hotelTrips">
                  <div className="d-flex justify-content-between OtherOptions">
                    {/*  <div>
                                       <ReactToPrint
                                            trigger={() => <a><img src={img_print} /></a>}
                                            content={() => this.renderCard()}
                                        /> 
                                          {<ComponentToPrint ref={el => (this.componentRef = el)} />}
                                         </div>*/}

                    <div>
                      {" "}
                      <a onClick={this.print}>
                        <img src={img_print} />
                      </a>
                      <a>
                        <img src={img_socialClick} />
                      </a>
                    </div>
                    <div className="calenderView">
                      <a>
                        <img src={img_calend} />
                      </a>
                    </div>
                  </div>

                  <ul className="totalAmountDis">
                    {/* <li><span>Base Fare</span> <span>{currencies[singleCar.currency_code].symbol}{+singleCar.fare.displayFare.breakup.baseFare.amount}</span></li>
                                        <li><span>Taxes & Fees</span> <span>{currencies[singleCar.currency_code].symbol} {(+singleCar.quotedTotalFare - +singleCar.fare.displayFare.breakup.baseFare.amount).toFixed(2)}</span></li> */}
                    <li>
                      <span>Total Cost</span>{" "}
                      <span>
                        {selectedCurrencyVal} {+price}
                      </span>
                    </li>
                  </ul>

                  <div className="">
                    {/* <button type="submit" className="searchBtn">Reschedule</button> */}
                    {/* <button type="submit" className="searchBtn completebtn"   onClick={() => this.bookingCancel(true,TransList)}> Cancel</button> */}
                    {/* {this.props.carDetails.bookingStatus != "Canceled" && */}

                    {/* <button type="submit" className="searchBtn completebtn" onClick={() => this.bookingCancel()}> Cancel</button> */}
                    {_get(transferDetails, "can_be_cancelled", "false") ===
                    "true" ? (
                      <button
                        type="submit"
                        className="searchBtn completebtn"
                        onClick={() => this.bookingCancel()}
                      >
                        {" "}
                        Cancel
                      </button>
                    ) : (
                      ""
                    )}

                    {/* } */}
                  </div>
                  <div>
                    <h6 onClick={this.divOpen}>
                      {" "}
                      Cancellation and reservation policy{" "}
                      <i
                        style={{ cursor: "pointer" }}
                        className="fas fa-angle-double-down"
                      />
                    </h6>

                    {isExpendDiv && isExpendDiv === true ? (
                      <p>
                        {" "}
                        <h6 style={{ fontSize: "11px", fontWeight: "600" }}>
                          1. You can cancel the Transfer 24 Hrs before your
                          travel.
                        </h6>
                        <h6 style={{ fontSize: "11px", fontWeight: "600" }}>
                          2. For any changes to your reservation, please drop us
                          an email or contact help line immediately.
                        </h6>
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div style={{textAlign: "left", padding: "14px"}}>
                <div style={{padding: "5px 0"}}>
                  <span style={{fontSize: "14px", fontWeight: "bold"}}>First Name: </span>
                  <span style={{fontSize: "14px"}}>{singleCar.passenger.first_name}</span>
                </div>
                <div style={{padding: "5px 0"}}>
                  <span style={{fontSize: "14px", fontWeight: "bold"}}>Last Name: </span>
                  <span style={{fontSize: "14px"}}>{singleCar.passenger.last_name}</span>
                </div>
                <div style={{padding: "5px 0"}}>
                  <span style={{fontSize: "14px", fontWeight: "bold"}}>Email: </span>
                  <span style={{fontSize: "14px"}}>{singleCar.passenger.email}</span>
                </div>
                <div style={{padding: "5px 0"}}>
                  <span style={{fontSize: "14px", fontWeight: "bold"}}>Mobile Number: </span>
                  <span style={{fontSize: "14px"}}>{singleCar.passenger.mobile}</span>
                </div>
                <div style={{padding: "5px 0"}}>
                  <span style={{fontSize: "14px", fontWeight: "bold"}}>Flight Details: </span>
                  <span style={{fontSize: "14px"}}>{transferDetails.flightDetail !="" && transferDetails.flightDetail ? transferDetails.flightDetail : "-"}</span>
                </div>
                <div style={{padding: "5px 0"}}>
                  <span style={{fontSize: "14px", fontWeight: "bold"}}>Message to Driver: </span>
                  <span style={{fontSize: "14px"}}>{transferDetails.messageToDriver !="" && transferDetails.messageToDriver ? transferDetails.messageToDriver : "-"}</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
        {/* </span> */}
      </React.Fragment>
    );
  };
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TransferTripCard)
);
