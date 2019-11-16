import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { sumBy as _sumBy, map as _map, find as _find } from "lodash";
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

class CarTripCard extends Component {
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
    let { bookingId } = this.props.carDetails;
    this.props.history.push(
      "/carCancelBooking?" + queryString.stringify({ bookingId })
    );
    //  this.props.history.push("/carCancelBooking?bookingId="+this.props.carDetails.bookingId);
  };

  render() {
    const { isHideDiv } = this.state;
    const { selectedCurrency } = this.props;
    console.log(this.props)
    return <React.Fragment>{this.renderCard()}</React.Fragment>;
  }

  renderCard = () => {
    const { carDetails, index, selectedCurrency,email,name } = this.props;
    const singleCar = carDetails.carDetails;
    const selectedCurrencyVal = currencies[singleCar.currency].symbol;
    const carPickUpDay = moment(singleCar.carPickUpDate, "YYYY-MM-DD").format(
      "ddd"
    );
    const carDropOffDay = moment(singleCar.carDropDate, "YYYY-MM-DD").format(
      "ddd"
    );
    const pickUpHoursOp = singleCar.rentalLocations[0].hasOwnProperty(
      "hoursOfOperation"
    )
      ? _find(
          singleCar.rentalLocations[0].hoursOfOperation,
          op => op.dayOfWeek === carPickUpDay
        )
      : null;
    const dropOffHoursOp = singleCar.rentalLocations[0].hasOwnProperty(
      "hoursOfOperation"
    )
      ? _find(
          singleCar.rentalLocations[0].hoursOfOperation,
          op => op.dayOfWeek === carDropOffDay
        )
      : null;

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
    // console.log(moment(singleCar.carPickUpDate, "YYYY-MM-DD").add(2, 'days').format("YYYY-MM-DD") + "<===>" + moment().format("YYYY-MM-DD"))
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
            <img src={_typeIcon["car"]} alt={"no"} />
            {index + 1}
          </td>
          <td data-label="Title"> {singleCar.vehicle.name}</td>

          <td data-label="Location"> {singleCar.pickUpLocation} </td>
          <td data-label="Date Booked">
            {this.props.carDetails.created_date &&
              this.props.carDetails.created_date.substr(0, 10)}
          </td>
          <td data-label="Travel Date">
            {moment(singleCar.carPickUpDate).format("MM/DD/YYYY")}{" "}
            <img src={img_Date} alt="date" />{" "}
            {moment(singleCar.carDropDate).format("MM/DD/YYYY")}
          </td>
          <td data-label="Price">
            {currencies[singleCar.currency].symbol}
            {parseFloat(singleCar.quotedTotalFare).toFixed(2)}
          </td>
          <td data-label="Booking Id">{carDetails.bookingId}</td>
          <td data-label="Co-relation Id">{carDetails.bookingDetails.supplierConfirmationNumber}</td>
          <td data-label="Cancellation Id">{carDetails.cancellationId}</td>
          <td data-label="Booking Status">{carDetails.bookingStatus}</td>

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
                    <img src={singleCar.vehicle.images[0]} className="carImg" />
                    <img src={singleCar.vendor.logo} className="carLogoImg" />
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
                    <h4>{singleCar.vehicle.name}</h4>
                    <h4>{singleCar.vendor.name} </h4>

                    <ul className="carInfraStru">
                      <li>
                        <img src={img_carUser} />
                        {singleCar.vehicle.passengerCapacity}
                      </li>
                      <li>
                        <img src={img_door} /> -
                      </li>
                      <li>
                          <img src={img_luggage} />{" "}
                          {singleCar.vehicle.baggageCapacity}
                        </li>
                    </ul>

                    <ul className="pickupDropDet">
                      <li className="pickUpWidth">
                        <h6 style={{ textAlign: "center" }}>Pick-Up</h6>
                        <p>{singleCar.selectedPickup}</p>
                      </li>
                      <li className="pickUpWidth">
                        <h6 style={{ textAlign: "center" }}>Drop-Off</h6>
                        <p>{singleCar.selectedDropoff}</p>
                      </li>
                    </ul>

                    <span>
                      Booking for{" "}
                      {moment(singleCar.carDropDate).diff(
                        moment(singleCar.carPickUpDate),
                        "days"
                      )}{" "}
                      Days
                    </span>
                    <ul className="checkInOut">
                      <li>
                        <img src={img_Time} />
                        <span>
                          Pick Up
                          <b>
                            {moment(singleCar.carPickUpTime, "hh:mm").format(
                              "LT"
                            )}
                          </b>
                        </span>
                      </li>
                      <li>
                        <img src={img_Time} />
                        <span>
                          Drop Off
                          <b>
                            {moment(singleCar.carDropTime, "hh:mm").format(
                              "LT"
                            )}
                          </b>
                        </span>
                      </li>
                    </ul>
                    <ul>
                      <li className="border">
                        <h5>
                          {moment(singleCar.carPickUpDate)
                            .format("MMM DD")
                            .toUpperCase()}
                        </h5>
                        <p>{moment(singleCar.carPickUpDate).format("dddd")}</p>
                      </li>
                      <li>
                        <img src={img_DateArrow} />
                      </li>
                      <li className="border">
                        <h5>
                          {moment(singleCar.carDropDate)
                            .format("MMM DD")
                            .toUpperCase()}
                        </h5>
                        <p>{moment(singleCar.carDropDate).format("dddd")}</p>
                      </li>
                    </ul>
                    <ul className="checkInOut" style={{ fontSize: "12px" }}>
                      <li className="houseOperationWidth" style={{ marginRight: "10px" }}>
                        <div>
                          <strong>Hours of Operation</strong>
                        </div>
                        <div>
                          <p>
                            {pickUpHoursOp
                              ? moment(
                                  pickUpHoursOp.workingHours[0].openTime,
                                  "HH:mm:ss"
                                ).format("hh:mm a")
                              : "Not operated"}
                          </p>{" "}
                          -{" "}
                          <p>
                            {pickUpHoursOp
                              ? moment(
                                  pickUpHoursOp.workingHours[0].closeTime,
                                  "HH:mm:ss"
                                ).format("hh:mm a")
                              : "Not operated"}
                          </p>
                        </div>
                      </li>
                      <li className="houseOperationWidth">
                        <div>
                          <strong>Hours of Operation</strong>
                        </div>
                        <div>
                          <p>
                            {dropOffHoursOp
                              ? moment(
                                  dropOffHoursOp.workingHours[0].openTime,
                                  "HH:mm:ss"
                                ).format("hh:mm a")
                              : "Not operated"}
                          </p>{" "}
                          -{" "}
                          <p>
                            {dropOffHoursOp
                              ? moment(
                                  dropOffHoursOp.workingHours[0].closeTime,
                                  "HH:mm:ss"
                                ).format("hh:mm a")
                              : "Not operated"}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div style={{borderTop:"1px solid",padding:"12px"}}>
                      <h6>Supplier Details :</h6>
                      <div style={{padding:"5px"}}>
                    <p><b>Name:</b>  {name}</p>
                    <p><b>Email:</b> {email} </p>
                    <p><b>Supplier Name:</b>  {carDetails.carDetails.vendor.name}</p>
                    <p><b>Supplier Confirmation No:</b> {carDetails.bookingDetails.supplierConfirmationNumber} </p>
                    <p>You can re-confirm your reservation on the supplier's website using the Supplier Confirmation and your First Name and Last Name</p>
                    </div>
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
                    <li>
                      <span>Base Fare</span>
                      <span>
                        {currencies[singleCar.currency].symbol}
                        {+singleCar.pricedTotalFare}
                      </span>
                    </li>
                    <li>
                      <span>Taxes & Fees</span>
                      <span>
                        {currencies[singleCar.currency].symbol}{" "}
                        {(
                          +singleCar.quotedTotalFare -
                          +singleCar.pricedTotalFare
                        ).toFixed(2)}
                      </span>
                    </li>
                    <li>
                      <span>Total Cost</span>
                      <span>
                        {currencies[singleCar.currency].symbol}{" "}
                        {+singleCar.quotedTotalFare}
                      </span>
                    </li>
                  </ul>

                  <div className="">
                    {/* <button type="submit" className="searchBtn">Reschedule</button> */}
                    {/* <button type="submit" className="searchBtn completebtn"   onClick={() => this.bookingCancel(true,TransList)}> Cancel</button> */}
                    {this.props.carDetails.bookingStatus != "Canceled" &&
                      moment(singleCar.carPickUpDate, "YYYY-MM-DD")
                        .subtract(2, "days")
                        .format("YYYY-MM-DD") >
                        moment().format("YYYY-MM-DD") && (
                        <button
                          type="submit"
                          className="searchBtn completebtn"
                          onClick={() => this.bookingCancel()}
                        >
                          {" "}
                          Cancel
                        </button>
                      )}
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
                      <p>{singleCar.cancellationPolicy.text}</p>
                    ) : (
                      ""
                    )}
                  </div>
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
  )(CarTripCard)
);
