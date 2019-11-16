import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import openNewTab from "../../../asset/images/dashboard/resize.png";
import openNewTabBlue from '../../../asset/images/Open In New Tab (Baggage Info).svg';
import img_info from '../../../asset/images/Important Information.svg';
import img_DateArrow from "../../../asset/images/Date Arrow.png";
import img_Time from "../../../asset/images/Time.svg";
import img_airline from '../../../asset/images/flight/airlines.png';
import img_Departure from '../../../asset/images/Departure.svg';
import img_customer from "../../../asset/images/Xeniapp Customers.svg";

import HotelBookingProtection from "../../presentational/HotelBookingProtection"
import { connect } from "react-redux";

class FlightConfirm extends Component {
    constructor(){
		super()
		this.state={
			
		}
	}
	


	render() {
       
	
		return (

			<div>
				
					<div className="selectRoomBg d-flex flex-wrap">
						<div className="selectRoomTitle">
							<h4>Review & Confirm your reservation <img src={openNewTab} /></h4>
						</div>
						<div className="selectRoomItemsBg flightConfirm d-flex flex-row smallColumn justify-content-between">
							<div className="flex-column flightConfirmLeft">
								<h4>Your Departing Flight</h4>
								<p><img src={img_airline}/> Delta Airlines</p>
								<ul className="FlightStatus borderbtm">
                                      <li>
                                        <span className="flightDet"><img src={img_Departure} /> Frt,Oct 17</span>
                                        <span className="flightInfo"><img src={img_Time} /> <span className="bordered">5.39pm  <small>Steward Intl(SWF)</small></span></span>
                                      </li>
                                      <li><img src={img_DateArrow} alt="arrow"/> </li>
                                      <li>
                                         <span className="flightDet"><small>(1 Stop) </small> 5h 52m</span>
                                          <span className="flightInfo"> <span className="bordered">10.39pm  <small>George Bush Intl(IAH)</small></span></span>
                                      </li>
                                </ul>
								<h6>Flight & baggage fee details &nbsp;&nbsp;&nbsp;<i className="fas fa-angle-double-down"></i></h6>
								<div className="baggageDivShow">
									<p>Delta 644</p>
									<p>Boeing (Douglas) MD-88 | No meal | 90% on time</p>
									<p>Economy/Coach (E)</p>
									<p><b>Total Distance:</b> 726 mi</p>
									<p><b>Baggage Fees:</b> Baggage fees when purchased at the
										airport (Prices may be cheaper if purchased online 
										with Delta) </p>
									<table>
										<tbody>
											<tr>
												<td>Carry on:</td>
												<td>No Fee</td>
											</tr>
											<tr>
												<td>1st Checked bag:</td>
												<td>$30.00 up to 23kg</td>
											</tr>
											<tr>
												<td>2nd Checked bag:</td>
												<td>$40.00 up to 23kg</td>
											</tr>
											<tr>
												<td>Baggage Information: </td>
												<td><a href="">Delta  <img src={openNewTabBlue}/></a></td>
											</tr>
										</tbody>
									</table>

								</div>

							</div>
							<div className="flex-column flightConfirmRight">
								<ul className="totalAmount">
                                  <li><span>Price per person</span> <span> $204.00</span></li>
                                  <li><span>Passenger</span> <span>2</span></li>
								  <li><span>Travel Insurance</span> <span>$22.02</span></li>
                                  <li><span>Taxs & Fees</span> <span>$22.02</span></li>
                                  <li><span>Total Cost</span> <span>$450.02</span></li>
                                </ul>
								<h4><img src={img_info}/> Important Flight Information</h4>
								<p>Your flight is a combination of two one-way fares, each subject to its own rules and restrictions. If one of your flights is changed or cancelled, it will not automatically alter the other flight. Changes to the other flight may incur a charge.</p>
								
								<div className="flightInformDet">
									<h6>DEPARTURE</h6>
									<p>Tickets are non-refundable 24 hours after booking and non transferable. A fee of $200.00 per ticket is charged for itinerary changes. Name changes are not allowed.</p>
								</div>
								<div className="flightInformDet">
									<h6>RETURN</h6>
									<p>Tickets are non-refundable 24 hours after booking and non-transferable. A fee of $200.00 per ticket is charged for itinerary changes. Name changes are not allowed.</p>
								</div>
								
							</div>

						</div>
					</div>
			
					<div className="d-flex flex-wrap otherSectionBg">
					<HotelBookingProtection type='flight'/>
					</div>

					<div className="d-flex flex-wrap otherSectionBg">
						<div className="headerTitles">
						<h5>Medical Travel Insurance</h5>
					
						<div className="">
						<span>No</span>
						<input type="checkbox" id="switch"  checked />
						<label htmlFor="switch">Toggle</label>
						<span>Yes</span>
						</div>
					</div>
					
						<div className="hotelProtectInfo">
						<p className="infoText">OneTrip Basic protects both international and domestic travelers and is an economical option with benefits for emergency
							medical care. Coverage for existing medical conditions is available. OneTrip Basic also includes crucial benefits for trip
							cancellation, trip interruption, trip delays and lost/stolen or damaged baggage.</p>
						<p>
						9 reasons you might need Medical Travel Insurance{" "}
							<i
							className="fas fa-angle-double-down"
							onClick={this.handleChange}
							/>
						</p>
						{/* {showReasons && ( 
							// <ol>
							// <li>Pays up to $35000.Now with $0 deductible.</li>
							// <li>Covers rental car damage collision,theft or vandalism.</li>
							// <li>The vechicle is covered for all authorized drivers. </li>
							// <li>Primary coverage so you don't have to go through your auto insurance.</li>
							// <li>24/7 emergency assistance</li>
							// </ol>
						// )}*/}
						<span>
							Select Yes or No to continue booking <b>*</b>
						</span>
						<ul>
							<li>
							<div className="">
								<input type="radio" id="test1" name="radio-group" checked/>
								<label htmlFor="test1" />
								<div className="">
								<p>
									<b>Yes</b>,I want Medical Travel Insurance for my flight to New York. 
								</p>
								<small>
									<img src={img_customer} alt="" /> 80,000 Xeniapp customers opted for Medical Travel Insurance in the last 7 days
								</small>
								</div>
								<span>$29.00</span>
							</div>
							</li>
							<li>
							<div className="">
								<input type="radio" id="test2" name="radio-group" />
								<label htmlFor="test2" />
								<div className="">
								<p>
									<b>No</b>, I’m willing to accept the financial responsibity for my personal health. I understand that by declining
									this coverage I am personally responsible for any unforseen medical costs that may occur on this trip.
								</p>
								</div>
							</div>
							</li>
						</ul>
						</div>
					</div>					


					<div className="d-flex flex-wrap otherSectionBg">
						<div className="headerTitles">
						<h5>Frequent Flyer, Seat Requests, TSA Precheck & more  </h5>
					
						<div className="">
						<span>No</span>
						<input type="checkbox" id="switch"  checked />
						<label htmlFor="switch">Toggle</label>
						<span>Yes</span>
						</div>
					</div>
					
						<div className="hotelProtectInfo paymentDetails">
							<div className="row">
								<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
									<div className="form-group">
										<label>Seat Preference</label>
										<select className="bgColorSelect">
											<option>Any Seat</option>
										</select>
									</div>
								</div>
							
							</div>
							<p>Seat choice is not guaranteed, please check with airline to confirm seat selection.</p>
							<div className="row">
								<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
									<div className="form-group">
										<label>Frequent Flyer </label>
										<select className="bgColorSelect">
											<option>Frequent Flyer Program</option>
										</select>
									</div>
								</div>
								<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
									<div className="form-group">
										<label></label>
										<input type="text" className="" placeholder="Program Number"/>
									</div>
								</div>
								
							</div>
							<p>Seat choice is not guaranteed, please check with airline to confirm seat selection.</p>
							<div className="row">
								<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
									<div className="form-group">
										<label><b>TSA PreCheck </b></label>
										<input type="text" className="" />
									</div>
								</div>
								<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
									<div className="form-group">
										<label><b>Redress number</b></label>
										<input type="text" className="" placeholder=""/>
									</div>
								</div>
								
							</div>
							<p>Seat choice is not guaranteed, please check with airline to confirm seat selection.</p>
							<div className="row">
								<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
									<div className="form-group">
										<label>Special Assistance</label>
										<select className="bgColorSelect">
											<option>None</option>
										</select>
									</div>
								</div>
								
							</div>
							<p>Please contact the airline to confirm special assistance requests.</p>
						</div>
					</div>					
				<div className="d-flex flex-wrap otherSectionBg">
					
				<div>
           
          </div>
				</div>
			</div>
		);
	}

}

const mapStateToProps = () => ({

});
const mapDispatchToProps = () => ({

	
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FlightConfirm));