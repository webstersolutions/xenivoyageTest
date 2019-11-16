import React, { Component } from "react";
import moment from 'moment';
import { connect } from "react-redux";
import queryString from "query-string";

import img_DateArrow from "../../../asset/images/Date Arrow.png";
// import { searchHotel } from "../../../service/hotel/action";
class FlightSearchBanner extends Component {
  
  state={
     checkin:"",
     checkout:""
  }
 
 
  render() {
   let { carDropDate, carDropTime,carPickUpDate,carPickUpTime,driverAge,dropOffLocation,pickUpLocation } = queryString.parse(window.location.search)
    return (
      <div>
         <div className="sectionCard searchRes">
            <div className="text-center searchInfo">
              <h3>  Choose your departure to new york </h3>
              <ul>
                <li className="border">
                  <h5>{moment(carPickUpDate).format('MM/DD/YYYY')}</h5>
                  <p>{moment(carPickUpDate).format('dddd')}</p>
                </li>
                {/* <li>
                  <img src={img_DateArrow} alt="" />
                </li>
                <li className="border">
                  <h5>{moment(carDropDate).format('MM/DD/YYYY')}</h5>
                  <p>{moment(carDropDate).format('dddd')}</p>
                </li> */}
              </ul>
            </div>
         </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  carList: state.carReducer.carList,
  carCount: state.carReducer.carCount
})
const mapDispatchToProps = dispatch => ({
 
})
export default connect(mapStateToProps, mapDispatchToProps)(FlightSearchBanner)

