import React, { Component } from "react";
import { Collapse, Button, CardBody, Card } from "reactstrap";
import DBWishListCarContent from "./DBWishListCarContent";
import DBWishListHotelContent from "./DBWishListHotelContent";
import DBWishListFlightContent from "./DBWishListFlightContent";
import img_Road from "../../../asset/images/Road-GraphicWish.png";
import openTab from "../../../asset/images/dashboard/resize.png";
import img_delete from "../../../asset/images/delete.png";
import img_edit from "../../../asset/images/pencil.png";
import img_Expanded from "../../../asset/images/Itinerary-Expanded-Lines.png";
import img_Time from "../../../asset/images/Time.svg";
import img_calender from "../../../asset/images/dashboard/calender.png";
import img_flight from "../../../asset/images/New folder/plane.png";
import img_car from "../../../asset/images/New folder/car.png";
import img_transfer from "../../../asset/images/New folder/chauffeur.png";
import img_hotel from "../../../asset/images/New folder/hotel-building.png";
import img_activies from "../../../asset/images/New folder/activities.png";
import img_DateArrow from "../../../asset/images/Date Arrow.png";
import img_Arrival from "../../../asset/images/Arrival.svg";
import img_Departure from "../../../asset/images/Departure.svg";
import img_thumb from "../../../asset/images/dashboard/thumb-up-sign.png";
import img_tick from "../../../asset/images/dashboard/checked.png";
import img_extrabed from "../../../asset/images/selectRoom/extrabed.png";
import { connect } from "react-redux";

import { viewWishList } from "../../../service/addCart/action";
import queryString from "query-string";
import moment from "moment";
import URL from "../../../asset/configUrl";
import axios from "../../../Utils/request-process";
var currencies = require("country-data").currencies;

const TYPE_OF_VIEW = {
  FLIGHT: "FLIGHT",
  HOTEL: "HOTEL",
  CAR: "CAR",
  ACTIVITIES: "ACTIVITIES",
  PRIVATE: "PRIVATE"
};
class DBWishList extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: {}, allPrice: {} };
  }

  componentDidMount() {
    if (this.props.loginDetails) {
      const { email } = this.props.loginDetails;
      this.props.getWishList(email);
    }
  }
  componentWillReceiveProps(nextProps, prevProps) {
    window.scrollTo(0,0);
    if (nextProps.wishList != prevProps.wishList) {
      console.log("newwwwwwwwwwwwwwwwwwww", nextProps.wishList);
      //   nextProps.wishList.map((value, index) => {
      //       if (document.getElementById("wish" + index)) {
      //           document.getElementById("wish" + index).value = value.price
      //       }
      //   })
    }
  }
  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  state = {
    typeofView: TYPE_OF_VIEW["FLIGHT"]
  };
  handleCar = value => {
    this.setState({
      typeOfView: TYPE_OF_VIEW[value]
    });
  };

  onNamePriceChange(wishlistData, e) {
    let allPrice = Object.assign({}, this.state.allPrice);
    wishlistData.price = e.target.value;
    allPrice[e.target.name] = wishlistData;
    this.setState(
      {
        allPrice
      },
      () => {
        console.log("data", this.state);
      }
    );
  }

  renderCar = (carData, index) => {
    const selectedCurrencyVal = currencies[this.props.selectedCurrency].symbol;
    return (
      <div>
        <div className="wishListCard">
          <div className="wishListCardTitle">
            <span>
              {" "}
              <img src={img_car} />
            </span>
            <h3>Cars</h3>
          </div>
          <div className="wishListCardBody">
            <h3>
              <img src={img_car} alt="hotel" />
              {carData.bookingData.vehicle.name}
            </h3>
            <ul className="commonPickDrop">
              <li>
                {" "}
                <img src={img_calender} />{" "}
              </li>
              <li>
                <span className="bordered">
                  <b>
                    {moment(carData.searchString.carPickUpDate).format(
                      "MMM DD"
                    )}
                  </b>{" "}
                  <small>
                    {moment(carData.searchString.carPickUpDate).format("dddd")}
                  </small>
                </span>
                <span className="commonTime">
                  <img src={img_Time} />{" "}
                  {moment(carData.searchString.carPickUpTime, "hh:mm").format(
                    "LT"
                  )}
                </span>
              </li>
              <li>
                <img src={img_DateArrow} alt="arrow" />{" "}
              </li>
              <li>
                <span className="bordered">
                  <b>
                    {moment(carData.searchString.carDropDate).format("MMM DD")}
                  </b>{" "}
                  <small>
                    {moment(carData.searchString.carDropDate).format("dddd")}
                  </small>
                </span>
                <span className="commonTime">
                  {" "}
                  <img src={img_Time} />{" "}
                  {moment(carData.searchString.carDropTime, "hh:mm").format(
                    "LT"
                  )}
                </span>
              </li>
            </ul>
            {/* <ul className="totalAmount">
               <li>
                
                <span><b className="d-block">ADD ON</b>GPS Navigational Device</span> <span> $104.00</span></li>
              <li><span>Passenger</span> <span>2</span></li>
              <li><span>Taxs & Fees</span> <span>$22.02</span></li> 
              <li><span>Total Cost</span> <span>$450.02</span></li>
            </ul> */}
          </div>
        </div>

        <div className="wishListNameYour">
          <h5>Name Your Price</h5>
          <div className="priceRate">
            {" "}
            {selectedCurrencyVal}{" "}
            <input
              type="number"
              id={"wish" + index}
              name={index}
              onChange={this.onNamePriceChange.bind(this, carData)}
            />
          </div>
        </div>
      </div>
    );
  };

  renderHotel = (hotelData, index) => {
    const selectedCurrencyVal = currencies[this.props.selectedCurrency].symbol;
    return (
      <div>
        <div className="wishListCard">
          <div className="wishListCardTitle">
            <span>
              {" "}
              <img src={img_hotel} />
            </span>
            <h3>Hotel</h3>
          </div>
          <div className="wishListCardBody">
            <h3>
              <img src={img_hotel} alt="hotel" /> {hotelData.title}
            </h3>
            <h3>
              <img
                style={{ padding: "5px 0" }}
                src={img_extrabed}
                alt="room-type"
              />{" "}
              {hotelData.bookingData.room[0].name}
            </h3>
            <ul className="commonPickDrop">
              <li>
                {" "}
                <img src={img_calender} />{" "}
              </li>
              <li>
                <span className="bordered">
                  <b>
                    {moment(hotelData.searchString.checkin).format("MMM DD")}
                  </b>{" "}
                  <small>
                    {moment(hotelData.searchString.checkin).format("dddd")}
                  </small>
                </span>
                {/* <span className="commonTime"><img src={img_Time} />  12.00pm</span>  */}
              </li>
              <li>
                <img src={img_DateArrow} alt="arrow" />{" "}
              </li>
              <li>
                <span className="bordered">
                  <b>
                    {moment(hotelData.searchString.checkout).format("MMM DD")}
                  </b>{" "}
                  <small>
                    {moment(hotelData.searchString.checkout).format("dddd")}
                  </small>
                </span>
                {/* <span className="commonTime"><img src={img_Time} />  12.00pm</span>  */}
              </li>
            </ul>
            {/* <ul className="totalAmount">
                                  <li>
                                    <span>GPS Navigational Device</span> <span> $104.00</span></li>
                                  <li><span>Passenger</span> <span>2</span></li>
                                  <li><span>Taxs & Fees</span> <span>$22.02</span></li>
                                  <li><span>Total Cost</span> <span>$450.02</span></li>
                                </ul> */}
          </div>
        </div>
        <div className="wishListNameYour">
          <h5> Name Your Price </h5>
          <div className="priceRate">
            {" "}
            {selectedCurrencyVal}{" "}
            <input
              type="number"
              id={"wish" + index}
              name={index}
              onChange={this.onNamePriceChange.bind(this, hotelData)}
            />
          </div>
        </div>
      </div>
    );
  };

  renderFlight = () => {
    return (
      <div>
        <div className="wishListCard">
          <div className="wishListCardTitle">
            <span>
              {" "}
              <img src={img_flight} />
            </span>
            <h3>Flight</h3>
          </div>
          <div className="wishListCardBody">
            <ul className="FlightStatus borderbtm">
              <li>
                <span className="flightDet">
                  <img src={img_Departure} /> Frt,Oct 17
                </span>
                <span className="flightInfo">
                  <img src={img_Time} />{" "}
                  <span className="bordered">
                    5.39pm <small>Steward Intl(SWF)</small>
                  </span>
                </span>
              </li>
              <li>
                <img src={img_DateArrow} alt="arrow" />{" "}
              </li>
              <li>
                <span className="flightDet">
                  <small>(1 Stop) </small> 5h 52m
                </span>
                <span className="flightInfo">
                  {" "}
                  <span className="bordered">
                    10.39pm <small>George Bush Intl(IAH)</small>
                  </span>
                </span>
              </li>
            </ul>
            <ul className="FlightStatus">
              <li>
                <span className="flightDet">
                  <img src={img_Arrival} /> Frt,Oct 17
                </span>
                <span className="flightInfo">
                  <img src={img_Time} />{" "}
                  <span className="bordered">
                    5.39pm <small>Steward Intl(SWF)</small>
                  </span>
                </span>
              </li>
              <li>
                <img src={img_DateArrow} alt="arrow" />{" "}
              </li>
              <li>
                <span className="flightDet">
                  <small>(1 Stop) </small> 5h 52m
                </span>
                <span className="flightInfo">
                  <span className="bordered">
                    10.39pm <small>George Bush Intl(IAH)</small>
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        {/* <div className="wishListNameYour">
                            <h5>Name Your Price</h5>
                            <div className="priceRate"> $ <input type="text" /></div>
                        </div> */}
      </div>
    );
  };
  renderTransfer = (transferData,index) => {
    return (
      <div>
        <div className="wishListCard">
          <div className="wishListCardTitle">
            <span>
              {" "}
              <img src={img_transfer} />
            </span>
            <h3>Transfer</h3>
          </div>
          <div className="wishListCardBody" id="transferDashboard">
            <h3>
              <img src={img_transfer} alt="hotel" />
              {transferData.title}
            </h3>
            <ul class="checkInOut">
              <li>
                <img src="http://176.9.117.149:2517/images/Time.svg" />
                <span>
                  Pick Up<b>{transferData.bookingData.pickUpTime} </b>
                </span>
              </li>
              <li>
                <img src="http://176.9.117.149:2517/images/Time.svg" />
                <span>
                  Drop Off<b>{transferData.bookingData.dropOffTime}</b>
                </span>
              </li>
            </ul>
            <ul class="carInfraStru">
              <li>
                <img src="https://dev.xeniapp.com/b4073c4cef0c704aeefc760c12de78cc.png" />
                {transferData.bookingData.passengers}
              </li>

              <li>
                <img
                  src="https://dev.xeniapp.com/0dfb77e3dbde93a4acc026be0fc4e483.png"
                  style={{ width: "10px" }}
                />
               {transferData.bookingData.luggage}
              </li>
            </ul>

            <ul className="totalAmount">
              <li>
                <span>Passenger</span> <span>{transferData.bookingData.passengers}</span>
              </li>
              <li>
                <span>1 Day</span> <span>{transferData.bookingData.regular_price}</span>
              </li>
              <li>
                <span>Taxs & Fees</span> <span>{transferData.bookingData.xeni_service_charges}</span>
              </li>
                <li>
                <span>Total Cost</span> <span>{transferData.bookingData.currency_symbol}{transferData.bookingData.totalAmount}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };
  renderActivities = (activityData,index) => {
    return (
      <div>
        <div className="wishListCard">
          <div className="wishListCardTitle">
            <span>
              {" "}
              <img src={img_activies} />
            </span>
            <h3>Activities</h3>
          </div>
          <div className="wishListCardBody">
            <h3>
              <img src={img_activies} alt="hotel" />
            {activityData.title}
            </h3>
            <ul className="commonPickDrop">
              <li>
                {" "}
                <img src={img_calender} />{" "}
              </li>
              <li>
              <span className="bordered" style={{fontSize: "13px",borderBottom:"none"}}><b>Travel Date</b></span><span className="bordered">{activityData.bookingData.activityList.bookingDate}</span>
              </li>
              <li>
                <img src={img_Time} className="time" alt="time" />{" "}
              </li>
              <li>
                <span className="bordered" style={{fontSize: "13px",borderBottom:"none"}}><b>Starting Time</b></span><span className="bordered">{activityData.bookingData.activityList.gradeDepartureTime}</span>
              </li>
            </ul>
            <p>
              <b>Guest :</b> {activityData.bookingData.totalTravellers.Adult.count}
            </p>
            <ul className="totalAmount">
              <li>
                <span>{activityData.bookingData.totalTravellers.Adult.count} Adult {activityData.bookingData.totalTravellers.Child.count} Child</span> <span>{activityData.bookingData.activityList.merchantNetPrice}</span>
              </li>
              <li>
                <span>Taxs & Fees</span> <span>{(activityData.bookingData.activityList.retailPrice - activityData.bookingData.activityList.merchantNetPrice).toFixed(2)}</span>
              </li>
              <li>
                <span>Total Cost</span> <span> {`${currencies[activityData.bookingData.activityList.currencyCode].symbol} ${activityData.price}`}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  onDeleteWishListData = async wishListData => {
    await axios.post(URL.DELETE_WISHLIST, { idValue: wishListData._id });
    if (this.props.loginDetails) {
      const { email } = this.props.loginDetails;
      this.props.getWishList(email);
    }
  };

  onBookingHandle(bookingData) {
    if (bookingData.type == "hotel") {
      this.props.history.push(
        "/hotel/rooms?" +
          queryString.stringify({ ...bookingData.searchString, wishList: true })
      );
    } else if (bookingData.type == "car") {
      this.props.history.push(
        "/car/search?" + queryString.stringify(bookingData.searchString)
      );
    }
    else if (bookingData.type == "transferCar") {
      this.props.history.push(
        "/transfer/search?" + queryString.stringify(bookingData.searchString)
      );
    }
    else if (bookingData.type == "activity") {
      this.props.history.push(
        "/activity/search?" + queryString.stringify(bookingData.bookingData.location)
      );
    }

  }
  render() {
    const { typeOfView } = this.state;
    const { wishList } = this.props;
    console.log("david")
    console.log(wishList)
    return (
      // New Design changes
      <div className="dashRightSide align-self-start">
        <div className="d-flex flex-wrap resWrap">
          {wishList && wishList.length == 0 && (
            <h6>No items added to the wishlist.</h6>
          )}
          {wishList &&
            wishList.map((wishListData, index) => {
              let viewToDisplay;
              if (wishListData.type == "hotel") {
                viewToDisplay = this.renderHotel(wishListData, index);
              } else if (wishListData.type == "car") {
                viewToDisplay = this.renderCar(wishListData, index);
              } else if (wishListData.type == "transferCar") {
                viewToDisplay = this.renderTransfer(wishListData, index);
              } else if (wishListData.type == "activity") {
                viewToDisplay = this.renderActivities(wishListData, index);
              }
              if (
                this.state.collapse["wishlist" + index] == null ||
                this.state.collapse["wishlist" + index] == undefined
              ) {
                let collapse = this.state.collapse;
                collapse["wishlist" + index] = false;
                this.setState({
                  collapse
                });
              }

              return (
                <div className="flex-column wishListCollapse">
                  <div className="wishListCollapseTitle" color="primary">
                    <div className="wishListTitle">
                      <h3 title={wishListData.title}>{wishListData.title}</h3>
                      {/* <img src={img_edit}/> */}
                    </div>
                    <img src={img_Road} className="roadImgSty" />
                    {/* <span className="openNewTab"><img src={openTab}/></span> */}
                    <span
                      onClick={() => this.onDeleteWishListData(wishListData)}
                      className="delete"
                    >
                      <img src={img_delete} />
                    </span>
                    <span
                      className="expanded"
                      onClick={() => {
                        let collapse = this.state.collapse;
                        collapse["wishlist" + index] = !collapse[
                          "wishlist" + index
                        ];
                        this.setState(
                          {
                            collapse
                          },
                          () => {
                            if (document.getElementById("wish" + index)) {
                              if (
                                wishListData.price !=
                                document.getElementById("wish" + index).value
                              ) {
                                document.getElementById("wish" + index).value =
                                  wishListData.price;
                              }
                            }
                          }
                        );
                      }}
                    >
                      {" "}
                      <img src={img_Expanded} alt="" />
                    </span>
                  </div>
                  <Collapse isOpen={this.state.collapse["wishlist" + index]}>
                    <Card>
                      <CardBody className="wishListCollapsecontent">
                        {viewToDisplay}
                        {/* <div className="wishListTotalAmount">
                                    <h2>TOTAL : $ {wishListData.price}</h2> 
                                </div> */}
                        <div className="wishListBtnGroup">
                          <div className="col">
                            <button
                              type="button"
                              className="searchBtn book"
                              style={{ margin: "10px" }}
                            >
                              Request For Offline Prices
                            </button>
                          </div>

                          <div className="col">
                            <button
                              type="button"
                              className="searchBtn book"
                              onClick={this.onBookingHandle.bind(
                                this,
                                wishListData
                              )}
                            >
                              Submit <img src={img_tick} alt="tick" />
                            </button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Collapse>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
  componentWillUnmount() {
    let allPriceDetails = this.state.allPrice;
    Object.keys(allPriceDetails).map(value => {
      axios.post(URL.UPDATE_WISHLIST, {
        idValue: allPriceDetails[value]._id,
        price: allPriceDetails[value].price
      });
      if (this.props.loginDetails) {
        const { email } = this.props.loginDetails;
        this.props.getWishList(email);
      }
    });
  }
}

const mapStateToProps = state => ({
  selectedCurrency: state.commonReducer.selectedCurrency,
  wishList: state.addcartReducer.wishListArray,
  wishlistStatus: state.addcartReducer.wishlistStatus,
  loginDetails: state.loginReducer.loginDetails
});

const mapDispatchToProps = dispatch => ({
  getWishList: data => dispatch(viewWishList(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DBWishList);

//export default DBWishList;
