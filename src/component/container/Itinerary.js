import React from "react";
import { connect } from "react-redux";
import {
  addItinerary,
  removeItinerary,
  saveWishList,
  replaceItinerary,
  sendEmailToAgent
} from "../../service/addCart/action";
import {
  map as _map,
  sumBy as _sumBy,
  flatMapDeep as _flatMapDeep,
  get as _get,
  filter as _filter,
  forEach as _forEach
} from "lodash";
import Notifications, { notify } from "react-notify-toast";
import img_DragDrop from "../../asset/images/Drag-and-Drop-Section.png";
import img_ItineraryTourist from "../../asset/images/Your Itinerary Tourist.svg";
import img_hotel from "../../asset/images/hotel-building.png";
import img_plane from "../../asset/images/plane.png";
import img_car from "../../asset/images/car.png";
import img_activities from "../../asset/images/activities.png";
import img_DateArrow from "../../asset/images/Date Arrow.png";
import img_ItineraryExpanded from "../../asset/images/Itinerary-Expanded-Lines.png";
import itinerary from "../../asset/images/itinerary.png";
import queryString from "query-string";
import { DropTarget, ConnectDropTarget, DropTargetMonitor } from "react-dnd";
import { withRouter } from "react-router-dom";
import { Collapse, Button, CardBody, Card } from "reactstrap";
import img_calender from "../../asset/images/dashboard/calender.png";
import img_Time from "../../asset/images/Time.svg";
import moment from "moment";
import img_transfer from "../../asset/images/chauffeur.png";
import URL from "../../asset/configUrl";

import axios from "../../Utils/request-process";

import {
  loadingGifSearch,
  stopGifSearching
} from "../../service/common/action";

var currencies = require("country-data").currencies;

class Itinerary extends React.Component {
  state = {
    isExpand: false,
    allCartDetails: [],
    wishListSaveAlert: false,
    isModal: false,
    isSameSetOfPassangers: false,
    currentDragItem: null,
    passangerError: false,
    passangerErrorMessage: "",
    randomRender: Math.random(),
    collpseIti: {},
    customEmail: "",
    customMarkup: ""
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.isOver && this.props.isOver) {
      // You can use this as enter handler
    }

    if (prevProps.isOver && !this.props.isOver) {
      // You can use this as leave handler
    }

    if (prevProps.isOverCurrent && !this.props.isOverCurrent) {
      // You can be more specific and track enter/leave
      // shallowly, not including nested targets
    }
  }

  handleRemoveItinerary = item => {
    this.props.removeFromItinerary(item);
  };

  componentWillReceiveProps(nextProps) {
    sessionStorage.setItem(
      "itinerary",
      JSON.stringify(nextProps.itineraryList)
    );
    if (
      this.props.wishlistStatus != nextProps.wishlistStatus &&
      nextProps.wishlistStatus &&
      nextProps.wishlistStatus.hasOwnProperty("status") &&
      nextProps.wishlistStatus.status == "success"
    ) {
      this.setState({
        wishListSaveAlert: true
      });
      this.props.history.push("/dashboard/wish-list");
      setTimeout(() => {
        this.setState({
          wishListSaveAlert: false
        });
      }, 3000);
    }
  }

  onSaveHandle = () => {
    if (this.props.itineraryList.length != 0) {
      console.log(this.props.itineraryList);
      //this.props.history.push("/hotel/multiplebooking")
      if (this.props.loginDetails) {
        const { email } = this.props.loginDetails;
        this.props.saveWishList({ data: this.props.itineraryList, email });
      } else {
        this.setState({
          passangerError: true,
          passangerErrorMessage: "Log in to add wishlist"
        });
        setInterval(() => {
          this.setState({
            passangerError: false,
            passangerErrorMessage: ""
          });
        }, 5000);
      }
    } else {
      this.setState({
        passangerError: true,
        passangerErrorMessage: "No items added to itinerary"
      });

      setTimeout(() => {
        this.setState({
          passangerError: false,
          passangerErrorMessage: ""
        });
      }, 4000);
    }
  };

  diffPassangersCheck = dragItem => {
    if (
      this.props.itineraryList.find(wishListData => {
        if (wishListData.type.includes("hotel")) {
          return (
            wishListData.type == dragItem.type &&
            wishListData.bookingData.hotel.id != dragItem.bookingData.hotel.id
          );
        } else {
          return wishListData.type == dragItem.type;
        }
      })
    ) {
      this.setState({
        passangerError: true,
        passangerErrorMessage: "Only one hotel and one car allowed"
      });
      setInterval(() => {
        this.setState({
          passangerError: false,
          passangerErrorMessage: ""
        });
      }, 5000);
    } else {
      // const payloadGenerate = (
      //   sessionId,
      //   hotelId,
      //   currency,
      //   recomId,
      //   roomCount
      // ) => {
      //   return _map(roomCount, (item, i) => {
      //     return typeof recomId == "object"
      //       ? _map(Array.apply(null, { length: item }), (each, index) => {
      //           return {
      //             sessionId,
      //             hotelId,
      //             recommendationId: recomId[i],
      //             optionalDataPrefs: ["All"],
      //             currency: currency,
      //             email: ""
      //           };
      //         })
      //       : _map(Array.apply(null, { length: item }), (each, index) => {
      //           return {
      //             sessionId,
      //             hotelId,
      //             recommendationId: recomId,
      //             optionalDataPrefs: ["All"],
      //             currency: currency,
      //             email: ""
      //           };
      //         });
      //   });
      // };

      // if (dragItem.type == "hotel") {
      //   this.props.loadingGifSearch();

      //   // const recomId = item.bookingData.room[0].recommendations.id;
      //   const { hotelId, sessionId, currency } = dragItem.searchString;
      //   // const roomCount = item.bookingData.room[0].roomCount;
      //   let roomCount = [];
      //   let recomId = [];

      //   dragItem.bookingData.room.map((value, i) => {
      //     roomCount.push(value.roomCount);
      //     recomId.push(value.recommendations.id);
      //   });
      //   axios
      //     .post(
      //       URL.hotel.ROOM_PRICE,
      //       _flatMapDeep(
      //         payloadGenerate(sessionId, hotelId, currency, recomId, roomCount)
      //       )
      //     )
      //     .then(response => {
      //       this.props.stopGifSearching();
      //       console.log("response", response);
      //       const roomPriceInfo = response.data.data;
      //       let totalCost = _sumBy(
      //         _map(roomPriceInfo, (each, i) => each.totalAmount)
      //       ).toFixed(2);
      //       dragItem.totolCostIncTax = totalCost;
      //       this.props.addToItinerary(dragItem);

      //       setTimeout(() => {
      //         this.forceUpdate();
      //       }, 300);
      //     })
      //     .catch(err => {
      //       this.props.stopGifSearching();
      //     });
      // }

      // this.props.addToItinerary(dragItem);
      this.getPriceAPI(dragItem);
    }
  };

  onEmailSend = (nextProps) => {
    const { customEmail, customMarkup } = this.state;
    let payload = this.props.itineraryList;
    const userSession = JSON.parse(sessionStorage.getItem("loginInfo"));
    const email = userSession.email;
    const transfer = _filter(payload, function(each) {
      return each.type == "transferCar";
    });

    const car = _filter(payload, function(each) {
      return each.type == "car";
    });

    const hotel = _filter(payload, function(each) {
      return each.type == "hotel";
    });
    const activity = _filter(payload, function(each) {
      return each.type == "activity";
    });
    let filter;
    if (customEmail != "" && customMarkup != "") {
      if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(customEmail)) {
       let customEmailval = customEmail;
        filter = {
          hotel: hotel,
          car: car,
          transfer: transfer,
          activity: activity,
          email: customEmailval,
          markUp: Number(customMarkup)
        };
      } else {
        notify.show("Please Check your Email ", "error");
      }
    } else {
      notify.show("Please Check Email & Markup", "error");
    }
    console.log(filter);
    if (payload == undefined || payload.length == "0" || payload == null) {
      notify.show("Please add to your Itinerary", "error");
    } else {
       this.props.sendEmailToAgent(filter);

      //  if(nextProps.agentMailResult == true){
      //   notify.show("Mail Success", "success");
      //  }else if(nextProps.agentMailResult == false ){
      //   notify.show("Mail Unsuccess", "error");
      //  }

    }
  };
  onPassangerTypeChange(setValue) {
    this.setState(
      {
        isSameSetOfPassangers: setValue,
        isModal: false
      },
      () => {
        if (setValue == true) {
          if (this.props.itineraryList.length != 0) {
            let currency = this.props.itineraryList[0].bookingData.currency;
            if (
              currency.includes(this.state.currentDragItem.bookingData.currency)
            ) {
              this.getPriceAPI(this.state.currentDragItem);
              // this.props.addToItinerary(this.state.currentDragItem);
            } else {
              this.setState({
                passangerError: true,
                passangerErrorMessage:
                  "Different currency cannot be added in itinerary"
              });
              setTimeout(() => {
                this.setState({
                  passangerError: false,
                  passangerErrorMessage: ""
                });
              }, 6000);
            }
          } else {
            this.getPriceAPI(this.state.currentDragItem);
            // this.props.addToItinerary(this.state.currentDragItem);
          }
        } else {
          if (this.props.itineraryList.length != 0) {
            let currency = this.props.itineraryList[0].bookingData.currency;
            if (
              currency.includes(this.state.currentDragItem.bookingData.currency)
            ) {
              this.diffPassangersCheck(this.state.currentDragItem);
            } else {
              this.setState({
                passangerError: true,
                passangerErrorMessage:
                  "Different currency cannot be added in itinerary"
              });
              setTimeout(() => {
                this.setState({
                  passangerError: false,
                  passangerErrorMessage: ""
                });
              }, 4000);
            }
          } else {
            this.diffPassangersCheck(this.state.currentDragItem);
          }
        }
        this.setState({
          randomRender: Math.random()
        });
      }
    );
  }

  // componentWillUnmount() {

  // }

  agentEmailHandler = e => {
    const { value, name } = e.target;

    this.setState({
      [name]: value
    });
  };

  getPriceAPI = dragItem => {
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
    if (dragItem.type == "hotel") {
      this.props.loadingGifSearch();

      // const recomId = item.bookingData.room[0].recommendations.id;
      const { hotelId, sessionId } = dragItem.searchString;
      const currency = JSON.parse(localStorage.getItem("currency")).ABR_NAME;
      // const roomCount = item.bookingData.room[0].roomCount;
      let roomCount = [];
      let recomId = [];
      dragItem.bookingData.room.map((value, i) => {
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
          console.log("roomPriceInfo:::::::", roomPriceInfo)
          let totalCost = _sumBy(
            _map(roomPriceInfo, (each, i) => each.totalAmount)
          ).toFixed(2);
          let pricedTotalFare = _sumBy(
            _map(roomPriceInfo, (each, i) => each.pricedTotalFare)
          ).toFixed(2);
          // const taxFees = Number(totalCost) - Number(pricedTotalFare)

          let taxedAmount = _sumBy(
            _map(roomPriceInfo, (each, i) => each.taxedAmount)
          ).toFixed(2);
          let basedAmount = _sumBy(
            _map(roomPriceInfo, (each, i) => each.basedAmount)
          ).toFixed(2);
          let farebreakupAmount = _sumBy(
            _map(roomPriceInfo, (each, i) => each.farebreakupAmount)
          ).toFixed(2);
          let discountedAmount = _sumBy(
            _map(roomPriceInfo, (each, i) => each.discountedAmount)
          ).toFixed(2);
          console.log("taxedAmount::", taxedAmount, "typeof::", typeof taxedAmount)
          const taxFees = Number(taxedAmount)
          const baseAmount = Number(basedAmount)
          farebreakupAmount = Number(farebreakupAmount)
          discountedAmount =Number(discountedAmount)
          
          dragItem.taxFees = taxFees.toFixed(2)
          dragItem.bookingData.room.map((value, i) => {
            dragItem.bookingData.room[i].totalPriceIncTax = Number(totalCost);
            dragItem.bookingData.room[i].basedAmount = baseAmount.toFixed(2)
            dragItem.bookingData.room[i].farebreakupAmount = farebreakupAmount.toFixed(2)
            dragItem.bookingData.room[i].discountedAmount = discountedAmount.toFixed(2)
          });
          console.log("dragItem ? ", dragItem);
          this.props.addToItinerary(dragItem);

          setTimeout(() => {
            this.forceUpdate();
          }, 300);
        })
        .catch(err => {
          this.props.stopGifSearching();
        });
    } else {
      this.props.addToItinerary(dragItem);
    }
  };

  renderCar = item => {
    
    let taxFee = item && (item.bookingData.quotedTotalFare - item.bookingData.pricedTotalFare);
    return (
      <div>
        <h2>
          <img src={img_car} /> <span> {item.title}</span>
        </h2>
        <ul>
          <li>
            <img src={img_calender} />
          </li>
          <li>
            <div className="dateShow">
              <span>
                {moment(item.bookingData.carPickUpDate).format("MMM DD")}
              </span>
              <span>
                {moment(item.bookingData.carPickUpDate).format("ddd")}
              </span>
            </div>
            <div className="timeShow">
              <img src={img_Time} /> {item.bookingData.carPickUpTime}
            </div>
          </li>
          <li>
            <img src={img_DateArrow} />
          </li>
          <li>
            <div className="dateShow">
              <span>
                {moment(item.bookingData.carDropDate).format("MMM DD")}
              </span>
              <span>{moment(item.bookingData.carDropDate).format("ddd")}</span>
            </div>
            <div className="timeShow">
              <img src={img_Time} /> {item.bookingData.carDropTime}
            </div>
          </li>
        </ul>
        <ul className="rateShowTable">
          <li>
            <span>
              
              {moment(item.bookingData.carDropDate).diff(
                moment(item.bookingData.carPickUpDate),
                "days"
              )}{" "}
              days
            </span>{" "}
            <span>
              {currencies[item.bookingData.currency].symbol}
              {(
                +item.bookingData.pricedTotalFare 
              ).toFixed(2)}{" "}
              per day
            </span>
          </li>
          <li><span>Taxes & Fees</span> <span>{currencies[item.bookingData.currency].symbol} {taxFee.toFixed(2)}</span></li>
          <li>
            <span>Total</span>{" "}
            <span>
              {currencies[item.bookingData.currency].symbol} {item.bookingData.quotedTotalFare}
            </span>
          </li>
        </ul>
      </div>
    );
  };
  renderHotel = item => {
    console.log("hotelitem:::::::", item)
    let curFormat = JSON.parse(localStorage.getItem("currency"));
    if (curFormat !== null) {
      curFormat = curFormat.CURRENCY_FORMAT;
    } else {
      curFormat = "en-IN";
    }

    let itmPrice = item.price;
    itmPrice = new Intl.NumberFormat(curFormat, {
      minimumFractionDigits: 2
    }).format(itmPrice.toFixed(2));

    return (
      <div>
        <h2>
          <img src={img_hotel} /> <span> {item.title}</span>
        </h2>
        <ul>
          <li>
            <img src={img_calender} />
          </li>
          <li>
            <div className="dateShow">
              <span>{moment(item.searchString.checkin).format("MMM DD")}</span>
              <span>{moment(item.searchString.checkin).format("ddd")}</span>
            </div>
            <div className="timeShow">
              <img src={img_Time} />{" "}
              {item.bookingData.hotel.hasOwnProperty("checkinCheckoutPolicy") &&
              item.bookingData.hotel.checkinCheckoutPolicy.length > 0 &&
              (item.bookingData.hotel.checkinCheckoutPolicy[0].inTime &&
                item.bookingData.hotel.checkinCheckoutPolicy[0].outTime)
                ? item.bookingData.hotel.checkinCheckoutPolicy[0].inTime + 0
                : "12:00"}
            </div>
          </li>
          <li>
            <img src={img_DateArrow} />
          </li>
          <li>
            <div className="dateShow">
              <span>{moment(item.searchString.checkout).format("MMM DD")}</span>
              <span>{moment(item.searchString.checkout).format("ddd")}</span>
            </div>
            <div className="timeShow">
              <img src={img_Time} />{" "}
              {item.bookingData.hotel.hasOwnProperty("checkinCheckoutPolicy") &&
              item.bookingData.hotel.checkinCheckoutPolicy.length > 0 &&
              (item.bookingData.hotel.checkinCheckoutPolicy[0].outTime &&
                item.bookingData.hotel.checkinCheckoutPolicy[0].inTime)
                ? item.bookingData.hotel.checkinCheckoutPolicy[0].outTime + 0
                : "06:00"}
            </div>
          </li>
        </ul>
        <ul className="rateShowTable">
          {item.bookingData.room.map((value, index) => {
            // let bseFare = +value.baseFare / +item.bookingData.bookingDays;
            let roomCnt =  value.roomCount;
            let totalBaseFare = (Number(value.basedAmount))
            console.log("value::", totalBaseFare)
            let bseFare = (Number(totalBaseFare));
            bseFare = new Intl.NumberFormat(curFormat, {
              minimumFractionDigits: 2
            }).format(bseFare.toFixed(2));
            let taxes =  (Number(value.farebreakupAmount) + Number(item.taxFees));
            taxes = new Intl.NumberFormat(curFormat, {
              minimumFractionDigits: 2
            }).format(taxes.toFixed(2));
            let xenidiscount = (Number(value.discountedAmount));

            console.log("xenidiscount", xenidiscount)
            return (
              <span>
              <li>
                <span>
                  {value.name} <strong>X</strong> {roomCnt}Rooms
                </span>{" "}
                <span>
                  {currencies[item.bookingData.currency].symbol} {bseFare}
                  /Night
                </span>
              </li>
              <li style={{borderTop: "none"}}>
              <span style={{fontWeight: "normal"}}>
                {"Taxes & Fees"}
              </span>{" "}
              <span style={{fontWeight: "normal"}}>
                {currencies[item.bookingData.currency].symbol} {taxes}
              </span>
            </li>
            { 
             xenidiscount ? 
            <li style={{borderTop: "none"}}>
              <span style={{fontWeight: "normal"}}>
                {"Xeniapp Discount"}
              </span>{" "} 
              <span style={{fontWeight: "normal"}}>
                <span style={{fontWeight: "bold"}}>-</span>&nbsp; 
                {currencies[item.bookingData.currency].symbol} {xenidiscount.toFixed(2)}
              </span>
            </li> : null
            }
            </span>
            );
          })}
          <li>
            <span>Total</span>{" "}
            <span>
              {currencies[item.bookingData.currency].symbol}
              {/* {item.price} */}
              {itmPrice}
            </span>
          </li>
        </ul>
      </div>
    );
  };

  renderTransfer = item => {
    console.log("transferitem:::::::::", item)
    return (
      <div>
        <h2>
          <img src={img_transfer} /> <span>{item.bookingData.car_model}</span>
        </h2>
        <ul>
          <li>
            <img src={img_calender} />
          </li>
          <li>
            <div className="dateShow">
              <span>
                {moment(item.bookingData.start_time_date).format("DD MMM")}
              </span>
              <span>
                {moment(item.bookingData.start_time_date).format("ddd")}
              </span>
            </div>
            <div className="timeShow">
              <img src={img_Time} />
              {item.bookingData.pickUpTime}
            </div>
          </li>
          <li>
            <img src={img_DateArrow} />
          </li>
          <li>
            <div className="dateShow">
              <span>
                {moment(item.bookingData.start_time_date).format("DD MMM")}
              </span>
              <span>
                {moment(item.bookingData.start_time_date).format("ddd")}
              </span>
            </div>
            <div className="timeShow">
              <img src={img_Time} />
              {item.bookingData.dropOffTime}
            </div>
          </li>
        </ul>
        <ul className="rateShowTable">
        <li>
                  <span>1 Day</span>
                  <span>
                    {" "}
                    {currencies[item.bookingData.currency].symbol} {item.bookingData.regular_price}
                  </span>
                </li>
                <li>
                  <span>Taxes & Fees</span>
                  <span>
                    {currencies[item.bookingData.currency].symbol}{" "}
                    {(
                      item.bookingData.totalAmount - item.bookingData.regular_price
                    ).toFixed(2)}
                  </span>
                </li>
          {/* <li><span>Taxes & Fees</span> <span>$0</span></li> */}
          <li>
            <span>Total</span>{" "}
            <span>
              {item.type != "transferCar"
                ? currencies[item.bookingData.currency].symbol
                : item.bookingData.currency_symbol}

              {item.bookingData.totalAmount}
            </span>
          </li>
        </ul>
      </div>
    );
  };

  renderActivity = item => {
  
    const date =new Date(item.bookingData.location.date)
    
    let totalTravellers = 0;
    let traveller = _map(item.activityList.ageBands, ({ count, bandId }, i) => {
      let travellerType = "";
      let separation = "";
      _forEach(item.selectedActivityInfo.ageBands, value => {
        if (value.bandId === bandId) {
          travellerType = value.description;
        }
      });

      if (i >= 1 && i < item.activityList.ageBands.length) {
        separation = ", ";
      }
      totalTravellers += count;
      return ` ${count} ${travellerType}${separation} `;
    });
    return (
      <div>
        <h2>
          <img src={img_activities} />{" "}
          <span>{item.selectedActivityInfo.city}</span>
        </h2>
        <ul>
          <li>
            <div className="timeShow">
              <img src={img_Time} style={{ width: "14px" }} />
              <i
                class="fas fa-minus"
                style={{ fontSize: "8px", margin: "0px 5px" }}
              ></i>{" "}
              <span style={{ fontSize: "11px" }}>
                {item.selectedActivityInfo.duration}
              </span>
            </div>
          </li>
          <li style={{ float: "right" }}>
            <div className="dateShow" style={{ width: "100%" }}>
              <span>Travel Date</span>
              <span style={{ fontSize: "12px" }}>
                {moment(date, "mm/dd/yyyy").format("dddd")}
              </span>
              <span>{moment(date, "mm/dd/yyyy").format("MMM D, YYYY")}</span>
            </div>
            {/* <div className="timeShow">
              <img src={img_Time} />
             { item.bookingData.location.date}
            </div> */}
          </li>
        </ul>
        <div style={{ clear: "both" }}></div>
        <ul className="rateShowTable">
          {/* <li>
            <span>
              {moment(item.bookingData.start_time_date).diff(
                moment(item.bookingData.start_time_date),
                "days"
              )}{" "}
              days
            </span>{" "}
            <span>
              {(
                +item.bookingData.carRental.fare.displayFare.totalFare /
                moment(item.bookingData.start_time_date).diff(
                  moment(item.bookingData.start_time_date),
                  "days"
                )
              ).toFixed(2)}{" "}
              per day
            </span>
          </li> */}

          <li>
            <span>{traveller} </span>{" "}
            <span>
              {currencies[item.bookingData.currency].symbol}{" "}
              {Number(item.bookingData.activityList.merchantNetPrice).toFixed(
                2
              )}
            </span>
          </li>
          <li>
            <span>{"Taxes & Fees"}</span>{" "}
            <span>
              {currencies[item.bookingData.currency].symbol}{" "}
              {(
                Number(item.bookingData.activityList.retailPrice) -
                Number(item.bookingData.activityList.merchantNetPrice)
              ).toFixed(2)}
            </span>
          </li>
          <li>
            <span>Total</span>{" "}
            <span>
              {currencies[item.bookingData.currency].symbol}

              {Number(item.bookingData.activityList.retailPrice).toFixed(2)}
            </span>
          </li>
        </ul>
      </div>
    );
  };

  render() {
    const { connectDropTarget, isOver, canDrop, itineraryList } = this.props;
    const { isExpand } = this.state;
   
    const selectedCurrencyVal =
      this.props.selectedCurrency &&
      currencies[this.props.selectedCurrency].symbol;
    // const totalPrice = Math.round(_sumBy(itineraryList, 'price'))
    //  const totalPrice=     _sumBy(itineraryList, function(o) { return +o.price })

    let curFormat = JSON.parse(localStorage.getItem("currency"));
    if (curFormat !== null) {
      curFormat = curFormat.CURRENCY_FORMAT;
    } else {
      curFormat = "en-IN";
    }
    let totAmount = _sumBy(itineraryList, "price");
    totAmount = new Intl.NumberFormat(curFormat, {
      minimumFractionDigits: 2
    }).format(totAmount.toFixed(2));

    return connectDropTarget(
      <div>
        {this.state.randomRender && (
          <div
            className={
              isExpand
                ? "rightSide align-self-start leftItinerayShow "
                : "rightSide align-self-start"
            }
          >
            {/* <div
              style={{
                position: "fixed",
                background: "#00000087",
                padding: "2px",
                width: "fit-content",
                bottom: "25%",
                height: "auto",
                right: "22%",
                zIndex: "4",
                borderRadius: "3px"
              }}
            >
              <div
                style={{
                  bottom: "250px",
                  right: "290px",
                  background: "white",
                  padding: "25px"
                }}
              >
                <div>
                  <div>
                    <p>Email</p>
                    <p>
                      {" "}
                      <div className="form-group">
                        <input type="text" />
                      </div>
                    </p>
                  </div>
                  <div>
                    <p>Markup</p>
                    <div className="form-group">
                      <input type="Number" />
                    </div>
                  </div>
                </div>
                <div
                  class="triangle-right"
                  style={{
                    width: "0",
                    height: "0",
                    borderTop: "15px solid transparent",
                    borderLeft: "25px solid rgba(0, 0, 0, 0.63)",
                    borderBottom: "15px solid transparent",
                    position:"absolute",
                    right:"-24px",
                    bottom:"1px"
                  }}
                ></div>
              </div>
            </div> */}
            <div
              className="itineraryResponsiveBtn"
              onClick={() => this.setState({ isExpand: !isExpand })}
            >
              YOUR ITINERARY
            </div>
            <h4 className="rightHeadText">YOUR ITINERARY</h4>
<div className="ScrollingBar">
            <div className="itineraryBoxDesign">
              <img src={itinerary} alt="" />
            </div>

            <div className="itineraryItems">
              {this.state.wishListSaveAlert == true && (
                <span style={{ color: "green" }}>
                  <center>
                    <strong>&#10003; Added to wishlist</strong>
                  </center>
                </span>
              )}
              {this.state.passangerError == true && (
                <span className="itineraryError">
                  <center>
                    <strong> {this.state.passangerErrorMessage} </strong>
                  </center>
                </span>
              )}
              <img
                src={img_DragDrop}
                className={
                  !itineraryList.length
                    ? canDrop
                      ? "dragDropImage is-ready"
                      : "dragDropImage"
                    : "dragDropImage is-hidden"
                }
                alt=""
              />
              <ul className="itinerarySelItems">
                {_map(itineraryList, (item, index) => {
                  let displayImg;
                  let displayView;
                  let title;
                  if (item.type == "activity") {
                    title = item.selectedActivityInfo.productUrlName;
                  }
                  if (item.type == "car") {
                    displayImg = img_car;
                    displayView = this.renderCar(item);
                  } else if (item.type == "hotel") {
                    displayImg = img_hotel;
                    displayView = this.renderHotel(item);
                  } else if (item.type == "transferCar") {
                    displayImg = img_transfer;
                    displayView = this.renderTransfer(item);
                  } else if (item.type == "activity") {
                    displayImg = img_activities;
                    displayView = this.renderActivity(item);
                  }

                  let collpseIti = this.state.collpseIti;
                  if (!collpseIti["itinerary" + index]) {
                    collpseIti["itinerary" + index] = false;
                  }

                  let itmPrice = item.price;
                  itmPrice = new Intl.NumberFormat(curFormat, {
                    minimumFractionDigits: 2
                  }).format(itmPrice.toFixed(2));

                  return (
                    <li key={index}>
                      <div className="itineraryTitle">
                        <div>
                          <a>
                            {" "}
                            <img src={displayImg} alt="" />
                          </a>
                          <h4
                            title={item.type != "activity" ? item.title : title}
                          >
                            {/* {item.type.toUpperCase()} - */}
                            {item.type != "activity" ? item.title : title}
                            <span style={__titleStyle} title={item.subtitle}>
                              {item.subtitle}
                            </span>
                            {/* <span style={__titleStyle} title= {item.subtitle}>
                      {item.subtitle} <img src={img_DateArrow} alt="" /> IAH
                    </span> */}
                          </h4>
                          <span>
                            {item.type != "transferCar"
                              ? currencies[item.bookingData.currency].symbol
                              : item.bookingData.currency_symbol}{" "}
                            {/* {item.price} */}
                            {itmPrice}
                          </span>
                        </div>
                        <a
                          href="#"
                          className="closeBtn"
                          onClick={() => {
                            if (
                              window.confirm("Are sure want to remove this ? ")
                            ) {
                              this.handleRemoveItinerary(item);
                            }
                          }}
                        >
                          {/* onClick={() => this.handleRemoveItinerary(item)} */}
                          <i className="fas fa-times" />
                        </a>
                        {/* <div
                          style={{
                            position: "fixed",
                            top: "11px",
                            left: "50%"
                          }}
                        >
                          <Card>
                            <div style={{ padding: "25px" }}>
                              Are you sure want to remove this ?
                            </div>

                            <span>
                              <button
                                style={{
                                  float: "right",
                                  width: "70px",
                                  border: "0",
                                  borderRadius: "5px",
                                  margin: "9px"
                                }}
                              >
                                ok
                              </button>
                            </span>
                          </Card>
                        </div> */}
                        <div
                          className="expandIcon"
                          onClick={() => {
                            let collpseIti = this.state.collpseIti;
                            collpseIti["itinerary" + index] = !collpseIti[
                              "itinerary" + index
                            ];
                            this.setState({ collpseIti });
                          }}
                        >
                          <img src={img_ItineraryExpanded} alt="" />
                        </div>
                      </div>
                      <Collapse
                        isOpen={this.state.collpseIti["itinerary" + index]}
                        className="itineraryCollapsecontent"
                      >
                        <Card>
                          <CardBody className="">{displayView}</CardBody>
                        </Card>
                      </Collapse>
                    </li>
                  );
                })}
              </ul>
            </div>
            <h2 className="itineraryTotal">
              Total :{" "}
              {itineraryList.length != 0
                ? itineraryList[0].type === "transferCar"
                  ? currencies[itineraryList[0].bookingData.currency_code]
                      .symbol
                  : currencies[itineraryList[0].bookingData.currency].symbol
                : selectedCurrencyVal}{" "}
              {totAmount}
            </h2>
            <div className="itineraryBtns">
              <div>
                <button
                  type="button"
                  onClick={this.onSaveHandle}
                  className="searchBtn itinerarySave mr-1"
                >
                  Save <i className="far fa-thumbs-up" />
                </button>
                <button
                  type="button"
                  className="searchBtn itineraryBook"
                  onClick={() => {
                    let currency;
                    if (itineraryList && itineraryList.length != 0) {
                      currency = itineraryList[0].bookingData.currency;
                    } else {
                      currency = this.props.selectedCurrency;
                    }
                    if (itineraryList.length != 0) {
                      this.props.history.push("/hotel/multiplebooking");
                    } else {
                      this.setState({
                        passangerError: true,
                        passangerErrorMessage: "No items added to itinerary"
                      });

                      setTimeout(() => {
                        this.setState({
                          passangerError: false,
                          passangerErrorMessage: ""
                        });
                      }, 4000);
                    }
                  }}
                >
                  Book <i className="fas fa-check" />
                </button>
              </div>
              {this.props.isTravelAgent && (
                <div style={{ margin: "12px 0px 0px 0px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (this.props.itineraryList.length != 0) {
                        document.getElementById("agentPop").style.display =
                          "block";
                      } else {
                        notify.show("Please add to your Itinerary", "error");
                      }
                    }}
                    style={{
                      background: "#b32123",
                      color: "#ffffff",
                      border: "1px solid #9a968a"
                    }}
                    className="searchBtn itineraryEmail mr-1"
                  >
                    EMAIL <i className="far fa-envelope" />
                  </button>
                  <div
                    id="agentPop"
                    style={{
                      position: "absolute",
                      background: "#00000087",
                      padding: "2px",
                      width: "fit-content",
                      bottom: "3%",
                      height: "auto",
                      right: "85%",
                      zIndex: "4",
                      borderRadius: "3px",
                      display: "none"
                    }}
                  >
                    <div
                      style={{
                        bottom: "250px",
                        right: "290px",
                        background: "white",
                        padding: "25px"
                      }}
                    >
                      <div style={{ padding: "10px" }}>
                        <div
                          class="close"
                          style={{
                            height: "30px",
                            width: "30px",
                            backgroundColor: "black",
                            borderRadius: "10%",
                            position: "absolute",
                            right: "0",
                            top: "0"
                          }}
                          onClick={() =>
                            (document.getElementById("agentPop").style.display =
                              "none")
                          }
                        >
                          <p>x</p>
                        </div>
                        <div>
                          <div className="form-group">
                            <p style={{ textAlign: "left", display: "flex" }}>
                              Email
                              <input
                                name="customEmail"
                                value={this.state.customEmail}
                                onChange={this.agentEmailHandler}
                                type="text"
                                placeholder="  Enter Email"
                                style={{ width: "230px", marginLeft: "32px" }}
                              />
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className="form-group">
                            <p style={{ textAlign: "left" }}>
                              Markup
                              <input
                                name="customMarkup"
                                value={this.state.customMarkup}
                                onChange={this.agentEmailHandler}
                                type="Number"
                                style={{ width: "100px", marginLeft: "15px" }}
                              />
                            </p>
                          </div>
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            right: "10px",
                            bottom: "10px"
                          }}
                        >
                          <button
                            onClick={this.onEmailSend}
                            style={{
                              background: "rgb(179, 33, 35)",
                              color: "rgb(255, 255, 255)",
                              border: "1px solid rgb(154, 150, 138)",
                              borderRadius: "4px",
                              fontSize: "13px",
                              textTransform: "uppercase",
                              fontWeight: "600",
                              padding: "6px 18px"
                            }}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                      <div
                        class="triangle-right"
                        style={{
                          width: "0",
                          height: "0",
                          borderTop: "7px solid transparent",
                          borderLeft: "11px solid rgba(0, 0, 0, 0.63)",
                          borderBottom: "7px solid transparent",
                          position: "absolute",
                          right: "-13px",
                          bottom: "2px"
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        )}

        {this.state.isModal === true && (
          <div
            className="modal backgroundDark"
            id="myModal"
            style={{ display: "block" }}
          >
            <div className="modal-dialog signInPopup" style={{ top: "15%" }}>
              <div className="modal-content" style={{ borderRadius: "6px" }}>
                <div className="modal-body paymentError">
                  <div className="socialBtnGroup" />
                  <h5
                    style={{
                      fontWeight: "300",
                      color: "#464646",
                      padding: "20px 0px"
                    }}
                  >
                    <i class="fas fa-info-circle mr-1" />
                    Are you Booking for same set of passengers?
                  </h5>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="goBack mr-2 bg-success"
                      onClick={this.onPassangerTypeChange.bind(this, true)}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="goBack bg-danger"
                      onClick={this.onPassangerTypeChange.bind(this, false)}
                    >
                      No,Different Passengers
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const __handleDrop = {
  canDrop: (props, monitor) => {
    const item = monitor.getItem();

    // component.setState({
    //   currentDragItem: monitor.getItem()
    // })
    return true;
  },

  hover: (props, monitor, component) => {},

  drop: (props, monitor, component) => {
    let emailDetails = props.itineraryList;
    console.log(emailDetails);
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    // const payloadGenerate = (
    //   sessionId,
    //   hotelId,
    //   currency,
    //   recomId,
    //   roomCount
    // ) => {
    //   return _map(roomCount, (item, i) => {
    //     return typeof recomId == "object"
    //       ? _map(Array.apply(null, { length: item }), (each, index) => {
    //           return {
    //             sessionId,
    //             hotelId,
    //             recommendationId: recomId[i],
    //             optionalDataPrefs: ["All"],
    //             currency: currency,
    //             email: ""
    //           };
    //         })
    //       : _map(Array.apply(null, { length: item }), (each, index) => {
    //           return {
    //             sessionId,
    //             hotelId,
    //             recommendationId: recomId,
    //             optionalDataPrefs: ["All"],
    //             currency: currency,
    //             email: ""
    //           };
    //         });
    //   });
    // };

    let item = monitor.getItem();
    // if (item.type == "hotel") {
    //   props.loadingGifSearch();

    //   // const recomId = item.bookingData.room[0].recommendations.id;
    //   const { hotelId, sessionId, currency } = item.searchString;
    //   // const roomCount = item.bookingData.room[0].roomCount;
    //   let roomCount = [];
    //   let recomId = [];

    //   item.bookingData.room.map((value, i) => {
    //     roomCount.push(value.roomCount);
    //     recomId.push(value.recommendations.id);
    //   });
    //   axios
    //     .post(
    //       URL.hotel.ROOM_PRICE,
    //       _flatMapDeep(
    //         payloadGenerate(sessionId, hotelId, currency, recomId, roomCount)
    //       )
    //     )
    //     .then(response => {
    //       props.stopGifSearching();
    //       console.log("response", response);
    //       const roomPriceInfo = response.data.data;
    //       let totalCost = _sumBy(
    //         _map(roomPriceInfo, (each, i) => each.totalAmount)
    //       ).toFixed(2);
    //       let newIti = props.itineraryList.map(listData => {
    //         let newListItem = listData;
    //         if (listData.type == "hotel") {
    //           if (listData.bookingData.hotel.id == roomPriceInfo[0].hotel.id) {
    //             newListItem.price = +totalCost;
    //           }
    //         }
    //         return newListItem;
    //       });
    //       props.replaceItinerary(newIti);
    //     })
    //     .catch(err => {
    //       props.stopGifSearching();
    //     });
    // }

    component.setState(
      {
        currentDragItem: monitor.getItem()
      },
      async () => {
        if (props.itineraryList.length == 0) {
          component.setState({ collpseIti: {} });
          component.getPriceAPI(item);
          // props.addToItinerary(item);
        } else if (props.itineraryList.length == 1) {
          let dataFindHotel;
          if (item.type == "hotel") {
            dataFindHotel = props.itineraryList.find(data => {
              if (data.type == "hotel") {
                return data.bookingData.hotel.id == item.bookingData.hotel.id;
              }
            });
          }

          if (!dataFindHotel) {
            // await component.setState({
            //   isModal: true
            // });
            await component.onPassangerTypeChange(true);
          }
        }
        if (
          component.state.isSameSetOfPassangers == true &&
          component.state.isModal == false
        ) {
          if (props.itineraryList.length != 0) {
            let currency = props.itineraryList[0].bookingData.currency;
            if (currency.includes(item.bookingData.currency)) {
              component.getPriceAPI(item);
              // props.addToItinerary(item);
            } else {
              component.setState({
                passangerError: true,
                passangerErrorMessage:
                  "Different currency cannot be added in itinerary"
              });
              setTimeout(() => {
                component.setState({
                  passangerError: false,
                  passangerErrorMessage: ""
                });
              }, 4000);
            }
          } else {
            component.getPriceAPI(item);
            // props.addToItinerary(item);
          }
        } else if (
          component.state.isSameSetOfPassangers == false &&
          component.state.isModal == false
        ) {
          if (props.itineraryList.length != 0) {
            let currency = props.itineraryList[0].bookingData.currency;
            if (currency.includes(item.bookingData.currency)) {
              component.diffPassangersCheck(item);
            } else {
              component.setState({
                passangerError: true,
                passangerErrorMessage:
                  "Different currency cannot be added in itinerary"
              });
              setTimeout(() => {
                component.setState({
                  passangerError: false,
                  passangerErrorMessage: ""
                });
              }, 4000);
            }
          } else {
            component.diffPassangersCheck(item);
          }
        }
      }
    );
    return { moved: true };
  }
};
const __collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
};

const mapStateToProps = state => ({
  itineraryList: state.addcartReducer.itineraryList,
  loginDetails: state.loginReducer.loginDetails,
  wishlistStatus: state.addcartReducer.wishlistStatus,
  selectedCurrency: state.commonReducer.selectedCurrency,
  emailDetailsForAgent: state.addcartReducer.emailDetailsForAgent,
  isTravelAgent: state.dashboardReducer.isTravelAgent,
  agentMailResult:state.addcartReducer.agentMailResult
});

const mapDispatchToProps = dispatch => ({
  addToItinerary: itPay => dispatch(addItinerary(itPay)),
  removeFromItinerary: itPay => dispatch(removeItinerary(itPay)),
  saveWishList: payload => dispatch(saveWishList(payload)),
  loadingGifSearch: () => dispatch(loadingGifSearch()),
  stopGifSearching: () => dispatch(stopGifSearching()),
  replaceItinerary: data => dispatch(replaceItinerary(data)),
  sendEmailToAgent: payload => dispatch(sendEmailToAgent(payload))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DropTarget("ROOM", __handleDrop, __collect)(Itinerary))
);

const __titleStyle = {
  width: "71px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
};
