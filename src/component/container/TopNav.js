import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer, Flip } from "react-toastify";
import Popover from "react-popover";
import Notifications, { notify } from "react-notify-toast";
import moment from "moment";
import momentTimezone from "moment-timezone";
import { recentActivityList, getProfile } from "../../service/dashboard/action";
import "react-toastify/dist/ReactToastify.css";

import { map as _map, get as _get } from "lodash";

import { logOut ,guestLogin } from "../../service/login/action";
import { getUserIp, code } from "../../service/common/action";
import { searchRoom, getCurrentCurrency } from "../../service/hotel/action";
import { getActivityInfo,
  getActivityPrice,
  getActivityCalendar } from "../../service/activities/action";
import img_user from "../../asset/images/user.png";
import img_logo from "../../asset/images/logo.png";
import countryflag from "../../asset/country";
import countryLabel from "../../asset/countryLabel";
import ReactFlagsSelect from "react-flags-select";
import { searchHotel } from "../../service/hotel/action";
import { getProfileInfo } from "../../service/login/action";
import { carSearch } from "../../service/car/action.js";
import { transferSearch } from "../../service/transfer/action.js";
import {activitySearch} from "../../service/activities/action";
import img_seleArrow from "../../asset/images/selarrow.png";
//import css module
import "react-flags-select/css/react-flags-select.css";
import queryString from "query-string";
//OR import sass module
import "react-flags-select/scss/react-flags-select.scss";
import axios from "../../Utils/request-process";
import URL from "../../asset/configUrl";
import Cookies from "universal-cookie";
const cookies = new Cookies();

var currencies = require("country-data").currencies,
  countries = require("country-data").countries;

class TopNav extends Component {
  static propTypes = {
    isGuest: PropTypes.bool.isRequired,
    userInfo: PropTypes.any,
    onSignIn: PropTypes.func,
    isVisibleSignIn: PropTypes.bool,
    country: ""
  };

  static defaultProps = {
    isGuest: true
  };

  state = {
    enableUserAction: false,
    selectedCode: "",
    isMenuExpend: false,
    currency: "",
    isgopro: false,
    enableCurrencyAction: false,
    currencyValue: "",
    currencySym: "",
    currencyFlag: "",
    subscriptionStatus: null,
    imageUrl: img_user,
    credit: null,
    creditCurrency: null,
  };

  handleChange = event => {
    this.setState({ selectedCode: event.target.value }, () =>
      this.props.code(this.state.currency)
    );
  };
  handleCurrencyHidePopover = enableCurrencyAction => {
    this.setState({ enableCurrencyAction: !enableCurrencyAction });
  };

  getImageURL = email => {
    axios
      .get(URL.GET_PROFILE_PIC + "/" + email)
      .then(response => {
        this.setState({
          imageUrl: response.data.data.image_path
        });
      })
      .catch(err => {
        this.setState({
          imageUrl: img_user
        });
      });
  };

  handleGo = () => {
    if (this.state.subscriptionStatus == "FREE") {
      this.setState({ isgopro: !this.state.isgopro }, () => {
        this.props.handleGopro(this.state.isgopro);
      });
    } else if (this.state.subscriptionStatus == "XeniClub") {
      this.props.history.push("/dashboard/mySubscription");
    }
    // if (this.props.loginDetails.subscription_type === "FREE" || this.props.loginDetails.name) {

    //     this.setState({ isgopro: !this.state.isgopro }, () => {
    //       this.props.handleGopro(this.state.isgopro);
    //     });

    // } else {
    //   this.props.history.push("/dashboard/mySubscription");
    // }
  };
handleClick =() =>{
  this.props.history.push("/SubscriptionPlan");
}
  // onSelectFlag = value => {
  //   this.setState(
  //     { currency: countries[value].currencies[0], selectedCode: value },
  //     () => {
  //       if (this.props.history.location.pathname == "/hotel/search") {
  //         this.getHotelList(this.props.location);
  //       } else if (this.props.history.location.pathname == "/car/search") {
  //         this.getCarList(this.props.location);
  //       } else if (this.props.history.location.pathname == "/hotel/rooms") {
  //         const { hotelId, sessionId } = queryString.parse(
  //           window.location.search
  //         );
  //         this.props.searchRoom(sessionId, hotelId, this.state.currency);
  //       }
  //       if (this.props.history.location.pathname !== "/hotel/reservation")
  //         this.props.code(this.state.currency, this.state.selectedCode);
  //     }
  //   );
  // };

  activityList = (loc) => {
    const { currency } = this.state;
    const values = queryString.parse(loc.search);
        const {date, searchText, limit, offsetLimit} = values;
        let activityPayload = {
            destinationName: searchText,
            activityDate: date,
            offsetLimit,
            limit,
            currencyCode: currency,
            email: _get(this.props, 'loginDetails.email', null),
        };
        this.props.activitySearch(activityPayload);
  }

  getCurrency = each => {
    localStorage.setItem("currency", JSON.stringify(each));
    this.setState({
      currencyValue: each.ABR_NAME,
      currencySym: each.SYM,
      currencyFlag: each.COUNTRY_FLAG
    });
    this.props.getCurrentCurrency(each);

    this.setState(
      { currency: each.ABR_NAME, selectedCode: each.COUNTRY_CODE },
      () => {
        if (this.props.history.location.pathname == "/hotel/search" || this.props.history.location.pathname == "/hotelMapView/search") {
          this.getHotelList(this.props.location);
        } else if (this.props.history.location.pathname == "/car/search") {
          this.getCarList(this.props.location);
        } else if (this.props.history.location.pathname == "/hotel/rooms") {
          const { hotelId, sessionId } = queryString.parse(
            window.location.search
          );
          this.props.searchRoom(sessionId, hotelId, this.state.currency, _get(this.props, 'loginDetails.email', ""));
        } else if(this.props.history.location.pathname == "/transfer/search"){
          this.getTransferList(this.props.location);
        } else if (this.props.history.location.pathname == "/activity/search"){
          this.activityList(this.props.location)

        } else if (this.props.history.location.pathname == "/activity/extra"){
          const {code, date} = queryString.parse(this.props.location.search);
          const codePayload = {
            "productCode": code,
            "currencyCode": this.state.currency,
            "month": moment(date, "MM/DD/YYYY").format("MM"),
            "year": moment(date, "MM/DD/YYYY").format("YYYY"),
            "email": _get(this.props, 'loginDetails.email', null)
         }
          this.props.getActivityInfo(code + `&currencyCode=${this.state.currency}&email=${_get(this.props, 'loginDetails.email', null)}`,
          this.props.getActivityCalendar, codePayload)
        }
        if (this.props.history.location.pathname !== "/hotel/reservation")
          this.props.code(
            this.state.currency,
            this.state.selectedCode,
            this.state.currencyFlag,
            this.state.currencySym
          );
      }
    );
    
  };
  getTransferList = location => {
    const values = queryString.parse(location.search);
    const { currency } = this.state;
    let transferSearchPayload = {
      currency: currency,
      driverInfo: {
        age: "25",
        nationality: "US"
      },
      pickUp: {
        pickUpSearchString: values.pickUpLocation,
        date: values.transferPickUpDate,
        time: values.transferPickUpTime
      },
      dropOff: {
        dropOffSearchString: values.dropOffLocation,
        date: values.transferDropDate,
        time: values.transferDropTime
      },
      radiusKms: 10
    };
    this.props.searchTransfer(transferSearchPayload);
  };
  getHotelList = location => {
    const values = queryString.parse(location.search);
    const {
      searchText,
      checkin,
      checkout,
      adult,
      child,
      childAgeValues,
      premise,
      nationality
    } = values;
    const { currency, selectedCode } = this.state;
    let countryInfo = JSON.parse(localStorage.getItem("currency"));
    countryInfo = countryInfo.COUNTRY_CODE

    this.setState({ checkinDate: checkin, checkoutDate: checkout });
    const searchInfo = {
      currency: currency,
      searchString: searchText,
      paging: {
        pageNo: 1,
        pageSize: 30,
        orderBy: "rating desc, price desc"

      },
      date: {
        start: checkin,
        end: checkout
      },
      adult,
      child,
      childAgeValues,
      allowedCountry: countryInfo,
      premise,
      email: _get(this.props, 'loginDetails.email', ""),
      nationality
    };
    this.props.searchHotel(searchInfo);
  };
  getCarList = location => {
    const values = queryString.parse(location.search);
    const { currency } = this.state;
    let carSearchPayload = {
      currency: currency,
      driverInfo: {
        age: "25",
        nationality: "US"
      },
      pickUp: {
        pickUpSearchString: values.pickUpLocation,
        date: values.carPickUpDate,
        time: values.carPickUpTime
      },
      dropOff: {
        dropOffSearchString: values.dropOffLocation,
        date: values.carDropDate,
        time: values.carDropTime
      },
      radiusKms: 10
    };
    this.props.searchCar(carSearchPayload);
  };

  _subMenu = [
    {
      label: "Signin",
      action: this.handleSignIn,
      isGuest: true,
      isGuest1: true
    },
    {
      label: "SignOut",
      action: this.handleLogout,
      isGuest: false,
      isGuest1: false
    },
    {
      label: "Dashboard",
      action: this.handleDashboard,
      isGuest: false,
      isGuest1: false
    }
  ];

  componentDidMount() {
    let isCurrencyMatched = false;
    // const timeZone = momentTimezone.tz.guess();
    let timeZone = momentTimezone.tz.guess();
    // console.log(timeZone);
    if (timeZone === "Asia/Kolkata") {
      timeZone = "Asia/Calcutta";
    }

    let defaultCountry = currencyListInfo[currencyListInfo.length - 1];
    currencyListInfo.forEach(list => {
      if (list.TIMEZONE === timeZone || list.TIMEZONE === timeZone.split()[0]) {
        isCurrencyMatched = true;
        localStorage.setItem("currency", JSON.stringify(list));
        this.setState(
          {
            currencyValue: list.ABR_NAME,
            currencySym: list.SYM,
            currencyFlag: list.COUNTRY_FLAG,
            selectedCode: list.COUNTRY_CODE,
            currency: list.ABR_NAME
          },
          () =>
            this.props.code(
              this.state.currency,
              this.state.selectedCode,
              this.state.currencyFlag,
              this.state.currencySym
            )
        );
        return false;
      }
    });

    if (!isCurrencyMatched) {
      localStorage.setItem("currency", JSON.stringify(defaultCountry));
      this.setState(
        {
          currencyValue: defaultCountry.ABR_NAME,
          currencySym: defaultCountry.SYM,
          currencyFlag: defaultCountry.COUNTRY_FLAG,
          selectedCode: defaultCountry.COUNTRY_CODE,
          currency: defaultCountry.ABR_NAME
        },
        () =>
          this.props.code(
            this.state.currency,
            this.state.selectedCode,
            this.state.currencyFlag,
            this.state.currencySym
          )
      );
    }

    if (this.props.loginDetails) {
      this.checkSubscriptionStatus(this.props.loginDetails.email);
      // this.getImageURL(this.props.loginDetails.email);
      this.props.getProfile(this.props.loginDetails.email);
    }

      if (cookies.get("x-access-token") && (sessionStorage.getItem("guestLoggedIn") !== "true")) {
          this.props.getProfile();
          this.props.getProfileInfo();
      }
       else {
          this.props.guestLogin();
      }
  }

  checkSubscriptionStatus = email => {
    axios.post(URL.CHECKSUBCRIPTION, { email }).then(res => {
      this.setState({ subscriptionStatus: res.data.data.subscriptionType });
    });
  };

  componentWillReceiveProps(nextProps, prevProps) {
    console.log("nextProps::", nextProps)
    if(this.props.profileData != nextProps.profileData){
      if (nextProps.profileData.personal_info.credits){
        const credit = _get(nextProps, 'profileData.personal_info.credits.amount', null);
        const currency = _get(nextProps, 'profileData.personal_info.credits.currency', 'USD');
        this.setState({
          credit: Number(credit).toFixed(2),
          creditCurrency: currency,
        })
      }

    }
    if ((this.props.loginDetails != nextProps.loginDetails)) {
      if (nextProps.loginDetails) {
        this.checkSubscriptionStatus(nextProps.loginDetails.email);
        this.props.getProfile(nextProps.loginDetails.email);
      }
    }
    if (
      nextProps.cancelSubscriptionDetails !==
      prevProps.cancelSubscriptionDetails
    ) {
      if (this.props.loginDetails) {
        this.checkSubscriptionStatus(this.props.loginDetails.email);
      }
    }
    if (nextProps.randomProp != prevProps.randomProp) {
      if (this.props.loginDetails) {
        // this.getImageURL(this.props.loginDetails.email);
        // this.props.getProfile(this.props.loginDetails.email);
      }
    }
  }

  handleDashboard = () => {
    this.handleHidePopover();
    const userSession = JSON.parse(sessionStorage.getItem("loginInfo"));

    const { email } = userSession;
    const data = {
      email
    };

    this.props.recentActivityList(data);
    this.props.history.push("/dashboard");
  };

  aboutUs = () => {
    this.props.history.push("/aboutUs");
  };

  handleSignIn = () => {
    this.handleHidePopover();
    this.props.onSignIn();
  };

    handleLogout = () => {
        this.handleHidePopover();
        this.props.logOut();
        cookies.remove("x-access-token");
        setTimeout(() => {
            this.props.history.push("/");
        }, 200);
    };

  goBack = () => {
    // window.location.reload();
    this.props.history.push("/hotel");
  };

  goHome = () => {
    this.props.history.push("/");
  };

  selectCountry(val) {
    this.setState({ country: val });
  }

  handleHidePopover = () => this.setState({ enableUserAction: false });

  render() {
    const { isGuest } = this.props;
    console.log("isGuest::", isGuest)
    const { enableUserAction, enableCurrencyAction, credit } = this.state;
    const userSession = JSON.parse(sessionStorage.getItem("loginInfo"));

    const { isMenuExpend } = this.state;
    const { pathname } = this.props.history.location;

    const { loginDetails } = this.props;

    const image =
      this.props.loginDetails &&
      this.props.loginDetails.image_path !== undefined &&
      this.props.loginDetails.image_path;
    // const defaultCountry = userCountry.toString();
    const {profileData} = this.props
    const imageDecodeURL = _get(profileData, "personal_info.profile_image");
    var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
    // const credit = _get(this.props, 'loginDetails.credits.amount', null);
    const { creditCurrency } = this.state;

    let imgURL;
    // if (base64Matcher.test(imageDecodeURL)) {
    if(imageDecodeURL !=""){  
      imgURL = imageDecodeURL;
    }else{
      imgURL = img_user;
    }

    return (
      <React.Fragment>
        <Notifications />
        <ToastContainer autoClose={4000} transition={Flip} />
        <div>
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container">
            {/* style={{maxWidth: pathname == "/hotelMapView/search" ? "90%" : ""}} */}
              <a>
                <span className="navbar-brand">
                  <img
                    style={{ cursor: "pointer" }}
                    src={img_logo}
                    onClick={this.goBack}
                  />
                </span>
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                onClick={() =>
                  this.setState({
                    isMenuExpend: !isMenuExpend
                  })
                }
              >
                <span className="navbar-toggler-icon" />
              </button>

              <div
                className={
                  isMenuExpend
                    ? "collapse navbar-collapse justify-content-end show"
                    : "collapse navbar-collapse justify-content-end"
                }
                id="navbarSupportedContent"
              >
                {/* TODO : Remove global search if not needed */}
                {/* <div className="navbarSearch">
                <input type="text" />
                <img src={img_headerSearch} />
              </div> */}

                <ul className="navbar-nav">
                  {this.props.history.location.pathname !== "/" && (
                    <li className="nav-item">
                      <span
                        className="nav-link rightLine "
                        onClick={this.goHome}
                      >
                        Home
                      </span>
                    </li>
                  )}

                  {isGuest ? (
                    <li className="nav-item">
                      <span
                        className="nav-link rightLine"
                        onClick={this.props.onSignIn}
                      >
                        Sign In
                      </span>
                    </li>
                  ) : (
                    <li className="nav-item active">
                      <span
                        className="nav-link rightLine"
                        href="#"
                        onClick={() =>
                          this.setState({
                            enableUserAction: !enableUserAction
                          })
                        }
                      >
                        <span className="profileIcon">
                          {/* <img
                              src={
                                this.props.uploadImage &&this.props.uploadImage
                                  ? image_path
                                  : this.props.loginDetails &&
                                    this.props.loginDetails.image_path
                                    ? img_user
                                    : this.props.loginDetails.image_path
                              }
                              width="25px"
                            /> */}
                          {/* <img
                              src={
                                this.props.uploadImage && this.props.uploadImage.image_path !== undefined && this.props.uploadImage
                                  ? this.props.uploadImage.image_path
                                  : !this.props.loginDetails && this.props.loginDetails.profile_image !== undefined && this.props.loginDetails.profile_image === null && this.props.loginDetails.profile_image ==
                                    ""
                                  ? image
                                  : img_user
                              }
                              width="25px"
                            /> */}

                          <img src={imgURL} width="25px" />
                        </span>{" "}
                        {userSession && userSession.name}
                        <Popover
                          isOpen={enableUserAction}
                          style={{ zIndex: 99999 }}
                          preferPlace="below"
                          className="popover"
                          tipSize={0.01}
                          onOuterAction={this.handleHidePopover}
                          body={this.renderUserAction()}
                        >
                          {/* <i className="fas fa-angle-down" /> */}
                          <img
                            src={img_seleArrow}
                            alt="arrow"
                            className="arrowIcon"
                          />
                        </Popover>
                      </span>
                    </li>
                  )}

                  <li className="nav-item">
                    <span
                      className="nav-link rightLine"
                      href="#"
                      onClick={this.aboutUs}
                    >
                      About Us
                    </span>
                  </li>

                  <li className="nav-item">
                    <a
                      className="nav-link rightLine"
                      target="_blank"
                      href="http://help.xeniapp.com/support/home"
                    >
                      Support
                    </a>
                  </li>

                  <li className="nav-item">
                    {/* <span className="nav-link " href="#">
                    USA <i className="fas fa-angle-down" />
                  </span> */}

                    <span
                      className={
                        userSession && userSession.name
                          ? "nav-link rightLine"
                          : "nav-link "
                      }
                      href="#"
                      onClick={() =>
                        this.setState({
                          enableCurrencyAction: !enableCurrencyAction
                        })
                      }
                    >
                      {this.state.currencyValue === "" ? (
                        ""
                      ) : (
                        <React.Fragment>
                          <span
                            className={
                              this.props.currencyFlag
                                ? this.props.currencyFlag
                                : this.state.currencyFlag
                            }
                          />
                          <b className="ml-4">
                            (
                            {this.props.selectedCurrency
                              ? this.props.selectedCurrency
                              : this.state.currencyValue}{" "}
                            {this.props.currencySym
                              ? this.props.currencySym
                              : this.state.currencySym}
                            )
                          </b>
                        </React.Fragment>
                      )}
                      <Popover
                        toggle={this.toggle}
                        isOpen={enableCurrencyAction}
                        style={{ zIndex: 99999 }}
                        preferPlace="below"
                        className={
                          pathname == "/" ||
                          pathname == "/dashboard/mySubscription" ||
                          
                          pathname == "/hotel/rooms" ||
                          pathname == "/aboutUs" ||
                          pathname == "/hotel/search" ||
                          pathname == "/hotel" ||
                          pathname == "/car/search" ||
                          pathname == "/car/extra" ||
                          pathname == "/car" ||
                          pathname == "/transfer/search"||
                          pathname == "/transfer/extras"||
                          pathname == "/transfer"||
                          pathname == "/activity"||
                          pathname == "/activity/search" || 
                          pathname == "/activity/extra"
                            ? "popover currencyVisible"
                            : "popover currencyVisible borderNone"
                        }
                        tipSize={0.01}
                        onOuterAction={() =>
                          this.handleCurrencyHidePopover(
                            this.state.enableCurrencyAction
                          )
                        }
                        body={
                          pathname == "/" ||
                          pathname == "/hotel/rooms" ||
                          pathname == "/aboutUs" ||
                          pathname == "/dashboard/mySubscription" ||
                          pathname == "/transfer"||
                          pathname == "/transfer/search"||
                          pathname == "/transfer/extras"||
                          pathname == "/hotel/search" ||
                          pathname == "/hotel" ||
                          pathname == "/car/search" ||
                          pathname == "/car/extra" ||
                          pathname == "/car" || 
                          pathname == "/hotelMapView/search"||
                          pathname == "/activity"||
                          pathname == "/activity/search" ||
                          pathname == "/activity/extra"
                            ? this.renderCurrencyAction()
                            : ""
                        }
                      >
                        <img
                          src={img_seleArrow}
                          alt="arrow"
                          className="arrowIcon"
                        />
                      </Popover>
                    </span>
                    {/* <ReactFlagsSelect
                      countries={countryflag}
                      customLabels={countryLabel}
                      onSelect={this.onSelectFlag}
                      searchable={true}
                      disabled={
                        pathname == "/hotel/rooms" ||
                        pathname == "/hotel/search" ||
                        pathname == "/hotel" ||
                        pathname == "/car/search" ||
                        pathname == "/car/extra" ||
                        pathname == "/car"
                          ? false
                          : true
                      }
                      className={
                        pathname == "/hotel/rooms" ||
                        pathname == "/hotel/search" ||
                        pathname == "/hotel" ||
                        pathname == "/car/search" ||
                        pathname == "/car/extra" ||
                        pathname == "/car"
                          ? ""
                          : "cursorNotAllowed"
                      }
                     
                      defaultCountry="IN"
                    /> */}
                    {/* <select className="navSelectBox" defaultValue="USD" value={this.state.selectedCode} onChange={this.handleChange}>
                    <option value=""> USD</option>
                    {_map(result, (each, i) => _map(each, (value, index) =>
                      <option key={index} value={value.code}>{value.code}</option>
                    ))}
                  </select> */}
                  </li>
                  {userSession && userSession.name && (
                    <li className="nav-item">
                      <span className="nav-link " href="#">
                        <button
                          className="goPro"
                          onClick={this.handleClick}
                          disabled={this.props.location.pathname === "/payment"}
                        >
                          Upgrade
                        </button>
                      </span>
                    </li>
                  )}
                  {userSession && userSession.name && credit !== null && <li className="nav-item">
                      <span className="nav-link credit">
                          Credit: {currencies[creditCurrency].symbol}{credit}
                      </span>
                  </li>}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </React.Fragment>
    );
  }

  renderUserAction = () => {
    // return <div style={{background: 'white'}}>
    //     {_map(this._subMenu, (item, i) =>
    //       <button key={i} onClick={item.action}>{item.label}</button>)
    //     }
    //   </div>;

    console.log("render::", this.props.isGuest)

    return (
      <div className="popover-body">
        {this.props.isGuest ? (
          <div className="dropdown-item" onClick={this.handleSignIn}>
            Sign In
          </div>
        ) : (
          <React.Fragment>
            <div className="dropdown-item" onClick={this.handleDashboard}>
              Dashboard
            </div>
            <div className="dropdown-item" onClick={this.handleLogout}>
              Log Out
            </div>
          </React.Fragment>
        )}
      </div>
    );
  };
  renderCurrencyAction = () => {
    return (
      <div className="popover-body">
        <ul>
          {_map(currencyListInfo, (each, i) => {
            return (
              <li key={i} onClick={() => this.getCurrency(each)}>
                <span className={each.COUNTRY_FLAG} />
                <span className="countryName">{each.DESC}</span>{" "}
                <b>
                  {" "}
                  {each.ABR_NAME} ({each.SYM}){" "}
                </b>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
}

const currencyListInfo = [
  {
    ABR_NAME: "INR",
    COUNTRY_CODE: "IN",
    DESC: "India Rupee",
    SYM: "₹",
    COUNTRY_FLAG: "currencyFlag curInd",
    TIMEZONE: "Asia/Calcutta",
    CURRENCY_FORMAT: "en-IN"

  },
  {
    ABR_NAME: "AUD",
    COUNTRY_CODE: "AU",
    DESC: "Australia Dollar",
    SYM: "$",
    COUNTRY_FLAG: "currencyFlag curAus",
    TIMEZONE: "Australia",
    CURRENCY_FORMAT: "en-AU"

  },
  {
    ABR_NAME: "BHD",
    COUNTRY_CODE: "BH",
    DESC: "Bahrain Dinar",
    SYM: "$",
    COUNTRY_FLAG: "currencyFlag curBah",
    TIMEZONE: "Asia/Bahrain",
    CURRENCY_FORMAT: "ar-BH"

  },
  {
    ABR_NAME: "QAR",
    COUNTRY_CODE: "QA",
    DESC: "Qatar Riyal",
    SYM: "$",
    COUNTRY_FLAG: "currencyFlag curQat",
    TIMEZONE: "Asia/Qatar",
    CURRENCY_FORMAT: "ar"

  },
  {
    ABR_NAME: "THB",
    COUNTRY_CODE: "TH",
    DESC: "Thailand Baht",
    SYM: "$",
    COUNTRY_FLAG: "currencyFlag curTha",
    TIMEZONE: "Asia/Bangkok",
    CURRENCY_FORMAT: "th"

  },
  {
    ABR_NAME: "CAD",
    DESC: "Canada Dollar",
    COUNTRY_CODE: "CA",
    SYM: "$",
    COUNTRY_FLAG: "currencyFlag curCan",
    TIMEZONE: "Canada",
    CURRENCY_FORMAT: "en-CA"

  },
  {
    ABR_NAME: "EUR",
    DESC: "Euro",
    COUNTRY_CODE: "FR",
    SYM: "€",
    COUNTRY_FLAG: "currencyFlag curEur",
    TIMEZONE: "Europe",
    CURRENCY_FORMAT: "eu"

  },
  {
    ABR_NAME: "SGD",
    DESC: "Singapore Dollar",
    COUNTRY_CODE: "SG",
    SYM: "S$",
    COUNTRY_FLAG: "currencyFlag curSin",
    TIMEZONE: "Asia/Singapore",
    CURRENCY_FORMAT: "si-LK"

  },
  {
    ABR_NAME: "HKD",
    DESC: "Hong Kong Dollar",
    COUNTRY_CODE: "HK",
    SYM: "HK$",
    COUNTRY_FLAG: "currencyFlag curHKD",
    TIMEZONE: "Asia/Hong_Kong",
    CURRENCY_FORMAT: "en-HK"

  },
  {
    ABR_NAME: "AED",
    DESC: "UAE Dirham",
    COUNTRY_CODE: "AE",
    SYM: " د.إ",
    COUNTRY_FLAG: "currencyFlag curUae",
    TIMEZONE: "Asia/Dubai",
    CURRENCY_FORMAT: "en-AR"

  },
  {
    ABR_NAME: "IDR",
    DESC: "Indonesia Rupiah",
    COUNTRY_CODE: "ID",
    SYM: "Rp",
    COUNTRY_FLAG: "currencyFlag curIno",
    TIMEZONE: "Asia/Jakarta",
    CURRENCY_FORMAT: "en-ID"

  },
  {
    ABR_NAME: "JPY",
    DESC: "Japan Yen",
    COUNTRY_CODE: "QP",
    SYM: "¥",
    COUNTRY_FLAG: "currencyFlag curJap",
    TIMEZONE: "Japan",
    CURRENCY_FORMAT: "en-JA"

  },
  {
    ABR_NAME: "LKR",
    DESC: "Sri Lanka Rupee",
    COUNTRY_CODE: "LK",
    SYM: "Rs",
    COUNTRY_FLAG: "currencyFlag curSri",
    TIMEZONE: "Asia/Colombo",
    CURRENCY_FORMAT: "en-IN"

  },
  {
    ABR_NAME: "USD",
    DESC: "United States",
    COUNTRY_CODE: "US",
    SYM: "$",
    COUNTRY_FLAG: "currencyFlag curUni",
    TIMEZONE: "America",
    CURRENCY_FORMAT: "en-US"

  }
];

const mapStateToprops = state => ({
  isGuest: !state.loginReducer.loginStatus,
  loginDetails:
    state.loginReducer.loginDetails || state.paymentReducer.loginDetails,
  countryCode: state.commonReducer.countryCode,
  selectedCurrency: state.commonReducer.selectedCurrency,
  userCountry: state.commonReducer.userCountry,
  myTripList: state.dashboardReducer.myTripList,
  uploadImage: state.dashboardReducer.uploadImage,
  paymentDetails: state.loginReducer.paymentDetails,
  currencyFlag: state.commonReducer.currencyFlag,
  currencySym: state.commonReducer.currencySym,
  randomProp: state.commonReducer.randomProp,
  subscriptionCancelStatus: state.subscriptionReducer.cancelSubscriptionDetails,
  profileData:state.dashboardReducer.profileData
});

const mapDispatchToProps = dispatch => ({
    logOut: () => dispatch(logOut()),
    getUserIp: () => dispatch(getUserIp()),
    code: (currency, countryCode, currencyFlag, currencySym) =>
        dispatch(code(currency, countryCode, currencyFlag, currencySym)),
    recentActivityList: data => dispatch(recentActivityList(data)),
    searchHotel: data => dispatch(searchHotel(data)),
    searchCar: data => dispatch(carSearch(data)),
    searchTransfer: data => dispatch(transferSearch(data)),
    searchRoom: (sessionId, hotelId, currency, email) =>
        dispatch(searchRoom(sessionId, hotelId, currency, email)),
    getCurrentCurrency: payload => dispatch(getCurrentCurrency(payload)),
    getProfile: data => dispatch(getProfile(data)),
    getProfileInfo: () => dispatch(getProfileInfo()),
    guestLogin: () => dispatch(guestLogin()),
    activitySearch: data => dispatch(activitySearch(data)),
    getActivityInfo: (payloadInfo, clb, clbPayload) =>
        dispatch(getActivityInfo(payloadInfo, clb, clbPayload)),
    getActivityPrice: payloadInfo => dispatch(getActivityPrice(payloadInfo)),
    getActivityCalendar: payloadInfo => dispatch(getActivityCalendar(payloadInfo))
});

export default connect(
  mapStateToprops,
  mapDispatchToProps
)(withRouter(TopNav));
