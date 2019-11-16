import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import img_Time from "../../../asset/images/Time.svg";
import clock_SVG from "../../../asset/images/Time.svg";
import img_WhereIcon from "../../../asset/images/Where Icon (Map Marker).svg";
import ImageCarousel from "../../presentational/ImageCarousel";
import ActivityRating from "./ActivityRating";
import moment from 'moment';

import img_unAvaliable from "../../../asset/images/No_Image.jpg";

import {connect} from "react-redux";
import {map as _map, isEmpty as _isEmpty, forEach as _forEach} from "lodash";
import ItineraryInfo from "./ItineraryInfo";

var currencies = require('country-data').currencies;

class ActivityReservation extends Component {
    constructor() {
        super();
        this.state = {
            isOverview: false,
            isInclusion: true,
            isDepartAndReturn: false,
            isHotelPickup: false,
            isItinerary: false,
            isCancellationPolicy: false,
            isActivityTraveller: false,
            isAdditionalInfo: false,
        }
    }

    componentDidCatch(err, value) {

    }
    


    render() {
        const {
            isOverview,
            isInclusion,
            isDepartAndReturn,
            isHotelPickup,
            isItinerary,
            isCancellationPolicy,
            isActivityTraveller,
            isAdditionalInfo,
        } = this.state;
        const {selectedActivity, traveller, selectedActivityPrice } = this.props;
        console.log("newwwwwww", selectedActivityPrice && selectedActivityPrice.bookingDate)

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

        return  (
            <div>
                <div className="selectRoomBg d-flex flex-wrap">
                    <div className="selectRoomTitle">
                        <h4>Confirm your reservation</h4>
                    </div>
                    {
                        !_isEmpty(selectedActivity) && !_isEmpty(selectedActivityPrice) && (
                            <div id="RoomResInfo" style={{ width: "100%" }}>
                                <div className="selectRoomItemsBg d-flex flex-row resWrap">
                                    <div className="flex-column confirmRoomLeft" >
                                        {/* {selectedActivity.productPhotos ? (
                                            <ImageCarousel
                                                imageList={_map(selectedActivity.productPhotos, each => ({
                                                    name: each.caption,
                                                    url: each.photoURL
                                                }))}
                                                thumbNail={{name: "img1", url: }}
                                            />
                                        ) : (
                                            <ImageCarousel/>
                                        )} */}
                                        <img src={selectedActivity.productPhotos[0].photoURL ? selectedActivity.productPhotos[0].photoURL : img_unAvaliable} />
                                        <div className="activityInfo" >
                                            <ul>
                                                <li>
                                                    <div>
                                                    <div className="d-flex" style={{padding: "8px"}}>
                                                <p style={{fontSize:"14px"}}><span><img src={clock_SVG} style={{paddingBottom: "2px", width: "20px", height: '22px'}} className="mr-3" /></span>{selectedActivity.duration}</p>
                                            </div>
                                            {languageService && <div className="d-flex" style={{padding: "8px"}}>
                                                <p style={{fontSize:"14px"}}><span><i className="fa fa-comments mr-3"/>{languageService}</span></p>
                                            </div>}
                                                    </div>
                                                </li>
                                            <li>
                                                <div>

                                            {selectedActivity.hotelPickup && <div className="d-flex" style={{padding: "8px"}}>
                                                <p style={{fontSize:"14px"}}><span><i className="fa fa-car mr-3"/></span>Hotel Pick Offered</p>
                                            </div> }

                                            {selectedActivity.voucherOption && <div className="d-flex" style={{padding: "8px" }}>
                                                
                                                <p style={{fontSize:"14px"}}><span><i className="fa fa-gift mr-3"/></span> Mobile Ticket</p>
                                            </div>}
                                            </div>
                                            </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="flex-column confirmRoomRight">
                                        <div className="mb-3 d-flex activityInfo border-bottom">
                                            <ActivityRating
                                                rating={selectedActivity.rating}
                                                style={{borderBottom: "none", width: '35%'}}
                                            />
                                            <div className="ml-3">{selectedActivity.reviewCount} Reviews</div>
                                        </div>
                                        <div className="reservationDetails">
                                            <h4>{selectedActivity.shortTitle}</h4>
                                            <p>
                                                <img src={img_WhereIcon}/>
                                                <span>
                                                    {selectedActivity.location}
                                                </span>
                                            </p>
                                            <ul>
                                                <li className="border mr-2">
                                                    <h6>Travel Date</h6>
                                                    <p>{moment(selectedActivityPrice.bookingDate).format("dddd, MMMM DD YYYY")}</p>
                                                </li>
                                                {selectedActivityPrice.gradeDepartureTime && <li className="border ml-2">
                                                    <h6>Starting Time</h6>
                                                    <p>{selectedActivityPrice.gradeDepartureTime}</p>
                                                </li>}
                                            </ul>
                                        </div>
                                        <ul className="totalAmountDis" style={{width:"305px"}}>
                                            <li>
                                                <span>
                                                    {traveller}
                                                </span>{" "}
                                                <span>
                                                    <span style={{fontSize: "16px"}}>
                                                        {`${currencies[selectedActivity.currencyCode].symbol}${selectedActivityPrice.merchantNetPrice}`}
                                                    </span>
                                                </span>
                                            </li>
                                            <li>
                                                <span>Taxes & Fees</span>{" "}
                                                <span>
                                                    <span style={{fontSize: "16px"}}>
                                                        {currencies[selectedActivityPrice.currencyCode].symbol}
                                                    </span>
                                                    <span>
                                                        &nbsp;{(selectedActivityPrice.retailPrice - selectedActivityPrice.merchantNetPrice).toFixed(2)}
                                                    </span>
                                                </span>
                                            </li>
                                            <li>
                                                <span>Total Cost</span>{" "}
                                                <span>
                                                      <span style={{fontSize: "16px"}}>
                                                          {`${currencies[selectedActivityPrice.currencyCode].symbol}${selectedActivityPrice.retailPrice}`}
                                                      </span>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                {
                    !_isEmpty(selectedActivity) && !_isEmpty(selectedActivityPrice) && (
                        <div>
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
                        </div>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    selectedCurrency: state.commonReducer.selectedCurrency,
    loginDetails: state.loginReducer.loginDetails,
});

const mapDispatchToProps = dispatch => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActivityReservation));
