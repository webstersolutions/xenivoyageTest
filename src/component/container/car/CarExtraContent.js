import React, {Component} from "react";
import {withRouter} from 'react-router-dom';
import {Switch, Route} from 'react-router-dom';
import img_carLogo from '../../../asset/images/car/carlogo.png';
import img_carImg from '../../../asset/images/car/carImg.png';
import img_carUser from '../../../asset/images/dashboard/carUser.png';
import img_door from '../../../asset/images/dashboard/door.png';
import img_luggage from '../../../asset/images/dashboard/luggage.png';
import openNewTab from "../../../asset/images/dashboard/resize.png";
import img_info from '../../../asset/images/Important Information.svg'

import img_drag from '../../../asset/images/selectRoom/drag.png';

import {connect} from "react-redux";
import {carPrice} from '../../../service/car/action';
import queryString from 'query-string';
import moment from 'moment';

import { addItinerary } from "../../../service/addCart/action";
import {
    loadingGifSearch,
    stopGifSearching
  } from "../../../service/common/action";

import {
    DragSource,
    ConnectDragSource,
    DragSourceConnector,
    DragSourceMonitor,
} from 'react-dnd';
import {sumBy as _sumBy, map as _map, find as _find} from 'lodash'

var currencies = require('country-data').currencies;

class CarExtraContent extends Component {

    reserveHandle = () => {
        sessionStorage.setItem("carConfirmURL", "");
        let queryStringlocal = queryString.parse(this.props.location.search)
        this.props.history.push('/car/confirm?' + queryString.stringify({
            ...queryStringlocal,
            allSelectedAddOns: this.state.allSelectedAddOns.toString()
        }));
    }

    constructor() {
        super()
        this.state = {
            allSelectedAddOns: []
        }
    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search)
        let sessionId;
        console.log("")
        let email = null
        if (this.props.loginDetails) {
            email = this.props.loginDetails.email
        }

        if (this.props.sessionId) {
            sessionId = this.props.sessionId
        } else {
            sessionId = values.sessionId
        }


        if (this.props.carPricedetails && sessionStorage.getItem("carExtraURL") != "") {

        } else {
            this.props.getPrice({
                email,
                sessionId: sessionId,
                rentalId: values.rentalId,
                currency: this.props.selectedCurrency,
            })
        }
        sessionStorage.setItem("carExtraURL", window.location.search);
        this.getCarDetailsExists()


    }

    getCarDetailsExists = () => {

    }

    componentWillReceiveProps(newProps) {
        if (this.props.selectedCurrency != newProps.selectedCurrency) {
            const values = queryString.parse(
                this.props.location.search
            );
            let sessionId;

            let email = null;
            if (this.props.loginDetails) {
                email = this.props.loginDetails.email;
            }

            if (this.props.sessionId) {
                sessionId = this.props.sessionId;
            } else {
                sessionId = values.sessionId;
            }

            this.props.getPrice({
                email,
                sessionId: sessionId,
                rentalId: values.rentalId,
                currency: newProps.selectedCurrency
            });
            //  this.getPrice(newProps.location);
        }
    }

    mobileItinerary = () => {
        this.props.loadingGifSearch();
        const {carPricedetails} = this.props;
        const payload = {
            type: "car",
            price: +carPricedetails.quotedTotalFare,
            title: carPricedetails.vehicle.name,
            subtitle: carPricedetails.vehicle.type,
            currency: carPricedetails.currency,
            bookingData: {...carPricedetails, ...queryString.parse(this.props.location.search)},
            searchString: queryString.parse(this.props.location.search)
        };
        this.props.stopGifSearching();
        this.props.addToItinerary(payload)
    }


    render() {

        const carResponse = this.props.carPricedetails;
        const {selectedCurrency} = this.props
        const {carDropDate, carDropTime, carPickUpDate, carPickUpTime, driverAge, selectedPickupState, selectedDropState, selectedPickup, selectedDropoff} = queryString.parse(this.props.location.search)
        const selectedCurrencyVal = currencies[this.props.selectedCurrencyApi].symbol;
        const {connectDragSource} = this.props;
        let curFormat = JSON.parse(localStorage.getItem("currency"));
        curFormat = curFormat.CURRENCY_FORMAT;
        let quotedTotalFare = carResponse && carResponse.quotedTotalFare;
        let quotedTotalFarePerDay = carResponse && (+carResponse.quotedTotalFare / moment(carDropDate).diff(moment(carPickUpDate), 'days'));
        if (quotedTotalFare != null) {
            quotedTotalFare = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(quotedTotalFare.toFixed(2));
        }
        if (quotedTotalFarePerDay != null) {
            quotedTotalFarePerDay = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(quotedTotalFarePerDay.toFixed(2));
        }
        let pickUpHoursOp;
        let dropOffHoursOp;
        if (carResponse !== null) {
            const carPickUpDay = moment(carPickUpDate, 'YYYY-MM-DD').format('ddd');
            const carDropOffDay = moment(carDropDate, 'YYYY-MM-DD').format('ddd');
            pickUpHoursOp = carResponse.rentalLocations[0].hasOwnProperty("hoursOfOperation")
                ? _find(carResponse.rentalLocations[0].hoursOfOperation, op => op.dayOfWeek === carPickUpDay)
                : null;
            dropOffHoursOp = carResponse.rentalLocations[0].hasOwnProperty("hoursOfOperation")
                ? _find(carResponse.rentalLocations[0].hoursOfOperation, op => op.dayOfWeek === carDropOffDay)
                : null;
        }

        return connectDragSource(
            <div>
                {carResponse &&
                <div className="selectRoomBg d-flex flex-wrap">
                    <div className="selectRoomTitle">
                        <h4>Select Extras <img src={openNewTab}/></h4>
                    </div>
                    <div className="selectRoomItemsBg carSelRoom">
                        <div className="d-flex flex-row smallColumn  carCard">
                            <div className="flex-column carImgDiv align-self-center">
                                <img src={carResponse.vendor.logo} alt="No image" className="carLogoWidth"/>
                                <div className="carImageOnly"><img src={carResponse.vehicle.images[0]}
                                                                   className="carImgWid"/></div>
                                <div className="carInfoDiv">
                                    <img src={img_info}/>
                                    <p> Important Information about your rental</p>
                                    <div className="moreDetailToolTip">
                                        <React.Fragment> {carResponse.vendor.policies.map((value, i) => {
                                            return (
                                                <React.Fragment>
                                                    <p><strong>{value.type}</strong> - {value.text}</p>
                                                </React.Fragment>
                                            )
                                        })}
                                        </React.Fragment>
                                    </div>
                                </div>
                            </div>

                            <div className="detailsBg flex-column carInfo">

                                <h4>{carResponse.vehicle.type}</h4>
                                <h6> {carResponse.vehicle.name}</h6>
                                <ul className="carInfraStru">
                                    <li>
                                        <img src={img_carUser}/> {carResponse.vehicle.passengerCapacity}
                                    </li>
                                    <li>
                                        <img src={img_door}/> -
                                    </li>
                                    <li>
                                        <img src={img_luggage}/> {carResponse.vehicle.baggageCapacity}
                                    </li>
                                </ul>

                                <ul className="pickupDropDet">

                                    <li>
                                        <h6>Pick-Up</h6>
                                        <p>{selectedPickup}</p>
                                    </li>
                                    <li><h6>Hours of Operation</h6>
                                        <p>{pickUpHoursOp ? pickUpHoursOp.workingHours[0].openTime : 'Not operated'}- {pickUpHoursOp ? pickUpHoursOp.workingHours[0].closeTime : 'Not operated'}</p>
                                    </li>
                                    <li><h6>Shuttle to counter and car</h6>
                                        <p>Free shuttle to the rental car counter and car located off the airport</p>
                                    </li>

                                </ul>

                                <ul className="pickupDropDet">
                                    <li>
                                        <h6>Drop-Off</h6>
                                        <p>{selectedDropoff}</p>
                                    </li>
                                    <li><h6>Hours of Operation</h6>
                                        <p>{dropOffHoursOp ? dropOffHoursOp.workingHours[0].openTime : 'Not operated'} - {dropOffHoursOp ? dropOffHoursOp.workingHours[0].closeTime : 'Not operated'}</p>
                                    </li>
                                </ul>
                            </div>

                            <div className="rateShowDiv flex-column">

                                <div className="priceDiv">
                                    {/* <strike>{selectedCurrencyVal}36</strike> */}
                                    {/* <h2>{selectedCurrencyVal}25</h2> */}
                                    {<h2>{selectedCurrencyVal}&nbsp;{quotedTotalFarePerDay}</h2>}

                                    <p>per day</p>
                                </div>
                                <p className="totalAmt">Total : {selectedCurrencyVal}{quotedTotalFare}</p>

                                <div className="dragAndDrop"><img src={img_drag}/>
                                    <span>Drag and Drop</span>
                                </div>
                                
                            </div>
                            <div className="add-to-itinerary">
                                <button onClick={this.mobileItinerary}>ADD TO ITINERARY</button>
                            </div>
                        </div>

                        <div className="accessoriesCarDetails">
                            <p><b>Accessories </b>(Accessories are available at additional cost, requests are subject to
                                availability)</p>
                            <div className="d-flex flex-row smallColumn ">
                                <div className='flex-column accessItems'>
                                    <ul>
                                        {new Array("GPS", "Ski Rack", "Infant Seat", "Toddler Seat").map((value, i) => {
                                            return (
                                                <li><span className="checkText">{value}</span> <span
                                                    className="checkYesorNo"><span>No</span><input type="checkbox"
                                                                                                   name={value}
                                                                                                   onChange={(e) => {
                                                                                                       let allAddons = this.state.allSelectedAddOns
                                                                                                       if (allAddons.includes(value)) {
                                                                                                           allAddons.splice(allAddons.indexOf(value), 1)
                                                                                                       } else {
                                                                                                           allAddons.push(value)
                                                                                                       }
                                                                                                       this.setState({
                                                                                                           allSelectedAddOns: allAddons
                                                                                                       })
                                                                                                   }}
                                                                                                   id={"switch" + i}/><label
                                                    for={"switch" + i}></label><span>Yes</span></span></li>
                                            )
                                        })}

                                    </ul>
                                </div>
                                <div className='flex-column accessItems'>
                                    <ul>
                                        {new Array("Additional Driver", "Snow tries", "E-Zpass", "Collision Damage Coverage").map((value, i) => {
                                            return (
                                                <li><span className="checkText">{value}</span> <span
                                                    className="checkYesorNo"><span>No</span><input name={value}
                                                                                                   type="checkbox"
                                                                                                   onChange={(e) => {

                                                                                                       let allAddons = this.state.allSelectedAddOns
                                                                                                       if (allAddons.includes(value)) {
                                                                                                           allAddons.splice(allAddons.indexOf(value), 1)
                                                                                                       } else {
                                                                                                           allAddons.push(value)
                                                                                                       }
                                                                                                       this.setState({
                                                                                                           allSelectedAddOns: allAddons
                                                                                                       })
                                                                                                   }}
                                                                                                   id={"switcht" + i}/><label
                                                    for={"switcht" + i}></label><span>Yes</span></span></li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <button type="button" className="selectRoomBtn reserveBtn" onClick={this.reserveHandle}>BOOK
                                NOW
                            </button>
                        </div>
                    </div>
                </div>}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    sessionId: state.carReducer.sessionId,
    selectedCurrency: state.commonReducer.selectedCurrency,
    selectedCurrencyApi: state.carReducer.selectedCurrency,
    carPricedetails: state.carReducer.carPrice,
    loginDetails: state.loginReducer.loginDetails
});

const mapDispatchToProps = dispatch => ({
    getPrice: payloadInfo => dispatch(carPrice(payloadInfo)),
    addToItinerary: itPay => dispatch(addItinerary(itPay)),
    loadingGifSearch: () => dispatch(loadingGifSearch()),
    stopGifSearching: () => dispatch(stopGifSearching())
})


const __itemSource = {
    canDrag(props) {
        // You can disallow drag based on props
        //   return !_includes(_map(props.itineraryList, 'refId'),
        //     props.refId);
        return true;
    },
    beginDrag(props) {
        const {carPricedetails} = props;
        return {
            type: "car",
            price: +carPricedetails.quotedTotalFare,
            title: carPricedetails.vehicle.name,
            subtitle: carPricedetails.vehicle.type,
            currency: carPricedetails.currency,
            bookingData: {...carPricedetails, ...queryString.parse(props.location.search)},
            searchString: queryString.parse(props.location.search)
        };
    },
    endDrag(props, monitor, component) {
        if (!monitor.didDrop()) {
            // You can check whether the drop was successful
            // or if the drag ended but nobody handled the drop
            return;
        }
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();


    }
}

const __collect = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DragSource('ROOM', __itemSource, __collect)(CarExtraContent)))
