import React, { Component } from "react";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import propTypes from "prop-types";
import _find from "lodash/find";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _capitalize from "lodash/capitalize";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import moment from "moment";

import CompleteBookingLogin from "../../container/login/completeBookingLoginModel";

import { reduxForm, Field } from "redux-form";
import InputField from "../../Fields/TextField";
import SelectField from "../../Fields/SelectField";
import countryList from "react-select-country-list";
import Map from "./component/Map";
import {
  transferSearch,
  transferBook,
  transGetPayload
} from "../../../service/transfer/action";
import { getProfile } from "../../../service/dashboard/action";
import { bookingSignUpInfo, signupReset } from "../../../service/login/action";
import { sendingEmailDetails } from "../../../service/addCart/action";
import img_paymentCard from "../../../asset/images/paymentCard1.png";
import openNewTab from "../../../asset/images/dashboard/resize.png";
import img_carUser from "../../../asset/images/dashboard/carUser.png";
import img_luggage from "../../../asset/images/dashboard/luggage.png";
import img_info from "../../../asset/images/Important Information.svg";
import img_Time from "../../../asset/images/Time.svg";
import img_DateArrow from "../../../asset/images/Date Arrow.png";

import cryptoJSON from 'crypto-json';
const algorithm = 'aes256';
const encoding = 'hex';

import request from '../../../Utils/request-process';

import countryPrefixNumber from "./countryPrefixNumber";

// import "react-phone-number-input/style.css";
const currencies = require("country-data").currencies;

class TransferConfirmContent extends Component {
  state = {
    selectedTaxi: {},
    startPoint: {},
    endPoint: {},
    origin: "",
    destination: "",
    date: "",
    pickUpTime: "",
    luggage: "",
    passenger: "",
    address: "",
    city: "",
    zipcode: "",
    flightDetail: "",
    options: countryList().getData(),
    country:
      (this.props.profileData &&
        this.props.profileData.address_info &&
        this.props.profileData.address_info.country) ||
      "",
    region:
      (this.props.profileData &&
        this.props.profileData.address_info &&
        this.props.profileData.address_info.state) ||
      "",
    animals: "",
    flightNo: "",
    phoneNo: null,
    selectedCountry: localStorage.getItem("currency").COUNTRY_CODE,
    contactValid: false,
    contactError: "",
    pickOnTime: "",
    checkBoxChecked: false,
    isdivHide: true,
    isModalOpen: false,
    useCredit: false,
    initialValues: false,
    messageToDriver: "",
    onCardSelected: false,
    card: [],
    selected: []
  };

  onPhoneChange = (phoneNo, selectedCountry) => {
    if (isValidPhoneNumber(phoneNo)) {
      this.setState({
        phoneNo,
        selectedCountry,
        contactValid: true,
        contactError: ""
      });
    } else {
      this.setState({
        phoneNo,
        contactValid: false,
        contactError: "Please enter valid phone number"
      });
    }
  };

  handleCardSelect = e => {
    if (e.target.value) {
        this.setState({selected: this.state.card[e.target.value], onCardSelected: true});
    } else {
        this.setState({
            onCardSelected: false,
            selected: { id: "" }
        });
        this.props.change("cardName", "");
        this.props.change("cardNumber", "");
        this.props.change("cvv", "");
        this.props.change("month", "");
        this.props.change("year", "");
    }
};

getCard = nextProps => {
  let config = {
      headers: {
          "secret-code": "xeni-app-development"
      }
  };
  if (nextProps) {
      const { email } = nextProps;
      request.get(URL.card.CARD_GET + email, config).then(response => {
          this.setState({ card: response.data.data.data });
      });
  }
};

  getAddressFromProfile = () => {
    return (
      <React.Fragment>
        <input
          name="isProfile"
          type="checkbox"
          className="filtercheckbox"
          id="checkA8"
          onChange={() => {
            this.getProfile();
          }}
        />
        <label htmlFor="checkA8">Same As Profile Address</label>
      </React.Fragment>
    );
  };

  componentDidMount() {
    const payload = queryString.parse(this.props.location.search);

    const vehicle = _get(payload, "vehicle", null);
    const startPoint = _get(payload, "startPointGeocode", {});
    const endPoint = _get(payload, "endPointGeocode", {});
    const selectedTaxi = _find(
      this.props.transferList,
      list => list.id === vehicle
    );
    const origin = _get(payload, "searchString", "");
    const destination = _get(payload, "end_point", "");
    const date = _get(payload, "start_time_date", "");
    let pickUpTime = _get(payload, "start_time_time", "");
    pickUpTime = moment(pickUpTime, "H:mm").format("hh:mm a");
    const luggage = _get(payload, "luggage", "");
    const passenger = _get(payload, "passengers", "");
    const animals = _get(payload, "animals", "");
    const flightNo = _get(payload, "flightNo", "");

    //this part is ------> EMAIL DETAILS SENDING TO ITINERARY

    if (payload != null) {
      let emailDetails = {
        vehicle: vehicle,
        startPoint: startPoint,
        endPoint: endPoint,
        selectedTaxi: selectedTaxi,
        origin: origin,
        destination: destination,
        date: date,
        pickUpTime: pickUpTime,
        luggage: luggage,
        passenger: passenger,
        animals: animals,
        flightNo: flightNo
      };

      //    this.props.sendingEmailDetails(emailDetails);
    }

    this.setState({
      ...this.state,
      dropOffTime: payload.dropOffTime,
      pickOnTime: payload.pickUpTime
    });
    if (selectedTaxi) {
      this.setState({
        selectedTaxi
      });
    } else {
      this.props.transferSearch({
        ...queryString.parse(this.props.location.search),
        currencySymbol: this.props.currencySym,
        currency: this.props.selectedCurrency,
        email: this.props.loginDetails ? this.props.loginDetails.email : null
      });
    }

    this.setState({
      startPoint: JSON.parse(startPoint),
      endPoint: JSON.parse(endPoint),
      origin,
      destination,
      date,
      pickUpTime,
      luggage,
      passenger,
      animals,
      flightNo
    });

    const loginInfo = sessionStorage.getItem("loginInfo");
    if (loginInfo) {
      // this.props.initialize({
      //     email: _get(JSON.parse(loginInfo), 'email'),
      // })
      const email = _get(JSON.parse(loginInfo), "email");
      this.props.getProfile(email);

      setTimeout(() => {
        this.handleFormInitialValues();
      }, 500);
    }

    const credit = _get(
      this.props,
      "profileData.personal_info.credits.amount",
      null
    );
    const creditCurrency = _get(
      this.props,
      "loginDetails.credits.currency",
      "USD"
    );

    if (credit !== null && creditCurrency === this.props.selectedCurrency) {
      this.setState({
        useCredit: true
      });
    }
  }

  handleFormInitialValues = () => {
    const { profileData } = this.props;

    this.props.initialize({
      email: _get(profileData, "personal_info.email", ""),
      firstName: _get(profileData, "personal_info.first_name", ""),
      lastName: _get(profileData, "personal_info.last_name", ""),
      address: _get(profileData, "address_info.street_address", ""),
      city: _get(profileData, "address_info.city", ""),
      zipcode: _get(profileData, "address_info.postal_code", "")
    });
    let countryCod =
      profileData &&
      profileData.address_info &&
      profileData.address_info.country &&
      profileData.address_info.country.toString();

    countryCod =
      countryCod != null && countryCod != undefined && countryCod != ""
        ? countryCod
        : "";
    let pre;
    if (countryCod != null && countryCod != undefined && countryCod != "") {
      pre =
        countryPrefixNumber[countryCod].code != null &&
        countryPrefixNumber[countryCod].code != undefined &&
        countryPrefixNumber[countryCod].code != ""
          ? countryPrefixNumber[countryCod].code
          : "";
    } else {
      pre = "";
    }
    let phoneNum =
      profileData &&
      profileData.personal_info &&
      profileData.personal_info.phone_number &&
      profileData.personal_info.phone_number.toString();
    phoneNum = pre + phoneNum;
    if (phoneNum && countryCod) {
      this.onPhoneChange(phoneNum, countryCod);
    }

    this.setState({
      phoneNo: phoneNum
    });
  };

  getProfile = (forceUpdate = false) => {
    this.setState({ initialValues: !this.state.initialValues });
    if (!this.state.initialValues || forceUpdate) {
      if (this.props.loginStatus) {
        this.handleFormInitialValues(this.props.profileData);
      }
    } else {
      this.handleFormInitialValues();
    }
  };

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.loginStatus != nextProps.loginStatus) {
      this.props.getProfile(nextProps.loginDetails.email);
      this.getCard(nextProps.loginDetails);

      setTimeout(() => {
        this.handleFormInitialValues();
      }, 500);
    }
    if (this.props.transfetList !== nextProps.transferList) {
      const vehicle = _get(
        queryString.parse(this.props.location.search),
        "vehicle",
        null
      );

      if (vehicle) {
        this.setState({
          selectedTaxi: _find(
            nextProps.transferList,
            list => list.id === vehicle
          )
        });
      }
    }

    if (nextProps.bookingNumber !== null) {
      this.props.history.push(
        "/transferbookingconfirmation" +
          this.props.location.search +
          "&" +
          queryString.stringify({ bookingNumber: nextProps.bookingNumber })
      );
    }

    const { gustLoginTrans } = nextProps;

    if (gustLoginTrans === "failure" || gustLoginTrans) {
      this.setState({ isModalOpen: true });
    }

    if (gustLoginTrans === "success") {
      this.setState({ isModalOpen: false });
      //this.setState({ isModal: true });
    }

    if (
      nextProps.isTravelAgent &&
      !_isEmpty(nextProps.profileData) &&
      !this.state.initialValues
    ) {
      this.getProfile(true);
    }
  }

  close = () => {
    this.setState({ isModalOpen: false });
  };

  selectCountry(val) {
    if (val !== "" && this.state.region !== "" && this.state.phone !== "") {
      this.setState({ country: val, btnDisable: true });
    } else {
      this.setState({ country: val, btnDisable: false });
    }
  }

  selectRegion(val) {
    if (val !== "" && this.state.country !== "" && this.state.phone !== "") {
      this.setState({ region: val, btnDisable: true });
    } else {
      this.setState({ region: val, btnDisable: false });
    }
  }

  handleBooking = value => {
    const keys = ['cardNumber', 'cardName', 'cvv', 'month', 'year'];

    const values = cryptoJSON.encrypt(
        value, process.env.REACT_APP_SECRET_CODE, {encoding, keys, algorithm}
    );

    if (
      this.props.loginStatus === false ||
      this.props.loginStatus === undefined
    ) {
      const guestFlag = "TransferBookingFlag";
      const finalPayLoad = {
        ...queryString.parse(this.props.location.search),
        first_name: values.firstName,
        last_name: values.lastName,
        mobile: this.state.phoneNo,
        email: values.email,
        payment_method: "default",
        countryCode: this.state.country,
        postalCode: values.zipcode,
        line1: values.address,
        code: this.state.region,
        flightDetail: values.flightDetail,
        messageToDriver: this.state.messageToDriver,
        specialRequest: values.specialRequest,
        city: {
          code: "SFO",
          name: values.city
        },
        image: this.state.selectedTaxi.image_url,
        totalAmount: this.state.selectedTaxi.totalAmount,
        regular_price: this.state.selectedTaxi.regular_price,
        currency: this.state.selectedTaxi.currency_code,
        paymentBreakup: [
          {
            // paymentMethodRefId: "1",
            amount: this.state.selectedTaxi.regular_price,
            currency: this.state.selectedTaxi.currency_code,
            type: "Cash"
          }
        ],
        paymentMethod: {
          cards: [
            {
              num: values.cardNumber,
              nameOnCard: values.cardName,
              cvv: values.cvv,
              issuedBy: "VI",
              expiry: {
                month: values.month,
                year: values.year
              },
              contactInfo: {
                phones: [{}],
                billingAddress: {
                  line1: values.address,
                  city: {
                    code: "SFO",
                    name: values.city
                  },
                  state: {
                    code: this.state.region,
                    name: this.state.region
                  },
                  countryCode: this.state.country,
                  postalCode: values.zipcode
                },
                email: values.email
              }
            }
          ],
          card_id: ""
        }
      };

      const payload = {
        name: values.firstName,
        email: values.email,
        password: this.generatePassword()
      };

      sessionStorage.setItem("loginInfoBooking", JSON.stringify(payload));
      this.props.bookingSignUpInfo(guestFlag, payload, finalPayLoad);
      this.props.transGetPayload(finalPayLoad);
    } else {
      const credit = _get(
        this.props,
        "profileData.personal_info.credits.amount",
        null
      );
      const totalFareAmount = _get(
        this.state,
        "selectedTaxi.totalAmount",
        null
      );

      let paymentMethod;
      if (this.state.useCredit === true && credit >= totalFareAmount) {
        paymentMethod = {
          card_id: "credit"
        };
      } else {
        paymentMethod = {
          cards: [
            {
              num: values.cardNumber,
              nameOnCard: values.cardName,
              cvv: values.cvv,
              issuedBy: "VI",
              expiry: {
                month: values.month,
                year: values.year
              },
              contactInfo: {
                phones: [{}],
                billingAddress: {
                  line1: values.address,
                  city: {
                    code: "SFO",
                    name: values.city
                  },
                  state: {
                    code: this.state.region,
                    name: this.state.region
                  },
                  countryCode: this.state.country,
                  postalCode: values.zipcode
                },
                email: values.email
              }
            }
          ],
          card_id: ""
        };
      }

      const finalPayLoad = {
        ...queryString.parse(this.props.location.search),
        first_name: values.firstName,
        last_name: values.lastName,
        mobile: this.state.phoneNo,
        email: values.email,
        payment_method: "default",
        countryCode: this.state.country,
        postalCode: values.zipcode,
        line1: values.address,
        code: this.state.region,
        flightDetail: values.flightDetail,
        messageToDriver: this.state.messageToDriver,
        specialRequest: values.specialRequest,

        city: {
          code: "SFO",
          name: values.city
        },
        image: this.state.selectedTaxi.image_url,
        totalAmount: this.state.selectedTaxi.totalAmount,
        regular_price: this.state.selectedTaxi.regular_price,
        currency: this.state.selectedTaxi.currency_code,
        paymentBreakup: [
          {
            // paymentMethodRefId: "1",
            amount: this.state.selectedTaxi.regular_price,
            currency: this.state.selectedTaxi.currency_code,
            type: "Cash"
          }
        ],
        paymentMethod
      };
      this.state.contactValid &&
        this.props.transferBook({
          ...finalPayLoad,
          useCredit: this.state.useCredit
        });
    }

    // this.state.contactValid && this.props.transferBook(finalPayLoad);
  };

  generatePassword = () => {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  };

  handleCheckClick = () => {
    this.setState({ checkBoxChecked: !this.state.checkBoxChecked });

    // this.props.handleCheckClick(this.state.checkBoxChecked);
  };

  useCreditAmount = () => {
    const credit = _get(
      this.props,
      "profileData.personal_info.credits.amount",
      null
    );
    const creditCurrency = _get(
      this.props,
      "loginDetails.credits.currency",
      "USD"
    );

    return (
      credit &&
      creditCurrency === this.props.selectedCurrency && (
        <React.Fragment>
          <input
            checked={this.state.useCredit}
            name="isUseCredit"
            type="checkbox"
            className="filtercheckboxCredit"
            id="isUseCredit"
            onChange={() => {
              this.setState({
                useCredit: !this.state.useCredit
              });
            }}
          />
          <label htmlFor="isUseCredit">
            Use credit amount {currencies[creditCurrency].symbol}
            {credit}
          </label>
        </React.Fragment>
      )
    );
  };

  render() {
    const {
      selectedTaxi,
      date,
      origin,
      country,
      region,
      destination,
      pickUpTime,
      luggage,
      passenger,
      animals,
      flightNo,
      phoneNo,
      isdivHide,
      isModalOpen
    } = this.state;

    const credit = _get(
      this.props,
      "profileData.personal_info.credits.amount",
      null
    );
    const totalFareAmount = _get(this.state, "selectedTaxi.totalAmount", null);
    // alert(totalFareAmount)
    const { useCredit } = this.state;
    let creditBool = false;

    if (useCredit === false) {
      creditBool = true;
    } else if (useCredit === true && credit < totalFareAmount) {
      creditBool = true;
    } else {
      creditBool = false;
    }

    const { transPaymentInfo } = this.props;
    const years = [],
      year = new Date().getFullYear();
    let selectedCountry = JSON.parse(localStorage.getItem("currency"));
    if (selectedCountry !== null) {
      selectedCountry = selectedCountry.COUNTRY_CODE;
    } else {
      selectedCountry = "IN";
    }
    for (let i = year; i < year + 15; i++) {
      years.push(i);
    }

    const renderModel = isModalOpen && (
      <CompleteBookingLogin
        paymentInfo={transPaymentInfo}
        isdivHide={isdivHide}
        onHide={this.close}
      />
    );

    return this.state.selectedTaxi ? (
      <div>
        {renderModel}
        <div className="selectRoomBg d-flex flex-wrap">
          <div className="selectRoomTitle">
            <h4>
              Review & Confirm your reservation <img src={openNewTab} />
            </h4>
          </div>
          <div className="selectRoomItemsBg carSelRoom d-flex flex-row resWrap ">
            <div className="flex-column  carConfirmLeft">
              <div className="carConfirmImgDiv">
                <div className="carImageOnly">
                  <img src={selectedTaxi.image_url} className="carImgWid" />
                </div>
              </div>
              <div className="confirmScreenPick">
                <ul className="pickupDropDet">
                  <li>
                    <h6>Pick-Up</h6>
                    <p>{origin}</p>
                  </li>
                  <li>
                    <h6>Transfer Inclusions</h6>
                    <p>1. Meet & Greet</p>
                    <p>
                      2. Wating Time{" "}
                      <b>{selectedTaxi.included_waiting_time} mins</b>
                    </p>
                    <p>3. Fixed Price ,Toll Included</p>
                  </li>
                </ul>
                <ul className="pickupDropDet">
                  <li>
                    <h6>Drop-Off</h6>
                    <p>{destination}</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex-column confirmRoomRight carConfirmRight">
              <div className="detailsBg flex-column carInfo">
                <h6> {selectedTaxi.car_model}</h6>
                <ul className="carCategories">
                  <li> {_capitalize(selectedTaxi["vehicle_type"])}</li>
                  <li> {selectedTaxi.booking_category}</li>
                </ul>
                <ul className="carInfraStru">
                  <li>
                    <img src={img_carUser} /> {selectedTaxi.seats}
                  </li>
                  {/*<li>
                                        <img src={img_clock}/> {selectedTaxi.included_waiting_time} mins
                                    </li>*/}
                  <li>
                    <img src={img_luggage} /> {selectedTaxi.luggage}
                  </li>
                </ul>
              </div>
              {/* <p>Booked for {moment(carDropDate).diff(moment(carPickUpDate), 'days')} Days</p>
								<ul className="carCheckin">
									<li className="border"><h5>{moment(carPickUpDate).format('MMM DD')}</h5><p>{moment(carPickUpDate).format('dddd')}</p></li>
									<li><img src={img_DateArrow} /></li>
									<li className="border"><h5>{moment(carDropDate).format('MMM DD')} </h5><p>{moment(carDropDate).format('dddd')}</p></li>
								</ul> */}
              <ul className="checkInOut">
                <li>
                  <img src={img_Time} />
                  <span>
                    Pick Up<b> {this.state.pickUpTime}</b>
                  </span>
                </li>
                <li>
                  <img src={img_Time} />
                  <span>
                    Drop Off<b>{this.state.dropOffTime}</b>
                  </span>
                </li>
              </ul>
              <div className="carInfoDiv">
                <img src={img_info} />
                <p>Important Information about your rental</p>
                <div className="moreDetailToolTip">
                  {/*TODO Policy Information Required From Client*/}
                  <p>
                    <div className="InfoHover">
                      <h6>About Various Cars</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        Limousines: All our limousine transfers include fixed
                        price, automated flight tracking, 24/7 support hotline
                        and pickup with name sign in the arrival hall.
                        <br />
                        Additional luggage, such as sports equipment or child
                        seat are available for limousine transfers.
                      </p>

                      <h6>How can I change a booking?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        You can email us with the change request and we will
                        accommodate your request as soon as possible.
                      </p>
                      <h6>How can I cancel a booking?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        You can cancel the booking from your dashboard as per
                        the cancellation policy.
                      </p>
                      <h6>How much luggage can I bring?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        You can bring up to 8 pieces of luggage in our biggest
                        cars with you assuming that every piece piece has the
                        size of 55 (22”) x 45 (18”) x 25 (10”). Normally, our
                        passenger cars such as Sedans can fit 3 pieces of
                        luggage in the above-mentioned size, our MPVs fit in 6
                        and vans take up to 8. Remember to specify the amount of
                        luggage you can bring while making a reservation.
                      </p>
                      <h6>Can you provide a child seat?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        Yes! We provide child seats for children from 3 to 6
                        years and from 6 to 12 years. To make sure that the
                        child seat is provided just add it while booking. On the
                        web, after entering basic details like pickup and
                        dropoff spots, click on “More details” and choose an
                        arrow next to the baby icon and choose the number and
                        option that suits you best. We advise to repeat that you
                        need children seats in the message to the driver at the
                        end of the booking, but remember that first of all you
                        need to mark child seats in “More details” as above.
                        <br />
                        If you write about the children seats only in the
                        message to the driver, they cannot be guaranteed. Please
                        note that the driver can carry only 2 children seats at
                        once.
                      </p>

                      <h6>Pickup, the ride and dropoff</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        You will get the name, surname and telephone number of
                        your driver in an SMS until 30 minutes before the pickup
                        time.
                      </p>
                      <h6>How can I be sure that my car is coming?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        Once you have received a booking confirmation via email
                        a car is immediately reserved for you. That car may
                        change depending on availability, but the exact details
                        of the driver and type of car will be sent to you via
                        email and SMS right before your pickup time. This means
                        that you can easily find and contact your driver if
                        necessary.
                      </p>
                      <h6>What happens if I am late?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        As soon as you notice that you might be late, please
                        contact your driver directly and notify him about your
                        delay. You can easily find the driver’s phone number in
                        the email and SMS sent to you just prior to the ride. If
                        you should forget to notify the driver about your delay,
                        he will wait for you until the included waiting time has
                        passed. If you don’t arrive within the allocated waiting
                        time without informing the driver or calling our
                        Support, you will be charged a special fee for not
                        showing up. The no-show fee for Quality Taxis is the
                        base fee (based on the regional taxi tariff) plus 15
                        minutes waiting time. This may vary depending on the
                        region and country rules. The no show fee for Limousine
                        bookings is the full fare of the ride.
                      </p>
                      <h6>What do I do if my driver is late?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        Call the driver directly to see where they are. You find
                        their phone number in the SMS you received before your
                        ride with all the driver details. If you cannot get in
                        touch with your driver please call our Support number
                        where one of our Agents will help you to find your
                        driver.
                      </p>
                      <h6>How will I recognise the driver?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        For limousine bookings, we normally send the driver your
                        name and surname that will appear on your pickup sign.
                        You can also specify the text that will appear on your
                        pickup sign while booking your ride. Once you come into
                        the arrivals hall, just search for your pickup sign,
                        your driver will be holding it.
                      </p>
                      <h6>What if my destination changed last minute?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        Please notify the driver about your new destination. In
                        some situations, the fact that you changed the dropoff
                        point, may incur additional costs.
                      </p>
                      <h6>
                        Can I bring additional passengers in the car on the
                        spot?
                      </h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        The answer is yes if the car booked has the capacity to
                        take more people in. If it’s not possible we will ask
                        you to stick with the data you originally provided. The
                        same happens if you bring more luggage than initially
                        stated and the driver will not be able to fit it or with
                        any short-notice request that we won’t be able to
                        accommodate.
                        <br />
                        If you have any special requests it would be best to
                        write them in the special requests box when placing a
                        booking and we will do what we can to meet your needs.
                      </p>

                      <h6>
                        I just took my McDonald’s takeaway right before the
                        pickup, can I eat it during the ride?
                      </h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        We want to keep the cars in the highest standard and to
                        be able to maintain it, we would ask you not to eat or
                        drink in the vehicle during the ride. We would also like
                        to kindly remind you that smoking is not allowed. Please
                        remember that if you cause any damage in/to the car, you
                        will be asked to cover the additional costs.
                      </p>
                      <h6>
                        What if I provide incorrect flight number and want to
                        change it?
                      </h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        If your ride’s distance is less than 70 km, you can
                        change it directly in your account for free until 3
                        hours before the indicated pickup time. If you booked an
                        hourly ride or exceeding 70 km, you can change the
                        flight number in your account until 24 hours before
                        indicated pickup time.
                      </p>
                      <h6>What if my flight is delayed?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        For limousine transfers, the driver will track your
                        flight and wait for you at the airport at the actual
                        flight arrival time. It’s is our specialty.
                      </p>
                      <h6>
                        Why do you pick up when the flight lands? I will need
                        time to go through immigration!
                      </h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        In order to provide you with a seamless pickup
                        experience, the limousine driver is tracking your flight
                        and will be at the airport at your flight arrival time.
                        Please note that we offer free waiting time for
                        limousine transfers of 45 minutes for our Economy rides,
                        60 minutes for Business rides and 90 minutes for First
                        Class rides. This is counted from your flight arrival
                        time. You can add additional buffer time in a message to
                        the driver whilst booking or contact our support after
                        you have booked. If you need to exceed the waiting time
                        at the last moment we will do our best to accommodate
                        your request, but please note that we cannot guarantee
                        that the driver will be able to wait longer than
                        previously agreed. In case of exceeding included waiting
                        time, additional fees specified in your confirmation
                        shall apply. In the case of Quality Taxi transfers,
                        please contact your driver if you want them to wait, but
                        please note that in this case, additional fees will
                        apply.
                      </p>
                      <h6>
                        My flight was diverted, but then it came back to the
                        original airport. Will my driver still be there?
                      </h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        Unless you got in contact with the driver and told them
                        to leave the airport, they will wait for you. Yet,
                        whenever such unpredicted circumstances as flight
                        diversion occur please always reach us at +49 30 346 497
                        360 as soon as you have the signal.
                      </p>
                      <h6>Where does the driver pick me up?</h6>
                      <p style={{ fontWeight: "initial", fontSize: "12px" }}>
                        A detailed information about your specific meeting point
                        at the airport will be provided in your booking
                        confirmation email. For most of the airports the driver
                        will be waiting for you after the baggage claim, however
                        it might vary from airport to airport. For other
                        locations the driver shall pick you up from the address
                        booked, usually in front of the building.
                      </p>
                    </div>
                  </p>
                </div>
              </div>
              <p>Xeniapp Customer Care at 1800 936 2927.</p>
            </div>
            <div className="flex-column confirmRoomRight carConfirmRight">
              <ul className="totalAmountDis">
                <li>
                  <span>1 Day</span>
                  <span>
                    {" "}
                    {selectedTaxi.currency_symbol} {selectedTaxi.regular_price}
                  </span>
                </li>
                <li>
                  <span>Taxes & Fees</span>
                  <span>
                    {selectedTaxi.currency_symbol}{" "}
                    {(
                      selectedTaxi.totalAmount - selectedTaxi.regular_price
                    ).toFixed(2)}
                  </span>
                </li>
                <li>
                  <span>Total for 1 days</span>
                  <span>
                    {" "}
                    {selectedTaxi.currency_symbol} {selectedTaxi.totalAmount}
                  </span>
                </li>
              </ul>
              <div style={{ padding: "8px" }}>
                <h6>
                  Reservation & Cancellation Policy{" "}
                  <i
                    onClick={() => {
                      this.setState({
                        cancellationPolicyShow: !this.state
                          .cancellationPolicyShow
                      });
                    }}
                    className="fas fa-angle-double-down"
                  />
                </h6>
                {this.state.cancellationPolicyShow && (
                  <p>
                    {" "}
                    <h6 style={{ fontSize: "11px", fontWeight: "600" }}>
                      1. You can cancel the Transfer 24 Hrs before your travel.
                    </h6>
                    <h6 style={{ fontSize: "11px", fontWeight: "600" }}>
                      2. For any changes to your reservation, please drop us an
                      email or contact help line immediately.
                    </h6>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* <div className="selectRoomBg d-flex flex-wrap">
          <div className="selectRoomTitle">
            <h4>
              Review & Confirm your reservation <img src={openNewTab} />
            </h4>
          </div>
          <div className="selectRoomItemsBg carSelRoom">
            <div className="d-flex flex-row smallColumn  carCard">
              <div className="flex-column carImgDiv align-self-center">
                <div className="carImageOnly">
                  <img src={selectedTaxi.image_url} className="carImgWid" />
                </div>
                <div className="carInfoDiv">
                  <img src={img_info} />
                  <p> Important Information about your rental</p>
                  <div className="moreDetailToolTip" />
                </div>
              </div>
              <div className="detailsBg flex-column carInfo pl-2">
                <h6> {selectedTaxi.car_model}</h6>
                <ul className="carCategories">
                  <li>{selectedTaxi.vehicle_type}</li>
                  <li>{selectedTaxi.booking_category}</li>
                </ul>

                <ul className="carInfraStru" style={{ width: "299px" }}>
                  <li>
                    <img src={img_carUser} /> {selectedTaxi.seats}
                  </li>
                  {/*<li>
                                        <img src={img_clock}/> {selectedTaxi.included_waiting_time} mins
                                    </li>*/}
        {/* <li>
                    <img src={img_luggage} /> {selectedTaxi.luggage}
                  </li>
                </ul>
                <ul className="pickupDropDet">
                  <li>
                    <h6>Pick-Up</h6>
                    <p>{origin}</p>
                  </li>
                  <li>{pickUpTime}</li>
                  <li>
                    <h6>Transfer Inclusions</h6>
                    <p>1. Meet & Greet</p>
                    <p>
                      2. Wating Time {selectedTaxi.included_waiting_time} mins
                    </p>
                    <p>3. Fixed Price ,Toll Included</p>
                  </li>
                </ul>
                <ul className="pickupDropDet">
                  <li>
                    <h6>Drop-Off</h6>
                    <p>{destination}</p>
                  </li>
                  <li>{this.state.dropOffTime}</li>
                </ul>
              </div>
              <div className="flex-column confirmRoomRight carConfirmRight ml-0 pl-0">
                <ul className="totalAmountDis">
                  <li>
                    <span>1 Day</span>
                    <span>
                      {" "}
                      {selectedTaxi.currency_symbol}{" "}
                      {selectedTaxi.regular_price}
                    </span>
                  </li>
                  <li>
                    <span>Taxes & Fees</span>
                  </li>
                  <li>
                    <span>Total for 1 days</span>
                    <span>
                      {" "}
                      {selectedTaxi.currency_symbol}{" "}
                      {selectedTaxi.regular_price}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}
        <div className="selectRoomBg d-flex flex-wrap">
          <div className="flex-column m-2" style={{ width: "100%" }}>
            <Map
              startPoint={this.state.startPoint}
              endPoint={this.state.endPoint}
            />
          </div>
        </div>
        {this.props.bookingNumber === null && (
          <div className="flex-column mt-5">
            <div className="d-flex flex-wrap otherSectionBg">
              <form
                onSubmit={this.props.handleSubmit(this.handleBooking)}
                style={{ width: "100%" }}
              >
                <div>
                  <div className="headerTitles paymentRes justify-content-start">
                    <h5>Pay with Credit Card / Debit Card</h5>
                    <img src={img_paymentCard} className="cardImg" alt="" />
                  </div>
                  
                            
                  <h5>{this.useCreditAmount()}</h5>
                  <div className="paymentDetails">
                  <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                    {this.props.loginDetails && (
                                        <div className="form-group">
                                            <label>Select your payment method</label>

                                            <select onChange={this.handleCardSelect}>
                                                {this.state.card && this.state.card.length == 0 && (
                                                    <option value="">No saved Cards</option>
                                                )}
                                                {this.state.card && this.state.card.length > 0 && (
                                                    <option value="">Select your card</option>
                                                )}
                                                {this.state.card &&
                                                this.state.card.map((value, index) => {
                                                    return (
                                                        <option value={index}>
                                                            Car ending with {value.last4}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                    {creditBool && (
                      <div>
                        <div className="row">
                          <div className="col-xl-9 col-lg-9 col-md-9">
                            <div className="form-group">
                              <Field
                                className="creditcardNumber"
                                name="cardNumber"
                                type="text"
                                label="Credit Card Number *"
                                component={InputField}
                                placeholder="Enter Your Card Number "
                                disabled={this.state.isCardInfoDisable}
                              />
                            </div>
                          </div>
                          <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group">
                              <Field
                                className="creditcardNumber"
                                name="cvv"
                                type="password"
                                label="CVV *"
                                component={InputField}
                                placeholder="CVV"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-6col-lg-6 col-md-6">
                            <div className="form-group">
                              <Field
                                name="cardName"
                                type="text"
                                label="Name on Card *"
                                component={InputField}
                                placeholder="Enter Your Name of card "
                                disabled={this.state.isCardInfoDisable}
                                onChange={e =>
                                  this.setState(
                                    { cardName: e.target.value },
                                    () => {
                                      if (this.state.sameAsCreditCard) {
                                        this.props.change(
                                          "firstName",
                                          e.target.value
                                        );
                                      }
                                    }
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group">
                              <Field
                                name="month"
                                label="Vaild Thru *"
                                component={SelectField}
                                placeholder="MM"
                                disabled={this.state.isCardInfoDisable}
                                className="form-control selectCard borderRight"
                              >
                                <option value="" disabled>
                                  MM
                                </option>
                                <option value="01">01</option>
                                <option value="02">02</option>
                                <option value="03">03</option>
                                <option value="04">04</option>
                                <option value="05">05</option>
                                <option value="06">06</option>
                                <option value="07">07</option>
                                <option value="08">08</option>
                                <option value="09">09</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                              </Field>
                            </div>
                          </div>
                          <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group">
                              <Field
                                name="year"
                                type="text"
                                component={SelectField}
                                placeholder="YYYY"
                                className="form-control selectCard"
                                disabled={this.state.isCardInfoDisable}
                              >
                                <option value="" disabled>
                                  YYYY
                                </option>
                                {years.map((each, i) => (
                                  <option value={each}>{each}</option>
                                ))}
                              </Field>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {this.props.isTravelAgent ? (
                      <div
                        style={{
                          display: this.props.isProfileEmpty ? "block" : "none"
                        }}
                      >
                        <div className="row">
                          <div className="col-xl-9 col-lg-9 col-md-9">
                            <div className="form-group">
                              <Field
                                name="address"
                                type="text"
                                label="Address *"
                                component={InputField}
                                placeholder="Address "
                              />
                            </div>
                          </div>
                          <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group">
                              <label>Select Country *</label>
                              <CountryDropdown
                                name={country}
                                value={country}
                                valueType="short"
                                onChange={val => this.selectCountry(val)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-5">
                            <div className="form-group">
                              <Field
                                name="city"
                                type="text"
                                label="City/Town *"
                                component={InputField}
                                placeholder="City/Town "
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-lg-4 col-md-4">
                            <div className="form-group">
                              <label>State *</label>
                              <RegionDropdown
                                country={country}
                                value={region}
                                countryValueType="short"
                                valueType="short"
                                onChange={val => this.selectRegion(val)}
                              />
                            </div>
                          </div>
                          <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group">
                              <Field
                                name="zipcode"
                                type="text"
                                label="Zip Code *"
                                component={InputField}
                                placeholder="Zip Code"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <React.Fragment>
                        <h5>
                          Billing Address{" "}
                          {this.props.loginStatus
                            ? this.getAddressFromProfile()
                            : ""}
                        </h5>
                        <div className="row">
                          <div className="col-xl-9 col-lg-9 col-md-9">
                            <div className="form-group">
                              <Field
                                name="address"
                                type="text"
                                label="Address *"
                                component={InputField}
                                placeholder="Address "
                              />
                            </div>
                          </div>
                          <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group">
                              <label>Select Country *</label>
                              <CountryDropdown
                                name={country}
                                value={country}
                                valueType="short"
                                onChange={val => this.selectCountry(val)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-5 col-lg-5 col-md-5">
                            <div className="form-group">
                              <Field
                                name="city"
                                type="text"
                                label="City/Town *"
                                component={InputField}
                                placeholder="City/Town "
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-lg-4 col-md-4">
                            <div className="form-group">
                              <label>State *</label>
                              <RegionDropdown
                                country={country}
                                value={region}
                                countryValueType="short"
                                valueType="short"
                                onChange={val => this.selectRegion(val)}
                              />
                            </div>
                          </div>
                          <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group">
                              <Field
                                name="zipcode"
                                type="text"
                                label="Zip Code *"
                                component={InputField}
                                placeholder="Zip Code"
                              />
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    )}
                    <div className="row">
                      <div className="col-xl-5 col-lg-5 col-md-5">
                        <div className="form-group">
                          <Field
                            name="email"
                            type="email"
                            label="Email *"
                            component={InputField}
                            placeholder=""
                          />
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-4">
                        <div className="form-group">
                          <label> Phone Number *</label>
                          <PhoneInput
                            country={selectedCountry}
                            value={phoneNo}
                            onChange={this.onPhoneChange}
                          />
                          {!this.state.contactValid && (
                            <span style={{ color: "red" }}>
                              {this.state.contactError}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <h5
                      style={{
                        fontWeight: "200",
                        marginTop: "13px",
                        marginBottom: "13px"
                      }}
                    >
                      Lead Passenger Details
                    </h5>
                    <div className="row">
                      <div className="col-xl-3 col-lg-3 col-md-3">
                        <div className="form-group">
                          <Field
                            name="firstName"
                            type="text"
                            label="First Name *"
                            component={InputField}
                            placeholder=""
                          />
                        </div>
                      </div>
                      <div className="col-xl-3 col-lg-3 col-md-3">
                        <div className="form-group">
                          <Field
                            name="lastName"
                            type="text"
                            label="Last Name *"
                            component={InputField}
                            placeholder=""
                          />
                        </div>
                      </div>
                      <div className="col-xl-3 col-lg-3 col-md-3">
                        <div className="form-group">
                          <Field
                            name="flightDetail"
                            label="Flight Details:"
                            component={InputField}
                            type="text"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      {this.state.flightNo !== "No Flight" ? (
                        <div className="col-xl-8 col-lg-8 col-md-8 pt-2">
                          <div className="col-xl-8">Flight Name</div>
                          <div className="col-xl-8">
                            <select
                              className="sele-width"
                              value={this.state.flightNo}
                              onChange={e =>
                                this.setState({
                                  flightNo: e.target.value
                                })
                              }
                            >
                              <option value="No Flight">No Flight</option>
                              <option value="4U (German Wings)">
                                4U (German Wings)
                              </option>
                              <option value="AA (American Airlines)">
                                AA (American Airlines)
                              </option>
                              <option value="AB (Air Berlin)">
                                AB (Air Berlin)
                              </option>
                              <option value="AC (Air Cananda)">
                                Ac (Air Cananda)
                              </option>
                              <option value="AF (Air France)">
                                AF (Air France)
                              </option>
                              <option value="BA (British Airways)">
                                BA (British Airways)
                              </option>
                              <option value="DL (Delta Airlines)">
                                DL (Delta Airlines)
                              </option>
                              <option value="EK (Emirates)">
                                EK (Emirates)
                              </option>
                              <option value="FR (Ryanair)">FR (Ryanair)</option>
                              <option value="IB (Iberia)">IB (Iberia)</option>
                              <option value="LO (LOT - Polish Airlines)">
                                LO (LOT - Polish Airlines)
                              </option>
                              <option value="QA (Qatar Airways)">
                                QA (Qatar Airways)
                              </option>
                              <option value="TK (Turkish Airlines)">
                                TK (Turkish Airlines)
                              </option>
                            </select>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="row">
                      <div className="col-xl-5 col-lg-5 col-md-5 ">
                        <div className="form-group">
                          <label>Message to driver:</label>

                          <textarea
                            name="messageToDriver"
                            type="text"
                            style={{
                              width: "100%",
                              height: "80px",
                              border: "1px solid #6a6a6a"
                            }}
                            onChange={(e) => this.setState({messageToDriver: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                <div className="col-xl-5 col-lg-5 col-md-5">
                  <div className="form-group">
                    <Field
                      name="specialRequest"
                      type="text"
                      label="Special Request"
                      component={InputField}
                      placeholder="Any Special Request"
                    />
                  </div>
                </div>
              </div>

                <div className="row">
                  <div className="col-xl-5 col-lg-5 col-md-5">
                    <div style={{ paddingTop: "10px" }}>
                      <span>
                        <input
                          type="checkbox"
                          checked={this.state.checkBoxChecked}
                          onChange={this.handleCheckClick}
                        />
                      </span>

                      <span
                        onClick={() => {
                          window.open("/termsandconditions");
                        }}
                        style={{
                          fontWeight: "200",
                          fontSize: "14px",
                          cursor: "pointer",
                          paddingLeft: "5px"
                        }}
                      >
                        Accept Terms And Conditions
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 mt-3 mb-1 text-right">
                    <button
                      className="searchBtn completebtn"
                      disabled={
                        this.state.checkBoxChecked == false ||
                        this.state.phoneNo == "" ||
                        this.state.contactValid == false
                      }
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    ) : null;
  }
}

const mapStateToProps = state => ({
  transferList: state.transferReducer.transferList,
  taxiTravelDistance: state.transferReducer.taxiTravelDistance,
  bookingNumber: state.transferReducer.bookingNumber,
  selectedCurrency: state.commonReducer.selectedCurrency,
  currencySym: state.commonReducer.currencySym,
  profileData: state.dashboardReducer.profileData,
  loginDetails: state.loginReducer.loginDetails,
  loginStatus: state.loginReducer.loginStatus,
  gustLoginTrans: state.loginReducer.gustLoginTrans,
  transPaymentInfo: state.transferReducer.transPaymentInfo,
  isTravelAgent: state.dashboardReducer.isTravelAgent,
  isProfileEmpty: state.dashboardReducer.isProfileEmpty
});

const mapDispatchToProps = dispatch => ({
  transferSearch: searchInfo => dispatch(transferSearch(searchInfo)),
  transferBook: bookInfo => dispatch(transferBook(bookInfo)),
  getProfile: value => dispatch(getProfile(value)),
  bookingSignUpInfo: (guestFlag, payload, payloadInfo) =>
    dispatch(bookingSignUpInfo(guestFlag, payload, payloadInfo)),
  transGetPayload: payload => dispatch(transGetPayload(payload)),
  sendingEmailDetails: payload => dispatch(sendingEmailDetails(payload))
});

const fieldValidation = formProps => {
  const errors = {};

  if (!formProps.cardNumber) {
    errors.cardNumber = "Required";
  } else if (/\D $/.test(formProps.cardNumber)) {
    errors.cardNumber = "Numbers only allowed";
  } else if (/^[a-zA-Z]*$/.test(formProps.cardNumber)) {
    errors.cardNumber = "Numbers only allowed";
  }
  //^[a-zA-Z]*$
  //!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  if (!formProps.cardName) {
    errors.cardName = "Required";
  }
  if (!formProps.cvv) {
    errors.cvv = "Required";
  } else if (!/^[0-9]{3,4}$/.test(formProps.cvv)) {
    errors.cvv = "CVV should contain 3-4 digit";
  }
  if (!formProps.month) {
    errors.month = "Required";
  } else if (!/^[0-9]{2}$/.test(formProps.month)) {
    errors.month = "Month should be 01-12";
  } else if (formProps.month > 12) {
    errors.month = "Month should be 01-12";
  } else if (formProps.month === "00") {
    errors.month = "Month should be 01-12";
  }

  if (formProps.year != "" && !/^[0-9]+$/.test(formProps.year)) {
    errors.year = "Please Enter Numeric Values Only";
  } else if (!/^[0-9]{4}$/i.test(formProps.year)) {
    errors.year = "Year should contain 4 digit";
  }
  if (!formProps.firstName) {
    errors.firstName = "First name is Required";
  } else if (formProps.firstName.includes(".")) {
    errors.firstName = "Please enter valid first name";
  }

  if (!formProps.lastName) {
    errors.lastName = "Last name is required";
  } else if (formProps.lastName.includes(".")) {
    errors.lastName = "Please enter valid last name";
  }

  if (!formProps.email) {
    errors.email = "Required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formProps.email)
  ) {
    errors.email = "Invalid Email Address";
  }
  // if (!formProps.phoneNumber) {
  //   errors.phoneNumber = "Required";
  // }

  return errors;
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    reduxForm({
      form: "transferPayment",
      validate: fieldValidation
    })(TransferConfirmContent)
  )
);

TransferConfirmContent.propTypes = {
  isdivHide: propTypes.bool
};
