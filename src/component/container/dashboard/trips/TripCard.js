import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import { sumBy as _sumBy, map as _map } from 'lodash'
import moment from "moment";

import { getRefundAmount, getCancelInfo, cancelRouteReset } from '../../../../service/dashboard/action';

import ImageCarousel from "../../../presentational/ImageCarousel";
import Dashboard from "../../../../view/dashboard";
import MainContainer from "../../../container/mainPage/MainContainer"
import DBTrips from "../../../container/dashboard/DBTrips"
// E:\xeni_react_rebo\xeniapp-ui\src\view\dashboard.js

//E:\xeni_react_rebo\xeniapp-ui\src\view\MainPage.js

import { RawHtmlToJSON } from '../../../presentational/RawHtmlToJSON';
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
var currencies = require("country-data").currencies;



const _typeIcon = { hotel: img_hotel, car: img_car, flight: img_plane }

class TripCard extends Component {

    state = {
        isExpand: false,
        isExpendDiv: true,
        isCancellation: false,
        isCancelBook: false,
        isHideDiv: false

    }

    componentDidMount() {
        this.props.cancelRouteReset()
    }

    componentWillReceiveProps(nextProps) {
        const { cancelledState } = nextProps;
        if (cancelledState === 'success') {
            this.props.history.push("/cancelBooking");
        }

    }

    handleExpand = (event) => {
        event.preventDefault();
        this.setState({ isExpand: !this.state.isExpand })
    }

    divOpen = () => {
        this.setState({ isExpendDiv: !this.state.isExpendDiv })
    }

    print = () => {
        var content = document.getElementById("accordion");
        var pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
    }

    bookingCancel = (flag, cancelInfo) => {
        if (flag === true) {
            if (cancelInfo.refundability === "Refundable") {

                const payload = {
                    "bookingId": cancelInfo.bookingId,
                    "email": this.props.loginDetails.email
                }

                this.props.getRefundAmount(payload);
                this.props.getCancelInfo(cancelInfo);
                // this.props.history.push("/cancelBooking");


            } else if (cancelInfo.refundability === "NonRefundable") {
                const payload = {
                    "bookingId": cancelInfo.bookingId,
                    "email": this.props.loginDetails.email
                }

                this.props.getRefundAmount(payload);
                this.props.getCancelInfo(cancelInfo);
                // this.props.history.push("/cancelBooking");

            }
        }


    }


    render() {
        const { isHideDiv } = this.state;
        const { selectedCurrency } = this.props;
        return (
            <React.Fragment>
                {this.renderCard()}
            </React.Fragment>

        );
    }

    renderCard = () => {

        const { type, rate, index, TransList, rmvHtmlFunc, refundList, selectedCurrency } = this.props;

        // const roomName = TransList.rooms_info[0].length && TransList.rooms_info[0].name;
        let roomName;
        if (TransList.hasOwnProperty("rooms_info[0]")) {
            roomName = TransList.rooms_info[0].name;
        }

        const baseFare = TransList.amtAfterdiscount;
        const tax_fee = TransList.totalAmount  -  TransList.amtAfterdiscount;
        const totalAmount = TransList.totalAmount;
        const { isExpand, isExpendDiv } = this.state;
        var noOfNights = moment(TransList.stayPeriod.end).diff(moment(TransList.stayPeriod.start), 'days');
       
        let roomDesc = [];
        if (TransList.rooms_info[0].hasOwnProperty("desc")) {
            roomDesc = TransList.rooms_info[0].desc.split("<p>");
        }
        const selectedCurrencyVal = currencies[TransList.fareBreakup.currency].symbol;
        switch (type) {
            case 'hotel':
                    let curFormat = JSON.parse(localStorage.getItem("currency"));
                    curFormat = curFormat.CURRENCY_FORMAT;
                    let totAmount = parseFloat(TransList.totalAmount);
                    totAmount = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(totAmount.toFixed(2));
                    let baseFarePrice = TransList.hasOwnProperty("fareBreakup") && parseFloat(baseFare);
                    baseFarePrice = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(baseFarePrice.toFixed(2));
                    let taxFee = TransList.hasOwnProperty("fareBreakup") && parseFloat(tax_fee);
                    taxFee = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(taxFee.toFixed(2));
                    let totalAmt = TransList.hasOwnProperty("fareBreakup") && parseFloat(totalAmount);
                    totalAmt = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(totalAmt.toFixed(2));
    
                return (

                    <React.Fragment >

                        <iframe id="ifmcontentstoprint"  style={{height:'0px' , width:'0px',position:"Absolute"}}></iframe>
                     
                        <tr id="divcontents" className={index % 2 ? "even" : "odd"} onClick={this.handleExpand}>
                            <td data-label="SI"><img src={_typeIcon[type]} alt={type} /></td>
                            <td data-label="Title">{TransList.hotel_address.name}</td>

                            <td data-label="Location">  {TransList.hotel_address.contact.address.city.name}  </td>
                            <td data-label="Date Booked">{moment(TransList.date_booked).format('MM/DD/YYYY')}</td>
                            <td data-label="Travel Date">{moment(TransList.stayPeriod.start).format('MM/DD/YYYY') }  <img src={img_Date} alt='date' />  { moment(TransList.stayPeriod.end).format('MM/DD/YYYY')}</td>
                            <td data-label="Price">{selectedCurrencyVal} {totAmount}</td>

                            <td data-label="Booking Id">{TransList.bookingId}</td>
                            {/* <td data-label="Co-relation Id">{TransList.correlationId}</td> */}
                            <td data-label="Cancellation Id">{TransList.cancellationId}&nbsp;</td>
                            <td data-label="Booking Status">{TransList.bookingStatus}</td>

                            {/* <td> <button type="submit" className="primary" onClick= { () =>this.props.onCancel(TransList)}>  </button> </td> */}
                        </tr>

                        <tr className={isExpand ? 'collapseRow' : 'collapseRow collapse'}>
                            <td colSpan="10">
                                <div id="collapseOne" className="detailsShow" data-parent="#accordion" >
                                    <div className="d-flex flex-row resWrap">
                                        <div className="flex-column confirmRoomLeft">
                                            <img className="imgWidthDashboard" src={TransList.hotel_images[0] && TransList.hotel_images[0].URL} alt="No images available" style={{ width: "265px" }} />
                                            {/* {TransList.hotel_images.length ? (
                        <ImageCarousel
                            imageList={_map(TransList.hotel_images, each => ({
                                 url: each.URL
                            }))}
                        />
                    ) : (
                            <ImageCarousel />
                        )} */}

                                            <div className="flex-column">
                                                <ul>

                                                    {roomDesc.length > 0 && roomDesc[1] ? <li><img style={{ width: '18px' }} src={img_extrabed} alt="" /> &nbsp;<p>{rmvHtmlFunc(roomDesc[1])}</p></li> : null}
                                                    {TransList.refundability === 'Refundable' ?
                                                        <React.Fragment>
                                                            <li><img style={{ width: '20px' }} src={img_tick} alt="" /> <p>Free Cancellation till {moment(TransList.cancellationPolicy.penaltyRules[0].window.start).format('MM/DD/YYYY')}</p> </li>  <p style={{ marginLeft: "30px" }}>{TransList.refundability}</p>
                                                        </React.Fragment> : <li> <img style={{ width: '18px' }} src={img_close} alt="" /> <p> Non Refundable </p></li>
                                                    }
                                                    {TransList.rooms_info[0].smokingIndicator ? TransList.rooms_info[0].smokingIndicator !== 'Unknown' ?
                                                        <li><img style={{ width: '18px' }} src={img_noSmoke} alt="" /> &nbsp;<p>{TransList.rooms_info[0].smokingIndicator}</p></li>
                                                        : <li><img style={{ width: '18px' }} src={img_noSmoke} alt="" /> &nbsp;<p>Smoking/ Non Smoking</p></li> : null}

                                                    {roomDesc.length > 0 ? <li><img style={{ width: '18px' }} src={img_hotel} alt="" /> &nbsp;<p>{rmvHtmlFunc(roomDesc[3])}</p></li> : null}
                                                    {roomDesc.length > 0 ? <li><img style={{ width: '18px' }} src={img_television} alt="" /> &nbsp;<p>{rmvHtmlFunc(roomDesc[4])}</p></li> : null}
                                                </ul>

                                                {/* <ul>
                               
                                {TransList.rooms_info ? <React.Fragment>
                                    <li><img style={{ width: '18px' }} src={img_hotcoffee} alt="" />&nbsp; <p>{rate.boardBasis.desc}</p> </li></React.Fragment> :
                                    <li><img style={{ width: '18px' }} src={img_extrabed} alt="" /> &nbsp;<p>Room Only</p></li>}
                                {rate.inclusions ? _map(rate.inclusions, (each, i) => {
                                    return (
                                        <li key={i}><img style={{ width: '18px' }} src={img_signal} alt="" /> &nbsp;<p>{each}</p></li>
                                    )
                                }) : roomDescription[5] ? <li><img style={{ width: '18px' }} src={img_hotel} alt="" /> &nbsp;<p>{rmvHtmlFunc(roomDescription[5])}</p></li> : null}
                            </ul> */}

                                            </div>
                                        </div>
                                        <div className="flex-column confirmRoomRight hotelTrips">
                                            <div>
                                                <h4>{TransList.hotel_address.name}</h4>
                                                <h4>{roomName} </h4>


                                                <span>{TransList.rooms_info[0].name} Booking for {noOfNights} Nights</span>
                                                <ul>
                                                    <li className="border">
                                                        <h5>
                                                            {moment(TransList.stayPeriod.start)
                                                                .format("MMM DD")
                                                                .toUpperCase()}
                                                        </h5>
                                                        <p>{moment(TransList.stayPeriod.start).format("dddd")}</p>
                                                    </li>
                                                    <li>
                                                        <img src={img_DateArrow} />
                                                    </li>
                                                    <li className="border">
                                                        <h5>
                                                            {moment(TransList.stayPeriod.end)
                                                                .format("MMM DD")
                                                                .toUpperCase()}
                                                        </h5>
                                                        <p>{moment(TransList.stayPeriod.end).format("dddd")}</p>
                                                    </li>
                                                </ul>
                                                <ul className="checkInOut">
                                                    <li>
                                                        <img  className="timeWidthDahboard" src={img_Time}/>
                                                        <span>
                                                            Check In{" "}
                                                            <b>
                                                                {TransList.checkinCheckoutPolicy.length && TransList.checkinCheckoutPolicy[0] && TransList.checkinCheckoutPolicy[0].inTime
                                                                    ? TransList.checkinCheckoutPolicy[0].inTime + 0
                                                                    : "12.00am"}
                                                            </b>
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <img className="timeWidthDahboard1" src={img_Time} />
                                                        <span>
                                                            Check Out{" "}
                                                            <b>
                                                                {TransList.checkinCheckoutPolicy.length && TransList.checkinCheckoutPolicy[0] && TransList.checkinCheckoutPolicy[0].outTime
                                                                    ? TransList.checkinCheckoutPolicy[0].outTime + 0
                                                                    : "06.00pm"}
                                                            </b>
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                            {TransList.rooms && <div className="paddingDashboard" style={{textAlign: "left", padding: "14px"}}>
                                                <div  style={{padding: "5px 0"}}>
                                                <span style={{fontSize: "14px", fontWeight: "bold"}}>Guest First Name: </span>
                                                <span style={{fontSize: "14px", fontWeight: "normal"}}>{TransList.rooms[0].guests[0].name.first}</span>
                                                </div>
                                                <div style={{padding: "5px 0"}}>
                                                <span style={{fontSize: "14px", fontWeight: "bold"}}>Guest Last Name: </span>
                                                <span style={{fontSize: "14px", fontWeight: "normal"}}>{TransList.rooms[0].guests[0].name.last}</span>
                                                </div>
                                                <div style={{padding: "5px 0"}}>
                                                <span style={{fontSize: "14px", fontWeight: "bold"}}>No of Guests: </span>
                                                <span style={{fontSize: "14px", fontWeight: "normal"}}>{TransList.rooms[0].guests.length}</span>
                                                </div>
                                            </div>}
                                            
                                        </div>
                                        <div className="flex-column priceDetails hotelTrips">
                                            <div className="d-flex justify-content-between OtherOptions">
                                                {/*  <div>
                                       <ReactToPrint
                                            trigger={() => <a><img src={img_print} /></a>}
                                            content={() => this.renderCard()}
                                        /> 
                                          {<ComponentToPrint ref={el => (this.componentRef = el)} />}
                                         </div>*/}

                                                <div> <a onClick={this.print}><img src={img_print} /> </a>
                                                {/* <a><img src={img_socialClick} /></a></div> */} </div>
                                                {/* <div className="calenderView"><a><img src={img_calend} /></a></div> */}

                                            </div>
                                            {TransList.hasOwnProperty("fareBreakup") &&
                                                <ul className="totalAmountDis">
                                                    <li><span>Base Fare</span> <span>{selectedCurrencyVal} {baseFarePrice}</span></li>
                                                    <li><span>Taxes &amp; Fees</span> <span>{selectedCurrencyVal}{taxFee}</span></li>
                                                    <li><span>Total Cost</span> <span>{selectedCurrencyVal} {totalAmt}</span></li>

                                                </ul>
                                            }
                                            <div className="">
                                                {/* <button type="submit" className="searchBtn">Reschedule</button> */}
                                                {/* <button type="submit" className="searchBtn completebtn"   onClick={() => this.bookingCancel(true,TransList)}> new Date() > TransList.travel_date  Cancel</button> */}
                                                {/* {TransList.bookingStatus !== "Cancelled" &&  TransList.refundability !== "NonRefundable" && new Date() > TransList.travel_date  && <button type="submit" className="searchBtn completebtn"  onClick={() => this.bookingCancel(true,TransList)}> Cancel</button>}  */}

                                                {TransList.bookingStatus !== "Cancelled" && TransList.refundability !== "NonRefundable" && <button type="submit" className="searchBtn completebtn" onClick={() => this.bookingCancel(true, TransList)}> Cancel</button>}


                                            </div>
                                            <div>

                                                <h6 onClick={this.divOpen}> Cancellation and reservation policy <i style={{ cursor: 'pointer' }} className="fas fa-angle-double-down" /></h6>

                                                {isExpendDiv && isExpendDiv === true ? <p>{TransList.cancellationPolicy.text}</p> : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </td>
                        </tr>
                       
                    </React.Fragment>


                );

            default:
                return (
                    <React.Fragment>
                        {/* <tr className={index % 2 ? "even" : "odd"} onClick={this.handleExpand}>
                            <td><img src={_typeIcon[type]} alt={type} /></td>
                            <td>abcd</td>
                            <td>abcd </td>
                            <td>10/02/2018</td>
                            <td>10/02/2018 <img src={img_Date} alt='date' /> 10/26/2018</td>
                            <td>$000</td>
                        </tr> */}

                        {/* <tr className={isExpand ? 'collapseRow' : 'collapseRow collapse'}>
                            <td colSpan="6">
                                <div id="collapseOne" className="detailsShow" data-parent="#accordion" >
                                    <div className="d-flex flex-row">
                                        <div className="flex-column flightDetails borderRight">
                                            <h6>Your Airline Flight</h6>
                                            <p><img src={img_Airlines} /> Delta Airline</p>
                                            <ul className="">
                                                <li>
                                                    <img src={img_Departure} className="flightIcon" />
                                                    <img src={img_Time} className="clockIcon" />
                                                </li>
                                                <li>
                                                    <span className="flightDate">Fri, Oct 17</span>
                                                    <span className="flighTime">
                                                        5.36pm <p>Stewart int (SWL)</p>
                                                    </span>
                                                </li>
                                                <li><img src={img_Date} className="arrowDivied" /></li>
                                                <li>
                                                    <span className="flightRunTime"><p>(1 stop)</p> 5h 52m</span>
                                                    <span className="flighTime">
                                                        10.19pm <p>Stewart int (SWL)</p>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="flex-column flightDetails borderRight">
                                            <h6>Your Returning Flight</h6>
                                            <p><img src={img_Airlines} /> United Airline</p>
                                            <ul className="">
                                                <li>
                                                    <img src={img_Arrival} className="flightIcon" />
                                                    <img src={img_Time} className="clockIcon" />
                                                </li>
                                                <li>
                                                    <span className="flightDate">Fri, Oct 17</span>
                                                    <span className="flighTime">
                                                        5.36pm <p>Stewart int (SWL)</p>
                                                    </span>
                                                </li>
                                                <li><img src={img_Date} className="arrowDivied" /></li>
                                                <li>
                                                    <span className="flightRunTime"><p>(1 stop)</p> 5h 52m</span>
                                                    <span className="flighTime">
                                                        10.19pm <p>Stewart int (SWL)</p>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="flex-column priceDetails">
                                            <div className="d-flex justify-content-between OtherOptions">
                                                <div ><a><img src={img_print} /></a><a><img src={img_socialClick} /></a></div>
                                                <div className="calenderView"><a><img src={img_calend} /></a></div>
                                                <ul className="socialShare">
                                                    <li><img src={img_gmail} /></li>
                                                    <li><img src={img_whatsapp} /></li>
                                                    <li><img src={img_google} /></li>
                                                    <li><img src={img_google} /></li>
                                                </ul>
                                            </div>
                                            <ul className="totalAmountDis">
                                                <li><span>Price Per person</span> <span>$214</span></li>
                                                <li><span>Passengers</span> <span>2</span></li>
                                                <li><span>Taxes &amp; Fees</span> <span>$22.00</span></li>
                                                <li><span>Total Cost</span> <span>$1225.45</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr> */}
                    </React.Fragment >
                );
        }

    }
}

const mapStateToProps = state => ({
    loginDetails: state.loginReducer.loginDetails,
    refundList: state.dashboardReducer.refundList,
    selectedCurrency: state.commonReducer.selectedCurrency,
    cancelledState: state.dashboardReducer.cancelledState

});

const mapDispatchToProps = dispatch => ({
    getRefundAmount: (data) => dispatch(getRefundAmount(data)),
    getCancelInfo: (data) => dispatch(getCancelInfo(data)),
    cancelRouteReset: () => dispatch(cancelRouteReset())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TripCard));

