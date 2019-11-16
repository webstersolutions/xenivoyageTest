import React, { Component } from "react";
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
import ImageCarousel from "../../../component/presentational/ImageCarousel";
import UserRating from "../../../component/presentational/UserRating";
import queryString from "query-string";
import moment from "moment";
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import Footer from "../../Footer";
import TopNav from "../TopNav";
import Html2Canvas from "html2canvas";
import JSPdf from "jspdf";

import { getSingleBookingTripInformation } from "../../../service/activities/action";
import _get from "lodash/get";

const currencies = require("country-data").currencies;

class ActivityBookingConfirmation extends Component {
  state = { booking_result: {}, bookingArray: [] };

  componentDidMount() {
    window.scrollTo(0, 0);
    if (!this.props.activityBookingStatus) {
      const { distributorRef, distributorItemRef } = queryString.parse(
        this.props.location.search
      );
      this.props.getSingleBookingTripInformation({
        distributorRef,
        distributorItemRef
      });
    }
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
    const { activityBookingStatus } = this.props;

    let downloadUrl = null;

    if (activityBookingStatus !== null && activityBookingStatus !== undefined) {
      downloadUrl = 'https://viatorapi.live.rc.viator.com/ticket/download-pdf?merchant=true&code='
          + activityBookingStatus.response.data.voucherKey;
    }

    return (
      <React.Fragment>
        <TopNav onClick={this.props.onSignIn} />
        {activityBookingStatus !== null && activityBookingStatus !== undefined && (
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
                        <li onClick={() => {
                            downloadUrl && window.open(downloadUrl, '_blank');
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
                          activityBookingStatus.response.data.itemSummaries[0]
                            .productTitle
                        }
                      </h5>
                    </div>
                    <div className="clearfix" />
                    <ul className="bookingHotelInfo mt-5 mb-4">
                      <li className="borderRight">
                        <b> Travel Date :</b>
                        {
                          activityBookingStatus.response.data.itemSummaries[0]
                            .travelDate
                        }
                      </li>
                      <li className="borderRight">
                        <b> Total Cost :</b>{" "}
                        {currencies[activityBookingStatus.currencyCode].symbol}
                        {activityBookingStatus.fare}
                      </li>
                      <li>
                        Xeniapp Booking Id :{" "}
                        <b>#{activityBookingStatus.distributorRef.substr(0, 6).toUpperCase()}</b>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bookingStatus">
                  <div className="d-flex flex-row smallTabColumn justify-content-between">
                    <div className="flex-column hotelImage">
                      <img src={activityBookingStatus.images[0].photoURL} />
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
                                {
                                  activityBookingStatus.response.data
                                    .bookingDate
                                }
                              </b>
                            </li>
                            <li>
                              Travel Date: &nbsp;
                              <b>
                                {
                                  activityBookingStatus.response.data
                                    .itemSummaries[0].travelDate
                                }
                              </b>
                            </li>
                            {activityBookingStatus.response.data
                              .itemSummaries[0].startingTime !== null && (
                              <li>
                                Starting Time: &nbsp;
                                <b>
                                  {
                                    activityBookingStatus.response.data
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
                                  activityBookingStatus.response.data
                                    .itemSummaries[0].departsFrom
                                }
                              </b>
                            </li>
                          </ul>
                          <div className="bookingHotelName" style={{ marginTop: "10px"}}>
                          <h5>Lead Passenger</h5>
                          </div>
                          <ul>
                            <li>
                              First Name:&nbsp;
                              <b>
                                {
                                  activityBookingStatus.response.data
                                    .itemSummaries[0].leadTravellerFirstname
                                }
                              </b>
                            </li>
                            <li>
                              Last Name:&nbsp;
                              <b>
                                {
                                  activityBookingStatus.response.data
                                    .itemSummaries[0].leadTravellerSurname
                                }
                              </b>
                            </li>
                          </ul>
                          {/* <ul>
                            {activityBookingStatus.selectedActivity && activityBookingStatus.selectedActivity.selectedActivity && activityBookingStatus.selectedActivity.selectedActivity.ageBands[0].count !== null ? (
                              <li>
                                No of Adults:&nbsp;
                                <b>
                                {activityBookingStatus.selectedActivity.selectedActivity.ageBands[0].count}
                                </b>
                              </li>
                            ) : null}

                            </ul>
                            <ul>
                            {activityBookingStatus.selectedActivity && activityBookingStatus.selectedActivity.selectedActivity && activityBookingStatus.selectedActivity.selectedActivity.ageBands[1].count !== null ? (
                              <li>
                              No of Kids:&nbsp;
                                <b>
                                {activityBookingStatus.selectedActivity.selectedActivity.ageBands[1].count}
                                </b>
                              </li>
                            ) : null}

                            </ul>
                            <ul>
                            {activityBookingStatus.selectedActivity && activityBookingStatus.selectedActivity.selectedActivity && activityBookingStatus.selectedActivity.selectedActivity.ageBands[2].count !== null ? (
                              <li>
                              No of Infants:&nbsp;
                                <b>
                                {activityBookingStatus.selectedActivity.selectedActivity.ageBands[2].count}
                                </b>
                              </li>
                            ) : null}

                            </ul>
                            <ul>
                            {activityBookingStatus.selectedActivity && activityBookingStatus.selectedActivity.selectedActivity && activityBookingStatus.selectedActivity.selectedActivity.ageBands[3].count !== null ? (
                              <li>
                              No of Senior:&nbsp;
                                <b>
                                {activityBookingStatus.selectedActivity.selectedActivity.ageBands[3].count}
                                </b>
                              </li>
                            ) : null}

                            </ul> */}
                            <ul>
                            <li>
                              Email Id:&nbsp;
                              <b>
                                {
                                  activityBookingStatus.response.data
                                    .bookerEmail
                                }
                              </b>
                            </li>
                            </ul>

                            <ul>
                              <li>
                              Phone Number:&nbsp;
                              <b>
                                {activityBookingStatus.request.booker.cellPhone}
                              </b>
                            </li>
                            </ul>
                            <ul>{activityBookingStatus.response &&
                            activityBookingStatus.response.data != null && activityBookingStatus.response.data === undefined ? (
                              <li>
                                Hotel Pick up Info: &nbsp;
                                <b>
                                  {
                                    activityBookingStatus.response.data
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
                                  activityBookingStatus.request.items[0]
                                    .specialRequirements
                                }
                              </b>
                            </li>

                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bookingStatus">
                  <h5> Cancellation Policy</h5>
                  <span>
                    {_get(activityBookingStatus.response.data.itemSummaries,"merchantTermsAndConditions.termsAndConditions",'')}{" "}
                  </span>
                  <br/>
                  <p className="text-center">
                    We have sent a confirmation to:{" "}
                    <b>{this.props.loginDetails.email}</b>
                  </p>
                </div>
              </div>
            </div>
            <Footer />
          </section>
        )}
        <Footer />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  activityBookingStatus: state.activityReducer.activityBookingStatus,
  loginDetails: state.loginReducer.loginDetails
});
const mapDispatchToProps = dispatch => ({
  getSingleBookingTripInformation: payload =>
    dispatch(getSingleBookingTripInformation(payload))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ActivityBookingConfirmation)
);
