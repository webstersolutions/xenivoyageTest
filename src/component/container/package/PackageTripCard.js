import React, {Component} from 'react';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import img_calend from "../../../asset/images/dashboard/calend.png";
import img_print from "../../../asset/images/dashboard/print.png";

import img_plane from "../../../asset/images/plane.png";
import img_car from "../../../asset/images/car.png";
import img_transfer from "../../../asset/images/chauffeur.png";
import img_hotel from "../../../asset/images/hotel-building.png";
import img_activities from "../../../asset/images/activities.png";
import _get from 'lodash/get';

const _typeIcon = {hotel: img_hotel, car: img_car, flight: img_plane, transfer: img_transfer, activity: img_activities}

class CarTripCard extends Component {

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
        this.props.history.push(`/activityCancelBooking?distributorItemRef=${distributorItemRef}&distributorRef=${distributorRef}`);
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
        return ActivityList.response.data && (
            <React.Fragment>
                <tr id="divcontents" className={index % 2 ? "even" : "odd"} onClick={this.handleExpand}>
                    <td data-label="SI"><img src={_typeIcon["activity"]}/></td>
                    <td data-label="Xeniapp Booking Id">{ActivityList.distributorRef.substr(0, 6).toUpperCase()}</td>
                    <td data-label="Departs From">  {ActivityList.response.data.itemSummaries[0].departsFrom} </td>
                    <td data-label="departs Point"
                        dangerouslySetInnerHTML={{__html: ActivityList.response.data.itemSummaries[0].departurePoint}}>
                    </td>
                    <td data-label="Booking Date" width="80">{ActivityList.response.data.bookingDate}</td>
                    <td data-label="Travel Date"
                        width="80"> {ActivityList.response.data.itemSummaries[0].travelDate}</td>
                    <td data-label="Price"> {`${currencies[ActivityList.currencyCode].symbol}${ActivityList.fare}`}</td>
                    <td data-label="Booking Status">{ActivityList.booking_status ? "SUCCESS" : "CANCELLED"}</td>
                </tr>

                <tr className={isExpand ? 'collapseRow' : 'collapseRow collapse'}>
                    <td colSpan="10">
                        <div id="collapseOne" className="detailsShow" data-parent="#accordion">
                            <div className="d-flex flex-row resWrap">
                                <div className="flex-column confirmRoomLeft">
                                    <div className="carImgShow">
                                        {ActivityList.images && <img
                                            src={ActivityList.images[0].photoURL}
                                            className="carImg"/>}
                                    </div>
                                    <div className="flex-column"/>
                                </div>
                                <div className="flex-column confirmRoomRight hotelTrips">
                                    <div>

                                        <ul className="pickupDropDet">
                                            <li>
                                                <h6>Departure Point</h6>
                                                <p dangerouslySetInnerHTML={{__html: ActivityList.response.data.itemSummaries[0].departurePoint}}/>
                                            </li>

                                            <li>
                                                <h6>Departure Point Directions</h6>
                                                <p dangerouslySetInnerHTML={{__html: ActivityList.response.data.itemSummaries[0].departurePointDirections}}/>
                                            </li>
                                        </ul>
                                        <ul>
                                            <li className="border mr-2">
                                                <h6>Travel Date</h6>
                                                <p>{ActivityList.response.data.itemSummaries[0].travelDate}</p>
                                            </li>

                                            <li className="border ml-2">
                                                <h6>Starting Time</h6>
                                                <p>{ActivityList.response.data.itemSummaries[0].startingTime}</p>
                                            </li>
                                        </ul>
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
                                            <span>{`${currencies[ActivityList.currencyCode].symbol}${ActivityList.fare}`}</span>
                                        </li>
                                    </ul>
                                    <button type="submit" disabled={!ActivityList.refund}
                                            onClick={() => this.bookingCancel(ActivityList)}
                                            className="searchBtn completebtn"> Cancel
                                    </button>
                                    <div>
                                        <h6 onClick={this.divOpen}>Cancellation and reservation policy </h6>
                                        <h6> {_get(ActivityList.response.data.itemSummaries,"merchantTermsAndConditions.termsAndConditions",'')} </h6>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CarTripCard));

