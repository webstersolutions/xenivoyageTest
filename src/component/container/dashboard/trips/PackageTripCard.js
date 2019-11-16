import React, {Component} from 'react';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import {sumBy as _sumBy, map as _map, find as _find, get as _get} from 'lodash'
import moment from "moment";
import {RawHtmlToJSON} from '../../../presentational/RawHtmlToJSON';
import img_DateArrow from "../../../../asset/images/Date Arrow.png";
import img_gmail from "../../../../asset/images/dashboard/gmail.png";
import img_whatsapp from "../../../../asset/images/dashboard/whatsapp.png";
import img_google from "../../../../asset/images/dashboard/google-plus.png";
import img_calend from "../../../../asset/images/dashboard/calend.png";
import img_extrabed from "../../../../asset/images/selectRoom/extrabed.png";
import img_print from "../../../../asset/images/dashboard/print.png";
import img_socialClick from "../../../../asset/images/dashboard/socialClick.png";
import img_plane from "../../../../asset/images/plane.png";
import img_Date from "../../../../asset/images/Date Arrow.png";
import img_Departure from "../../../../asset/images/Departure.svg";
import img_packages from "../../../../asset/images/package.png";

import img_Time from "../../../../asset/images/Time.svg";
import img_Airlines from "../../../../asset/images/United-Airlines.png";
import img_Arrival from "../../../../asset/images/Arrival.svg"
import img_car from "../../../../asset/images/car.png";
import img_transfer from "../../../../asset/images/chauffeur.png";
import img_hotel from "../../../../asset/images/hotel-building.png";
import img_television from "../../../../asset/images/television.png";
import img_signal from "../../../../asset/images/selectRoom/signal.png";
import img_icon from "../../../../asset/images/selectRoom/icon.png";
import img_parking from "../../../../asset/images/selectRoom/parking-sign(1).png";
import img_tick from '../../../../asset/images/roundTick.png';
import img_info from "../../../../asset/images/information.png";
import img_discount from '../../../../asset/images/discount.png';
import img_noSmoke from '../../../../asset/images/no-smoking-sign (1).png';
import img_close from '../../../../asset/images/cancel.png';
import img_reserve from "../../../../asset/images/online-booking.png";
import img_activities from "../../../../asset/images/activities.png";
import img_carUser from '../../../../asset/images/dashboard/carUser.png';
import img_door from '../../../../asset/images/dashboard/door.png';
import img_luggage from '../../../../asset/images/dashboard/luggage.png';
import queryString from 'query-string';

const currencies = require("country-data").currencies;
const _typeIcon = {hotel: img_hotel, car: img_car, flight: img_plane, transfer: img_transfer, activity: img_activities}

class PackageTripCard extends Component {

    state = {
        isExpand: false,
        isExpendDiv: true,
        isCancellation: false,
        isCancelBook: false,
        isHideDiv: false
    };

    handleExpand = (event) => {
        event.preventDefault();
        this.setState({isExpand: !this.state.isExpand})
    };

    divOpen = () => {
        this.setState({isExpendDiv: !this.state.isExpendDiv})
    };

    print = () => {

        let content = document.getElementById("divcontents");
        let pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
    };

    bookingCancel = (bookingId,email) => {

       this.props.history.push(`/packageCancelBooking?bookingId=${bookingId}&email=${email}&view=false`);
    };

    bookingView = ({distributorItemRef, distributorRef}) => {
        this.props.history.push(`/packageBookingConfirmation?distributorItemRef=${distributorItemRef}&distributorRef=${distributorRef}&view=true`);
    };

    render() {
        const {isHideDiv} = this.state;
        const {selectedCurrency} = this.props;
        
        return (
            <React.Fragment>
                {this.renderCard()}
            </React.Fragment>

        );
    }

    renderCard = () => {

        const {index, PackageList, key} = this.props;
        const {isExpand, isExpendDiv} = this.state;
       const image = _get(PackageList   , "images[0].photoURL")
        let answer;

        if(PackageList.selectedPackage != null && PackageList.selectedPackage.bookingQuestions.length != 0){

        answer= PackageList.selectedPackage.bookingQuestionAnswers;

        }
        console.log("PackageList",PackageList);
        return (

            <React.Fragment>

                
                    <tr id="divcontents" className={index % 2 ? "even" : "odd"} onClick={this.handleExpand}>
                        <td data-label="SI"><img src={img_packages}/> {index + 1}</td>
                        <td data-label="Xeniapp Booking Id">{PackageList.response.bookingId}</td>
                        <td data-label="Departs From">  {PackageList.response != null ? (PackageList.response.packageTitle): ("")} </td>
                        
                        <td data-label="Booking Date" Style={{width:"100%"}}>{PackageList.request.transDetails != null ? (PackageList.request.transDetails.transDate.substring(0, 10)) :("")}</td>
                        <td data-label="Travel Date From" Style={{width:"100%"}}
                            > {PackageList.request.items[0].travelDatefrom? (PackageList.request.items[0].travelDatefrom):("")}</td>
                        <td data-label="Travel Date To" Style={{width:"100%"}}
                            > {PackageList.request.items[0].travelDateto? (PackageList.request.items[0].travelDateto):("")}</td>
                        
                        <td data-label="Price">{`${currencies[PackageList.request.currencyCode].symbol}`}{PackageList.fare}</td>
                        <td data-label="Booking Status">{PackageList.refund == false ? "Confirmed" : "Cancelled"}</td>
                    </tr>

                     <tr className={isExpand ? 'collapseRow' : 'collapseRow collapse'}>
                        <td colSpan="10">
                            <div id="collapseOne" className="detailsShow" data-parent="#accordion">
                                <div className="d-flex flex-row resWrap">
                                   <div className="flex-column confirmRoomLeft">
                                        <div className="carImgShow">
                                            <img
                                                src={PackageList.response.packageDetails.gallery[0]}
                                                className="carImg"/>
                                        </div>
                                        <div className="flex-column"/>
                                    </div>
                                    <div className="flex-column confirmRoomRight hotelTrips">
                                        <div>

                                            <ul className="pickupDropDet">
                                                <li className="pickUpWidth2">
                                                    <h6>Package Name</h6>
                                                    <p className="alignDepature" dangerouslySetInnerHTML={{__html: PackageList.response.packageTitle != null ?(PackageList.response.packageTitle):("") }}/>
                                                </li>

                                            </ul>
                                            <ul>
                                                <li className="border mr-2 startingDate">
                                                    <h6>Travel Date 
                                                        <br></br>
                                                        From</h6>
                                                    <p>{PackageList.request != null ? (PackageList.request.items[0].travelDatefrom):("") }</p>
                                                </li>

                                                <li className="border ml-2 startingDate">
                                                    <h6>Travel Date 
                                                        <br></br>
                                                        To</h6>
                                                    <p>{PackageList.request != null ? (PackageList.request.items[0].travelDateto):("")}</p>
                                                </li>
                                            </ul>
                                            <div style={{borderTop:"1px solid",padding:"12px"}}>
                                        <h6>Passengers Details :</h6>
                                        <div style={{padding:"5px"}}>
                                        <p><b>Name:</b> {PackageList.request.booker.firstname} </p>
                                        <p><b>Email:</b> {PackageList.request.booker.email} </p>
                                        <p><b>Phone No:</b> {PackageList.request.booker.cellPhone} </p>
                                       
                                    {PackageList.request &&PackageList.request.items[0].specialRequirements && PackageList.request.items[0].specialRequirements != "" || PackageList.request.items[0].specialRequirements != undefined ? (  <p><b>Special Reqest:</b> {PackageList.request.items[0].specialRequirements} 
                                        </p>):(null)}
                                      

                                        <p><b>Confirmation No:</b> {PackageList.request.items[0].partnerItemDetail.distributorItemRef.substr(0, 6).toUpperCase()} </p>
                                       
                                        </div>
                                        {PackageList.request.participants != null ? ( 
                                        <div>
                                        <h6>Supplier Details :</h6>
                                        <div style={{padding:"5px"}}>
                                            <p><b>Adult:</b> {PackageList.request.participants.adult} </p>
                                            <p><b>Children:</b> {PackageList.request.participants.children} </p> 
                                            <p><b>Senior Citizen:</b> {PackageList.request.participants.seniorCitizen} </p></div></div>):( null
                                                        
                                        ) }
                                          {PackageList.response.packageDetails && PackageList.response.packageDetails.includes ? (
                                                <div>
                                                    <h4>Inclusions:</h4>  
                                                    
                                                    {_map(PackageList.response.packageDetails.includes, (item, index) => {
                                                        return(
                                                            <p key={index} style={{padding:"0px 10px"}}>
                                                                 {item}                                                
                                                        </p>
                                                        )
                                                    } )}
                                                
                                                </div>
                                            ):(null)}
                                          {PackageList.response.packageDetails && PackageList.response.packageDetails.excludes ? (

                                                <div>
                                                    <h4>Exclusions:</h4>  
                                                   
                                                    {_map(PackageList.response.packageDetails.excludes, (item, index) => {
                                                        return(
                                                            <p key={index} style={{padding:"0px 10px"}}>
                                                                 {item}                                                
                                                        </p>
                                                        )  
                                                    } )}
                                                  
                                                </div>
                                            ):(null)}
                                                                                     
                                    
                                    </div>
                                        </div>
                                    </div>
                                    <div className="flex-column priceDetails hotelTrips">
                                        <div className="d-flex justify-content-between OtherOptions">
                                            <div>
                                                <img src={img_print}/>
                                            </div>
                                            <div className="calenderView">
                                                <img src={img_calend}/>
                                            </div>
                                        </div>
                                        <ul className="totalAmountDis">
                                            <li>
                                                <span>Total Cost</span>
                                                <span>{`${currencies[PackageList.currencyCode].symbol}`}{PackageList != null ? (PackageList.fare) :("")}</span>
                                            </li>
                                        </ul>
                                        <button type="submit" onClick={() => this.bookingCancel(PackageList.response.bookingId,PackageList.email)}
                                                className="searchBtn completebtn"> View
                                        </button>
                                        <button hidden={true} type="submit" disabled={!PackageList.booking_status}
                                                onClick={() => this.bookingView(PackageList)}
                                                className="searchBtn completebtn"> View
                                        </button>
                                        <div>
                                            <h6 onClick={this.divOpen}>Cancellation and reservation policy </h6>
                                            {/* <h6>{PackageList.response.data != null ? _get(PackageList.response.data.itemSummaries,"merchantTermsAndConditions.termsAndConditions",'') :("")} </h6> */}
                                        <h6>
                    {PackageList.request.items[0].package_cancellation}

                                        </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                  
            </React.Fragment>
        );


    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PackageTripCard));

