import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import img_Time from "../../../asset/images/Time.svg";
import clock_SVG from "../../../asset/images/Time.svg";
import img_WhereIcon from "../../../asset/images/Where Icon (Map Marker).svg";
import ImageCarousel from "../../presentational/ImageCarousel";
import PackageRating from "./PackageRating";
import moment from 'moment';

import img_unAvaliable from "../../../asset/images/No_Image.jpg";

import {connect} from "react-redux";
import {map as _map, isEmpty as _isEmpty, forEach as _forEach} from "lodash";
import ItineraryInfo from "./ItineraryInfo";

var currencies = require('country-data').currencies;

class PackageReservation extends Component {
    constructor() {
        super();
        this.state = {
            isDescription: false,
        isInclusion: true,
        isDepartAndReturn: false,
        isItinerary: false,
        isHighlights: false,
            isCancellationPolicy: false,
            isPackageTraveller: false,
            isAdditionalInfo: false,
        }
    }

    componentDidCatch(err, value) {

    }
    


    render() {
        
        const {
            isDescription,
            isInclusion,
            isDepartAndReturn,
            isItinerary,
            isHighlights,
            isCancellationPolicy,
            isPackageTraveller,
            isAdditionalInfo,
        } = this.state;
        const {selectedPackage, traveller, selectedPackagePrice, num_adults, num_child, num_sr_citizen, package_date, endson } = this.props;
       // console.log("newwwwwww", selectedPackage,selectedPackagePrice)

        let languageService = null;

        if (selectedPackage && selectedPackage.tourGradesAvailable) {
            let count = 0;
            _forEach(selectedPackage.tourGrades[0].langServices, lang => {
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
                        !_isEmpty(selectedPackage) && !_isEmpty(selectedPackagePrice) ||(
                            <div id="RoomResInfo" style={{ width: "100%" }}>
                                <div className="selectRoomItemsBg d-flex flex-row resWrap">
                                    <div className="flex-column confirmRoomLeft" >
                                        {/* {selectedPackage.productPhotos ? (
                                            <ImageCarousel
                                                imageList={_map(selectedPackage.productPhotos, each => ({
                                                    name: each.caption,
                                                    url: each.photoURL
                                                }))}
                                                thumbNail={{name: "img1", url: }}
                                            />
                                        ) : (
                                            <ImageCarousel/>
                                        )} */}
                                        
                                        <img src={selectedPackage.gallery[0] ? selectedPackage.gallery[0] : img_unAvaliable} />
                                       
                                    </div>
                                    <div className="flex-column confirmRoomRight">
                                        
                                        <div className="reservationDetails">
                                            <h4>{selectedPackage.title}</h4>
                                            <p>
                                                <img src={img_WhereIcon}/>
                                                <span>
                                                    {selectedPackage.country}
                                                </span> | <img style={{paddingBottom: "2px", width: "13px", "margin-left":"0px"}} className="mr-1 marginDatehours" src={clock_SVG}/>
                            -{" "}{
                    (selectedPackage.duration.type == "multiday") ? 
                    ( " "+ selectedPackage.duration.time-1 + " Nights" + " | " + selectedPackage.duration.time + " Days" ):
                     ( selectedPackage.duration.time + " Hours")}
                                            </p>                                     
                        

                                            <ul className="package-dates">
                                                <li className="border mr-2">
                                                    <h6>Travel Date</h6>
                                                    { /*<p>{moment(selectedPackagePrice.bookingDate).format("dddd, MMMM DD YYYY")}</p>*/
                                                package_date
                                                } To {endson}
                                                </li>
                                                {/* {selectedPackagePrice.gradeDepartureTime && <li className="border ml-2">
                                                    <h6>Starting Time</h6>
                                                    <p>{selectedPackagePrice.gradeDepartureTime}</p>
                                                </li>} */}
                                            </ul>
                                        </div>
                                        <ul className="totalAmountDis package-amounts" style={{width:"305px"}}>
                                            <li>
                                                <span>
                                                    {/* traveller */                                                
                                                    }
                                                    Adults: {num_adults}, Children: {num_child}, Sr. Citizen: {num_sr_citizen}
                                                </span>{" "}
                                                <span>                                                    
                                                        {/* {`${currencies[selectedPackage.currencyCode].symbol}${selectedPackagePrice.merchantNetPrice}`} */}
                                            
                                                         <b>${selectedPackagePrice}</b>
                                                </span>
                                            </li>
                                            <li style={{"display":"none"}}>
                                                <span>Taxes & Fees</span>{" "}
                                                <span>
                                                    <span style={{fontSize: "16px"}}>
                                                        {/* {currencies[selectedPackagePrice.currencyCode].symbol} */}
                                                    </span>
                                                    <span>
                                                        &nbsp;{/*(selectedPackagePrice.actualPrice - selectedPackagePrice.dealPrice).toFixed(2)*/}
                                                    </span>
                                                </span>
                                            </li>
                                            <li>
                                                <span>Total Cost</span>{" "}
                                                <span>
                                                      <span style={{fontSize: "16px"}}>
                                                          ${/* {`${currencies[selectedPackagePrice.currencyCode].symbol}${selectedPackagePrice.retailPrice}`} */
                                                        selectedPackagePrice
                                                        }
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
                    !_isEmpty(selectedPackage) && !_isEmpty(selectedPackagePrice) || (                        
                        <div>
                           <div className="d-flex flex-wrap justify-content-between webResp">
                        <div
                            className={`flex-column tabInfoActivity ${
                                isDescription ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: true,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isItinerary: false,
                                    isHighlights: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Description
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isInclusion ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: false,
                                    isInclusion: true,
                                    isDepartAndReturn: false,
                                    isItinerary: false,
                                    isHighlights: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Inclusions & Exclusions
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isItinerary ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: false,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isItinerary: true,
                                    isHighlights: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Itinerary
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isHighlights ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: false,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isItinerary: false,
                                    isHighlights: true,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Highlights
                        </div>
                       
                        </div>
                  
                        <ItineraryInfo
                        itinerary={selectedPackage}
                        isDescription={isDescription}
                        isInclusion={isInclusion}
                        isItinerary={isItinerary}
                        isHighlights={isHighlights}

                       // isDepartAndReturn={isDepartAndReturn}
                        // isHotelPickup={isHotelPickup}
                        // isCancellationPolicy={isCancellationPolicy}
                        // isActivityTraveller={isActivityTraveller}
                        // isAdditionalInfo={isAdditionalInfo}
                        
                    />

                    <div className="d-flex flex-wrap justify-content-between mobileResp">
                        <div
                            className={`flex-column tabInfoActivity ${
                                isDescription ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: true,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isItinerary: false,
                                    isHighlights: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Description
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isInclusion ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: false,
                                    isInclusion: true,
                                    isDepartAndReturn: false,
                                    isItinerary: false,
                                    isHighlights: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Inclusions & Exclusions
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isItinerary ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: false,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isItinerary: true,
                                    isHighlights: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Itinerary
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isHighlights ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: false,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isItinerary: false,
                                    isHighlights: true,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Highlights
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PackageReservation));
