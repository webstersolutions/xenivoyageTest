import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import img_carLogo from '../../../asset/images/car/carlogo.png';
import img_carImg from '../../../asset/images/car/carImg.png';
import img_carUser from '../../../asset/images/dashboard/carUser.png';
import img_door from '../../../asset/images/dashboard/door.png';
import img_luggage from '../../../asset/images/dashboard/luggage.png';
import openNewTab from "../../../asset/images/dashboard/resize.png";
import img_info from '../../../asset/images/Important Information.svg';
import img_DateArrow from "../../../asset/images/Date Arrow.png";
import img_Time from "../../../asset/images/Time.svg";

import HotelBookingProtection from "../../presentational/HotelBookingProtection"

import { connect } from "react-redux";
import { carPrice, deletePaymentProps } from '../../../service/car/action';
import {sendingEmailDetails} from "../../../service/addCart/action";
import queryString from 'query-string';
import moment from 'moment';
import CarPayment from "../../presentational/CarPayment";

var currencies = require('country-data').currencies;

class CarConfirmContent extends Component {
	constructor() {
		super()
		this.state = {
			cancellationPolicyShow: true,
			allSelectedAddOns: ""
		}
	}
	componentDidMount() {
		const values = queryString.parse(this.props.location.search)

		this.setState({ cancellationPolicyShow: true, allSelectedAddOns: values.allSelectedAddOns })
		let sessionId;
		if (this.props.sessionId) {
			sessionId = this.props.sessionId
		} else {
			sessionId = values.sessionId
		}

		let email=null
        if(this.props.loginDetails){
          email=this.props.loginDetails.email
        }

		if (this.props.hasOwnProperty('paymentDetails')) {
			if (this.props.paymentDetails) {
				if (this.props.paymentDetails.hasOwnProperty("data") && this.props.paymentDetails.data == 'success') {


					//TO DO need to add delete props that ae came from the booking response.
					//this.props.deletePaymentProps()  
					this.props.history.push("/car/search" + this.props.location.search);
				} else if (this.props.paymentDetails.hasOwnProperty("error")) {
					//this.setState({ isModal: true });
				}
			}
		}

		if(this.props.carPricedetails && sessionStorage.getItem("carConfirmURL") !=""){
			
        }else{
            this.props.getPrice({
				email,
				sessionId: sessionId,
				rentalId: values.rentalId,
				currency: this.props.selectedCurrency
			})
        }

		sessionStorage.setItem("carConfirmURL", window.location.search);

//this part is ------> EMAIL DETAILS SENDING TO ITINERARY

if(this.props.carPricedetails != null){

	let emailDetails = this.props.carPricedetails;
//	 this.props.sendingEmailDetails(emailDetails);
}

		

	}
	componentWillReceiveProps(newProps) {
		if (this.props.location !== newProps.location) {
			//  this.getCarList(newProps.location);
		}
	}

	componentDidCatch(err, value) {

	}


	render() {

		const carResponse = this.props.carPricedetails;
		const { selectedCurrency } = this.props;
		const { carDropDate, carDropTime, carPickUpDate, carPickUpTime, driverAge, dropOffLocation, pickUpLocation
			,selectedPickupState, selectedDropState,selectedPickup,selectedDropoff } = queryString.parse(this.props.location.search)
		const selectedCurrencyVal = currencies[this.props.selectedCurrency].symbol;

		let curFormat = JSON.parse(localStorage.getItem("currency"));
        curFormat = curFormat.CURRENCY_FORMAT;
        let totAmount = carResponse && (+carResponse.pricedTotalFare);
		let taxFee = carResponse && (+carResponse.quotedTotalFare - +carResponse.pricedTotalFare);
		let totalFor = carResponse && (+carResponse.quotedTotalFare);
        if(totAmount != null){
            totAmount = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(totAmount.toFixed(2));
        }
        if(taxFee != null){
            taxFee = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(taxFee.toFixed(2));
		}
		
		if(totalFor != null){
			totalFor = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(totalFor.toFixed(2));
		}


		return (

			<div>
				{carResponse &&
					<div className="selectRoomBg d-flex flex-wrap">
						<div className="selectRoomTitle">
							<h4>Review & Confirm your reservation <img src={openNewTab} /></h4>
						</div>
						<div className="selectRoomItemsBg carSelRoom d-flex flex-row resWrap ">
							<div className="flex-column  carConfirmLeft">
								<div className="carConfirmImgDiv">
									<img src={carResponse.vendor.logo} className="carLogoWidth" />
									<div className="carImageOnly"><img src={carResponse.vehicle.images[0]} className="carImgWid" /></div>
								</div>
								<div className="confirmScreenPick">
									<ul className="pickupDropDet">
										<li>
											<h6>Pick-Up</h6>
											<p>{selectedPickup},{selectedPickupState}</p>
										</li>
										<li><h6>Hours of Operation</h6>
										{carResponse.rentalLocations[0].hasOwnProperty("hoursOfOperation") && carResponse.rentalLocations[0].hoursOfOperation[moment(carPickUpDate).day()]  ? <p>{moment(carResponse.rentalLocations[0].hoursOfOperation[moment(carPickUpDate).day()].workingHours[0].openTime, 'hh:mm').format("LT")} - {moment(carResponse.rentalLocations[0].hoursOfOperation[moment(carPickUpDate).day()].workingHours[0].closeTime, 'hh:mm').format("LT")}</p>:<p>Not operated</p>}
								     	</li>
										<li><h6>Shuttle to counter and car</h6>
											<p>Free shuttle to the rental car counter and car loacted off the airport</p>
										</li>
									</ul>
									<ul className="pickupDropDet">
										<li>
											<h6>Drop-Off</h6>
											<p>{selectedDropoff},{selectedDropState}</p>
										</li>
										<li><h6>Hours of Operation</h6>
										{carResponse.rentalLocations[0].hasOwnProperty("hoursOfOperation") && carResponse.rentalLocations[0].hoursOfOperation[moment(carDropDate).day()] ? <p>{moment(carResponse.rentalLocations[0].hoursOfOperation[moment(carDropDate).day()].workingHours[0].openTime, 'hh:mm').format("LT")} - {moment(carResponse.rentalLocations[0].hoursOfOperation[moment(carDropDate).day()].workingHours[0].closeTime, 'hh:mm').format("LT")}</p>:<p>Not operated</p>}
									</li>
									</ul>
								</div>
							</div>
							<div className="flex-column confirmRoomRight carConfirmRight">
								<div className="carInfo">
									<h4>{carResponse.vehicle.type}</h4>
									<h6> {carResponse.vehicle.name}</h6>

									<ul className="carInfraStru">
										<li>
											<img src={img_carUser} /> {carResponse.vehicle.passengerCapacity}
										</li>
										<li>
											<img src={img_door} /> -
																  </li>
										<li>
											<img src={img_luggage} /> {carResponse.vehicle.baggageCapacity}
										</li>
									</ul>
								</div>
								<p>Booked for {moment(carDropDate).diff(moment(carPickUpDate), 'days')} Days</p>
								<ul className="carCheckin">
									<li className="border"><h5>{moment(carPickUpDate).format('MMM DD')}</h5><p>{moment(carPickUpDate).format('dddd')}</p></li>
									<li><img src={img_DateArrow} /></li>
									<li className="border"><h5>{moment(carDropDate).format('MMM DD')} </h5><p>{moment(carDropDate).format('dddd')}</p></li>
								</ul>
								<ul className="checkInOut">
									<li><img src={img_Time} /><span>Pick Up<b>{moment(carPickUpTime, "hh:mm").format("LT")}</b></span></li>
									<li><img src={img_Time} /><span>Drop Off<b>{moment(carDropTime, "hh:mm").format("LT")}</b></span></li>
								</ul>
								<div className="carInfoDiv">
									<img src={img_info} />
									<p>Important Information about your rental</p>
									<div className="moreDetailToolTip">
										<p >{carResponse.vendor.policies.map((value, i) => {
											return (
												<div>
													<span><strong>{value.type}</strong></span> - <span >{value.text}</span>
													<br />
													<br />
												</div>
											)

										})}
										</p>
									</div>
								</div>
								{this.state.allSelectedAddOns && <p style={{ fontSize: '15px', marginBottom: '0px' }}> <b>Opted for</b></p>}
								<span>{this.state.allSelectedAddOns}</span>
							</div>
							<div className="flex-column confirmRoomRight carConfirmRight">

								<ul className="totalAmountDis">
									{/* 															
															{/* <li><span><b>ADD ON</b> GPS Navigational Device</span><span>{selectedCurrencyVal}60</span></li> */}
									{/* <li><span>Standard Room, 1 King</span> <span>{selectedCurrencyVal}150/night</span></li> */}
									
									<li><span>{moment(carDropDate).diff(moment(carPickUpDate), 'days')} days</span><span>{selectedCurrencyVal}&nbsp;{totAmount}</span> </li>
									<li><span>Taxes & Fees</span> <span>{selectedCurrencyVal}&nbsp;{taxFee}</span></li>
									<li><span>Total for {moment(carDropDate).diff(moment(carPickUpDate), 'days')} days</span> <span>{selectedCurrencyVal}&nbsp;{totalFor}</span></li>

								</ul>

								<h6>Reservation & Cancellation Policy  <i onClick={() => { this.setState({ cancellationPolicyShow: !this.state.cancellationPolicyShow }) }} className="fas fa-angle-double-down"></i></h6>
								{this.state.cancellationPolicyShow &&
									<p>{carResponse.carRental.cancellationPolicy.text}</p>}
								{/* <div className="mt-2">
															<button type="button" className="searchBtn addIteinary">Add to Itinerary</button>
															<button type="button" className="searchBtn continueBook">Continue Booking</button>
														</div> */}
							</div>

						</div>
					</div>
				}
				<div className="d-none otherSectionBg">
					<HotelBookingProtection type='car' />
				</div>

				<div className="d-flex flex-wrap otherSectionBg">
					<CarPayment />
				</div>
			</div>
		);
	}

}

const mapStateToProps = state => ({
	sessionId: state.carReducer.sessionId,
	carPricedetails: state.carReducer.carPrice,
	selectedCurrency: state.commonReducer.selectedCurrency,
	selectedCurrencyApi: state.carReducer.selectedCurrency,
	paymentDetails: state.carReducer.carBookingResult,
	loginDetails: state.loginReducer.loginDetails
});

const mapDispatchToProps = dispatch => ({
	getPrice: payloadInfo => dispatch(carPrice(payloadInfo)),
	deletePaymentProps: dispatch(deletePaymentProps(null)),
	sendingEmailDetails: payload => dispatch(sendingEmailDetails(payload))

})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CarConfirmContent));