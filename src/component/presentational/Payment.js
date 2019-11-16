import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import propTypes from "prop-types";
import { withRouter } from "react-router-dom";
import axios from "axios";
import request from "../../Utils/request-process";
import moment from "moment";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import queryString from "query-string";
import URL from "../../asset/configUrl";
import "react-phone-number-input/style.css";
// import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import Select from "react-select";
import countryList from "react-select-country-list";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  map as _map,
  pick as _pick,
  partialRight as _partialRight,
  filter as _filter,
  get as _get,
  isEmpty as _isEmpty,
  sumby as _sumby
} from "lodash";

import { getCard } from "../../service/card/action";
import {
  payment,
  bookingReset,
  getPayload
} from "../../service/payment/action";

import { bookingSignUpInfo, signupReset } from "../../service/login/action";
import { tripDeatiledList } from "../../service/dashboard/action";
import { getProfile } from "../../service/dashboard/action";

import InputField from "../Fields/TextField";
import SelectField from "../Fields/SelectField";

import CompleteBookingLogin from "../container/login/completeBookingLoginModel";

import img_paymentCard from "../../asset/images/paymentCard1.png";

import selectArrow from "../../asset/images/selarrow.png";

import $ from "jquery";
import cryptoJSON from "crypto-json";
const algorithm = 'aes256';
const encoding = 'hex';
const currencies = require("country-data").currencies;

class Payment extends Component {
  state = {
    isModal: false,
    isBookingModal: false,
    isOpen: "",
    card: null,
    cardId: null,
    phone:
      this.props.profileData &&
      this.props.profileData.personal_info &&
      ((this.props.profileData.personal_info.phone_number &&
        this.props.profileData.personal_info.phone_number.toString()) ||
        ""),
    concatError: "",
    contactValid: true,
    // country: this.props.profileData && this.props.profileData.address_info && this.props.profileData.address_info.country || "",
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
    countryFilter: "",
    isdivHide: true,
    isModalOpen: false,
    selected: "",
    btnDisable: false,
    isCardInfoDisable: false,
    dob: moment().subtract("years", 18),
    options: countryList().getData(),
    // nationality : this.props.profileData && this.props.profileData.address_info && this.props.profileData.address_info.country || "",
    // nationality: this.props.profileData && this.props.profileData.address_info && this.props.profileData.address_info.country || "",
    sameAsCreditCard: false,
    firstNameDisabled: false,
    cardName: "",
    star: "****",
    specialRequest: "",
    // startDate: moment()
    //   .subtract(17, "years")
    //   .toDate(),
    startDate: [],
    checkBoxChecked: false,
    selectedCard: "",
    useCredit: false
  };

  componentDidMount() {
    let startDateArr = [];
    const queryVal = queryString.parse(window.location.search);

    for (let n = 0; n < queryVal.roomCount; n++) {
      startDateArr.push(
        moment()
          .subtract(17, "years")
          .toDate()
      );
    }

    this.setState({
      startDate: startDateArr
    });
    axios.get("https://restcountries.eu/rest/v2/all").then(response => {
      this.setState({
        countryFilter: _map(
          response.data,
          _partialRight(_pick, ["name", "alpha2Code"])
        )
      });
    });
    this.props.signupReset();
    this.getCard();

    this.props.bookingReset();
    const userSession = JSON.parse(sessionStorage.getItem("loginInfo"));
    // const { email } = this.props.loginDetails;
    if (userSession && userSession) {
      const { email } = userSession && userSession;
      this.props.getProfile(email);
    }
    /*setTimeout(() => {
      this.handleFormInitialValues();
    }, 1000);*/
    // this.handleFormInitialValues();

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

  handleFormInitialValues = profileData => {
    // const { profileData } = this.props;

    this.setState({
      cardName: "" || (this.state.selected && this.state.selected.name)
    });

    this.props.change(
      "cardName",
      "" || (this.state.selected && this.state.selected.name)
    );
    this.props.change(
      "cardNumber",
      "" ||
        (this.state.selected &&
          this.state.star + " " + this.state.selected.last4)
    );
    this.props.change("cvv", "");
    this.props.change(
      "month",
      "" || (this.state.selected && this.state.selected.exp_month)
    );
    this.props.change(
      "year",
      "" || (this.state.selected && this.state.selected.exp_year)
    );

    this.props.initialize({
      email:
        profileData &&
        profileData.personal_info &&
        profileData.personal_info.email,
      firstName0:
        profileData &&
        profileData.personal_info &&
        profileData.personal_info.first_name,
      lastName0:
        profileData &&
        profileData.personal_info &&
        profileData.personal_info.last_name,
      address:
        profileData &&
        profileData.address_info &&
        profileData.address_info.street_address,
      city:
        profileData &&
        profileData.address_info &&
        profileData.address_info.city,
      zipcode:
        profileData &&
        profileData.address_info &&
        profileData.address_info.postal_code
    });

    this.setState({
      country:
        profileData &&
        profileData.address_info &&
        profileData.address_info.country,
      region:
        profileData &&
        profileData.address_info &&
        profileData.address_info.state,
      phone:
        profileData &&
        profileData.personal_info &&
        profileData.personal_info.phone_number &&
        profileData.personal_info.phone_number.toString()
    });
  };

  // changeHandler = nationality => {
  //   this.setState({ nationality });
  // };

  getCard = nextProps => {
    let config = {
      headers: {
        "secret-code": "xeni-app-development"
      }
    };
      if (nextProps) {
          const {email} = nextProps;
          request.get(URL.card.CARD_GET + email, config).then(response => {
              this.setState({card: response.data.data.data});
          });
      }
  };

  handleCardSelect = e => {
    if (e.target.value) {
      this.setState({
        selected: this.state.card[e.target.value],
        onCardSelected: true,
        isCardInfoDisable: true,
        selectedCard: e.target.value
      });
    } else {
      this.setState({
        onCardSelected: false,
        selected: { id: "" },
        isCardInfoDisable: false,
        selectedCard: ""
      });
      // this.props.change("cardName", "")
      // this.props.change("cardNumber", "")
      // this.props.change("cvv", "")
      // this.props.change("month", "")
      // this.props.change("year", "")
    }
  };

  componentWillReceiveProps(nextProps) {
    const { bookingConfirm, bookingConfirmFail, guestLogin } = nextProps;

    if (this.props.loginDetails != nextProps.loginDetails) {
      this.props.getProfile(nextProps.loginDetails.email);

      setTimeout(() => {
        this.handleFormInitialValues();
      }, 1000);
    }
    if (nextProps.loginDetails) {
      this.getCard(nextProps.loginDetails);
    } else {
      this.setState({ card: null });
    }

    if (bookingConfirm === "success") {
      const { email } = this.props.loginDetails;
      const data = {
        email
      };
      this.props.tripDeatiledList(data);
      this.props.history.push("/bookingconfirmation");
    }
    if (bookingConfirm === "failure") {
      this.setState({ isBookingModal: false });
      this.setState({ isModal: true });
    }

    if (guestLogin === "failure" || guestLogin) {
      this.setState({ isBookingModal: true });
    }

    if (guestLogin === "success") {
      this.setState({ isBookingModal: false });
    }

    //THis For Travel Agent
    if (
      nextProps.isTravelAgent &&
      !_isEmpty(nextProps.profileData) &&
      !this.state.initialValues
    ) {
      this.getProfile(true);
    }
  }

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

  handleModal = () => {
    this.props.bookingReset();
    this.setState({ isModal: !this.state.isModal });
  };

  handleSelectCard = e => {
    this.setState({ card: e.target.value });
  };

  close = () => {
    this.setState({ isBookingModal: false });
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

  validateName = (value) => {
      if (!value) {
        return 'Required'
      }

      return undefined;
  }

  handleBooking = values => {
    const keys = ['cardNumber', 'cardName', 'cvv', 'month', 'year'];

    const value = cryptoJSON.encrypt(
        values, process.env.REACT_APP_SECRET_CODE, {encoding, keys, algorithm}
    );

    const queryValues = queryString.parse(window.location.search);
    let currenTime = moment().format("MMM D, YYYY h:mm:ss");

    let adultPyload = {};

    // let adultPyload = {
    //   type: "Adult",
    //   name: {
    //     first: value.firstName0,
    //     last: value.lastName0
    //   },
    //   age: 25
    // };
    let count = 1;
    if (queryValues.adult >= 2 || queryValues.roomCount >= 2) {
      count = 2;
    } else {
      count = 1;
    }
    let f_name = "";
    let l_name = "";
    for (let y = 0; y < count; y++) {
      // if (value["firstName" + y] == undefined) {
      //   f_name = value.firstName0;
      // } else {
      //   f_name = value["firstName" + y];
      // }
      // if (value["lastName" + y] == undefined) {
      //   l_name = value.lastName0;
      // } else {
      //   l_name = value["lastName" + y];
      // }
      adultPyload[y] = {
        type: "Adult",
        name: {
          first: value.firstName0,
          last: value.lastName0
        },
        age: 25
      };
    }

    const adultPylod = Object.values(adultPyload);

    let guestData = [];
    if (queryValues.child && queryValues.child >= 1) {
      let childPyload = {};
      for (let i = 0; i < queryValues.child; i++) {
        childPyload[i] = {
          type: "Child",
          age: queryValues.childAgeValues[i],
          name: { first: value.firstName0, last: value.lastName0 }
        };
      }

      guestData = Object.values(childPyload);
      guestData = [...guestData, ...adultPylod];
      // guestData.push(adultPylod);
    } else {
      // guestData.push(adultPylod);
      guestData = adultPylod;
    }

    let roomUserInfoObj = {};
    for (let y = 0; y < queryValues.roomCount; y++) {
      roomUserInfoObj[y] = {
        firstName: value["firstName" + y],
        lastName: value["lastName" + y],
        dob: this.state.dob
      };
    }
    const roomUserInfo = Object.values(roomUserInfoObj);

    if (
      this.props.loginStatus === false ||
      this.props.loginStatus === undefined
    ) {
      const guestFlag = "BookingFlag";
      const {
        hotel,
        sessionId,
        tripAmount,
        periodStay,
        roomPriceInfo,
        checkin,
        checkout,
        searchDate
      } = this.props;

      const payloadInfo = _map(roomPriceInfo, (each, i) => {
        let room_guest_data = {};
        if (queryValues.adult >= 2) {
          room_guest_data = [
            {
              type: "Adult",
              name: {
                first: value["firstName" + i],
                last: value["lastName" + i]
                // dob: this.state.startDate[i]
              },
              age: 25
            },
            {
              type: "Adult",
              name: {
                first: value["firstName" + i],
                last: value["lastName" + i]
                // dob: this.state.startDate[i]
              },
              age: 25
            }
          ];
        } else {
          room_guest_data = [
            {
              type: "Adult",
              name: {
                first: value["firstName" + i],
                last: value["lastName" + i]
                // dob: this.state.startDate[i]
              },
              age: 25
            }
          ];
        }

        return {
          images: [each.hotel.images[0], each.hotel.images[1]],
          policies: each.hotel.policies,
          checkinCheckoutPolicy: each.hotel.checkinCheckoutPolicy,
          amenities: [
            each.hotel.amenities[0],
            each.hotel.amenities[1],
            each.hotel.amenities[2],
            each.hotel.amenities[3],
            each.hotel.amenities[4]
          ],
          rooms_info: each.rooms,
          stayPeriod: {
            start: checkin,
            end: checkout
          },
          rating: each.hotel.rating,
          geocode: each.hotel.geocode,
          sessionId: each.sessionId,
          email: value.email,
          currenTime: currenTime,
          hotelId: each.hotel.id,
          rooms: [
            {
              roomRefId: each.pricedRooms[0].roomRefId,
              rateRefId: each.pricedRooms[0].rateRefId,
              // guests: guestData
              guests: room_guest_data
            }
          ],
          totalAmount: each.totalAmount,
          amtAfterdiscount: each.amtAfterdiscount,
          farebreakupAmount: each.farebreakupAmount,
          paymentBreakup: [
            // TODO : Ask jansi to clarify hard coded
            {
              paymentMethodRefId: "1",
              amount: each.fareBreakup.totalFare,
              // currency: this.props.selectedCurrency,
              currency: this.props.selectedCurrency,
              type: "Cash"
            }
          ],
          paymentMethod: {
            cards: [
              {
                num: value.cardNumber,
                nameOnCard: value.cardName,
                cvv: value.cvv,
                issuedBy: "VI",
                expiry: {
                  month: value.month,
                  year: value.year
                },
                contactInfo: {
                  phones: [
                    {
                      num: value.phoneNumber
                    }
                  ],
                  billingAddress: {
                    line1: value.address,
                    city: {
                      code: "SFO",
                      name: value.city
                    },
                    state: {
                      code: this.state.region,
                      name: value.state
                    },
                    countryCode: this.state.country,
                    //countryCode:"US",
                    postalCode: value.zipcode
                  },
                  email: value.email
                }
              }
            ],
            card_id: this.state.selected.id || null
            //  card_id : this.state.card[0] && this.state.card[0].id || null
            //card_id: (this.state.selected && this.state.selected[0].id) || null
          },
          customer: {
            name: {
              first: value["firstName" + i],
              last: value["lastName" + i]
            },
            contactInfo: {
              phones: [
                {
                  num: this.state.phone
                }
              ],
              address: {
                line1: value.address,
                city: {
                  code: "SFO",
                  name: value.city
                },
                state: {
                  code: this.state.region,
                  name: value.state
                },
                countryCode: this.state.country,
                //countryCode:"US",
                postalCode: value.zipcode
              },
              email: value.email
            },
            dob: this.state.dob,
            // nationality: this.state.nationality.value,
            nationality: this.state.country,

            customerId: "43435" // TODO : We are using mail id to retrive data so now just pass dummy value
          },
          primaryGuest: {
            name: {
              first: value["firstName" + i],
              last: value["lastName" + i]
            },
            contactInfo: {
              phones: [
                {
                  num: this.state.phone
                }
              ],
              address: {
                line1: value.address,
                city: {
                  code: "SFO",
                  name: value.city
                },
                state: {
                  code: this.state.region,
                  name: value.state
                },
                countryCode: this.state.country,
                //countryCode: "US",
                postalCode: value.zipcode
              },
              email: value.email
            },
            age: 25
          },
          booking_type: "Hotel",
          date_booked: moment(new Date()).format("MM/DD/YYYY"),
          travel_date: this.props.checkin,
          hotel_address: {
            name: each.hotel.name,
            contact: each.hotel.contact
          },
          cancellationPolicy: each.rates[0].cancellationPolicy,
          refundability: each.rates[0].refundability,
          fareBreakup: each.fareBreakup,
          guestInfo: {
            adultCount: queryValues.adult,
            childCount: queryValues.child
          },
          roomUserInfo: roomUserInfo
        };
      });

      const payload = {
        name: value.firstName0,
        email: value.email,
        password: this.generatePassword(),
        type: "guest"
      };

      sessionStorage.setItem("loginInfoBooking", JSON.stringify(payload));

      this.props.bookingSignUpInfo(guestFlag, payload, payloadInfo);

      // this.setState({ isModalOpen: true });
      // this.setState({ isModal: false });

      // const { email } = this.props.loginDetails && this.props.loginDetails;

      this.props.getPayload(payloadInfo);
    } else {
      const {
        hotel,
        sessionId,
        tripAmount,
        periodStay,
        roomPriceInfo,
        checkin,
        checkout,
        searchDate
      } = this.props;

      const { email } = this.props.loginDetails && this.props.loginDetails;
      let creditUsed = false;

      let totalFareAmount = 0;
      for (let n = 0; n < roomPriceInfo.length; n++) {
        totalFareAmount += roomPriceInfo[n]["totalAmount"];
      }

      console.log("totalFareAmount ? ", totalFareAmount);

      // const totalFareAmount = _sumby(this.props, 'roomPriceInfo.totalAmount');

      const payload = _map(roomPriceInfo, (each, i) => {
        let useCredit = undefined;

        if (!creditUsed) {
          useCredit = this.state.useCredit;
          creditUsed = true;
        }
        let room_guest_data = {};
        if (queryValues.adult >= 2) {
          room_guest_data = [
            {
              type: "Adult",
              name: {
                first: value["firstName" + i],
                last: value["lastName" + i]
                // dob: this.state.startDate[i]
              },
              age: 25
            },
            {
              type: "Adult",
              name: {
                first: value["firstName" + i],
                last: value["lastName" + i]
                // dob: this.state.startDate[i]
              },
              age: 25
            }
          ];
        } else {
          room_guest_data = [
            {
              type: "Adult",
              name: {
                first: value["firstName" + i],
                last: value["lastName" + i]
                // dob: this.state.startDate[i]
              },
              age: 25
            }
          ];
        }

        const credit = _get(
          this.props,
          "profileData.personal_info.credits.amount",
          null
        );
        // const totalFareAmount = _get(this.props, 'roomPriceInfo.totalAmount', null);
        let paymentMethod;
        if (this.state.useCredit === true && credit >= totalFareAmount) {
          paymentMethod = {
            card_id: "credit"
          };
        } else {
          paymentMethod = {
            cards: [
              {
                num: value.cardNumber,
                nameOnCard: value.cardName,
                cvv: value.cvv,
                issuedBy: "VI",
                expiry: {
                  month: value.month,
                  year: value.year
                },
                contactInfo: {
                  phones: [
                    {
                      num: value.phoneNumber
                    }
                  ],
                  billingAddress: {
                    line1: value.address,
                    city: {
                      code: "SFO",
                      name: value.city
                    },
                    state: {
                      code: this.state.region,
                      name: value.state
                    },
                    countryCode: this.state.country,
                    //countryCode:"US",
                    postalCode: value.zipcode
                  },
                  email: value.email
                }
              }
            ],
            card_id: ""
          };
        }

        return {
          useCredit,
          images: [each.hotel.images[0], each.hotel.images[1]],
          policies: each.hotel.policies,
          checkinCheckoutPolicy: each.hotel.checkinCheckoutPolicy,
          amenities: [
            each.hotel.amenities[0],
            each.hotel.amenities[1],
            each.hotel.amenities[2],
            each.hotel.amenities[3],
            each.hotel.amenities[4]
          ],
          rooms_info: each.rooms,
          stayPeriod: {
            start: checkin,
            end: checkout
          },
          rating: each.hotel.rating,
          geocode: each.hotel.geocode,
          sessionId: each.sessionId,
          email: this.props.loginDetails.email,
          currenTime: currenTime,
          hotelId: each.hotel.id,
          rooms: [
            {
              roomRefId: each.pricedRooms[0].roomRefId,
              rateRefId: each.pricedRooms[0].rateRefId,
              guests: room_guest_data
            }
          ],
          totalAmount: each.totalAmount,
          amtAfterdiscount: each.amtAfterdiscount,
          farebreakupAmount: each.farebreakupAmount,
          paymentBreakup: [
            // TODO : Ask jansi to clarify hard coded
            {
              paymentMethodRefId: "1",
              amount: each.fareBreakup.totalFare,
              currency: this.props.selectedCurrency,
              type: "Cash"
            }
          ],
          paymentMethod,
          customer: {
            name: {
              first: value["firstName" + i],
              last: value["lastName" + i]
            },
            contactInfo: {
              phones: [
                {
                  num: this.state.phone
                }
              ],
              address: {
                line1: value.address,
                city: {
                  code: "SFO",
                  name: value.city
                },
                state: {
                  code: this.state.region,
                  name: value.state
                },
                countryCode: this.state.country,
                //countryCode: "US",
                postalCode: value.zipcode
              },
              email: value.email
            },
            dob: this.state.dob,
            // nationality: this.state.nationality.value,
            nationality: this.state.country,
            specialRequest: value.specialRequest,
            customerId: "43435" // TODO : We are using mail id to retrive data so now just pass dummy value
          },
          primaryGuest: {
            name: {
              first: value["firstName" + i],
              last: value["lastName" + i]
            },
            contactInfo: {
              phones: [
                {
                  num: this.state.phone
                }
              ],
              address: {
                line1: value.address,
                city: {
                  code: "SFO",
                  name: value.city
                },
                state: {
                  code: this.state.region,
                  name: value.state
                },
                countryCode: this.state.country,
                postalCode: value.zipcode
              },
              email: value.email
            },
            age: 25
          },
          booking_type: "Hotel",
          date_booked: moment(new Date()).format("MM/DD/YYYY"),
          travel_date: this.props.checkin,
          hotel_address: {
            name: each.hotel.name,
            contact: each.hotel.contact
          },
          cancellationPolicy: each.rates[0].cancellationPolicy,
          refundability: each.rates[0].refundability,
          fareBreakup: each.fareBreakup,
          guestInfo: {
            adultCount: queryValues.adult,
            childCount: queryValues.child
          },
          roomUserInfo: roomUserInfo
        };
      });

      // return;
      this.props.payment(payload);
      // this.setState({ isModal: true });
      // this.props.history.push('/bookingconfirmation')
    }
  };

  handleChange = (date, i) => {
    this.setState({
      startDate: { ...this.state.startDate, [i]: date }
    });
  };
  handleCheckClick = () => {
    this.setState({ checkBoxChecked: !this.state.checkBoxChecked });

    // this.props.handleCheckClick(this.state.checkBoxChecked);
  };

  renderUserInfoForRoom = () => {
    const queryValues = queryString.parse(window.location.search);
    const { roomCount } = queryValues;
    let html = [];
    for (let i = 0; i < roomCount; i++) {
      html.push(
        <React.Fragment>
          <h5 key={i}>Who is Checking in? [Room {i + 1}] </h5>
          <div className="row">
            <div className="col-xl-5 col-lg-5 col-md-5">
              <div className="form-group">
                <Field
                  name={"firstName" + i}
                  type="text"
                  label="First Name *"
                  component={InputField}
                  placeholder="First Name"
                  disabled={this.state.firstNameDisabled}
                  validate={this.validateName}
                />
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4">
              <div className="form-group">
                <Field
                  name={"lastName" + i}
                  type="text"
                  label="Last Name *"
                  component={InputField}
                  placeholder="Last Name"
                  validate={this.validateName}
                />
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3">
              <div className="form-group">
                <label>Date of Birth *</label>
                <DatePicker
                  selected={this.state.startDate[i]}
                  onChange={date => this.handleChange(date, i)}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  placeholder="YYYY/MM/DD"
                  maxDate={moment()
                    .subtract(17, "years")
                    .year()
                    .toString()}
                />
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }

    return html;
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
      handleSubmit,
      paymentFailureDetails,
      paymentInfo
      // profileData
    } = this.props;

    const {
      country,
      region,
      isdivHide,
      isModalOpen,
      isDob,
      firstNameDisabled,
      isBookingModal,
      selected
    } = this.state;
    console.log("this.props.roomPriceInfo", this.props.roomPriceInfo);
    // const renderModel = isModalOpen && (
    //   <SignInModal isdivHide={isdivHide} onHide={this.close} />
    // );

    const renderModel = isBookingModal && (
      <CompleteBookingLogin
        paymentInfo={paymentInfo}
        isdivHide={isdivHide}
        onHide={this.close}
      />
    );

    var years = [],
      year = new Date().getFullYear();

    for (var i = year; i < year + 15; i++) {
      years.push(i);
    }
    let totalFareAmount = 0;
    const roomPriceInfo = this.props.roomPriceInfo;
    for (let n = 0; n < roomPriceInfo.length; n++) {
      totalFareAmount += roomPriceInfo[n]["totalAmount"];
    }
    console.log("totalFareAmount ? ", totalFareAmount);
    let selectedCountry = JSON.parse(localStorage.getItem("currency"));
    selectedCountry = selectedCountry.COUNTRY_CODE;
    const credit = _get(
      this.props,
      "profileData.personal_info.credits.amount",
      null
    );
    // const totalFareAmount = _sumby(_values(this.props.roomPriceInfo), 'totalAmount');
    const { useCredit } = this.state;
    let creditBool = false;

    if (useCredit === false) {
      creditBool = true;
    } else if (useCredit === true && credit < totalFareAmount) {
      creditBool = true;
    } else {
      creditBool = false;
    }

    return (
      <React.Fragment>
        {renderModel}
        <form
          onSubmit={handleSubmit(this.handleBooking)}
          style={{ width: "100%" }}
        >
          <div>
            <div className="headerTitles paymentRes justify-content-start">
              <h5>Pay with Credit Card / Debit Card</h5>
              <img src={img_paymentCard} className="cardImg" alt="" />
            </div>
            <div className="paymentDetails">
              <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                  {this.props.loginDetails && (
                    <div className="form-group">
                      {/* <label>Select your payment method</label> */}

                      {/* <select onChange={this.handleCardSelect}>
                        {this.state.card && this.state.card.length == 0 && (
                          <option value="">No saved Cards</option>
                        )}
                        {this.state.card  && this.state.card.length > 0 && (
                          <option value="">Select your card</option>
                        )}
                        {this.state.card  && this.state.card.map((value, index) => {
                          return (
                            <option value={index}>Car ending with {value.last4}</option>
                          )
                        })
                        }
                      </select> */}
                      <Field
                        name="selectedCard"
                        label="Select your payment method"
                        component={SelectField}
                        onChange={this.handleCardSelect}
                      >
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
                      </Field>
                    </div>
                  )}
                </div>
              </div>
              <h5>{this.useCreditAmount()}</h5>
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
                          label="CVV"
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
                            this.setState({ cardName: e.target.value })
                          }
                          // , () => {
                          //   if (this.state.sameAsCreditCard) {
                          //     this.props.change("firstName", e.target.value);
                          //   }
                          // }
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
                          style={{
                            backgroundColor: this.state.isCardInfoDisable
                              ? "#e9ecef"
                              : "unset"
                          }}
                          // , background: this.state.isCardInfoDisable == false ? "url(" + selectArrow + ") no-repeat 94% 50%" : "unset"
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
                          style={{
                            backgroundColor: this.state.isCardInfoDisable
                              ? "#e9ecef"
                              : "unset"
                          }}
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
                    {this.props.loginStatus ? this.getAddressFromProfile() : ""}
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
              {/* <div className="row">
                <div className="col-xl-5 col-lg-5 col-md-5">
                  <div className="form-group">
                    <label className="whosText">Who is Checking in?</label>
                  </div>
                </div>
              </div> */}

              {this.renderUserInfoForRoom()}
              {/* <div className="row">
                <div className="col-xl-5 col-lg-5 col-md-5">
                  <div className="form-group">
                    <Field
                      name="firstName"
                      type="text"
                      label="First Name"
                      component={InputField}
                      placeholder="First Name"
                      disabled={firstNameDisabled}
                    />
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-4">
                  <div className="form-group">
                    <Field
                      name="lastName"
                      type="text"
                      label="Last Name"
                      component={InputField}
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-3">
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <DatePicker
                      selected={this.state.startDate}
                      onChange={this.handleChange}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      placeholder="YYYY/MM/DD"
                      maxDate={moment()
                        .subtract(17, "years")
                        .year()
                        .toString()}
                    />
                  </div>
                </div>
              </div> */}
              {/* <p className="whosText"></p> */}

              {/* <div className="row">
															
                <div className="col-xl-9 col-lg-9 col-md-9">
                    <div className="form-group">
                      <label className="whosText">Who is Checking in?</label>
                      <input type="text" placeholder="First and Last Name"/>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-3">
                    <div className="form-group">
                      <label>Same as Credit Card</label>	
                      <input className="styled-checkbox" id="styled-checkbox-1" type="checkbox" value=""/>
                      <label for="styled-checkbox-1"></label>
                    </div>
                  </div>
							</div> */}
              <div className="row">
                <div className="col-xl-5 col-lg-5 col-md-5">
                  <div className="form-group">
                    <Field
                      name="email"
                      type="text"
                      label="Email *"
                      component={InputField}
                      placeholder="Email"
                    />
                  </div>
                </div>

                <div className="col-xl-4 col-lg-4 col-md-4">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <PhoneInput
                      placeholder="Mobile Number"
                      name="contact"
                      country={selectedCountry}
                      value={this.state.phone}
                      onChange={phone =>
                        this.setState({ phone }, () => {
                          if (
                            phone !== undefined &&
                            this.state.country !== "" &&
                            this.state.region !== ""
                          ) {
                            if (isValidPhoneNumber(phone)) {
                              this.setState({
                                concatError: "",
                                contactValid: true,
                                btnDisable: true
                              });
                            } else {
                              this.setState({
                                concatError: "Please enter valid Mobile Number",
                                contactValid: false,
                                btnDisable: true
                              });
                            }
                          } else {
                            this.setState({ btnDisable: false });
                          }
                        })
                      }
                    />

                    {!this.state.contactValid && (
                      <span style={{ color: "red" }}>
                        {this.state.concatError}
                      </span>
                    )}
                  </div>
                </div>
                {/* <div className="col-xl-3 col-lg-3 col-md-3">
                  <div className="form-group">
                    <label>Nationality</label>
                    <Select
                      options={this.state.options}
                      value={this.state.nationality}
                      onChange={this.changeHandler}
                    />
                  </div>
                </div> */}
              </div>

              {/* disabled={!this.state.btnDisable || !this.state.nationality} */}
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
                    <input
                      type="checkbox"
                      checked={this.state.checkBoxChecked}
                      onChange={this.handleCheckClick}
                    />
                    <span
                      onClick={() => {
                        window.open("/termsandconditions");
                      }}
                      style={{
                        fontWeight: "200",
                        fontSize: "15px",
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
                  {/* <button type="button" className="searchBtn">
                    ADD TO ITINERARY
                  </button> */}

                  <button
                    className="searchBtn completebtn"
                    disabled={
                      this.state.checkBoxChecked == false ? true : false
                    }
                  >
                    Complete Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        {this.state.isModal === true && (
          <div
            className="modal backgroundDark"
            id="myModal"
            style={{ display: "block" }}
          >
            <div className="modal-dialog signInPopup">
              <div className="modal-content">
                <div className="modal-body paymentError">
                  <div className="socialBtnGroup" />
                  <span className="erroricon">
                    <i class="fas fa-exclamation-triangle" />
                  </span>
                  <h4>
                    {paymentFailureDetails &&
                    paymentFailureDetails.data.error.message
                      ? paymentFailureDetails.data.error.message
                      : paymentFailureDetails.data.message
                      ? paymentFailureDetails.data.message
                      : " An Unexpected error has occurred , Please try again later"}
                  </h4>

                  <button
                    type="button"
                    className="goBack"
                    onClick={this.handleModal}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

//else if (/^[!0]*[0-9-\)\(]+$/.test(formProps.cardNumber))

const fieldValidation = formProps => {

  console.log("formProps::::::", formProps)
  const errors = {};

  if (
    formProps.selectedCard == "" ||
    formProps.selectedCard == null ||
    formProps.selectedCard == undefined
  ) {
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
  }

  if (!formProps.cvv) {
    errors.cvv = "Required";
  } else if (!/^[0-9]{3,4}$/.test(formProps.cvv)) {
    errors.cvv = "CVV should contain 3-4 digit";
  }
  if (
    formProps.selectedCard == "" ||
    formProps.selectedCard == null ||
    formProps.selectedCard == undefined
  ) {
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
  }
  if (!formProps.address) {
    errors.address = "Required";
  }
  if (!formProps.city) {
    errors.city = "Required";
  }
  if (!formProps.state) {
    errors.state = "Required";
  }
  if (!formProps.country) {
    errors.country = "Required";
  }
  if (!formProps.zipcode) {
    errors.zipcode = "Required";
  } else if (/\D/.test(formProps.zipcode)) {
    errors.zipcode = "Zipcode allowed only number";
  }

  // $("input[name^='firstName']").each(function(key, value) {
  //   console.log("key:::", key)
  //   console.log("value:::", value)
  //   const inputName = $(this).attr("name");
  //   if ($(this).val() == "") {
  //     errors[inputName] = "First name is Required";
  //   } else if (
  //     $(this)
  //       .val()
  //       .includes(".")
  //   ) {
  //     errors[inputName] = "Please enter valid first name";
  //   }
  // });

  // $("input[name^='lastName']").each(function(key, value) {
  //   const inputName = $(this).attr("name");
  //   if ($(this).val() == "") {
  //     errors[inputName] = "Last name is required";
  //   } else if (
  //     $(this)
  //       .val()
  //       .includes(".")
  //   ) {
  //     errors[inputName] = "Please enter valid last name";
  //   }
  // });

  // if (!formProps.firstName) {
  //   errors.firstName = "First name is Required";
  // } else if (formProps.firstName.includes(".")) {
  //   errors.firstName = "Please enter valid first name";
  // }

  // if (!formProps.lastName) {
  //   errors.lastName = "Last name is required";
  // } else if (formProps.lastName.includes(".")) {
  //   errors.lastName = "Please enter valid last name";
  // }

  if (!formProps.dob) {
    errors.dob = "Required";
  }

  if (!formProps.email) {
    errors.email = "Required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formProps.email)
  ) {
    errors.email = "Invalid Email Address";
  }
  if (!formProps.code) {
    errors.code = "Required";
  }
  if (!formProps.phoneNumber) {
    errors.phoneNumber = "Required";
  }

  return errors;
};

const mapStateToProps = state => ({
  hotel: state.hotelReducer.hotel,
  sessionId: state.hotelReducer.sessionId,
  searchDate: state.hotelReducer.searchDate,
  pricedTotalFare: state.hotelReducer.pricedTotalFare,
  quotedTotalFare: state.hotelReducer.quotedTotalFare,
  fareBreakup: state.hotelReducer.fareBreakup,
  pricedRooms: state.hotelReducer.pricedRooms,
  rates: state.hotelReducer.rates,
  requestedOccupancies: state.hotelReducer.requestedOccupancies,
  roomPriceInfo: state.hotelReducer.roomPriceInfo,
  roomOccupancies: state.hotelReducer.roomOccupancies,
  rooms: state.hotelReducer.rooms,
  loginDetails: state.loginReducer.loginDetails,
  paymentInfo: state.paymentReducer.paymentInfo,

  // loginDetails: state.loginReducer.loginDetails,
  paymentDetails: state.paymentReducer.paymentDetails,
  getCardDetails: state.cardReducer.getCardDetails,
  bookingConfirm: state.paymentReducer.bookingConfirm,
  guestLogin: state.loginReducer.guestLogin,
  loginStatus: state.loginReducer.loginStatus,
  bookingConfirmFail: state.paymentReducer.bookingConfirmFail,
  paymentFailureDetails: state.paymentReducer.paymentFailureDetails,
  bookingFailed: state.paymentReducer.bookingFailed,
  selectedCurrency: state.commonReducer.selectedCurrency,
  roomPrice: state.hotelReducer.roomPrice,
  profileData: state.dashboardReducer.profileData,
  currencySym: state.commonReducer.currencySym,
  isTravelAgent: state.dashboardReducer.isTravelAgent,
  isProfileEmpty: state.dashboardReducer.isProfileEmpty
});
const mapDispatchToProps = dispatch => ({
  tripDeatiledList: data => dispatch(tripDeatiledList(data)),
  getProfile: value => dispatch(getProfile(value)),
  bookingReset: () => dispatch(bookingReset()),
  signupReset: () => dispatch(signupReset()),
  bookingSignUpInfo: (guestFlag, payload, payloadInfo) =>
    dispatch(bookingSignUpInfo(guestFlag, payload, payloadInfo)),
  payment: payload => dispatch(payment(payload)),
  getPayload: payload => dispatch(getPayload(payload)),
  getCard: email => dispatch(getCard(email))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    reduxForm({
      form: "payment",
      validate: fieldValidation
    })(Payment)
  )
);

Payment.propTypes = {
  isdivHide: propTypes.bool
};
