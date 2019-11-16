import React from "react";
import img_tick from "../../../../asset/images/bookingConfirm/checked.png";
import img_share from "../../../../asset/images/dashboard/socialClick.png";
import img_print from "../../../../asset/images/dashboard/print.png";
import img_location from "../../../../asset/images/Where Icon (Map Marker).svg";
import img_rating from "../../../../asset/images/yellowStar4.png";
import img_clock from "../../../../asset/images/Time.svg";
import img_arrow from "../../../../asset/images/bookingConfirm/Shapearrow.png";
import img_hotel from "../../../../asset/images/dashboard/hotelPic.jpg";
import img_DateArrow from "../../../../asset/images/Date Arrow.png";
import img_extrabed from "../../../../asset/images/selectRoom/extrabed.png";
import img_info from "../../../../asset/images/information.png";
import img_user from "../../../../asset/images/dashboard/carUser.png";
import img_xenni from "../../../../asset/images/bookingConfirm/Xennies-Text-3D.png";
import img_help from "../../../../asset/images/CVV Help.png";
import img_download from '../../../../asset/images/download-icon.jpg';
import { filter as _filter, get as _get} from "lodash";
import ImageCarousel from "../../../../component/presentational/ImageCarousel";
import UserRating from "../../../../component/presentational/UserRating";
import queryString from "query-string";
import moment from "moment";
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import Footer from "../../../Footer";
import TopNav from "../../TopNav";

import MultipleContext from "../../../presentational/MultipleBooking/context";

import StateLessCarConfirmation from "./StateLessCarConfirmation";
import StateLessTransferConfirmation from "./StateLessTransferConfirmation";
import StateLessActivityConfirmation from "./StateLessActivityConfirmation"
import Html2Canvas from "html2canvas";
import JSPdf from "jspdf";
var currencies = require("country-data").currencies;

class StatelessHotelConfirmation extends React.Component {
  constructor() {
    super();
    this.state = { booking_result: {}, bookingArray: [], paymentDetails: "" };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    // fetch('https://api.myjson.com/bins/1ewqae')
    // .then((response) => {
    //   return response.json();
    // })
    // .then((myJson)=> {
    //  this.setState({
    //   paymentDetails:myJson
    //  })
    // });
  }

  rmvHtmlFunc = str => {
    if (str !== undefined) {
      if (str === null || str === "No Description")
        return "No Description Available";
      else str = str.toString();
      return str.replace(/<[^>]*>/g, "");
    }
  };

  print = event => {
    event.preventDefault();
    window.print();
  };

  download = (target, event) => {
    event.preventDefault();
    const input = document.getElementById(target.elementId);
    Html2Canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new JSPdf(target.options);
          const width = pdf.internal.pageSize.getWidth();
          const height = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
          pdf.save("booking.pdf");
        });
  };

  render() {

    console.log("this.props:::::::::", this.props)
    
    // const { selectedCurrency } = this.props;
    let paymentDetails;
    let fullHotelDetails;
    // const selectedCurrencyVal = currencies[paymentDetails.booking_result[0].bookingRequest.fareBreakup.currency].symbol;

    if (
      this.props.dataDump[0] &&
      !this.props.dataDump[0].hasOwnProperty("error")
    ) {
      paymentDetails = this.props.dataDump[0].data;
      fullHotelDetails = _.groupBy(paymentDetails.data.booking_result, e => {
        return e.bookingRequest.hotelId;
      });
    }
    // let selectedCurrencyVal = currencies[paymentDetails.booking_result[0].bookingRequest.fareBreakup.currency].symbol;
    //const selectedCurrencyVal = "$";
    
    return (
      <React.Fragment>
        <TopNav onClick={this.props.onSignIn} />
        {
          <section className="searchSection">
            <div className="container">
              <div className="bookingConfirmation">
                <div className={this.props.dataDump[0] ? "bookingStatus" : ""}>
                  <div
                    className={
                      this.props.dataDump[0]
                        ? "d-flex flex-row smallTabColumn justify-content-between"
                        : ""
                    }
                  >
                    {this.props.dataDump[0] &&
                      !this.props.dataDump[0].hasOwnProperty("error") &&
                        <React.Fragment>
                          <div className="flex-column">
                            <div className="bookingStatusContent">
                              <img src={img_tick} alt="tick" />
                              <h3>Hotel Booking completed successfully</h3>
                            </div>
                          </div>
                          <div className="flex-column">
                            <ul className="bookingShare">
                              <li onClick={this.print}>
                                <img src={img_print} alt="print" /> Print
                              </li>
                              <li onClick={this.download.bind(this, {elementId: 'hotel_print', options: {}})}>
                                <img src={img_download} alt="download" /> Download
                              </li>
                              {/* <li>
                            <img src={img_share} alt="Share" /> Share
                          </li> */}
                        </ul>
                      </div>
                      </React.Fragment>}
                      {this.props.dataDump[0] && this.props.dataDump[0].hasOwnProperty("error") && <React.Fragment>
                      <div className="flex-column">
                        <div className="bookingStatusContent cancelledBook">
                          {/* <img src={img_tick} alt="tick" /> */}
                          <h3>{this.props.dataDump[0] && this.props.dataDump[0].error &&this.props.dataDump[0].error.data && this.props.dataDump[0].error.data.message } </h3>
                        </div>
                      </div>
                      <div className="flex-column">
                        <ul className="bookingShare">
                          {/* <li onClick={this.print}>
                            <img src={img_print} alt="print" /> Print
                          </li> */}
                              {/* <li>
                            <img src={img_share} alt="Share" /> Share
                          </li> */}
                            </ul>
                          </div>
                        </React.Fragment>
                      }
                  </div>
                  {this.props.dataDump[0] &&
                    !this.props.dataDump[0].hasOwnProperty("error") &&
                    Object.keys(fullHotelDetails).map((key, index) => {
                      let groupValuesHotel = fullHotelDetails[key];

                      return (
                        <div className="flex-row">
                          <div className="bookingHotelName">
                            <h5>
                              {
                                groupValuesHotel[0].bookingRequest.hotel_address
                                  .name
                              }
                            </h5>
                          </div>
                          <ul className="bookingHotelInfo">
                            <li className="borderRight">
                              {moment(
                                groupValuesHotel[0].bookingRequest.stayPeriod
                                  .start
                              ).format("dddd")}
                              ,{" "}
                              {moment(
                                groupValuesHotel[0].bookingRequest.stayPeriod
                                  .start
                              )
                                .format("MMM DD YYYY")
                                .toUpperCase()}
                              <span> </span> <img src={img_arrow} alt="arrow" />{" "}
                              <span> </span>
                              {moment(
                                groupValuesHotel[0].bookingRequest.stayPeriod
                                  .end
                              ).format("dddd")}
                              ,{" "}
                              {moment(
                                groupValuesHotel[0].bookingRequest.stayPeriod
                                  .end
                              )
                                .format("MMM DD YYYY")
                                .toUpperCase()}
                            </li>
                            <li className="borderRight">Total Cost : {currencies[
                        groupValuesHotel[0].bookingRequest.fareBreakup.currency
                      ].symbol} &nbsp;{parseFloat(groupValuesHotel[0].bookingRequest.totalAmount).toFixed(2)} </li>
                            {/* <li> Booking ID # {groupValuesHotel[0].data.bookingId}</li> */}
                            <li>
                              {" "}
                              Xeniapp Booking ID #{" "}
                              <strong>
                                {groupValuesHotel
                                  .map(value => {
                                    return value.data.bookingId;
                                  })
                                  .toString()}
                              </strong>
                            </li>
                          </ul>
                        </div>
                      );
                    })}
                </div>

                {this.props.dataDump[0] &&
                  !this.props.dataDump[0].hasOwnProperty("error") &&
                  Object.keys(fullHotelDetails).map((key, index) => {
                    let groupValuesHotel = fullHotelDetails[key];
                    const fees = _filter(groupValuesHotel[0].bookingRequest.policies, each => {
                      return each.type == "Fee"
                    })
                
                    console.log("fees::::::", fees)
                    let selectedCurrencyVal =
                      currencies[
                        groupValuesHotel[0].bookingRequest.fareBreakup.currency
                      ].symbol;
                    //let selectedCurrencyVal="$"
                    const InTime =
                      groupValuesHotel[0].bookingRequest
                        .checkinCheckoutPolicy[0] &&
                      groupValuesHotel[0].bookingRequest
                        .checkinCheckoutPolicy[0].inTime;
                    const OutTime =
                      groupValuesHotel[0].bookingRequest
                        .checkinCheckoutPolicy[0] &&
                      groupValuesHotel[0].bookingRequest
                        .checkinCheckoutPolicy[0].outTime;
                    const mapCode = groupValuesHotel[0].bookingRequest.geocode;
                    const locationRef =
                      `https://maps.google.com/?q=${mapCode.lat},${
                        mapCode.long
                      }` + "&output=embed";
                    const stDt = moment(
                      groupValuesHotel[0].bookingRequest.stayPeriod.start,
                      "MM/DD/YYYY"
                    );
                    const endDt = moment(
                      groupValuesHotel[0].bookingRequest.stayPeriod.end,
                      "MM/DD/YYYY"
                    );
                    const isRefundable =
                      groupValuesHotel[0].bookingRequest.refundability;
                    const stayDt = endDt.diff(stDt, "days");

                    const {
                      line1,
                      line2,
                      city,
                      countryCode,
                      postalCode
                    } = groupValuesHotel[0].bookingRequest.hotel_address.contact.address;

                    const detailedAddress =
                      line1 +
                      ", " +
                      line2 +
                      ", " +
                      city.name +
                      ", " +
                      countryCode +
                      ", " +
                      postalCode;
                    const _danSTR =
                      groupValuesHotel[0].bookingRequest.rooms_info[0].desc &&
                      groupValuesHotel[0].bookingRequest.rooms_info[0].desc.split(
                        "<strong>"
                      )[0] === "<p>"
                        ? groupValuesHotel[0].bookingRequest.rooms_info[0].desc
                        : "<p>" +
                          groupValuesHotel[0].bookingRequest.rooms_info[0]
                            .desc +
                          "</p>";

                    return (
                      <div id="hotel_print">
                        <div className="bookingStatus">
                          <h5>Hotel No: {index + 1}</h5>
                          <div className="d-flex flex-row smallTabColumn justify-content-between">
                            <div className="flex-column hotelImage">
                              <img
                                src={
                                  groupValuesHotel[0].bookingRequest.images[0]
                                    .URL
                                }
                                alt="No images available"
                              />
                            </div>
                            <div className="flex-column bookingConfirmRoom">
                              <div className="d-flex flex-row resWrap">
                                <div className="flex-column infoDiv">
                                  <div className="listTitle">
                                    <UserRating
                                      rating={
                                        groupValuesHotel[0].bookingRequest
                                          .rating
                                      }
                                    />
                                  </div>
                                  <h6>
                                    {
                                      groupValuesHotel[0].bookingRequest
                                        .hotel_address.name
                                    }
                                  </h6>
                                  <p>
                                    <img src={img_location} />
                                    <a target="_blank" rel="noreferrer">
                                      {detailedAddress}
                                    </a>
                                  </p>
                                  <span>Booking for {stayDt} Nights</span>
                                  <div>
                                    <span>
                                      Booked Rooms: {groupValuesHotel.length}
                                    </span>
                                  </div>
                                  <ul>
                                    <li className="border">
                                      <h5>
                                        {" "}
                                        {moment(
                                          groupValuesHotel[0].bookingRequest
                                            .stayPeriod.start
                                        )
                                          .format("MMM DD")
                                          .toUpperCase()}
                                      </h5>
                                      <p>
                                        {moment(
                                          groupValuesHotel[0].bookingRequest
                                            .stayPeriod.start
                                        ).format("dddd")}
                                      </p>
                                    </li>
                                    <li>
                                      <img src={img_DateArrow} />
                                    </li>
                                    <li className="border">
                                      <h5>
                                        {moment(
                                          groupValuesHotel[0].bookingRequest
                                            .stayPeriod.end
                                        )
                                          .format("MMM DD")
                                          .toUpperCase()}
                                      </h5>
                                      <p>
                                        {moment(
                                          groupValuesHotel[0].bookingRequest
                                            .stayPeriod.end
                                        ).format("dddd")}
                                      </p>
                                    </li>
                                  </ul>
                                  <ul className="checkInOut">
                                    <li>
                                      <img src={img_clock} />
                                      <span>
                                        Check In{" "}
                                        <b>
                                          {InTime && InTime
                                            ? InTime && InTime + 0
                                            : "12.00 AM"}
                                        </b>
                                      </span>
                                    </li>
                                    <li>
                                      <img src={img_clock} />
                                      <span>
                                        Check Out{" "}
                                        <b>
                                          {OutTime && OutTime
                                            ? OutTime && OutTime + 0
                                            : "09.00 PM"}
                                        </b>
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                                <div className="flex-column infoDiv">
                                  <iframe
                                    src={locationRef}
                                    style={{
                                      width: "200px",
                                      height: "92px",
                                      border: "1px solid rgb(106, 106, 106)",
                                      marginLeft: "15px"
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="d-flex flex-row">
                                {isRefundable == "Refundable" && (
                                  <div className="flex-column">
                                    {/* <button type="button" className="searchBtn mr-2">
                                    CHANGE BOOKING{" "}
                                  </button> */}
                                    <button
                                      type="button"
                                      className="searchBtn secondryBg"
                                    >
                                      <NavLink
                                        style={{
                                          textDecoration: "none",
                                          color: "#fff"
                                        }}
                                        to="/dashboard/my-trips"
                                      >
                                        CANCEL BOOKING
                                      </NavLink>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bookingCollapse">
                          <div className="bookingCollapseTitle">
                            <h5>Check-In / Check-Out</h5>
                          </div>
                          <div className="bookingCollapseContent">
                            <div className="d-flex flex-row smallTabColumn justify-content-start">
                              <div className="flex-column checkDiv">
                                <h6>Check-In Time</h6>
                                <p>
                                  {InTime && InTime.length
                                    ? InTime && InTime + 0
                                    : "12.00 AM"}
                                </p>
                              </div>
                              <div className="flex-column checkDiv">
                                <h6>Check-Out Time</h6>
                                <p>
                                  {OutTime && OutTime.length
                                    ? OutTime && OutTime + 0
                                    : "09.00 PM"}
                                </p>
                              </div>
                            </div>
                            <div className="flex-row">
                              <div className="flex-column">
                                <h6>Check-In Policy</h6>
                                <p>
                                  {this.rmvHtmlFunc(
                                    (groupValuesHotel[0].bookingRequest
                                      .policies[0] &&
                                      groupValuesHotel[0].bookingRequest
                                        .policies[0].text) ||
                                      "No Description"
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex-row">
                              <div className="flex-column">
                                <h6>Special instructions</h6>
                                <p>
                                  {this.rmvHtmlFunc(
                                    (groupValuesHotel[0].bookingRequest
                                      .policies[3] &&
                                      groupValuesHotel[0].bookingRequest
                                        .policies[3].text) ||
                                      "No Description"
                                  )}
                                </p>
                              </div>
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
                                  {
                                    groupValuesHotel[0].bookingRequest
                                      .cancellationPolicy.text
                                  }
                                </p>
                                <h6>Pricing and Payment</h6>
                                <p>
                                  {groupValuesHotel[0].bookingRequest
                                    .policies[2] &&
                                    groupValuesHotel[0].bookingRequest
                                      .policies[2].text}
                                </p>
                                {fees.length > 0 && <div><h6>Fees</h6>
                                <ul style={{paddingLeft: "20px"}}>
                                  <li style={{color: "#464646", fontSize: "13px", marginBottom: "3px"}}>{_get(fees[0], "text")}</li>
                                </ul></div>}
                                <h6>Guest Charges and Room Capacity</h6>
                                <p>
                                  {" "}
                                  {this.rmvHtmlFunc(
                                    groupValuesHotel[0].bookingRequest
                                      .policies[3] &&
                                      groupValuesHotel[0].bookingRequest
                                        .policies[3].text
                                  )}{" "}
                                </p>
                                <p>
                                  {this.rmvHtmlFunc(
                                    groupValuesHotel[0].bookingRequest
                                      .rooms_info[0] &&
                                      groupValuesHotel[0].bookingRequest
                                        .rooms_info[0].desc
                                  )}
                                </p>
                                {/* <h6>Room Confirmations</h6>
                          <p>

                            Some hotels request that we wait to submit guest names
                            until 7 days prior to check in. In such a case, your
                            hotel room is reserved, but your name is not yet on file
                            with the hotel.
                          </p> */}
                              </div>
                            </div>
                          </div>
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
                              <span>$  150/night</span>
                            </li>
                            <li>
                              <span> 7 Nights</span>
                              <span>$   175.25</span>
                            </li>  */}
                                  <li>
                                    <span> Base Fare</span>
                                    <span>
                                      {selectedCurrencyVal}&nbsp;
                                      {groupValuesHotel.reduce(
                                        (sum, amountValue) => {
                                          return (
                                            sum +
                                            +amountValue.bookingRequest.amtAfterdiscount.toFixed(
                                              2
                                            )
                                          );
                                        },
                                        0
                                      )}
                                    </span>
                                  </li>
                                  <li>
                                    <span>Taxes & Fees</span>
                                    <span>
                                      {selectedCurrencyVal}{" "}
                                      {groupValuesHotel.reduce(
                                        (sum, groupValuesHotel) => {
                                          return (
                                            sum +
                                            +(groupValuesHotel.bookingRequest
                                              .fareBreakup.taxes[0] &&
                                            groupValuesHotel.bookingRequest
                                              .fareBreakup.taxes[0].amount +
                                              groupValuesHotel.bookingRequest
                                                .farebreakupAmount
                                              ? parseFloat(
                                                  groupValuesHotel
                                                    .bookingRequest.fareBreakup
                                                    .taxes[0] &&
                                                    groupValuesHotel
                                                      .bookingRequest
                                                      .fareBreakup.taxes[0] &&
                                                    groupValuesHotel
                                                      .bookingRequest
                                                      .fareBreakup.taxes[0]
                                                      .amount +
                                                      groupValuesHotel
                                                        .bookingRequest
                                                        .farebreakupAmount
                                                ).toFixed(2)
                                              : 0.0)
                                          );
                                        },
                                        0
                                      )}
                                    </span>
                                  </li>

                                  <li>
                                    <span>Total Cost</span>
                                    {selectedCurrencyVal}{" "}
                                    {groupValuesHotel.reduce(
                                      (sum, groupValuesHotel) => {
                                        return (
                                          sum +
                                          +groupValuesHotel.bookingRequest.totalAmount.toFixed(
                                            2
                                          )
                                        );
                                      },
                                      0
                                    )}
                                    {/* <span>{selectedCurrencyVal}&nbsp;{parseFloat(groupValuesHotel[0].bookingRequest.totalAmount).toFixed(2)}</span> */}
                                  </li>
                                </ul>
                                {/* <p>

                            Taxes and fees included, except VAT. Local citizens must
                            pay VAT at the hotel. Foreigners may be exempt. Unless
                            specified otherwise, rates are quoted in US dollars.{" "}
                          </p> */}
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
                      </div>
                    );
                  })}

                {this.props.hasOwnProperty("dataDump") &&
                  this.props.dataDump[1] != null &&
                  !this.props.dataDump[1].hasOwnProperty("error") && (
                    <div className="bookingStatus">
                      <div className="d-flex flex-row smallTabColumn justify-content-between">
                        <div className="flex-column">
                          <div className="bookingStatusContent ">
                            <img src={img_tick} alt="tick" />
                            <h3>Car Booking completed successfully</h3>
                          </div>
                        </div>
                        <div className="flex-column">
                          <ul className="bookingShare">
                            <li onClick={this.print}>
                              <img src={img_print} alt="print" /> Print
                            </li>
                            <li onClick={this.download.bind(this, { elementId: 'car_print', options: {
                              orientation: 'landscape',
                            }})}>
                              <img src={img_download} alt="download" /> Download
                            </li>
                            {/* <li>
                            <img src={img_share} alt="Share" /> Share
                          </li> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                {this.props.hasOwnProperty("dataDump") &&
                  this.props.dataDump[1] != null &&
                  !this.props.dataDump[1].hasOwnProperty("error") && (
                    <StateLessCarConfirmation
                        allCarResponse={this.props.dataDump[1].data}
                    />
                  )}

                {this.props.hasOwnProperty("dataDump") &&
                  this.props.dataDump[1] != null &&
                  this.props.dataDump[1].hasOwnProperty("error") && (
                    <div className="bookingStatus">
                      <div className="d-flex flex-row smallTabColumn justify-content-between">
                        <div className="flex-column">
                          <div className="bookingStatusContent cancelledBook">
                            {/* <img src={img_tick} alt="tick" /> */}
                            <h3>
                              Car Booking Failed , Amount Will be refunded
                            </h3>
                          </div>
                        </div>
                        <div className="flex-column">
                          <ul className="bookingShare">
                            {/* <li onClick={this.print}>
                            <img src={img_print} alt="print" /> Print
                          </li> */}
                            {/* <li>
                            <img src={img_share} alt="Share" /> Share
                          </li> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                {this.props.hasOwnProperty("dataDump") &&
                this.props.dataDump[2] != null &&
                !this.props.dataDump[2].hasOwnProperty("error") && (
                    <div className="bookingStatus">
                      <div className="d-flex flex-row smallTabColumn justify-content-between">
                        <div className="flex-column">
                          <div className="bookingStatusContent ">
                            <img src={img_tick} alt="tick" />
                            <h3>Chauffeured Booking completed successfully</h3>
                          </div>
                        </div>
                        <div className="flex-column">
                          <ul className="bookingShare">
                            <li onClick={this.print}>
                              <img src={img_print} alt="print" /> Print
                            </li>
                            <li onClick={this.download.bind(this, {elementId: 'transfer_print', options: {
                              orientation: 'landscape',
                            }})}>
                              <img src={img_download} alt="download" /> Download
                            </li>
                            {/* <li>
                            <img src={img_share} alt="Share" /> Share
                          </li> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                )}

                {this.props.hasOwnProperty("dataDump") &&
                this.props.dataDump[2] != null &&
                !this.props.dataDump[2].hasOwnProperty("error") && (
                    <StateLessTransferConfirmation
                        allTransferResponse={this.props.dataDump[2].data.data.result}
                    />
                )}

                {this.props.hasOwnProperty("dataDump") &&
                this.props.dataDump[3] != null &&
                !this.props.dataDump[3].hasOwnProperty("error") && (
                    <StateLessActivityConfirmation
                        allActivityResponse={this.props.dataDump[3].data.bookingConfirmObj}
                    />
                )}

                {this.props.hasOwnProperty("dataDump") &&
                this.props.dataDump[2] != null &&
                this.props.dataDump[2].hasOwnProperty("error") && (
                    <div className="bookingStatus">
                      <div className="d-flex flex-row smallTabColumn justify-content-between">
                        <div className="flex-column">
                          <div className="bookingStatusContent cancelledBook">
                            {/* <img src={img_tick} alt="tick" /> */}
                            <h3>
                              Chauffeured Booking Failed , Amount Will be refunded
                            </h3>
                          </div>
                        </div>
                        <div className="flex-column">
                          <ul className="bookingShare">
                            {/* <li onClick={this.print}>
                            <img src={img_print} alt="print" /> Print
                          </li> */}
                            {/* <li>
                            <img src={img_share} alt="Share" /> Share
                          </li> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                )}

              {this.props.hasOwnProperty("dataDump") &&
                this.props.dataDump[3] != null &&
                this.props.dataDump[3].hasOwnProperty("error") && (
                    <div className="bookingStatus">
                      <div className="d-flex flex-row smallTabColumn justify-content-between">
                        <div className="flex-column">
                          <div className="bookingStatusContent cancelledBook">
                            {/* <img src={img_tick} alt="tick" /> */}
                            <h3>
                              Activity Booking Failed , Amount Will be refunded
                            </h3>
                          </div>
                        </div>
                        <div className="flex-column">
                          <ul className="bookingShare">
                            {/* <li onClick={this.print}>
                            <img src={img_print} alt="print" /> Print
                          </li> */}
                            {/* <li>
                            <img src={img_share} alt="Share" /> Share
                          </li> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                )}

                <div className="bookingCollapse">
                  <div className="bookingCollapseTitle">
                    <h5>
                      <img src={img_help} alt="help" /> Need more Help ?
                    </h5>
                  </div>
                  <div className="bookingCollapseContent">
                    <div className="d-flex flex-row justify-content-start">
                      <div className="flex-column">
                        <ul className="needHelp">
                          <li>
                            Visit our{" "}
                            <a
                              href="http://help.xeniapp.com/support/home"
                              target="_blank"
                            >
                              Help Desk
                            </a>{" "}
                            Page.
                          </li>
                          <li>
                            Xeniapp Customer Care at <b>1800 936 2927</b>.
                          </li>
                          {/* <li>
                              For more efficient support remember your{" "}
                              <b>Booking ID Hotel # {Object.keys(fullHotelDetails).map((key, index) => {
                                  let groupValuesHotel = fullHotelDetails[key]
                                  let allHotelbookingId=[]
                                  groupValuesHotel.map((value)=>{
                                    allHotelbookingId.push(value.data.bookingId)
                                  })
                              })}</b>
                            </li> */}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        }

        <Footer />
      </React.Fragment>
    );
  }
  // if(this.props.hasOwnProperty("dataDump") && this.props.dataDump[1] != null  && index==1){
  //   return(
  //     <StateLessCarConfirmation allCarResponse={this.props.dataDump[1].data}/>
  //   )
  // }
}
const mapStateToProps = state => ({
  paymentDetails: state.paymentReducer.paymentDetails,
  selectedCurrency: state.hotelReducer.selectedCurrency,
  dataDump: state.addcartReducer.dataDump
});
const mapDispatchToProps = dispatch => ({});

StatelessHotelConfirmation.defaultProps = {
  dataDump: [1, 2]
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StatelessHotelConfirmation)
);
