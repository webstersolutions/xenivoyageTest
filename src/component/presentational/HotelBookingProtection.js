import React, { Component } from "react";
import img_Xeniapp from "../../asset/images/Xeniapp Customers.svg";
import img_clock from "../../asset/images/clock.svg";
import img_customer from "../../asset/images/Xeniapp Customers.svg";
import { relativeTimeThreshold } from "moment";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";

class HotelBookingProtection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHotelBookingShow: false,
      showReasons: true
    };
  }
  handleCheck = e => {
    this.setState({ isHotelBookingShow: e.target.checked });
  };
  handleChange = () => {
    this.setState({ showReasons: !this.state.showReasons });
  };

  render() {
    console.log(this.props)
    const { isHotelBookingShow, showReasons } = this.state;
    const { tripAmount, selectedCurrency } = this.props;
    if (this.props.type == 'flight') {
      return (
        <React.Fragment>
          <div className="headerTitles">
            <h5>Trip Protection</h5>
            <div className="">
              <span>No</span>
              <input type="checkbox" id="switch" checked={isHotelBookingShow} onChange={this.handleCheck} />
              <label htmlFor="switch">Toggle</label>
              <span>Yes</span>
            </div>
          </div>
          {isHotelBookingShow && (
            <div className="hotelProtectInfo">
              <small>
                <img src={img_clock} alt="" /> Avoid change fees. Protect
                your trip.
              </small>
              <p>
                3 reasons you might need Trip Protection{" "}
                <i
                  className="fas fa-angle-double-down"
                  onClick={this.handleChange}
                />
              </p>
              {showReasons && (
                <ol>
                  <li>Pays up to {selectedCurrency}35000.Now with {selectedCurrency}0 deductible.</li>
                  <li>Covers rental car damage collision,theft or vandalism.</li>
                  <li>The vechicle is covered for all authorized drivers. </li>
                  <li>Primary coverage so you don't have to go through your auto insurance.</li>
                  <li>24/7 emergency assistance</li>
                </ol>
              )}
              <span>
                Select Yes or No to continue booking <b>*</b>
              </span>
              <ul>
                <li>
                  <div className="">
                    <input type="radio" id="test1" name="radio-group" checked={isHotelBookingShow} onChange={this.handleCheck} />
                    <label htmlFor="test1" />
                    <div className="">
                      <p>
                        <b>Yes</b> I want Cancellation Protection for my flight to New York.
                      </p>
                      <small>
                        <img src={img_customer} alt="" /> 67,084 Xeniapp customers protected their flight in the last 7 days
                      </small>
                    </div>
                    <span>{selectedCurrency}22.00</span>
                  </div>
                </li>
                <li>
                  <div className="">
                    <input type="radio" id="test2" name="radio-group" />
                    <label htmlFor="test2" />
                    <div className="">
                      <p>
                        <b>No</b>, I'm willing to risk my {selectedCurrency}305.80 flight. I understand by declining this coverage that I may be
                        responsible for cancellation fees and delay expenses either personally or through alternate cover.
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </React.Fragment>
      );
    }
    else if (this.props.type == 'car') {
      return (
        <React.Fragment>
          <div className="headerTitles">
            <h5>Rental Car Protection (recommended)</h5>
            <div className="">
              <span>No</span>
              <input type="checkbox" id="switch" checked={isHotelBookingShow} onChange={this.handleCheck} />
              <label htmlFor="switch">Toggle</label>
              <span>Yes</span>
            </div>
          </div>
          {isHotelBookingShow && (
            <div className="hotelProtectInfo">
              <small>
                <img src={img_clock} alt="" /> Avoid unnecessary fees. Protect
                your trip.
            </small>
              <p>
                5 reasons you might need Travel Protection{" "}
                <i
                  className="fas fa-angle-double-down"
                  onClick={this.handleChange}
                />
              </p>
              {showReasons && (
                <ol>
                  <li>Pays up to {selectedCurrency}35000.Now with {selectedCurrency}0 deductible.</li>
                  <li>Covers rental car damage collision,theft or vandalism.</li>
                  <li>The vechicle is covered for all authorized drivers. </li>
                  <li>Primary coverage so you don't have to go through your auto insurance.</li>
                  <li>24/7 emergency assistance</li>
                </ol>
              )}
              <span>
                Select Yes or No to continue booking <b>*</b>
              </span>
              <ul>
                <li>
                  <div className="">
                    <input type="radio" id="test1" name="radio-group" checked={isHotelBookingShow} onChange={this.handleCheck} />
                    <label htmlFor="test1" />
                    <div className="">
                      <p>
                        <b>Yes</b>, I need collision protection
                    </p>
                      <small>
                        <img src={img_customer} alt="" /> 67,084 Xeniapp customers
                        protected their trip in the last 7 days
                    </small>
                    </div>
                    <span>{selectedCurrency}9.00</span>
                  </div>
                </li>
                <li>
                  <div className="">
                    <input type="radio" id="test2" name="radio-group" />
                    <label htmlFor="test2" />
                    <div className="">
                      <p>
                        <b>No</b>, I'm willing to take the risk. I understand by declining this coverage that I may be financially
                        responsible for damage from collision,theft or vandalism
                    </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </React.Fragment>
      );
    } else if (this.props.type == 'hotel') {
      return (
        <React.Fragment>
          {/* <div className="headerTitles">
            <h5>Hotel Booking Protection</h5>
            <div className="">
              <span>No</span>
              <input type="checkbox" id="switch" checked={isHotelBookingShow} onChange={this.handleCheck} />
              <label htmlFor="switch">Toggle</label>
              <span>Yes</span>
            </div>
          </div> */}
          {isHotelBookingShow && (
            <div className="hotelProtectInfo">
              <small>
                <img src={img_clock} alt="" /> Avoid unnecessary fees. Protect
                your trip.
                  </small>
              <p>
                5 reasons you might need Travel Protection{" "}
                <i
                  className="fas fa-angle-double-down"
                  onClick={this.handleChange}
                />
              </p>
              {showReasons && (
                <ol>
                  <li>You want to avoid a late cancellation or no-show fee</li>
                  <li>You get delayed and miss a night of your hotel stay</li>
                  <li> Your trip is delayed and you need a hotel or meal</li>
                  <li> You get sick and don't use all your hotel nights</li>
                  <li> Your bag is delayed and you need to buy essentials</li>
                </ol>
              )}
              <span>
                Select Yes or No to continue booking <b>*</b>
              </span>
              <ul>
                <li>
                  <div className="">
                    <input type="radio" id="test1" name="radio-group" checked={isHotelBookingShow} onChange={this.handleCheck} />
                    <label htmlFor="test1" />
                    <div className="">
                      <p>
                        <b>Yes</b>, I want Hotel Booking Protection for my trip to
                        New York.
                          </p>
                      <small>
                        <img src={img_customer} alt="" /> 67,084 Xeniapp customers
                        protected their trip in the last 7 days
                          </small>
                    </div>
                    <span>{selectedCurrency}9.00</span>
                  </div>
                </li>
                <li>
                  <div className="">
                    <input type="radio" id="test2" name="radio-group" />
                    <label htmlFor="test2" />
                    <div className="">
                      <p>
                        <b>No</b>, I'm willing to risk my {selectedCurrency}{tripAmount} Trip. I
                        understand by declining this coverage that I may be
                        responsible for cancellation fees and delay expenses
                        either personally or through alternate cover..
                          </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </React.Fragment>
      );
    }
  }
}

const mapStateToProps = state => ({
  selectedCurrency: state.commonReducer.selectedCurrency
});

export default withRouter(connect(mapStateToProps)(HotelBookingProtection));
