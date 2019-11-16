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
import { map as _map, filter as _filter, get as _get } from "lodash";
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

var currencies = require("country-data").currencies;

class BookingConfirmation extends React.Component {
  state = { booking_result: {}, bookingArray: [] };

  componentDidMount() {
    window.scrollTo(0, 0);
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
    Html2Canvas(document.getElementById("print"))
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new JSPdf();
          const width = pdf.internal.pageSize.getWidth();
          const height = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
          pdf.save("booking.pdf");
        });
  };

  render() {
    const { paymentDetails, selectedCurrency } = this.props;
    const { bookingId } = paymentDetails.data.booking_result[0].data;
    const sucessMessage = paymentDetails.data.message;

    const InTime =
      paymentDetails.data.booking_result[0].bookingRequest
        .checkinCheckoutPolicy[0] &&
      paymentDetails.data.booking_result[0].bookingRequest
        .checkinCheckoutPolicy[0].inTime;
    const OutTime =
      paymentDetails.data.booking_result[0].bookingRequest
        .checkinCheckoutPolicy[0] &&
      paymentDetails.data.booking_result[0].bookingRequest
        .checkinCheckoutPolicy[0].outTime;

    const booking_result =
      paymentDetails &&
      paymentDetails.data &&
      paymentDetails.data.booking_result;
    const smokingIndicator =
      paymentDetails.data.booking_result[0].bookingRequest.rooms_info[0]
        .smokingIndicator;
    const mapCode =
      paymentDetails.data.booking_result[0].bookingRequest.geocode;
    const locationRef =
      `https://maps.google.com/?q=${mapCode.lat},${mapCode.long}` +
      "&output=embed";

    const {
      line1,
      line2,
      city,
      countryCode,
      postalCode
    } = booking_result[0].bookingRequest.hotel_address.contact.address;
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
      booking_result[0].bookingRequest.rooms_info[0].desc &&
      booking_result[0].bookingRequest.rooms_info[0].desc.split(
        "<strong>"
      )[0] === "<p>"
        ? booking_result[0].bookingRequest.rooms_info[0].desc
        : "<p>" + booking_result[0].bookingRequest.rooms_info[0].desc + "</p>";
    const values = queryString.parse(window.location.search);
    const stDt = moment(
      booking_result[0].bookingRequest.stayPeriod.start,
      "MM/DD/YYYY"
    );
    const endDt = moment(
      booking_result[0].bookingRequest.stayPeriod.end,
      "MM/DD/YYYY"
    );
    const isRefundable = booking_result[0].bookingRequest.refundability;
    const stayDt = endDt.diff(stDt, "days");

    const selectedCurrencyVal = currencies[booking_result[0].bookingRequest.fareBreakup.currency].symbol;

    const fees = _filter(booking_result[0].bookingRequest.policies, each => {
      return each.type == "Fee"
    })

    console.log("fees::::::", booking_result[0].bookingRequest)

    return (
      <React.Fragment>
        <TopNav onClick={this.props.onSignIn} />
        <section className="searchSection">
          <div className="container">
            <div id="print" className="bookingConfirmation">
              <div className="bookingStatus">
                <div className="d-flex flex-row smallTabColumn justify-content-between">
                  <div className="flex-column">
                    <div className="bookingStatusContent">
                      <img src={img_tick} alt="tick" />
                      <h3>{sucessMessage}</h3>
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
                      {booking_result[0] &&
                        booking_result[0].bookingRequest &&
                        booking_result[0].bookingRequest.hotel_address &&
                        booking_result[0].bookingRequest.hotel_address.name}
                    </h5>
                  </div>
                  <ul className="bookingHotelInfo">
                    <li className="borderRight">
                      {moment(
                        booking_result[0] &&
                          booking_result[0].bookingRequest &&
                          booking_result[0].bookingRequest.stayPeriod &&
                          booking_result[0].bookingRequest.stayPeriod.start
                      ).format("dddd")}
                      ,{" "}
                      {moment(
                        booking_result[0] &&
                          booking_result[0].bookingRequest &&
                          booking_result[0].bookingRequest.stayPeriod &&
                          booking_result[0].bookingRequest.stayPeriod.start
                      )
                        .format("MMM DD YYYY")
                        .toUpperCase()}
                      <span> </span> <img src={img_arrow} alt="arrow" />{" "}
                      <span> </span>
                      {moment(
                        booking_result[0] &&
                          booking_result[0].bookingRequest &&
                          booking_result[0].bookingRequest.stayPeriod &&
                          booking_result[0].bookingRequest.stayPeriod.end
                      ).format("dddd")}
                      ,{" "}
                      {moment(
                        booking_result[0] &&
                          booking_result[0].bookingRequest &&
                          booking_result[0].bookingRequest.stayPeriod &&
                          booking_result[0].bookingRequest.stayPeriod.end
                      )
                        .format("MMM DD YYYY")
                        .toUpperCase()}
                    </li>
                    <li className="borderRight">
                      Total Cost : {selectedCurrencyVal}&nbsp;
                      {parseFloat(
                        booking_result[0].bookingRequest.totalAmount
                      ).toFixed(2)}{" "}
                    </li>
                    <li> Xeniapp Booking ID # {bookingId}</li>
                  </ul>
                </div>
              </div>
              <div className="bookingStatus">
                <div className="d-flex flex-row smallTabColumn justify-content-between">
                  <div className="flex-column hotelImage">
                    <img
                      src={
                        booking_result[0] &&
                        booking_result[0].bookingRequest.images[0] &&
                        booking_result[0].bookingRequest.images[0].URL
                      }
                      alt="No images available"
                    />
                    {/* <img
                      src={booking_result[0].bookingRequest.images.URL}
                      alt="hotelImage"
                    /> */}
                    {/* <ImageCarousel
                        imageList={_map(
                          booking_result[0].bookingRequest.images && booking_result[0].bookingRequest.images,
                          each => ({
                              url: each.URL
                          })
                        )}
                      /> */}

                    {/* {_map(
                      booking_result,
                      each => each.ebookingRequest.images.length
                    ) ? (
                      <ImageCarousel
                        imageList={_map(
                          booking_result[0].bookingRequest.images && booking_result[0].bookingRequest.images,
                          each => ({
                           
                            url: each.URL
                          })
                        )}
                      />
                    ) : (
                      <ImageCarousel />
                    )} */}
                    {/* <ImageCarousel imageList={imageUrl}/> */}
                  </div>
                  <div className="flex-column bookingConfirmRoom">
                    <div className="d-flex flex-row resWrap">
                      <div className="flex-column infoDiv">
                        <div className="listTitle">
                          <UserRating
                            rating={booking_result[0].bookingRequest.rating}
                          />
                        </div>
                        <h6>
                          {booking_result[0].bookingRequest.hotel_address.name}
                        </h6>
                        <p>
                          <img src={img_location} />
                          <a target="_blank" rel="noreferrer">
                            {detailedAddress}
                          </a>
                        </p>
                        <span>Booking for {stayDt} Nights</span>
                        <div>
                          <span>Booked Rooms: {booking_result.length}</span>
                        </div>
                        <ul>
                          <li className="border">
                            <h5>
                              {" "}
                              {moment(
                                booking_result[0].bookingRequest.stayPeriod
                                  .start
                              )
                                .format("MMM DD")
                                .toUpperCase()}
                            </h5>
                            <p>
                              {moment(
                                booking_result[0].bookingRequest.stayPeriod
                                  .start
                              ).format("dddd")}
                            </p>
                          </li>
                          <li>
                            <img src={img_DateArrow} />
                          </li>
                          <li className="border">
                            <h5>
                              {moment(
                                booking_result[0].bookingRequest.stayPeriod.end
                              )
                                .format("MMM DD")
                                .toUpperCase()}
                            </h5>
                            <p>
                              {moment(
                                booking_result[0].bookingRequest.stayPeriod.end
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
                              style={{ textDecoration: "none", color: "#fff" }}
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
                  <h5>Room Details</h5>
                </div>
                <div className="bookingCollapseContent">
                  <div className="d-flex flex-row smallTabColumn justify-content-start">
                    <div className="flex-column RoomDiv">
                      <div className="roomImage">
                        <img
                          src={
                            booking_result[0].bookingRequest.images[0] &&
                            booking_result[0].bookingRequest.images[0].URL
                          }
                          alt="No images available"
                        />
                        {/* {_map(
                          booking_result,
                          each => each.bookingRequest.images.length
                        ) ? (
                          <ImageCarousel
                            imageList={_map(
                              booking_result[0].bookingRequest.images &&  booking_result[0].bookingRequest.images,
                              each => ({
                              
                                url: each.URL
                              })
                            )}
                          />
                        ) : (
                          <ImageCarousel />
                        )} */}
                      </div>
                    </div>
                    <div className="flex-column RoomDiv">
                      <div className="roomInfo">
                        <h6>Guest</h6>
                        <p>
                          Reserved Under{" "}
                          {
                            booking_result[0].bookingRequest.rooms[0].guests[0]
                              .name.first
                          }{" "}
                          {
                            booking_result[0].bookingRequest.rooms[0].guests[0]
                              .name.last
                          }
                        </p>
                        <p>
                          {booking_result[0].bookingRequest.guestInfo &&
                            booking_result[0].bookingRequest.guestInfo
                              .adultCount}{" "}
                          Adult,
                          {booking_result[0].bookingRequest.guestInfo &&
                            booking_result[0].bookingRequest.guestInfo
                              .childCount}{" "}
                          Child
                        </p>
                      </div>
                      <div className="roomInfo">
                        <h6>Room Type</h6>
                        <p>
                          {booking_result[0].bookingRequest.rooms_info[0].name}
                        </p>
                        <p>
                          {booking_result[0].bookingRequest.guestInfo &&
                            booking_result[0].bookingRequest.guestInfo
                              .adultCount}{" "}
                          Adult,
                          {booking_result[0].bookingRequest.guestInfo &&
                            booking_result[0].bookingRequest.guestInfo
                              .childCount}{" "}
                          Child
                        </p>{" "}
                        <ul className="roomType">
                          <li>
                            <img src={img_extrabed} alt="room bed" />
                            <p>
                              <b>
                                {booking_result[0].bookingRequest.rooms_info[0]
                                  .bedDetails[0] &&
                                  booking_result[0].bookingRequest.rooms_info[0]
                                    .bedDetails[0].type}
                              </b>
                              {/* make dynamic */}
                              {/* <span>(Extra bed available)</span> */}
                            </p>
                          </li>
                          <li>
                            {/* <img src={img_user} alt="room User" /> */}
                            <p>
                              {/* make dynamic */}
                              {/* <b>Sleeper 2 Guest</b>
                              <span>(Upto 2 Children)</span> */}
                            </p>
                          </li>
                        </ul>
                        {
                          booking_result[0].bookingRequest.cancellationPolicy.text && 
                          <div>
                            <h6>Cancellation Policy</h6>
                            <p>{booking_result[0].bookingRequest.cancellationPolicy.text}</p>
                          </div>
                        }
                        
                        {booking_result[0].bookingRequest.rooms_info[0].desc ? (
                          <span
                            style={{ marginLeft: "10px", color: "#006DF0" }}
                          >
                            <img
                              src={img_info}
                              style={{ width: "16px" }}
                              alt=""
                            />{" "}
                            More Details{" "}
                            <div
                              className="moreDetailToolTip"
                              dangerouslySetInnerHTML={{ __html: _danSTR }}
                            />
                          </span>
                        ) : null}
                      </div>
                      <div className="roomInfo">
                        {/* make dynamic */}
                        <h6>Room Request</h6>
                        <p> {smokingIndicator == "Unknown" ? "No special Request" : smokingIndicator} </p>
                      </div>
                    </div>
                    <div className="flex-column RoomDiv">
                      <h6>Included Amenities</h6>
                      <p>
                        {booking_result[0].bookingRequest.amenities[0] &&
                          booking_result[0].bookingRequest.amenities[0].name}
                      </p>
                      <p>
                        {booking_result[0].bookingRequest.amenities[1] &&
                          booking_result[0].bookingRequest.amenities[1].name}
                      </p>
                      <p>
                        {booking_result[0].bookingRequest.amenities[2] &&
                          booking_result[0].bookingRequest.amenities[2].name}
                      </p>
                      <p>
                        {booking_result[0].bookingRequest.amenities[3] &&
                          booking_result[0].bookingRequest.amenities[3].name}
                      </p>
                      <p>
                        {booking_result[0].bookingRequest.amenities[4] &&
                          booking_result[0].bookingRequest.amenities[4].name}
                      </p>
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
                          (booking_result[0].bookingRequest.policies[0] &&
                            booking_result[0].bookingRequest.policies[0]
                              .text) ||
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
                          (booking_result[0].bookingRequest.policies[3] &&
                            booking_result[0].bookingRequest.policies[3]
                              .text) ||
                            "No Description"
                        )}
                      </p>
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
                            {booking_result.reduce((sum, amountValue) => {
                              return (
                                sum +
                                +amountValue.bookingRequest.amtAfterdiscount.toFixed(
                                  2
                                )
                              );
                            }, 0)}
                          </span>
                        </li>
                        <li>
                          <span>Taxes & Fees</span>
                          <span>
                            {selectedCurrencyVal}{" "}
                            {booking_result.reduce((sum, groupValuesHotel) => {
                              return (
                                sum +
                                +(groupValuesHotel.bookingRequest.fareBreakup
                                  .taxes[0] &&
                                groupValuesHotel.bookingRequest.fareBreakup
                                  .taxes[0].amount +
                                  groupValuesHotel.bookingRequest
                                    .farebreakupAmount
                                  ? parseFloat(
                                      groupValuesHotel.bookingRequest
                                        .fareBreakup.taxes[0] &&
                                        groupValuesHotel.bookingRequest
                                          .fareBreakup.taxes[0] &&
                                        groupValuesHotel.bookingRequest
                                          .fareBreakup.taxes[0].amount +
                                          groupValuesHotel.bookingRequest
                                            .farebreakupAmount
                                    ).toFixed(2)
                                  : 0.0)
                              );
                            }, 0)}
                          </span>
                        </li>

                        <li>
                          <span>Total Cost</span>
                          {selectedCurrencyVal}{" "}
                          {booking_result.reduce((sum, groupValuesHotel) => {
                            return (
                              sum +
                              +groupValuesHotel.bookingRequest.totalAmount.toFixed(
                                2
                              )
                            );
                          }, 0)}
                          {/* <span>{selectedCurrencyVal}&nbsp;{parseFloat(groupValuesHotel[0].bookingRequest.totalAmount).toFixed(2)}</span> */}
                        </li>
                      </ul>
                      {/* <p> The above price is for one room </p> */}
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
                          booking_result[0].bookingRequest.cancellationPolicy
                            .text
                        }
                      </p>
                      <h6>Pricing and Payment</h6>
                      <p>
                        {booking_result[0].bookingRequest.policies[2] &&
                          booking_result[0].bookingRequest.policies[2].text}
                      </p>
                      {fees.length > 0 && <div><h6>Fees</h6>
                      <ul style={{paddingLeft: "20px"}}>
                        <li style={{color: "#464646", fontSize: "13px", marginBottom: "3px"}}>{_get(fees[0], "text")}</li>
                      </ul></div>}
                      
                      <h6>Guest Charges and Room Capacity</h6>
                      <p>
                        {" "}
                        {this.rmvHtmlFunc(
                          booking_result[0].bookingRequest.policies[3] &&
                            booking_result[0].bookingRequest.policies[3].text
                        )}{" "}
                      </p>
                      {/* <p>{booking_result[0].bookingRequest.policies[3] && booking_result[0].bookingRequest.policies[3].text}</p> */}
                      <p>
                        {this.rmvHtmlFunc(
                          booking_result[0].bookingRequest.rooms_info[0] &&
                            booking_result[0].bookingRequest.rooms_info[0].desc
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

              {/* <div className="bookingCollapse">
                <div className="bookingCollapseTitle">
                  <h5>Additional Hotel Fees</h5>
                </div>
                <div className="bookingCollapseContent">
                  <div className="d-flex flex-row justify-content-start">
                    <div className="flex-column">
                   
                      <h6>
                        The below fees and deposits only apply if they are not
                        included in your selected room rate.
                      </h6>
                      <p>
                        You'll be asked to pay the following charges at the
                        property:
                      </p>
                      <br />
                      <p>Deposit: USD 100 per stay</p>
                      <p>
                        We have included all charges provided to us by the
                        property. However, charges can vary, for example, based
                        on length of stay or the room you book.
                      </p>
                      <p>
                        The price shown above DOES NOT include any applicable
                        hotel service fees, charges for optional incidentals
                        (such as minibar snacks or telephone calls), or
                        regulatory surcharges. The hotel will assess these fees,
                        charges, and surcharges upon check-out.
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}

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
                        <li>
                          For more efficient support remember your{" "}
                          <b>Booking ID # {bookingId}</b>
                        </li>
                        
                        
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  paymentDetails: state.paymentReducer.paymentDetails,
  selectedCurrency: state.hotelReducer.selectedCurrency
});
const mapDispatchToProps = dispatch => ({});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BookingConfirmation)
);
