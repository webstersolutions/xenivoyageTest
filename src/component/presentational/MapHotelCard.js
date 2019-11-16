import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import moment from "moment";
import { connect } from "react-redux";
import {
  map as _map,
  find as _find,

} from 'lodash';

import ImageCarousel from '../presentational/ImageCarousel';
import UserRating from './UserRating';

import img_whereIcon from "../../asset/images/Where Icon (Map Marker).svg";
import img_unAvaliable from "../../asset/images/No_Image.jpg";

var currencies = require('country-data').currencies;

class MapHotelCard extends Component {
  state = {
    isExpand: false,
    isShowMap: false,
    selectedHotel: null
  }

  render() {
    const { hotel, checkin, checkout } = this.props;
    const { isExpand } = this.state;
    var noOfNights = moment(checkout).diff(moment(checkin), 'days');

    var actualFare = (hotel.fare.baseFare / noOfNights).toFixed(2);
    const descriptionsData = _find(hotel.descriptions, ['type', 'General']);
    let description = descriptionsData
      ? descriptionsData['value']
      : "Description not available";
    const selectedCurrencyVal = currencies[this.props.selectedCurrency].symbol;
    return (
      <React.Fragment>        
            <div className="sectionCard" style={{ cursor: "pointer" }} onClick={() => this.props.handleOnSelectRoom(hotel.id)}>
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


          <div className="productMapMainDiv">
                <div className="detailsBasic flex-column">
                    <h4>{hotel.name}</h4>
                    <UserRating rating={hotel.rating} />
                </div>
                <div className="flex-column">
                    <div className="priceDiv">
                        {/* <strike>{selectedCurrencyVal}{hotel.fare.baseFare}</strike> */}
                        <h2><span style={{ fontSize: '16px' }}>{selectedCurrencyVal}</span>&nbsp;{actualFare}</h2>
                        <p>per night</p>
                    </div>
                </div>
          </div>
        </div>
      </div>
      </React.Fragment>);
  }
}

const mapStateToProps = state => ({
  selectedCurrency: state.commonReducer.selectedCurrency,
  hotelList: state.hotelReducer.hotelList,
});

export default withRouter(connect(mapStateToProps)(MapHotelCard));
