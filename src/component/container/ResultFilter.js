import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import {
    filterHotel,
    searchByHotelName,
    searchByRating,
    priceFiltering,
    searchHotel,
    filteringOption,
    elasticFilterApply,
    getRating
} from "../../service/hotel/action";
import img_star5 from "../../asset/images/star5.png";
import img_star4 from "../../asset/images/star4.png";
import img_star3 from "../../asset/images/star3.png";
import img_star2 from "../../asset/images/star2.png";
import img_block from "../../asset/images/block.png";
import img_wifi from "../../asset/images/wifi.png";
import  img_parking from "../../asset/images/parking-sign.png";
import img_minibus from "../../asset/images/minibus.png";
import img_breakfast from "../../asset/images/breakfast.png";
import img_onlinebooking from "../../asset/images/online-booking.png";
import InputRange from "react-input-range";
import downArrow from "../../asset/images/selarrow.png";
import "../../component/container/Result.css";
import {
    map as _map,
    countBy as _countBy,
    filter as _filter,
} from "lodash";
import { normalize } from "path";
import moment from "moment";

var currencies = require("country-data").currencies;

class ResultFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                min: 0,
                max: 10000
            },
            options: [],
            isRating: [false, false, false, false, false],
            ratStar: null,
            arr: [],
            searchStr: "",
            isFliterExpand: false,
            hotellist: "",
            priceLowToHigh: false,
            priceHighToLow: false,
            sortHighToLow: false,
            sortLowToHigh: false,
            minRange: 0,
            maxRange: 10000,
            isHideRating: true,
            isHidePrice: false,
            isHideNeighborHood: true,
            isHideStarRating: false,
            isHideAccommodation: true,
            isHideAmenities: true,
            maximumPriceRange: 10000,
            minimumPriceRange: 0

        };
    }

    search = null;

    componentWillReceiveProps(nextProps) {
        const isUSD = nextProps.currencyDetails && nextProps.currencyDetails.ABR_NAME;

        if (nextProps.sessionId !== this.props.sessionId) {
            this.props.getRating(nextProps.sessionId);
        }
        const {hotelList} = nextProps;
        this.setState({hotellist: hotelList});
        // if (
        //     nextProps.searchPrice !== this.props.searchPrice &&
        //     nextProps.searchPrice.max != undefined &&
        //     nextProps.searchPrice.min != undefined
        // ) {
        //     this.setState({values: nextProps.searchPrice});
        // }
        if (nextProps.sessionId != this.props.sessionId) {
            this.setState({
                priceLowToHigh: false,
                priceHighToLow: false,
                sortHighToLow: false,
                sortLowToHigh: false,
                searchStr: "",
                values: {
                    min: 0,
                    max: 10000
                },
                minRange: 0,
                maxRange: 10000,
                options: [],
                isRating: [false, false, false, false, false],
                ratStar: null
            });
            let arr = [0, 2, 4, 6];
            arr.map(
                index =>
                    (document.getElementById("priceRange_" + index).checked = false)
            );
            document.getElementById("priceRange_0").checked = false;
        }
        if (
            nextProps.isHotelRest !== this.props.isHotelRest &&
            nextProps.isHotelRest == true
        ) {
            // let isRating = [...this.state.isRating];
            // for (let i = 0; i < 5; i++) {
            //   isRating[i] = false;
            // }
            // this.setState({ isRating });
        }

        if (isUSD == "USD" && nextProps.sessionId != this.props.sessionId) {
            this.setState({
                minimumPriceRange: 0,
                maximumPriceRange: 1000,
                values: {
                    min: 0,
                    max: 1000
                },
                minRange: 0,
                maxRange: 1000
            })
        } else if (isUSD != "USD" && nextProps.sessionId != this.props.sessionId) {
            this.setState({
                minimumPriceRange: 0,
                maximumPriceRange: 10000,
                values: {
                    min: 0,
                    max: 10000
                },
                minRange: 0,
                maxRange: 10000
            })
        }

    }

    priceSorting = e => {
        let priceBy;
        const {
            sessionId,
            maxHotelRating,
            minHotelRating,
            searchPrice
        } = this.props;
        const {
            priceHighToLow,
            priceLowToHigh,
            options,
            sortLowToHigh,
            sortHighToLow,
            searchStr
        } = this.state;

    console.log("::::::::::::::::::::::: thisprice", priceLowToHigh);
    let maxRate = Math.max(...options);
    let minRate = Math.min(...options);
    if (maxRate === -Infinity || minRate === Infinity) {
      maxRate = 5;
      minRate = 1;
    } else {
      maxRate = Math.trunc(maxRate);
      minRate = Math.trunc(minRate);
    }
    let priceorder;
    let sortType = null;
    let sortOrder = null;
    if (priceLowToHigh) {
      sortType = "price";
      sortOrder = "asc";
      priceBy = "price asc, ";
      priceorder = "asc";
    } else if (priceHighToLow) {
      sortType = "price";
      sortOrder = "desc";
      priceorder = "price desc, ";
      priceorder = "desc";
    } else {
      priceorder = "desc";
    }
    let order;
    let ratingorder;
    if (sortLowToHigh === true) {
      sortType = "rating";
      sortOrder = "asc";
      order = "rating asc";
      ratingorder = "asc";
    } else if (sortHighToLow === true) {
      sortType = "rating";
      sortOrder = "desc";
      order = "rating desc";
      ratingorder = "desc";
    } else {
      order = "rating desc";
      ratingorder = "desc";
    }
    let filter = {};
    if (searchPrice.min === 0 && searchPrice.max === 10000) {
      filter = {
        sessionId,
        search: searchStr,
        minRating: minHotelRating,
        maxRating: maxHotelRating,
        from: "0",
        size: "500",
        ratingorder,
        priceorder,
        order: sortOrder,
        type: sortType
      };
    } else {
      filter = {
        sessionId,
        search: searchStr,
        minHotelPrice: searchPrice.min,
        maxHotelPrice: searchPrice.max,
        minRating: minHotelRating,
        maxRating: maxHotelRating,
        from: "0",
        size: "500",
        ratingorder,
        priceorder,
        order: sortOrder,
        type: sortType
      };
    }

    this.props.elasticFilterApply(queryString.stringify(filter));
  };

  handleChange = value => {
    const {
      hotelList,
      hotelStarListCount,
      selectedCurrency,
      sessionId,
      paging,
      maxHotelRating,
      minHotelRating
    } = this.props;
    const {
      searchStr,
      sortLowToHigh,
      sortHighToLow,
      priceLowToHigh,
      priceHighToLow
    } = this.state;
    const values = queryString.parse(window.location.search);
    const {
      searchText,
      checkin,
      checkout,
      adult,
      child,
      childAgeValues,
      premise
    } = values;

    let countryInfo = JSON.parse(localStorage.getItem("currency"));
    countryInfo = countryInfo.COUNTRY_CODE;

    console.log("handlechnage", value);
    var noOfNights = moment(checkout).diff(moment(checkin), "days");
    const price = _filter(this.props.hotelStarListCount, (each, i) => {
      return (
        each.fare.baseFare / noOfNights >= value.min &&
        each.fare.baseFare / noOfNights < value.max
      );
    });
    let ratingorder;
    if (sortLowToHigh === true) {
      ratingorder = "asc";
    } else if (sortHighToLow === true) {
      ratingorder = "desc";
    } else if (sortLowToHigh === false && sortHighToLow === false) {
      ratingorder = "desc";
    }
    let priceorder;
    if (priceLowToHigh === true) {
      priceorder = "asc";
    } else if (priceHighToLow === true) {
      priceorder = "desc";
    } else {
      priceorder = "desc";
    }
    let filter = {};
    if (value.min === 0 && value.max === 10000) {
      filter = {
        sessionId,
        search: searchStr,
        minRating: minHotelRating,
        maxRating: maxHotelRating,
        from: "0",
        size: "500",
        ratingorder,
        priceorder
      };
    } else {
      filter = {
        sessionId,
        search: searchStr,
        minHotelPrice: value.min,
        maxHotelPrice: value.max,
        minRating: minHotelRating,
        maxRating: maxHotelRating,
        from: "0",
        size: "500",
        ratingorder,
        priceorder
      };
    }

    this.props.elasticFilterApply(queryString.stringify(filter));

    let newValue = value;
    newValue.min = value.min < 0 ? 0 : value.min;
    newValue.max = value.max > 10000 ? 100000 : value.max;
    this.setState({
      values: newValue,
      // minRange: newValue.min,
      // maxRange: newValue.max
    });
  };

  getFilterInfo = value => {
    const { minHotelRating, maxHotelRating, selectedCurrency } = this.props;
    const payload = {
      price: {
        min: value.min,
        max: value.max
      },
      currency: selectedCurrency
    };
    this.props.filterHotel(
      this.props.sessionId,
      payload.price
      // payload.currency,
      // minHotelRating,
      // maxHotelRating
    );
  };

  onChangeRating(e) {
    const options = this.state.options;
    const {
      searchStr,
      sortLowToHigh,
      sortHighToLow,
      priceLowToHigh,
      priceHighToLow
    } = this.state;
    const values = queryString.parse(window.location.search);
    const {
      searchText,
      checkin,
      checkout,
      adult,
      child,
      childAgeValues,
      premise
    } = values;

    const { sessionId, selectedCurrency, paging, searchPrice } = this.props;
    let countryInfo = JSON.parse(localStorage.getItem("currency"));
    countryInfo = countryInfo.COUNTRY_CODE;

    let index;
    if (e.target.checked) {
      options.push(+e.target.value);
      options.push(+e.target.value + 0.5);
    } else {
      index = options.indexOf(+e.target.value);
      options.splice(index, 1);
      index = options.indexOf(+e.target.value + 0.5);
      options.splice(index, 1);
    }
    this.setState({ options: options });
    let maxRate = Math.max(...options);
    let minRate = Math.min(...options);
    if (maxRate === -Infinity || minRate === Infinity) {
      maxRate = 5;
      minRate = 1;
    } else {
      maxRate = Math.trunc(maxRate);
      minRate = Math.trunc(minRate);
    }

    let sortType;
    let sortOrder;
    let ratingorder;
    if (sortLowToHigh === true) {
      ratingorder = "asc";
      sortType = "rating";
      sortOrder = "asc";
    } else if (sortHighToLow === true) {
      ratingorder = "desc";
      sortType = "rating";
      sortOrder = "desc";
    } else if (sortLowToHigh === false && sortHighToLow === false) {
      ratingorder = "desc";
    } else {
      sortType = null;
      sortOrder = null;
    }
    let priceorder;
    if (priceLowToHigh === true) {
      priceorder = "asc";
      sortType = "price";
      sortOrder = "asc";
    } else if (priceHighToLow === true) {
      priceorder = "desc";
      sortType = "price";
      sortOrder = "desc";
    } else {
      priceorder = "desc";
    }
    let filter = {};
    if (searchPrice.min === 0 && searchPrice.max === 10000) {
      filter = {
        sessionId,
        search: searchStr,
        minRating: minRate,
        maxRating: maxRate,
        from: "0",
        size: "500",
        ratingorder,
        priceorder,
        order: sortOrder,
        type: sortType
      };
    } else {
      filter = {
        sessionId,
        search: searchStr,
        minRating: minRate,
        maxRating: maxRate,
        minHotelPrice: searchPrice.min,
        maxHotelPrice: searchPrice.max,
        from: "0",
        size: "500",
        ratingorder,
        priceorder,
        order: sortOrder,
        type: sortType
      };
    }

    this.props.elasticFilterApply(queryString.stringify(filter));
  }

  /* Old Using Filter Conditons .... */
  getFilterResult = value => {
    this.getFilterInfo(value);
  };
  rateSort = () => {
    let orderBy;
    const {
      sortLowToHigh,
      sortHighToLow,
      options,
      priceLowToHigh,
      priceHighToLow,
      searchStr
    } = this.state;

    const {
      selectedCurrency,
      sessionId,
      maxHotelRating,
      minHotelRating,
      searchPrice,
      paging
    } = this.props;

    const values = queryString.parse(window.location.search);
    const {
      searchText,
      checkin,
      checkout,
      adult,
      child,
      childAgeValues,
      premise
    } = values;
    let countryInfo = JSON.parse(localStorage.getItem("currency"));
    countryInfo = countryInfo.COUNTRY_CODE;
    let maxRate = Math.max(...options);
    let minRate = Math.min(...options);
    if (maxRate == -Infinity || minRate == Infinity) {
      maxRate = 5;
      minRate = 1;
    } else {
      maxRate = Math.trunc(maxRate);
      minRate = Math.trunc(minRate);
    }
    let ratingorder;
    let sortType;
    let sortOrder;
    if (sortLowToHigh) {
      console.log("sortlowtohin ===================", sortLowToHigh);
      orderBy = "rating asc, ";
      ratingorder = "asc";
      sortOrder = "asc";
      sortType = "rating";
    } else if (sortHighToLow) {
      console.log("sortlowtohin ===================", sortHighToLow);
      orderBy = "rating desc, ";
      ratingorder = "desc";
      sortOrder = "desc";
      sortType = "rating";
    } else {
      ratingorder = "desc";
      sortOrder = null;
      sortType = null;
    }
    let prize;
    let priceorder;
    if (priceLowToHigh) {
      prize = "price asc";
      priceorder = "asc";
      sortOrder = "asc";
      sortType = "price";
    } else if (priceHighToLow) {
      priceorder = "price desc, ";
      priceorder = "desc";
      sortOrder = "desc";
      sortType = "price";
    } else {
      priceorder = "desc";
      sortOrder = null;
      sortType = null;
    }
    let priceBy = orderBy + prize;

    let filter = {};
    if (searchPrice.min === 0 && searchPrice.max === 10000) {
      filter = {
        sessionId,
        search: searchStr,
        minRating: minHotelRating,
        maxRating: maxHotelRating,
        from: "0",
        size: "500",
        ratingorder,
        priceorder,
        order: sortOrder,
        type: sortType
      };
    } else {
      filter = {
        sessionId,
        search: searchStr,
        minHotelPrice: searchPrice.min,
        maxHotelPrice: searchPrice.max,
        minRating: minHotelRating,
        maxRating: maxHotelRating,
        from: "0",
        size: "500",
        ratingorder,
        priceorder,
        order: sortOrder,
        type: sortType
      };
    }
    this.props.elasticFilterApply(queryString.stringify(filter));
  };
  /* Old Using Filter Conditons .... */

  _filterRatingList = [
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
    // { label: "1 Stars", value: 1, refImg: img_star1 }
  ];

  _defAccomodation = [
    { label: "Hotel", value: "Hotel" },
    { label: "Motel", value: "Hotel" },
    { label: "Apart-Hotel", value: "Hotel" },
    { label: "TownHouse", value: "Hotel" },
    { label: "VacationHouse", value: "Hotel" }
  ];

    _defAmenities = [
        {
            label: "Free Cancellation",
            value: "FreeCancellation",
             refImg: img_block
        },
        {
            label: "Free Wifi",
            value: "FreeWifi",
             refImg: img_wifi
        },
        {
            label: "Free parking",
            value: "Freeparking",
             refImg: img_parking
        },
        {
            label: "Free Airport Shuttle",
            value: "FreeAirportShuttle",
             refImg: img_minibus
        },
        {
            label: "Breakfast Included",
            value: "BreakfastIncluded",
             refImg: img_breakfast
        },
        {
            label: "Reseve Now, Pay Later",
            value: "ReseveNowPayLater",
         refImg: img_onlinebooking
        }
    ];

    searchByHotel = e => {
        console.log(e.target.value);
        const name = e.target.name;
        const value = e.target.value;
        const {sessionId, hotelStarListCount, hotelList} = this.props;
        const {searchStr} = this.state;
        this.setState({[name]: value});
    };

  _defAmenities = [
    {
      label: "Free Cancellation",
      value: "FreeCancellation"
      // refImg: img_block
    },
    {
      label: "Free Wifi",
      value: "FreeWifi"
      // refImg: img_wifi
    },
    {
      label: "Free parking",
      value: "Freeparking"
      //  refImg: img_parking
    },
    {
      label: "Free Airport Shuttle",
      value: "FreeAirportShuttle"
      // refImg: img_minibus
    },
    {
      label: "Breakfast Included",
      value: "BreakfastIncluded"
      // refImg: img_breakfast
    },
    {
      label: "Reseve Now, Pay Later",
      value: "ReseveNowPayLater"
      // refImg: img_onlinebooking
    }
  ];
  searchByHotel = e => {
    console.log(e.target.value);
    const name = e.target.name;
    const value = e.target.value;
    const { sessionId, hotelStarListCount, hotelList } = this.props;
    const { searchStr } = this.state;
    this.setState({ [name]: value });
  };

  checkOnPress = e => {
    clearTimeout(this.search);
    const {
      sortLowToHigh,
      sortHighToLow,
      priceLowToHigh,
      priceHighToLow
    } = this.state;
    const value = e.target.value;
    const {
      sessionId,
      hotelStarListCount,
      searchPrice,
      minHotelRating,
      maxHotelRating
    } = this.props;
    if (
      sessionId != "" &&
      sessionId != null &&
      sessionId != undefined &&
      value != null &&
      value != undefined
    ) {
      let ratingorder;
      let sortType;
      let sortOrder;
      if (sortLowToHigh) {
        ratingorder = "asc";
        sortType = "rating";
        sortOrder = "asc";
      } else if (sortHighToLow) {
        ratingorder = "desc";
        sortType = "rating";
        sortOrder = "dec";
      }
      let priceorder;
      if (priceLowToHigh) {
        priceorder = "asc";
        sortType = "price";
        sortOrder = "asc";
      } else if (priceHighToLow) {
        sortType = "price";
        sortOrder = "dec";
      }
      let filter = {};
      if (searchPrice.min === 0 && searchPrice.max === 10000) {
        filter = {
          sessionId,
          search: value,
          minRating: minHotelRating,
          maxRating: maxHotelRating,
          from: "0",
          size: "500",
          ratingorder,
          priceorder,
          order: sortOrder,
          type: sortType
        };
      } else {
        filter = {
          sessionId,
          search: value,
          minRating: minHotelRating,
          maxRating: maxHotelRating,
          minHotelPrice: searchPrice.min,
          maxHotelPrice: searchPrice.max,
          from: "0",
          size: "500",
          ratingorder,
          priceorder,
          order: sortOrder,
          type: sortType
        };
      }
      this.search = setTimeout(() => {
        this.props.searchByHotelName(
          queryString.stringify(filter),
          hotelStarListCount
        );
      }, 500);
    }
  };

  minRangeChange = e => {
    console.log(e.target.value);
    if (this.state.values.max < Number(e.target.value)) {
      return false;
    }
    this.setState({
      minRange: Number(e.target.value),
      values: {
        min: Number(e.target.value),
        max: this.state.values.max
      }
    });

    this.handleChange({
      min: Number(e.target.value),
      max: this.state.values.max
    });
  };

  maxRangeChange = e => {
    console.log(e.target.value);
    let max = e.target.value;
    // if (e.target.value == "10000plus") {
    //   max = 100000;
    // } else {
    //   max = e.target.value;
    // }
    if (this.state.values.min > Number(max)) {
      return false;
    }

    this.setState({
      maxRange: Number(max),
      values: {
        min: this.state.values.min,
        max: Number(max)
      }
    });

    const { checkin, checkout } = queryString.parse(window.location.search);
    var noOfNights = moment(checkout).diff(moment(checkin), "days");
    const price = _filter(this.props.hotelStarListCount, (each, i) => {
      return (
        each.fare.baseFare / noOfNights >= this.state.values.min &&
        each.fare.baseFare / noOfNights < max
      );
    });

        // this.props.priceFiltering(price);
        this.handleChange({
            min: this.state.values.min,
            max: Number(e.target.value)
        });
    };

    hideSorting = (value) => {
        this.setState({
            ...this.state,
            isHidePrice: !(value === "price"),
            isHideRating: !(value === "rating"),
            isHideNeighborHood: !(value === "NeighborHood"),
            isHideStarRating: !(value === "StarRating"),
            isHideAccommodation: !(value === "Accommodation"),
            isHideAmenities: !(value === "Amenities"),
        })
    };


    render() {
        const {
            isRating,
            searchStr,
            priceLowToHigh,
            priceHighToLow,
            sortHighToLow,
            sortLowToHigh
        } = this.state;
        const {isFliterExpand, maximumPriceRange, minimumPriceRange} = this.state;
        const {
            hotelList,
            hotelStarListCount,
            checkin,
            checkout,
            selectedCurrency,
            mapResponsive
        } = this.props;
        // const result = _countBy(_map(hotelStarListCount, "rating")); //Existing Star count from ThirdParty API
        const result = this.props.ratingCount !== {} ? this.props.ratingCount : {};
        const filtetprice = _filter(hotelList, (each, i) => {
            return each.fare.baseFare <= this.state.values.max;
        });
        const selectedCurrencyVal = currencies[this.props.selectedCurrency].symbol;
        const styles = {
            "f-right": {
                float: "right"
            }
        };
        const {minRange, maxRange} = this.state;
        let isUSDCurrency = JSON.parse(localStorage.getItem("currency"));
        isUSDCurrency = isUSDCurrency.ABR_NAME;
        let maxVal;
        if (this.state.values.max > 10000 && isUSDCurrency == "USD") {
            maxVal = "1000+";
        } else if (this.state.values.max > 10000 && isUSDCurrency != "USD") {
            maxVal = "10000+";
        } else {
            maxVal = this.state.values.max;
        }

        return (
            <div className={mapResponsive && mapResponsive <= 915 ? 'mapLargeScreen' : ''}>
                <div
                    style={mapResponsive && mapResponsive <= 915 ? { width: mapResponsive } : {}}
                    className={isFliterExpand ? "filterBg flex-column align-self-start fixToTop showFilterBg" : "filterBg flex-column align-self-start fixToBottom"}
                    id="filterBg">
                    <h2>FILTER BY</h2>
                    <div className="filterTitle"
                         onClick={() => {
                             this.setState({isFliterExpand: !isFliterExpand})
                         }}>
                        {" "}
                        <h2>
                            FILTER BY <img src={downArrow} className="downArrowImg"/>
                        </h2>
                    </div>
                    <div className="respDeskShow">
                        <div>
                            <h4>Search By</h4>
                            <div className="searchInPut">
                                <input
                                    type="text"
                                    className="searchByName"
                                    placeholder="Hotel Name"
                                    name="searchStr"
                                    value={searchStr}
                                    onChange={this.searchByHotel}
                                    onKeyUp={this.checkOnPress}
                                />
                                {/* onChange={this.searchByHotel} */}
                            </div>
                        </div>
                        <div>
                            <h4>Price Range</h4>
                            <div className="slideRange">
                                <InputRange
                                    maxValue={maximumPriceRange}
                                    minValue={minimumPriceRange}
                                    formatLabel={value => ``}
                                    onChangeComplete={value => this.handleChange(value)}
                                    onChange={values => this.setState({values})}
                                    value={this.state.values}
                                />
                            </div>
                            <span className="rangeVauleLeft">
              <span style={{fontSize: "16px"}}>{selectedCurrencyVal}</span>
                                &nbsp;{this.state.values.min}
            </span>
                            <span className="rangeVauleRight">
              <span style={{fontSize: "16px"}}>{selectedCurrencyVal}</span>
                                &nbsp;
                                {maxVal}
            </span>
                            {isUSDCurrency != "USD" ?
                                <div>
                                    <select
                                        value={minRange}
                                        name="minRange"
                                        onChange={this.minRangeChange}
                                    >
                                        <option value={0}>0</option>
                                        <option value={2000} selected={minRange == 2000}>
                                            2000
                                        </option>
                                        <option value={4000} selected={minRange == 4000}>
                                            4000
                                        </option>
                                        <option value={7000} selected={minRange == 7000}>
                                            7000
                                        </option>
                                        <option value={10000} selected={minRange == 10000}>
                                            10000
                                        </option>
                                    </select>
                                    <select
                                        value={maxRange}
                                        onChange={this.maxRangeChange}
                                        style={styles["f-right"]}
                                    >
                                        <option value={2000} selected={maxRange == 2000}>
                                            2000
                                        </option>
                                        <option value={4000} selected={maxRange == 4000}>
                                            4000
                                        </option>
                                        <option value={7000} selected={maxRange == 7000}>
                                            7000
                                        </option>
                                        <option value={10000} selected={maxRange == 10000}>
                                            10000
                                        </option>
                                        <option
                                            value={100000}
                                            selected={this.state.values.max == 100000}
                                        >
                                            10000+
                                        </option>
                                    </select>
                                </div>
                                :
                                <div>
                                    <select
                                        value={minRange}
                                        name="minRange"
                                        onChange={this.minRangeChange}
                                    >
                                        <option value={0}>0</option>
                                        <option value={200} selected={minRange == 200}>
                                            200
                                        </option>
                                        <option value={400} selected={minRange == 400}>
                                            400
                                        </option>
                                        <option value={700} selected={minRange == 700}>
                                            700
                                        </option>
                                        <option value={1000} selected={minRange == 1000}>
                                            1000
                                        </option>
                                    </select>
                                    <select
                                        value={maxRange}
                                        onChange={this.maxRangeChange}
                                        style={styles["f-right"]}
                                    >
                                        <option value={200} selected={maxRange == 200}>
                                            200
                                        </option>
                                        <option value={400} selected={maxRange == 400}>
                                            400
                                        </option>
                                        <option value={700} selected={maxRange == 700}>
                                            700
                                        </option>
                                        <option value={1000} selected={maxRange == 1000}>
                                            1000
                                        </option>
                                        <option
                                            value={100000}
                                            selected={this.state.values.max == 100000}
                                        >
                                            1000+
                                        </option>
                                    </select>
                                </div>
                            }

                        </div>

                        <div>
                            <h4 style={{cursor: "pointer"}} onClick={() => this.hideSorting("price")}>
                                Sort By Price <span style={{
                                cursor: "pointer",
                                fontSize: '16px',
                                color: 'white'
                            }} className="fa fa-angle-double-down float-right"></span>
                            </h4>
                            <ul className={this.state.isHidePrice ? "hideSection" : "priceRange"}>
                                <li>
                                    <input
                                        className="filtercheckbox"
                                        id="priceRange90"
                                        type="checkbox"
                                        checked={this.state.priceLowToHigh}
                                        onChange={() => {
                                            this.setState(
                                                {
                                                    priceLowToHigh: !priceLowToHigh,
                                                    priceHighToLow: false,
                                                    sortHighToLow: false,
                                                    sortLowToHigh: false
                                                },
                                                () => this.priceSorting()
                                            );
                                        }}
                                    />
                                    <label htmlFor="priceRange90">
                                        <p>Low - High </p>
                                    </label>
                                </li>
                                <li>
                                    <input
                                        className="filtercheckbox"
                                        id="priceRange91"
                                        type="checkbox"
                                        checked={this.state.priceHighToLow}
                                        onChange={() => {
                                            this.setState(
                                                {
                                                    priceHighToLow: !priceHighToLow,
                                                    priceLowToHigh: false,
                                                    sortHighToLow: false,
                                                    sortLowToHigh: false
                                                },
                                                () => this.priceSorting()
                                            );
                                        }}
                                    />
                                    <label className="hidden" htmlFor="priceRange91">
                                        <p>High - Low </p>
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <div className="hidden">
                            <h4 style={{cursor: "pointer"}} onClick={() => this.hideSorting("rating")}>
                                Sort By Rating <span style={{
                                cursor: "pointer",
                                fontSize: '16px',
                                color: 'white'
                            }} className="fa fa-angle-double-down float-right"></span>
                            </h4>
                            <ul className={this.state.isHideRating ? "hideSection" : "priceRange"}>
                                <li>
                                    <input
                                        className="filtercheckbox"
                                        id="priceRange93"
                                        type="checkbox"
                                        checked={this.state.sortLowToHigh}
                                        onChange={() => {
                                            this.setState(
                                                {
                                                    sortLowToHigh: !sortLowToHigh,
                                                    sortHighToLow: false,
                                                    priceLowToHigh: false,
                                                    priceHighToLow: false,
                                                },
                                                () => this.priceSorting()
                                            );
                                        }}
                                    />
                                    <label htmlFor="priceRange93">
                                        <p>Low - High </p>
                                    </label>
                                </li>
                                <li>
                                    <input
                                        className="filtercheckbox"
                                        id="priceRange94"
                                        type="checkbox"
                                        checked={this.state.sortHighToLow}
                                        onChange={() => {
                                            this.setState(
                                                {
                                                    sortHighToLow: !sortHighToLow,
                                                    sortLowToHigh: false,
                                                    priceLowToHigh: false,
                                                    priceHighToLow: false,
                                                },
                                                () => this.priceSorting()
                                            );
                                        }}
                                    />
                                    <label htmlFor="priceRange94">
                                        <p>High - Low </p>
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{cursor: "pointer"}} onClick={() => this.hideSorting("StarRating")}> Star
                                Rating <span
                                    style={{cursor: "pointer", fontSize: '16px', color: 'white'}}
                                    className="fa fa-angle-double-down float-right"></span></h4>
                            <ul className={this.state.isHideStarRating ? "hideSection" : "priceRange"}>
                                {this._filterRatingList.map((each, i) => (
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
                                            /* name={each.value} */
                                            value={each.value}
                                            /* checked={isRating[each.value]} */
                                            /* onChange={this.toggleRating} */
                                            onChange={this.onChangeRating.bind(this)}
                                        />
                                        <label htmlFor={`priceRange_${i}`}>
                                            <img alt="" src={each.refImg}/>
                                            <p>
                                                {each.label} (
                                                {result[each.value + 0.5]
                                                    ? result[each.value] + result[each.value + 0.5] ||
                                                    result[each.value + 0.5]
                                                    : result[each.value] || 0}
                                                ){" "}
                                            </p>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 style={{cursor: "pointer"}}
                                onClick={() => this.hideSorting("Accommodation")}>Accommodation
                                Type
                                <span style={{fontSize: '16px', color: 'white'}}
                                      className="fa fa-angle-double-down float-right"></span></h4>
                            <ul className={this.state.isHideAccommodation ? "hideSection" : "priceRange"}>
                                {this._defAccomodation.map((each, i) => (
                                    <li key={i}>
                                        <input
                                            type="checkbox"
                                            id={`acc_${i}`}
                                            name={each.value}
                                            className="filtercheckbox"
                                            value=""
                                            disabled
                                        />
                                        <label htmlFor={`acc_${i}`}>{each.label}</label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 onClick={() => this.hideSorting("NeighborHood")}
                                style={{cursor: "pointer"}}>Neighborhood
                                <span style={{fontSize: '16px', color: 'white'}}
                                      className="fa fa-angle-double-down float-right"></span></h4>
                            {/* <ul>
              {this._defNghood.map((each, i) => (
                <li key={i}>
                  <input
                    type="checkbox"
                    id={`nghood_${i}`}
                    name={each.value}
                    className="filtercheckbox"
                    value=""
                    disabled
                  />
                  <label htmlFor={`nghood_${i}`}>{each.label}</label>
                </li>
              ))}
            </ul> */}
                            <p className={this.state.isHideNeighborHood ? "hideSection" : "priceRange"}
                               style={{fontWeight: normalize, fontSize: "13px", color: "#fff"}}
                            >
                                {" "}
                                Coming Soon{" "}
                            </p>

                            {/* <ul>
              {this._defNghood.map((each, i) => <li key={i}>
                  <input type="checkbox" id={`nghood_${i}`} name={each.value} className="filtercheckbox" value="" disabled />
                  <label htmlFor={`nghood_${i}`}>{each.label}</label>
                </li>)}
            </ul> */}
                    </div>
                    <div>
                        <h4 onClick={() => this.hideSorting("Amenities")} style={{cursor: "pointer"}}>
                            Amenities
                            <span style={{fontSize: '16px', color: 'white'}}
                                  className="fa fa-angle-double-down float-right"></span>
                        </h4>
                        <ul className={this.state.isHideAmenities ? "hideSection" : ""}>
                            {this._defAmenities.map((each, i) => (
                               
                                <li key={i}>
                            
                                    <input
                                        type="checkbox"
                                        id={`ament_${i}`}
                                        name={each.value}
                                        className="filtercheckbox"
                                        value=""
                                        disabled
                                    />
                                    <label htmlFor={`ament_${i}`}>
                                        <img alt="" src={each.refImg} style={{paddingRight:"5px", paddingLeft:"5px"}}/>
                                        {each.label}
                                    </label>
                                </li>
                            ))}
                        <span style={{color:"skyblue",fontSize:"15px", paddingRight:"5px"}}> Show more <span className="fa fa-angle-down "></span> </span>
                        </ul>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    sessionId: state.hotelReducer.sessionId,
    searchPrice: state.hotelReducer.searchPrice,
    minHotelRating: state.hotelReducer.minHotelRating,
    maxHotelRating: state.hotelReducer.maxHotelRating,
    isHotelRest: state.hotelReducer.isHotelRest,
    hotel: state.hotelReducer.hotel,
    hotelList: state.hotelReducer.hotelList,
    selectedCurrency: state.commonReducer.selectedCurrency,
    hotelStarListCount: state.hotelReducer.hotelStarListCount,
    paging: state.hotelReducer.paging,
    isFilter: state.hotelReducer.isFilter,
    currencyDetails: state.hotelReducer.currencyDetails,
    ratingCount: state.hotelReducer.ratingCount
});
const mapDispatchToProps = dispatch => ({
    searchHotel: searchInfo => dispatch(searchHotel(searchInfo)),
    filterHotel: (sessionId, price, minHotelRating, maxHotelRating) =>
        dispatch(filterHotel(sessionId, price, minHotelRating, maxHotelRating)),
    searchByHotelName: (hotelFilterdStr, hotelStarListCount) =>
        dispatch(searchByHotelName(hotelFilterdStr, hotelStarListCount)),
    searchByRating: (sessionId, pagingOpt, filters) =>
        dispatch(searchByRating(sessionId, pagingOpt, filters)),
    priceFiltering: ratingFilter => dispatch(priceFiltering(ratingFilter)),
    filteringOption: filter => dispatch(filteringOption(filter)),
    elasticFilterApply: filter => dispatch(elasticFilterApply(filter)),
    getRating: sessionId => dispatch(getRating(sessionId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultFilter);
