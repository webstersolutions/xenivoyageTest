import React, { Component } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { map as _map, flatMapDeep as _flatMapDeep } from "lodash";

import {
  getRoomPrice
} from "../../../service/hotel/action";

import StateLessRoomReservation from "../../presentational/StateLessRoomReservation";

import axios from "../../../Utils/request-process";

import URL from '../../../asset/configUrl';

class RoomResContent extends Component {
  state = {
    isCancellation: false,
    searchDate: '',
    isSpclIns: false,
    isPriceFail:false,
    roomPriceInfo:[]
  }

  componentDidMount() {
    // here we should check hotel ID before rendering
    // if (!this.props.sessionId || !this.props.isReserve) {

    if(this.props.load){
      if(this.props.load.mount == true){
        this.props.load.start()
      }
    }
    this.getResInfo(this.props.queryValue)

    
    window.scrollTo(0, 0)
    // }
  }

  // componentWillReceiveProps(newProps) {
  //   if (this.props.location !== newProps.location) {
  //     this.getResInfo(newProps.location)
  //   }
  // }

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
                email: this.props.loginDetails && this.props.loginDetails.email || ""
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
                email: this.props.loginDetails && this.props.loginDetails.email || ""
              }
            })
        )
      })
    )
  }

  getResInfo = queryValue => {
    const values = queryValue
    this.setState({ searchDate: values })
    const { sessionId, hotelId, recomId, roomCount } = values;
    const  selectedCurrency = this.props.itineryData.bookingData.currency;
    const {checkin,checkout} =this.props.queryValue
    
    axios.post(URL.hotel.ROOM_PRICE,_flatMapDeep(this.payloadGenerate(sessionId, hotelId, selectedCurrency, recomId, roomCount)) )
        .then(response => {
            let dataArray=response.data.data.map((value)=>{
              
                let valueReturn = Object.assign({}, value);
                valueReturn.checkin = checkin;
                valueReturn.checkout = checkout;
                return valueReturn
          
            })

            this.props.addData(dataArray)
            this.setState({
                roomPriceInfo:response.data.data,
                isPriceFail:false
            })
            if(this.props.load){
                this.props.load.stop()
            }
    })
    .catch((err)=>{
      if(this.props.load){
        this.props.load.stop()
        if(this.props.errorCatch){
          this.props.errorCatch()
        }
    }
    })
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
    const { isPriceFail } = this.state;
    const { isCancellation, isSpclIns,roomPriceInfo } = this.state;
    const values = queryString.parse(window.location.search)
    const {checkin,checkout} =this.props.queryValue
    // const checkout = values.checkout;
    return (
      <div className="">
         <div className="selectRoomItemsBg " STYLE=""> <h6 STYLE="color:#464646">Itinerary item : {this.props.bookingSequence}</h6></div>
    
        { roomPriceInfo.length !=0 && <StateLessRoomReservation
          {...this.props}
          bookingDate={this.state.searchDate}
          checkin={checkin}
          checkout={checkout}
          togglecancellation={this.togglecancellation}
          toggleSplCancel={this.toggleSplCancel}
          isCancellation={isCancellation}
          rmvHtmlFunc={this.rmvHtmlFunc}
          isSpclIns={isSpclIns}
          roomPriceInfo={roomPriceInfo} />}
        {/* {isPriceFail && <div className="otherSectionBg modal-body paymentError">
          <div className="socialBtnGroup" />
          <span className="erroricon"><i class="fas fa-exclamation-triangle"></i></span>
          <p>Please clear itinerary and add again.</p>
          <button
            type="button"
            className="goBack"
            onClick={this.goBack}>Go Back</button>
        </div>} */}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  selectedCurrency: state.commonReducer.selectedCurrency,
  loginDetails: state.loginReducer.loginDetails
});

const mapDispatchToProps = dispatch => ({
  getRoomPrice: (payload) =>
    dispatch(getRoomPrice(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RoomResContent));
