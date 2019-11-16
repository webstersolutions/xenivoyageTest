import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import queryString from "query-string";
import DateRangePicker from "react-daterange-picker";
import originalMoment from "moment";
import {extendMoment} from "moment-range";
import "react-daterange-picker/dist/css/react-calendar.css";
import {map as _map, get as _get} from "lodash";

import LocationSearch from "./LocationSearch";

import {searchHotel, getCurrencyCode} from "../../../service/hotel/action";
import {activityLocationSearch} from "../../../service/activities/action";
import {activitySearch} from "../../../service/activities/action";
import {packageSearch} from "../../../service/package/action";
import {packageLocationSearch} from "../../../service/package/action";
import img_Calendar from "../../../asset/images/Calendar.svg";
import img_SearchIcon from "../../../asset/images/Search Icon.png";
import img_progress from "../../../asset/images/under-construction.png";
import img_hotal from "../../../asset/images/hotel-building.png";
import img_car from "../../../asset/images/car.png";
import img_transfer from "../../../asset/images/chauffeur.png";
import img_chauffeur from "../../../asset/images/chauffeur.png";
import img_activities from "../../../asset/images/activities.png";
import img_packages from "../../../asset/images/package.png";
import img_clock from "../../../asset/images/car/wall-clock.png";
import img_age from "../../../asset/images/car/ageIcon.png";
import "react-day-picker/lib/style.css";
import img_country from "../../../asset/images/New folder/world.png";

import countryList from "react-select-country-list";
import Select from "react-select";
import momentTimezone from "moment-timezone";

const moment = extendMoment(originalMoment);
const today = moment();
const style = {
    margin: "20px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "10%"
};

const staticBounds = {
    bounds: {
        rectangle: {
            bottomRight: {
                lat: 50.178005,
                long: 3.921267
            },
            topLeft: {
                lat: 50.64359,
                long: 2.635867
            }
        }
    }
};

const stateDefinitions = {
    available: {
        color: null,
        label: "Available"
    },
    unavailable: {
        selectable: false,
        color: "",
        label: "Unavailable"
    }
};
const dateRanges = [
    {
        state: "unavailable",
        range: moment.range(today.clone().subtract(1, "days"), today.clone())
    }
];
let hotelStart,
    hotelEnd,
    carStart,
    carEnd,
    pickUpDateValue,
    carDropDateValue,
    taxiPickUpDate,
    taxipickUpDateValue,
    activityDte,
    activityDateValue,
    minActivityDateValue;
if (sessionStorage.getItem("GEO_ZONE")) {
    hotelStart = moment(sessionStorage.getItem("GEO_ZONE")).format("MM/DD/YYYY");
    hotelEnd = moment(sessionStorage.getItem("GEO_ZONE"))
        .add(1, "days")
        .format("MM/DD/YYYY");
    carStart = moment(sessionStorage.getItem("GEO_ZONE")).format("MM/DD/YYYY");
    carEnd = moment(sessionStorage.getItem("GEO_ZONE"))
        .add(2, "days")
        .format("MM/DD/YYYY");
    pickUpDateValue = moment(sessionStorage.getItem("GEO_ZONE"));
    activityDte = moment(sessionStorage.getItem("GEO_ZONE")).format("MM/DD/YYYY");
    activityDateValue = moment(sessionStorage.getItem("GEO_ZONE"));
    carDropDateValue = moment(sessionStorage.getItem("GEO_ZONE")).add(2, "days");
    taxiPickUpDate = moment(sessionStorage.getItem("GEO_ZONE"))
        .add(1, "days")
        .format("MM/DD/YYYY");
    taxipickUpDateValue = moment(sessionStorage.getItem("GEO_ZONE")).add(
        1,
        "days"
    );
    minActivityDateValue = moment(sessionStorage.getItem("GEO_ZONE")).add(
        1,
        "days"
    );

} else {
    hotelStart = moment().format("MM/DD/YYYY");
    hotelEnd = moment()
        .add(1, "days")
        .format("MM/DD/YYYY");
    carStart = moment().format("MM/DD/YYYY");
    carEnd = moment()
        .add(2, "days")
        .format("MM/DD/YYYY");
    pickUpDateValue = moment();
    activityDte = moment().format("MM/DD/YYYY");
    activityDateValue = moment();
    carDropDateValue = moment().add(2, "days");
    taxiPickUpDate = moment()
        .add(1, "days")
        .format("MM/DD/YYYY");
    taxipickUpDateValue = moment().add(1, "days");
    minActivityDateValue = moment().add(1, "days");

}

// alert(pickUpDateValue)
class SearchTool extends React.Component {
    state = {
        searchPayload: null,
        activeTab: "hotels",
        // value: moment.range(
        //   today.clone().subtract(1, "days"),
        //   today.clone().add(1, "days")
        // ),
        value: moment.range(hotelStart, hotelEnd),
        // startDate: moment().format("MM/DD/YYYY"),
        // endDate: moment()
        //   .add(1, "days")
        //   .format("MM/DD/YYYY"),
        startDate: hotelStart,
        endDate: hotelEnd,
        isCalendar: false,
        adult: "1",
        child: "0",
        room: "1",
        childAgeValues: [],
        childCounts: Array.from({length: 10}),
        roomCounts: Array.from({length: 5}),
        adultCounts: Array.from({length: 15}),
        premise: "",

        // carPickUpDate: moment().format("MM/DD/YYYY"),
        // pickUpDateValue: moment(),
        // carDropDate: moment()
        //   .add(2, "days")
        //   .format("MM/DD/YYYY"),
        // carDropDateValue: moment().add(2, "days"),
        carPickUpDate: carStart,
        pickUpDateValue: pickUpDateValue,
        carDropDate: carEnd,
        carDropDateValue: carDropDateValue,
        carPickUpTime: "11:00",
        carDropTime: "08:00",
        pickUpLocation: "",
        dropOffLocation: "",
        driverAge: "18",
        errorCarValidation: "",
        passangerCateg: false,
        wayOfTravel: "",
        countAdd: 1,
        multiFlightAdd: [],
        addFlightField: false,

        // taxiPickUpDate: moment()
        //   .add(1, "days")
        //   .format("MM/DD/YYYY"),
        // taxipickUpDateValue: moment().add(1, "days"),
        taxiPickUpDate: taxiPickUpDate,
        taxipickUpDateValue: taxipickUpDateValue,
        taxiPickUpTime: "11:00",
        taxiPickUpLocation: "",
        activityLoc: "",
        taxiDropOffLocation: "",
        isTaxiPickUpDateCalendar: false,
        taxiPassengersCount: 2,
        taxiAnimalCount: 0,
        taxiLuggageCount: 1,
        taxiFlightNo: "No Flight",
        showFlight: false,
        taxiPickUpGeocode: {},
        taxiDropOffGeocode: {},

        activityDate: activityDte,
        activityDateValue: activityDateValue,
        minActivityDateValue: minActivityDateValue,
        isActivityCalendar: false,

        options: countryList().getData(),
        nationality: JSON.stringify({}),
        sameusPickShow: false,
        geoCode: null,
        showActivityLocation: false,
        showPackageLocation:false,
        activityLocSelected: false,
        packageLocSelected:false,

        packageLoc:"",
        packageLocId:""
    };

    _activitySearch = null;

    _packageSearch= null;

    static defaultProps = {
        skipTab: false
    };

    handleCarFormDataChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
    };

    getSearchInfo = (searchPayload, premise, locationType, geoCode) => {
        this.setState({searchPayload, premise, geoCode});
    };

    getSearchInfoPickUp = (pickUpLocation, premise, locationType, geoCode) => {
        this.setState({pickUpLocation});
    };

    getActivityLoc = activityLoc => {
        this.setState({activityLoc});
    };

    getPackageLoc = packageLoc => {
        this.setState({packageLoc});
    };

    getSearchInfoDropOff = (dropOffLocation, premise, locationType, geoCode) => {
        this.setState({dropOffLocation});
    };
    sameUsPickupChange = e => {
        if (e.target.checked) {
            this.setState({sameusPickShow: true});
        } else {
            this.setState({sameusPickShow: false, dropOffLocation: ""});
        }
    };

    getSearchTaxiInfoPickUp = (
        pickUpLocation,
        premise,
        locationType,
        geoCode,
        postalCode
    ) => {
        this.setState({
            taxiPickUpLocation:
            _get(pickUpLocation, "originSearch", "") + ", " + postalCode,
            showFlight: locationType.includes("airport"),
            taxiPickUpGeocode: geoCode
        });
    };

    getSearchTaxiInfoDropOff = (
        dropOffLocation,
        premise,
        locationType,
        geoCode,
        postalCode
    ) => {
        this.setState({
            taxiDropOffLocation:
            _get(dropOffLocation, "originSearch", "") + ", " + postalCode,
            taxiDropOffGeocode: geoCode
        });
    };

    componentWillMount = () => {
        if (window.location.search) {
            const values = queryString.parse(window.location.search);
            console.log(values, "search");

            if (window.location.search.includes("hotel")) {
                this.setState({
                    searchPayload: values.searchText,
                    startDate: values.checkin || values.startDate,
                    endDate: values.checkout || values.endDate,
                    adult: values.adult,
                    child: values.child,
                    childAgeValues: values.childAgeValues
                });
            } else if (window.location.search.includes("car")) {
                this.setState(
                    {
                        carPickUpDate: values.carPickUpDate,
                        carDropDate: values.carDropDate,
                        carPickUpTime: values.carPickUpTime,
                        carDropTime: values.carDropTime,
                        pickUpLocation: values.pickUpLocation,
                        dropOffLocation: values.dropOffLocation,
                        driverAge: values.driverAge
                    },
                    () => {
                        this.props.history.push("/car/search" + window.location.search);
                    }
                );
            } else if (window.location.search.includes("activity")) {
                this.setState({
                        activityLoc: values.searchText
                    },
                    () => {
                        this.props.history.push("/activity/search" + window.location.search);
                    }
                )
            } else if (window.location.search.includes("package")) {
                this.setState({
                        packageLoc: values.searchText
                    },
                    () => {
                        this.props.history.push("/package/search" + window.location.search);
                    }
                )
            }
        }
    };

    componentDidMount() {
        if (this.props.path === '/hotel' || this.props.path === '/') {
            this.props.getCurrencyCode();
        }

        let timeZone = momentTimezone.tz.guess();
        timeZone = momentTimezone.tz(timeZone).format();
        sessionStorage.setItem("GEO_ZONE", timeZone)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.activityLocations !== this.props.activityLocation) {
            this.setState({
                showActivityLocation: true,
                activityLocSelected: false,
            })
        }
        if (this.props.packageLocations !== this.props.packageLocation) {
            this.setState({
                showPackageLocation: true,
                packageLocSelected: false,
            })
        }
    }

    handlePackageSearch = () => {
        const {packageLoc, packageLocId,startDate, endDate} = this.state;
console.log("packageLocId",packageLocId);
        
       // const countryId=99;
        // let activSearchPayload = {
        //     packageDate: packageDate,
        //     destinationName: packageLoc
        // };

        // const {
        //     searchPayload,
           
        //     geoCode,
            
        // } = this.state;
        // console.log(searchPayload);
        // console.log(geoCode);
       // if (packageLocId && startDate && endDate) 
        {
            this.props.history.push(
                "/package/search?" +
                queryString.stringify({
                    fromDate: startDate,
                    toDate:endDate,
                    searchText: packageLocId,
                    offsetLimit: 0,
                    limit: 50
                })
            );
        } 
        // else {
        //     const validationIDs = ["packageDate", "packageLoc"];

        //     validationIDs.map((elememtId, index) => {
        //         if (!this.state[elememtId]) {
        //             document
        //                 .getElementById(elememtId)
        //                 .setAttribute("STYLE", "border-color:red");
        //         } else {
        //             document.getElementById(elememtId).removeAttribute("STYLE");
        //         }
        //     });

        //     setTimeout(() => {
        //         validationIDs.map((elememtId, index) => {
        //             try {
        //                 document.getElementById(elememtId).removeAttribute("STYLE");
        //             } catch (e) {
        //             }
        //         });
        //     }, 4000);
        // }
    };


    _tabs = [
        // { value: "flights", lable: "FLIGHTS", to: "/flight", refimg: img_flight },
        {value: "hotels", lable: "HOTELS", to: "/hotel", refimg: img_hotal},
        {value: "cars", lable: "CARS", to: "/car", refimg: img_car},
        {
            value: "transfer",
            lable: "TRANSFERS",
            to: "/transfer",
            refimg: img_transfer
        },
        {
            value: "activities",
            lable: "ACTIVITIES",
            to: "/activity",
            refimg: img_activities
        },
        // {
        //   value: "packages",
        //   lable: "EXPERIENCES",
        //   to: "/package",
        //   refimg: img_package
        // }
        {
            value: "package",
            lable: "PACKAGES",
            to: "/package",
            refimg: img_packages,
            // onClick: this.handlePackageSearch()
           
          }
    ];

    getToday = () => {

        console.log(":::::: ================ ",sessionStorage.getItem("GEO_ZONE"))
        if (sessionStorage.getItem("GEO_ZONE")) {
            return moment(sessionStorage.getItem("GEO_ZONE")).format("MM/DD/YYYY");
        } else {
            return moment().format("MM/DD/YYYY");
        }
    };

    minimumDate = () => {
        if (sessionStorage.getItem("GEO_ZONE")) {
            return new Date(moment(sessionStorage.getItem("GEO_ZONE")).format());
        } else {
            return new Date();
        }
    };

    changeHandlerNationality = e => {
        this.setState({nationality: e.target.value});
    };

    handleSearch = event => {
        // event.preventDefault();
        sessionStorage.setItem("searchURL", "");
        sessionStorage.setItem("roomURL", "");
        sessionStorage.setItem("reserveURL", "");

        this.setState({isCalendar: false});

        const {
            searchPayload,
            startDate,
            endDate,
            adult,
            child,
            childAgeValues,
            premise,
            geoCode,
            room,
            nationality
        } = this.state;

        const searchInfo = {
            ...searchPayload,
            date: {
                start: startDate,
                end: endDate
            }
        };
        const searchString = {
            checkin: startDate,
            checkout: endDate,
            // TODO: check what will happen if we are using originsearch
            searchText: searchPayload.originSearch,
            adult,
            child,
            childAgeValues,
            premise,
            room,
            geoCode: JSON.stringify(geoCode),
            nationality
        };
        let defPath;
        if (this.props.path == "/") {
            defPath = "/hotel";
        } else {
            defPath = this.props.path;
        }
        this.props.history.push(
            defPath + "/search?" + queryString.stringify(searchString)
        );
    };

    //TODO

    carHandleSearch = () => {
        sessionStorage.setItem("carSearchURL", "");
        sessionStorage.setItem("carExtraURL", "");
        sessionStorage.setItem("carConfirmURL", "");
        let {
            carPickUpDate,
            carDropDate,
            carPickUpTime,
            carDropTime,
            pickUpLocation,
            dropOffLocation,
            driverAge,
            nationality
        } = this.state;

        //  if( carPickUpDate &&  carDropDate &&  carPickUpTime && carDropTime &&  pickUpLocation  && driverAge &&  nationality){
        if (
            carPickUpDate &&
            carDropDate &&
            carPickUpTime &&
            carDropTime &&
            pickUpLocation
        ) {
            if (pickUpLocation && !dropOffLocation) {
                this.props.history.push(
                    "/car/search?" +
                    queryString.stringify({
                        carPickUpDate: moment(carPickUpDate).format("YYYY-MM-DD"),
                        carDropDate: moment(carDropDate).format("YYYY-MM-DD"),
                        carPickUpTime,
                        carDropTime,
                        pickUpLocation: pickUpLocation.searchString,
                        dropOffLocation: pickUpLocation.searchString
                        // driverAge,
                        // nationality: this.state.nationality.value
                    })
                );
            } else {
                this.props.history.push(
                    "/car/search?" +
                    queryString.stringify({
                        carPickUpDate: moment(carPickUpDate).format("YYYY-MM-DD"),
                        carDropDate: moment(carDropDate).format("YYYY-MM-DD"),
                        carPickUpTime,
                        carDropTime,
                        pickUpLocation: pickUpLocation.searchString,
                        dropOffLocation: dropOffLocation.searchString
                        // driverAge,
                        // nationality: this.state.nationality.value
                    })
                );
            }
        } else {
            const validationIDs = [
                "carPickUpDate",
                "carDropDate",
                "carPickUpTime",
                "carDropTime",
                "pickUpLocation"
                // "driverAge",
                // "nationality"
            ];

            validationIDs.map((elememtId, index) => {
                if (!this.state[elememtId]) {
                    document
                        .getElementById(elememtId)
                        .setAttribute("STYLE", "border-color:red");
                } else {
                    document.getElementById(elememtId).removeAttribute("STYLE");
                }
            });

            setTimeout(() => {
                validationIDs.map((elememtId, index) => {
                    try {
                        document.getElementById(elememtId).removeAttribute("STYLE");
                    } catch (e) {
                    }
                });
            }, 4000);
        }
        this.setState({
            ...this.state,
            // pickUpLocation: null
        });
    };

    handleFlightSearch = e => {
        this.props.history.push("/flight/search?" + queryString.stringify());
    };

    handleStartDate = e => {
        this.setState({
            isCalendar: true,
            startDate: e.target.value,
            endDate: e.target.value
        });
    };

    handleEndDate = e => {
        this.setState({
            isCalendar: true,
            endDate: e.target.value
        });
    };

    onSelect = (value, states) => {
        this.setState({
            value,
            startDate: moment(value.start._d).format("MM/DD/YYYY"),
            isCalendar: false,
            endDate: moment(value.end._d).format("MM/DD/YYYY")
        });
    };

    handleSelectChange = e => {
        this.setState({wayOfTravel: e.target.value});
    };

    addAnotherFlight = e => {
        if (this.state.multiFlightAdd.length < 6) {
            this.setState({countAdd: this.state.countAdd + 1});
            this.state.multiFlightAdd.push(this.state.countAdd);
        } else {
            this.setState({addFlightField: true});
        }
    };

    removeFlights = e => {
        const id = e.currentTarget.id;
        const items = this.state.multiFlightAdd
            .slice(0, id - 1)
            .concat(
                ...this.state.multiFlightAdd.slice(id, this.state.multiFlightAdd.length)
            );
        this.setState({multiFlightAdd: items, addFlightField: false});
    };

    handleActivitySearch = () => {
        const {activityLoc, activityDate} = this.state;
        let activSearchPayload = {
            activityDate: activityDate,
            destinationName: activityLoc
        };

        if (activityLoc && activityDate) {
            this.props.history.push(
                "/activity/search?" +
                queryString.stringify({
                    date: activityDate,
                    searchText: activityLoc,
                    offsetLimit: 0,
                    limit: 50
                })
            );
        } else {
            const validationIDs = ["activityDate", "activityLoc"];

            validationIDs.map((elememtId, index) => {
                if (!this.state[elememtId]) {
                    document
                        .getElementById(elememtId)
                        .setAttribute("STYLE", "border-color:red");
                } else {
                    document.getElementById(elememtId).removeAttribute("STYLE");
                }
            });

            setTimeout(() => {
                validationIDs.map((elememtId, index) => {
                    try {
                        document.getElementById(elememtId).removeAttribute("STYLE");
                    } catch (e) {
                    }
                });
            }, 4000);
        }
    };

    handleTaxiSearch = () => {
        const {
            taxiPickUpLocation,
            taxiDropOffLocation,
            taxiPickUpDate,
            taxiPickUpTime,
            taxiPassengersCount,
            taxiAnimalCount,
            taxiLuggageCount,
            taxiFlightNo
        } = this.state;
        if (
            taxiPickUpLocation &&
            taxiDropOffLocation &&
            taxiPickUpDate &&
            taxiPickUpTime
        ) {
            this.props.history.push(
                "/transfer/search?" +
                queryString.stringify({
                    searchString: taxiPickUpLocation,
                    start_point_instructions: "",
                    end_point: taxiDropOffLocation,
                    end_point_instructions: "",
                    start_time_date: moment(taxiPickUpDate).format("YYYY-MM-DD"),
                    start_time_time: taxiPickUpTime,
                    passengers: taxiPassengersCount,
                    sport_luggage: 0,
                    animals: taxiAnimalCount,
                    luggage: taxiLuggageCount,
                    startPointGeocode: JSON.stringify(this.state.taxiPickUpGeocode),
                    endPointGeocode: JSON.stringify(this.state.taxiDropOffGeocode),
                    flightNo: taxiFlightNo
                })
            );
        } else {
            const validationIDs = [
                "taxiPickUpLocation",
                "taxiDropOffLocation",
                "taxiPickUpDate",
                "taxiPickUpTime"
                // "driverAge",
                // "nationality"
            ];

            validationIDs.map((elememtId, index) => {
                if (!this.state[elememtId]) {
                    document
                        .getElementById(elememtId)
                        .setAttribute("STYLE", "border-color:red");
                } else {
                    document.getElementById(elememtId).removeAttribute("STYLE");
                }
            });

            setTimeout(() => {
                validationIDs.map((elememtId, index) => {
                    try {
                        document.getElementById(elememtId).removeAttribute("STYLE");
                    } catch (e) {
                    }
                });
            }, 4000);
        }
    };

    activitySearch = e => {
        clearTimeout(this._activitySearch);
        const value = e.target.value;

        this.setState({
            activityLoc: value,
        });

        this._activitySearch = setTimeout(() => {
            console.log("v",value);
            this.props.activityLocationSearch(value);
        }, 300)
    };

    packageSearch = e => {
        clearTimeout(this._packageSearch);
        const value = e.target.value;

        this.setState({
            packageLoc: value,
            packageLocId:""
        });
        

        this._packageSearch = setTimeout(() => {
            this.props.packageLocationSearch(value);
        }, 300)
    };

    onSelectActivityLocation = value => {
        if (value) {
            this.setState({
                showActivityLocation: false,
                activityLoc: value,
                activityLocSelected: true,
            })
        }
    };

    onSelectPackageLocation = (value, label) => {
        if (label && value) {
            this.setState({
                showPackageLocation: false,
                packageLoc: label,
                packageLocId:value,
                packageLocSelected: true,
            })
        }
    };

    render() {
        let tabHighLight;
        if (this.props.path === "/") {
            tabHighLight = "/hotel";
        } else {
            tabHighLight = this.props.path;
        }
        return (
            <div className="mb-3">
                {!this.props.skipTab && (
                    <ul className="tabs">
                        {this._tabs.map((each, i) => {
                            return (
                                <li
                                    key={i}
                                    style={{width: "288px"}}
                                    className={
                                        tabHighLight === each.to ? "tab-link current" : "tab-link"
                                    }
                                    onClick={() => this.props.history.push(each.to)}
                                    data-tab="tab-1"
                                >
                                    <span className="responNameHide">{each.lable}</span>
                                    {each.refimg && (
                                        <span className="responIconHide respIconSize">
                    {" "}
                                            <img src={each.refimg} width="20px" alt=""/>
                  </span>
                                    )}
                                </li>
                            )
                        })}
                        {/* <li className="tab-link">
            <i className="fas fa-chevron-right" />
          </li> */}
                    </ul>
                )}

                <div
                    id="tab-2"
                    className="tab-content current"
                    style={{minHeight: tabHighLight == "/activity" ? "140px" : ""}}
                >
                    {this.renderContent()}
                </div>
            </div>
        );
    }

    renderContent = () => {
        let {
            startDate,
            endDate,
            isCalendar,
            adult,
            child,
            room,
            roomCounts,
            childCounts,
            adultCounts,
            sameusPickShow
        } = this.state;

        switch (true) {
            // case this._tabs[0].to: return (

            //   <React.Fragment>
            //      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
            //       <h5> Coming Soon .....!!! </h5>
            //     </div>
            //      <h3 className="tabHeadText">Search for the best Flights</h3>
            //                 <div className="d-flex flex-row smallColumn flightSearch">
            //                   <div className="flex-column">

            //                         <div className="seleTrip">
            //                           <select value={this.state.wayOfTravel} onChange={this.handleSelectChange}>
            //                             <option value="one">One Way</option>
            //                             <option value="round">Round Trip</option>
            //                             <option value="multi">Multi Way</option>
            //                           </select>
            //                         </div>

            //                    </div>
            //                    <div className="flex-column">
            //                       <div className="seleTrip">
            //                         <select>
            //                           <option>Economy</option>
            //                           <option>Premium Economy</option>
            //                           <option>Business</option>
            //                           <option>First</option>
            //                       </select>
            //                     </div>
            //                    </div>
            //                    <div className="flex-column">
            //                      <div className="selePassanger">
            //                           <span className="NoOfText"  onClick={() =>
            //                           this.setState({
            //                             passangerCateg : !passangerCateg
            //                           })
            //                         }>Passanger</span>
            //                           <div className={ passangerCateg ? "typeOfPassanger" : "typeOfPassanger d-none" } >
            //                           <ul>
            //                             <li><span><img src={img_minusCircle} alt="minus"/></span> <span>2 Adult</span> <span><img src={img_plusCircle} alt="plus"/></span></li>
            //                             <li><span><img src={img_minusCircle} alt="minus"/></span> <span>2 Children <small>(2-12years old)</small></span> <span><img src={img_plusCircle} alt="plus"/></span></li>
            //                             <li><span><img src={img_minusCircle} alt="minus"/></span> <span>2 Infants <small>(0-2years old)</small></span> <span><img src={img_plusCircle} alt="plus"/></span></li>
            //                           </ul>
            //                           <button type="button" className="doneBtn">Done</button>
            //                           </div>
            //                       </div>
            //                    </div>
            //                 </div>

            //                 <div className="d-flex flex-row smallColumn  flightSearch">
            //                   <div className="flex-column">
            //                       <div className="selectTakeOff">
            //                           <img src={img_takeOff} />
            //                           <input type="text" className="" placeholder="Departure From"/>
            //                       </div>
            //                    </div>
            //                    <div className="flex-column">
            //                      <div className="selectTakeOff">
            //                         <img src={img_Landing} />
            //                         <input type="text" className="" placeholder="Arriving At"/>
            //                      </div>
            //                    </div>
            //                    <div className="flex-column">
            //                      {this.state.wayOfTravel == 'round' ? <div className="seleTravelDate roundTripDate align-self-start">
            //                         <img src={img_Calendar}/>
            //                         <input type="date"  name="carDropDate" min={new Date().toISOString().substr(0,10)} value={this.state.carDropDate} onChange={this.handleCarFormDataChange}  className="dateInput borderRig" placeholder="Departure Date"/>
            //                         <input type="date"  name="carDropDate" min={new Date().toISOString().substr(0,10)} value={this.state.carDropDate} onChange={this.handleCarFormDataChange}  className="dateInput" placeholder="Return Date"/>
            //                     </div>  : <div className="seleTravelDate align-self-start">
            //                         <img src={img_Calendar}/>
            //                         <input type="date"  name="carDropDate" min={new Date().toISOString().substr(0,10)} value={this.state.carDropDate} onChange={this.handleCarFormDataChange}  className="dateInput" placeholder="Departure Date"/>
            //                     </div>

            //                      }

            //                    </div>
            //                 </div>
            //                {this.state.wayOfTravel == "multi" && this.state.multiFlightAdd.length > 0 && this.state.multiFlightAdd.map((number,i) =>
            //                    <div className="d-flex flex-row smallColumn  flightSearch" key={i}>
            //                    <div className="flex-column">
            //                        <div className="selectTakeOff">
            //                            <img src={img_takeOff} />
            //                            <input type="text" className="" placeholder="Departure From"/>
            //                        </div>
            //                     </div>
            //                     <div className="flex-column">
            //                       <div className="selectTakeOff">
            //                          <img src={img_Landing} />
            //                          <input type="text" className="" placeholder="Arriving At"/>
            //                       </div>
            //                     </div>
            //                     <div className="flex-column">
            //                        <div className="seleTravelDate addFlightDates align-self-start">
            //                          <img src={img_Calendar}/>
            //                          <input type="date"  name="carDropDate" min={new Date().toISOString().substr(0,10)} value={this.state.carDropDate} onChange={this.handleCarFormDataChange}  className="dateInput" placeholder="Departure Date"/>
            //                      </div>
            //                     <span className="closeFlight" id={i+1} onClick={this.removeFlights} > <i className="fas fa-times"></i></span>
            //                     </div>
            //                  </div>
            //                 )}
            //               {this.state.wayOfTravel == "multi" ? <div className="addAnotherBtn"><button type="button" className=""  onClick={this.addAnotherFlight} disabled={addFlightField}><i className="fas fa-plus"></i> Add Another Flight </button></div> : '' }
            //               <div class="text-right mt-3"><button type="button" className="searchBtn"  onClick={this.handleFlightSearch}>Search <img src={img_SearchIcon} alt="searchIcon"/></button></div> */}
            //   </React.Fragment>
            // )
            case this.props.path == `${this._tabs[0].to}MapView`:
            case this.props.path == "/" || this.props.path == this._tabs[0].to:
                return (
                    <React.Fragment>
                        <div
                            style={
                                this.props.path == "/hotelMapView"
                                    ? {background: "#fff", padding: "15px"}
                                    : {}
                            }
                        >
                            <h3
                                className="tabHeadText"
                                style={
                                    this.props.path == "/hotelMapView"
                                        ? {
                                            fontWeight: "normal",
                                            margin: "0px 0px 10px 0px",
                                            fontSize: "22px"
                                        }
                                        : {}
                                }
                            >
                                Search and Save on Hotels
                            </h3>
                            <div className="selectDivsAl">
                                <div className="form-group mb-2">
                                    <div className="seleboxs">
                                        <LocationSearch
                                            tab={"hotel"}
                                            placeholder="Where..?"
                                            onSearch={this.getSearchInfo}
                                        />
                                        <i
                                            className="fas fa-map-marker-alt locationIcon"
                                            onClick={() => this.getSearchInfo(staticBounds)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group d-flex flex-row smallColumn mb-0">
                                    <div
                                        className={"seleboxs1 flex-column  align-self-start mr-2" + (this.props.path == "/hotelMapView" && this.props.mapResponsiveWidth <= 780 ? " map-date" : "")}>
                                        <img src={img_Calendar} className="calendImg" alt=""/>
                                        <input
                                            type="text"
                                            className="dateInput borderRig"
                                            placeholder="Sat,Oct 20"
                                            onChange={this.handleStartDate}
                                            value={this.props.path == "/hotelMapView" && this.props.mapResponsiveWidth <= 780 ? moment(startDate).format("MMM DD ddd") : moment(startDate).format("MMM DD dddd")}
                                            min={this.getToday()}
                                            onClick={() => this.setState({isCalendar: true})}
                                        />
                                        <input
                                            type="text"
                                            className="dateInput"
                                            placeholder="Fri,Oct 26"
                                            onChange={this.handleEndDate}
                                            value={this.props.path == "/hotelMapView" && this.props.mapResponsiveWidth <= 790 ? moment(endDate).format("MMM DD ddd") : moment(endDate).format("MMM DD dddd")}
                                            min={startDate}
                                            onClick={() => this.setState({isCalendar: true})}
                                        />
                                        {isCalendar && (
                                            <div
                                                onMouseLeave={() => {
                                                    this.setState({isCalendar: false});
                                                }}
                                            >
                                                <DateRangePicker
                                                    value={this.state.value}
                                                    onSelect={this.onSelect}
                                                    minimumDate={this.minimumDate()}
                                                    numberOfCalendars={2}
                                                    stateDefinitions={stateDefinitions}
                                                    dateStates={dateRanges}
                                                    defaultState="available"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="seleboxs2 d-flex flex-row justify-content-center mr-2">
                                        <div className="form-group selectDivsAl">
                                            <select
                                                className={"sele-width" + (this.props.path == "/hotelMapView" && this.props.mapResponsiveWidth <= 790 ? " map-room" : "")}
                                                value={room}
                                                onChange={e => this.setState({room: e.target.value})}
                                            >
                                                {_map(roomCounts, (each, i) => (
                                                    <option key={i} value={i + 1}>
                                                        {i + 1} Room{i == "0" ? "" : "s"}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-row smallColumn">
                                        <div className="form-group selectDivsAl mr-2">
                                            <select
                                                className={"sele-width" + (this.props.path == "/hotelMapView" && this.props.mapResponsiveWidth <= 790 ? " map-adult" : "")}
                                                value={adult}
                                                onChange={e => this.setState({adult: e.target.value})}
                                            >
                                                {_map(adultCounts, (each, i) => (
                                                    <option key={i} value={i + 1}>
                                                        {i + 1} Adult{i === "0" ? "" : "s"}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <select
                                                className={"sele-width" + (this.props.path == "/hotelMapView" && this.props.mapResponsiveWidth <= 790 ? " map-child" : "")}
                                                value={child}
                                                onChange={e =>
                                                    this.setState({
                                                        child: e.target.value,
                                                        childAgeValues:
                                                            this.state.childAgeValues.length > 4
                                                                ? this.state.childAgeValues.splice(
                                                                4,
                                                                this.state.childAgeValues.length
                                                                )
                                                                : this.state.childAgeValues.concat("")
                                                    })
                                                }
                                            >
                                                <option value="0">No Children</option>
                                                {_map(childCounts, (each, i) => (
                                                    <option key={i} value={i + 1}>
                                                        {i + 1} Child{i === "1" ? "" : "ren"}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group d-flex flex-row smallColumn justify-content-end">
                                    <div className="d-flex flex-wrap flex-row">
                                        {this.state.childAgeValues &&
                                        this.state.childAgeValues.length > 0 &&
                                        this.state.child > 0 &&
                                        this.renderChildAge()}
                                    </div>
                                </div>
                                {this.props.isTravelAgent && <div className="seleboxs2 d-flex flex-row justify-content-center mr-2">
                                    <div className="form-group selectDivsAl">
                                        <select
                                            className={"sele-width"}
                                            value={this.state.nationality}
                                            onChange={this.changeHandlerNationality}
                                        >
                                            <option key={-1} value={JSON.stringify({})} style={{ display: 'none' }}>
                                                Nationality
                                            </option>
                                            {_map(this.props.countries, (country, i) => (
                                                <option key={i} value={JSON.stringify(country)}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>}
                            </div>
                            <div className="text-right">
                                <button
                                    type="button"
                                    className="searchBtn"
                                    onClick={this.handleSearch}
                                    disabled={this.state.searchPayload == null || (this.props.isTravelAgent && this.state.nationality === JSON.stringify({}))}
                                >
                                    Search <img src={img_SearchIcon} alt="searchIcon"/>
                                </button>
                            </div>
                        </div>
                        {/* disabled={!this.state.searchPayload} */}
                    </React.Fragment>
                );
            case this.props.path == this._tabs[1].to:
                return (
                    <React.Fragment>
                        <div>
                            <h3 className="tabHeadText">Search and Save on Car Deals </h3>
                            <div className="d-flex flex-row smallColumn carSearchOption">
                                <div className="flex-column">
                                    <div id="pickUpLocation" className="seleLocation">
                                        {/* <input type="text"  className="" placeholder="Pick-up Location"/> */}
                                        <LocationSearch
                                            prefix="airport"
                                            tab={"car"}
                                            placeholder="Pickup Location"
                                            onSearch={this.getSearchInfoPickUp}
                                        />
                                        <i className="fas fa-map-marker-alt locationIcon"/>
                                    </div>
                                </div>
                                <div className="flex-column">
                                    <div id="carPickUpDate" className="seleDate align-self-start">
                                        <img src={img_Calendar}/>

                                        <input
                                            type="text"
                                            className="dateInput"
                                            placeholder="Fri,Oct 26"
                                            value={moment(this.state.carPickUpDate).format(
                                                "MMM DD ddd"
                                            )}
                                            onClick={() =>
                                                this.setState({
                                                    isCarPickUpDateCalender: true,
                                                    isCarDropDateCalender: false
                                                })
                                            }
                                        />

                                        {this.state.isCarPickUpDateCalender && (
                                            <div
                                                onMouseLeave={() => {
                                                    this.setState({isCarPickUpDateCalender: false});
                                                }}
                                            >
                                                <DateRangePicker
                                                    selectionType="single"
                                                    value={this.state["pickUpDateValue"]}
                                                    onSelect={pickUpDateValue => {
                                                        this.setState({
                                                            pickUpDateValue,
                                                            carPickUpDate: moment(pickUpDateValue._d).format(
                                                                "MM/DD/YYYY"
                                                            ),
                                                            //carDropDateValue:"",
                                                            carDropDateValue: moment(pickUpDateValue).add(
                                                                1,
                                                                "days"
                                                            ),
                                                            carDropDate: moment(pickUpDateValue)
                                                                .add(1, "days")
                                                                .format("MM/DD/YYYY"),
                                                            isCarPickUpDateCalender: false
                                                        });
                                                    }}
                                                    minimumDate={this.minimumDate()}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-column">
                                    <div id="carPickUpTime" className="seleTime align-self-start">
                                        <img src={img_clock}/>

                                        <select
                                            name="carPickUpTime"
                                            value={this.state.carPickUpTime}
                                            onChange={this.handleCarFormDataChange}
                                        >
                                            <option value="00:00">
                                                {moment("00:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="00:30">
                                                {moment("00:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="01:00">
                                                {moment("01:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="01:30">
                                                {moment("01:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="02:00">
                                                {moment("02:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="02:30">
                                                {moment("02:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="03:00">
                                                {moment("03:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="03:30">
                                                {moment("03:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="04:00">
                                                {moment("04:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="04:30">
                                                {moment("04:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="05:00">
                                                {moment("05:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="05:30">
                                                {moment("05:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="06:00">
                                                {moment("06:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="06:30">
                                                {moment("06:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="07:00">
                                                {moment("07:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="07:30">
                                                {moment("07:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="08:00">
                                                {moment("08:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="08:30">
                                                {moment("08:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="09:00">
                                                {moment("09:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="09:30">
                                                {moment("09:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="10:00">
                                                {moment("10:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="10:30">
                                                {moment("10:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="11:00">
                                                {moment("11:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="11:30">
                                                {moment("11:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="12:00">
                                                {moment("12:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="12:30">
                                                {moment("12:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="13:00">
                                                {moment("13:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="13:30">
                                                {moment("13:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="14:00">
                                                {moment("14:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="14:30">
                                                {moment("14:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="15:00">
                                                {moment("15:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="15:30">
                                                {moment("15:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="16:00">
                                                {moment("16:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="16:30">
                                                {moment("16:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="17:00">
                                                {moment("17:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="17:30">
                                                {moment("17:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="18:00">
                                                {moment("18:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="18:30">
                                                {moment("18:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="19:00">
                                                {moment("19:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="19:30">
                                                {moment("19:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="20:00">
                                                {moment("20:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="20:30">
                                                {moment("20:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="21:00">
                                                {moment("21:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="21:30">
                                                {moment("21:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="22:00">
                                                {moment("22:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="22:30">
                                                {moment("22:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="23:00">
                                                {moment("23:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="23:30">
                                                {moment("23:30", "hh:mm").format("LT")}
                                            </option>
                                        </select>
                                        {/* <input type="time" name="carPickUpTime" value={this.state.carPickUpTime} onChange={this.handleCarFormDataChange} className="dateInput" placeholder="Pick-Up Time"/> */}
                                    </div>
                                </div>
                                <div className="flex-column">
                                    <div id="carDropDate" className="seleDate align-self-start">
                                        <img src={img_Calendar}/>

                                        <input
                                            type="text"
                                            className="dateInput"
                                            placeholder="Fri,Oct 26"
                                            value={moment(this.state.carDropDate).format(
                                                "MMM DD ddd"
                                            )}
                                            onClick={() =>
                                                this.setState({
                                                    isCarDropDateCalender: true,
                                                    isCarPickUpDateCalender: false
                                                })
                                            }
                                        />

                                        {this.state.isCarDropDateCalender && (
                                            <div
                                                onMouseLeave={() => {
                                                    this.setState({isCarDropDateCalender: false});
                                                }}
                                            >
                                                <DateRangePicker
                                                    selectionType="single"
                                                    value={this.state["carDropDateValue"]}
                                                    onSelect={carDropDateValue => {
                                                        this.setState({
                                                            carDropDateValue,
                                                            carDropDate: moment(carDropDateValue._d).format(
                                                                "MM/DD/YYYY"
                                                            ),
                                                            isCarDropDateCalender: false
                                                        });
                                                    }}
                                                    minimumDate={moment(this.state.carPickUpDate).add(
                                                        1,
                                                        "days"
                                                    )}
                                                    maximumDate={moment(this.state.carPickUpDate).add(
                                                        90,
                                                        "days"
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-column">
                                    <div id="carDropTime" className="seleTime align-self-start">
                                        <img src={img_clock}/>
                                        {/* <input type="time"  name="carDropTime" value={this.state.carDropTime} onChange={this.handleCarFormDataChange}  className="dateInput" placeholder="Drop-Off Time"/>  */}
                                        <select
                                            name="carDropTime"
                                            value={this.state.carDropTime}
                                            onChange={this.handleCarFormDataChange}
                                            className="dateInput"
                                        >
                                            <option value="08:00">
                                                {moment("08:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="08:30">
                                                {moment("08:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="09:00">
                                                {moment("09:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="09:30">
                                                {moment("09:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="10:00">
                                                {moment("10:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="10:30">
                                                {moment("10:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="11:00">
                                                {moment("11:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="11:30">
                                                {moment("11:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="12:00">
                                                {moment("12:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="12:30">
                                                {moment("12:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="13:00">
                                                {moment("13:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="13:30">
                                                {moment("13:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="14:00">
                                                {moment("14:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="14:30">
                                                {moment("14:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="15:00">
                                                {moment("15:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="15:30">
                                                {moment("15:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="16:00">
                                                {moment("16:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="16:30">
                                                {moment("16:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="17:00">
                                                {moment("17:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="17:30">
                                                {moment("17:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="18:00">
                                                {moment("18:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="18:30">
                                                {moment("18:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="19:00">
                                                {moment("19:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="19:30">
                                                {moment("19:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="20:00">
                                                {moment("20:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="20:30">
                                                {moment("20:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="21:00">
                                                {moment("21:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="21:30">
                                                {moment("21:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="22:00">
                                                {moment("22:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="22:30">
                                                {moment("22:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="23:00">
                                                {moment("23:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="23:30">
                                                {moment("23:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="00:00">
                                                {moment("00:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="00:30">
                                                {moment("00:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="01:00">
                                                {moment("01:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="01:30">
                                                {moment("01:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="02:00">
                                                {moment("02:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="02:30">
                                                {moment("02:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="03:00">
                                                {moment("03:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="03:30">
                                                {moment("03:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="04:00">
                                                {moment("04:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="04:30">
                                                {moment("04:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="05:00">
                                                {moment("05:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="05:30">
                                                {moment("05:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="06:00">
                                                {moment("06:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="06:30">
                                                {moment("06:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="07:00">
                                                {moment("07:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="07:30">
                                                {moment("07:30", "hh:mm").format("LT")}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {sameusPickShow ? (
                                <div className="d-flex flex-row smallColumn  carSearchOption respoView">
                                    <div className="flex-column">
                                        <div id="dropOffLocation" className="seleLocation">
                                            {/* <input type="text" className="" placeholder="Drop-Off Location (same as Pick-Up)"/> */}
                                            <LocationSearch
                                                placeholder="Dropoff Location "
                                                onSearch={this.getSearchInfoDropOff}
                                            />
                                            <i className="fas fa-map-marker-alt locationIcon"/>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            <div className="pickuplocation">
                                <p className="">
                                    Different Drop Off Location
                                    <input
                                        type="checkbox"
                                        id="sameusPickup"
                                        name="sameuspickup"
                                        className="filtercheckbox"
                                        value=""
                                        onChange={this.sameUsPickupChange}
                                    />
                                    <label htmlFor="sameusPickup" style={{marginLeft: "8px"}}/>
                                </p>
                            </div>
                            <div className="d-none flex-row smallColumn  carSearchOption ">
                                <div className="flex-column">
                                    <label style={{fontSize: " 16px", marginBottom: " 5px"}}>
                                        Driver Age
                                    </label>
                                    <div id="driverAge" className="seleAge">
                                        <img src={img_age} alt="age icon"/>
                                        {/* <input type="numbet" name="driverAge" value={this.state.driverAge} onChange={this.handleCarFormDataChange} ></input> */}
                                        <select
                                            name="driverAge"
                                            value={this.state.driverAge}
                                            onChange={this.handleCarFormDataChange}
                                        >
                                            {Array(100)
                                                .fill(100)
                                                .map((value, index) => {
                                                    if (index >= 18 && index <= 80) {
                                                        return <option value={index}>{index}</option>;
                                                    }
                                                })}
                                        </select>
                                        {/*<option value="">Age</option></select> */}
                                    </div>
                                </div>
                                <div className="flex-column">
                                    <label style={{fontSize: " 16px", marginBottom: " 5px"}}>
                                        Nationality
                                    </label>
                                    <div id="nationality" className="seleAge selectCountry">
                                        <img src={img_country} alt="Country icon"/>
                                        <Select
                                            className="countrySelectOption"
                                            options={this.state.options}
                                            value={this.state.nationality}
                                            onChange={this.changeHandlerNationality}
                                        />
                                    </div>
                                </div>
                            </div>

                            <span style={{color: "red"}}>
                {" "}
                                <strong>{this.state.errorCarValidation} </strong>
              </span>

                            <div class="text-right">
                                <button
                                    type="button"
                                    onClick={this.carHandleSearch}
                                    className="searchBtn"
                                >
                                    Search <img src={img_SearchIcon} alt="searchIcon"/>
                                </button>
                            </div>
                        </div>
                    </React.Fragment>
                );
            case this.props.path == this._tabs[2].to:
                return (
                    <React.Fragment>
                        <div>
                            <h3 className="tabHeadText">
                                Search and Book Chauffeured Service{" "}
                                <span>
                  <img src={img_chauffeur} width="30px"/>
                </span>
                            </h3>
                            <div className="d-flex flex-row smallColumn transferSearchOption">
                                <div className="flex-column">
                                    <div id="taxiPickUpLocation" className="seleLocation">
                                        {/* <input type="text"  className="" placeholder="Pick-up Location"/> */}
                                        <LocationSearch
                                            prefix="airport"
                                            tab={"transfer"}
                                            placeholder="Pickup Location"
                                            onSearch={this.getSearchTaxiInfoPickUp}
                                        />
                                        <i className="fas fa-map-marker-alt locationIcon"/>
                                    </div>
                                </div>
                                <div className="flex-column">
                                    <div id="taxiDropOffLocation" className="seleLocation">
                                        {/* <input type="text"  className="" placeholder="Pick-up Location"/> */}
                                        <LocationSearch
                                            prefix="airport"
                                            tab={"transfer"}
                                            placeholder="DropOff Location"
                                            onSearch={this.getSearchTaxiInfoDropOff}
                                        />
                                        <i className="fas fa-map-marker-alt locationIcon"/>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-row smallColumn  transferSearchOption">
                                <div className="flex-column">
                                    <div
                                        id="taxiPickUpDate"
                                        className="seleDate align-self-start"
                                    >
                                        <img src={img_Calendar}/>

                                        <input
                                            type="text"
                                            className="dateInput"
                                            placeholder="Fri,Oct 26"
                                            value={moment(this.state.taxiPickUpDate).format(
                                                "MMM DD ddd"
                                            )}
                                            onClick={() =>
                                                this.setState({
                                                    isTaxiPickUpDateCalendar: true
                                                })
                                            }
                                        />

                                        {this.state.isTaxiPickUpDateCalendar && (
                                            <div
                                                onMouseLeave={() => {
                                                    this.setState({isTaxiPickUpDateCalendar: false});
                                                }}
                                            >
                                                <DateRangePicker
                                                    selectionType="single"
                                                    value={this.state["pickUpDateValue"]}
                                                    onSelect={pickUpDateValue => {
                                                        this.setState({
                                                            taxiPickUpDate: moment(pickUpDateValue._d).format(
                                                                "MM/DD/YYYY"
                                                            ),
                                                            pickUpDateValue,
                                                            //carDropDateValue:"",
                                                            // taxiDropDateValue: moment(pickUpDateValue).add(
                                                            //     1,
                                                            //     "days"
                                                            // ),
                                                            isTaxiPickUpDateCalendar: false
                                                        });
                                                    }}
                                                    minimumDate={taxipickUpDateValue}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-column">
                                    <div
                                        id="taxiPickUpTime"
                                        className="seleTime align-self-start"
                                    >
                                        <img src={img_clock}/>

                                        <select
                                            name="taxiPickUpTime"
                                            value={this.state.taxiPickUpTime}
                                            onChange={this.handleCarFormDataChange}
                                        >
                                            <option value="00:00">
                                                {moment("00:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="00:30">
                                                {moment("00:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="01:00">
                                                {moment("01:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="01:30">
                                                {moment("01:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="02:00">
                                                {moment("02:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="02:30">
                                                {moment("02:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="03:00">
                                                {moment("03:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="03:30">
                                                {moment("03:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="04:00">
                                                {moment("04:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="04:30">
                                                {moment("04:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="05:00">
                                                {moment("05:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="05:30">
                                                {moment("05:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="06:00">
                                                {moment("06:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="06:30">
                                                {moment("06:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="07:00">
                                                {moment("07:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="07:30">
                                                {moment("07:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="08:00">
                                                {moment("08:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="08:30">
                                                {moment("08:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="09:00">
                                                {moment("09:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="09:30">
                                                {moment("09:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="10:00">
                                                {moment("10:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="10:30">
                                                {moment("10:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="11:00">
                                                {moment("11:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="11:30">
                                                {moment("11:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="12:00">
                                                {moment("12:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="12:30">
                                                {moment("12:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="13:00">
                                                {moment("13:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="13:30">
                                                {moment("13:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="14:00">
                                                {moment("14:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="14:30">
                                                {moment("14:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="15:00">
                                                {moment("15:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="15:30">
                                                {moment("15:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="16:00">
                                                {moment("16:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="16:30">
                                                {moment("16:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="17:00">
                                                {moment("17:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="17:30">
                                                {moment("17:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="18:00">
                                                {moment("18:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="18:30">
                                                {moment("18:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="19:00">
                                                {moment("19:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="19:30">
                                                {moment("19:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="20:00">
                                                {moment("20:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="20:30">
                                                {moment("20:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="21:00">
                                                {moment("21:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="21:30">
                                                {moment("21:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="22:00">
                                                {moment("22:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="22:30">
                                                {moment("22:30", "hh:mm").format("LT")}
                                            </option>
                                            <option value="23:00">
                                                {moment("23:00", "hh:mm").format("LT")}
                                            </option>
                                            <option value="23:30">
                                                {moment("23:30", "hh:mm").format("LT")}
                                            </option>
                                        </select>
                                        {/* <input type="time" name="carPickUpTime" value={this.state.carPickUpTime} onChange={this.handleCarFormDataChange} className="dateInput" placeholder="Pick-Up Time"/> */}
                                    </div>
                                </div>
                                <div className="flex-column">
                                    <div className="selectPassenger">
                                        <select
                                            className="sele-width"
                                            value={this.state.taxiPassengersCount}
                                            onChange={e =>
                                                this.setState({
                                                    taxiPassengersCount: e.target.value
                                                })
                                            }
                                        >
                                            <option value="1">1 Passenger</option>
                                            <option value="2">2 Passengers</option>
                                            <option value="3">3 Passengers</option>
                                            <option value="4">4 Passengers</option>
                                            <option value="5">5 Passengers</option>
                                            <option value="6">6 Passengers</option>
                                            <option value="7">7 Passengers</option>
                                            <option value="8">8 Passengers</option>
                                            <option value="9">9 Passengers</option>
                                            <option value="10">10 Passengers</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex-column">
                                    <div className="selectLuggage">
                                        <select
                                            className="sele-width"
                                            value={this.state.taxiLuggageCount}
                                            onChange={e =>
                                                this.setState({
                                                    taxiLuggageCount: e.target.value
                                                })
                                            }
                                        >
                                            <option value="0">No Luggage</option>
                                            <option value="1">1 Luggage</option>
                                            <option value="2">2 Luggages</option>
                                            <option value="3">3 Luggages</option>
                                            <option value="4">4 Luggages</option>
                                            <option value="5">5 Luggages</option>
                                            <option value="6">6 Luggages</option>
                                            <option value="7">7 Luggages</option>
                                            <option value="8">8 Luggages</option>
                                            <option value="9">9 Luggages</option>
                                            <option value="10">10 Luggages</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex-column">
                                    <div className="selectAnimal">
                                        <select
                                            className="sele-width"
                                            value={this.state.taxiAnimalCount}
                                            onChange={e =>
                                                this.setState({
                                                    taxiAnimalCount: e.target.value
                                                })
                                            }
                                        >
                                            <option value="0">No Pet</option>
                                            <option value="1">1 Pet</option>
                                            <option value="2">2 Pets</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-row" style={{display: "none"}}>
                                {this.state.showFlight && (
                                    <div className="flex-column">
                                        <div className="selectFlight">
                                            <select
                                                className="sele-width"
                                                value={this.state.taxiFlightNo}
                                                onChange={e =>
                                                    this.setState({
                                                        taxiFlightNo: e.target.value
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
                                                <option value="AB (Air Berlin)">AB (Air Berlin)</option>
                                                <option value="AC (Air Cananda)">
                                                    Ac (Air Cananda)
                                                </option>
                                                <option value="AF (Air France)">AF (Air France)</option>
                                                <option value="BA (British Airways)">
                                                    BA (British Airways)
                                                </option>
                                                <option value="DL (Delta Airlines)">
                                                    DL (Delta Airlines)
                                                </option>
                                                <option value="EK (Emirates)">EK (Emirates)</option>
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
                                )}
                            </div>

                            <span style={{color: "red"}}>
                {" "}
                                <strong>{this.state.errorCarValidation} </strong>
              </span>

                            <div class="text-right">
                                <button
                                    type="button"
                                    onClick={this.handleTaxiSearch}
                                    className="searchBtn"
                                >
                                    Search <img src={img_SearchIcon} alt="searchIcon"/>
                                </button>
                            </div>
                        </div>
                    </React.Fragment>
                );
            case this.props.path == this._tabs[3].to:
                return (
                    <React.Fragment>
                        <div>
                            <h3 className="tabHeadText">Search for Activities</h3>
                            <div className="d-flex flex-row smallColumn activityOption">
                                <div className="flex-column">
                                    <div id="activityLoc" className="seleLocation">
                                        {/* <input type="text"  className="" placeholder="Pick-up Location"/> */}
                                        <input type="text" placeholder="Select location" value={this.state.activityLoc} onChange={this.activitySearch}/>
                                        <i className="fas fa-map-marker-alt locationIcon"/>
                                    </div>
                                    {this.state.showActivityLocation && this.props.activityLocations.length > 0 && <ul className="activity-search seleLocation">
                                        {
                                            _map(this.props.activityLocations, l => (
                                                <li key={l.value} onClick={() => this.onSelectActivityLocation(l.value)}>
                                                    {l.label}
                                                </li>
                                            ))
                                        }
                                    </ul>}
                                </div>
                                <div className="flex-column">
                                    <div id="activityDate" className="seleDate align-self-start">
                                        <img src={img_Calendar}/>

                                        <input
                                            type="text"
                                            className="dateInput"
                                            placeholder="Fri,Oct 26"
                                            value={moment(this.state.activityDate).format(
                                                "MMM DD ddd"
                                            )}
                                            onClick={() =>
                                                this.setState({
                                                    isActivityCalendar: true
                                                })
                                            }
                                        />

                                        {this.state.isActivityCalendar && (
                                            <div
                                                onMouseLeave={() => {
                                                    this.setState({
                                                        isActivityCalendar: false
                                                    });
                                                }}
                                            >
                                                <DateRangePicker
                                                    selectionType="single"
                                                    value={this.state["activityDateValue"]}
                                                    onSelect={activityDateValue => {
                                                        this.setState({
                                                            activityDate: moment(activityDateValue._d).format(
                                                                "MM/DD/YYYY"
                                                            ),
                                                            activityDateValue,
                                                            isActivityCalendar: false
                                                        });
                                                    }}
                                                    minimumDate={this.state.minActivityDateValue}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div class="text-right">
                                <button
                                    type="button"
                                    onClick={this.handleActivitySearch}
                                    disabled={!this.state.activityLocSelected}
                                    className="searchBtn"
                                >
                                    Search <img src={img_SearchIcon} alt="searchIcon"/>
                                </button>
                            </div>
                        </div>
                    </React.Fragment>
                );

                case this.props.path == this._tabs[4].to:
                   if(this.props.location.search == ""){
                       console.log("path",this.props.location.search);
                        this.handlePackageSearch();
                   }
                return (
                    <React.Fragment>
            
                    
                        <div>

                            
                            <div className="selectDivsAl">
                            <div className="d-flex flex-row smallColumn packageOption">
                                <div className="flex-column">
                        <h3 className="tabHeadText">Select Destination</h3>

                                <div id="activityLoc" className="seleLocation">
                                        {/* <input type="text"  className="" placeholder="Pick-up Location"/> */}
                                        <input type="text" placeholder="Select location" value={this.state.packageLoc} onChange={this.packageSearch}/>
                                        <i className="fas fa-map-marker-alt locationIcon"/>
                                    </div>
                                    {this.state.showPackageLocation && this.props.packageLocations.length > 0 && <ul className="activity-search seleLocation">
                                        {
                                            _map(this.props.packageLocations, l => (
                                                <li key={l.value} onClick={() => this.onSelectPackageLocation(l.value,l.label)}>
                                                    {l.label}
                                                </li>
                                            ))
                                        }
                                    </ul>}
                               
                               {/* <div class="seleLocation" id="activityLoc">
                                <div className="seleboxs">
                                        <LocationSearch
                                            tab={"hotel"}
                                            placeholder="Where..?"
                                            onSearch={this.getSearchInfo}
                                        />
                                        <i
                                            className="fas fa-map-marker-alt locationIcon"
                                            onClick={() => this.getSearchInfo(staticBounds)}
                                        />
                                    </div>
                                </div> */}
                                </div>
                                <div class="flex-column">
                        <h3 className="tabHeadText">Select Date</h3>

                                <div className="form-group d-flex flex-row smallColumn mb-0">
                                    <div
                                        className={"seleboxs1 flex-column  align-self-start mr-2" + (this.props.path == "/hotelMapView" && this.props.mapResponsiveWidth <= 780 ? " map-date" : "")}>
                                        <img src={img_Calendar} className="calendImg" alt=""/>
                                        <input
                                            type="text"
                                            className="dateInput borderRig"
                                            placeholder="Sat,Oct 20"
                                            onChange={this.handleStartDate}
                                            value={this.props.path == "/hotelMapView" && this.props.mapResponsiveWidth <= 780 ? moment(startDate).format("MMM DD ddd") : moment(startDate).format("MMM DD ddd")}
                                            min={this.getToday()}
                                            onClick={() => this.setState({isCalendar: true})}
                                        />
                                        <input
                                            type="text"
                                            className="dateInput"
                                            placeholder="Fri,Oct 26"
                                            onChange={this.handleEndDate}
                                            value={this.props.path == "/hotelMapView" && this.props.mapResponsiveWidth <= 790 ? moment(endDate).format("MMM DD ddd") : moment(endDate).format("MMM DD ddd")}
                                            min={startDate}
                                            onClick={() => this.setState({isCalendar: true})}
                                        />
                                        {isCalendar && (
                                            <div
                                                onMouseLeave={() => {
                                                    this.setState({isCalendar: false});
                                                }}
                                            >
                                                <DateRangePicker
                                                    value={this.state.value}
                                                    onSelect={this.onSelect}
                                                    minimumDate={this.minimumDate()}
                                                    numberOfCalendars={2}
                                                    stateDefinitions={stateDefinitions}
                                                    dateStates={dateRanges}
                                                    defaultState="available"
                                                    format='yyyy-MM-dd'
                                                />
                                            </div>
                                        )}
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    <div class="text-right">
                                <button
                                    type="button"
                                    onClick={this.handlePackageSearch}
                                    className="searchBtn"
                                >
                                    Search <img src={img_SearchIcon} alt="searchIcon"/>
                                </button>
                            </div>
                                    </div>
                                    </div>
               
                    </React.Fragment>
        
                );

            default:
                return (
                    <React.Fragment>
                        <div style={{textAlign: "center"}}>
                            <img src={img_progress} style={style}/>
                            <div className="noHotelText">
                                {this._tabs.find(each => each.to === this.props.path)["lable"]}{" "}
                                LIMITED ACCESS
                            </div>
                            <span
                                onClick={this.props.onSignIn}
                                className="forgotLink commonLink"
                                style={{cursor: "pointer"}}
                            >
                Signup
              </span>
                        </div>
                    </React.Fragment>
                );
        }
    };

    renderChildAge = () => {
        let {child, childAgeValues, childCounts} = this.state;
        let Age =
            childAgeValues &&
            childAgeValues.length > 0 &&
            Array(parseInt(child)).fill("");
        // let Age = childAgeValues && childAgeValues.length > 0 && childAgeValues;

        return (
            <React.Fragment>
                <div className="form-group">
                    {child == 1 && <label className="age-box borLeft">Child Aged:</label>}
                    {child > 1 && (
                        <label className="age-box borLeft">Children Aged:</label>
                    )}
                </div>
                {childAgeValues &&
                childAgeValues.length > 0 &&
                Age.map((each, i) => {
                    return (
                        <div key={i} className="form-group">
                            <select
                                className="age-box"
                                onChange={e => {
                                    childAgeValues[i] = e.target.value;
                                    this.forceUpdate();
                                }}
                            >
                                {this.state.childAgeValues.length > 0 && (
                                    <option value={this.state.childAgeValues[i] || 0}>
                                        {this.state.childAgeValues[i] || "Age"}
                                    </option>
                                )}
                                {childCounts.map((each, i) => {
                                    return (
                                        <option key={i} value={i + 1}>
                                            {i + 1}{" "}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    );
                })}
            </React.Fragment>
        );
    };
}

const mapStateToProps = state => ({
    isSearching: state.hotelReducer.isSearching,
    isTravelAgent: state.dashboardReducer.isTravelAgent,
    countries: state.hotelReducer.countries,
    activityLocations: state.activityReducer.locations,
    packageLocations: state.packageReducer.locations,

});

const mapDispatchToProps = dispatch => ({
    searchHotel: searchInfo => dispatch(searchHotel(searchInfo)),
    searchActivity: searchInfo => dispatch(activitySearch(searchInfo)),
    searchPackage: searchInfo => dispatch(packageSearch(searchInfo)),
    getCurrencyCode: () => dispatch(getCurrencyCode()),
    activityLocationSearch: (searchInfo) => dispatch(activityLocationSearch(searchInfo)),
    packageLocationSearch: (searchInfo) => dispatch(packageLocationSearch(searchInfo)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(SearchTool));
