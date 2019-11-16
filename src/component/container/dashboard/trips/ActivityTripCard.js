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

class ActivityTripCard extends Component {

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

    bookingCancel = ({distributorItemRef, distributorRef}) => {
        this.props.history.push(`/activityCancelBooking?distributorItemRef=${distributorItemRef}&distributorRef=${distributorRef}&view=false`);
    };

    bookingView = ({distributorItemRef, distributorRef}) => {
        this.props.history.push(`/activityBookingConfirmation?distributorItemRef=${distributorItemRef}&distributorRef=${distributorRef}&view=true`);
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

        const {index, ActivityList, key} = this.props;
        const {isExpand, isExpendDiv} = this.state;
        const image = _get(ActivityList, "images[0].photoURL")
        let answer;

        if(ActivityList.selectedActivity != null && ActivityList.selectedActivity.bookingQuestions.length != 0){

        answer= ActivityList.selectedActivity.bookingQuestionAnswers;

        }
        return (

            <React.Fragment>

                
                    <tr id="divcontents" className={index % 2 ? "even" : "odd"} onClick={this.handleExpand}>
                        <td data-label="SI"><img src={_typeIcon["activity"]}/> {index + 1}</td>
                        {/* <td data-label="Dist Ref ID"> {ActivityList.distributorRef}</td>
                        <td data-label="Dist Item Ref"> {ActivityList.distributorItemRef}</td> */}
                        <td data-label="Xeniapp Booking Id">{ActivityList.distributorRef.substr(0, 6).toUpperCase()}</td>
                        <td data-label="Departs From">  {ActivityList.response.data != null ? (ActivityList.response.data.itemSummaries[0].departsFrom): ("")} </td>
                        <td data-label="departs Point"
                            dangerouslySetInnerHTML={{ __html: ActivityList.response.data != null ? (ActivityList.response.data.itemSummaries[0].departurePoint): ("") }}>
                        </td>
                        <td data-label="Booking Date" Style={{width:"100%"}}>{ActivityList.response.data != null ? (ActivityList.response.data.bookingDate) :("")}</td>
                        <td data-label="Travel Date" Style={{width:"100%"}}
                            > {ActivityList.response.data != null ? (ActivityList.response.data.itemSummaries[0].travelDate):("")}</td>
                        <td data-label="Price">{`${currencies[ActivityList.currencyCode].symbol}`}{ActivityList.fare}</td>
                        {/* <td data-label="Booking Id">{ActivityList.vmid}</td> */}
                        <td data-label="Booking Status">{ActivityList.isCancel ?"CANCELLED": "SUCCESS"  }</td>
                    </tr>

                    <tr className={isExpand ? 'collapseRow' : 'collapseRow collapse'}>
                        <td colSpan="10">
                            <div id="collapseOne" className="detailsShow" data-parent="#accordion">
                                <div className="d-flex flex-row resWrap">
                                    <div className="flex-column confirmRoomLeft">
                                        <div className="carImgShow">
                                            <img
                                                src={image}
                                                className="carImg"/>
                                        </div>
                                        <div className="flex-column"/>
                                    </div>
                                    <div className="flex-column confirmRoomRight hotelTrips">
                                        <div>

                                            <ul className="pickupDropDet">
                                                <li className="pickUpWidth2">
                                                    <h6>Departure Point</h6>
                                                    <p className="alignDepature" dangerouslySetInnerHTML={{__html: ActivityList.response.data != null ?( ActivityList.response.data.itemSummaries[0].departurePoint):("") }}/>
                                                </li>

                                                <li className="pickUpWidth2">
                                                    <h6>Departure Point Directions</h6>
                                                    <p className="alignDepature" dangerouslySetInnerHTML={{__html: ActivityList.response.data != null ? (ActivityList.response.data.itemSummaries[0].departurePointDirections): ("") }}/>
                                                </li>
                                            </ul>
                                            <ul>
                                                <li className="border mr-2 startingDate">
                                                    <h6>Travel Date</h6>
                                                    <p>{ActivityList.response.data != null ? (ActivityList.response.data.itemSummaries[0].travelDate):("") }</p>
                                                </li>

                                                <li className="border ml-2 startingDate">
                                                    <h6>Starting Time</h6>
                                                    <p>{ActivityList.response.data != null ? (ActivityList.response.data.itemSummaries[0].startingTime):("")}</p>
                                                </li>
                                            </ul>
                                            <div style={{borderTop:"1px solid",padding:"12px"}}>
                                        <h6>Passengers Details :</h6>
                                        {/* Need to intergrate question and answer */}
                                        <div style={{padding:"5px"}}>
                                        <p><b>Name:</b> {ActivityList.request.booker.firstname} </p>
                                        <p><b>Email:</b> {ActivityList.request.booker.email} </p>
                                        <p><b>Phone No:</b> {ActivityList.request.booker.cellPhone} </p>
                                        {ActivityList.response.data && ActivityList.response.data.itemSummaries[0].pickupHotelName != null ? 
                                            (  <p><b>Hotel Pick up:</b> {ActivityList.response.data.itemSummaries[0].pickupHotelName } </p>):(null)}
                                    
                                    {ActivityList.request &&ActivityList.request.items[0].specialRequirements && ActivityList.request.items[0].specialRequirements != "" || ActivityList.request.items[0].specialRequirements != undefined ? (  <p><b>Special Reqest:</b> {ActivityList.request.items[0].specialRequirements} 
                                        </p>):(null)}
                                      

                                        <p><b>Confirmation No:</b> {ActivityList.distributorRef.substr(0, 6).toUpperCase()} </p>
                                        {/* need to intergrate Inclusions and Exclusions */}
                                        {/* <p><b>Inclusions and Exclusions:</b>  </p> */}
                                        </div>
                                        {ActivityList.response.data != null ? ( 
                                        <div>
                                        <h6>Supplier Details :</h6>
                                        <div style={{padding:"5px"}}>
                                            <p><b>Description:</b> {ActivityList.response.data.itemSummaries[0].travellerAgeBands[0].description} </p>
                                            <p><b>Count:</b> {ActivityList.response.data.itemSummaries[0].travellerAgeBands[0].count} </p> </div></div>):( null
                                                        
                                        ) }
                                          {ActivityList.selectedActivity && ActivityList.selectedActivity.selectedActivity.inclusions ? (
                                                <div>
                                                    <h4>Inclusions:</h4>  
                                                    
                                                    {_map(ActivityList.selectedActivity.selectedActivity.inclusions, (item, index) => {
                                                        return(
                                                            <p key={index} style={{padding:"0px 10px"}}>
                                                                 {item}                                                
                                                        </p>
                                                        )
                                                    } )}
                                                
                                                </div>
                                            ):(null)}
                                         {ActivityList.selectedActivity && ActivityList.selectedActivity.selectedActivity.exclusions ? (
                                                <div>
                                                    <h4>Exclusions:</h4>  
                                                   
                                                    {_map(ActivityList.selectedActivity.selectedActivity.exclusions, (item, index) => {
                                                        return(
                                                            <p key={index} style={{padding:"0px 10px"}}>
                                                                 {item}                                                
                                                        </p>
                                                        )  
                                                    } )}
                                                  
                                                </div>
                                            ):(null)}
                                            {ActivityList.selectedActivity != null && ActivityList.selectedActivity.bookingQuestions.length != 0

                                                ? (
                                                
                                                <div>
                                                
                                                    <h4>Questions Answers:</h4>
                                                
                                                    <ol>
                                                
                                                        {_map(ActivityList.selectedActivity.bookingQuestions, (item, index) => {
                                                
                                                        return(
                                                
                                                        <li key={index} style={{display:"list-item",padding:"0",color:"black",width:"100%"}}>
                                                
                                                            {item.message} <b>?</b>
                                                
                                                            {ActivityList.selectedActivity.bookingQuestionAnswers.length != 0 &&
                                                
                                                            <p><b>Ans:</b> {" "} {answer[index].answer}
                                                
                                                            </p>
                                                
                                                            }
                                                
                                                        </li>
                                                
                                                        )
                                                
                                                        } )}
                                                
                                                    </ol>
                                                
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
                                                <span>{`${currencies[ActivityList.currencyCode].symbol}`}{ActivityList != null ? (ActivityList.fare) :("")}</span>
                                            </li>
                                        </ul>
                                        <button type="submit" onClick={() => this.bookingCancel(ActivityList)}
                                                className="searchBtn completebtn"> View
                                        </button>
                                        {/* {!ActivityList.isCancel &&
                                    <p className="text-danger"> Booking Cancelled
                                    </p>}*/}
                                        {/*TODO When Client Says .. enable View */}
                                        <button hidden={true} type="submit" disabled={!ActivityList.booking_status}
                                                onClick={() => this.bookingView(ActivityList)}
                                                className="searchBtn completebtn"> View
                                        </button>
                                        <div>
                                            <h6 onClick={this.divOpen}>Cancellation and reservation policy </h6>
                                            <h6>{ActivityList.response.data != null ? _get(ActivityList.response.data.itemSummaries,"merchantTermsAndConditions.termsAndConditions",'') :("")} </h6>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActivityTripCard));

