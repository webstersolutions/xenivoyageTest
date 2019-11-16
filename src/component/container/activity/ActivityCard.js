import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import img_car from "../../../asset/images/car/carImg.png";
import img_logo from "../../../asset/images/car/carlogo.png";
import img_carUSer from "../../../asset/images/dashboard/carUser.png";
import img_carDoor from "../../../asset/images/dashboard/door.png";
import img_carLuggage from "../../../asset/images/dashboard/luggage.png";
import clock_SVG from "../../../asset/images/Time.svg";
import ActivityRating from "./ActivityRating";

import img_unAvaliable from "../../../asset/images/No_Image.jpg";



import queryString from "query-string";
import moment from "moment";

var currencies = require("country-data").currencies;

class ActivityCard extends Component {
  state = {
    isExpand: false
  };

  handleSelect = () => {
      this.props.history.push('/activity/extra?' + queryString.stringify({
        ...this.props.searchDetails,
        code: this.props.activityDetails.code,
    }))
  };
  validImage = (e) => {
    e.target.src = img_unAvaliable
  }
  render() {
    const { isExpand } = this.state;
    const { activityDetails, selectedCurrency } = this.props;
    return (
      <div className="sectionCard activityCard">
        {activityDetails && (
          <div className="d-flex flex-row smallColumn">
            <div className="flex-column activityImgDiv align-self-center">
              <img
                src={activityDetails.thumbnailHiResURL}
                alt="No logo available"
                className="activityImgWid"
                onError={this.validImage}
              />
            </div>

            <div className="detailsBg flex-column activityInfo">
              <ActivityRating rating={activityDetails.rating} />
              <h4>{activityDetails.shortTitle}</h4>

              <ul className="activityInfraStru">
                <li>
                  <img style={{ paddingBottom: "2px" }} src={clock_SVG} /> -{" "}
                  {activityDetails.duration}
                </li>
              </ul>
              <p>
                <span>
                  {isExpand
                    ? ReactHtmlParser(activityDetails.shortDescription)
                    : ReactHtmlParser(activityDetails.shortDescription.substring(0, 125)) }
                  <span
                    style={{ color: "cornflowerblue" }}
                    onClick={() => this.setState({ isExpand: !isExpand })}
                  >
                    {activityDetails.shortDescription !=
                    "Description not available"
                      ? isExpand
                        ? " ...show less"
                        : " ...show more"
                      : null}
                  </span>
                </span>
              </p>
            </div>
            <div className="rateShowDiv flex-column">
              <div className="priceDiv">
                <p className="text-center">Starting from</p>
                <h2>{`${currencies[activityDetails.currencyCode].symbol}${activityDetails.price}`}</h2>
              </div>
              <button type="button" className="selectRoomBtn" onClick={this.handleSelect}>
                Select
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  sessionId: state.carReducer.sessionId,
  selectedCurrency: state.carReducer.selectedCurrency
});

export default withRouter(connect(mapStateToProps)(ActivityCard));
