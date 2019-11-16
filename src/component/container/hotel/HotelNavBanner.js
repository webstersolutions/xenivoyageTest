import React, { Component } from 'react';
import { connect } from "react-redux";
import {  withRouter } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import img_RightArrow from "../../../asset/images/Right Arrow - All Steps.png";
import img_LeftArrow from "../../../asset/images/Left Arrow - All Steps.png";

import GoogleApiWrapper from '../map/FilterMap';
import queryString from "query-string";


class HotelNavBanner extends Component {
  state = {
    isShowMap: false
  }
  showFilterMap = (e) => {
    console.log("List", this.props.hotelList)
    document.body.classList.add('showMapPopup');
    sessionStorage.setItem("filterMapHotel", JSON.stringify(this.props.hotelList));
    this.setState({ isShowMap: true });
  }
  closeModal = () => {
    document.body.classList.remove('showMapPopup');
    this.setState({
      isShowMap: false
    })
  }

  handleOnSelectRoom = hotelId => {
    document.body.classList.remove('showMapPopup');
    const { sessionId, selectedCurrency } = this.props;

    const values = queryString.parse(window.location.search);
    console.log("vlues", selectedCurrency);
    const {
      checkin,
      checkout,
      adult,
      child,
      childAgeValues,
      searchText
    } = values;

    const searchString = {
      currency: selectedCurrency,
      sessionId,
      hotelId,
      checkin,
      checkout,
      adult,
      child,
      childAgeValues,
      searchText
    };
    this.setState({
      isShowMap: false
    }, () => {
      sessionStorage.setItem("maphotelList", JSON.stringify(this.props.hotelList));
      this.props.history.push(
        "/hotel/rooms?" + queryString.stringify(searchString)
      );
    })
  };

  // handleOnSelectRoom = (id) => {
  //   this.setState({
  //     isShowMap: false
  //   })
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState({ prevPath: this.props.location })
    }
  }
  goBack = e => {
    const { pathname } = this.props.history.location;
    
      if(pathname == "/hotel/rooms" && sessionStorage.getItem("searchURL") !=null && sessionStorage.getItem("searchURL") !="" && sessionStorage.getItem("searchURL") !=undefined){

      this.props.history.push("/hotel/search" + sessionStorage.getItem("searchURL"));
    } else if (pathname == "/hotel/search") {
      this.props.history.push("/hotel");
    } else if (pathname == "/hotel/reservation" && sessionStorage.getItem("roomURL") !=null && sessionStorage.getItem("roomURL") !="" && sessionStorage.getItem("roomURL") !=undefined) {  
      this.props.history.push("/hotel/rooms" + sessionStorage.getItem("roomURL"));
    } else {
      this.props.history.goBack();
    }
    
  };

  goForward = e => {
    const { pathname } = this.props.history.location;
      if(pathname == "/hotel/search" && sessionStorage.getItem("roomURL") !=null && sessionStorage.getItem("roomURL") !="" && sessionStorage.getItem("roomURL") !=undefined){      
      this.props.history.push("/hotel/rooms" + sessionStorage.getItem("roomURL"));

    } else if (pathname == "/hotel/rooms" && sessionStorage.getItem("reserveURL") !=null && sessionStorage.getItem("reserveURL") !="" && sessionStorage.getItem("reserveURL") !=undefined) {
      this.props.history.push("/hotel/reservation" + sessionStorage.getItem("reserveURL"));
    } else {
      this.props.history.goForward();
    }
  };


  render() {
    const { pathname } = this.props.history.location;
    const { isLoading, isLoadingFailure } = this.props;

    const geoCode = JSON.parse(sessionStorage.getItem('geoCode'));
    const locationRef = `https://maps.google.com/?q=${geoCode && geoCode.latitude},${geoCode && geoCode.longitude}`+ "&output=embed"

    return (
      <React.Fragment>
        
        {
          this.state.isShowMap ? (<GoogleApiWrapper closeModal={this.closeModal} handleOnSelectRoom={this.handleOnSelectRoom} />) : null
      }
        
        <div onClick={e => window.open('/hotelMapView/search'+window.location.search, '_blank')} className={`flex-column mapDiv ${pathname === '/hotel/search' ? 'd-block' : 'd-none'}`} style={{cursor: 'pointer'}}>
          <iframe src={locationRef} style={{ width: "100%", height: '92px', border: '1px solid rgb(106, 106, 106)',pointerEvents:'none' }} is="x-frame-bypass" frameborder="0" allowfullscreen alloworgin="true"></iframe>

         
        </div>
        <div className={`flex-column filterResult ${pathname === '/hotel/search' ? '' : 'otherSteps'}`}>

          <div className="sectionCard">
            <ul className="navigation">
              {/* <li ><img src={img_LeftArrow} alt="" onClick={() => this.props.history.goBack()} /></li> */}
              <li title="Back">
                <img src={img_LeftArrow} alt="" onClick={this.goBack} />
              </li>
              <li className={`line ${pathname === '/hotel/search' ? 'active' : ''}`}>
                <span>Select Hotel</span><a>1</a>
              </li>
              <li className={`line ${pathname === '/hotel/rooms' ? 'active' : ''}`}>
                <span>Select Room</span><a>2</a>
              </li>
              <li className={pathname === '/hotel/reservation' ? 'active' : ''}>
                <span>Confirm Room</span><a>3</a>
              </li>
              {/* <li><img src={img_RightArrow} alt="" onClick={() => this.props.history.goForward()} /></li> */}
              <li title="Next">
                <img src={img_RightArrow} alt="" onClick={this.goForward} />
              </li>

            </ul>

            {isLoading && <div className="greenLine"></div>}
            {isLoadingFailure && <div className="redLine"></div>}
            {/* <ToastContainer autoClose={4000} transition={Flip} /> */}

          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.loaderReducer.isLoading,
  isLoadingFailure: state.loaderReducer.isLoadingFailure,
  hotelList: state.hotelReducer.hotelList,
  sessionId: state.hotelReducer.sessionId,

});

export default connect(
  mapStateToProps,
  ""
)(withRouter(HotelNavBanner))

