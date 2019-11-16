import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { browserHistory } from 'react-router'
import { NavLink } from 'react-router-dom';
import Notifications, { notify } from "react-notify-toast";
import { connect } from "react-redux";
import LandingSignin from "../../src/component/container/login/LandingSignInModal";
import SignIn from "../../src/component/container/login/SignInModal"



import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopNav from '../component/container/TopNav';
import ScrollToTop from '../view/ScrollToTop';

import img_book from '../asset/images/Booking Experience.svg';
import walking from '../asset/images/Xeniwalk.svg';
import xenicoin from '../asset/images/Xennies.png';
import gift from '../asset/images/Xenivoyage.svg';
import wish from '../asset/images/Wishlist.svg';
import multi from '../asset/images/Group Bookings.svg';
import change from '../asset/images/change.png'
import img_travel from '../asset/images/landing/Calendar.png'
import img_cart from '../asset/images/landing/Cart.png'
import img_company from '../asset/images/landing/company1.png'
import img_rightArrow from '../asset/images/landing/right-arrow.png'
import img_family from '../asset/images/landing/family-silhouette1.png'
import img_itinerary from '../asset/images/landing/Itinerary-copy.png'
import img_support from '../asset/images/landing/supports1.png'
import img_travelCateg from '../asset/images/landing/travelCateg.png'
import img_tripEnjoy from '../asset/images/landing/tripEnjoy.png'
import img_xeniappText from '../asset/images/landing/xeniappText.png'
import img_XENIVOYAGE from '../asset/images/landing/XENIVOYAGE.png'
import img_bannerImage from '../asset/images/landing/bannerInage.jpg'

import momentTimezone from "moment-timezone"; 

import Subscription from '../component/Subscription'

class Landing extends Component {
  state = {
    isVisibleSignIn: false,
    isLandingSingup:false,
    isdivHide: false,
    isgoPro: false,
    bookNow: false
  };
  handleGopro = value => {
    this.setState({ isgoPro: value });
  };
  componentDidMount() {
    let timeZone = momentTimezone.tz.guess();
    timeZone = momentTimezone.tz(timeZone).format();
    console.log(timeZone)
    // if(!sessionStorage.getItem("GEO_ZONE")){
      sessionStorage.setItem("GEO_ZONE", timeZone)
    // }
    
    window.scrollTo(0, 0);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.loginDetails != nextProps.loginDetails && nextProps.loginDetails !=null){
      this.setState({
        bookNow: true
      })
    }
    
  }

  handleSignup = () => {
    this.props.history.push("/hotel");
  };

  handleSignIn = () => {
    this.setState({ isVisibleSignIn: true });
    this.setState({ isdivHide: true });
  };

  bookNow = () => {
    const {bookNow} = this.state;
    const {loginDetails} = this.props;
    if((bookNow || loginDetails !=null) && loginDetails.message !== "failure"){
      this.props.history.push("/hotel");
    }else{
      this.setState({ isVisibleSignIn: true });
      this.setState({ isdivHide: true });
    }
    
  }

  handleSignFromOpen = () => {

    if(!this.props.loginDetails){
      this.setState({ isSignUpHide: true });
      this.setState({ isdivHide: true });
      this.setState({ isLandingSingup: true });
    }else{
      notify.show("You are already signed up","success",3000)
    }
  };

  onClose = () => {
    this.setState({ isLandingSingup: false , isVisibleSignIn:false });
  };
 

  render() {
    const { isdivHide, isVisibleSignIn ,isLandingSingup } = this.state;
    const renderLandingSignInModal = isLandingSingup && (
      <LandingSignin onHide={this.onClose} isdivHide={isdivHide} />
    );
    const renderSignInModel = isVisibleSignIn &&  <SignIn onHide={this.onClose} isdivHide={isdivHide}/>
    const subscription = this.state.isgoPro && (
      <Subscription handleGopro={this.handleGopro} />
    );

    return (
      <React.Fragment>
        <TopNav
          onSignIn={this.handleSignIn}
          {...this.props}
          handleGopro={this.handleGopro}
        />
        <div className="landing-page">
          {subscription}
          <Notifications />
          <ToastContainer autoClose={4000} transition={Flip} />
          {renderLandingSignInModal}
          {renderSignInModel}

          <div className="container-fluid m-0 p-0">
            <div className="slider-image d-flex justify-content-center align-items-center">
              <div className="container d-flex justify-content-center">
                <div className="slide-text">
                  <div className="slide-heading d-flex justify-content-center">
                    <h1 style={{fontSize:'46px'}}>
                      Welcome to <span>Xeniapp</span>
                    </h1>
                  </div>
                  <p style={{fontSize:'21px'}}>A New Travel Booking Experience</p>
                  <p style={{fontSize:'21px'}}>
                    Xeniapp is a travel booking portal that allows you to browse
                    and build your trip itinerary on a single page. You can add
                    flights, hotels or/and car rentals by simply dragging and
                    dropping them into your itinerary and book multiple items in
                    one click .
                  </p>

                  <div className="slide-button d-flex justify-content-center pt-2">
                    <button type="button" onClick={this.bookNow}>
                      Book Now
                    </button>
                  </div>
                  {/* <p className="justify-content-center">  <NavLink to="/hotel">  Continue Booking </NavLink> </p> */}
                </div>
              </div>
            </div>
          </div>
        <ScrollToTop />
          <div className="howItWorkSection">
            <div className="container">
              <h4 style={{fontSize:'26px'}} className="contentTitle">How It Works?</h4>
              <div  className="contentBody">
                <ul className="stepsBg">
                  <li className="rightArrow">
                    <div className="stepsImage">
                      <img src={img_travel} />
                    </div>
                    <p style={{fontSize:'16px'}} className="stepsText">
                      Select your Travel Dates & Location
                    </p>
                  </li>
                  <li className="rightArrow">
                    <div className="stepsImage">
                      <img src={img_travelCateg} />
                    </div>
                    <p style={{fontSize:'16px'}} className="stepsText">Book your Flight,Hotel or Car</p>
                  </li>
                  <li className="rightArrow">
                    <div className="stepsImage">
                      <img src={img_itinerary} />
                    </div>
                    <p style={{fontSize:'16px'}} className="stepsText">
                      Continue Building your Itinerary
                    </p>
                  </li>
                  <li className="rightArrow">
                    <div className="stepsImage">
                      <img src={img_cart} />
                    </div>
                    <p style={{fontSize:'16px'}} className="stepsText">
                      Preview & Checkout your Trip Itinerary
                    </p>
                  </li>
                  <li className="">
                    <div className="stepsImage">
                      <img src={img_tripEnjoy} />
                    </div>
                    <p style={{fontSize:'16px'}} className="stepsText">Enjoy your Trip</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="xeniapp-feature mt-5">
              <h4 style={{fontSize:'26px'}}>
                Sign up for exclusive deals catered to your booking requirements
              </h4>
              <p style={{fontSize:'21px'}}>I am a </p>
              {/* <div className="row">
                            <div className="col-lg-4 col-sm-4 col-xs-12 pl-3">
                                <div className="feature-list d-flex justify-content-start align-items-center">
                                    <img src={img_book} alt="" width='50px' height='50px' />
                                    <p>A New Booking Experience</p>
                                </div>
                                <div className="feature-para">
                                    <p>Our improved search functionality makes planning and customizing your trip quicker and easier. On Xeniapp, you can search and build your trip itinerary on a single page. This way you can add flights, hotels or/and car rentals by simply dragging and dropping them into your itinerary. </p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-4 col-xs-12 pl-3">
                                <div className="feature-list d-flex justify-content-start align-items-center">
                                    <img src={xenicoin} alt="" height='50px' />
                                    <p>Blockchain Settlement Engine</p>
                                </div>
                                <div className="feature-para">
                                    <p>We have built a blockchain transaction settlement engine that  allows for rapid settlement and tracking of transactions. This technology  will be the foundation of new functionalities such as commission tracking, efficient cancellation and  points accumulation and redemptions.</p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-4 col-xs-12 pl-3">
                                <div className="feature-list d-flex justify-content-start align-items-center">
                                    <img src={walking} alt="" width='50px' height='50px' />
                                    <p>Xeniwalk/Walking Tours</p>
                                </div>
                                <div className="feature-para">
                                    <p>When exploring a new city or discovering new parts of your own city, walking tours are a fun and unique way to explore. Xeniwalk aims to provide a comprehensive list of walking tours that are easily searchable by neighborhood and topic. Our platform for walking tours is designed to allow tourists and locals to find and book walking tours and to allow tour guides to list tours for booking. </p>
                                </div>
                            </div>
                        </div> */}
              {/* <div className="row mt-3">
                            <div className="col-lg-4 col-sm-4 col-xs-12 pl-3">
                                <div className="feature-list d-flex justify-content-start align-items-center">
                                    <img src={gift} alt="" width='50px' height='50px' />
                                    <p>Xenivoyage</p>
                                </div>
                                <div className="feature-para">
                                    <p>If you don’t want to build your own itinerary, we have worked with travel agents to put together special travel packages. So you can skip the planning process, and just enjoy the trip. These packages offer you great deals to enjoy unique experiences in destinations around the world.</p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-4 col-xs-12 pl-3">
                                <div className="feature-list d-flex justify-content-start align-items-center">
                                    <img src={wish} alt="" width='50px' height='50px' />
                                    <p>Wishlist (Name your Price)</p>
                                </div>
                                <div className="feature-para">
                                    <p>With our Name Your Price tool, you will be able to build the itinerary of your dreams, save it for later and then name your desired price for each item. Xeniapp will then search for travel packages matching the one in your wishlist and alert you when they become available. </p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-sm-4 col-xs-12 pl-3">
                                <div className="feature-list d-flex justify-content-start align-items-center">
                                    <img src={multi} alt="" width='50px' height='50px' />
                                    <p>Express Group Bookings</p>
                                </div>
                                <div className="feature-para">
                                    <p>Need to make multiple group bookings for different sets of travellers? Xeniapp allows users to do this is in one checkout cycle, and it’s simple. You no longer have to checkout for each itinerary. Book faster for multiple groups with Xeniapp. </p>
                                </div>
                            </div>
                        </div> */}
              <div className="signUpTypes">
                <div className="typeOfDiv">
                  <div className="typeOfImage">
                    <img src={img_support} />
                  </div>
                  <div className="typeContent">
                    <h5 style={{fontSize:'17px'}}>Travel Agent</h5>
                    {/* <button type="button" onClick={this.handleSignFromOpen}>Sign Up</button> */}
                  </div>
                </div>
                <div className="typeOfDiv">
                  <div className="typeOfImage">
                    <img src={img_company} />
                  </div>
                  <div  className="typeContent">
                    <h5 style={{fontSize:'17px'}}>Corporate/SME</h5>
                    {/* <button type="button"  onClick={this.handleSignFromOpen}>Sign Up</button> */}
                  </div>
                </div>
                <div className="typeOfDiv">
                  <div className="typeOfImage">
                    <img src={img_family} />
                  </div>
                  <div  className="typeContent">
                    <h5 style={{fontSize:'17px'}}>Individual or Family</h5>
                    {/* <button type="button"  onClick={this.handleSignFromOpen}>Sign Up</button> */}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="text-center"
                onClick={this.handleSignFromOpen}
              >
                Sign Up
              </button>
            </div>
          </div>
          {/* <div className="change-way mt-5">
            <div className="container">
              <h4 style={{fontSize:'26px'}}>Visit our sister site for Unique Travel Packages</h4>
              <a href="https://xenivoyage.com/" target="_blank">
                <div className="xenivovyageImgBanner">
                  <img src={img_XENIVOYAGE} />
                  <h4 style={{fontSize:'19px'}}>
                    Unique and highly customizable itineraries with great prices
                  </h4>
                </div>
              </a>

              <div className="changeTravelCotent">
                <h3 style={{fontSize:'23px'}}>Change the way you travel with</h3>
                <div className="changeTravelBorder">
                  <img src={img_xeniappText} />
                </div>
              </div>
            </div>
          </div> */}
          <footer className="copy-right mt-5">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <p style={{fontSize:'16px'}}>Copyright © 2019 Xeniapp Inc. All rights reserved.</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  loginDetails: state.loginReducer.loginDetails,
});
const mapDispatchToProps = dispatch => ({

})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing);

   

  
