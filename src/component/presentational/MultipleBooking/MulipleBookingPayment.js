import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import propTypes from "prop-types";
import { withRouter } from "react-router-dom";

import moment from "moment";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

import "react-phone-number-input/style.css";
import "react-daterange-picker/dist/css/react-calendar.css";
import countryList from "react-select-country-list";

import {
  map as _map,
  pick as _pick,
  partialRight as _partialRight,
  filter as _filter,
  get as _get,
  isEmpty as _isEmpty,
  sumBy as _sumBy,
  noop as _noop,
  omit as _omit,
  forEach as _forEach,
  times as _times
} from "lodash";

import { getCard } from "../../../service/card/action";
import { payment, bookingReset } from "../../../service/payment/action";
import { dumpValue, replaceItinerary } from "../../../service/addCart/action";
import { getProfile } from "../../../service/dashboard/action";

import InputField from "../../Fields/TextField";
import SelectField from "../../Fields/SelectField";

import SignInModal from "../../container/login/SignInModal";

import img_paymentCard from "../../../asset/images/paymentCard1.png";

import MultipleContext from "./context";

import request from "../../../Utils/request-process";
import axios from "axios";

import URL from "../../../asset/configUrl";

import {
  loadingGifSearch,
  stopGifSearching
} from "../../../service/common/action";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { loginInfo } from "../../../service/login/action";

import { notify } from "react-notify-toast";

import cryptoJSON from "crypto-json";
const algorithm = "aes256";
const encoding = "hex";
const currencies = require("country-data").currencies;

import $ from "jquery";

class MulipleBookingPaymentView extends Component {
  state = {
    isModal: false,
    isOpen: "",
    card: [],
    phone: "",
    concatError: "",
    contactValid: true,
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
    selected: { id: "" },
    btnDisable: false,
    isCardInfoDisable: false,
    dob: moment().subtract("years", 18),
    options: countryList().getData(),
    // nationality : this.props.profileData && this.props.profileData.address_info && this.props.profileData.address_info.country || "",
    sameAsCreditCard: false,
    firstNameDisabled: false,
    cardName: "",
    specialRequest: "",
    messageDriver: "",
    leadfirstName: "",
    flightDetails: "",
    allBookingPayloadCar: [],
    allBookingPayloadHotel: [],
    allBookingPaymentDetails: [],
    allBookingPayloadActivity: [],
    bookingErrorHotel: "",
    bookingErrorCar: "",
    startDate: [],
    email: "",
    checkBoxChecked: false,
    selectedCard: "",
    initialValues: false,
    useCredit: false,
    messageToDriver: ""
  };

  componentDidMount() {
    axios.get("https://restcountries.eu/rest/v2/all").then(response => {
      this.setState({
        countryFilter: _map(
          response.data,
          _partialRight(_pick, ["name", "alpha2Code"])
        )
      });
    });

    const userSession = JSON.parse(sessionStorage.getItem("loginInfo"));
    if (userSession && userSession) {
      const { email } = userSession && userSession;
      this.props.getProfile(email);
    }
    //Removed For Same as Profile If UserLogged in CheckBox
    /*
    setTimeout(() => {
      this.handleFormInitialValues();
    }, 2000);
    */

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

    if (credit && creditCurrency === this.props.selectedCurrency) {
      this.setState({
        useCredit: true
      });
    }
    const { allBookingPayloadActivity } = this.props.context;
  }

  handleChangeforHotel = (date, index) => {
    const { startDate } = this.state;
    startDate[index] = date;
    this.setState({
      startDate
    });
  };

  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  get2D = num => {
    if (num) {
      return (num.toString().length < 2 ? "0" + num : num).toString();
    }
  };

  handleFormInitialValues = profileData => {
    this.setState({
      cardName: "" || (this.state.selected && this.state.selected.name)
    });
    this.props.change(
      "cardName",
      "" || (this.state.selected && this.state.selected.name)
    );
    this.props.change(
      "cardNumber",
      "" || (this.state.selected && this.state.selected.last4)
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
      firstName:
        profileData &&
        profileData.personal_info &&
        profileData.personal_info.first_name,
      firstNameCar:
        profileData &&
        profileData.personal_info &&
        profileData.personal_info.first_name,
      lastName:
        profileData &&
        profileData.personal_info &&
        profileData.personal_info.last_name,
      lastNameCar:
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
        profileData.address_info.state
      // phone:
      //   profileData &&
      //   profileData.personal_info &&
      //   profileData.personal_info.phone_number.toString()
    });
  };

  // changeHandler = nationality => {
  //   this.setState({ nationality })
  // }

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

  componentWillMount = () => {
    this.getCard();
    this.props.bookingReset();
  };

  handleSelectCard = e => {
    this.setState({ card: e.target.value });
  };

  handleCardSelect = e => {
    if (e.target.value) {
      this.setState({
        selected: this.state.card[e.target.value],
        isCardInfoDisable: true,
        selectedCard: e.target.value
      });
    } else {
      this.setState({
        isCardInfoDisable: false,
        selected: { id: "" },
        selectedCard: ""
      });
      // this.props.change("cardName", "");
      // this.props.change("cardNumber", "");
      // this.props.change("cvv", "");
      // this.props.change("month", "");
      // this.props.change("year", "");
    }
  };

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.bookingConfirm !== nextProps.bookingConfirm) {
  //     if (nextProps.bookingConfirm === true) {
  //       this.props.history.push("/bookingconfirmation");
  //     } else if (nextProps.bookingConfirm === false) {
  //       this.setState({ isModal: true });
  //     }

  //   }

  //paymentFailureDetails.data.message
  // }

  componentWillReceiveProps(nextProps) {
    const { bookingConfirm } = nextProps;

    /*if (this.props.loginStatus !== nextProps.loginStatus) {
      // if (nextProps.loginDetails !== null) {
      this.props.getProfile(nextProps.loginDetails.email);
      // }

      setTimeout(() => {
        this.handleFormInitialValues();
      }, 2000);
    }*/

    if (nextProps.loginDetails) {
      this.getCard(nextProps.loginDetails);
    } else {
      this.setState({ card: null });
    }

    if (bookingConfirm === "success") {
      //this.props.history.push("/bookingconfirmation");
    }
    if (bookingConfirm === "failure") {
      this.setState({ isModal: true });
    }
    // else if(nextProps.loginDetails === null || nextProps.loginDetails.hasOwnProperty('status') && nextProps.loginDetails.status == false){
    //   this.setState({ isModalOpen: true });

    // }else if(nextProps.paymentFailureDetails.data.message === "please provide valid email"){
    //   this.setState({ isModalOpen: true });
    // }

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
    this.setState({ isModalOpen: false });
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

  bookingFinalCheckout = async (value, email) => {
    let cardId = this.state.selected.id;

    let currenTime = moment().format("MMM D, YYYY h:mm:ss");

    let payloadHotelArray = [].concat.apply(
      [],
      this.state.allBookingPayloadHotel
    );
    let creditUsed = false;

    const hotelPayload = _map(payloadHotelArray, (each, i) => {
      let totalFareAmount = 0;
      if (payloadHotelArray.length > 0) {
        for (let n = 0; n < payloadHotelArray.length; n++) {
          totalFareAmount += payloadHotelArray[n]["totalAmount"];
        }
      }
      let room_guest_data = {};
      let useCredit = false;
      i += 1;
      if (!creditUsed) {
        useCredit = this.state.useCredit;
        creditUsed = true;
      }
      let guestInfo = {}
      if(payloadHotelArray.length > 1){
        guestInfo = {
          adultCount: 1,
          childCount: 1
        }
      }else{
        guestInfo = {
          adultCount: Number(each.requestedOccupancies[0].adultCount),
          childCount: Number(each.requestedOccupancies[0].childCount)
        }
      }

      if (Number(each.requestedOccupancies[0].adultCount) >= 2) {
        room_guest_data = [
          {
            type: "Adult",
            name: {
              first: value["firstName" + i],
              last: value["lastName" + i],
              dob: this.state.startDate[i]
            },
            age: 25
          },
          {
            type: "Adult",
            name: {
              first: value["firstName" + i],
              last: value["lastName" + i],
              dob: this.state.startDate[i]
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
              last: value["lastName" + i],
              dob: this.state.startDate[i]
            },
            age: 25
          }
        ];
      }

      let crd_id;
      const credit = _get(
        this.props,
        "profileData.personal_info.credits.amount",
        null
      );

      // if(hotelPayload.length > 0 || carPayLoad > 0){
      //   crd_id = cardId
      // }else
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
                    name: this.state.region
                  },
                  countryCode: this.state.country,
                  postalCode: value.zipcode
                },
                email: value.email
              }
            }
          ],
          card_id: cardId
          //  card_id : this.state.card[0] && this.state.card[0].id || null
          //card_id: (this.state.selected && this.state.selected[0].id) || null
        };
      }
      return {
        useCredit: this.state.useCredit,
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
          start: each.checkin,
          end: each.checkout
        },
        rating: each.hotel.rating,
        geocode: each.hotel.geocode,
        sessionId: each.sessionId,
        email: email,
        currenTime: currenTime,
        hotelId: each.hotel.id,
        rooms: [
          {
            roomRefId: each.pricedRooms[0].roomRefId,
            rateRefId: each.pricedRooms[0].rateRefId,
            guests: room_guest_data
            // guests: [{
            //         type: "Adult",
            //         name: {
            //           first: value["firstName" + i],
            //           last: value["lastName" + i],
            //           dob: this.state.startDate[i]
            //         },
            //         age: 25
            //       },
            //       {
            //         type: "Adult",
            //         name: {
            //           first: value["firstName" + i],
            //           last: value["lastName" + i],
            //           dob: this.state.startDate[i]
            //         },
            //         age: 25
            //       }
            // ]
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
            currency: each.currency,
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
                name: this.state.region
              },
              countryCode: this.state.country,
              postalCode: value.zipcode
            },
            email: value.email
          },
          dob: this.state.dob,
          //  nationality: this.state.nationality.value,

          nationality: this.state.country,
          specialRequest: value.specialRequest,
          // leadfirstName: value.leadfirstName,
          // messageDriver: value.messageDriver,
          // flightDetails: value.flightDetails,
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
                name: this.state.region
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
        travel_date: each.checkin,
        hotel_address: {
          name: each.hotel.name,
          contact: each.hotel.contact
        },
        cancellationPolicy: each.rates[0].cancellationPolicy,
        refundability: each.rates[0].refundability,
        fareBreakup: each.fareBreakup,
        // guestInfo: {
          // adultCount: queryValues.adult,
          // childCount: queryValues.child

        //   adultCount: 1,
        //   childCount: 1
        // }
        guestInfo
      };
    });

    // console.log("multibooking hotelPayload ?", hotelPayload)

    // return;

    let carPayLoad = this.state.allBookingPayloadCar.map(carPricedetails => {
      let useCredit = false;

      if (!creditUsed) {
        useCredit = this.state.useCredit;
        creditUsed = true;
      }

      return {
        useCredit: this.state.useCredit,
        sessionId: carPricedetails.sessionId,
        email,
        rentalId: carPricedetails.carRental.id,
        paymentBreakup: [
          {
            // "paymentMethodRefId": "ea99994f-fdda-465c-9081-e65b7092b99f",
            amount: +carPricedetails.quotedTotalFare,
            currency: carPricedetails.currency,
            type: "Cash"
          }
        ],
        actualPaymentBreakup: [
          {
            amount: +carPricedetails.pricedTotalFare,
            currency: carPricedetails.currency,
            type: "Cash"
          }
        ],
        paymentMethod: {
          card_id: cardId,
          cards: [
            {
              refId: "ea99994f-fdda-465c-9081-e65b7092b99f",
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
                    type: "Mobile",
                    num: +this.state.phone,
                    countryCode: "1",
                    ext: "123"
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
                    name: this.state.region
                  },
                  countryCode: this.state.country,
                  postalCode: value.zipcode
                },
                email: value.email
              }
            }
          ]
        },
        customer: {
          name: {
            first: value.firstNameCar,
            last: value.lastNameCar
          },
          contactInfo: {
            address: {
              line1: value.address,
              city: {
                code: "SFO",
                name: value.city
              },
              state: {
                code: this.state.region,
                name: this.state.region
              },
              countryCode: this.state.country,
              postalCode: value.zipcode
            },
            email: value.email,
            phones: [
              {
                type: "Mobile",
                num: +this.state.phone,
                countryCode: "1",
                ext: "123"
              }
            ]
          },
          dob: moment(this.state.dob).format("YYYY-MM-DD"),
          // "nationality": this.state.nationality.value,
          nationality: this.state.country,
          specialRequest: value.specialRequest,
          // leadfirstName: value.leadfirstName,
          // messageDriver: value.messageDriver,
          // flightDetails: value.flightDetails,
          customerId: "43435"
        },

        driverInfo: {
          name: {
            first: value.firstNameCar,
            last: value.lastNameCar
          },
          contactInfo: {
            address: {
              line1: value.address,
              city: {
                code: "SFO",
                name: value.city
              },
              state: {
                code: this.state.region,
                name: this.state.region
              },
              countryCode: this.state.country,
              postalCode: value.zipcode
            },
            email: value.email,
            phones: [
              {
                type: "Mobile",
                num: +this.state.phone,
                countryCode: "1",
                ext: "123"
              }
            ]
          },
          dob: moment(this.state.dob).format("YYYY-MM-DD"),
          //"nationality":this.state.nationality.value
          nationality: this.state.country
        },
        carDetails: carPricedetails,
        carBookingParameters: carPricedetails.bookingParameters
      };
    });

    const transferPayloadArray = [].concat.apply(
      [],
      this.state.allBookingPayloadTransfer
    );

    // const transferPayload = transferPayloadArray.map(transfer => ({
    //   ...transfer,
    //   first_name: value.firstName,
    //   last_name: value.lastName,
    //   // TODO: fix country code
    //   mobile: `+91${this.state.phone}`,
    //   email: value.email
    // }));

    const transferPayload = transferPayloadArray.map(transfer => {
      let useCredit = false;

      if (!creditUsed) {
        useCredit = this.state.useCredit;
        creditUsed = true;
      }
      let crd_id;
      const credit = _get(
        this.props,
        "profileData.personal_info.credits.amount",
        null
      );
      // if(hotelPayload.length > 0 || carPayLoad > 0){
      //   crd_id = cardId
      // }else
      if (
        this.state.useCredit === true &&
        credit >= +transfer.book_data.totalAmount
      ) {
        crd_id = "credit";
      } else {
        crd_id = cardId;
      }

      return {
        useCredit: this.state.useCredit,
        currency: this.props.selectedCurrency,
        animals: transfer.book_data.animals,
        dropOffTime: transfer.book_data.dropOffTime,
        endPointGeocode: transfer.book_data.endPointGeocode,
        end_point: transfer.book_data.end_point,
        end_point_instructions: transfer.book_data.end_point_instructions,
        flightNo: transfer.book_data.flightNo,
        luggage: transfer.book_data.luggage,
        passengers: transfer.book_data.passengers,
        pickUpTime: transfer.book_data.pickUpTime,
        searchString: transfer.book_data.searchString,
        sport_luggage: transfer.book_data.sport_luggage,
        startPointGeocode: transfer.book_data.startPointGeocode,
        start_point_instructions: transfer.book_data.start_point_instructions,
        start_time_date: transfer.book_data.start_time_date,
        start_time_time: transfer.book_data.start_time_time,
        vehicle: transfer.book_data.vehicle,
        first_name: value.leadFirstName,
        last_name: value.leadLastName,
        mobile: this.state.phone,
        email: value.email,
        payment_method: "default",
        countryCode: this.state.country,
        postalCode: value.zipcode,
        line1: value.address,
        code: this.state.region,
        flightDetail: value.flightDetails,
        messageToDriver: this.state.messageToDriver,
        city: {
          code: "SFO",
          name: value.city
        },
        image: transfer.book_data.image_url,
        totalAmount: +transfer.book_data.totalAmount,
        paymentBreakup: [
          {
            // paymentMethodRefId: "1",
            amount: +transfer.book_data.regular_price,
            currency: transfer.book_data.currency_code,
            type: "Cash"
          }
        ],
        paymentMethod: {
          cards: [
            {
              num:
                value.cardNumber == null ||
                value.cardNumber == undefined ||
                value.cardNumber == ""
                  ? this.state.selected.last4
                  : value.cardNumber,
              nameOnCard:
                value.cardName == null ||
                value.cardName == undefined ||
                value.cardName == ""
                  ? this.state.selected.name
                  : value.cardName,
              cvv: value.cvv,
              issuedBy: "VI",
              expiry: {
                month:
                  value.month == null ||
                  value.month == undefined ||
                  value.month == ""
                    ? this.state.selected.exp_month
                    : value.month,
                year:
                  value.year == null ||
                  value.year == undefined ||
                  value.year == ""
                    ? this.state.selected.exp_year
                    : value.year
              },
              contactInfo: {
                phones: [{}],
                billingAddress: {
                  line1: value.address,
                  city: {
                    code: "SFO",
                    name: value.city
                  },
                  state: {
                    code: this.state.region,
                    name: this.state.region
                  },
                  countryCode: this.state.country,
                  postalCode: value.zipcode
                },
                email: value.email
              }
            }
          ],
          card_id: crd_id
        }
      };
    });

    const activityPayloadArray = [].concat.apply(
      [],
      this.state.allBookingPayloadActivity
    );
    // let breakAmount = _sumBy(
    //   activityPayloadArray,
    //   "activityList.retailPrice",
    //   null
    // );
    let breakAmount = _sumBy(activityPayloadArray, item =>
      Number(item.activityList.retailPrice)
    );
    let currCode = _get(
      activityPayloadArray[0],
      "activityList.currencyCode",
      null
    );
    const paymentMethod = {
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
                type: "Mobile",
                num: this.state.phone,
                countryCode: "1",
                ext: "123"
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
                name: this.state.region
              },
              countryCode: this.state.country,
              postalCode: value.zipcode
            },
            email: value.email
          }
        }
      ],
      card_id: cardId,
      paymentBreakup: [
        {
          amount: breakAmount.toFixed(2),
          currency: currCode,
          type: "Cash"
        }
      ]
    };

    const bookPayload = activityPayloadArray.map((activity, i) => {
      const travellers = [];
      const bookingQuestionAnswers = [];
      let retailPrice = _get(activity, "activityList.retailPrice");
      let currencyCode = _get(activity, "activityList.currencyCode");
      let productPhotos = _get(activity, "selectedActivityInfo.productPhotos");
      let ageBands = _get(activity, "activityList.ageBands[0].bandId");
      // let gradeCode = _get(activity, "activityList.gradeCode");
      let gradeCode = _get(activity, "selectedPackage");
      let code = _get(activity, "selectedActivityInfo.code");
      let bookingDate = _get(activity, "activityList.bookingDate");
      const title = _get(activity, "selectedActivityInfo.title");
      const { allBookingPayloadActivity } = this.props.context;
      const questions = _get(allBookingPayloadActivity[i], "questions", null);

      const bookingQuestions = _get(
        allBookingPayloadActivity[i],
        "travellerQuestions",
        null
      );

      const travellersCount = _sumBy(
        allBookingPayloadActivity[i].activityList.ageBands,
        "count"
      );
      _forEach(value, (val, k) => {
        const currentKey = k.split("@");
        if (currentKey.length > 1) {
          _times(travellersCount, indexx => {
            _forEach(bookingQuestions, (questionAnswer, i) => {
              if (
                currentKey[1] ===
                questionAnswer.questionId + gradeCode + i + indexx
              ) {
                const { questionId, id } = questionAnswer;
                let answer = val;

                if (value[title + "<>" + questionId + gradeCode]) {
                  answer += ` ${
                    value[title + "<>" + questionId + gradeCode]
                  }`;
                }

                bookingQuestionAnswers.push({
                  questionId: id,
                  answer
                });
              }
            });
          });
        }
      });
      _forEach(questions, q => {
        bookingQuestionAnswers.push({
          questionId: q.questionId,
          answer: value[title + "<>" + Number(q.questionId) + gradeCode]
        });
      });
      let selectedHotel = {
        hotelId: null,
        pickupPoint: null
      };
  
      if (value[title + "<>hotelId" + gradeCode] !== undefined) {
        
        _forEach(allBookingPayloadActivity[i].activityHotelList, hotel => {

          if (hotel.id === value[title + "<>hotelId" + gradeCode]) {
            selectedHotel = {
              hotelId: hotel.id,
              pickupPoint: hotel.hotelString
            };
          }
        });
      }else if(value[title + "<>hotelId" + gradeCode] == undefined && value[title + "<>hotelIdTxt" + gradeCode] !=""){
        selectedHotel = {
          hotelId: null,
          pickupPoint: value[title + "<>hotelIdTxt" + gradeCode]
        };
      }


      _times(travellersCount, indx => {
        travellers.push({
          bandId: ageBands,
          firstname: value["firstNameActivity" + gradeCode + indx],
          surname: value["lastNameActivity" + gradeCode + indx],
          title: "Mr",
          leadTraveller: indx === 0
        });
      });
      return {
        demo: true,
        currencyCode: currencyCode,
        partnerDetail: {
          distributorRef: null
        },
        booker: {
          email: value.email,
          homePhone: "",
          firstname: value["firstNameActivity" + gradeCode + i],
          surname: value["lastNameActivity" + gradeCode + i],
          title: "Mr",
          cellPhoneCountryCode: "IND",
          cellPhone: +this.state.phone
        },
        items: [
          {
            partnerItemDetail: {
              distributorItemRef: null
            },
            ...selectedHotel,
            travelDate: bookingDate,
            productCode: code,
            tourGradeCode: gradeCode,
            languageOptionCode: value.languageOptionCode,
            bookingQuestionAnswers,
            specialRequirements: value.specialRequest,
            travellers
            // travellers: [
            //   {
            //     bandId: ageBands,
            //     firstname: value.firstNameActivity,
            //     surname: value.lastNameActivity,
            //     title: "Mr",
            //     leadTraveller: true
            //   }
            // ]
          }
        ],
        images: productPhotos,
        totalAmount: retailPrice
      };
    });
    const activityPayload = {
      bookingPayload: bookPayload,
      paymentMethod: paymentMethod,
      email: value.email,
      credit: this.state.useCredit
    };
    // TO Sending In Query for MultipleBooking..
    let startLocation;
    let dropLocation;
    let allBookingPromise = [];
    this.props.loadingGifSearch();

    if (hotelPayload.length !== 0) {
      await request
        .post(URL.hotel.ROOM_BOOKING, hotelPayload)
        .then(data => {
          allBookingPromise.push(data);
          this.setState({
            bookingErrorHotel: "",
            bookingErrorCar: "",
            bookingErrorTransfer: "",
            bookingErrorActivity: ""
          });
        })
        .catch(err => {
          allBookingPromise.push({ error: err.response.data });
        });
    } else {
      allBookingPromise.push(null);
      this.setState({
        bookingErrorHotel: "",
        bookingErrorCar: "",
        bookingErrorTransfer: "",
        bookingErrorActivity: ""
      });
    }

    if (carPayLoad.length !== 0) {
      await request
        .post(URL.CAR_BOOKING, carPayLoad)
        .then(data => {
          if (data.data.hasOwnProperty("error")) {
            allBookingPromise.push({ error: data.data });
          } else {
            allBookingPromise.push(data);
            this.setState({
              bookingErrorHotel: "",
              bookingErrorCar: "",
              bookingErrorTransfer: "",
              bookingErrorActivity: ""
            });
          }
        })
        .catch(err => {
          allBookingPromise.push({ error: err.response.data });
        });
    } else {
      allBookingPromise.push(null);
      this.setState({
        bookingErrorHotel: "",
        bookingErrorCar: "",
        bookingErrorTransfer: "",
        bookingErrorActivity: ""
      });
    }

    if (transferPayload.length !== 0) {
      await request
        .post(URL.TRANSFER_BOOK, transferPayload)
        .then(data => {
          if (data.data.hasOwnProperty("error")) {
            allBookingPromise.push({ error: data.data });
          } else {
            startLocation = data.data.data.result[0].taxi.start_point.address;
            dropLocation = data.data.data.result[0].taxi.end_point.address;
            allBookingPromise.push(data);
            this.setState({
              bookingErrorHotel: "",
              bookingErrorCar: "",
              bookingErrorTransfer: "",
              bookingErrorActivity: ""
            });
          }
        })
        .catch(err => {
          allBookingPromise.push({ error: err.response.data });
        });
    } else {
      allBookingPromise.push(null);
      this.setState({
        bookingErrorHotel: "",
        bookingErrorCar: "",
        bookingErrorTransfer: "",
        bookingErrorActivity: ""
      });
    }
    if (activityPayloadArray.length !== 0) {
      await request
        .post(URL.ACTIVITY_BOOKING, activityPayload)
        .then(res => {
          allBookingPromise.push(res);
        })
        .catch(err => {
          allBookingPromise.push({ error: err.response.data });
        });
      // console.log("await data", booking_data)
      // let data_arr = [];
      // if(booking_data){
      //   for(let i = 0; i < booking_data.length; i++){
      //     let distributorRef = booking_data[i].data.distributorRef;
      // let distributorItemRef =
      // booking_data[i].data.itemSummaries[0].distributorItemRef;
      // let requestParam = `distributorRef=${distributorRef}&distributorItemRef=${distributorItemRef}`;
      //   await axios
      //   .get(URL.ACTIVITY_GET_STATUS_BOOKING + requestParam)
      //   .then(response => {
      //     if (response.data.hasOwnProperty("error")) {
      //               allBookingPromise.push({ error: response.data });
      //             } else {
      //               console.log("res response ?", response)
      //               data_arr.push(response);
      //               this.setState({
      //                 bookingErrorHotel: "",
      //                 bookingErrorCar: "",
      //                 bookingErrorTransfer: "",
      //                 bookingErrorActivity: ""
      //               });
      //             }
      // })
      // }
      //   }
      //   allBookingPromise.push(Object.assign({}, data_arr))
    } else {
      allBookingPromise.push(null);
      this.setState({
        bookingErrorHotel: "",
        bookingErrorCar: "",
        bookingErrorTransfer: "",
        bookingErrorActivity: ""
      });
    }

    await allBookingPromise.map(async (data, index) => {
      this.props.stopGifSearching();
      if (data && data.hasOwnProperty("error") && index === 0) {
        await this.setState({ isModal: true, bookingErrorCar: "" });
        this.setState({
          isModal: true,
          bookingErrorHotel: data.error.data.message
        });
      } else if (data && data.hasOwnProperty("error") && index === 1) {
        if (this.state.bookingErrorHotel === data.error.message) {
          await this.setState({ isModal: true, bookingErrorCar: "" });
        } else {
          await this.setState({
            isModal: true,
            bookingErrorHotel: data.error.message
          });
        }
      } else if (data && data.hasOwnProperty("error") && index === 2) {
        if (this.state.bookingErrorHotel === data.error.message) {
          await this.setState({ isModal: true, bookingErrorTransfer: "" });
        } else {
          await this.setState({
            isModal: true,
            bookingErrorHotel: data.error.message
          });
        }
      } else if (data && data.hasOwnProperty("error") && index === 3) {
        if (this.state.bookingErrorHotel === data.error.message) {
          await this.setState({ isModal: true, bookingErrorActivity: "" });
        } else {
          await this.setState({
            isModal: true,
            bookingErrorHotel: data.error.message
          });
        }
      }
    });

    if (this.state.bookingErrorHotel !== "Please Enater Valid Card Details") {
      let successData = [];
      allBookingPromise.map(responseData => {
        if (
          (responseData && responseData.hasOwnProperty("data")) ||
          responseData == null
        ) {
          successData.push(responseData);
        } else if (responseData && responseData.hasOwnProperty("error")) {
          successData.push(responseData);
        } else {
          successData.push(null);
        }
      });
      console.log("successData ::::::::::", successData);
      this.props.dumpValue(successData);
      this.props.replaceItinerary();

      // Written for Transfer Drop Off // Pick up PostCode BugFix
      if (transferPayload.length !== 0) {
        this.props.history.push(
          `/multipleconfirmation?pickUp=${startLocation}&dropOff=${dropLocation}`
        );
      } else {
        // Default Car , Hotel Booking Confirmation Page
        this.props.history.push("/multipleconfirmation");
      }
    }
  };

  handleBooking = async values => {
    const keys = ["cardNumber", "cardName", "cvv", "month", "year"];

    const value = cryptoJSON.encrypt(
      values,
      process.env.REACT_APP_SECRET_CODE,
      { encoding, keys, algorithm }
    );

    this.props.loadingGifSearch();
    if (
      this.props.loginStatus === false ||
      this.props.loginStatus === undefined
    ) {
      let passowrdGenerated = this.generatePassword();
      const payload = {
        name:
          value.firstName1 ||
          value.firstNameCar ||
          value.leadFirstName ||
          value.firstName,
        email: value.email,
        password: passowrdGenerated,
        type: "guest"
      };

      let userStatusResponse;
      await request
        .post(URL.USER_SIGNUP, payload)
        .then(data => {
          userStatusResponse = data.data;
        })
        .catch(err => {
          userStatusResponse = err.response.data;
        });
      if (userStatusResponse.status) {
        await request
          .post(URL.USER_LOGIN, {
            email: value.email,
            password: passowrdGenerated
          })
          .then(data => {
            if (data.status === 200) {
              request.get(URL.USER_INFO + value.email).then(res => {
                if (res.status === 200) {
                  sessionStorage.setItem(
                    "loginInfo",
                    JSON.stringify(res.data.data)
                  );
                  sessionStorage.setItem("loginTrue", JSON.stringify("true"));
                  this.props.dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: res.data.data
                  });
                  notify.show(
                    "Thanks for Registering with Us , Welcome to Xeniapp .Logged in successfully",
                    "success",
                    3000
                  );
                }
              });
            }
          })
          .catch(err => {
            // userStatusResponse=err.response.data
          });
        this.bookingFinalCheckout(value, value.email);
      } else if (
        userStatusResponse.status === false &&
        userStatusResponse.data.includes("Email already exists!")
      ) {
        this.props.stopGifSearching();
        this.setState({ email: value.email }, () => {
          this.setState({ isModalOpen: true });
        });
        this.setState({ isModal: false });
      }
    } else {
      const { email } = this.props.loginDetails && this.props.loginDetails;
      this.bookingFinalCheckout(value, email);
    }
  };

  changeCardInfo = () => {};
  handleCheckClick = () => {
    this.setState({ checkBoxChecked: !this.state.checkBoxChecked });

    // this.props.handleCheckClick(this.state.checkBoxChecked);
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
    let credit = _get(
      this.props,
      "profileData.personal_info.credits.amount",
      null
    );

    if (credit) {
      credit = parseInt(credit).toFixed(2);
    } else {
      credit = null;
    }

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

  // dynamicValidation = value => {
  //   if (!value) {
  //     return "isRequired";
  //   }

  //   return undefined;
  // };

  dynamicValidation = {
    required: value => {
      if (!value) {
        return "Required";
      }

      return undefined;
    },
    positiveInteger: value => {
      if (value <= 0) {
        return "Please enter the value more than 0";
      }

      if (!value) {
        return "Required";
      }

      return undefined;
    },
    selectOption: value => {
      if (value === "null") {
        return "Required";
      }

      return undefined;
    },
    selectHotelTxt: value => {
      if (!value) {
        return "Required";
      }

      return undefined;
    }
  };

  bookingQuestionsHtml = () => {
    const { allBookingPayloadActivity } = this.props.context;

    const bookingQuestions = _.map(allBookingPayloadActivity, i =>
      _get(i, "questions", null)
    );

    return (
      <React.Fragment>
        <div>
          {_map(bookingQuestions, (each, i) => {
            const title =
              allBookingPayloadActivity[i]["selectedActivityInfo"]["title"];
            const gradeCode =
              allBookingPayloadActivity[i]["selectedPackage"];
            return (
              <div>
                {each && each.length !== 0 && (
                  <span
                    style={{
                      padding: "5px 0",
                      fontWeight: "bold",
                      display: "block"
                    }}
                  >
                    Activity - {title}
                  </span>
                )}
                {_map(each, (q, index) => {
                  return (
                    <div className="row">
                      <div className="col-xl-9 col-lg-9 col-md-9">
                        <div className="form-group">
                          <Field
                            name={title + "<>" + q.questionId + gradeCode}
                            type="text"
                            label={q.title + (q.required ? ' *' : '')}
                            component={InputField}
                            placeholder={q.subTitle}
                            validate={
                              q.required
                                ? this.dynamicValidation.required
                                : _noop
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  };

  activityHotelListHtml = () => {
    const { allBookingPayloadActivity } = this.props.context;
    const activityHotelList = _.map(allBookingPayloadActivity, i =>
      _get(i, "activityHotelList", null)
    );

    return (
      <React.Fragment>
        <div>
          {_map(activityHotelList, (each, i) => {
            const title =
              allBookingPayloadActivity[i]["selectedActivityInfo"]["title"];
            const gradeCode =
              allBookingPayloadActivity[i]["selectedPackage"];
            const hotelPickup= allBookingPayloadActivity[i]["selectedActivityInfo"]["hotelPickup"];
            return hotelPickup && (
              <div>
                {each && each.length !== 0 ? (
                  <div>
                    <span
                      style={{
                        padding: "5px 0",
                        fontWeight: "bold",
                        display: "block"
                      }}
                    >
                      Activity - {title}
                    </span>

                    <div className="row">
                      <div className="col-xl-9 col-lg-9 col-md-9">
                        <div className="form-group">
                          <Field
                            name={title + "<>hotelId" + gradeCode}
                            type="text"
                            label="Choose Hotel Pickup Location *"
                            component={SelectField}
                            placeholder="Tour/Activity Language"
                            validate={this.dynamicValidation.selectOption}
                          >
                            <option value={null}>
                              Choose your pickup location
                            </option>
                            {_map(each, hotel => (
                              <option value={hotel.id}>{hotel.name}</option>
                            ))}
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>
                ) :  (
                  <div>
                    <span
                      style={{
                        padding: "5px 0",
                        fontWeight: "bold",
                        display: "block"
                      }}
                    >
                      Activity - {title}
                    </span>
                    <div className="row">
                      <div className="col-xl-9 col-lg-9 col-md-9">
                        <div className="form-group">
                          <Field
                            name={title + "<>hotelIdTxt" + gradeCode}
                            type="text"
                            label="Enter your Hotel pickup location *"
                            component={InputField}
                            placeholder="Enter your Hotel pickup location"
                            validate={this.dynamicValidation.selectHotelTxt}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  };
  langServicesHtml = () => {
    const { allBookingPayloadActivity } = this.props.context;
    // const langServices = _.map(allBookingPayloadActivity, i =>
    //   _get(i, "activityList.langServices", null)
    // );

    const langServices = _get(
      allBookingPayloadActivity[0],
      "activityList.langServices",
      null
    );
    if (langServices) {
      return (
        <div className="row">
          <div className="col-xl-5 col-lg-5 col-md-5">
            <div className="form-group">
              <Field
                name="languageOptionCode"
                type="text"
                label="Tour/Activity Language *"
                component={SelectField}
                placeholder="Tour/Activity Language"
                validate={this.dynamicValidation.selectOption}
              >
                <option value={null}>Choose Language</option>
                {_map(langServices, (value, key) => (
                  <option value={key}>{value}</option>
                ))}
              </Field>
            </div>
          </div>
        </div>
      );
    }
  };

  travellersList = () => {
    const { allBookingPayloadActivity } = this.props.context;
    const selectedActivity = _.map(allBookingPayloadActivity, i =>
      _get(i, "selectedActivityInfo", null)
    );

    return _map(selectedActivity, (each, index) => {
      const gradeCode =
        allBookingPayloadActivity[index]["selectedPackage"];
      const travellers = _sumBy(
        allBookingPayloadActivity[index].activityList.ageBands,
        "count"
      );
      const travellerQuestions =
        allBookingPayloadActivity[index]["travellerQuestions"];
      const title =
        allBookingPayloadActivity[index]["selectedActivityInfo"]["title"];
      return (
        <div>
          <div
            style={{
              padding: "5px 0",
              fontWeight: "bold",
              display: "block"
            }}
          >
            Activity - {title}
          </div>
          {each.allTravellerNamesRequired || !_isEmpty(_get(each, 'passengerAttributes', [])) ? (
            _times(travellers, i => (
              <React.Fragment>
                <h5>{i === 0 ? "Lead Traveller (Adult)" : `Traveller ${i + 1}`}</h5>
                <div className="row">
                  <div className="col-xl-5 col-lg-5 col-md-5">
                    <div className="form-group">
                      <Field
                        name={"firstNameActivity" + gradeCode + i}
                        type="text"
                        label="First Name *"
                        component={InputField}
                        placeholder="First Name"
                      />
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-4">
                    <div className="form-group">
                      <Field
                        name={"lastNameActivity" + gradeCode + i}
                        type="text"
                        label="Last Name *"
                        component={InputField}
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                </div>
                {_map(travellerQuestions, (q, key) => (
                  <div className="row">
                    <div className="col-xl-9 col-lg-9 col-md-9">
                      <div className="form-group">
                        <Field
                          name={
                            title + "@" + q.questionId + gradeCode + key + i
                          }
                          type="text"
                          label={q.title + (q.required ? ' *' : '')}
                          component={InputField}
                          validate={
                            q.required
                              ? this.dynamicValidation[q.validateType] ||
                                this.dynamicValidation.required
                              : _noop
                          }
                        />
                      </div>
                    </div>
                    {
                      <div className="col-xl-3 col-lg-3 col-md-3">
                        <div className="form-group">
                          <Field
                            name={
                              title + "<>" + q.questionId + gradeCode
                            }
                            type="text"
                            component={SelectField}
                            validate={this.dynamicValidation.selectOption}
                          >
                            <option value="null">choose option</option>
                            {_map(
                              _filter(q, (value, key) =>
                                key.includes("customAttribute")
                              ),
                              (value, key) => (
                                <option>{value}</option>
                              )
                            )}
                          </Field>
                        </div>
                      </div>
                    }
                  </div>
                ))}
              </React.Fragment>
            ))
          ) : (
            <React.Fragment>
              <h5>Lead Traveller (Adult)</h5>
              <div className="row">
                <div className="col-xl-5 col-lg-5 col-md-5">
                  <div className="form-group">
                    <Field
                      name={"firstNameActivity" + gradeCode + "0"}
                      type="text"
                      label="First Name *"
                      component={InputField}
                      placeholder="First Name"
                    />
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-4">
                  <div className="form-group">
                    <Field
                      name={"lastNameActivity" + gradeCode + "0"}
                      type="text"
                      label="Last Name *"
                      component={InputField}
                      placeholder="Last Name"
                    />
                  </div>
                </div>
              </div>
              {_map(travellerQuestions, (q, key) => (
                <div className="row">
                  <div className="col-xl-9 col-lg-9 col-md-9">
                    <div className="form-group">
                      <Field
                        name={title + "<>" + q.questionId + gradeCode + key}
                        type="text"
                        label={q.title + (q.required ? ' *' : '')}
                        component={InputField}
                        validate={
                          q.required ? this.dynamicValidation.required : _noop
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )}
        </div>
      );
    });
  };

  render() {
    const {
      handleSubmit,
      paymentFailureDetails,
      profileData,
      itineraryList
    } = this.props;
    const {
      country,
      region,
      isdivHide,
      isModalOpen,
      isDob,
      firstNameDisabled
    } = this.state;

    const credit = _get(
      this.props,
      "profileData.personal_info.credits.amount",
      null
    );
    const totalFareAmount = _sumBy(itineraryList, "price");
    const { useCredit } = this.state;
    let creditBool = false;

    if (useCredit === false) {
      creditBool = true;
    } else if (useCredit === true && credit < totalFareAmount) {
      creditBool = true;
    } else {
      creditBool = false;
    }

    let count = 0;
    const renderModel = isModalOpen && (
      <SignInModal
        emailAuto={this.state.email}
        isdivHide={isdivHide}
        onHide={this.close}
      />
    );
    let years = [],
      year = new Date().getFullYear();

    for (let i = year; i < year + 15; i++) {
      years.push(i);
    }
    let {
      allBookingPayloadCar,
      allBookingPayloadHotel,
      allBookingPayloadTransfer,
      allBookingPayloadActivity
    } = this.props.context;

    let selectedCountry = JSON.parse(localStorage.getItem("currency"));
    if (selectedCountry !== null) {
      selectedCountry = selectedCountry.COUNTRY_CODE;
    } else {
      selectedCountry = "IN";
    }
    let isTransBool = false;

    let isTransfer = this.props.itineraryList.map(each => {
      if (each.type === "transferCar") {
        isTransBool = true;
      }
      return isTransBool;
    });
    // const credit = _get(this.props, 'loginDetails.credits.amount', null);

    //    if(this.props.itineraryList[0].type === "transferCar"){
    //      transferCar = this.props.itineraryList[0].type;
    //    }
    //   else if(this.props.itineraryList[1].type === "transferCar"){
    //     transferCar = this.props.itineraryList[1].type;
    //   }
    //  else if(this.props.itineraryList[2].type === "transferCar"){
    //     transferCar = this.props.itineraryList[2].type;
    //    }
    //    else{
    //      transferCar = "transferCar1";
    //    }

    return (
      <React.Fragment>
        {renderModel}
        <form
          onSubmit={handleSubmit(this.handleBooking)}
          onClick={() => {
            this.setState({
              allBookingPayloadCar,
              allBookingPayloadHotel,
              allBookingPayloadTransfer,
              allBookingPayloadActivity
            });
          }}
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
                  {this.props.loginStatus && (
                    <div className="form-group">
                      {/* <label>Select your payment method</label>

                      <select
                        onChange={this.handleCardSelect}
                        value={this.state.cardInfo}
                      >
                        {this.state.card && this.state.card.length == 0 && (
                          <option value="">No saved Cards</option>
                        )}
                        {this.state.card && this.state.card.length > 0 && (
                          <option value="">select your card</option>
                        )}
                        {this.state.card &&
                          this.state.card.length >= 0 &&
                          _map(this.state.card, (each, i) => (
                            <option value={i}>
                              Card ending in {each.last4}
                            </option>
                          ))}
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
                          label="CVV *"
                          component={InputField}
                          placeholder="CVV "
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
                            this.setState({ cardName: e.target.value }, () => {
                              if (this.state.sameAsCreditCard) {
                                this.props.change("firstName", e.target.value);
                              }
                            })
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
                          style={{
                            backgroundColor: this.state.isCardInfoDisable
                              ? "#e9ecef"
                              : "unset"
                          }}
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
                          label="Address"
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
              {allBookingPayloadHotel.length !== 0 && (
                <div>
                  {_map(allBookingPayloadHotel, (obj, i) => {
                    return _map(obj, (formCount, i) => {
                      count += 1;
                      return (
                        <React.Fragment>
                          <h5 key={i}>
                            Who is Checking in? {"(Room" + count + ")"}
                          </h5>
                          <div className="row pt-2">
                            <div className="col-xl-5 col-lg-5 col-md-5">
                              <div className="form-group">
                                <Field
                                  name={"firstName" + count}
                                  type="text"
                                  label="First Name *"
                                  component={InputField}
                                  placeholder="First Name"
                                  disabled={firstNameDisabled}
                                />
                              </div>
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-4">
                              <div className="form-group">
                                <Field
                                  name={"lastName" + count}
                                  type="text"
                                  label="Last Name *"
                                  component={InputField}
                                  placeholder="Last Name"
                                />
                              </div>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-3">
                              <div className="form-group">
                                <label>Date of Birth *</label>
                                <DatePicker
                                  selected={
                                    this.state.startDate[count] ||
                                    moment()
                                      .subtract(17, "years")
                                      .toDate()
                                  }
                                  onChange={date =>
                                    this.handleChangeforHotel(date, count)
                                  }
                                  name={"dobForRoom" + count}
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  maxDate={moment()
                                    .subtract(17, "years")
                                    .year()
                                    .toString()}
                                  dropdownMode="select"
                                  placeholder="YYYY/MM/DD"
                                />
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    });
                  })}
                </div>
              )}
              {allBookingPayloadCar.length !== 0 && (
                <div>
                  <h5 />
                  <div className="row">
                    <div className="col-xl-5 col-lg-5 col-md-5">
                      <div className="form-group">
                        {/* <label className="whosText">Who is Driving?</label> */}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-5 col-lg-5 col-md-5">
                      <div className="form-group">
                        <Field
                          name="firstNameCar"
                          type="text"
                          label="First Name *"
                          component={InputField}
                          placeholder="First Name"
                          disabled={firstNameDisabled}
                        />
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4">
                      <div className="form-group">
                        <Field
                          name="lastNameCar"
                          type="text"
                          label="Last Name *"
                          component={InputField}
                          placeholder="Last Name"
                        />
                      </div>
                      
                      {/* TODO : same as credit card may be require in future */}
                      {/* <div className="form-group">
                    <label>Same as Credit Card</label>
                    <input
                      className="styled-checkbox"
                      id="styled-checkbox-1"
                      type="checkbox"
                      value={this.state.sameAsCreditCard}
                      name='sameAsCreditCard'
                      onChange={
                        () => {
                          this.setState({ sameAsCreditCard: !this.state.sameAsCreditCard, firstNameDisabled: !this.state.firstNameDisabled }, () => {
                            if (this.state.sameAsCreditCard) {
                              this.props.change('firstName', this.state.cardName)
                            } else {
                              this.props.change('firstName', '');
                            }
                          })
                        }
                      }
                    />
                    <label htmlFor="styled-checkbox-1" />
                  </div> */}
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-3">
                                    <div className="form-group">
                                        <label>Same as Credit Card</label>
                                        <input
                                            className="styled-checkbox"
                                            id="styled-checkbox-1"
                                            type="checkbox"
                                            onChange={() => {
                                                this.setState(
                                                    {
                                                        sameAsCreditCard: !this.state.sameAsCreditCard,
                                                        firstNameDisabled: !this.state.firstNameDisabled
                                                    },
                                                    () => {
                                                        if (this.state.sameAsCreditCard) {
                                                            this.props.change(
                                                                "firstName",
                                                                this.state.cardName
                                                            );
                                                        }
                                                    }
                                                );
                                            }}
                                            value={this.state.sameAsCreditCard}
                                        />
                                        <label htmlFor="styled-checkbox-1" />
                                    </div>
                                </div>

                    {/* {this.state.allBookingPayloadCar.length != 0 && this.state.allBookingPayloadHotel.length != 0 ? <div>Used</div>:<div>Tested</div>}
                     */}
                    {allBookingPayloadCar.length !== 0 &&
                    allBookingPayloadHotel.length !== 0 && (
                      <div />
                    )}
                  </div>
                </div>
              )}
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

              {allBookingPayloadActivity.length !== 0 && this.travellersList()}
              <div className="row" style={{marginTop:"20px"}}>
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
{
  allBookingPayloadCar.length !== 0 &&
  allBookingPayloadHotel.length == 0 && (
<div className="col-xl-3 col-lg-3 col-md-3">
                        <div className="form-group">
                          <label>Date of Birth *</label>

                          <DatePicker
                            selected={moment()
                              .subtract(17, "years")
                              .toDate()}
                            onChange={this.handleChange}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            maxDate={moment()
                              .subtract(17, "years")
                              .year()
                              .toString()}
                            dropdownMode="select"
                            placeholder="YYYY/MM/DD"
                          />
                        </div>
                      </div>
  )
  }
                
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
              {isTransfer.includes(true) && (
                <div>
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
                          name="leadFirstName"
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
                          name="leadLastName"
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
                          label="Flight Details:"
                          component={InputField}
                          type="text"
                          name="flightDetails"
                        />
                      </div>
                    </div>

                    {/* {this.state.flightNo !== "No Flight" ? (
                        <div className="col-xl-3 col-lg-3 col-md-3 pt-2">
                        <div className="form-group">

                          <label>Flight Name</label>
                          
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
                      ) : null} */}
                    {/* <div className="col-xl-3 col-lg-3 col-md-3 ">
                        <div className="form-group">
                          <label>Message to driver:</label>

                          <textarea style={{ height: "50px" }} type="text" />
                        </div>
                      </div> */}
                  </div>
                  <div className="row">
                    <div className="col-xl-5 col-lg-5 col-md-5 ">
                      <div className="form-group">
                        <label>Message to driver:</label>

                        <textarea
                          type="text"
                          name="messageToDriver"
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
              )}
              {allBookingPayloadActivity.length !== 0 && (
                <h5>Tour specifics</h5>
              )}
              {this.bookingQuestionsHtml()}
              {this.activityHotelListHtml()}
              {this.langServicesHtml()}

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
                      this.state.checkBoxChecked == false ||
                      this.state.phone == "" ||
                      this.state.contactValid == false
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
                  <h4>{this.state.bookingErrorHotel}</h4>
                  <br />
                  {/* <h4>
                       {this.state.bookingErrorCar}
                    </h4> */}
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

const fieldValidation = formProps => {
  const errors = {};
  if (
    formProps.selectedCard == "" ||
    formProps.selectedCard == null ||
    formProps.selectedCard == undefined
  ) {
    if (!formProps.cardNumber) {
      errors.cardNumber = "Required";
    } else if (/\D/.test(formProps.cardNumber)) {
      errors.cardNumber = "Numbers only allowed";
    }
    if (!formProps.cardName) {
      errors.cardName = "Required";
    }
  }
  if (!formProps.cvv) {
    errors.cvv = "Required";
  } else if (!/^[0-9]{3,4}$/.test(formProps.cvv)) {
    errors.cvv = "Cvv should contain 3-4 digit";
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

    if (formProps.year !== "" && !/^[0-9]+$/.test(formProps.year)) {
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

  if (!formProps.firstNameCar) {
    errors.firstNameCar = "First name is Required";
  } else if (formProps.firstNameCar.includes(".")) {
    errors.firstNameCar = "Please enter valid first name";
  }

  if (!formProps.lastNameCar) {
    errors.lastNameCar = "Last name is required";
  } else if (formProps.lastNameCar.includes(".")) {
    errors.lastNameCar = "Please enter valid last name";
  }

  // if (!formProps.firstNameActivity) {
  //   errors.firstNameActivity = "First name is Required";
  // } else if (formProps.firstNameActivity.includes(".")) {
  //   errors.firstNameActivity = "Please enter valid first name";
  // }

  // if (!formProps.lastNameActivity) {
  //   errors.lastNameActivity = "Last name is required";
  // } else if (formProps.lastNameActivity.includes(".")) {
  //   errors.lastNameActivity = "Please enter valid last name";
  // }

  $("input[name^='firstNameActivity']").each(function(key, value) {
    const inputName = $(this).attr("name");
    if ($(this).val() == "") {
      errors[inputName] = "First name is Required";
    } else if (
      $(this)
        .val()
        .includes(".")
    ) {
      errors[inputName] = "Please enter valid first name";
    }

    if ($(this).val() && ($(this).val().length < 1 || $(this).val().length > 15)) {
      errors[inputName] = "First name should contain 1 to 15 characters";
    }
  });

  $("input[name^='lastNameActivity']").each(function(key, value) {
    const inputName = $(this).attr("name");
    if ($(this).val() == "") {
      errors[inputName] = "Last name is required";
    } else if (
      $(this)
        .val()
        .includes(".")
    ) {
      errors[inputName] = "Please enter valid last name";
    }

    if ($(this).val() && ($(this).val().length < 2 || $(this).val().length > 35)) {
      errors[inputName] = "Last name should contain 2 to 35 characters";
    }
  });

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

  if (!formProps.leadFirstName) {
    errors.leadFirstName = "First name is Required";
  } else if (formProps.leadFirstName.includes(".")) {
    errors.leadFirstName = "Please enter valid first name";
  }

  if (!formProps.leadLastName) {
    errors.leadLastName = "Last name is required";
  } else if (formProps.leadLastName.includes(".")) {
    errors.leadLastName = "Please enter valid last name";
  }

  return errors;
};

const mapStateToProps = state => ({
  itineraryList: state.addcartReducer.itineraryList,
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

  // loginDetails: state.loginReducer.loginDetails,
  paymentDetails: state.paymentReducer.paymentDetails,
  getCardDetails: state.cardReducer.getCardDetails,
  bookingConfirm: state.paymentReducer.bookingConfirm,
  loginStatus: state.loginReducer.loginStatus,
  bookingConfirmFail: state.paymentReducer.bookingConfirmFail,
  paymentFailureDetails: state.paymentReducer.paymentFailureDetails,
  bookingFailed: state.paymentReducer.bookingFailed,
  selectedCurrency: state.commonReducer.selectedCurrency,
  profileData: state.dashboardReducer.profileData,
  currencySym: state.commonReducer.currencySym,
  isProfileEmpty: state.dashboardReducer.isProfileEmpty,
  isTravelAgent: state.dashboardReducer.isTravelAgent
});
const mapDispatchToProps = dispatch => ({
  bookingReset: () => dispatch(bookingReset()),
  payment: payload => dispatch(payment(payload)),
  getCard: email => dispatch(getCard(email)),
  loadingGifSearch: () => dispatch(loadingGifSearch()),
  stopGifSearching: () => dispatch(stopGifSearching()),
  getProfile: value => dispatch(getProfile(value)),
  dumpValue: data => dispatch(dumpValue(data)),
  replaceItinerary: () => dispatch(replaceItinerary([])),
  loginInfo: (guestFlag, loginpayload, payloadInfo) =>
    dispatch(loginInfo(guestFlag, loginpayload, payloadInfo))
});

class MultipleBooking extends Component {
  render() {
    return (
      <MultipleContext.Consumer>
        {({
          allBookingPayloadCar,
          allBookingPayloadHotel,
          addUpdatedPaymentResult,
          allBookingPayloadTransfer,
          allBookingPayloadActivity
        }) => {
          return (
            <MulipleBookingPaymentView
              context={{
                allBookingPayloadCar,
                allBookingPayloadHotel,
                addUpdatedPaymentResult,
                allBookingPayloadTransfer,
                allBookingPayloadActivity
              }}
              {...this.props}
            />
          );
        }}
      </MultipleContext.Consumer>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    reduxForm({
      form: "paymentMulti",
      validate: fieldValidation
    })(MultipleBooking)
  )
);

MulipleBookingPaymentView.propTypes = {
  isdivHide: propTypes.bool
};
