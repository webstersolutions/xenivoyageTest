import React, { Component } from "react";
import TransferCard from "./TransferCard";
import TransferResultFilter from "./TransferResultFilter";

import queryString from "query-string";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { transferSearch } from "../../../service/transfer/action";

class TransferSearchResult extends Component {
  state = {
    pageNo: 1,
    offsetHeight: 1000
  };

  componentDidMount() {
    this.props.transferSearch({
      ...queryString.parse(this.props.location.search),
      currencySymbol: this.props.currencySym,
      currency: this.props.selectedCurrency,
      email: this.props.loginDetails ? this.props.loginDetails.email : null,
    });
  }

  componentWillReceiveProps(newProps) {
    if (this.props.location !== newProps.location) {
      this.props.transferSearch({
        ...queryString.parse(newProps.location.search),
        currencySymbol: newProps.currencySym,
        currency: newProps.selectedCurrency,
        email: this.props.loginDetails ? this.props.loginDetails.email : null,
      });
    }
  }

  render() {
    const { transferList, taxiTravelDistance, estimatedTime } = this.props;
    let obj = {
      taxiTravelDistance,
      estimatedTime
    };

    let clientWidth;
    let offsetHeight;

    try {
      clientWidth = document.body.clientWidth;
      if (+clientWidth > 1199) {
        offsetHeight = document.getElementById("carFilterBg").offsetHeight;
      } else {
        offsetHeight = 1000;
      }
    } catch (e) {
      offsetHeight = 1000;
    }

    return (
      <div className="d-flex flex-row tab-column justify-content-start">
        <TransferResultFilter />

        <div className="filterResult">
          <div
            className="cardDetailsHowBg"
            id="content"
            style={{ height: offsetHeight + "px" }}
          >
            {transferList.length === 0 ? (
              <div className="sectionCard marginTop0">
                <span className="noHotels">
                  <i className="fas fa-car" />
                </span>
                <h2 className="noHotelText">No Cars Available</h2>
              </div>
            ) : (
              transferList.map(taxi => (
                <TransferCard
                  taxiDetails={taxi}
                  timeObj={obj}
                  searchDetails={queryString.parse(this.props.location.search)}
                />
              ))
            )
            // transferList.map(taxi => (
            //     <TransferCard
            //         taxiDetails={taxi}
            //         timeObj={obj}
            //         searchDetails={queryString.parse(this.props.location.search)}
            //     />
            // ))
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  transferList: state.transferReducer.transferList,
  taxiTravelDistance: state.transferReducer.taxiTravelDistance,
  estimatedTime: state.transferReducer.estimatedTime,
  selectedCurrency: state.commonReducer.selectedCurrency,
  currencySym: state.commonReducer.currencySym,
  loginDetails: state.loginReducer.loginDetails,
});

const mapDispatchToProps = dispatch => ({
  transferSearch: searchInfo => dispatch(transferSearch(searchInfo))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TransferSearchResult)
);
