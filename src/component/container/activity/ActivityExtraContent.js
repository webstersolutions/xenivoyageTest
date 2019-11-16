import React, {Component} from "react";
import {withRouter} from "react-router-dom";

import {connect} from "react-redux";
import {
    getActivityInfo,
    getActivityPrice,
    getActivityCalendar,
    getActivityHotels
} from "../../../service/activities/action";
import queryString from "query-string";

import "./style.scss";
import {
    map as _map,
    forEach as _forEach,
    sum as _sum,
    get as _get,
    includes as _includes,
    find as _find,
    uniqBy as _uniqBy,
    isEmpty as _isEmpty,
    clone as _clone,
    remove as _remove
} from "lodash";
import {Carousel} from "react-responsive-carousel";
import img_Calendar from "../../../asset/images/Calendar.svg";
import img_avatar from "../../../asset/images/avatar.jpg";
import DatePicker from "react-datepicker";
import moment from "moment";
import ActivityRating from "./ActivityRating";
import ActivityFinalCard from "./ActivityFinalCard";
import ItineraryInfo from "./ItineraryInfo";
import clock_SVG from "../../../asset/images/Time.svg";

import img_unAvaliable from "../../../asset/images/No_Image.jpg";

const currencies = require("country-data").currencies;

class ActivityExtraContent extends Component {
    state = {
        isOverview: false,
        isInclusion: true,
        isDepartAndReturn: false,
        isItinerary: false,
        isHotelPickup: false,
        isAdditionalInfo: false,
        isCancellationPolicy: false,
        isActivityCalendar: false,
        activityDate: moment(sessionStorage.getItem("GEO_ZONE")).format(
            "YYYY-MM-DD"
        ),
        isActivityTraveller: false,
        traveller: {},
        travellerSummary: "",
        minActivityDateValue: new Date(),
        includeDates: [],
        activityDateValue: new Date(),
        selectedPackage: null,
        selecedTime: null,
        activityHotelList: null,
        travellerQuestions: [],
        questions: [],
        isProd: false

    };

    componentDidMount() {
        const {code, date} = queryString.parse(this.props.location.search);
        let payload = {
            productCode: code,
            currencyCode: this.props.selectedCurrency,
            month: moment(date, "MM/DD/YYYY").format("MM"),
            year: moment(date, "MM/DD/YYYY").format("YYYY"),
            email: _get(this.props, 'loginDetails.email', null),
        };

        this.props.getActivityInfo(code + `&currencyCode=${this.props.selectedCurrency}&email=${_get(this.props, 'loginDetails.email', null)}`,
            this.props.getActivityCalendar, payload);
        this.setState({
            activityDate: moment(date, "MM/DD/YYYY").format("YYYY-MM-DD"),
            activityDateValue: new Date(date)
        });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (
            nextProps.selectedActivity &&
            this.props.selectedActivity !== nextProps.selectedActivity
        ) {
            const {code, hotelPickup} = nextProps.selectedActivity;
            if(hotelPickup){
                this.props.getActivityHotels(code)
            }
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
            });

            let traveller = {};
            let childBandId = 0;
            let adultBandId = 0;
            let travellerSummary = "";

            _forEach(
                nextProps.selectedActivity.ageBands,
                ({bandId, ageTo, ageFrom, description, adult}, i) => {
                    const count = adult
                        ? Math.min(2, nextProps.selectedActivity.maxTravellerCount)
                        : 0;
                    traveller[description] = {
                        ageFrom,
                        ageTo,
                        bandId,
                        count,
                        limit: adult
                            ? {
                                Minimum: count,
                                Maximum: nextProps.selectedActivity.maxTravellerCount
                            }
                            : {
                                Maximum: nextProps.selectedActivity.maxTravellerCount - count
                            },
                        disableInc: count === nextProps.selectedActivity.maxTravellerCount,
                        disableDec: true
                    };

                    travellerSummary =
                        travellerSummary +
                        (i === 0 ? "" : ", ") +
                        `${count} ${description}`;
                }
                
            );

            this.setState({
                childBandId,
                adultBandId,
                traveller,
                travellerSummary
            });
            // this.props.getActivityHotels(code)
        }

        if(this.props.activityHotelList !== nextProps.activityHotelList){
            this.setState({
                activityHotelList: nextProps.activityHotelList
            })
        }

        if (nextProps.availableDate && nextProps.availableDate.length > 0 && nextProps.availableDate !== this.props.availableDate) {
            const {code, date} = queryString.parse(this.props.location.search);
            let activityDate = moment(date).format('YYYY-MM-DD')

            // _forEach(nextProps.availableDate, aDate => {
            //     if (aDate.bookingDate === date) {
            //         activityDate = date;
            //     }
            //     else{
            //         activityDate = date
            //     }
            

            // });

            this.setState({
                includeDates: _map(nextProps.availableDate, date =>
                    moment(date.bookingDate, "YYYY-MM-DD").format("YYYY-MM-DD")
                ),
                activityDate: activityDate,
                activityDateValue: new Date(activityDate)
            });

            if (_isEmpty(nextProps.selectedActivityFinalPrice)) {
                const currency = JSON.parse(localStorage.getItem("currency")).ABR_NAME;

                const payload = {
                    productCode: code,
                    currencyCode: this.props.selectedCurrency,
                    bookingDate: activityDate,
                    ageBands: _map(this.state.traveller, ({count, bandId}) => ({
                        bandId,
                        count
                    })),
                    email: _get(this.props, 'loginDetails.email', null),
                };

                let queryStringlocal = queryString.parse(this.props.location.search);
                this.props.history.push('/activity/extra?' + queryString.stringify({
                    ...queryStringlocal,
                    date: moment(payload.bookingDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
                }));

                this.props.getActivityPrice(payload);
            }
        }
    }

    checkHandleOnReserve = (e) => {
        this.setState({selecedTime: e})
    };

    handleOnReserve = () => {
        sessionStorage.setItem("activityConfirmURL", "");
        const queryStringlocal = queryString.parse(this.props.location.search);
        const ageBands = _map(this.state.traveller, ({count, bandId}) => ({
            bandId,
            count
        }));
        this.props.history.push('/activity/confirm?' + queryString.stringify({
            ...queryStringlocal,
            gradeCode: this.state.selectedPackage,
            ageBands: JSON.stringify(ageBands),
        }));
    };

    handleChangeTravellerCount = (adjust, travellerType) => {
        let {traveller} = this.state;
        const {selectedActivity} = this.props;

        traveller[travellerType].count += adjust;

        const travellerCount = _sum(_map(traveller, t => t.count));
        const isMaxLimitReached =
            travellerCount === selectedActivity.maxTravellerCount;
        let travellerSummary = "";
        let i = 0;

        _forEach(traveller, ({limit, count}, type) => {
            const minimum = _get(limit, "Minimum", 0);
            traveller[type].disableInc = isMaxLimitReached;
            traveller[type].disableDec = count === minimum;
            travellerSummary =
                travellerSummary + (i === 0 ? "" : ", ") + `${count} ${type}`;
            i++;
        });

        this.setState({
            traveller,
            travellerSummary
        });
    };

    handleGetFinalPrice = () => {
        const queryStringlocal = queryString.parse(this.props.location.search);
        const currency = JSON.parse(localStorage.getItem("currency")).ABR_NAME;
        const {traveller} = this.state;

        const payload = {
            productCode: queryStringlocal.code,
            currencyCode: this.props.selectedCurrency,
            bookingDate: this.state.activityDate,
            ageBands: _map(traveller, ({count, bandId}) => ({
                bandId,
                count
            })),
            email: _get(this.props, 'loginDetails.email', null),
        };

        this.props.history.push('/activity/extra?' + queryString.stringify({
            ...queryStringlocal,
            date: moment(payload.bookingDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
        }));

        this.props.getActivityPrice(payload);
    };

    handleSelectPackage = (packageId, isProd) => {
        this.setState({
            selectedPackage: packageId,
            isProd
        });
    };

    render() {
        const {
            connectDragSource,
            selectedActivity,
            selectedActivityFinalPrice,
            selectedCurrency,
        } = this.props;
        const {
            isOverview,
            isInclusion,
            isDepartAndReturn,
            isItinerary,
            isHotelPickup,
            isAdditionalInfo,
            isCancellationPolicy,
            isActivityTraveller,
            traveller,
            travellerSummary,
            activityHotelList,
            travellerQuestions,
            questions
        } = this.state;

        console.log("selectedActivity", selectedActivity)

        let uniqActivity = _uniqBy(selectedActivityFinalPrice, 'gradeDescription');

        for (let y = 0; y < uniqActivity.length; y++) {
            let arr = [];
            for (let i = 0; i < selectedActivityFinalPrice.length; i++) {
                if (uniqActivity[y].gradeDescription == selectedActivityFinalPrice[i].gradeDescription) {
                    let temparr = selectedActivityFinalPrice[i].gradeDepartureTime;
                    if (temparr) {
                        arr.push({label: temparr, value: selectedActivityFinalPrice[i].gradeCode})
                    }
                }
            }

            if (arr.length > 1 && selectedActivity) {
                uniqActivity[y].departure_arr = arr;
                uniqActivity[y].gradeTitle = selectedActivity.shortTitle;
            }
        }

        let languageService = null;

        if (selectedActivity && selectedActivity.tourGradesAvailable) {
            let count = 0;
            _forEach(selectedActivity.tourGrades[0].langServices, lang => {
                if (count === 0) {
                    languageService = `Offered in ${lang.split('-')[0]}`;
                }
                count++;
            });

            if (count > 1) {
                languageService += ` and ${count} more`
            }
        };

        return (
            selectedActivity && (
                <div>
                    <div
                        className="mb-2"
                        style={{padding: "10px", backgroundColor: "#FFF"}}
                    >
                        <div className="mb-3 title">{selectedActivity.shortTitle}</div>
                        <div className="mb-3 d-flex activityInfo">
                            <ActivityRating
                                rating={selectedActivity.rating}
                                style={{borderBottom: "none"}}
                            />
                            <div className="ml-3">{selectedActivity.reviewCount} Reviews</div>
                            <div className="ml-3" style={{borderLeft: "1px solid #000"}}/>
                            <div className="ml-3"> <i className="fa fa-map-marker"/> {selectedActivity.location}</div>
                        </div>
                        <div className="activitySearchWrapper">
                            <div>
                                <Carousel
                                    swipeScrollTolerance={5}
                                    swipeable={true}
                                    showIndicators={false}
                                    verticalSwipe="standard"
                                    dynamicHeight={false}
                                    emulateTouch={true}
                                    showThumbs={false}
                                >
                                    {selectedActivity.productPhotos && selectedActivity.productPhotos[0].photoURL ?
                                    _map(selectedActivity.productPhotos, (image, index) => {
                                        return (
                                            <div>
                                                <img src={image.photoURL}/>
                                            </div>
                                        );
                                    }) : <div>
                                    <img src={img_unAvaliable}/>
                                </div>}
                                </Carousel>
                            </div>
                            <div className="activitySearch">
                                <div className="activitySearchHeader">
                                    from {`${currencies[selectedActivity.currencyCode].symbol}${selectedActivity.price}`}
                                </div>
                                <div className="activitySearchSubHeader">
                                    Lowest price guarantee
                                </div>
                                <hr/>
                                <div className="activitySearchHeaderInfo">
                                    Select Date and Travelers
                                </div>
                                <DatePicker 
                                    popperClassName="activityCalendar"
                                    selected={this.state.activityDateValue}
                                    onMonthChange={month => {
                                        const {code, date} = queryString.parse(
                                            this.props.location.search
                                        );
                                        const payload = {
                                            productCode: code,
                                            currencyCode: selectedCurrency,
                                            month: moment(month).format("MM"),
                                            year: moment(month).format("YYYY"),
                                            email: _get(this.props, 'loginDetails.email', null),
                                        };

                                        this.props.getActivityCalendar(payload);
                                    }}
                                    onChange={activityDateValue => {
                                        this.setState({
                                            activityDate: moment(activityDateValue).format(
                                                "YYYY-MM-DD"
                                            ),
                                            activityDateValue,
                                            isActivityCalendar: false
                                        });
                                    }}
                                    // includeDates={this.state.includeDates}
                                    filterDate={date =>
                                        _includes(
                                            this.state.includeDates,
                                            moment(date).format("YYYY-MM-DD")
                                        )
                                    }
                                    minDate={this.state.minActivityDateValue}
                                    renderDayContents={(day, date) => {
                                        const activityDetail = _find(
                                            this.props.availableDate,
                                            d => moment(date).format("YYYY-MM-DD") === d.bookingDate
                                        );

                                        if (activityDetail) {
                                            return (
                                                <div className="calenderDay">
                                                    <div>{day}</div>
                                                    <div>{`${currencies[selectedActivity.currencyCode].symbol}${activityDetail.retailPrice}`}</div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="calenderDay" >
                                                <div>{day}</div>
                                                <div>NA</div>
                                            </div>
                                        );
                                    }}
                                    customInput={
                                        <div>
                                            <img
                                                style={{
                                                    position: "absolute",
                                                    width: "21px",
                                                    marginLeft: "7px",
                                                    marginTop: "8px",
                                                    zIndex: 1
                                                }}
                                                src={img_Calendar}
                                            />

                                            <input
                                                type="text"
                                                style={{
                                                    background: "#fff",
                                                    border: "1px solid #6a6a6a",
                                                    marginRight: "0.5rem",
                                                    marginBottom: "0.5rem",
                                                    padding: "10px",
                                                    paddingLeft: "50px",
                                                    paddingRight:"21px",
                                                    position: "relative",
                                                    width: "100%"
                                                }}
                                                placeholder="Fri,Oct 26"
                                                value={moment(this.state.activityDate).format(
                                                    "dddd, MMM DD, YYYY "
                                                )}
                                                onClick={() =>
                                                    this.setState({
                                                        isActivityCalendar: !this.state.isActivityCalendar
                                                    })
                                                }
                                            />
                                        </div>
                                    }
                                />
                                <div className="d-flex flex-row smallColumn activityOption">
                                    <div style={{width: "100%"}} className="flex-column">
                                        <div
                                            id="activityDate"
                                            className="seleDate align-self-start"
                                            style={{backgroundColor: "#fff", width: "100%"}}
                                        >
                                            <img src={img_avatar}/>

                                            <input
                                                type="text"
                                                className="dateInput"
                                                placeholder="Fri,Oct 26"
                                                value={travellerSummary}
                                                onClick={() =>
                                                    this.setState({
                                                        isActivityTraveller: !this.state.isActivityTraveller
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {isActivityTraveller && (
                                        <div
                                            style={{position: "absolute"}}
                                            onMouseLeave={() => {
                                                this.setState({
                                                    isActivityTraveller: false
                                                });
                                            }}
                                        >
                                            <div
                                                style={{
                                                    border: "#A9A9A9 solid 1px",
                                                    borderRadius: "2px",
                                                    height: "auto",
                                                    backgroundColor: "#fff",
                                                    width: "100%",
                                                    fontSize: "13px",
                                                    padding: "10px"
                                                }}
                                            >
                                                <div style={{fontSize:"13px"}}>
                                              <b>      You can select up to{" "}
                                                    {selectedActivity.maxTravellerCount} travellers in
                                                    total :</b>
                                                </div>
                                                {_map(
                                                    traveller,
                                                    (
                                                        {
                                                            ageFrom,
                                                            ageTo,
                                                            count,
                                                            limit,
                                                            disableInc,
                                                            disableDec
                                                        },
                                                        type
                                                    ) => (
                                                        <div>
                                                            <div className="d-flex mt-2">
                                                                <div>
                                                                   <b> {type}</b> (age {ageFrom}-{ageTo})
                                                                </div>
                                                                <div
                                                                    className="d-flex"
                                                                    style={{position: "absolute", right: "8%"}}
                                                                >
                                                                    <button
                                                                        className="mr-2"
                                                                        style={{
                                                                            borderRadius: "50%",
                                                                            border: "1px solid #A9A9A9",
                                                                            width: "20px",
                                                                            height: "20px",
                                                                            textAlign: "center"
                                                                        }}
                                                                        disabled={disableDec}
                                                                        onClick={() =>
                                                                            this.handleChangeTravellerCount(-1, type)
                                                                        }
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <div className="mr-2">{count}</div>
                                                                    <button
                                                                        style={{
                                                                            borderRadius: "50%",
                                                                            border: "1px solid #A9A9A9",
                                                                            width: "20px",
                                                                            height: "20px",
                                                                            textAlign: "center"
                                                                        }}
                                                                        disabled={disableInc}
                                                                        onClick={() =>
                                                                            this.handleChangeTravellerCount(1, type)
                                                                        }
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {_map(
                                                                    limit,
                                                                    (value, key) => `${key}: ${value} `
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex flex-row smallColumn activityOption">
                                    <button
                                        className="searchBtn"
                                        style={{width: "100%"}}
                                        onClick={this.handleGetFinalPrice}
                                    >
                                        Update Search
                                    </button>
                                </div>
                                <div className="flex-row smallColumn activityOption cancellationShortInfo">
                                    <div className="flex-column">
                                        <div className="info">Free Cancellation</div>
                                        <div className="timeline">up to 24 hours in advance</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3 d-flex activityInfo activity-options">
                        <div className="ml-3 marginDatehours">
                            <img style={{paddingBottom: "2px", width: "20px"}} className="ml-3 mr-1 marginDatehours" src={clock_SVG}/>
                            -{" "}{selectedActivity.duration}
                        </div>
                        {languageService && <div className="ml-3 marginDatehours" style={{borderLeft: "1px solid #000"}}>
                            <i className="fa fa-comments ml-3 marginDatehours"/>{languageService}
                        </div>}

                        {selectedActivity.hotelPickup && <div className="ml-3 marginDatehours" style={{borderLeft: "1px solid #000"}}>
                            <i className="fa fa-car ml-3 marginDatehours"/> Hotel Pick Offered
                        </div> }

                        {selectedActivity.voucherOption && <div className="ml-3 marginDatehours" style={{borderLeft: "1px solid #000"}}>
                            <i className="fa fa-gift ml-3 marginDatehours"/> Mobile Ticket
                        </div>}
                    </div>
                    <div className="d-flex flex-wrap justify-content-between webResp">
                        <div
                            className={`flex-column tabInfoActivity ${
                                isOverview ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isOverview: true,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isItinerary: false,
                                    isHotelPickup: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Overview
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isInclusion ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isOverview: false,
                                    isInclusion: true,
                                    isDepartAndReturn: false,
                                    isItinerary: false,
                                    isHotelPickup: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Inclusions & Exclusions
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isDepartAndReturn ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isOverview: false,
                                    isInclusion: false,
                                    isDepartAndReturn: true,
                                    isItinerary: false,
                                    isHotelPickup: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Depart & Return
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isItinerary ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isOverview: false,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isItinerary: true,
                                    isHotelPickup: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Itinerary
                        </div>
                        {
                            selectedActivity.hotelPickup && <div
                                className={`flex-column tabInfoActivity ${
                                    isHotelPickup ? "activeTab" : ""
                                    }`}
                                style={{cursor: "pointer"}}
                                onClick={() =>
                                    this.setState({
                                        isOverview: false,
                                        isInclusion: false,
                                        isDepartAndReturn: false,
                                        isHotelPickup: true,
                                        isItinerary: false,
                                        isAdditionalInfo: false,
                                        isCancellationPolicy: false
                                    })
                                }
                            >
                                Hotel Pickup
                            </div>
                        }
                        <div
                            className={`flex-column tabInfoActivity ${
                                isAdditionalInfo ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isOverview: false,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isHotelPickup: false,
                                    isItinerary: false,
                                    isAdditionalInfo: true,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Additional Info
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isCancellationPolicy ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isOverview: false,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isHotelPickup: false,
                                    isItinerary: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: true
                                })
                            }
                        >
                            Cancellation Policy
                        </div>
                    </div>
                    <ItineraryInfo
                        itinerary={selectedActivity}
                        isOverview={isOverview}
                        isInclusion={isInclusion}
                        isDepartAndReturn={isDepartAndReturn}
                        isHotelPickup={isHotelPickup}
                        isItinerary={isItinerary}
                        isCancellationPolicy={isCancellationPolicy}
                        isActivityTraveller={isActivityTraveller}
                        isAdditionalInfo={isAdditionalInfo}
                        
                    />
                    <div className="d-flex flex-wrap justify-content-between mobileResp">
                        <div
                            className={`flex-column tabInfoActivity ${
                                isOverview ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isInclusion: true,
                                    isDepartAndReturn: false,
                                    isHotelPickup: false,
                                    isItinerary: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Overview
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isInclusion ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isInclusion: true,
                                    isDepartAndReturn: false,
                                    isHotelPickup: false,
                                    isItinerary: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Inclusions & Exclusions
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isDepartAndReturn ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isInclusion: false,
                                    isDepartAndReturn: true,
                                    isHotelPickup: false,
                                    isItinerary: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Depart & Return
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isItinerary ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isHotelPickup: false,
                                    isItinerary: true,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Itinerary
                        </div>
                        {
                            selectedActivity.hotelPickup && <div
                                className={`flex-column tabInfoActivity ${
                                    isHotelPickup ? "activeTab" : ""
                                    }`}
                                style={{cursor: "pointer"}}
                                onClick={() =>
                                    this.setState({
                                        isOverview: false,
                                        isInclusion: false,
                                        isDepartAndReturn: false,
                                        isHotelPickup: true,
                                        isItinerary: false,
                                        isAdditionalInfo: false,
                                        isCancellationPolicy: false
                                    })
                                }
                            >
                                Hotel Pickup
                            </div>
                        }
                        <div
                            className={`flex-column tabInfoActivity ${
                                isAdditionalInfo ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isOverview: false,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isHotelPickup: false,
                                    isItinerary: false,
                                    isAdditionalInfo: true,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Additional Info
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isCancellationPolicy ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isHotelPickup: false,
                                    isItinerary: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: true
                                })
                            }
                        >
                            Cancellation Policy
                        </div>
                    </div>
                    {uniqActivity.length > 0 && (
                        <div className="selectRoomBg d-flex flex-wrap">
                            <div className="selectRoomTitle">
                                <h4>Select your itinerary</h4>
                            </div>
                            <div className="selectRoomItemsBg  bottom-btn-pad">
                                <div className="flex-row smallTabColumn mb-5">
                                    <button
                                        type="button"
                                        style={{float: "right", cursor: (this.state.isProd ? "pointer" : "not-allowed")}}
                                        onClick={this.handleOnReserve}
                                        disabled={!this.state.isProd}
                                        className="selectRoomBtn reserveBtn"
                                    >
                                        BOOK NOW
                                    </button>
                                </div>
                                {_map(uniqActivity, (activity,i) => (
                                    <ActivityFinalCard
                                        activityDetails={activity}
                                        images={selectedActivity.productPhotos}
                                        selectedPackage={this.state.selectedPackage}
                                        onSelect={this.handleSelectPackage}
                                        totalTravellers={this.state.traveller}
                                        selectTime={this.state.selectTime}
                                        selectbtn={this.checkHandleOnReserve}
                                        mostPopular={i === 0 && uniqActivity.length > 1}
                                        location={queryString.parse(this.props.location.search)}
                                        selectedActivityInfo={selectedActivity}
                                        activityHotelList={activityHotelList}
                                        questions={questions}
                                        travellerQuestions={travellerQuestions}
                                    />
                                ))}
                                <button
                                    type="button"
                                    style={{cursor: (this.state.isProd ? "pointer" : "not-allowed")}}
                                    onClick={this.handleOnReserve}
                                    disabled={!this.state.isProd}
                                    className="selectRoomBtn bottom-book-btn"
                                >
                                    BOOK NOW
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )
        );
    }
}

const mapStateToProps = state => ({
    selectedActivity: state.activityReducer.selectedActivity,
    availableDate: state.activityReducer.availableDate,
    selectedActivityFinalPrice: state.activityReducer.selectedActivityFinalPrice,
    selectedCurrency: state.commonReducer.selectedCurrency,
    loginDetails: state.loginReducer.loginDetails,
    activityHotelList: state.activityReducer.activityHotelList
});

const mapDispatchToProps = dispatch => ({
    getActivityInfo: (payloadInfo, clb, clbPayload) =>
        dispatch(getActivityInfo(payloadInfo, clb, clbPayload)),
    getActivityPrice: payloadInfo => dispatch(getActivityPrice(payloadInfo)),
    getActivityCalendar: payloadInfo => dispatch(getActivityCalendar(payloadInfo)),
    getActivityHotels: payloadInfo => dispatch(getActivityHotels(payloadInfo))
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ActivityExtraContent)
);
