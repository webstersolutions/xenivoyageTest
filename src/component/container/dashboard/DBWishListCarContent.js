import React, { Component } from "react";
import img_refresh from "../../../asset/images/dashboard/refresh.png";
import img_car from "../../../asset/images/car.png"
import img_carUser from "../../../asset/images/dashboard/carUser.png"
import img_door from "../../../asset/images/dashboard/door.png"
import img_luggage from "../../../asset/images/dashboard/luggage.png"
import img_carImg from "../../../asset/images/dashboard/carImg.png"
import img_Date from "../../../asset/images/Date Arrow.png"
import img_Time from "../../../asset/images/Time.svg"
import img_whiteArrow from '../../../asset/images/dashboard/whitearrow.png'
class DBWishListCarContent extends React.Component {
  render() {
    const { selectedCurrency } = this.props;
    return <div className="d-flex flex-wrap wishListRight">
      <div className="flex-column wishListLeftInfo">
        <span className="refreshIcon">
          <img src={img_refresh} />
        </span>
        <div className="carInfo borderBottom">
          <h4>
            <img src={img_car} /> Standard SUV
            </h4>
          <h6> Hyundai Santa Fe, Chevy Equinox or similar</h6>
          <ul className="carInfraStru">
            <li>
              <img src={img_carUser} /> 5
              </li>
            <li>
              <img src={img_door} /> 4
              </li>
            <li>
              <img src={img_luggage} /> 3
              </li>
          </ul>

          <ul className="pickupDropDet">
            <li>
              <h6>Pick-Up</h6>
              <p>La Guardia Airport</p>
            </li>
            <li>
              <h6>Drop-Off</h6>
              <p>Same as Pickup</p>
            </li>
          </ul>
        </div>

        <div className="carTimeInfo d-flex flex-row">
          <div className="flex-column carImg borderRightDash">
            <img src={img_carImg} />
          </div>
          <div className="flex-column carStayDet">
            <span>Booking for 6 Nights</span>
            <ul>
              <li className="border">
                <h5> OCT 20</h5>
                <p>Saturday</p>
              </li>
              <li>
                <img src={img_Date} />
              </li>
              <li className="border">
                <h5> OCT 26</h5>
                <p>Friday</p>
              </li>
            </ul>
            <ul className="checkInOut">
              <li>
                <img src={img_Time} />
                <span>
                  Pick-Up <b>12.00pm</b>
                </span>
              </li>
              <li>
                <img src={img_Time} />
                <span>
                  Drop-Off <b>06.00pm</b>
                </span>
              </li>
            </ul>
          </div>
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
    </div>;
  }
}
export default DBWishListCarContent;
