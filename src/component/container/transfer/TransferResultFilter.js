import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import InputRange from "react-input-range";
import downArrow from "../../../asset/images/selarrow.png";

import {
  uniqBy as _uniqBy,
  get as _get,
  map as _map,
  orderBy as _orderBy
} from "lodash";

import { carFilter, updatePagingDetails } from "../../../service/car/action";
import { transferFilters } from "../../../service/transfer/action";

var currencies = require("country-data").currencies;

const _carTypeValuesArray = [
  "CargoVan",
  "Compact",
  "CompactElite",
  "Convertible",
  "Economy",
  "EconomyElite",
  "Estate",
  "Exotic",
  "ExoticSuv",
  "FifteenPassengerVan",
  "FiftyPassengerCoach",
  "FiveSeatMiniVan",
  "FourWheelDrive",
  "Fullsize",
  "FullsizeElite",
  "Intermediate",
  "IntermediateElite",
  "LargeSuv",
  "LargeTruck",
  "Luxury",
  "LuxuryElite",
  "MediumSuv",
  "MidSize",
  "Mini",
  "MiniElite",
  "MiniVan",
  "Moped",
  "MovingVan",
  "NineSeatMiniVan",
  "Oversize",
  "Premium",
  "PremiumElite",
  "Regular",
  "SevenSeatMiniVan",
  "SmallOrMediumTruck",
  "SmallSuv",
  "Special",
  "Standard",
  "StandardElite",
  "Stretch",
  "Subcompact",
  "SUV",
  "TwelveFootTruckSUV",
  "TwelvePassengerVan",
  "TwentyFootTruck",
  "TwentyFourFootTruck",
  "TwentySixFootTruck",
  "Unique"
];

class TransferResultFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        min: 0,
        max: 10000
      },
      isFliterExpand: false,
      isCarTypeExpanded: true,
      selectedCarTypeArray: [],
      selectedVendorArray: [],
      checkbox: {},
      checkboxVendor: {},
      checkboxAuto: false,
      checkboxManual: false,
      checkboxLowToHigh: true,
      checkboxHighToLow: false,
      category: [],
      vehicle: []
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    console.log("nextProps", nextProps.transferTempList);
  }

  handleChange = value => {};

  checkBoxHandler(index, contentType) {}

  filterResultsCar = () => {};

  handlePriceChange = values => {
    console.log("values", values);
    this.setState({ values });
  };

  priceFilterComplete = values => {
    console.log("values", values);
    this.transferFilter();
  };

  transferFilter = () => {
    const {
      values,
      checkboxLowToHigh,
      checkboxHighToLow,
      category,
      vehicle
    } = this.state;
    let sort;
    if (checkboxLowToHigh) {
      sort = "asc";
    } else if (checkboxHighToLow) {
      sort = "desc";
    } else {
      sort = "asc";
    }
    const payload = {
      price: values,
      sort,
      category,
      vehicle
    };
    this.props.transferFilters(payload);
  };

  handleChangeCategory = e => {
    const { category } = this.state;
    let categoryARR = category;
    const { value } = e.target;
    let index;
    if (!category.includes(value)) {
      categoryARR.push(value);
    } else {
      index = categoryARR.indexOf(value);
      categoryARR.splice(index, 1);
    }

    this.setState({ category: categoryARR }, () => this.transferFilter());
  };

  handleChangeVehicle = e => {
    const { vehicle } = this.state;
    let vehicleARR = vehicle;
    const { value } = e.target;
    let index;
    if (!vehicle.includes(value)) {
      vehicleARR.push(value);
    } else {
      index = vehicleARR.indexOf(value);
      vehicleARR.splice(index, 1);
    }

    this.setState({ vehicle: vehicleARR }, () => this.transferFilter());
  };

  render() {
    const { isFliterExpand, category } = this.state;
    const { selectedCurrency, transferTempList } = this.props;
    const { values } = this.state;
    const selectedCurrencyVal = currencies[this.props.selectedCurrency].symbol;
    const categoryARR = _uniqBy(transferTempList, "booking_category");
    const vehicleARR = _uniqBy(transferTempList, "vehicle_type");
    console.log("category", category);
    return (
      <div
        id="carFilterBg"
        className={
          isFliterExpand
            ? "filterBg flex-column align-self-start showFilterBg"
            : "filterBg flex-column align-self-start trans-filter-min-height"
        }
      >
        <h2>FILTER BY</h2>
        <div
          className="filterTitle"
          onClick={() => this.setState({ isFliterExpand: !isFliterExpand })}
        >
          <h2>
            {" "}
            FILTER BY <img src={downArrow} className="downArrowImg" />
          </h2>
        </div>
        <div className="respDeskShow">
          <div>
            <h4>Price Range</h4>
            <div className="slideRange">
              <InputRange
                step={50}
                maxValue={10000}
                minValue={0}
                formatLabel={value => ``}
                onChangeComplete={value => this.priceFilterComplete(value)}
                onChange={value => this.handlePriceChange(value)}
                value={values}
              />
            </div>
            <span className="rangeVauleLeft">
              <span style={{ fontSize: "16px" }}>{selectedCurrencyVal}</span>
              &nbsp;{values.min}
            </span>
            <span className="rangeVauleRight">
              <span style={{ fontSize: "16px" }}>{selectedCurrencyVal}</span>
              &nbsp;{values.max}
            </span>
          </div>
          <div>
            <h4>Sort By Price</h4>
            <ul className="priceRange">
              <li>
                <input
                  className="filtercheckbox"
                  id="priceRange90"
                  type="checkbox"
                  onChange={() => {
                    this.setState(
                      {
                        checkboxLowToHigh: !this.state.checkboxLowToHigh,
                        checkboxHighToLow: false
                      },
                      () => this.transferFilter()
                    );
                  }}
                  checked={this.state.checkboxLowToHigh}
                />
                <label htmlFor="priceRange90">
                  <p>Low to High </p>
                </label>
              </li>
              <li>
                <input
                  className="filtercheckbox"
                  id="priceRange91"
                  type="checkbox"
                  onChange={() => {
                    this.setState(
                      {
                        checkboxHighToLow: !this.state.checkboxHighToLow,
                        checkboxLowToHigh: false
                      },
                      () => this.transferFilter()
                    );
                  }}
                  checked={this.state.checkboxHighToLow}
                />
                <label htmlFor="priceRange91">
                  <p>High to Low </p>
                </label>
              </li>
            </ul>
          </div>
          {categoryARR.length > 0 && (
            <div>
              <h4>Category</h4>
              <ul>
                {_map(
                  _orderBy(categoryARR, ["booking_category"], ["asc"]),
                  (each, i) => (
                    <li>
                      <input
                        id={"acc_" + i}
                        type="checkbox"
                        className="filtercheckbox"
                        value={each.booking_category}
                        onChange={this.handleChangeCategory}
                      />
                      <label
                        htmlFor={"acc_" + i}
                        style={{ textTransform: "capitalize" }}
                      >
                        {each.booking_category}
                      </label>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
          {vehicleARR.length > 0 && (
            <div>
              <h4>Vehicle</h4>
              <ul>
                {_map(
                  _orderBy(vehicleARR, ["vehicle_type"], ["asc"]),
                  (each, i) => (
                    <li>
                      <input
                        id={"vehi_" + i}
                        type="checkbox"
                        className="filtercheckbox"
                        value={each.vehicle_type}
                        onChange={this.handleChangeVehicle}
                      />
                      <label
                        htmlFor={"vehi_" + i}
                        style={{ textTransform: "capitalize" }}
                      >
                        {each.vehicle_type}
                      </label>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sessionId: state.carReducer.sessionId,
  selectedCurrency: state.commonReducer.selectedCurrency,
  vendorList: state.carReducer.carVendorList,
  loginDetails: state.loginReducer.loginDetails,
  transferFilterList: state.transferReducer.transferFilterList,
  transferTempList: state.transferReducer.transferTempList
});

const mapDispatchToProps = dispatch => ({
  transferFilters: payload => dispatch(transferFilters(payload)),
  filterCar: filterInfo => dispatch(carFilter(filterInfo)),
  updatePagingDetails: payload => dispatch(updatePagingDetails(payload))
});
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TransferResultFilter)
);
