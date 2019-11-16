import React, { Component } from "react";
import img_refresh from "../../../asset/images/dashboard/refresh.png";
import img_Time from "../../../asset/images/Time.svg";
import img_Date from "../../../asset/images/Date Arrow.png";
import img_whiteArrow from "../../../asset/images/dashboard/whitearrow.png";
import img_Delta from "../../../asset/images/Delta Airlines Logo.svg";
import img_Departure from "../../../asset/images/Departure.svg";
import img_Airlines from "../../../asset/images/United-Airlines.png";
import img_Arrival from '../../../asset/images/Arrival.svg'
class DBWishListFlightContent extends React.Component {
  render() {
    const { selectedCurrency } = this.props;
    return (
      <div className="d-flex flex-wrap wishListRight">
        {/* <!-- flight section --> */}
        <div className="flex-column wishListLeftInfo">
          <span className="refreshIcon">
            <img src={img_refresh} />
          </span>
          <div className="flightDetails borderBottom">
            <h6>Your Departing Flight</h6>

            <p>
              <img src={img_Delta} />
            </p>
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
              <li>
                <img src={img_Date} className="arrowDivied" />
              </li>
              <li>
                <span className="flightRunTime">
                  <p>(1 stop)</p> 5h 52m
                </span>
                <span className="flighTime">
                  10.19pm <p>Stewart int (SWL)</p>
                </span>
              </li>
            </ul>
          </div>
          <div className="flightDetails">
            <h6>Your Returning Flight</h6>
            <p>
              <img src={img_Airlines} />
            </p>
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
              <li>
                <img src={img_Date} className="arrowDivied" />
              </li>
              <li>
                <span className="flightRunTime">
                  <p>(1 stop)</p> 5h 52m
                </span>
                <span className="flighTime">
                  10.19pm <p>Stewart int (SWL)</p>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-column wishListRightInfo">
          <ul className="totalAmountDis">
            <li>
              <span>Price Per person</span> <span>{selectedCurrency}214</span>
            </li>
            <li>
              <span>Passengers</span> <span>2</span>
            </li>
            <li>
              <span>Taxes &amp; Fees</span> <span>{selectedCurrency}22.00</span>
            </li>
            <li>
              <span>Total Cast</span> <span>{selectedCurrency}1225.45</span>
            </li>
          </ul>
          <div className="nameYourPrice d-flex flex-row">
            <span className="flex-column">Name Your Price</span>
            <div className="flex-column nameInput">
              <input type="text" />
              <button className="priceArrBtn">
                <img src={img_whiteArrow} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default DBWishListFlightContent;
