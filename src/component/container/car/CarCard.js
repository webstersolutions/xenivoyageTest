import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import img_car from '../../../asset/images/car/carImg.png';
import img_logo from '../../../asset/images/car/carlogo.png';
import img_carUSer from '../../../asset/images/dashboard/carUser.png'
import img_carDoor from '../../../asset/images/dashboard/door.png'
import img_carLuggage from '../../../asset/images/dashboard/luggage.png';
import queryString from 'query-string';
import moment from 'moment';

var currencies = require('country-data').currencies;

class CarCard extends Component {

	carCardSelect = () => {
		sessionStorage.setItem("carExtraURL", "");
		sessionStorage.setItem("carConfirmURL", "");
		this.props.history.push('/car/extra?' + queryString.stringify({
			...this.props.searchDetails,
			rentalId: this.props.rentalId,
			sessionId: this.props.sessionId,
			selectedCurrency:this.props.selectedCurrency,
			selectedPickup:this.props.rentalLocations.pickup[0].contactInfo.address.line1+", "+ this.props.rentalLocations.pickup[0].contactInfo.address.city.name +", "+this.props.rentalLocations.pickup[0].contactInfo.address.state.code+" - "+this.props.rentalLocations.pickup[0].contactInfo.address.countryCode+", "+this.props.rentalLocations.pickup[0].contactInfo.address.postalCode,
			selectedPickupState:this.props.rentalLocations.pickup[0].contactInfo.address.state.code,
			selectedDropState:this.props.rentalLocations.drop[0].contactInfo.address.state.code,
			selectedDropoff:this.props.rentalLocations.drop[0].contactInfo.address.line1+", "+ this.props.rentalLocations.drop[0].contactInfo.address.city.name+", "+this.props.rentalLocations.drop[0].contactInfo.address.state.code+" - "+this.props.rentalLocations.drop[0].contactInfo.address.countryCode+", "+this.props.rentalLocations.drop[0].contactInfo.address.postalCode

		}));
	}

	render() {

		const { carDropDate, carDropTime, carPickUpDate, carPickUpTime, driverAge, dropOffLocation, pickUpLocation } = queryString.parse(this.props.location.search)
		const { selectedCurrency } = this.props;
		const totalFare = this.props.carRentals.fare.displayFare.totalFare;
		const selectedCurrencyVal = currencies[this.props.selectedCurrency].symbol;  
		// console.log("rentalLocations",this.props.rentalLocations.drop[0].contactInfo.address.line1)

		let curFormat = JSON.parse(localStorage.getItem("currency"));
    	curFormat = curFormat.CURRENCY_FORMAT;
		let totFare = (+totalFare / moment(carDropDate).diff(moment(carPickUpDate), 'days'));
		totFare = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(totFare.toFixed(2));
		let fullTotFare = totalFare;
		fullTotFare = new Intl.NumberFormat(curFormat, { minimumFractionDigits: 2 }).format(fullTotFare.toFixed(2));

		return (
			<div className="sectionCard carCard">
				<div className="d-flex flex-row smallColumn">
					<div className="flex-column carImgDiv align-self-center">
						{this.props.carDetails.images && this.props.carDetails.images.length != 0 ?
							<img src={this.props.carDetails.images[0]} className="carImgWid" /> : <img src={""} alt="no Room Available" className="carLogoWidth" />}
						<img src={this.props.logoVendor} alt="No logo available" className="carLogoWidth" />
					</div>

					<div className="detailsBg flex-column carInfo">

						<h4>{this.props.carDetails.name}</h4>
						<ul className="carCategories">
							<li>{this.props.carDetails.type}</li>
							
							{this.props.carRentals.mileage.isUnlimited == true && <li>Unlimited Mileage</li>}
							<li>{this.props.carDetails.transmission}</li>
						</ul>

						<ul className="carInfraStru">
							<li>
								<img src={img_carUSer} /> {this.props.carDetails.passengerCapacity}
							</li>
							<li>
								<img src={img_carDoor} /> -
																	  </li>
							<li>
								<img src={img_carLuggage} /> {this.props.carDetails.baggageCapacity}
							</li>
						</ul>

						<ul className="pickupDropDet">
							<li>
								<h6>Pick-Up</h6>
							
								 <p>{this.props.rentalLocations.pickup[0] && this.props.rentalLocations.pickup[0].contactInfo.address.line1} ,{this.props.rentalLocations.pickup[0] &&  this.props.rentalLocations.pickup[0].contactInfo.address.state.code}</p>
								<p>{moment(carPickUpTime, "hh:mm").format('LT')}</p>
							</li>
							<li>
								<h6>Drop-Off</h6>
								<p>{this.props.rentalLocations.drop[0] &&  this.props.rentalLocations.drop[0].contactInfo.address.line1} ,{this.props.rentalLocations.drop[0] && this.props.rentalLocations.drop[0].contactInfo.address.state.code}</p>
								<p>{moment(carDropTime, "hh:mm").format('LT')}</p>

							</li>
						</ul>

					</div>
					<div className="rateShowDiv flex-column">

						<div className="priceDiv">
							{/* <strike>{selectedCurrencyVal}680</strike> */}
							{<h2>{selectedCurrencyVal}&nbsp;{totFare}</h2>}
							<p>per day</p>
						</div>
						<p className="totalAmt">Total :{selectedCurrencyVal}&nbsp;{fullTotFare}</p>
						<button type="button" className="selectRoomBtn" onClick={this.carCardSelect}>Select</button>
					</div>
				</div>
			</div>
		);
	}
}
const mapStateToProps = state => ({
	sessionId: state.carReducer.sessionId,
	selectedCurrency: state.carReducer.selectedCurrency
});

export default withRouter(connect(mapStateToProps)(CarCard));