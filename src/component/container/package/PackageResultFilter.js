import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import InputRange from "react-input-range";
import downArrow from "../../../asset/images/selarrow.png";
import { notify } from "react-notify-toast";
import img_star5 from "../../../asset/images/star5.png";
import img_star4 from "../../../asset/images/star4.png";
import img_star3 from "../../../asset/images/star3.png";
import img_star2 from "../../../asset/images/star2.png";
import _map from "lodash/map";
import {
  packageFilter,
  updatePagingDetails,
  getInterestList
} from "../../../service/package/action";

const currencies = require("country-data").currencies;

class PackageResultFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchStr: "",
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
      checkboxLowToHigh: false,
      checkboxHighToLow: false,
      checkboxBookNow: false,
      checkboxCustomize: false,      
      minPrice: 0,
      maxPrice: 10000,
      maximumPriceRange: 10000,
      minimumPriceRange: 0,
      isHideStarRating: false,
      options: [],
      destID: "",
      category: null,
      orderBy: "",
      dimensions: null
    };
  }

  search = null;

  componentWillReceiveProps(nextProps) {
  
    const isUSD =
      nextProps.currencyDetails && nextProps.currencyDetails.ABR_NAME;

    if (isUSD === "USD" && this.props.sessionId !== nextProps.sessionId) {
      this.setState({
        searchStr: "",
        minimumPriceRange: 0,
        maximumPriceRange: 10000,
        values: {
          min: 0,
          max: 10000
        },
        minPrice: 0,
        maxPrice: 10000,
      });
    } else if (
      isUSD !== "USD" &&
      this.props.sessionId !== nextProps.sessionId
    ) {
      this.setState({
        minimumPriceRange: 0,
        maximumPriceRange: 10000,
        values: {
          min: 0,
          max: 10000
        },
        minPrice: 0,
        maxPrice: 10000
      });
    }
    if (
      nextProps.destId !== this.props.destId &&
      nextProps.destId !== undefined
    ) {
    this.props.getInterestList();

      this.setState({ destID: nextProps.destId });
    }
    else{
      this.setState({ destID: this.props.destId });

    }

    if(this.props.activityCategoryList !== nextProps.activityCategoryList){
      setTimeout(() => {
        this.setState({
          dimensions: {
            width: this.container.offsetWidth,
            height: this.container.offsetHeight,
          },
        }, () => {
          this.props.checkOffsetHeight(this.state.dimensions.height)
        })
      }, 1000);
    }
  }

  handleChange = value => {
    let newValue = value;
    newValue.min = value.min < 0 ? 0 : value.min;
    newValue.max = value.max > 10000 ? 10000 : value.max;
    this.setState({ values: newValue });
  };

  filterResultsActivity = (value, sub) => {
    
    let catIds;
    let subCatIds;
    if (typeof sub === "object") {
      if (sub.sub) {
        subCatIds = value.subcategoryId;
        catIds = value.category;
      } else {
        catIds = value;
      }
    }
    let { searchStr } = this.state;
    let orderBy;
    if (this.state.checkboxLowToHigh === true) {
      orderBy= "asc";
    } else if (this.state.checkboxHighToLow === true) {
        orderBy= "desc";
    } else {
        orderBy= "asc";
    }
    
    let maxVal = 10000;
    if (this.state.values.max >= 10000) {
      maxVal = "10000";
    } else {
      maxVal = this.state.values.max;
    }
    if (this.props.destId != null) {
      this.setState({ destID: this.props.destId });
    }
    if(this.state.destID == undefined){
      this.setState({ destID: this.props.destId });
        }

        let interest;
        if (this.state.options == "") {
          interest = [];
        } else {
          interest = this.state.options;
        }
      

    let bookNow;
    if (this.state.checkboxBookNow === true) {
      bookNow= true;
    } 
    else{
      bookNow= false;

    }
    let bookCustomize;
     if (this.state.checkboxCustomize === true) {
      bookCustomize= true;
    }
     else{
      bookCustomize= false;

    }
    
   
    
   // console.log(star);
    let filterPayload = {
      searchField: searchStr,
      minRange: +this.state.values.min,
      maxRange: maxVal,
      destinationId: this.state.destID,
      sortPrice: orderBy,
      interest: interest,
      bookNow:bookNow,
      bookCustomize:bookCustomize,
       paging: {
        pageNo: 1,
        pageSize: 30,
        sortPrice: this.state.orderBy
      },
      catIds,
      subCatIds,
      currencyCode: this.props.selectedCurrency
    };
   // console.log(filterPayload);
    this.props.filterPackage(filterPayload);
  };

  hideCategory = i => {
    this.setState({
      category: "isHideCategory" + i
    });
  };

  handleMinPrice = e => {
    if (this.state.values.max <= Number(e.target.value)) {
      notify.show(
        "The min cannot be greater than max. Please enter the valid range",
        "error"
      );
    } else if (Number(e.target.value) < 0) {
      notify.show(
        "The min cannot be lower than 0. Please enter the valid range",
        "error"
      );
    } else {
      this.setState({
        minPrice: e.target.value,
        values: {
          min: Number(e.target.value),
          max: this.state.values.max
        }
      },
      () => this.filterResultsActivity()
      );
      this.handleChange(
        { min: e.target.value, max: this.state.values.max },
        () => this.filterResultsActivity()
      );
    }
  };

  handleMaxPrice = e => {
    if (this.state.values.min >= Number(e.target.value)) {
      notify.show(
        "The min cannot be greater than max. Please enter the valid range",
        "error"
      );
    } else if (Number(e.target.value) > 10000) {
      notify.show(
        "The max cannot be greater than 10000. Please enter the valid range",
        "error"
      );
    } else {
      this.setState({
        maxPrice: e.target.value,
        values: {
          min: this.state.values.min,
          max: e.target.value
        }
      },
      () => this.filterResultsActivity()
      );
      // this.handleChange(
      //   {
      //     min: this.state.values.min,
      //     max: e.target.value
      //   },
      //   () => this.filterResultsActivity()
      // );
    }
  };

  searchByPackage = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  checkOnPress = e => {
    clearTimeout(this.search);
    let filter = {};

    let orderBy;
    if (this.state.checkboxLowToHigh === true) {
      orderBy= "asc";
    } else if (this.state.checkboxHighToLow === true) {
        orderBy= "desc";
    } else {
        orderBy= "asc";
    }
    let maxVal = 10000;
    if (this.state.values.max >= 10000) {
      maxVal = "10000";
    } else {
      maxVal = this.state.values.max;
    }
    const value = e.target.value;
    let { searchStr } = this.state;
    this.setState({ searchStr: value });

    let bookNow;
    if (this.state.checkboxBookNow === true) {
      bookNow= true;
    } 
    else{
      bookNow= false;

    }
    let bookCustomize;
     if (this.state.checkboxCustomize === true) {
      bookCustomize= true;
    }
     else{
      bookCustomize= false;

    }

   
    if(this.state.destID == undefined){
        this.setState({ destID: this.props.destId });
          }
    let interest;
    if (this.state.options == "") {
      interest = [];
    } else {
      interest = this.state.options;
    }
    filter = {
      searchField: searchStr,
      destinationId: this.state.destID,
      sortPrice: orderBy,
      bookNow:bookNow,
      bookCustomize:bookCustomize,
      minRange: +this.state.values.min,
      maxRange: maxVal,
      interest: interest,
      currencyCode: this.props.selectedCurrency
    };
   // console.log(filter);
    this.search = setTimeout(() => {
      this.props.filterPackage(filter);
    }, 500);
  };

  onChangeRating = e => {
    let { searchStr } = this.state;

    let orderBy;
    if (this.state.checkboxLowToHigh === true) {
      orderBy= "asc";
    } else if (this.state.checkboxHighToLow === true) {
        orderBy= "desc";
    } else {
        orderBy= "asc";
    }


    const value = e.target.value;
    const options = this.state.options;

    let index;
    if (e.target.checked) {
      options.push(+e.target.value);
      // options.push(+e.target.value + 0.5);
    } else {
      index = options.indexOf(+e.target.value);
      options.splice(index, 1);
      // index = options.indexOf(+e.target.value + 0.5);
      // options.splice(index, 1);
    }
    this.setState({ options: options });
   // console.log(this.state.options);
    if (this.props.destId != null) {
      this.setState({ destID: this.props.destId });
    }
    let maxRate = Math.max(...options);
    let minRate = Math.min(...options);
    if (maxRate === -Infinity || minRate === Infinity) {
      maxRate = 5;
      minRate = 1;
    } else {
      maxRate = Math.trunc(maxRate);
      minRate = Math.trunc(minRate);
    }
    let maxVal = 10000;
    if (this.state.values.max >= 10000) {
      maxVal = "10000";
    } else {
      maxVal = this.state.values.max;
    }
    let bookNow;
    if (this.state.checkboxBookNow === true) {
      bookNow= true;
    } 
    else{
      bookNow= false;

    }
    let bookCustomize;
     if (this.state.checkboxCustomize === true) {
      bookCustomize= true;
    }
     else{
      bookCustomize= false;

    }

    if (this.props.destId != null) {
      this.setState({ destID: this.props.destId });
    }
    let interest;
    if (this.state.options == "") {
      interest = [];
    } else {
      interest = this.state.options;
    }
    let filter;
    filter = {
      searchField: searchStr,
      destinationId: this.state.destID,
      sortPrice: orderBy,
      bookNow:bookNow,
      bookCustomize:bookCustomize,
      minRange: +this.state.values.min,
      maxRange: maxVal,
      interest: interest,
      currencyCode: this.props.selectedCurrency
    };
   // console.log(filter);
    this.search = setTimeout(() => {
      this.props.filterPackage(filter);
    }, 500);
  };

  render() {
  //  console.log("height", this.state.dimensions)
    const { searchStr } = this.state;
    const { isFliterExpand, maximumPriceRange, minimumPriceRange } = this.state;
    const selectedCurrencyVal = currencies[this.props.selectedCurrency].symbol;
    const _filterRatingList = [
      { label: "5 Stars", value: 5, refImg: img_star5 },
      { label: "4.5 Stars", value: 4.5, refImg: img_star2 },
      { label: "4 Stars", value: 4, refImg: img_star4 },
      { label: "3.5 Stars", value: 3.5, refImg: img_star2 },
      { label: "3 Stars", value: 3, refImg: img_star3 },
      { label: "2.5 Stars", value: 2.5, refImg: img_star2 },
      { label: "2 Stars", value: 2, refImg: img_star2 },
      { label: "1.5 Stars", value: 1.5, refImg: img_star2 },
      { label: "1 Stars", value: 1, refImg: img_star2 },
      { label: "0 Stars", value: 0, refImg: img_star2 }
    ];
    const icon = (
      <span
        style={{ fontSize: "16px", color: "white", marginTop: 15 }}
        className="fa fa-angle-double-down float-right"
      />
    );

    return (
      <div
        id="carFilterBg"
        className={
          isFliterExpand
            ? "filterBg flex-column align-self-start showFilterBg"
            : "filterBg flex-column align-self-start"
        }
        ref={el => (this.container = el)}
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
            <h4>Search By</h4>
            <div className="searchInPut">
              <input
                type="text"
                className="searchByName"
                placeholder="Search By Name"
                name="searchStr"
                value={searchStr}
                onChange={this.searchByPackage}
                onKeyUp={this.checkOnPress}
              />
            </div>
          </div>
          <div>
            <h4>Price Range</h4>
            <div className="slideRange">
              <InputRange
                step={50}
                maxValue={maximumPriceRange}
                minValue={minimumPriceRange}
                formatLabel={value => ``}
                onChangeComplete={value => this.filterResultsActivity()}
                onChange={value => this.handleChange(value)}
                value={this.state.values}
              />
            </div>
            <span className="rangeVauleLeft">
              <span style={{ fontSize: "16px" }}>{selectedCurrencyVal}</span>
              &nbsp;{this.state.values.min}
            </span>
            <span className="rangeVauleRight">
              <span style={{ fontSize: "16px" }}>{selectedCurrencyVal}</span>
              &nbsp;{this.state.values.max}
            </span>
            <div>
              <input
                style={{
                  width: "80px",
                  height: "27px",
                  padding: "4px",
                  paddingBottom: "4px",
                  colour: "black",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  fontSize: "15px"
                }}
                type="number"
                name="minPrice"
                placeholder="min"
                value={this.state.values.min}
                onChange={this.handleMinPrice}
              />
              <input
                style={{
                  width: "80px",
                  height: "27px",
                  float: "right",
                  padding: "4px",
                  paddingBottom: "4px",
                  colour: "black",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  fontSize: "15px"
                }}
                type="number"
                name="maxPrice"
                placeholder="max "
                value={this.state.values.max}
                onChange={this.handleMaxPrice}
              />
            </div>
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
                      () => this.filterResultsActivity()
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
                      () => this.filterResultsActivity()
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
          <div>
            <h4>Package Type</h4>
            <ul className="priceRange">
              <li>
                <input
                  className="filtercheckbox"
                  id="booknow90"
                  type="checkbox"
                  onChange={() => {
                    this.setState(
                      {
                        checkboxBookNow: !this.state.checkboxBookNow
                        // checkboxCustomize: false
                      },
                      () => this.filterResultsActivity()
                    );
                  }}
                  checked={this.state.checkboxBookNow}
                />
                <label htmlFor="booknow90">
                  <p>Book Now </p>
                </label>
              </li>
              <li>
                <input
                  className="filtercheckbox"
                  id="customize91"
                  type="checkbox"
                  onChange={() => {
                    this.setState(
                      {
                        checkboxCustomize: !this.state.checkboxCustomize
                        // checkboxBookNow: false
                      },
                      () => this.filterResultsActivity()
                    );
                  }}
                  checked={this.state.checkboxCustomize}
                />
                <label htmlFor="customize91">
                  <p>Instant Booking </p>
                </label>
              </li>
            </ul>
          
              </div>
              <div>
            <h4 style={{ cursor: "pointer" }}> Interest</h4>
            <ul>
            {this.props.packageInterestList.map((interest, i) => (
                                    <li
                                        key={i}
                               > 
                               
                               
                               <input
                                            className="filtercheckbox"
                                            id={`interest_${i}`}
                                            type="checkbox"
                                            value={interest.id}
                                            onChange={this.onChangeRating.bind(this)}
                                        />

                                <label htmlFor={`interest_${i}`}>
                                  {interest.title}
                                        </label>         
                                </li>
            ))}

            </ul>
          </div>

         

          {/* 
          <div>
            <h4 style={{ cursor: "pointer" }}> Star Rating</h4>
            <ul
              className={
                this.state.isHideStarRating ? "hideSection" : "priceRange"
              }
            >
              {_filterRatingList.map((each, i) => (
                <li
                  key={i}
                  className={
                    each.value === 2.5
                      ? "d-none"
                      : each.value === 3.5
                      ? "d-none"
                      : each.value === 4.5
                      ? "d-none"
                      : each.value === 1.5
                      ? "d-none"
                      : each.value === 0
                      ? "d-none"
                      : each.value === 1
                      ? "d-none"
                      : ""
                  }
                >
                  <input
                    className="filtercheckbox"
                    id={`priceRange_${i}`}
                    type="checkbox"
           
                    value={each.value}
           
                    onChange={this.onChangeRating.bind(this)}
                  />
                  <label htmlFor={`priceRange_${i}`}>
                    <img alt="" src={each.refImg} />
                    <p>
                      
                    </p>
                  </label>
                </li>
              ))}
            </ul>
          </div> */}

          <div>
        
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  destId: state.packageReducer.destId,
  activityCategoryList: state.packageReducer.activityCategoryList,
  packageInterestList: state.packageReducer.packageInterestList,

  sessionId: state.carReducer.sessionId,
  selectedCurrency: state.commonReducer.selectedCurrency,
  vendorList: state.carReducer.carVendorList,
  loginDetails: state.loginReducer.loginDetails,
  currencyDetails: state.hotelReducer.currencyDetails
});

const mapDispatchToProps = dispatch => ({
  filterPackage: filterInfo => dispatch(packageFilter(filterInfo)),
  updatePagingDetails: payload => dispatch(updatePagingDetails(payload)),
  getInterestList: param => dispatch(getInterestList())
});
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PackageResultFilter)
);
