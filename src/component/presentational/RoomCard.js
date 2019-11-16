import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import {
  map as _map,
  sumBy as _sumBy,
  flatMapDeep as _flatMapDeep,
  get as _get,
  filter as _filter,
  forEach as _forEach,
  includes as _includes
} from "lodash";

import {
  DragSource,
  ConnectDragSource,
  DragSourceConnector,
  DragSourceMonitor
} from "react-dnd";

import { RawHtmlToJSON } from "./RawHtmlToJSON";
import ImageCarousel from "../presentational/ImageCarousel";

import img_signal from "../../asset/images/selectRoom/signal.png";
import img_icon from "../../asset/images/selectRoom/icon.png";
import img_parking from "../../asset/images/selectRoom/parking-sign(1).png";
import img_minibus from "../../asset/images/selectRoom/minibus.png";
import img_hotcoffee from "../../asset/images/selectRoom/hot-coffee.png";
import img_extrabed from "../../asset/images/selectRoom/extrabed.png";
import img_drag from "../../asset/images/selectRoom/drag.png";
import img_close from "../../asset/images/cancel.png";
import img_tick from "../../asset/images/roundTick.png";
import img_info from "../../asset/images/information.png";
import img_discount from "../../asset/images/discount.png";
import img_noSmoke from "../../asset/images/no-smoking-sign (1).png";
import img_reserve from "../../asset/images/online-booking.png";
import img_hotel from "../../asset/images/hotel-building.png";
import img_television from "../../asset/images/television.png";
import queryString from "query-string";

import { addItinerary } from "../../service/addCart/action";

import {
  loadingGifSearch,
  stopGifSearching
} from "../../service/common/action";

import URL from "../../asset/configUrl";

import axios from "../../Utils/request-process";

var currencies = require("country-data").currencies;

// Todo: have to change icons accordingly
const _amenitiesIcon = {
  Layout: img_parking, // todo
  Internet: img_icon,
  Entertainment: img_icon,
  "Food and Drink": img_hotcoffee,
  Sleep: img_extrabed,
  Bathroom: img_extrabed,
  Practical: img_minibus,
  Comfort: img_extrabed
};

class RoomCard extends Component {
  state = {
    isExpand: false,
    roomCount: 0,
    dragged: false
  };

  componentDidMount() {
    if (this.props.refId && this.props.refId.includes(this.props.room.refId)) {
      this.setState({
        dragged: true
      });
    } else {
      this.setState({
        dragged: false
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.refId && nextProps.refId.includes(nextProps.room.refId)) {
      this.setState({
        dragged: true
      });
    } else {
      this.setState({
        dragged: false
      });
    }
  }

  mobileItinerary = () => {
    const payloadGenerate = (
      sessionId,
      hotelId,
      currency,
      recomId,
      roomCount
    ) => {
      return _map(roomCount, (item, i) => {
        return typeof recomId == "object"
          ? _map(Array.apply(null, { length: item }), (each, index) => {
              return {
                sessionId,
                hotelId,
                recommendationId: recomId[i],
                optionalDataPrefs: ["All"],
                currency: currency,
                email: _get(this.props, "loginDetails.email", "")
              };
            })
          : _map(Array.apply(null, { length: item }), (each, index) => {
              return {
                sessionId,
                hotelId,
                recommendationId: recomId,
                optionalDataPrefs: ["All"],
                currency: currency,
                email: _get(this.props, "loginDetails.email", "")
              };
            });
      });
    };
    const {
      room,
      rate,
      hotel,
      checkout,
      checkin,
      recommendations
    } = this.props;
    var noOfNights = moment(checkout).diff(moment(checkin), "days");

    let hotelNew = Object.assign({}, hotel);
    hotelNew.amenities = hotelNew.amenities.splice(-2);
    hotelNew.images = hotelNew.images.splice(-2);
    const payload = {
      type: "hotel",
      title: hotel.name,
      subtitle: room.name,
      currency: this.props.selectedCurrency,
      bookingData: {
        ...{ currency: this.props.selectedCurrency },
        room: [
          {
            ...rate,
            ...{ recommendations: recommendations },
            ...room,
            ...{ roomCount: +this.state.roomCount }
          }
        ],
        hotel: hotelNew,
        ...{ bookingDays: noOfNights }
      },
      searchString: {
        ...queryString.parse(this.props.location.search),
        ...{ sessionId: this.props.sessionId }
      }
    };

    this.props.loadingGifSearch();

    const { hotelId, sessionId } = payload.searchString;
    const currency = JSON.parse(localStorage.getItem("currency")).ABR_NAME;
    let roomCount = [];
    let recomId = [];
    payload.bookingData.room.map((value, i) => {
      roomCount.push(value.roomCount);
      recomId.push(value.recommendations.id);
    });
    axios
      .post(
        URL.hotel.ROOM_PRICE,
        _flatMapDeep(
          payloadGenerate(sessionId, hotelId, currency, recomId, roomCount)
        )
      )
      .then(response => {
        this.props.stopGifSearching();
        console.log("response", response);
        const roomPriceInfo = response.data.data;
        console.log("roomPriceInfo:::::::", roomPriceInfo);
        let taxedAmount = _sumBy(
          _map(roomPriceInfo, (each, i) => each.taxedAmount)
        ).toFixed(2);
        let basedAmount = _sumBy(
          _map(roomPriceInfo, (each, i) => each.basedAmount)
        ).toFixed(2);
        let farebreakupAmount = _sumBy(
          _map(roomPriceInfo, (each, i) => each.farebreakupAmount)
        ).toFixed(2);
        console.log("taxedAmount::", taxedAmount, "typeof::", typeof taxedAmount)
        const taxFees = Number(taxedAmount)
        const baseAmount = Number(basedAmount)
        farebreakupAmount = Number(farebreakupAmount)
        payload.taxFees = taxFees.toFixed(2)
        
        payload.bookingData.room.map((value, i) => {
          payload.bookingData.room[i].totalPriceIncTax = Number(totalCost);
          payload.bookingData.room[i].basedAmount = baseAmount.toFixed(2)
          payload.bookingData.room[i].farebreakupAmount = farebreakupAmount.toFixed(2)
        });

        this.props.addToItinerary(payload);

        setTimeout(() => {
          this.forceUpdate();
        }, 300);
      })
      .catch(err => {
        this.props.stopGifSearching();
      });

    // return;
  };
  render() {
    const {
      room,
      rate,
      onReserve,
      connectDragSource,
      checkin,
      checkout,
      rmvHtmlFunc,
      handleChange,
      recommendations,
      selectedCurrency
    } = this.props;
    var noOfNights = moment(checkout).diff(moment(checkin), "days");
    const { isExpand } = this.state;
    const _amentLength = 5;
    // const roomInfo = RawHtmlToJSON(room.desc);
    const roomInfo = "";
    var noOfNights = moment(checkout).diff(moment(checkin), "days");
    let curFormat = JSON.parse(localStorage.getItem("currency"));
    curFormat = curFormat.CURRENCY_FORMAT;
    let actualFare = rate.FreeTotal / noOfNights;

    actualFare = new Intl.NumberFormat(curFormat, {
      minimumFractionDigits: 2
    }).format(actualFare.toFixed(2));

    // const amenitiesList = isExpand
    //   ? roomInfo.amenities
    //   : _filter(roomInfo.amenities, (each, i) => i < _amentLength);
    // const _danSTR =
    //   room.desc.split("<strong>")[0] === "<p>"
    //     ? room.desc
    //     : "<p>" + room.desc + "</p>";
    const _danSTR = "";
    const { hotel } = this.props;
    // const roomDescription = room.desc.split("<p>");
    const roomDescription = "";
    const roomLen = {
      length: room.availableRoomCount >= 4 ? 4 : room.availableRoomCount
    };
    const selectedCurrencyVal = currencies[this.props.selectedCurrency].symbol;
    const values = queryString.parse(this.props.location.search);
    return connectDragSource(
      <div className="sectionCard">
        <div className="d-flex flex-row resWrap">
          <div className="flex-column imagesection">
            {hotel.images.length ? (
              <ImageCarousel
                hotelName={hotel.name}
                imageList={_map(hotel.images, each => ({
                  name: each.imageCaption,
                  url: each.URL
                }))}
                thumbNail={{ name: "img1", url: hotel.images[0].URL }}
              />
            ) : (
              <ImageCarousel />
            )}
          </div>
          <div className="flex-column hotelInfoDet detailsBg">
            {/* <h6>{hotel.name}</h6> // remove as per vaibhav instruction */}
            <p>{room.name}</p>
            {/* TODO: Mulitiple image cant be return */}
            <ul>
              <li>
                <img
                className="imgMarginHotels"
                  style={{ margin: "0 0px 0 10px", width: "22px" }}
                  src={img_extrabed}
                  alt=""
                />
                <p>
                  {room.bedDetails.length ? (
                    _map(room.bedDetails, (each, i) => (
                      <React.Fragment key={i}>
                        {each.desc} {room.bedDetails.length > 1 ? "/" : null}
                      </React.Fragment>
                    ))
                  ) : (
                    <React.Fragment>Visit hotel's website</React.Fragment>
                  )}
                </p>
              </li>
            </ul>
            {/* {room.desc ? (
              <span className="imgMarginHotels" style={{ marginLeft: "10px", color: "#006DF0" }}>
                <img src={img_info} style={{ width: "16px" }} alt="" /> More
                Details{" "}
                <div
                  className="moreDetailToolTip"
                  dangerouslySetInnerHTML={{ __html: _danSTR }}
                ></div>
              </span>
            ) : null} */}
            {/* TODO: For more details btn remove html tags by vaibhav intruction */}
          </div>
          <div className="detailsBg flex-column">
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
                  </li>
                </React.Fragment>
              ) : (
                <li>
                  {" "}
                  <img style={{ width: "18px" }} src={img_close} alt="" />{" "}
                  <p> Non Refundable </p>
                </li>
              )}
              {rate.boardBasis && rate.boardBasis.desc ? (
                <React.Fragment>
                  <li>
                    <img style={{ width: "18px" }} src={img_hotcoffee} alt="" />
                    &nbsp;{" "}
                    <p>
                      <b style={{ fontWeight: "500" }}>
                        {rate.boardBasis.desc}
                      </b>
                    </p>{" "}
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
                    i < 2 && (
                      <li key={i}>
                        <img
                          style={{ width: "18px" }}
                          src={img_signal}
                          alt=""
                        />{" "}
                        &nbsp;<p>{each}</p>
                      </li>
                    )
                  );
                })
              ) : roomDescription[3] ? (
                <li>
                  <img style={{ width: "18px" }} src={img_hotel} alt="" />{" "}
                  &nbsp;<p>{rmvHtmlFunc(roomDescription[3])}</p>
                </li>
              ) : null}
              {roomDescription[2] ? (
                <li>
                  <img style={{ width: "18px" }} src={img_hotel} alt="" />{" "}
                  &nbsp;<p>{rmvHtmlFunc(roomDescription[2])}</p>
                </li>
              ) : null}
              {room.smokingIndicator ? (
                room.smokingIndicator !== "Unknown" ? (
                  <li>
                    <img style={{ width: "18px" }} src={img_noSmoke} alt="" />{" "}
                    &nbsp;<p>{room.smokingIndicator}</p>
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
                  &nbsp;<p>Reserve Now, Pay when you stay</p>
                </li>
              ) : roomDescription[4] ? (
                <li>
                  <img style={{ width: "18px" }} src={img_television} alt="" />{" "}
                  &nbsp;<p>{rmvHtmlFunc(roomDescription[4])}</p>
                </li>
              ) : null}
              {!rate.discounts ? (
                <li>
                  <img style={{ width: "18px" }} src={img_discount} alt="" />{" "}
                  &nbsp;<p>Special Discounted Price</p>
                </li>
              ) : roomDescription[5] ? (
                <li>
                  <img style={{ width: "18px" }} src={img_hotel} alt="" />{" "}
                  &nbsp;<p>{rmvHtmlFunc(roomDescription[5])}</p>
                </li>
              ) : null}
            </ul>
            {/* <div dangerouslySetInnerHTML={{ __html: _danSTR }} /> */}
            {/* <ul>
            {_map(amenitiesList, (each, i) => <li key={i}>
              <img style={{ margin: "0 10px" }} src={_amenitiesIcon[each.desc]} alt="" />
              <p>{each.name}</p>
            </li>)}
            {roomInfo.amenities.length > _amentLength && <span
              onClick={() => this.setState({ isExpand: !isExpand })}
            >
              {!isExpand ? "... show more" : "... show less"}
            </span>}
          </ul> */}
          </div>
          <div className="rateShowDiv flex-column">
            <div className="priceDiv">
              <p>
                {room.availableRoomCount >= 4
                  ? 4 + " rooms left"
                  : room.availableRoomCount + " rooms left"}
                {/* <span>Per night</span> */}
              </p>
              {/* <h2>${(totalAmt).toFixed(2)}</h2> */}
              {/* <h2>${(rate.baseFare * noOfNights).toFixed(2)}</h2> */}
              <h2>
                <span>{selectedCurrencyVal}</span>&nbsp;{actualFare}
              </h2>
              <p style={{ textAlign: "center", fontSize: "10px" }}>
                Total cost per night
              </p>
            </div>
            <div className="">
              <select
                className="multiRoomSel"
                onChange={e => {
                  handleChange(e, recommendations);

                  this.setState({
                    roomCount: e.target.value
                  });
                }}
              >
                <option value="0">Select Room</option>
                {_map(roomLen, (each, i) => {
                  return (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  );
                })}
              </select>
            </div>
            <img src={img_drag} />
            <span className="dragDropText">Drag and Drop</span>
            <div className="add-to-itinerary">
              <button disabled={this.state.roomCount == 0} onClick={this.mobileItinerary}>ADD TO ITINERARY</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const __itemSource = {
  canDrag(props, monitor, component) {
    return !_includes(_map(props.itineraryList, "refId"), props.refId);
  },
  beginDrag(props, monitor, component) {
    const {
      room,
      refId,
      rate,
      hotel,
      checkout,
      checkin,
      recommendations
    } = props;
    var noOfNights = moment(checkout).diff(moment(checkin), "days");

    let hotelNew = Object.assign({}, hotel);
    hotelNew.amenities = hotelNew.amenities.splice(-2);
    hotelNew.images = hotelNew.images.splice(-2);

    if (+component.state.roomCount != 0 && !component.state.dragged) {
      return {
        type: "hotel",
        // price: +(rate.baseFare / noOfNights).toFixed(2) || 0,
        title: hotel.name,
        subtitle: room.name,
        currency: props.selectedCurrency,
        bookingData: {
          ...{ currency: props.selectedCurrency },
          room: [
            {
              ...rate,
              ...{ recommendations: recommendations },
              ...room,
              ...{ roomCount: +component.state.roomCount }
            }
          ],
          hotel: hotelNew,
          ...{ bookingDays: noOfNights }
        },
        searchString: {
          ...queryString.parse(props.location.search),
          ...{ sessionId: props.sessionId }
        }
      };
    } else {
      return false;
    }
  },
  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      return;
    }
    component.setState({
      dragged: true
    });
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
  }
};

const __collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
};

const mapStateToProps = state => ({
  itineraryList: state.addcartReducer.itineraryList,
  selectedCurrency: state.commonReducer.selectedCurrency,
  sessionId: state.hotelReducer.sessionId,
  refId: state.addcartReducer.refId
});

const mapDispatchToProps = dispatch => ({
  addToItinerary: itPay => dispatch(addItinerary(itPay)),
  loadingGifSearch: () => dispatch(loadingGifSearch()),
  stopGifSearching: () => dispatch(stopGifSearching())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DragSource("ROOM", __itemSource, __collect)(RoomCard));
