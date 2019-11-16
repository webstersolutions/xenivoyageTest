import React, { Component } from "react";
import img_refresh from "../../../asset/images/dashboard/refresh.png";
import img_Time from "../../../asset/images/Time.svg";
import img_Date from "../../../asset/images/Date Arrow.png";
import img_Where from "../../../asset/images/Where Icon (Map Marker).svg";
import img_hotel from "../../../asset/images/hotel-building.png";
import img_bannerImg from "../../../asset/images/bannerImg.jpg";
import img_whiteArrow from "../../../asset/images/dashboard/whitearrow.png";

class DBWishListHotelContent extends React.Component {
  render() {
    const { selectedCurrency } = this.props;
    return (
      <div className="d-flex flex-wrap wishListRight">
        <div className="flex-column wishListLeftInfo ">
          <span className="refreshIcon">
            <img src={img_refresh} />
          </span>
          <div className="roomLocInfo borderBottom">
            <h4>
              <img src={img_hotel} /> New York Hitlon Midtown
            </h4>
            <h6>
              <img src={img_Where} /> New
              York,NY(Downtown - Wall Street)
            </h6>
            <h5>Studio, 1 King Bed with Sofa bed</h5>
            <p>
              Free Cancellation, Free WiFi, Free Parking, Free Airport shuttle,
              Breakfast Included, Reserve Now Pay when you stay
            </p>
          </div>

          <div className="roomTimeInfo d-flex flex-row">
            <div className="flex-column roomImg">
              <img src={img_bannerImg} />
            </div>
            <div className="flex-column roomStayDet">
              <span>Booking for 6 Nights</span>
              <ul>
                <li className="border">
                  <h5>20 OCT </h5>
                  <p>Saturday</p>
                </li>
                <li>
                  <img src={img_Date} />
                </li>
                <li className="border">
                  <h5>26 OCT </h5>
                  <p>Friday</p>
                </li>
              </ul>
              <ul className="checkInOut">
                <li>
                  <img src={img_Time} />
                  <span>
                    Check In <b>12.00pm</b>
                  </span>
                </li>
                <li>
                  <img src={img_Time} />
                  <span>
                    Check Out <b>06.00pm</b>
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
      </div>
    );
  }
}
export default DBWishListHotelContent;
