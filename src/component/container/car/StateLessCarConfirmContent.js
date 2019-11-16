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
import queryString from 'query-string';
import moment from 'moment';
import CarPayment from "../../presentational/CarPayment";

import axios from "../../../Utils/request-process";
import URL from '../../../asset/configUrl';

import MultipleContext from '../../presentational/MultipleBooking/context'

class StateLessCarConfirmContent extends Component {
	constructor() {
		super()
		this.state = {
			cancellationPolicyShow: true,
            allSelectedAddOns: "",
            carPricedetails:null
		}
	}
	componentDidMount() {
		
		if(this.props.load){
			if(this.props.load.mount == true){
			  this.props.load.start()
			}
		}

		const { sessionId,rentalId }=this.props.queryValue
		
		let email=null
		if(this.props.loginDetails){
		  email=this.props.loginDetails.email
		}

        axios.post(URL.CAR_PRICE,{
			email,
			sessionId: sessionId,
			rentalId: rentalId,
			currency: this.props.itineryData.bookingData.currency
		})
        .then(response => {
			this.props.addData({...{bookingParameters:this.props.itineryData.searchString},...response.data})
            this.setState({
                carPricedetails:response.data
			})
			if(this.props.load){
				  this.props.load.stop()
			}
    }).catch(err=>{
		if(this.props.load){
			this.props.load.stop()
			if(this.props.errorCatch){
				this.props.errorCatch()
			 }
	  }
	});

	}
	componentWillReceiveProps(newProps) {
		if (this.props.location !== newProps.location) {
			//  this.getCarList(newProps.location);
		}
	}

	componentDidCatch(err, value) {

	}


	render() {

		const carResponse = this.state.carPricedetails;
		//const { selectedCurrency } = this.props;
		var currencies = require('country-data').currencies;
		let selectedCurrency=currencies[this.props.itineryData.bookingData.currency].symbol
			const { carDropDate, carDropTime, carPickUpDate,selectedDropoff,selectedPickup, carPickUpTime, driverAge, dropOffLocation, pickUpLocation } = this.props.queryValue;
			console.log("this.props.queryValue",this.props.queryValue)
		return  (
              <div>
				  	  <div className="selectRoomItemsBg " STYLE=""> <h6 STYLE="color:#464646">Itinerary item : {this.props.bookingSequence}</h6></div>
				{carResponse  &&
					<div className="selectRoomBg d-flex flex-wrap">
					
						{/* <div className="selectRoomTitle">
							<h4>Review & Confirm your reservation <img src={openNewTab} /></h4>
						</div> */}
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
											<p>{selectedPickup}</p>
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
											<p>{selectedDropoff}</p>
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
															<li><span><b>ADD ON</b> GPS Navigational Device</span><span>{selectedCurrency}60</span></li>
															<li><span>Standard Room, 1 King</span> <span>{selectedCurrency}150/night</span></li> */}
									<li><span>{moment(carDropDate).diff(moment(carPickUpDate), 'days')} days</span><span>{selectedCurrency} {+carResponse.pricedTotalFare}</span> </li>
									<li><span>Taxes & Fees</span> <span>{selectedCurrency} {(+carResponse.quotedTotalFare - +carResponse.pricedTotalFare).toFixed(2)}</span></li>
									<li><span>Total for {moment(carDropDate).diff(moment(carPickUpDate), 'days')} days</span> <span>{selectedCurrency} {+carResponse.quotedTotalFare}</span></li>
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
				{/* <div className="d-flex flex-wrap otherSectionBg">
					<HotelBookingProtection type='car' />
				</div>

				<div className="d-flex flex-wrap otherSectionBg">
					<CarPayment />
				</div> */}
		
				  </div>  
		)
	}

}

const mapStateToProps = state => ({
	selectedCurrency: state.commonReducer.selectedCurrency,
	loginDetails: state.loginReducer.loginDetails
});

const mapDispatchToProps = dispatch => ({

})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StateLessCarConfirmContent));