import React, { Component } from "react";
import moment from "moment";
import {
  find as _find, map as _map, sumBy as _sumBy, uniqBy as _uniqBy,
  countBy as _countBy, includes as _includes, filter as _filter, uniq as _uniq,
  partialRight as _partialRight, pick as _pick, isEqual as _isEqual,
  groupBy as _groupBy, uniqWith as _uniqWith, values as _values,
  partition as _partition
} from "lodash";
import queryString from "query-string";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import HotelBookingProtection from "./HotelBookingProtection";
import Payment from "./Payment";
import HotelInfo from "./hotelInfo"
import UserRating from "./UserRating";

import img_parking from "../../asset/images/selectRoom/parking-sign(1).png";
import img_hotcoffee from "../../asset/images/selectRoom/hot-coffee.png";
import img_bussiness from "../../asset/images/bussiness.png";
import img_bar from "../../asset/images/glass.png";
import img_laundry from "../../asset/images/laundry.png";
import img_swmmingPool from "../../asset/images/swimming-silhouette.png";
import img_television from "../../asset/images/television.png";
import img_unknown from "../../asset/images/unknown.png";
import openNewTab from "../../asset/images/dashboard/resize.png";

import img_Time from "../../asset/images/Time.svg";
import img_DateArrow from "../../asset/images/Date Arrow.png";
import img_WhereIcon from "../../asset/images/Where Icon (Map Marker).svg";
import img_discount from '../../asset/images/discount.png';
import img_noSmoke from '../../asset/images/no-smoking-sign (1).png';
import img_reserve from "../../asset/images/online-booking.png";
import img_close from '../../asset/images/cancel.png';
import img_tick from '../../asset/images/roundTick.png';
import img_extrabed from "../../asset/images/selectRoom/extrabed.png";
import img_hotel from "../../asset/images/hotel-building.png";
import img_signal from "../../asset/images/selectRoom/signal.png";


import {
  getRoomPrice
} from "./../../service/hotel/action";
import RoomResInfo from "./RoomResInfo";
import { array } from "prop-types";

var currencies = require('country-data').currencies;

class RoomReservation extends Component {
  static defaultProps = {
    isReview: false,

  };
  state = {
    isDesc: false, isAmenities: false, isContact: false, isPolicy: true, isMain: false, isNear: false,
    startDate: "",
    endDate: ""
  }
  componentDidMount() {
    const value = queryString.parse(window.location.search)
    const { checkin, checkout } = value
    this.setState({ startDate: checkin, endDate: checkout })
  }

  render() {
    const {
      isReview,
      hotel,
      fareBreakup,
      bookingDate,
      room,
      checkinCheckoutPolicy,
      isCancellation,
      cancellationPolicy,
      togglecancellation,
      toggleSplCancel,
      isSpclIns,
      policy,
      rate,
      rmvHtmlFunc, isSearching,
      roomPriceInfo,
      checkin,
      checkout,
      selectedCurrency
    } = this.props;

    const { isPolicy,
      isMain, isAmenities, isContact, isDesc, isNear, startDate, endDate } = this.state
    // const { startDate, endDate } = this.props.bookingDate;
    const stDt = moment(startDate, "MM/DD/YYYY");
    const endDt = moment(endDate, "MM/DD/YYYY");
    const stayDt = endDt.diff(stDt, "days");
    var roomName = _map(roomPriceInfo, (each, i) => {
      return (
        each.desc
      )
    })
    var roomTotalAmt = _map(roomPriceInfo, (each, i) => {
      return (
        each.totalAmount
      )
    })

    var Arrrrrrr = _map(roomPriceInfo, _partialRight(_pick, ['desc', 'totalAmount']));
    const findUniqueness = (elements) => {
      const base = elements[0];
      return elements.every(each => each === base);
    }
    if (findUniqueness(roomName) == false && findUniqueness(roomTotalAmt) == true) {
      var selectedRoomCount = _countBy(roomPriceInfo, 'desc')
      var uniqueRoomList = _uniqBy(roomPriceInfo, 'desc');
      var rateBy = 'roomDesc';
      var isRoomDesc = true;
      var isTotAmt = false;
    } else if (findUniqueness(roomName) == true && findUniqueness(roomTotalAmt) == false) {
      selectedRoomCount = _countBy(roomPriceInfo, 'totalAmount')
      uniqueRoomList = _uniqBy(roomPriceInfo, 'totalAmount');
      rateBy = 'totalAmount';
      isTotAmt = true;
      isRoomDesc = false;
    } else {
      selectedRoomCount = _countBy(roomPriceInfo, 'totalAmount')
      uniqueRoomList = _uniqBy(roomPriceInfo, 'totalAmount');
      rateBy = 'totalAmount';
      isTotAmt = true;
      isRoomDesc = false;
    }

    var b = [];
    for (var i = 0; i < Arrrrrrr.length; i++) {
      if (b.length == 0) {
        var base = { desc: Arrrrrrr[i].desc, totalAmount: Arrrrrrr[i].totalAmount, count: 1 }
        b.push(base)
      } else {
        var m = true;
        for (let j = 0; j < b.length; j++) {
          if (Arrrrrrr[i].desc == b[j].desc && Arrrrrrr[i].totalAmount == b[j].totalAmount) {
            b[j].count = b[j].count + 1;
            m = false;
          }
        }
        if (m) {
          var base = { desc: Arrrrrrr[i].desc, totalAmount: Arrrrrrr[i].totalAmount, count: 1 }
          b.push(base)
        }
      }
    }

    var uniqueRoomListFin = roomPriceInfo.filter(function (a) {
      var key = a.desc + '|' + a.totalAmount;
      if (!this[key]) {
        this[key] = true;
        return true;
      }
    }, Object.create(null));
    const selectedCurrencyVal = currencies[this.props.selectedCurrency].symbol;
    let curFormat = JSON.parse(localStorage.getItem("currency"));
    curFormat = curFormat.CURRENCY_FORMAT;

    var totolAmt = (_sumBy(_map(roomPriceInfo, (each, i) => each.totalAmount)));
    totolAmt = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(totolAmt.toFixed(2));

    return (
      <div>
        <div className="selectRoomBg d-flex flex-wrap">
          {!isSearching && <React.Fragment>
            <div className="selectRoomTitle">
              <h4>Confirm your reservation</h4>
              {/* <button className="selectNewTab" onClick={() => window.open(window.location, '_blank')} ><img src={openNewTab} /></button> */}
            </div>
            {uniqueRoomListFin ?
              _map(uniqueRoomListFin, (each, i) => {
                return (
                  <RoomResInfo
                    roomCount={b[i].count}
                    selectedRoomCount={selectedRoomCount}
                    rateBy={rateBy}
                    isRoomDesc={isRoomDesc}
                    isTotAmt={isTotAmt}
                    roomDesc={each.rooms[0].name}
                    totalAmount={each.totalAmount}
                    farebreakupAmount={each.farebreakupAmount}
                    hotel={each.hotel}
                    fareBreakup={each.fareBreakup}
                    room={each.rooms}
                    rate={each.rates[0]}
                    checkinCheckoutPolicy={each.hotel.checkinCheckoutPolicy}
                    cancellationPolicy={each.rates[0].cancellationPolicy.text}
                    policy={each.rates[0].policies}
                    bookingDate={bookingDate}
                    checkin={checkin}
                    checkout={checkout}
                    togglecancellation={togglecancellation}
                    toggleSplCancel={toggleSplCancel}
                    isCancellation={isCancellation}
                    rmvHtmlFunc={rmvHtmlFunc}
                    isSpclIns={isSpclIns}
                    roomPriceInfo={roomPriceInfo}
                    pricedTotalFare={each.pricedTotalFare}
                    discountedAmount={each.discountedAmount}
                    taxedAmount={each.taxedAmount}
                    amtAfterdiscount={each.amtAfterdiscount}
                    basedAmount={each.basedAmount} />
                )
              })
              : null}
          </React.Fragment>}


        </div>
        <div className="d-flex flex-wrap justify-content-between webResp">
          <div className={`flex-column tabInfoRoom ${isMain ? 'activeTab' : ''}`} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isMain: true, isDesc: false, isAmenities: false, isContact: false, isPolicy: false, isNear: false })}>My booking</div>
          <div className={`flex-column tabInfoRoom ${isDesc ? 'activeTab' : ''}`} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isDesc: true, isAmenities: false, isContact: false, isPolicy: false, isMain: false, isNear: false })}>Description</div>
          <div className={`flex-column tabInfoRoom ${isAmenities ? 'activeTab' : ''}`} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isDesc: false, isAmenities: true, isContact: false, isPolicy: false, isMain: false, isNear: false })}>Amenities</div>
          <div className={`flex-column tabInfoRoom ${isNear ? 'activeTab' : ''}`} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isDesc: false, isAmenities: false, isContact: false, isPolicy: false, isMain: false, isNear: true })}>Near Us</div>
          <div className={`flex-column tabInfoRoom ${isPolicy ? 'activeTab' : ''}`} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isDesc: false, isAmenities: false, isContact: false, isPolicy: true, isMain: false, isNear: false })}>Policies</div>
          <div className={`flex-column tabInfoRoom ${isContact ? 'activeTab' : ''}`} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isDesc: false, isAmenities: false, isContact: true, isPolicy: false, isMain: false, isNear: false })}>Hotel Contact</div>
        </div>
        {
          roomPriceInfo.length ? <HotelInfo hotel={roomPriceInfo[0].hotel} isPolicy={isPolicy} rmvHtmlFunc={rmvHtmlFunc}
            isMain={isMain} isAmenities={isAmenities} isContact={isContact} isDesc={isDesc} isNear={isNear} /> : null
        }
        <div className="d-flex flex-wrap justify-content-between mobileResp">
          <div className={`flex-column tabInfoRoom ${isMain ? 'activeTab' : ''}`} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isMain: true, isDesc: false, isAmenities: false, isContact: false, isPolicy: false, isNear: false })}>My booking</div>
          <div className={`flex-column tabInfoRoom ${isDesc ? 'activeTab' : ''}`} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isDesc: true, isAmenities: false, isContact: false, isPolicy: false, isMain: false, isNear: false })}>Description</div>
          <div className={`flex-column tabInfoRoom ${isAmenities ? 'activeTab' : ''}`} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isDesc: false, isAmenities: true, isContact: false, isPolicy: false, isMain: false, isNear: false })}>Amenities</div>
          <div className={`flex-column tabInfoRoom ${isNear ? 'activeTab' : ''}`} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isDesc: false, isAmenities: false, isContact: false, isPolicy: false, isMain: false, isNear: true })}>Near Us</div>
          <div className={`flex-column tabInfoRoom ${isPolicy ? 'activeTab' : ''}`} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isDesc: false, isAmenities: false, isContact: false, isPolicy: true, isMain: false, isNear: false })}>Policies</div>
          <div className={`flex-column tabInfoRoom ${isContact ? 'activeTab' : ''}`} style={{ cursor: 'pointer' }} onClick={() => this.setState({ isDesc: false, isAmenities: false, isContact: true, isPolicy: false, isMain: false, isNear: false })}>Hotel Contact</div>
        </div>
        {
          !isReview && (
            <React.Fragment>
              {/* <div className="d-flex flex-wrap otherSectionBg">
                <HotelBookingProtection type='hotel' tripAmount={roomPriceInfo[0].fareBreakup.totalFare} /> 
              </div> */}
              <div className="d-flex flex-wrap otherSectionBg">
              <span className="overAmount"> Overall Amount : <span style={{ fontSize: '16px' }}>{selectedCurrencyVal}</span>&nbsp;{totolAmt}</span>

                <span className="overAmount"> Total No Of Rooms Selected : {roomPriceInfo.length}</span>
              </div>
              <div className="d-flex flex-wrap otherSectionBg">
                <Payment checkin={startDate} checkout={endDate} tripAmount={roomPriceInfo[0].fareBreakup} periodStay={stayDt} />
              </div>
            </React.Fragment>
          )
        }
      </div >
    );
  }
}
const mapStateToProps = state => ({
  isSearching: state.hotelReducer.isSearching,
  selectedCurrency: state.commonReducer.selectedCurrency
});
const mapDispatchToProps = dispatch => ({
  getRoomPrice: (sessionId, hotelId, recommendationsId) =>
    dispatch(getRoomPrice(sessionId, hotelId, recommendationsId)),
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RoomReservation));
// export default RoomReservation;

const _amenties = [
  {
    category: "Breakfast",
    icon: img_hotcoffee
  },
  {
    category: "Business Center",
    icon: img_bussiness
  },
  {
    category: "Laundry Services",
    icon: img_laundry
  },
  {
    category: "Bar",
    icon: img_bar
  },
  {
    category: "Swimming Pool",
    icon: img_swmmingPool
  },
  {
    category: "Parking",
    icon: img_parking
  },
  {
    category: "Television",
    icon: img_television
  },
  {
    category: "Currency Exchange",
    icon: img_unknown
  },
  {
    category: "Airport Shuttle",
    icon: img_unknown
  },
  {
    category: "Internet",
    icon: img_unknown
  },
  {
    category: "Non Smoking",
    icon: img_unknown
  },
  {
    category: "Restaurant",
    icon: img_unknown
  },
  {
    category: "Fitness Facility",
    icon: img_unknown
  },
  {
    category: "Pets Allowed",
    icon: img_unknown
  },
  {
    category: "Childcare Service",
    icon: img_unknown
  },
  {
    category: "Spa",
    icon: img_unknown
  }
];
