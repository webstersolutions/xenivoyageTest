import React, { Component } from "react";
import queryString from "query-string";
import "react-daterange-picker/dist/css/react-calendar.css";
import { connect } from "react-redux";
import { extendMoment } from "moment-range";
import GoogleApiWrapper from '../map';

import {map as _map, find as _find, indexOf as _indexOf, get as _get} from "lodash";

import {
  searchRoom,
  getRoomPrice,
  searchRoomStateless
} from "../../../service/hotel/action";

import HotelInfo from "../../presentational/hotelInfo";

import img_calendar from "../../../asset/images/Calendar.svg";
import RoomCard from "../../presentational/RoomCard";
import AlertHotelCard from "../../presentational/AlertHotelCard";
import originalMoment from "moment";
// import openNewTab from "../../../asset/images/dashboard/resize.png";
// import ImageCarousel from '../../presentational/ImageCarousel';
// import UserRating from '../../presentational/UserRating'
// import searchIcon from "../../../asset/images/Search Icon.png";
// import noImage from '../../../asset/images/test_image.jpg';
// import img_whereIcon from "../../../asset/images/Where Icon (Map Marker).svg";

const moment = extendMoment(originalMoment);
// const today = moment();
const values = queryString.parse(window.location.search);
const { checkin, checkout, adult, child } = values;

class RoomContent extends Component {
  state = {
    adult: adult,
    room: "",
    child: child,
    startDate: checkin,
    endDate: checkout,
    value: moment.range(moment(checkin).clone(), moment(checkout).clone()),
    isCalendar: false,
    isDesc: false, isAmenities: false, isContact: false, isPolicy: true, isMain: false, isNear: false,
    multiRoomsValues: [],
    multiRoomsValues: [],
    isShowMap: false,
    selectedHotel: null,
    hotelList: []
  };

  componentDidMount() {
    // if (!this.props.sessionId) {
    //   this.getRoomList(this.props.location);
    // }
    // if (this.props.roomList.length === 0) {
    //   this.getRoomList(this.props.location);
    // }
    this.getRoomList(this.props.location);
    // sessionStorage.setItem("roomURL", window.location.search);
  }

  showMap = (selectedHotel) => {
    this.setState({ isShowMap: true, selectedHotel, hotelList: JSON.parse(sessionStorage.getItem("maphotelList"))});
  }
  closeModal = () => {
    this.setState({
      isShowMap: false
    });
  }


  componentWillReceiveProps(newProps) {
    const values = queryString.parse(window.location.search);
    const { checkin, checkout } = values;
    this.setState({ startDate: checkin });
    this.setState({ endDate: checkout });

    // if (this.props.location !== newProps.location) {
    //   if (this.props.location !== newProps.location) {
    //     this.getRoomList(newProps.location);
    //   }
    // }
  }

  getRoomList = location => {
    let queryLocal = queryString.parse(location.search);

    if (queryLocal.wishList) {
      let occupants = [];
      Array(+queryLocal.adult)
        .fill(1)
        .map(data => {
          occupants.push({
            type: "Adult"
          });
        });
      if (queryLocal.childAgeValues) {
        queryLocal.childAgeValues.map(value => {
          occupants.push({
            type: "Child",
            age: value
          });
        });
      }
      let payload = {
        currency: this.props.selectedCurrency,
        supplierId: null,
        roomOccupancies: [
          {
            occupants
          }
        ],
        stayPeriod: {
          start: queryLocal.checkin,
          end: queryLocal.checkout
        },
        hotelId: queryLocal.hotelId
      };
      this.props.searchRoomStateless(payload);
    } else {
      const { selectedCurrency } = this.props;
      const { hotelId, sessionId } = queryString.parse(location.search);
      // let isForWard = sessionStorage.getItem("isForWard");
      // let isBackWard = sessionStorage.getItem("isBackWard");

      if(this.props.hotel && sessionStorage.getItem("roomURL") !="") {

      // if ((isForWard == "1" || isBackWard == "1") && this.props.hotel) {
        //exists loaded data
      } else {
        this.props.searchRoom(sessionId, hotelId, selectedCurrency, _get(this.props, 'loginDetails.email', ""));
      }
      sessionStorage.setItem("roomURL", window.location.search);

    }
  };

  handleStartDate = e => {
    this.setState({
      isCalendar: true
      // startDate: e.target.value
    });
  };

  handleEndDate = e => {
    this.setState({
      isCalendar: true
      // endDate: e.target.value
    });
  };

  handleOnReserve = () => {

    sessionStorage.setItem("reserveURL", "");

    const values = queryString.parse(window.location.search);
    const {
      checkin,
      checkout,
      adult,
      child,
      childAgeValues,
      searchText
    } = values;
    const { sessionId, hotel, selectedCurrency } = this.props;
    const searchString = {
      sessionId,
      currency: selectedCurrency,
      hotelId: hotel.id,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      checkin,
      checkout,
      adult,
      child,
      childAgeValues,
      searchText,
      recomId: _map(this.state.multiRoomsValues, "recommendationId"),
      roomCount: _map(this.state.multiRoomsValues, "roomCount")
    };
    this.props.history.push(
      "/hotel/reservation?" + queryString.stringify(searchString)
    );
  };

  handleGuest = event => {
    this.setState({ adult: event.target.value });
  };

  handleRoom = event => {
    this.setState({ room: event.target.value });
  };

  handleChild = event => {
    this.setState({ child: event.target.value });
  };

  onSelect = value => {
    this.setState({
      value,
      startDate: moment(value.start._d).format("YYYY-MM-DD"),
      isCalendar: false,
      endDate: moment(value.end._d).format("YYYY-MM-DD")
    });
  };

  toggleShowCal = () => {
    this.setState({ isCalendar: true });
  };

  rmvHtmlFunc = str => {
    if (str === null || str === "") return "No Description Available";
    else str = str.toString();
    return str.replace(/<[^>]*>/g, "");
  };

  handle = () => {
    const { hotel, searchRoomStateless, selectedCurrency } = this.props;
    const { startDate, endDate, adult, child } = this.state;
    const payload = {
      stayPeriod: {
        start: startDate,
        end: endDate
      },
      hotelId: hotel.id,
      adult: {
        type: "adult",
        count: adult
      },
      child: {
        type: "child",
        count: child
      },
      currency: selectedCurrency
    };
    searchRoomStateless(payload);
  };

  handleChange = (e, recommendations) => {
    const value = e.target.value;
    if(value != 0){
      const id = _indexOf(
        this.state.multiRoomsValues,
        _find(this.state.multiRoomsValues, [
          "recommendationId",
          recommendations.id
        ])
      );
  
      if (id !== -1) {
        let multiRoomsValues = [...this.state.multiRoomsValues];
        multiRoomsValues[id] = {
          roomCount: value,
          recommendationId: recommendations.id
        };
        this.setState({ multiRoomsValues });
      } else {
        let multiRoomsValues = [...this.state.multiRoomsValues];
        multiRoomsValues.push({
          roomCount: value,
          recommendationId: recommendations.id
        });
        this.setState({ multiRoomsValues });
      }
    }else{
      this.setState({
        multiRoomsValues: []
      })
    }
    
  };

  showMap = (selectedHotel) => {
    this.setState({ isShowMap: true, selectedHotel });
  }


  render() {
    const {
      hotel,
      roomList,
      roomRates,
      isSearching,
      roomRecommendations
    } = this.props;
    const {
      startDate,
      endDate,
      isPolicy,
      isMain,
      isAmenities,
      isContact,
      isDesc,
      isNear,
      multiRoomsValues
    } = this.state;
    const values = queryString.parse(window.location.search);
    const checkin = values.checkin;
    const checkout = values.checkout;
    // const fliteravailableRoomCount = roomList && _filter(roomList, (each, index) => {
    //   return (each.availableRoomCount > 0)
    // })
    const fliteravailableRoomCount = roomList;

    // console.log("roomList ?", roomList)
    // console.log("roomRates ?", roomRates)
    // let len = fliteravailableRoomCount && fliteravailableRoomCount.length;
    // let temp = []
    // for (let i = 0; i < len; i++) {
    //   for (let j = 0; j < len; j++) {
    //     if (fliteravailableRoomCount[i].refId == roomRates[j].rateOccupancies[0].roomRefId) {
    //       temp = roomRates[j];
    //       roomRates[j] = roomRates[i];
    //       roomRates[i] = temp;
    //     }
    //     if (roomRates[i].refId == roomRecommendations[j].rateRefIds[0]) {
    //       temp = roomRecommendations[j];
    //       roomRecommendations[j] = roomRecommendations[i];
    //       roomRecommendations[i] = temp;
    //     }
    //   }
    // }
    return (
      <React.Fragment>
        {
            this.state.isShowMap ? (
              <GoogleApiWrapper
                hotelList={this.state.hotelList}
                selectedHotel={this.state.selectedHotel}
                isShowMap={this.state.isShowMap}
                closeModal={this.closeModal}
              />
            ) : null
        }

        <div className="d-flex flex-wrap justify-content-between webResp">
          <div
            className={`flex-column tabInfoRoom ${isMain ? "activeTab" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              this.setState({
                isMain: true,
                isDesc: false,
                isAmenities: false,
                isContact: false,
                isPolicy: false,
                isNear: false
              })
            }
          >
            Photos
          </div>
          <div
            className={`flex-column tabInfoRoom ${isDesc ? "activeTab" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              this.setState({
                isDesc: true,
                isAmenities: false,
                isContact: false,
                isPolicy: false,
                isMain: false,
                isNear: false
              })
            }
          >
            Description
          </div>
          <div
            className={`flex-column tabInfoRoom ${
              isAmenities ? "activeTab" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              this.setState({
                isDesc: false,
                isAmenities: true,
                isContact: false,
                isPolicy: false,
                isMain: false,
                isNear: false
              })
            }
          >
            Amenities
          </div>
          <div
            className={`flex-column tabInfoRoom ${isNear ? "activeTab" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              this.setState({
                isDesc: false,
                isAmenities: false,
                isContact: false,
                isPolicy: false,
                isMain: false,
                isNear: true
              })
            }
          >
            Near Us
          </div>
          <div
            className={`flex-column tabInfoRoom ${isPolicy ? "activeTab" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              this.setState({
                isDesc: false,
                isAmenities: false,
                isContact: false,
                isPolicy: true,
                isMain: false,
                isNear: false
              })
            }
          >
            Policies
          </div>
          <div
            className={`flex-column tabInfoRoom ${
              isContact ? "activeTab" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              this.setState({
                isDesc: false,
                isAmenities: false,
                isContact: true,
                isPolicy: false,
                isMain: false,
                isNear: false
              })
            }
          >
            Hotel Contact
          </div>
        </div>
        {hotel && (
          <HotelInfo
            hotel={hotel}
            isPolicy={isPolicy}
            rmvHtmlFunc={this.rmvHtmlFunc}
            isMain={isMain} isAmenities={isAmenities} isContact={isContact} isDesc={isDesc} isNear={isNear} showMap={this.showMap}/>
        )}
        <div className="d-flex flex-wrap justify-content-between mobileResp">
          <div
            className={`flex-column tabInfoRoom ${isMain ? "activeTab" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              this.setState({
                isMain: true,
                isDesc: false,
                isAmenities: false,
                isContact: false,
                isPolicy: false,
                isNear: false
              })
            }
          >
            Photos
          </div>
          <div
            className={`flex-column tabInfoRoom ${isDesc ? "activeTab" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              this.setState({
                isDesc: true,
                isAmenities: false,
                isContact: false,
                isPolicy: false,
                isMain: false,
                isNear: false
              })
            }
          >
            Description
          </div>
          <div
            className={`flex-column tabInfoRoom ${
              isAmenities ? "activeTab" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              this.setState({
                isDesc: false,
                isAmenities: true,
                isContact: false,
                isPolicy: false,
                isMain: false,
                isNear: false
              })
            }
          >
            Amenities
          </div>
          <div
            className={`flex-column tabInfoRoom ${isNear ? "activeTab" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              this.setState({
                isDesc: false,
                isAmenities: false,
                isContact: false,
                isPolicy: false,
                isMain: false,
                isNear: true
              })
            }
          >
            Near Us
          </div>
          <div
            className={`flex-column tabInfoRoom ${isPolicy ? "activeTab" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              this.setState({
                isDesc: false,
                isAmenities: false,
                isContact: false,
                isPolicy: true,
                isMain: false,
                isNear: false
              })
            }
          >
            Policies
          </div>
          <div
            className={`flex-column tabInfoRoom ${
              isContact ? "activeTab" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              this.setState({
                isDesc: false,
                isAmenities: false,
                isContact: true,
                isPolicy: false,
                isMain: false,
                isNear: false
              })
            }
          >
            Hotel Contact
          </div>
        </div>
        {/*end tab section  */}
        <div className="selectRoomBg d-flex flex-wrap">
          {!isSearching && (
            <React.Fragment>
              <div className="selectRoomTitle">
                <h4>Select your room</h4>
                {/* <button className="selectNewTab" onClick={() => window.open(window.location, '_blank')} ><img src={openNewTab} /> </button> */}
              </div>
              <div className="selectRoomItemsBg  bottom-btn-pad">
                <div className="d-inline-flex flex-row smallTabColumn mb-2">
                  <div className="seleboxs1 flex-column">
                    <img
                      src={img_calendar}
                      alt="calendImg"
                      className="calendImg"
                    />
                    <input
                      type="text"
                      className="borderRight"
                      style={{ cursor: "default" }}
                      placeholder="Sat,Oct 20"
                      onChange={this.handleStartDate}
                      value={startDate}
                      onFocus={this.toggleShowCal}
                      disabled
                    />
                    <input
                      type="text"
                      className=""
                      style={{ cursor: "default" }}
                      placeholder="Fri,Oct 26"
                      onChange={this.handleEndDate}
                      value={endDate}
                      onFocus={this.toggleShowCal}
                      disabled
                    />
                    {/* {isCalendar &&
                    <DateRangePicker
                      value={this.state.value}
                      onSelect={this.onSelect}
                      numberOfCalendars={2}
                    />
                  } */}
                  </div>
                  <button
                    type="button"
                    style={{ float: "right" }}
                    onClick={this.handleOnReserve}
                    disabled={!multiRoomsValues.length}
                    className="selectRoomBtn reserveBtn"
                  >
                    BOOK NOW
                  </button>
                  <div className="selectDivsAl">
                    {/* <div className="form-group">
                <select
                  className=""
                  value={this.state.room}
                  onChange={this.handleRoom}
                >
                  <option disabled value=''>Room</option>
                  <option value="1">1 Room </option>
                  <option value="2">2 Rooms </option>
                  <option value="3">3 Rooms </option>
                  <option value="4">4 Rooms </option>
                </select>
              </div> */}
                    <div className="form-group">
                      {/* <select
                  className=""
                  value={this.state.adult}
                  onChange={this.handleGuest}
                > */}
                      {/* <option disabled value="">
                    Adult
                  </option>
                  <option value="1">1 Adult </option>
                  <option value="2">2 Adults </option>
                  <option value="3">3 Adults </option>
                  <option value="4">4 Adults </option> */}
                      {/* </select> */}
                    </div>
                    <div className="form-group">
                      {/* <select
                  className=""
                  value={this.state.child}
                  onChange={this.handleChild}
                > */}
                      {/*  <option disabled value="">
                    Child
                  </option>
                  <option value="1">1 Child </option>
                  <option value="2">2 children </option>
                  <option value="3">3 children </option>
                  <option value="4">4 children </option> */}
                      {/* </select> */}
                    </div>
                    {/* <button
                type="button"
                className="searchBtn search-room"
                onClick={this.handle}
              >
                <img src={searchIcon} title="Search Room" alt="search Room" />
              </button> */}
                  </div>
                </div>

                {fliteravailableRoomCount && fliteravailableRoomCount.length ? (
                  fliteravailableRoomCount.map((room, index) => {

                      return (
                        <RoomCard
                          {...this.props}
                          hotel={hotel}
                          key={index}
                          refId={room.refId}
                          room={room}
                          rate={roomRates[index]}
                          rateList={roomRates}
                          recommendations={roomRecommendations[index]}
                          checkin={checkin}
                          checkout={checkout}
                          rmvHtmlFunc={this.rmvHtmlFunc}
                          onReserve={() =>
                            this.handleOnReserve(roomRecommendations[index])
                          }
                          handleChange={this.handleChange}
                        />
                        )

                    
                    })
                ) : (
                  <AlertHotelCard type="hotel" alertInfo="No Rooms Available" />
                )}
                <button
                  type="button"
                  onClick={this.handleOnReserve}
                  disabled={!multiRoomsValues.length}
                  className="selectRoomBtn bottom-book-btn"
                >
                  BOOK NOW
                </button>

              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isSearching: state.hotelReducer.isSearching,
  currency: state.hotelReducer.currency,
  sessionId: state.hotelReducer.sessionId,
  hotel: state.hotelReducer.hotel,
  roomList: state.hotelReducer.roomList,
  roomRates: state.hotelReducer.rateList,
  searchDate: state.hotelReducer.searchDate,
  roomRecommendations: state.hotelReducer.recommendations,
  selectedCurrency: state.commonReducer.selectedCurrency,
  loginDetails: state.loginReducer.loginDetails
});

const mapDispatchToProps = dispatch => ({
  searchRoom: (sessionId, hotelId, currency, email) =>
    dispatch(searchRoom(sessionId, hotelId, currency, email)),
  getRoomPrice: (
    sessionId,
    hotelId,
    recommendationsId,
    currency,
    email = (this.props.loginDetails && this.props.loginDetails.email) || ""
  ) =>
    dispatch(
      getRoomPrice(sessionId, hotelId, recommendationsId, currency, email)
    ),
  searchRoomStateless: (startDate, endDate, hotel, adult, child, currency) =>
    dispatch(
      searchRoomStateless(startDate, endDate, hotel, adult, child, currency)
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomContent);
