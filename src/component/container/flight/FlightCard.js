import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import img_airline from '../../../asset/images/flight/airlines.png';

class FlightCard extends Component {

    handleSelect = () =>{
        this.props.history.push('/flight/confirm?' );
    }
    render(){
        return(
            <React.Fragment>
            <div className="sectionCard flightCard">
                <div className="d-flex flex-row smallColumn align-items-center">
                    {/* design Todo */}
                    <div className="flex-column resColumn">
                        <div className="airlineImages">
                            <img src={img_airline}/>
                        </div>
                    </div>
                    <div className="flex-column resColumn">
                        <div className="travellingTime">
                            <div className="travelTimeAndPlace">
                                <h5 className="">6.30pm</h5>
                                <p>BOM, Mumbai</p>
                            </div>
                            <div className="travelDistanceShow">
                                <p className="totalHoursdiv"><span className="totalHour">4h 52m</span><span className="borderLine"></span></p>
                                <ul>
                                    <li><span></span></li>
                                    <li><span></span></li>
                                </ul>
                                <p className="nonStopText">Non-Stop</p>
                            </div>  
                            <div className="travelTimeAndPlace">
                            <h5 className="">10.30pm</h5>
                                <p>LGA, New York</p>
                            </div>                         
                        </div>
                    </div>
                    <div className="flex-column resColumn">
                          <div className="flightRate">
                                <h3>$450.00</h3>
                                <button type="button" className="flightSelectbtn searchBtn" onClick={this.handleSelect}>Select</button>
                          </div>  
                    </div>
                </div>
            </div>

            <div className="sectionCard flightCard">
            <div className="d-flex flex-row smallColumn align-items-center">
                {/* design Todo */}
                <div className="flex-column resColumn">
                    <div className="airlineImages">
                        <img src={img_airline}/>
                    </div>
                </div>
                <div className="flex-column resColumn">
                    <div className="travellingTime">
                        <div className="travelTimeAndPlace">
                            <h5 className="">6.30pm</h5>
                            <p>BOM, Mumbai</p>
                        </div>
                        <div className="travelDistanceShow">
                            <p className="totalHoursdiv"><span className="totalHour">4h 52m</span><span className="borderLine"></span></p>
                            <ul>
                                <li><span></span></li>
                                <li><span className="moreStop"></span> <p>ATL, 1h 30m</p></li>
                                <li><span  className="moreStop"></span> <p>DTW, 55m</p></li>
                                <li><span></span></li>
                            </ul>
                        </div>  
                        <div className="travelTimeAndPlace">
                        <h5 className="">10.30pm</h5>
                            <p>LGA, New York</p>
                        </div>                         
                    </div>
                </div>
                <div className="flex-column resColumn">
                      <div className="flightRate">
                            <h3>$450.00</h3>
                            <button type="button" className="flightSelectbtn searchBtn">Select</button>
                      </div>  
                </div>
            </div>
        </div>
        <div className="sectionCard flightCard">
            <div className="d-flex flex-row smallColumn align-items-center">
                {/* design Todo */}
                <div className="flex-column resColumn">
                {/* depature flight details */}
                <div className="d-flex flex-row departureFlights smallColumn">
                <div className="flex-column resColumn">
                    <div className="airlineImages">
                        <img src={img_airline}/>
                    </div>
                </div>
                <div className="flex-column resColumn">
                    <div className="travellingTime">
                        <div className="travelTimeAndPlace">
                            <h5 className="">6.30pm</h5>
                            <p>BOM, Mumbai</p>
                        </div>
                        <div className="travelDistanceShow">
                            <p className="totalHoursdiv"><span className="totalHour">4h 52m</span><span className="borderLine"></span></p>
                            <ul>
                                <li><span></span></li>
                                <li><span className="moreStop"></span> <p>ATL, 1h 30m</p></li>
                                <li><span  className="moreStop"></span> <p>DTW, 55m</p></li>
                                <li><span></span></li>
                            </ul>
                        </div>  
                        <div className="travelTimeAndPlace">
                        <h5 className="">10.30pm</h5>
                            <p>LGA, New York</p>
                        </div>                         
                    </div>
                </div>
                </div>
                     {/* Return flight details */}
                <div className="d-flex flex-row returnFlights smallColumn">
                <div className="flex-column resColumn">
                    <div className="airlineImages">
                        <img src={img_airline}/>
                    </div>
                </div>
                <div className="flex-column resColumn">
                    <div className="travellingTime">
                        <div className="travelTimeAndPlace">
                            <h5 className="">6.30pm</h5>
                            <p>BOM, Mumbai</p>
                        </div>
                        <div className="travelDistanceShow">
                            <p className="totalHoursdiv"><span className="totalHour">4h 52m</span><span className="borderLine"></span></p>
                            <ul>
                                <li><span></span></li>
                                <li><span></span></li>
                            </ul>
                            <p className="nonStopText">Non-Stop</p>
                        </div>  
                        <div className="travelTimeAndPlace">
                        <h5 className="">10.30pm</h5>
                            <p>LGA, New York</p>
                        </div>                         
                    </div>
                </div>
                </div>
                </div>
                <div className="flex-column resColumn">
                      <div className="flightRate">
                            <h3>$450.00</h3>
                            <button type="button" className="flightSelectbtn searchBtn">Select</button>
                      </div>  
                </div>
            </div>
        </div>
        </React.Fragment>
        )
    }
}export default (withRouter(FlightCard));;