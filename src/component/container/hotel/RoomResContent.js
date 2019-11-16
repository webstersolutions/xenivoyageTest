import React, { Component } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { map as _map, flatMapDeep as _flatMapDeep } from "lodash";

import {
  getRoomPrice
} from "../../../service/hotel/action";

import RoomReservation from "../../presentational/RoomReservation";



class RoomResContent extends Component {
  state = {
    isCancellation: false,
    searchDate: '',
    isSpclIns: false
  }

componentDidMount() {
  

      this.getResInfo(this.props.location);
      // sessionStorage.setItem("reserveURL", window.location.search)
    // if (this.props.searchByHotel.length == 0) {
    //   this.getResInfo(this.props.location);
    // }
  }
  componentWillMount(){
    if(this.props.priceErrMsg != null && this.props.priceErrMsg){
      window.confirm(this.props.priceErrMsg)
   
  }
  }
  

  componentWillReceiveProps(newProps) {
    if (this.props.location != newProps.location) {
      this.getResInfo(newProps.location);
    }
  }




  payloadGenerate = (sessionId, hotelId, selectedCurrency, recomId, roomCount) => {
    return (
      _map(roomCount, (item, i) => {
        return (
          typeof (recomId) == 'object' ?
            _map(Array.apply(null, { length: item }), (each, index) => {
              return {
                sessionId,
                hotelId,
                'recommendationId': recomId[i],
                "optionalDataPrefs": [
                  "All"
                ],
                 currency: selectedCurrency,
                 
                //currency: "USD",
                email: this.props.loginDetails && this.props.loginDetails.email|| ""
              }
            })
            :
            _map(Array.apply(null, { length: item }), (each, index) => {
              return {
                sessionId,
                hotelId,
                'recommendationId': recomId,
                "optionalDataPrefs": [
                  "All"
                ],
                currency: selectedCurrency,
                // currency: "USD",
                email: this.props.loginDetails && this.props.loginDetails.email|| ""
               // currency: selectedCurrency
              }
            })
        )
      })
    )
  }

  getResInfo = location => {
    const values = queryString.parse(location.search)
    this.setState({ searchDate: values })
    const { sessionId, hotelId, recomId, roomCount } = values;
    const { selectedCurrency, isSearching, roomPriceInfo, isPriceFail } = this.props;
    // let isForWard = sessionStorage.getItem("isForWard");
    if(roomPriceInfo && sessionStorage.getItem("reserveURL") !=""){
    // if(isForWard == "1" && !isSearching && roomPriceInfo){
      //exists loaded data
    }else{
      this.props.getRoomPrice(_flatMapDeep(this.payloadGenerate(sessionId, hotelId, selectedCurrency, recomId, roomCount)));
    }
    sessionStorage.setItem("reserveURL", window.location.search);

    // this.props.getRoomPrice(_flatMapDeep(this.payloadGenerate(sessionId, hotelId, selectedCurrency, recomId, roomCount)));
  }

  togglecancellation = () => {
    this.setState({ isCancellation: !this.state.isCancellation });
  }

  toggleSplCancel = () => {
    this.setState({ isSpclIns: !this.state.isSpclIns });
  }

  rmvHtmlFunc = (str) => {
    if ((str === null) || (str === ''))
      return 'No Description Available';
    else
      str = str.toString();
    return str.replace(/<[^>]*>/g, '');
  }

  goBack = () => {
    window.location.reload();
    this.props.history.push("/hotel");
  }
 

  render() {
    const { hotel, searchDate, fareBreakup, rooms, isPriceFail,
      rates, isSearching, pricedRooms, roomPriceInfo, priceErrMsg } = this.props;
    const { isCancellation, isSpclIns } = this.state;
    const values = queryString.parse(window.location.search)
    const checkin = values.checkin;
    const checkout = values.checkout;
    return (
          
      <div>
        {!isSearching && roomPriceInfo && <RoomReservation
          bookingDate={this.state.searchDate}
          checkin={checkin}
          checkout={checkout}
          togglecancellation={this.togglecancellation}
          toggleSplCancel={this.toggleSplCancel}
          isCancellation={isCancellation}
          rmvHtmlFunc={this.rmvHtmlFunc}
          isSpclIns={isSpclIns}
          roomPriceInfo={roomPriceInfo} />}
        {isPriceFail && <div className="modal-body paymentError">
          <div className="socialBtnGroup" />
          <span className="erroricon"><i class="fas fa-exclamation-triangle"></i></span>
          <p>{priceErrMsg && priceErrMsg !=null ? priceErrMsg : "An Unexpected error has occurred , Please try again later"} </p>
          <button
            type="button"
            className="goBack"
            onClick={this.goBack}>Go Back</button>
        </div>}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  isSearching: state.hotelReducer.isSearching,
  hotel: state.hotelReducer.hotel,
  isReserve: state.hotelReducer.isReserve,
  sessionId: state.hotelReducer.sessionId,
  searchDate: state.hotelReducer.searchDate,
  pricedTotalFare: state.hotelReducer.pricedTotalFare,
  quotedTotalFare: state.hotelReducer.quotedTotalFare,
  fareBreakup: state.hotelReducer.fareBreakup,
  pricedRooms: state.hotelReducer.pricedRooms,
  rates: state.hotelReducer.rates,
  requestedOccupancies: state.hotelReducer.requestedOccupancies,
  roomOccupancies: state.hotelReducer.roomOccupancies,
  rooms: state.hotelReducer.rooms,
  isPriceFail: state.hotelReducer.isPriceFail,
  roomPriceInfo: state.hotelReducer.roomPriceInfo,
  loginDetails: state.loginReducer.loginDetails,
  selectedCurrency: state.commonReducer.selectedCurrency,
  priceErrMsg: state.hotelReducer.priceErrMsg
});

const mapDispatchToProps = dispatch => ({
  getRoomPrice: (payload) =>
    dispatch(getRoomPrice(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RoomResContent));
