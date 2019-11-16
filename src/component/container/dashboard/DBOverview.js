import React, { Component } from 'react';
import { connect } from "react-redux";
import { map as _map } from 'lodash'
import moment from 'moment';

import { recentActivityList } from "../../../service/dashboard/action";

import img_xeniapp from "../../../asset/images/dashboard/xeniapp.png";
import img_coins from "../../../asset/images/dashboard/coins.jpg";
import img_world from "../../../asset/images/dashboard/world.png";
import img_city from "../../../asset/images/dashboard/city.png";
import img_location from "../../../asset/images/dashboard/location.png";
import img_flight from "../../../asset/images/dashboard/flight.png";
import img_plane from "../../../asset/images/plane.png";
import img_hotel from "../../../asset/images/hotel-building.png";
import img_car from "../../../asset/images/car.png";
import img_transfer from "../../../asset/images/chauffeur.png";
import img_activities from "../../../asset/images/activities.png";
import img_packages from "../../../asset/images/package.png";

import img_xennies from '../../../asset/images/dashboard/logo-xennies.png';
import { tripCarDeatiledList } from '../../../service/car/action';
import { getActivityTrips } from '../../../service/activities/action';
import { getPackageTrips } from '../../../service/package/action';

import {tripTransferDeatiledList} from "../../../service/transfer/action";
const _typeIcon = { Hotel: img_hotel, Car: img_car, Flight: img_plane, transfer: img_transfer }

class DBOverview extends Component {

  componentWillMount(){
    window.scrollTo(0,0);
    const userSession = JSON.parse(sessionStorage.getItem('loginInfo'));
    // const { email } = this.props.loginDetails;
    const { email } = userSession;
     const data = {
       email
     };
     this.props.recentActivityList(data);
     this.props.cartripDeatiledList({ email:email})
     this.props.transfertripDeatiledList({email:email});
     this.props.getActivityTrips(email);
     this.props.getPackageTrips(email);

  }

  // componentDidMount() {
  //   const userSession = JSON.parse(sessionStorage.getItem('loginInfo'));
  //  // const { email } = this.props.loginDetails;
  //  const { email } = userSession;
  //   const data = {
  //     email
  //   }
  //   this.props.recentActivityList(data);
  //   this.props.cartripDeatiledList({ email:email})
  // }

hotel = () =>{
  this.props.history.push("/dashboard/my-trips?hotel");
}
car = () =>{
  this.props.history.push("/dashboard/my-trips?car");
}
transfer = () =>{
  this.props.history.push("/dashboard/my-trips?transfer");
}

activity = () =>{
  this.props.history.push("/dashboard/my-trips?activity");
}
package = () =>{
  this.props.history.push("/dashboard/my-trips?package");
}
  render() {
    const { recentList, loginDetails, myTripList  ,activityTripList,packageTripList} = this.props;
    const userSession = JSON.parse(sessionStorage.getItem('loginInfo'));
    const hotelBooked = myTripList ? myTripList.length : 0;
    const createdDate = moment(userSession.created_date).format("MMMM  YYYY");
    const transfercount = this.props.transferMyTrips ? this.props.transferMyTrips.length : 0;
   // console.log(recentList)
    return <div className="dashRightSide align-self-start">
      <div className="d-flex flex-row resWrap">
        <div className="overViewIcon">
          <div>
            <img src={img_xennies} />
          </div>
          <h4>
            10 <img src={img_coins} width="20px" />
          </h4>
          <p>Xennies</p>
        </div>
        <div className="overViewIcon">
          <div>
            <img src={img_world} className="overViewIxonImg" />
          </div>
          <h4>0%</h4>
          <p>of the World</p>
        </div>
        <div className="overViewIcon">
          <div>
            {" "}
            <img src={img_city} className="overViewIxonImg" />
          </div>
          <h4>0</h4>
          <p>Cities</p>
        </div>
        <div className="overViewIcon">
          <div>
            {" "}
            <img src={img_location} />
          </div>
          <h4>0</h4>
          <p>Countries</p>
        </div>
        <div className="overViewIcon">
          <div>
            {" "}
            <img src={img_flight} />
          </div>
          <h4>0</h4>
          <p>Trips</p>
        </div>
      </div>
      <div className="d-flex flex-row resWrap">
        <div className="overViewCateg">
          <img src={img_plane} />
          <span>0 Flights booked</span>
        </div>
        <div className="overViewCateg" style={{cursor:"pointer"}} onClick={this.hotel}>
          <img src={img_hotel} />
          <span>{hotelBooked ? hotelBooked :"0" } Hotels booked</span>
        </div>
      </div>
      <div className="d-flex flex-row resWrap">

        <div className="overViewCateg" style={{cursor:"pointer"}} onClick={this.car}>
          <img src={img_car} />
          <span>{this.props.carMyTrips.length} Cars booked</span>
        </div>
        
        <div className="overViewCateg" style={{cursor:"pointer"}} onClick={this.transfer}>
          <img src={img_transfer} />
          <span>{transfercount} Transfer booked</span>
        </div>
      </div>
      <div className="d-flex flex-row resWrap">
        <div className="overViewCateg" style={{cursor:"pointer"}} onClick={this.activity}>
          <img src={img_activities} />
          <span>{activityTripList.length} Activities booked</span>
        </div>
        <div className="overViewCateg" style={{cursor:"pointer"}} onClick={this.package}>
        <img src={img_packages} width="20px" alt=""/>
          {/* <img src={img_activities} /> */}
          <span>{packageTripList.length} Packages booked</span>
        </div>
      </div>
      
      <div className="recentActivity">
        <h4>Recent Booking History</h4>
        <ul>
          {recentList && recentList.length ?
            _map(recentList.reverse(), (each, i) => {
              //console.log(each)
              
              return each.booking_type == "Hotel" && (
                <li key={i}>
                  <span>
                    <img src={_typeIcon[each.booking_type]} alt='booking_type' />
                  </span>
                  <span>
                    You booked a <b> Room </b> at  <b> {each.hotel_address && each.hotel_address.name}</b> in <b>
                      {" "}
                      {each.hotel_address && each.hotel_address.contact.address.city.name}
                    </b>
                  </span> 
                  {/* <span>{each.hours}</span> */}
                </li>
              )
            })
            : <p>No recent booking found</p>}
          {/* TODO : Need to redesign flight and car activity once integrated */}
          {/* <li>
            <span>
              <img src={img_hotel} />
            </span>
            <span>
              You booked a <b> Room </b> at the <b> Holiday inn</b> in <b>
                {" "}
                Sugarland,Texas
                </b>
            </span> <span>2 Days Ago</span>
          </li>
           <li>
              <span>
                <img src={img_plane} />
              </span> <span>
                You booked a <b> Round Trip </b> from <b> New York </b> to <b>
                  {" "}
                  Houston{" "}
                </b>
              </span> <span>4 Days Ago</span>
            </li>
          <li>
            <span>
              <img src={img_car} />
            </span>
            <span>
              You booked a <b> Midsize Sedan </b> form<b> Oct 20</b> to <b>
                {" "}
                Oct 26
                </b>
            </span>
            <span>8 Days Ago</span>{" "}
          </li>
          <li>
            <span>
              <img src={img_activities} />
            </span>
            <span>
              You booked <b> 1 Pass </b> for the <b>
                {" "}
                Hudson Highland Trail
                </b>
            </span>
            <span>15 Days Ago</span>{" "}
          </li>
          <li>
            <span>
              <img src={img_chat} />
            </span>
            <span>
              A new <b> Review</b> was posted for the <b> Holiday Inn</b> in <b>
                {" "}
                Sugarland,Texas
                </b>
            </span> <span>1 Days Ago</span>
          </li>
          <li>
            <span>
              <img src={img_heart} />
            </span>
            <span>
              There has been a price drop on a <b> Wishlist </b> item- <b>
                {" "}
                Atlantis, Dubai
                </b>
            </span> <span>11 Hours Ago</span>
          </li> */}
        </ul>
      </div>
    </div>
  }
}
const mapStateToProps = state => ({
  recentList: state.dashboardReducer.recentList,
  loginDetails: state.loginReducer.loginDetails,
  myTripList: state.dashboardReducer.myTripList,
  carMyTrips: state.carReducer.carMyTrips,
  transferMyTrips:state.transferReducer.transferMyTrips,
  activityTripList:state.activityReducer.activityTripList,
  packageTripList:state.packageReducer.packageTripList,

});

const mapDispatchToProps = dispatch => ({
    recentActivityList: (data) => dispatch(recentActivityList(data)),
    cartripDeatiledList: (data) => dispatch(tripCarDeatiledList(data)),
    transfertripDeatiledList: (data) => dispatch(tripTransferDeatiledList(data)),
    getActivityTrips: (data) => dispatch(getActivityTrips(data)),
    getPackageTrips: (data) => dispatch(getPackageTrips(data))

});

DBOverview.defaultProps={
  carMyTrips:[],
  
}
export default connect(mapStateToProps, mapDispatchToProps)(DBOverview);