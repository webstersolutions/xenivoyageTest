import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import queryString from "query-string";
import {
  find as _find,
  forEach as _forEach,
  isEmpty as _isEmpty,
  map as _map,
  pick as _pick,
  get as _get,
  noop as _noop
} from "lodash";
import ActivityRating from "./ActivityRating";
import img_WhereIcon from "../../../asset/images/Where Icon (Map Marker).svg";

import {
  getActivityInfo,
  getActivityPrice,
  getActivityHotels
} from "../../../service/activities/action";

import img_unAvaliable from "../../../asset/images/No_Image.jpg";
import clock_SVG from "../../../asset/images/Time.svg";

var currencies = require("country-data").currencies;

class StateLessActivityConfirmContent extends Component {
  state = {
    traveller: null,
    activityHotelList: [],
    count: 0
  };
  componentDidMount() {
    const { itineryData } = this.props;
    console.log("itineryData", itineryData);
    const {
      activityList,
      selectedActivityInfo,
      activityHotelList
    } = itineryData;
    const { ageBands } = activityList;
    const { hotelPickup, code } = selectedActivityInfo;

    this.setState({
      traveller: _map(ageBands, ({ count, bandId }, i) => {
        let travellerType = "";
        let separation = "";
        _forEach(selectedActivityInfo.ageBands, value => {
          if (value.bandId === bandId) {
            travellerType = value.description;
          }
        });

        if (i >= 1 && i < ageBands.length) {
          separation = ", ";
        }
        return ` ${count} ${travellerType}${separation} `;
      })
    });
    this.props.addData({ ...itineryData });
  }

  render() {
    const { traveller } = this.state;
    const { itineryData, bookingSequence } = this.props;
    const {
      activityList,
      selectedActivityInfo,
      activityHotelList,
      selectedPackage
    } = itineryData;
    let gradeDepartureTime = null;
    if(selectedPackage){
      const get_tourGrades = _get(selectedActivityInfo, "tourGrades", null);
      const activityInfo = _find(get_tourGrades, ['gradeCode', selectedPackage])
      gradeDepartureTime = _get(activityInfo, "gradeDepartureTime", null)
    }
    const image = _get(selectedActivityInfo, "productPhotos[0].photoURL", null);
    const rating = _get(selectedActivityInfo, "rating", null);
    const shortTitle = _get(selectedActivityInfo, "shortTitle", null);
    const location = _get(selectedActivityInfo, "location", null);
    const bookingDate = _get(activityList, "bookingDate", null);
    // const gradeDepartureTime = _get(activityList, "gradeDepartureTime", null);
    const merchantNetPrice = _get(activityList, "merchantNetPrice", null);
    const retailPrice = _get(activityList, "retailPrice", null);
    const currencyCode = _get(activityList, "currencyCode", "USD");
    const symbol = currencies[currencyCode].symbol;

    let languageService = null;

    if (selectedActivityInfo && selectedActivityInfo.tourGradesAvailable) {
      let count = 0;
      _forEach(selectedActivityInfo.tourGrades[0].langServices, lang => {
        if (count === 0) {
          languageService = `Offered in ${lang.split("-")[0]}`;
        }
        count++;
      });

      if (count > 1) {
        languageService += ` and ${count} more`;
      }
    }

    return (
      <div>
        <div className="selectRoomItemsBg " STYLE="">
          {" "}
          <h6 STYLE="color:#464646">Itinerary item : {bookingSequence}</h6>
        </div>
        <div className="selectRoomBg d-flex flex-wrap">
          {!_isEmpty(activityList) && !_isEmpty(selectedActivityInfo) && (
            <div id="RoomResInfo" style={{ width: "100%" }}>
              <div className="selectRoomItemsBg d-flex flex-row resWrap">
                <div className="flex-column confirmRoomLeft">
                  <img src={image ? image : img_unAvaliable} />
                  <div className="activityInfo">
                    <div className="d-flex">
                      <div>
                        <img
                          style={{
                            paddingBottom: "2px",
                            width: "20px",
                            height: "22px"
                          }}
                          className="mr-3"
                          src={clock_SVG}
                        />
                      </div>
                      <div>{selectedActivityInfo.duration}</div>
                    </div>
                    {languageService && (
                      <div className="d-flex">
                        <div>
                          <i className="fa fa-comments mr-3" />
                        </div>
                        <div>{languageService}</div>
                      </div>
                    )}

                    {selectedActivityInfo.hotelPickup && (
                      <div className="d-flex">
                        <div>
                          <i className="fa fa-car mr-3" />
                        </div>
                        <div>Hotel Pick Offered</div>
                      </div>
                    )}

                    {selectedActivityInfo.voucherOption && (
                      <div className="d-flex">
                        <div>
                          <i className="fa fa-gift mr-3" />
                        </div>
                        <div>Mobile Ticket</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-column confirmRoomRight">
                  <div className="mb-3 d-flex activityInfo border-bottom">
                    <ActivityRating
                      rating={selectedActivityInfo.rating}
                      style={{ borderBottom: "none", width: "35%" }}
                    />
                    <div className="ml-3">
                      {selectedActivityInfo.reviewCount} Reviews
                    </div>
                  </div>
                  <div className="reservationDetails">
                    <h4>{shortTitle}</h4>
                    <p>
                      <img src={img_WhereIcon} />
                      <span>{location}</span>
                    </p>
                    <ul>
                      <li className="border mr-2">
                        <h6>Travel Date</h6>
                        <p>
                          {moment(bookingDate).format("dddd, MMMM DD YYYY")}
                        </p>
                      </li>
                      {gradeDepartureTime && (
                        <li className="border ml-2">
                          <h6>Starting Time</h6>
                          <p>{gradeDepartureTime}</p>
                        </li>
                      )}
                    </ul>
                  </div>
                  <ul className="totalAmountDis" style={{ width: "310px" }}>
                    <li>
                      <span>{traveller}</span>{" "}
                      <span>
                        <span style={{ fontSize: "16px" }}>
                          {`${symbol}${merchantNetPrice}`}
                        </span>
                      </span>
                    </li>
                    <li>
                      <span>Taxes & Fees</span>{" "}
                      <span>
                        <span style={{ fontSize: "16px" }}>{symbol}</span>
                        <span>
                          &nbsp;
                          {(retailPrice - merchantNetPrice).toFixed(2)}
                        </span>
                      </span>
                    </li>
                    <li>
                      <span>Total Cost</span>{" "}
                      <span>
                        <span style={{ fontSize: "16px" }}>
                          {`${symbol}${retailPrice}`}
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedActivity: state.activityReducer.selectedActivity,
  selectedActivityFinalPrice: state.activityReducer.selectedActivityFinalPrice,
  activityBookingStatus: state.activityReducer.activityBookingStatus,
  activityHotelList: state.activityReducer.activityHotelList,
  selectedCurrency: state.commonReducer.selectedCurrency
});

const mapDispatchToProps = dispatch => ({
  getActivityInfo: (payloadInfo, clb, clbPayload) =>
    dispatch(getActivityInfo(payloadInfo, clb, clbPayload)),
  getActivityPrice: payloadInfo => dispatch(getActivityPrice(payloadInfo)),
  getActivityHotels: payloadInfo => dispatch(getActivityHotels(payloadInfo))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StateLessActivityConfirmContent)
);
