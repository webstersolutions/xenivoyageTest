import React, {Component} from "react";
import {connect} from "react-redux";
import {reduxForm, Field} from "redux-form";
import propTypes from "prop-types";
import {withRouter} from "react-router-dom";
import request from "../../../Utils/request-process";
import axios from "axios";
import moment from "moment";
import PhoneInput from "react-phone-number-input";
import {isValidPhoneNumber} from "react-phone-number-input";
import {CountryDropdown, RegionDropdown} from "react-country-region-selector";
import "react-phone-number-input/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    map as _map,
    pick as _pick,
    partialRight as _partialRight,
    isEmpty as _isEmpty,
    get as _get,
    noop as _noop,
    forEach as _forEach,
    times as _times,
    find as _find,
    remove as _remove,
    filter as _filter,
    clone as _clone
} from "lodash";

import CompleteBookingLogin from "../../container/login/completeBookingLoginModel";

import {getCard} from "../../../service/card/action";
import URL from "../../../asset/configUrl";
import {activityBook, activityGetPayload} from "../../../service/activities/action";

import {bookingSignUpInfo, signupReset} from "../../../service/login/action";

import {getProfile} from "../../../service/dashboard/action"

import InputField from "../../Fields/TextField";
import SelectField from "../../Fields/SelectField";
import countryList from "react-select-country-list";

import img_paymentCard from "../../../asset/images/paymentCard1.png";

import queryString from "query-string";

import cryptoJSON from "crypto-json";

const algorithm = 'aes256';
const encoding = 'hex';

const currencies = require("country-data").currencies;

class ActivityPayment extends Component {
    state = {
        isModal: false,
        card: [],
        selected: [],
        phone: "",
        concatError: "",
        contactValid: true,
        country: "",
        region: "",
        countryFilter: "",
        isdivHide: true,
        isModalOpen: false,
        onCardSelected: false,
        isDob: false,
        sameAsCreditCard: false,
        firstNameDisabled: false,
        dob: moment().subtract("years", 18),
        options: countryList().getData(),
        nationality: "",
        cardName: "",
        checkBoxChecked: false,
        startDate: moment()
            .subtract(17, "years")
            .toDate(),
        useCredit: false,
        travellerQuestions: [],
        questions: [],
        hotelIdTxt: "",
        selectedCard: "",
    };

    dynamicValidation = {
        required: value => {
            if (!value) {
                return 'Required'
            }

            return undefined;
        },
        positiveInteger: value => {
            if (value <= 0) {
                return 'Please enter the value more than 0'
            }

            if (!value) {
                return 'Required'
            }

            return undefined;
        },
        selectOption: value => {
            if (value === 'null') {
                return 'Required';
            }

            return undefined;
        },
        selectHotelTxt: value => {
            if (!value) {
                return 'Required';
            }

            return undefined;
        }
    };

    handleChange = date => {
        this.setState({
            startDate: date
        });
    };

    handleFormInitialValues = (profileData = {}, addtionalInfo = {}) => {
        this.setState({
            cardName: "" || (this.state.selected && this.state.selected.name)
        });

        if (this.state.sameAsCreditCard) {
            this.props.change(
                "firstName0",
                "" || (this.state.selected && this.state.selected.name)
            );
        }

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
            email: profileData && profileData.personal_info && profileData.personal_info.email,
            firstName0: profileData && profileData.personal_info && profileData.personal_info.first_name,
            lastName0: profileData && profileData.personal_info && profileData.personal_info.last_name,
            address: profileData && profileData.address_info && profileData.address_info.street_address,
            city: profileData && profileData.address_info && profileData.address_info.city,
            zipcode: profileData && profileData.address_info && profileData.address_info.postal_code,
            ...addtionalInfo,
        });

        this.setState({
            country: profileData && profileData.address_info && profileData.address_info.country,
            region: profileData && profileData.address_info && profileData.address_info.state,
            phone: profileData && profileData.personal_info && profileData.personal_info.phone_number && profileData.personal_info.phone_number.toString()
        })

        // this.props.initialize({
        //   firstName: "" || (this.state.selected && this.state.selected.name),
        //   cardNumber: "" || (this.state.selected && this.state.selected.last4),
        //   cardName: "" || (this.state.selected && this.state.selected.name),
        //   cvv: "",
        //   month: "" || (this.state.selected && this.state.selected.exp_month),
        //   year: "" || (this.state.selected && this.state.selected.exp_year)
        // });
    };

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

    componentDidMount() {
        axios.get("https://restcountries.eu/rest/v2/all").then(response => {
            this.setState({
                countryFilter: _map(
                    response.data,
                    _partialRight(_pick, ["name", "alpha2Code"])
                )
            });
        });
        this.props.signupReset();

        const userSession = JSON.parse(sessionStorage.getItem('loginInfo'));
        if (userSession && userSession) {
            const {email} = userSession && userSession;
            this.props.getProfile(email);
        }

        /*setTimeout(() => {
            this.handleFormInitialValues();
        }, 500);*/

        const credit = _get(this.props, 'loginDetails.credits.amount', null);
        const creditCurrency = _get(this.props, 'loginDetails.credits.currency', 'USD');

        if (credit !== null && creditCurrency === this.props.selectedCurrency) {
            this.setState({
                useCredit: true,
            })
        }

        if (this.props.selectedActivity) {
            const questions = _clone(this.props.selectedActivity.bookingQuestions);

            this.setState({
                travellerQuestions: _map(this.props.selectedActivity.passengerAttributes, attr => {
                    const matchedQuestion = _find(this.props.selectedActivity.bookingQuestions, q => q.stringQuestionId === attr.questionId);
                    let id = attr.questionId;
                    if (matchedQuestion) {
                        id = matchedQuestion.questionId;
                        _remove(questions, question => question.questionId === id);
                    }
                    return {
                        ...attr,
                        id
                    };
                })
            }, () => {
                this.setState({
                    questions,
                })
            })
        }

    }

    getAddressFromProfile = () => {

        return (
            <React.Fragment>
                <input
                    name="isProfile"
                    type="checkbox"
                    className="filtercheckbox"
                    id="checkA8"
                    onChange={() => {
                        this.getProfile()
                    }}
                />
                <label htmlFor="checkA8">Same As Profile Address</label>
            </React.Fragment>
        )
    };

    handleCardSelect = e => {
        if (e.target.value) {
            this.setState({
                selected: this.state.card[e.target.value],
                 onCardSelected: true,
                 selectedCard: e.target.value
                });
        } else {
            this.setState({
                onCardSelected: false,
                selected: {id: ""},
                selectedCard: ""
            });
            this.props.change("cardName", "");
            this.props.change("cardNumber", "");
            this.props.change("cvv", "");
            this.props.change("month", "");
            this.props.change("year", "");
        }
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.loginDetails != nextProps.loginDetails) {
            this.props.getProfile(nextProps.loginDetails.email);

            /* setTimeout(() => {
                 this.handleFormInitialValues();
             }, 500);*/
        }
        try {
            if (nextProps.loginDetails) {
                if (this.state.card && this.state.card.length == 0) {
                    this.getCard(nextProps.loginDetails);
                }
            } else {
                this.setState({card: []});
            }
        } catch (e) {
        }

        if (nextProps.hasOwnProperty("paymentDetails")) {
            if (nextProps.paymentDetails != this.props.paymentDetails) {
                if (
                    nextProps.paymentDetails.hasOwnProperty("data") &&
                    nextProps.paymentDetails.data == "success"
                ) {
                    const addedQueryString = queryString.parse(
                        this.props.location.search
                    );
                    this.props.history.push(
                        "/carbookingconfirmation?" +
                        queryString.stringify({
                            ...addedQueryString,
                            bookingId: nextProps.paymentDetails.completedBookingIds[0]
                        })
                    );
                } else if (nextProps.paymentDetails.hasOwnProperty("error")) {
                    this.setState({isModal: true});
                    //this.setState({ isModalOpen: false })
                }
            }
        }

        const {gustLoginCar} = nextProps;

        if (gustLoginCar === "failure" || gustLoginCar) {
            this.setState({isModalOpen: true});
        }

        if (gustLoginCar === "success") {
            this.setState({isModalOpen: false});
            //this.setState({ isModal: true });
        }

        if (nextProps.isTravelAgent && !_isEmpty(nextProps.profileData) && !this.state.initialValues) {
            this.getProfile(true);
        }

        if (nextProps.selectedActivity !== this.props.selectedActivity) {
            const questions = _clone(nextProps.selectedActivity.bookingQuestions);

            this.setState({
                travellerQuestions: _map(nextProps.selectedActivity.passengerAttributes, attr => {
                    const matchedQuestion = _find(nextProps.selectedActivity.bookingQuestions, q => q.stringQuestionId === attr.questionId);
                    let id = attr.questionId;
                    if (matchedQuestion) {
                        id = matchedQuestion.questionId;
                        _remove(questions, question => question.questionId === id);
                    }
                    return {
                        ...attr,
                        id
                    };
                })
            }, () => {
                this.setState({
                    questions,
                })
            })
        }

        if (nextProps.totalTravellers > 0 && nextProps.totalTravellers !== this.props.totalTravellers) {
            const additionInfo = {};

            if (nextProps.selectedActivity.allTravellerNamesRequired && nextProps.totalTravellers) {
                _times(nextProps.totalTravellers - 1, i => {
                    additionInfo[`firstName${i + 1}`] = '';
                    additionInfo[`lastName${i + 1}`] = '';
                })
            }
            ;
            this.handleFormInitialValues(nextProps.profileData, additionInfo);
        }
    }

    getProfile = (forceUpdate = false) => {
        this.setState({initialValues: !this.state.initialValues});
        if (!this.state.initialValues || forceUpdate) {
            if (this.props.loginStatus) {
                this.handleFormInitialValues(this.props.profileData);
            }
        } else {
            this.handleFormInitialValues();
        }
    };

    selectCountry(val) {
        this.setState({country: val});
    }

    selectRegion(val) {
        this.setState({region: val});
    }

    handleModal = () => {
        this.setState({isModal: !this.state.isModal});
    };

    handleSelectCard = e => {
        this.setState({card: e.target.value});
    };

    close = () => {
        this.setState({isModalOpen: false});
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

    changeHandlerNationality = e => {
        this.setState({nationality: e.target.value});
    };

    handleBooking = values => {
        const keys = ['cardNumber', 'cardName', 'cvv', 'month', 'year'];

        const value = cryptoJSON.encrypt(
            values, process.env.REACT_APP_SECRET_CODE, {encoding, keys, algorithm}
        );
        console.log(value);
        console.log(values);

        const {selectedActivity: {bookingQuestions}, totalTravellers} = this.props;
        const {questions} = this.state;
        const bookingQuestionAnswers = [];
        const travellers = [];

        _forEach(value, (val, k) => {
            const currentKey = k.split('@');

            if (currentKey.length > 1) {
                _forEach(bookingQuestions, questionAnswer => {
                    if (currentKey[0] === questionAnswer.stringQuestionId) {
                        const {questionId, stringQuestionId} = questionAnswer;
                        let answer = val;

                        if (value[stringQuestionId]) {
                            answer += ` ${value[stringQuestionId]}`
                        }

                        bookingQuestionAnswers.push({
                            questionId,
                            answer,
                        });
                    }
                });
            }
        });

        _forEach(questions, q => {
            bookingQuestionAnswers.push({
                questionId: q.questionId,
                answer: value[q.stringQuestionId]
            })
        });

        _times(totalTravellers, i => {
            travellers.push({
                bandId: this.props.selectedActivityPrice.ageBands[0].bandId,
                firstname: value['firstName' + i],
                surname: value['lastName' + i],
                title: "Mr",
                leadTraveller: i === 0,
            })
        });


        let selectedHotel = {
            hotelId: null,
            pickupPoint: null,
        };
        if (value.hotelId !== undefined) {
            _forEach(this.props.activityHotelList, hotel => {

                if (hotel.id === value.hotelId) {
                    selectedHotel = {
                        hotelId: hotel.id,
                        pickupPoint: hotel.name,
                    }
                }

            })
        } else if (!value.hotelId !== undefined) {
            selectedHotel = {
                hotelId: null,
                pickupPoint: value.hotelIdTxt,
            }


        }

        if (
            this.props.loginStatus === false ||
            this.props.loginStatus === undefined
        ) {
            const guestFlag = "ActivityBookingFlag";
            const email = value.email;

            let paymentCardId = this.state.selected.id;
            const payloadInfo = {
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
                                email: value.email,
                            }
                        }
                    ],
                    card_id: paymentCardId,
                    paymentBreakup: [
                        {
                            amount: this.props.selectedActivityPrice.retailPrice,
                            currency: this.props.selectedActivityPrice.currencyCode,
                            type: "Cash"
                        }
                    ]
                },
                bookingPayload: [
                    {
                        demo: true,
                        currencyCode: this.props.selectedActivityPrice.currencyCode,
                        booker: {
                            email: value.email,
                            homePhone: "",
                            firstname: value.firstName0,
                            surname: value.lastName0,
                            title: "Mr",
                            cellPhoneCountryCode: "IND",
                            cellPhone: +this.state.phone
                        },
                        items: [
                            {
                                ...selectedHotel,
                                travelDate: this.props.selectedActivityPrice.bookingDate,
                                productCode: this.props.selectedActivity.code,
                                tourGradeCode: this.props.selectedActivityPrice.gradeCode,
                                languageOptionCode: value.languageOptionCode,
                                bookingQuestionAnswers,
                                specialRequirements: value.specialRequest,
                                travellers,
                            }
                        ],
                        totalAmount: this.props.selectedActivityPrice.retailPrice,
                        merchantAmount: this.props.selectedActivityPrice.merchantNetPrice
                    }
                ],
                email: value.email,
                credit: this.state.useCredit,
                bookingQuestionAnswers,
                travellers,
                bookingQuestions,
                selectedActivity: this.props.selectedActivity
            };

            const payload = {
                name: value.firstName,
                email: value.email,
                password: this.generatePassword()
            };

            sessionStorage.setItem("loginInfoBooking", JSON.stringify(payload));
            this.props.bookingSignUpInfo(guestFlag, payload, payloadInfo);
            this.props.activityGetPayload(payloadInfo);

        } else {
            const {email} = this.props.loginDetails && this.props.loginDetails;

            let paymentCardId = this.state.selected.id;
            const payload = {
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
                                email: value.email,
                            }
                        }
                    ],
                    card_id: paymentCardId,
                    paymentBreakup: [
                        {
                            amount: this.props.selectedActivityPrice.retailPrice,
                            currency: this.props.selectedActivityPrice.currencyCode,
                            type: "Cash"
                        }
                    ]
                },
                bookingPayload: [
                    {
                        demo: true,
                        currencyCode: this.props.selectedActivityPrice.currencyCode,
                        partnerDetail: {
                            distributorRef: null
                        },
                        booker: {
                            email: value.email,
                            homePhone: "",
                            firstname: value.firstName0,
                            surname: value.lastName0,
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
                                travelDate: this.props.selectedActivityPrice.bookingDate,
                                productCode: this.props.selectedActivity.code,
                                tourGradeCode: this.props.selectedActivityPrice.gradeCode,
                                languageOptionCode: value.languageOptionCode,
                                bookingQuestionAnswers,
                                specialRequirements: value.specialRequest,
                                travellers,
                            }
                        ],
                        images: this.props.selectedActivity.productPhotos,
                        totalAmount: this.props.selectedActivityPrice.retailPrice,
                        merchantAmount: this.props.selectedActivityPrice.merchantNetPrice
                    }
                ],
                email: value.email,
                credit: this.state.useCredit,
                bookingQuestionAnswers,
                travellers,
                bookingQuestions,
                selectedActivity: this.props.selectedActivity
            };

            this.props.activityBook(payload);
        }
    };
    handleCheckClick = () => {
        this.setState({checkBoxChecked: !this.state.checkBoxChecked});
    };

    useCreditAmount = () => {
        const credit = _get(this.props, 'profileData.personal_info.credits.amount', null);
        const creditCurrency = _get(this.props, 'profileData.personal_info.credits.currency', 'USD');

        return credit && creditCurrency === this.props.selectedCurrency && (
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
                        })
                    }}
                />
                <label htmlFor="isUseCredit">Use credit amount {currencies[creditCurrency].symbol}{credit.toFixed(2)}</label>
            </React.Fragment>
        );
    };


    render() {
        const {
            handleSubmit, paymentDetails, carPaymentInfo,
            selectedActivity, selectedActivityPrice, activityHotelList, totalTravellers
        } = this.props;
        let response;
        // const {retailPrice} = selectedActivityPrice
        const retailPrice = selectedActivityPrice && selectedActivityPrice.retailPrice
        //{paymentDetails && paymentDetails.data ? paymentDetails.data: ""}

        if (paymentDetails && paymentDetails.data === "") {
            response = "";
        } else if (paymentDetails && paymentDetails.message === "success") {
            response = paymentDetails.data;
        } else if (paymentDetails && paymentDetails.message === "failure") {
            response = paymentDetails.data.message;
        }

        const {country, region, isdivHide, isModalOpen, travellerQuestions, questions} = this.state;
        const renderModel = isModalOpen && (
            <CompleteBookingLogin
                paymentInfo={carPaymentInfo}
                isdivHide={isdivHide}
                onHide={this.close}
            />
        );

        var years = [],
            year = new Date().getFullYear();

        for (var i = year; i < year + 15; i++) {
            years.push(i);
        }
        let selectedCountry = JSON.parse(localStorage.getItem("currency"));
        selectedCountry = selectedCountry.COUNTRY_CODE;

        const credit = _get(
            this.props,
            "profileData.personal_info.credits.amount",
            null
        );
        const {useCredit} = this.state;
        let creditBool = false;

        if (useCredit === false) {
            creditBool = true;
        } else if (useCredit === true && credit < parseInt(retailPrice)) {
            creditBool = true;
        } else {
            creditBool = false;
        }

        return (
            <React.Fragment>
                {renderModel}

                <form
                    onSubmit={handleSubmit(this.handleBooking)}
                    style={{width: "100%"}}
                >
                    <div>
                        <div className="headerTitles paymentRes justify-content-start">
                            <h5>Pay with Credit Card / Debit Card</h5>
                            <img src={img_paymentCard} className="cardImg" alt=""/>
                        </div>
                        <div className="paymentDetails">
                            <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                    {this.props.loginDetails && (
                                        <div className="form-group">
                                            {/* <label>Select your payment method</label>

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
                            <h5>
                                {this.useCreditAmount()}
                            </h5>
                            {creditBool && (
                                <div>
                                    <div className="row">
                                        <div className="col-xl-9 col-lg-9 col-md-9">
                                            <div className="form-group">
                                                <Field
                                                    className="creditcardNumber"
                                                    name="cardNumber"
                                                    disabled={this.state.onCardSelected}
                                                    type="text"
                                                    label="Credit Card Number *"
                                                    component={InputField}
                                                    placeholder="Enter Your Card Number "
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
                                                    disabled={this.state.onCardSelected}
                                                    component={InputField}
                                                    onChange={e =>
                                                        this.setState({cardName: e.target.value}, () => {
                                                            if (this.state.sameAsCreditCard) {
                                                                this.props.change("firstName", e.target.value);
                                                            }
                                                        })
                                                    }
                                                    placeholder="Enter Your Name of card "
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-3 col-lg-3 col-md-3">
                                            <div className="form-group">
                                                <Field
                                                    name="month"
                                                    type="text"
                                                    label="Valid Thru *"
                                                    component={SelectField}
                                                    disabled={this.state.onCardSelected}
                                                    placeholder="Expired month"
                                                >
                                                    <option>Select the Month</option>
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
                                                    disabled={this.state.onCardSelected}
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
                            {this.props.isTravelAgent
                                ? (

                                    <div style={{display: this.props.isProfileEmpty ? 'block' : 'none'}}>
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
                                )
                                : (
                                    <React.Fragment>
                                        <h5>Billing
                                            Address {this.props.loginStatus ? this.getAddressFromProfile() : ''}</h5>
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
                                )
                            }
                            {
                                selectedActivity && (selectedActivity.allTravellerNamesRequired || !_isEmpty(_get(selectedActivity, 'passengerAttributes', [])))
                                    ? _times(totalTravellers, i => (
                                        <React.Fragment>
                                            <h5>{i === 0 ? 'Lead Traveller (Adult)' : `Traveller ${i + 1}`}</h5>
                                            <div className="row">
                                                <div className="col-xl-5 col-lg-5 col-md-5">
                                                    <div className="form-group">
                                                        <Field
                                                            name={"firstName" + i}
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
                                                            name={"lastName" + i}
                                                            type="text"
                                                            label="Last Name *"
                                                            component={InputField}
                                                            placeholder="Last Name"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                _map(travellerQuestions, q => (
                                                    <div className="row">
                                                        <div className="col-xl-9 col-lg-9 col-md-9">
                                                            <div className="form-group">
                                                                <Field
                                                                    name={q.questionId + '@' + i}
                                                                    type="text"
                                                                    label={q.title + (q.required ? ' *' : '')}
                                                                    component={InputField}
                                                                    validate={q.required
                                                                        ? this.dynamicValidation[q.validateType] || this.dynamicValidation.required
                                                                        : _noop}
                                                                />
                                                            </div>
                                                        </div>
                                                        {
                                                            <div className="col-xl-3 col-lg-3 col-md-3">
                                                                <div className="form-group">
                                                                    <Field
                                                                        name={q.questionId}
                                                                        type="text"
                                                                        component={SelectField}
                                                                        validate={this.dynamicValidation.selectOption}
                                                                    >
                                                                        <option value="null">choose option</option>
                                                                        {
                                                                            _map(_filter(q, (value, key) => key.includes('customAttribute')), (value, key) => (
                                                                                <option>{value}</option>
                                                                            ))
                                                                        }
                                                                    </Field>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </React.Fragment>
                                    ))
                                    : <React.Fragment>
                                        <h5>Lead Traveller (Adult)</h5>
                                        <div className="row">
                                            <div className="col-xl-5 col-lg-5 col-md-5">
                                                <div className="form-group">
                                                    <Field
                                                        name={"firstName0"}
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
                                                        name={"lastName0"}
                                                        type="text"
                                                        label="Last Name *"
                                                        component={InputField}
                                                        placeholder="Last Name"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            _map(travellerQuestions, q => (
                                                <div className="row">
                                                    <div className="col-xl-9 col-lg-9 col-md-9">
                                                        <div className="form-group">
                                                            <Field
                                                                name={q.stringQuestionId + '_' + 0}
                                                                type="text"
                                                                label={q.title + (q.required ? ' *' : '')}
                                                                component={InputField}
                                                                validate={q.required ? this.dynamicValidation.required : _noop}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </React.Fragment>

                            }
                            <br/>
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
                                            placeholder="Enter Mobile Number"
                                            name="contact"
                                            country={selectedCountry}
                                            value={this.state.phone}
                                            onChange={phone =>
                                                this.setState({phone}, () => {
                                                    if (phone) {
                                                        if (isValidPhoneNumber(phone)) {
                                                            this.setState({
                                                                concatError: "",
                                                                contactValid: true
                                                            });
                                                        } else {
                                                            this.setState({
                                                                concatError: "Please enter valid Mobile Number",
                                                                contactValid: false
                                                            });
                                                        }
                                                    }
                                                })
                                            }
                                        />

                                        {!this.state.contactValid && (
                                            <span style={{color: "red"}}>
                                                {this.state.concatError}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/*<div className="col-xl-3 col-lg-3 col-md-3">
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
                                </div>*/}
                            </div>
                            <h5>Tour specifics</h5>
                            {
                                questions.length > 0 &&
                                <div>
                                    {
                                        _map(questions, q => (
                                            <div className="row">
                                                <div className="col-xl-9 col-lg-9 col-md-9">
                                                    <div className="form-group">
                                                        <Field
                                                            name={q.stringQuestionId}
                                                            type="text"
                                                            label={q.title + (q.required ? ' *' : '')}
                                                            component={InputField}
                                                            placeholder={q.subTitle}
                                                            validate={q.required ? this.dynamicValidation.required : _noop}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }

                            {
                                selectedActivity && selectedActivity.hotelPickup == true && <div className="row">
                                    {
                                        <div className="col-xl-9 col-lg-9 col-md-9">
                                            <div className="form-group">
                                                {activityHotelList.length > 0 ? (<Field
                                                    name="hotelId"
                                                    type="text"
                                                    label="Hotel Pickup Location *"
                                                    component={SelectField}
                                                    validate={this.dynamicValidation.selectOption}
                                                >
                                                    <option value="null">Choose your Hotel pickup location</option>
                                                    {
                                                        _map(activityHotelList, hotel => (
                                                            <option value={hotel.id}>{hotel.name}</option>
                                                        ))
                                                    }
                                                </Field>) : (<Field
                                                    name="hotelIdTxt"
                                                    type="text"
                                                    label="Enter your Hotel pickup location *"
                                                    component={InputField}
                                                    placeholder="Enter your Hotel pickup location"
                                                    validate={this.dynamicValidation.selectHotelTxt}

                                                />)}
                                            </div>
                                        </div>
                                    }
                                </div>
                            }

                            {selectedActivityPrice && selectedActivityPrice.langServices && <div className="row">
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
                                            <option value="null">Choose Language</option>
                                            {
                                                _map(selectedActivityPrice.langServices, (value, key) => (
                                                    <option value={key}>{value}</option>
                                                ))
                                            }
                                        </Field>
                                    </div>
                                </div>
                            </div>}
                            <div className="row">
                                <div className="col-xl-5 col-lg-5 col-md-5">
                                    <div className="form-group">
                                        <Field
                                            name="specialRequest"
                                            type="text"
                                            label="Any special requirement"
                                            component={InputField}
                                            placeholder="e.g. dietary need, accessibility"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-5 col-lg-5 col-md-5">

                                    <div style={{paddingTop: "10px"}}>
                                        <input
                                            type="checkbox"
                                            checked={this.state.checkBoxChecked}

                                            onChange={this.handleCheckClick}
                                        />
                                        <span onClick={() => {
                                            window.open("/termsandconditions")
                                        }} style={{
                                            fontWeight: "200",
                                            fontSize: "15px",
                                            cursor: "pointer",
                                            paddingLeft: "5px"
                                        }}>Accept Terms And Conditions</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 mt-3 mb-1 text-right">
                                    {/* <button type="button" className="searchBtn">
                      Add to itinerray
                  </button> */}

                                    <button className="searchBtn completebtn"
                                            disabled={this.state.checkBoxChecked == false ? true : false}>
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
                        style={{display: "block"}}
                    >
                        <div className="modal-dialog signInPopup">
                            <div className="modal-content">
                                <div className="modal-body paymentError">
                                    <div className="socialBtnGroup"/>
                                    <span className="erroricon">
                    <i class="fas fa-exclamation-triangle"/>
                  </span>
                                    <h4>
                                        {paymentDetails && paymentDetails.hasOwnProperty("message")
                                            ? paymentDetails.message
                                            : "Loading...."}
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

const fieldValidation = formProps => {
    const errors = {};
    const firstNames = [];
    const lastNames = [];

    _forEach(Object.keys(formProps), key => {
        if (key.includes('firstName')) {
            firstNames.push(key);
        }

        if (key.includes('lastName')) {
            lastNames.push(key);
        }
    });
    if (
        formProps.selectedCard == "" ||
        formProps.selectedCard == null ||
        formProps.selectedCard == undefined
      ) {
    if (!formProps.cardNumber) {
        errors.cardNumber = "Required";
    } else if (/\D/.test(formProps.cardNumber)) {
        errors.cardNumber = "numbers only allowed";
    }
    if (!formProps.cardName) {
        errors.cardName = "Required";
    }
    }
    if (!formProps.cvv) {
        errors.cvv = "Required";
    } else if (!/^[0-9]{3,4}$/.test(formProps.cvv)) {
        errors.cvv = "cvv should contain atleast 3 digit";
    }
    if (
        formProps.selectedCard == "" ||
        formProps.selectedCard == null ||
        formProps.selectedCard == undefined
      ) {
    if (!formProps.month) {
        errors.month = "Required";
    }
    if (formProps.year != "" && !/^[0-9]+$/.test(formProps.year)) {
        errors.year = "Please Enter Numeric Values Only";
    } else if (!/^[0-9]{4}$/i.test(formProps.year)) {
        errors.year = "year should contain 4 digit";
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
        errors.zipcode = "zipcode allowed only number";
    }

    _forEach(firstNames, firstName => {
        if (!formProps[firstName]) {
            errors[firstName] = "First name is Required";
        } else if (formProps[firstName].includes(".")) {
            errors[firstName] = "Please enter valid first name";
        }

        if (formProps[firstName] && (formProps[firstName].length < 1 || formProps[firstName].length > 15)) {
            errors[firstName] = "First name should contain 1 to 15 characters";
        }
    });

    _forEach(lastNames, lastName => {
        if (!formProps[lastName]) {
            errors[lastName] = "Last name is required";
        } else if (formProps[lastName].includes(".")) {
            errors[lastName] = "Please enter valid last name";
        }

        if (formProps[lastName] && (formProps[lastName].length < 2 || formProps[lastName].length > 35)) {
            errors[lastName] = "Last name should contain 2 to 35 characters";
        }

    });

    if (!formProps.email) {
        errors.email = "Required";
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formProps.email)
    ) {
        errors.email = "Invalid Email Address";
    }

    // if (!formProps.nationality) {
    //   errors.nationality = "Required";
    // }
    if (!formProps.code) {
        errors.code = "Required";
    }
    if (!formProps.phoneNumber) {
        errors.phoneNumber = "Required";
    }

    return errors;
};

const mapStateToProps = state => ({
    sessionId: state.carReducer.sessionId,
    loginDetails: state.loginReducer.loginDetails,
    selectedCurrency: state.commonReducer.selectedCurrency,
    loginStatus: state.loginReducer.loginStatus,
    profileData: state.dashboardReducer.profileData,
    currencySym: state.commonReducer.currencySym,
    isTravelAgent: state.dashboardReducer.isTravelAgent,
    isProfileEmpty: state.dashboardReducer.isProfileEmpty
});

const mapDispatchToProps = dispatch => ({
    getCard: email => dispatch(getCard(email)),
    signupReset: () => dispatch(signupReset()),

    activityGetPayload: payload => dispatch(activityGetPayload(payload)),
    bookingSignUpInfo: (guestFlag, payload, payloadInfo) =>
        dispatch(bookingSignUpInfo(guestFlag, payload, payloadInfo)),
    getProfile: value => dispatch(getProfile(value)),
    activityBook: payload => dispatch(activityBook(payload)),
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(
        reduxForm({
            form: "paymentCar",
            validate: fieldValidation
        })(ActivityPayment)
    )
);

ActivityPayment.propTypes = {
    isdivHide: propTypes.bool
};
ActivityPayment.defaultProps = {
    loginDetails: {}
};
