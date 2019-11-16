import React, { Component } from "react";
import img_tick from "../../../../asset/images/bookingConfirm/checked.png";
import img_print from "../../../../asset/images/dashboard/print.png";
import img_download from "../../../../asset/images/download-icon.jpg";
import { map as _map } from "lodash";
import queryString from "query-string";
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import Html2Canvas from "html2canvas";
import JSPdf from "jspdf";

import axios from "axios";

import request from "../../../../Utils/request-process";

import URL from "../../../../asset/configUrl";

import { get as _get } from "lodash";

import { getSingleBookingTripInformation } from "../../../../service/activities/action";

import {
  loadingGifSearch,
  stopGifSearching
} from "../../../../service/common/action";

const currencies = require("country-data").currencies;

class StateLessActivityConfirmation extends React.Component {
  state = { booking_result: null, bookingArray: [] };

  componentDidMount() {
    window.scrollTo(0, 0);
    const { allActivityResponse } = this.props;

    if (allActivityResponse.length > 0) {
      this.bookingData();
    }
  }

  bookingData = async () => {
    const { allActivityResponse } = this.props;

    let data_arr = [];
    this.props.loadingGifSearch();
    for (let i = 0; i < allActivityResponse.length; i++) {
      let distributorRef = allActivityResponse[i].distributorRef;
      let distributorItemRef =
        allActivityResponse[i].distributorItemRef;
      let requestParam = `distributorRef=${distributorRef}&distributorItemRef=${distributorItemRef}`;
      await request
        .get(URL.ACTIVITY_GET_STATUS_BOOKING + requestParam)
        .then(response => {
          this.props.stopGifSearching();
          data_arr.push(response.data);
        });
    }
    setTimeout(() => {
      this.setState({
        booking_result: data_arr
      });
    }, 300);
    
  };

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

  download = event => {
    event.preventDefault();
    Html2Canvas(document.getElementById("print")).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new JSPdf();
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
      pdf.save("booking.pdf");
    });
  };

  render() {
    const { booking_result } = this.state;
    console.log("allActivityResponse ?", this.props.allActivityResponse);

    console.log("booking_result", booking_result);
    return (
      booking_result &&
      booking_result.map((bookingResponse, index) => {
        return (
          bookingResponse && bookingResponse.data && bookingResponse.data.response && bookingResponse.data.response.data && (
            <React.Fragment>
              <div id="print" className="bookingConfirmation">
                <div className="bookingStatus">
                  <div className="d-flex flex-row smallTabColumn justify-content-between">
                    <div className="flex-column">
                      <div className="bookingStatusContent">
                        <img src={img_tick} alt="tick" />
                        <h3>Activity Booking completed successfully</h3>
                      </div>
                    </div>
                    <div className="flex-column">
                      <ul className="bookingShare">
                        <li onClick={this.print}>
                          <img src={img_print} alt="print" /> Print
                        </li>
                        <li onClick={() => {
                          window.open('https://viatorapi.live.rc.viator.com/ticket/download-pdf?merchant=true&code='
                              + bookingResponse.data.response.data.voucherKey, '_blank')
                        }}>
                          <img src={img_download} alt="download" /> Download
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex-row">
                    <div className="bookingHotelName">
                      <h5>
                        {
                          bookingResponse.data.response.data.itemSummaries[0]
                            .productTitle
                        }
                      </h5>
                    </div>
                    <div className="clearfix" />
                    <ul className="bookingHotelInfo mt-5 mb-4">
                      <li className="borderRight">
                        <b> Travel Date :</b>
                        {
                          bookingResponse.data.response.data.itemSummaries[0]
                            .travelDate
                        }
                      </li>
                      <li className="borderRight">
                        <b> Total Cost :</b>{" "}
                        {currencies[bookingResponse.data.currencyCode].symbol}
                        {bookingResponse.data.fare}
                      </li>
                      <li>
                        Xeniapp Booking Id :{" "}
                        <b>#{bookingResponse.data.distributorRef.substr(0, 6).toUpperCase()}</b>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bookingStatus">
                  <div className="d-flex flex-row smallTabColumn justify-content-between">
                    <div className="flex-column hotelImage">
                      <img src={bookingResponse.data.images[0].photoURL} />
                    </div>
                    <div className="flex-column bookingConfirmRoom">
                      <div className="d-flex flex-row">
                        <div className="flex-row">
                          <div className="bookingHotelName">
                            <h5>Booking Information </h5>
                          </div>
                          <ul>
                            <li>
                              Booking Date: &nbsp;
                              <b>
                                {bookingResponse.data.response.data.bookingDate}
                              </b>
                            </li>
                            <li>
                              Travel Date:
                              <b>
                                {
                                  bookingResponse.data.response.data
                                    .itemSummaries[0].travelDate
                                }
                              </b>
                            </li>
                            {bookingResponse.data.response.data.itemSummaries[0]
                              .startingTime !== null && (
                              <li>
                                Starting Time:
                                <b>
                                  {
                                    bookingResponse.data.response.data
                                      .itemSummaries[0].startingTime
                                  }
                                </b>
                              </li>
                            )}
                          </ul>
                          <ul className="">
                            <li className="borderRight">
                              Departs From: &nbsp;
                              <b>
                                {
                                  bookingResponse.data.response.data
                                    .itemSummaries[0].departsFrom
                                }
                              </b>
                            </li>
                            <div className="bookingHotelName" style={{ marginTop: "10px"}}>
                          <h5>Lead Passenger</h5>
                          </div>
                          <ul>
                            <li>
                              First Name:&nbsp;
                              <b>
                                {
                                  bookingResponse.data.response.data
                                    .itemSummaries[0].leadTravellerFirstname
                                }
                              </b>
                            </li>
                            <li>
                              Last Name:&nbsp;
                              <b>
                                {
                                  bookingResponse.data.response.data
                                    .itemSummaries[0].leadTravellerSurname
                                }
                              </b>
                            </li>
                          </ul>
                          {/* <ul>
                            {bookingResponse.data.selectedActivity && bookingResponse.data.selectedActivity.selectedActivity && bookingResponse.data.selectedActivity.selectedActivity.ageBands[0].count !== null ? (
                              <li>
                                No of Adults:&nbsp;
                                <b>
                                {bookingResponse.data.selectedActivity.selectedActivity.ageBands[0].count}
                                </b>
                              </li>
                            ) : null}

                            </ul>
                            <ul>
                            {bookingResponse.data.selectedActivity && bookingResponse.data.selectedActivity.selectedActivity && bookingResponse.data.selectedActivity.selectedActivity.ageBands[1].count !== null ? (
                              <li>
                              No of Kids:&nbsp;
                                <b>
                                {bookingResponse.data.selectedActivity.selectedActivity.ageBands[1].count}
                                </b>
                              </li>
                            ) : null}

                            </ul>
                            <ul>
                            {bookingResponse.data.selectedActivity && bookingResponse.data.selectedActivity.selectedActivity && bookingResponse.data.selectedActivity.selectedActivity.ageBands[2].count !== null ? (
                              <li>
                              No of Infants:&nbsp;
                                <b>
                                {bookingResponse.data.selectedActivity.selectedActivity.ageBands[2].count}
                                </b>
                              </li>
                            ) : null}

                            </ul>
                            <ul>
                            {bookingResponse.data.selectedActivity && bookingResponse.data.selectedActivity.selectedActivity && bookingResponse.data.selectedActivity.selectedActivity.ageBands[3].count !== null ? (
                              <li>
                              No of Senior:&nbsp;
                                <b>
                                {bookingResponse.data.selectedActivity.selectedActivity.ageBands[3].count}
                                </b>
                              </li>
                            ) : null}

                            </ul> */}
                            <ul>
                            <li>
                              Email Id:&nbsp;
                              <b>
                                {
                                  bookingResponse.data.response.data
                                    .bookerEmail
                                }
                              </b>
                            </li>
                            </ul>

                            <ul>
                              <li>
                              Phone Number:&nbsp;
                              <b>
                                {bookingResponse.data.request.booker.cellPhone}
                              </b>
                            </li>
                            </ul>
                            <ul>{bookingResponse.data.response &&
                            bookingResponse.data.response.data != null && bookingResponse.data.response.data === undefined ? (
                              <li>
                                Hotel Pick up Info: &nbsp;
                                <b>
                                  {
                                    bookingResponse.data.response.data
                                      .itemSummaries[0].pickupHotelName
                                  }
                                </b>
                              </li>
                            ) : null}</ul>

                            <ul>
                            <li>
                              Special Request: &nbsp;
                              <b>
                                {
                                  bookingResponse.data.request.items[0]
                                    .specialRequirements
                                }
                              </b>
                            </li>

                          </ul>

                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bookingStatus">
                  <h5> Cancellation Policy</h5>
                  <span>
                    {
                      bookingResponse.data.response.data.itemSummaries[0]
                        .merchantTermsAndConditions.termsAndConditions
                    }{" "}
                  </span>
                  <br />
                  <br />
                  <p className="text-center">
                    We have sent a confirmation to:{" "}
                    <b>{this.props.loginDetails.email}</b>
                  </p>
                </div>
              </div>
            </React.Fragment>
          )
        );
      })
    );
  }
}

const mapStateToProps = state => ({
  activityBookingStatus: state.activityReducer.activityBookingStatus,
  loginDetails: state.loginReducer.loginDetails
});
const mapDispatchToProps = dispatch => ({
  getSingleBookingTripInformation: payload =>
    dispatch(getSingleBookingTripInformation(payload)),
  loadingGifSearch: () => dispatch(loadingGifSearch()),
  stopGifSearching: () => dispatch(stopGifSearching())
});
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StateLessActivityConfirmation)
);
