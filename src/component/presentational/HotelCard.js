import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import moment from "moment";
import { connect } from "react-redux";
import {
  map as _map,
  find as _find,

} from 'lodash';
import {compareHotel} from "../../service/hotel/action";

import ImageCarousel from '../presentational/ImageCarousel';
import UserRating from './UserRating';

import img_whereIcon from "../../asset/images/Where Icon (Map Marker).svg";
import img_unAvaliable from "../../asset/images/No_Image.jpg";
import GoogleApiWrapper from "../container/map";

var currencies = require('country-data').currencies;

class HotelCard extends Component {
  state = {
    isExpand: false,
    isShowMap: false,
    selectedHotel: null,
    compareList: []
  }

  showMap = (selectedHotel) => {
    sessionStorage.setItem("maphotelList", JSON.stringify(this.props.hotelList));
    this.setState({ isShowMap: true, selectedHotel});

  }
  closeModal = () => {
    this.setState({
      isShowMap: false
    });
  }

  //  currencyFormat = () => {

  //  }

  render() {
    const { hotel, checkin, checkout, compareHotelList } = this.props;
    const hotelId = _map(compareHotelList, "id");
    const { isExpand } = this.state;
    const locationRef = `https://maps.google.com/?q=${hotel.geocode.lat},${hotel.geocode.long}`
    const detailedAddress = hotel.contact.address.line1 + ", " + hotel.contact.address.line2 + ", " + hotel.contact.address.city.name + ", " + hotel.contact.address.countryCode + ", " + hotel.contact.address.postalCode;
    let noOfNights = moment(checkout).diff(moment(checkin), 'days');

    let curFormat = JSON.parse(localStorage.getItem("currency"));
    curFormat = curFormat.CURRENCY_FORMAT;
    
    let actualFare = (hotel.basefare / noOfNights);
    // var actualFare = (hotel.basefare / noOfNights);
    actualFare = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(actualFare.toFixed(2));

    const descriptionsData = _find(hotel.descriptions, ['type', 'General']);
    let description = descriptionsData
      ? descriptionsData['value']
      : "Description not available";
    const selectedCurrencyVal = currencies[this.props.selectedCurrency].symbol;
    let includeTaxTotal = +hotel.basefare;
    includeTaxTotal = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(includeTaxTotal.toFixed(2));
    return (
      <React.Fragment>
      {
          this.props.hotelList.length > 0 ? (
            this.state.isShowMap ? (
              <GoogleApiWrapper
                hotelList={this.props.hotelList}
                selectedHotel={this.state.selectedHotel}
                isShowMap={this.state.isShowMap}
                open={this.state.isShowMap}
                closeModal={this.closeModal}
              />
            ): null
            
          ): null
      }


      <div className="sectionCard hotelCard" onMouseOver={() => this.props.onHoverHotel(hotel.id)} onMouseLeave={() => {this.props.onHoverHotel(null)}}>
        <div className="d-flex flex-row smallColumn">
          {hotel.images.length
            ? <ImageCarousel
              hotelName={hotel.name}
              imageList={_map(hotel.images, (each, i) => ({
                name: 'img' + { i },
                url: each.URL
              }))}
              thumbNail={{name: 'img1', url: hotel.images[0].URL}}
              />
            : <ImageCarousel />}


          <div className="detailsBg flex-column">
            <UserRating rating={hotel.rating} />
            <h4>{hotel.name}</h4>
            <p>
              <img src={img_whereIcon} alt="" />
              <a onClick={()=>{window.open('/hotelMapView/search'+window.location.search, '_blank')}} title={detailedAddress}  id={hotel.id} style={{cursor:'pointer'}} rel="noreferrer">
                {detailedAddress.substring(0, 30) + '...'}
              </a>
            </p>
            <p>
              <span>{isExpand
                ? description
                : description.substring(0, 125)}
                <span style={{ color: 'cornflowerblue' }} onClick={() => this.setState({ isExpand: !isExpand })}>
                  {description != "Description not available" ? isExpand
                    ? ' ...show less'
                    : ' ...show more' : null}
                </span>
              </span>
            </p>
          </div>
          <div className="rateShowDiv flex-column">
            <div className="priceDiv">
              {/* <strike>{selectedCurrencyVal}{hotel.fare.baseFare}</strike> */}
              <h2><span style={{ fontSize: '16px' }}>{selectedCurrencyVal}</span>&nbsp;{actualFare}</h2>
              <p style={{textAlign:"center", fontSize:"10px"}}>Total cost per night</p>
            </div>
            <p style={{fontSize:"13px", marginTop: "-12px", textAlign: "center", marginRight: "-12px"}}className="totalAmt">Excluding taxes and fees</p>
            <button className="compareBtn" disabled={compareHotelList.length === 4 || hotelId.includes(hotel.id)} onClick={() => this.props.compareHotel(hotel)}>
              <i className="fas fa-plus"></i>{" "}Compare
            </button>
            <button type="button" onClick={() => this.props.onSelectHotel(hotel.id)} className="selectRoomBtn">
              Select Room
            </button>
          </div>
        </div>
      </div>
      </React.Fragment>);
  }
}

const mapStateToProps = state => ({
  selectedCurrency: state.commonReducer.selectedCurrency,
  hotelList: state.hotelReducer.hotelList,
  compareHotelList: state.hotelReducer.compareHotelList
});

export default withRouter(connect(mapStateToProps)(HotelCard));
