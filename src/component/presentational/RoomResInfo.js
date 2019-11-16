import React, { Component } from "react";
import { map as _map, isEmpty as _isEmpty, sumBy as _sumBy } from "lodash";
import moment from "moment";
import Highlighter from "react-highlight-words";
import ImageCarousel from "../../component/presentational/ImageCarousel";
import openNewTab from "../../asset/images/dashboard/resize.png";
import img_discount from "../../asset/images/discount.png";
import img_noSmoke from "../../asset/images/no-smoking-sign (1).png";
import img_reserve from "../../asset/images/online-booking.png";
import img_close from "../../asset/images/cancel.png";
import img_tick from "../../asset/images/roundTick.png";
import img_extrabed from "../../asset/images/selectRoom/extrabed.png";
import img_hotel from "../../asset/images/hotel-building.png";
import img_signal from "../../asset/images/selectRoom/signal.png";
import img_Time from "../../asset/images/Time.svg";
import img_DateArrow from "../../asset/images/Date Arrow.png";
import img_WhereIcon from "../../asset/images/Where Icon (Map Marker).svg";
import UserRating from "./UserRating";
import img_hotcoffee from "../../asset/images/selectRoom/hot-coffee.png";
import img_television from "../../asset/images/television.png";
import { connect } from 'react-redux';
import {sendingEmailDetails} from "../../service/addCart/action";
import { withRouter } from "react-router-dom";
import HotelInfo from "./hotelInfo";
import { dumpValue, replaceItinerary } from "../../service/addCart/action";
import HotelBookingProtection from "./HotelBookingProtection";
var currencies = require("country-data").currencies;

class RoomResInfo extends Component {
  state = {};

  func = () => {
    return this.props.rateBy;
  };

  componentDidMount() {
    const { hotel, totalAmount, roomCount } = this.props;
   // this.props.sendingEmailDetails(this.props);



    // try{
    //   let totalCost=(totalAmount * roomCount).toFixed(2)
    //   let newIti= this.props.itineraryList.map((listData)=>{
    //   let newListItem=listData
    //    if(listData.type=="hotel"){
    //     if(listData.bookingData.hotel.id==hotel.id){
    //       newListItem.price=+totalCost
    //     }
    //    }
    //    return newListItem
    //   })
    //   this.props.replaceItinerary(newIti)
    // }catch(e){

    // }
  }
  render() {
    const {
      hotel,
      checkin,
      checkout,
      fareBreakup,
      room,
      checkinCheckoutPolicy,
      isCancellation,
      cancellationPolicy,
      togglecancellation,
      toggleSplCancel,
      isSpclIns,
      policy,
      rate,
      totalAmount,
      farebreakupAmount,
      selectedRoomCount,
      roomDesc,
      rateBy,
      isTotAmt,
      isRoomDesc,
      roomCount,
      rmvHtmlFunc,
      selectedCurrency,
      pricedTotalFare,
      discountedAmount,
      taxedAmount,
      amtAfterdiscount,
      basedAmount
    } = this.props;
console.log("pricedTotalFare ? ", pricedTotalFare)
    const locationRef = `https://maps.google.com/?q=${hotel.geocode.lat},${
      hotel.geocode.long
    }`;
    const {
      line1,
      line2,
      city,
      countryCode,
      postalCode
    } = hotel.contact.address;
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
    // const { checkin, checkout } = this.props.bookingDate;
    const stDt = moment(checkin, "MM/DD/YYYY");
    const endDt = moment(checkout, "MM/DD/YYYY");
    const stayDt = endDt.diff(stDt, "days");
    // const taxAmount =
    //   fareBreakup.taxes.length > 0 ? fareBreakup.taxes[0].amount : 0;
    const taxAmount = _sumBy(fareBreakup.taxes, "amount");
    const roomDescription = room[0].desc ? room[0].desc.split("<p>") : "";
    if (isRoomDesc) {
      var multiplyAmtUniq = selectedRoomCount[roomDesc];
    } else if (isTotAmt) {
      multiplyAmtUniq = selectedRoomCount[totalAmount];
    }
    const selectedCurrencyVal = currencies[this.props.selectedCurrency].symbol;
    let discountValue = null;
    if (!_isEmpty(this.props.fareBreakup.discounts)) {
      discountValue = this.props.fareBreakup.discounts.reduce(
        (intial, value) => {
          return intial + +value.amount;
        },
        0
      );
    }
    console.log("RoomResInfo.js");
    let curFormat = JSON.parse(localStorage.getItem("currency"));
    curFormat = curFormat.CURRENCY_FORMAT;
    // let roomPricePerDay = fareBreakup.baseFare / stayDt;
    // roomPricePerDay = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(roomPricePerDay.toFixed(2));
    // let roomPriceWithRoomCount = roomCount * fareBreakup.baseFare;
    let roomPriceWithRoomCount = roomCount * (basedAmount + farebreakupAmount);
    let roomPricePerDay = roomPriceWithRoomCount / stayDt;
    roomPricePerDay = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(roomPricePerDay.toFixed(2));
    
    
    // let taxPrice = ((taxAmount + farebreakupAmount) * roomCount);
    // taxPrice = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(taxPrice);
    let taxPrice = ((taxAmount) * roomCount);
    taxPrice = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(taxPrice);

    

    let discountPrice = discountValue && discountValue;
    if(discountPrice != null){
      discountPrice = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(discountPrice.toFixed(2));
    }
    
    let totalAmt = (totalAmount * roomCount);
    // let calcTax = totalAmt - roomPriceWithRoomCount
    let calcTax = taxedAmount
    roomPriceWithRoomCount = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(roomPriceWithRoomCount.toFixed(2));
    totalAmt = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(totalAmt.toFixed(2));

    
    calcTax = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(calcTax.toFixed(2));

    return (
      <div id="RoomResInfo">
      <div className="selectRoomItemsBg d-flex flex-row resWrap" >
        <div className="flex-column confirmRoomLeft" >
          {hotel.images.length ? (
            <ImageCarousel
              imageList={_map(hotel.images, each => ({
                name: each.imageCaption,
                url: each.URL
              }))}
              thumbNail={{ name: "img1", url: hotel.images[0].URL }}
            />
          ) : (
            <ImageCarousel />
          )}
          <div
            className="d-flex flex-row"
            style={{ width: "100%", padding: "3px 0px" }}
          >
            <div className="flex-column" style={{ width: "45%" }}>
              <ul>
                {rate.refundability == "Refundable" ? (
                  <React.Fragment>
                    <li>
                      <img style={{ width: "16px" }} src={img_tick} alt="" />{" "}
                      <p
                        className={
                          rate.cancellationPolicy.penaltyRules.length <= 1
                            ? ""
                            : "freeCancelPop"
                        }
                      >
                        Free Cancellation{" "}
                        {rate.cancellationPolicy.penaltyRules.length <= 1 &&
                          "till  " +
                            moment(
                              rate.cancellationPolicy.penaltyRules[1]
                                ? rate.cancellationPolicy.penaltyRules[1].window
                                    .start
                                : rate.cancellationPolicy.penaltyRules[0].window
                                    .start
                            ).format("MMM DD YYYY")}
                        {rate.cancellationPolicy.penaltyRules.length <= 1 ? (
                          ""
                        ) : (
                          <div className="moreDetailToolTip1">
                            <p>Cancellation Policy</p>
                            <table>
                              <thead>
                                <tr>
                                  <th>Cancelled on or After </th>
                                  <th>Cancelled on or Before </th>
                                  <th>
                                    Cancellation Charges(Total period of stay
                                    inclusive of taxes)
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {_map(
                                  rate.cancellationPolicy.penaltyRules,
                                  (each, i) => (
                                    <tr>
                                      <td>
                                        {moment(each.window.start).format(
                                          "MMM DD YYYY"
                                        )}
                                      </td>
                                      <td>
                                        {moment(each.window.end).format(
                                          "MMM DD YYYY"
                                        )}
                                      </td>
                                      <td>{each.estimatedValue.toFixed(2)}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </p>
                      {/* <p>Free Cancellation till {moment(rate.cancellationPolicy.penaltyRules[0].window.start).format('MM-DD-YYYY')}</p> */}
                    </li>
                  </React.Fragment>
                ) : (
                  <li>
                    {" "}
                    <img
                      style={{ width: "18px" }}
                      src={img_close}
                      alt=""
                    />{" "}
                    <p> Non Refundable </p>
                  </li>
                )}

                {/* <li><img style={{ width: '16px' }} src={img_tick} alt="" /> <p className={rate.cancellationPolicy.penaltyRules.length <=1 ?'':"freeCancelPop"}>Free Cancellation { rate.cancellationPolicy.penaltyRules.length <=1 &&  'till  ' +  moment(rate.cancellationPolicy.penaltyRules[1] ? rate.cancellationPolicy.penaltyRules[1].window.start : rate.cancellationPolicy.penaltyRules[0].window.start).format('MM-DD-YYYY') }{ rate.cancellationPolicy.penaltyRules.length <=1 ? "" :
                 
                   <div className="moreDetailToolTip1" >
                   <p>Cancellation Policy</p>
                    <table>
                      <thead>
                        <tr>
                          <th>Cancelled on or After </th>
                          <th>Cancelled on or Before </th>
                          <th>Cancellation Charges(Total period of stay inclusive of taxes)</th>
                        </tr>
                      </thead>
                      <tbody>
                        { _map(rate.cancellationPolicy.penaltyRules,(each,i)=>(
                        <tr>
                          <td>{moment(each.window.start).format("MM-DD-YYYY")}</td>
                           <td>{moment(each.window.end).format("MM-DD-YYYY")}</td>
                            <td>{(each.estimatedValue).toFixed(2)}</td>
                        </tr>))}
                      </tbody>
                      </table></div>}</p>
                     </li>
                 */}

                {rate.boardBasis ? (
                  <React.Fragment>
                    <li>
                      <img
                        style={{ width: "18px" }}
                        src={img_hotcoffee}
                        alt=""
                      />
                      &nbsp; <p>{rate.boardBasis.desc}</p>{" "}
                    </li>
                  </React.Fragment>
                ) : (
                  <li>
                    <img style={{ width: "18px" }} src={img_extrabed} alt="" />{" "}
                    &nbsp;<p>Room Only</p>
                  </li>
                )}
                {rate.inclusions ? (
                  _map(rate.inclusions, (each, i) => {
                    return (
                      <li key={i}>
                        <img
                          style={{ width: "18px" }}
                          src={img_signal}
                          alt=""
                        />{" "}
                        &nbsp;<p>{each}</p>
                      </li>
                    );
                  })
                ) : roomDescription[5] ? (
                  <li>
                    <img style={{ width: "18px" }} src={img_hotel} alt="" />{" "}
                    &nbsp;<p>{rmvHtmlFunc(roomDescription[5])}</p>
                  </li>
                ) : null}
              </ul>
            </div>
            <div className="flex-column" style={{ width: "55%" }}>
              <ul>
                {roomDescription[2] ? (
                  <li>
                    <img style={{ width: "18px" }} src={img_hotel} alt="" />{" "}
                    &nbsp;<p style={{ maxWidth: "85%" }}>{rmvHtmlFunc(roomDescription[2])}</p>
                  </li>
                ) : null}
                {room[0].smokingIndicator ? (
                  room[0].smokingIndicator !== "Unknown" ? (
                    <li>
                      <img style={{ width: "18px" }} src={img_noSmoke} alt="" />{" "}
                      &nbsp;<p style={{ maxWidth: "85%" }}>{room[0].smokingIndicator}</p>
                    </li>
                  ) : (
                    <li>
                      <img style={{ width: "18px" }} src={img_noSmoke} alt="" />{" "}
                      &nbsp;<p>Smoking/ Non Smoking</p>
                    </li>
                  )
                ) : null}
                {!rate.isPrepaid ? (
                  <li>
                    <img style={{ width: "18px" }} src={img_reserve} alt="" />{" "}
                    <p>Reserve Now, Pay when you stay</p>
                  </li>
                ) : roomDescription[4] ? (
                  <li>
                    <img
                      style={{ width: "18px" }}
                      src={img_television}
                      alt=""
                    />{" "}
                    &nbsp;
                    <p style={{ maxWidth: "85%" }}>
                      {rmvHtmlFunc(roomDescription[4])}
                    </p>
                  </li>
                ) : null}
                {!rate.discounts ? (
                  <li>
                    <img style={{ width: "18px" }} src={img_discount} alt="" />{" "}
                    &nbsp;<p>Special Discounted Price</p>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
          <h6 className="mt-2">
            Reservation & Cancellation Policy{" "}
            <i
              style={{ cursor: "pointer" }}
              className="fas fa-angle-double-down"
              onClick={togglecancellation}
            />
          </h6>
          {!isCancellation && <p>{cancellationPolicy}</p>}
          <h6 className="mt-2">
            Special Instructions{" "}
            <i
              style={{ cursor: "pointer" }}
              className="fas fa-angle-double-down"
              onClick={toggleSplCancel}
            />
          </h6>
          {isSpclIns &&   (
            <div>
              {_map(policy, (each, i) => {
                // connect(checkinCheckoutPolicy[0].inTime);
                // connect(checkinCheckoutPolicy[0].outTime);
                // console.log(each.type)
                return (
                  <React.Fragment>
                    <span>
                      <b>{each.type}</b>
                    </span>
                    <p>{rmvHtmlFunc(each.text)} </p>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex-column confirmRoomRight">
          <UserRating rating={hotel.rating} />
          <div className="reservationDetails">
            <h4>{hotel.name}</h4>
            <p>
              <img src={img_WhereIcon} />
              <a href={locationRef} target="_blank" rel="noreferrer">
                {detailedAddress}
              </a>
            </p>
            <div>
            <h6>{room && room[0] && room[0].name}</h6>
            <ul className="conResRoomDet">
              <li>
                <img
                  style={{ margin: "0 10px", width: "22px" }}
                  src={img_extrabed}
                  alt=""
                />
                <p>
                  {room[0].bedDetails.length ? (
                    _map(room[0].bedDetails, (each, i) => (
                      <React.Fragment>
                        {each.desc} {room[0].bedDetails.length > 1 ? "/" : null}
                      </React.Fragment>
                    ))
                  ) : (
                    <React.Fragment> Visit hotel's website</React.Fragment>
                  )}
                </p>
              </li>
            </ul>
            </div>
            <span
              style={{
                fontWeight: "400",
                fontSize: "10px",
                margin: " 0px 10px"
              }}
            >
              Booking for {stayDt} Nights
            </span>
            <ul style={{ margin: "5px 9px" }}>
              <li className="border">
                <h5>
                  {moment(checkin)
                    .format("MMM DD")
                    .toUpperCase()}
                </h5>
                <p>{moment(checkin).format("dddd")}</p>
              </li>
              <li>
                <img src={img_DateArrow} />
              </li>
              <li className="border">
                <h5>
                  {moment(checkout)
                    .format("MMM DD")
                    .toUpperCase()}
                </h5>
                <p>{moment(checkout).format("dddd")}</p>
              </li>
            </ul>
            <ul className="checkInOut">
              <li>
                <img src={img_Time} />
                <span>
                  Check-In{" "}
                  <b>
                    {checkinCheckoutPolicy.length &&
                    (checkinCheckoutPolicy[0].inTime &&
                      checkinCheckoutPolicy[0].outTime)
                      ? checkinCheckoutPolicy[0].inTime + 0
                      : "12.00am"}
                  </b>
                </span>
              </li>
              <li>
                <img src={img_Time} />
                <span>
                  Check-Out{" "}
                  <b>
                    {checkinCheckoutPolicy.length &&
                    (checkinCheckoutPolicy[0].outTime &&
                      checkinCheckoutPolicy[0].inTime)
                      ? checkinCheckoutPolicy[0].outTime + 0
                      : "06.00pm"}
                  </b>
                </span>
              </li>
            </ul>
          </div>
          <span style={{ fontWeight: "100", fontSize: "12px" }}>
            {room && room[0] && room[0].name} (<b>{roomCount}</b> &nbsp;Room
            Selected){" "}
          </span>
          <ul className="totalAmountDis">
            <li>
              <span>{room && room[0] && room[0].name} </span>
              <span>
                <span style={{ fontSize: "16px" }}>{selectedCurrencyVal}</span>
                &nbsp;{roomPricePerDay}/night{" "}
              </span>
            </li>
            <li>
              <span>
                {stayDt} Nights x {roomCount} Rooms
              </span>{" "}
              <span>
                <span style={{ fontSize: "16px" }}>{selectedCurrencyVal}</span>
                &nbsp;{roomPriceWithRoomCount}

              </span>
            </li>
            <li>
              <span>Taxes & Fees</span>{" "}
              <span>
                <span style={{ fontSize: "16px" }}>{selectedCurrencyVal}</span>
                &nbsp;{calcTax}

              </span>
              {/* <span>{selectedCurrencyVal}{(selectedRoomCount[totalAmount]) * (taxAmount + farebreakupAmount).toFixed(2)}</span> */}
            </li>
            {discountValue && (
              <li>
                <span>Xeniapp Discount</span>{" "}
                <span>
                  <span style={{ fontSize: "16px" }}>
                    <strong>- </strong>
                    <Highlighter
                      className="discountRemoveMinus"
                      autoEscape={true}
                      searchWords={["-"]}
                      textToHighlight={selectedCurrencyVal}
                    />
                  </span>
                  &nbsp;{discountPrice}

                </span>
                {/* <span>{selectedCurrencyVal}{(selectedRoomCount[totalAmount]) * (taxAmount + farebreakupAmount).toFixed(2)}</span> */}
              </li>
            )}
            <li>
              <span>Total Cost</span>{" "}
              <span>
                <span style={{ fontSize: "16px" }}>{selectedCurrencyVal}</span>
                &nbsp;{totalAmt}

              </span>
            </li>
          </ul>
          
          {/* <h6 className="mt-2">
            Reservation & Cancellation Policy{" "}
            <i
              style={{ cursor: "pointer" }}
              className="fas fa-angle-double-down"
              onClick={togglecancellation}
            />
          </h6>
          {!isCancellation && <p>{cancellationPolicy}</p>}
          <h6 className="mt-2">
            Special Instructions{" "}
            <i
              style={{ cursor: "pointer" }}
              className="fas fa-angle-double-down"
              onClick={toggleSplCancel}
            />
          </h6>
          {isSpclIns && (
            <div>
              {_map(policy, (each, i) => {
                console.log("david====>RoomResInfo.js");
                connect.log(checkinCheckoutPolicy[0].inTime);
                connect.log(checkinCheckoutPolicy[0].outTime);
                console.log(policy);
                return (
                  <React.Fragment>
                    <span>
                      <b>{each.type}</b>
                    </span>
                    <p>{rmvHtmlFunc(each.text)} </p>
                  </React.Fragment>
                );
              })}
            </div>
          )} */}
        </div>





{/* 
        <div
          className="flex-column confirmRoomRight"
          style={{ display: "none" }}
        >
          <span style={{ fontWeight: "100", fontSize: "12px" }}>
            {room && room[0] && room[0].name} (<b>{roomCount}</b> &nbsp;Room
            Selected){" "}
          </span>
          <ul className="totalAmountDis">
            <li>
              <span>{room && room[0] && room[0].name} </span>
              <span>
                <span style={{ fontSize: "16px" }}>{selectedCurrencyVal}</span>
                &nbsp;{(fareBreakup.baseFare / stayDt).toFixed(2)}/night{" "}
              </span>
            </li>
            <li>
              <span>
                {stayDt} Nights x {roomCount} Rooms
              </span>{" "}
              <span>
                <span style={{ fontSize: "16px" }}>{selectedCurrencyVal}</span>
                &nbsp;{(roomCount * fareBreakup.baseFare).toFixed(2)}
              </span>
            </li>
            <li>
              <span>Taxes & Fees</span>{" "}
              <span>
                <span style={{ fontSize: "16px" }}>{selectedCurrencyVal}</span>
                &nbsp;{((taxAmount + farebreakupAmount) * roomCount).toFixed(2)}
              </span> */}
              {/* <span>{selectedCurrencyVal}{(selectedRoomCount[totalAmount]) * (taxAmount + farebreakupAmount).toFixed(2)}</span> */}
            {/* </li>
            {discountValue && (
              <li>
                <span>Discount</span>{" "}
                <span>
                  <span style={{ fontSize: "16px" }}>
                    <strong>- </strong>
                    <Highlighter
                      className="discountRemoveMinus"
                      autoEscape={true}
                      searchWords={["-"]}
                      textToHighlight={selectedCurrencyVal}
                    />
                  </span>
                  &nbsp;{discountValue.toFixed(2)}
                </span> */}
                {/* <span>{selectedCurrencyVal}{(selectedRoomCount[totalAmount]) * (taxAmount + farebreakupAmount).toFixed(2)}</span> */}
              {/* </li>
            )}
            <li>
              <span>Total Cost</span>{" "}
              <span>
                <span style={{ fontSize: "16px" }}>{selectedCurrencyVal}</span>
                &nbsp;{(totalAmount * roomCount).toFixed(2)}
              </span>
            </li>
          </ul>
          <h6 className="mt-2">
            Reservation & Cancellation Policy{" "}
            <i
              style={{ cursor: "pointer" }}
              className="fas fa-angle-double-down"
              onClick={togglecancellation}
            />
          </h6>
          {!isCancellation && <p>{cancellationPolicy}</p>}
          <h6 className="mt-2">
            Special Instructions{" "}
            <i
              style={{ cursor: "pointer" }}
              className="fas fa-angle-double-down"
              onClick={toggleSplCancel}
            />
          </h6>
          {isSpclIns && (
            <div>
              {_map(policy, (each, i) => {
                console.log("david====>RoomResInfo.js");
                connect.log(checkinCheckoutPolicy[0].inTime);
                connect.log(checkinCheckoutPolicy[0].outTime);
                console.log(policy);
                return (
                  <React.Fragment>
                    <span>
                      <b>{each.type}</b>
                    </span>
                    <p>{rmvHtmlFunc(each.text)} </p>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div> */}




      </div>
      
      </div>
      
     
    );
  }
}

const mapStateToProps = state => ({
  selectedCurrency: state.commonReducer.selectedCurrency,
  dataDump: state.addcartReducer.dataDump,
  itineraryList: state.addcartReducer.itineraryList
});
const mapDispatchToProps = dispatch => ({
  dumpValue: data => dispatch(dumpValue(data)),
  replaceItinerary: data => dispatch(replaceItinerary(data)),
  sendingEmailDetails: payload => dispatch(sendingEmailDetails(payload))
});
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RoomResInfo)
);
