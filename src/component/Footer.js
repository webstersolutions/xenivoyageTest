import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import xeniwalk from "../asset/images/aboutUs/xeniWalkLogo.png";
import xeniapp from "../asset/images/aboutUs/xenniesLogo.png";
import xenivoya from "../asset/images/aboutUs/xenivoyageLogo1.png";
import xeniair from "../asset/images/aboutUs/xeniAir.png";
import img_travel from "../asset/images/landing/Calendar.png";
import img_cart from "../asset/images/landing/Cart.png";
import img_company from "../asset/images/landing/company1.png";
import img_rightArrow from "../asset/images/landing/right-arrow.png";
import img_family from "../asset/images/landing/family-silhouette1.png";
import img_itinerary from "../asset/images/landing/Itinerary-copy.png";
import img_support from "../asset/images/landing/supports1.png";
import img_travelCateg from "../asset/images/landing/travelCateg.png";
import img_tripEnjoy from "../asset/images/landing/tripEnjoy.png";
import img_xeniappText from "../asset/images/landing/xeniappText.png";
import img_XENIVOYAGE from "../asset/images/landing/XENIVOYAGE.png";
import img_bannerImage from "../asset/images/landing/bannerInage.jpg";
import SignIn from "../component/container/login/SignInModal";
class Footer extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  state = {
    isVisibleSignIn: false,
    isdivHide: false
  };
  handleSignIn = () => {
    this.setState({ isVisibleSignIn: true });
    this.setState({ isdivHide: true });
    window.scrollTo(0, 0);
  };

  onClose = () => {
    this.setState({ isVisibleSignIn: false });
  };

  render() {
    const { isdivHide, isVisibleSignIn } = this.state;
    const renderSignInModal = isVisibleSignIn && (
      <SignIn onHide={this.onClose} isdivHide={isdivHide} />
    );
    return (
      <React.Fragment>
        {renderSignInModal}
        <div className="footerBg">
          <div className="container-flex">
            <div className="row" style={{ justifyContent: "center" }}>
              <div className="landing-page">
                <div className="howItWorkSection">
                  <div className="container" style={{ padding: "0px" }}>
                    <h4 style={{ fontSize: "26px" }} className="contentTitle">
                      How It Works?
                    </h4>
                    <div className="contentBody">
                      <ul className="stepsBg">
                        <li className="rightArrow">
                          <div className="stepsImage">
                            <img src={img_travel} />
                          </div>
                          <p style={{ fontSize: "16px" }} className="stepsText">
                            Select your Travel Dates & Location
                          </p>
                        </li>
                        <li className="rightArrow">
                          <div className="stepsImage">
                            <img src={img_travelCateg} />
                          </div>
                          <p style={{ fontSize: "16px" }} className="stepsText">
                            Book your Flight,Hotel or Car
                          </p>
                        </li>
                        <li className="rightArrow">
                          <div className="stepsImage">
                            <img src={img_itinerary} />
                          </div>
                          <p style={{ fontSize: "16px" }} className="stepsText">
                            Continue Building your Itinerary
                          </p>
                        </li>
                        <li className="rightArrow">
                          <div className="stepsImage">
                            <img src={img_cart} />
                          </div>
                          <p style={{ fontSize: "16px" }} className="stepsText">
                            Preview & Checkout your Trip Itinerary
                          </p>
                        </li>
                        <li className="">
                          <div className="stepsImage">
                            <img src={img_tripEnjoy} />
                          </div>
                          <p style={{ fontSize: "16px" }} className="stepsText">
                            Enjoy your Trip
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="container">
                  <div className="xeniapp-feature mt-5">
                    <h4 style={{ fontSize: "26px" }}>
                      Sign up for exclusive deals catered to your booking
                      requirements
                    </h4>
                    <p style={{ fontSize: "21px" }}>I am a </p>
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
                          <h5 style={{ fontSize: "17px" }}>Travel Agent</h5>
                          {/* <button type="button" onClick={this.handleSignFromOpen}>Sign Up</button> */}
                        </div>
                      </div>
                      <div className="typeOfDiv">
                        <div className="typeOfImage">
                          <img src={img_company} />
                        </div>
                        <div className="typeContent">
                          <h5 style={{ fontSize: "17px" }}>Corporate/SME</h5>
                          {/* <button type="button"  onClick={this.handleSignFromOpen}>Sign Up</button> */}
                        </div>
                      </div>
                      <div className="typeOfDiv">
                        <div className="typeOfImage">
                          <img src={img_family} />
                        </div>
                        <div className="typeContent">
                          <h5 style={{ fontSize: "17px" }}>
                            Individual or Family
                          </h5>
                          {/* <button type="button"  onClick={this.handleSignFromOpen}>Sign Up</button> */}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-center"
                      onClick={this.handleSignIn}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row " style={{marginTop:"4%"}}>
              <div
                className="col-md-12 col-sm-12 col-lg-12"
                style={{ marginBottom: "30px" }}
              >
                <div className="footer-about">
                  <h1>About Xeniapp</h1>
                  <p>
                    Xeniapp is a <b>travel booking portal </b> that allows you
                    to browse and build your trip itinerary on a single page.
                    You can add flights, hotels or/and car rentals by simply
                    dragging and dropping them into your itinerary.
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="exploreSection mt-5">
                <div className="container">
                 
                    <div className="explore-product-div">
                      <ul>
                        <li
                          className="wow fadeInLeft animated"
                          data-wow-duration="0.5s"
                        >
                          <a href="https://xenivoyage.com" target="_blank">
                            <img src={xenivoya} alt="product-logo" />
                          </a>
                        </li>
                        <li
                          className="wow fadeInLeft animated"
                          data-wow-duration="1s"
                        >
                          <a href="https://xennies.io/xennies" target="_blank">
                            <img src={xeniapp} alt="product-logo" />
                          </a>
                        </li>
                        <li
                          className="wow fadeInLeft animated"
                          data-wow-duration="1.5s"
                        >
                          <a href="https://xeniwalk.com" target="_blank">
                            <img src={xeniwalk} alt="product-logo" />
                          </a>
                        </li>
                      </ul>
                  
                  </div>
                </div>
              </div> */}
            {/* <div className="col-md-4 col-sm-6 col-12" >
              <div className="exploreSection">
                <div className="container">
                 
                    <div className="explore-product-div">
                    <div className="keepconnect" style={{textAlign:'center'}}>
                    <h1>Services</h1>
                    </div>
                      <ul style={{float:"right",width:'50%'}}>
                        <li
                          className="wow fadeInLeft animated"
                          data-wow-duration="0.5s"
                        >
                          <a href="https://xenivoyage.com" target="_blank">
                            <img src={xenivoya} alt="product-logo" />
                          </a>
                        </li>
                        <li
                          className="wow fadeInLeft animated"
                          data-wow-duration="1s"
                        >
                          <a href="https://xennies.io/xennies" target="_blank">
                            <img src={xeniapp} alt="product-logo" />
                          </a>
                        </li>
                        </ul>
                        <ul style={{width:'50%'}}>
                        <li
                          className="wow fadeInLeft animated"
                          data-wow-duration="1.5s"
                        >
                          <a href="https://xeniair.com" target="_blank">
                            <img src={xeniair} alt="product-logo" />
                          </a>
                        </li>
                         <li
                          className="wow fadeInLeft animated"
                          data-wow-duration="1.5s"
                        >
                          <a href="https://xeniwalk.com" target="_blank">
                            <img src={xeniwalk} alt="product-logo" />
                          </a>
                        </li>
                      </ul>
                      
                  </div>
                </div>
              </div>
              </div> */}
            <div className="row borderDashed">
              <div class="col-md-1" />
              <div className="col-md-3 col-sm-4 col-12">
                <div className="keepconnect">
                  <h1>Keep Connected</h1>
                  <ul>
                    <li>
                      <NavLink to="/contactUs">Contact</NavLink>
                    </li>
                    <li>
                      <a href="https://xenivoyage.com/faq" target="_blank">
                        FAQ
                      </a>
                    </li>
                    {/* <li>
                      <a
                        href="https://xenivoyage.com/what-to-eat"
                        target="_blank"
                      >
                        W2E
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://xenivoyage.com/what-to-wear"
                        target="_blank"
                      >
                        W2W
                      </a>
                    </li>
                    <li>
                      <a href="https://xenivoyage.com/feedback" target="_blank">
                        Share Your Story
                      </a>
                    </li>
                    <li>
                      <a href="https://xenivoyage.com/gallery" target="_blank">
                        Gallery
                      </a>
                    </li> */}
                    <li>
                      <a href="https://xenivoyage.com/news" target="_blank">
                        News
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-3 col-sm-4 col-12 footer-company">
                <div className="keepconnect">
                  <h1>Company</h1>
                  <ul>
                    <li>
                      <NavLink to="/aboutUs">Team</NavLink>
                    </li>
                    <li>
                      <a href="https://xenivoyage.com/careers" target="_blank">
                        Careers
                      </a>
                    </li>
                    {/* <li>
                      <a href="https://xenivoyage.com/partner" target="_blank">
                        Partners
                      </a>
                    </li> */}
                    <li>
                      <NavLink to="/privacypolicy" target="_blank">
                        Privacy Policy
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/termsandconditions" target="_blank">
                        Terms &amp; Conditions
                      </NavLink>
                      <a href="http://admin.xeniapp.com" target="_blank">
                        <i class="fa fa-lock " style={{ paddingLeft: "5px" }} />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-3 col-sm-4 col-12 pl-0 footer-contact">
                <div className="keepconnect">
                  <h1>Contact</h1>
                  <ul className="email">
                    <li>
                      <a href="tel:18009362927">
                        <i className="fa fa-phone" /> 1 800 936 2927
                      </a>
                    </li>
                    <li>
                      <a href="mailto:info@xeniapp.com">
                        <i className="far fa-envelope" /> info@xeniapp.com
                      </a>
                    </li>
                    <li>
                      <a
                        href="http://help.xeniapp.com/support/home"
                        target="_blank"
                      >
                        <i className="fas fa-headset" /> Support
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12 col-sm-12 col-xs-12">
                <div className="social-link">
                  <ul>
                    <li>
                      <a
                        href="https://www.facebook.com/Xeniapp"
                        target="_blank"
                      >
                        <i className="fab fa-facebook-f" />
                      </a>
                    </li>
                    <li>
                      <a href="https://twitter.com/@WeXeniapp" target="_blank">
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    {/* <li>
                        <a href="https://plus.google.com/u/0/116416930426661839392" target="_blank">
                            <i className="fab fa-google-plus-g"></i>
                        </a>
                    </li> */}
                    <li>
                      <a
                        href="https://www.instagram.com/xeniapp/"
                        target="_blank"
                      >
                        <i className="fab fa-instagram" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/channel/UCPGNo9T8BlGRbAxEZ0NK5Dw"
                        target="_blank"
                      >
                        <i className="fab fa-youtube" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.linkedin.com/company/xeniapp-inc./about/"
                        target="_blank"
                      >
                        <i className="fab fa-linkedin" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12 col-sm-12 col-xs-12">
                {/* <div className="social-link">
                  <ul>
                    <li>
                      <a
                        href="https://www.facebook.com/Xeniapp"
                        target="_blank"
                      >
                        <i className="fab fa-facebook-f" />
                      </a>
                    </li>
                    <li>
                      <a href="https://twitter.com/@WeXeniapp" target="_blank">
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://plus.google.com/u/0/116416930426661839392"
                        target="_blank"
                      >
                        <i className="fab fa-google-plus-g" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/xeniapp/"
                        target="_blank"
                      >
                        <i className="fab fa-instagram" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/channel/UCPGNo9T8BlGRbAxEZ0NK5Dw"
                        target="_blank"
                      >
                        <i className="fab fa-youtube" />
                      </a>
                    </li>
                  </ul>
                </div> */}
                <div className="copyright-div">
                  <p>
                    Powered by
                    <a href="https://xeniapp.com/"> Xeniapp Inc</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Footer;
