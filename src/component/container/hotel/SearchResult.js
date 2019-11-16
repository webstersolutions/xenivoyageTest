import React from "react";
import queryString from "query-string";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import {filter as _filter, get as _get} from "lodash";
import $ from 'jquery';
import ResultFilter from "../ResultFilter";
import _noop from 'lodash/noop';

import {
    searchRoom,
    searchHotel,
    filterHotelLoadMore,
    loadExistsData,
    compareHotel
} from "../../../service/hotel/action";

import {
    loadingGifSearch,
    stopGifSearching
  } from "../../../service/common/action";

import HotelCard from "../../presentational/HotelCard";
import AlertHotelCard from "../../presentational/AlertHotelCard";
import Loading from "../../Loading";
import openNewTab from "../../../asset/images/dashboard/resize.png";

import img_down from "../../../asset/images/downarrow.png";

var currencies = require("country-data").currencies;

const values = queryString.parse(window.location.search);

import request from "../../../Utils/request-process";

import URL from "../../../asset/configUrl";

class SearchResult extends React.Component {
    state = {
        items: Array.from({length: 20}),
        hasMoreItems: true,
        checkinDate: values.checkin,
        checkoutDate: values.checkout,
        visible: 30,
        pageNo: 1,
        pageSize: 30,
        offsetHeight: 1000,
        compareList: [],
        compareDatas: false
    };

    static defaultProps = {
        onHoverHotel: _noop,
        topHotelId: _noop,
    };

    componentDidMount() {
        // if (!this.props.sessionId) {
        //   this.getHotelList(this.props.location);
        // }
        // if (this.props.searchByHotel.length == 0) {
        this.getHotelList(this.props.location);
        sessionStorage.setItem("searchURL", window.location.search);
        // }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.location !== newProps.location) {
            this.getHotelList(newProps.location, true);
        }
    }

    scrollTop = () => {
        $("html, body").animate({scrollTop: 530}, 1000);
        $("div.cardDetailsHowBg").animate({scrollTop: 0}, 1000);
    }
    getHotelList = (location, forceGet = false) => {
        const values = queryString.parse(location.search);
        const {
            searchText,
            checkin,
            checkout,
            adult,
            child,
            childAgeValues,
            premise,
            lat = null,
            lng = null,
            radius = null,
            room,
            nationality
        } = values;
        const {selectedCurrency, countryCode} = this.props;
        let countryInfo = JSON.parse(localStorage.getItem("currency"));
        countryInfo = countryInfo.COUNTRY_CODE;

        this.setState({checkinDate: checkin, checkoutDate: checkout});
        const searchInfo = {
            currency: selectedCurrency,
            searchString: searchText,
            paging: {
                pageNo: this.state.pageNo,
                pageSize: this.state.pageSize,
                orderBy: "rating desc, price desc"
            },
            date: {
                start: checkin,
                end: checkout
            },
            adult,
            child,
            childAgeValues,
            allowedCountry: countryInfo,
            premise,
            lat,
            lng,
            radius,
            email: _get(this.props, 'loginDetails.email', ""),
            room,
            nationality
        };
        if(!forceGet && this.props.hotelStarListCount.length > 0 && sessionStorage.getItem("searchURL") !=null && sessionStorage.getItem("searchURL") !="" && sessionStorage.getItem("searchURL") !=undefined){
        // let isBackWard = sessionStorage.getItem("isBackWard");
        // if (isBackWard == "1" && this.props.hotelStarListCount.length > 0) {
            this.props.loadExistsData(this.props.hotelStarListCount);
        } else {
            this.props.searchHotel(searchInfo);
        }
    };

    handleOnSelectRoom = hotelId => {

        sessionStorage.setItem("roomURL", "");
		sessionStorage.setItem("reserveURL", "");

        const {sessionId, selectedCurrency} = this.props;

        const values = queryString.parse(window.location.search);
        const {
            checkin,
            checkout,
            adult,
            child,
            childAgeValues,
            searchText
        } = values;

        const searchString = {
            currency: selectedCurrency,
            sessionId,
            hotelId,
            checkin,
            checkout,
            adult,
            child,
            childAgeValues,
            searchText
        };
        sessionStorage.setItem(
            "maphotelList",
            JSON.stringify(this.props.hotelList)
        );
        this.props.history.push(
            "/hotel/rooms?" + queryString.stringify(searchString)
        );
    };

    loadMore = () => {
        let countryInfo = JSON.parse(localStorage.getItem("currency"));
        countryInfo = countryInfo.COUNTRY_CODE
        const values = queryString.parse(location.search);
        const {
            searchText
        } = values;
        const {
            sessionId,
            searchPrice,
            paging,
            selectedCurrency,
            minHotelRating,
            maxHotelRating
        } = this.props;
        let orderBy =
            paging.orderBy == null || paging.orderBy == undefined
                ? "rating desc, price desc"
                : paging.orderBy;
        const page = {
            pageNo: paging.pageNo + 1,
            pageSize: 30,
            currency: selectedCurrency,
            allowedCountry: countryInfo,
            orderBy: orderBy
        };
        let filters = {};
        if (searchPrice.min === 0 && searchPrice.max === 10000) {
            filters = {
                maxHotelRating: maxHotelRating,
                minHotelRating: minHotelRating
            };
        } else {
            filters = {
                minHotelPrice: searchPrice.min,
                maxHotelPrice: searchPrice.max,
                maxHotelRating: maxHotelRating,
                minHotelRating: minHotelRating
            };
        }
        let searchString = searchText
        // filters = {};
        // const filters = {
        //   minHotelPrice: searchPrice.min,
        //   maxHotelPrice: searchPrice.max,
        //   maxHotelRating: maxHotelRating,
        //   minHotelRating: minHotelRating
        // };
        this.props.filterHotelLoadMore(sessionId, searchPrice, page, filters, searchString, this.props.hotelCount);
    };

    onScroll = e => {
        const hotelCardHeight = document.getElementsByClassName('hotelCard')[0].offsetHeight;
        const { target: { scrollTop, offsetHeight, scrollHeight } } = e;
        const hotelIndex = 30 - Math.ceil((scrollHeight - scrollTop) / (hotelCardHeight + 30));

        if (this.props.searchByHotel.length > hotelIndex && hotelIndex >= 0) {
            if (this.props.searchByHotel[hotelIndex]) {
                this.props.topHotelId(this.props.searchByHotel[hotelIndex].id);
            }
        }

        if (
            scrollTop + offsetHeight >= scrollHeight &&
            this.props.hotelCount >
            this.props.searchByHotel.length + this.props.skippedCount
        ) {
            this.loadMore();
        }
    };

    compareHotel = (hotel) => {
        // const {sessionId, selectedCurrency} = this.props;
        // const {id} = hotel;
        // const roomPayload = {
        //     currency: selectedCurrency,
        //     email: _get(this.props, 'loginDetails.email', ""),
        //     hotelId: id,
        //     sessionId
        // }
        // this.props.loadingGifSearch();
        // request.post(URL.hotel.ROOM_SEARCH, roomPayload).then(response => {
        //     this.props.stopGifSearching();
        //     let hotelData = response.data.data
        //     this.props.compareHotel([...this.props.compareHotelList, hotelData])
        // }).catch((error) => {
        //     console.log(error)
        //     this.props.stopGifSearching();
        //     this.props.compareHotel([...this.props.compareHotelList, []])
        // })
        this.props.compareHotel([...this.props.compareHotelList, hotel])
        
    }

    render() {
        const {isSearching, searchByHotel, searchDate, filterCount, response, mapResponsive} = this.props;
        //  const loader = <div className="loader">Loading ...</div>;
        const {checkinDate, checkoutDate, compareList} = this.state;
        // TODO : if infinity issue persist un command following things
        const values = queryString.parse(window.location.search);
        const checkin = values.checkin;
        const checkout = values.checkout;

        let clientWidth;
        let offsetHeight;

        try {
            clientWidth = document.body.clientWidth;
            if (+clientWidth > 1199 || +clientWidth > 1187) {
                offsetHeight = document.getElementById("filterBg").offsetHeight;
            } else {
                offsetHeight = 1000;
            }
        } catch (e) {
            offsetHeight = 1000;
        }
        let innerWidth = window.innerWidth;
        let isMobile = false;
        if (innerWidth >= 320 && innerWidth <= 768) {
            isMobile = true;
        } else if (innerWidth < 915) {
            isMobile = true;
            offsetHeight = 700
        } else {
            offsetHeight = 800
        }
        return (
            <div className="d-flex flex-row tab-column justify-content-start">
                <ResultFilter mapResponsive={mapResponsive}/>
                <div className="filterResult" style={{marginBottom: "30px"}}>
                    {!isSearching && (
                        <React.Fragment>
                            {/* <button className="newTabBtn" onClick={() => window.open(window.location, "_blank")}><img src={openNewTab} /> Open in new tab</button> */}

                            <div
                                className="cardDetailsHowBg"
                                id="content"
                                style={{height: offsetHeight + "px"}}
                                onScroll={this.onScroll}
                            >
                                {/* <InfiniteScroll
                dataLength={searchByHotel.length && this.props.isSearchingFilter}
                loadMore={this.loadItems.bind(this)}
                hasMore={this.state.hasMoreItems}
                // loader={loader}
                pageStart={0}
                scrollableTarget="content"
              > */}
                                {searchByHotel.length && this.props.isSearchingFilter ? (
                                    <div className="loaderbg1">
                                        <div id="loader"/>
                                    </div>
                                ) : null}
                                {searchByHotel.length ? (
                                    searchByHotel.map((hotel, index) => {
                                        return (
                                            <div>
                                                {filterCount === -1 && index === 0 ? (
                                                    <div className="non-filter-result-heading">
                                                        Rooms not available in your searched hotel, If you
                                                        like this hotel, you might also be interested in
                                                    </div>
                                                ) : null}
                                                <HotelCard
                                                    key={index}
                                                    checkout={checkout}
                                                    checkin={checkin}
                                                    onSelectHotel={this.handleOnSelectRoom}
                                                    hotel={hotel}
                                                    onHoverHotel={this.props.onHoverHotel}
                                                    compareHotel={this.compareHotel}
                                                />
                                                {filterCount !== null && index === filterCount ? (
                                                    <div className="non-filter-result-heading">
                                                        If you like this hotel, you might also be interested
                                                        in
                                                    </div>
                                                ) : null}
                                            </div>
                                        );
                                    })
                                ) : (response === "362" ? (
                                        this.props.history.push("/MaintenancePage")
                                    ) : (
                                        <AlertHotelCard
                                            type="hotel"
                                            alertInfo="No Hotels Available"
                                        />
                                    )
                                )}
                                {/* </InfiniteScroll> */}
                                {/* this.props.hotelList.length >= 30  */}
                                {/*(this.props.hotelList && this.props.searchByHotel.length > 0) ?
                  <div className="text-center">
                    <button type='button' className='clickMoreBtn searchBtn' onClick={this.loadMore}><img src={img_down} alt='down' /></button>
                  </div> : null*/}
                                {this.props.hotelList &&
                                this.props.hotelCount >
                                this.props.searchByHotel.length + this.props.skippedCount &&
                                isMobile ? (
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            className="clickMoreBtn searchBtn"
                                            onClick={this.loadMore}
                                        >
                                            <img src={img_down} alt="down"/>
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        </React.Fragment>
                    )}
                </div>
                <div onClick={this.scrollTop} className="scrollTopBtn" title="Scroll to top"
                     style={{position: "absolute", bottom: "6px", right: "15px"}}><i className="fas fa-arrow-up"></i>
                </div>
            </div>
        );
    }
}

const FilterdHotelList = (list, searchStr) => {
    return _filter(list, hotelName => {
        return hotelName.name.toLowerCase().includes(searchStr.toLowerCase());
    });
};

const mapStateToProps = state => ({
    isSearching: state.hotelReducer.isSearching,
    hotelList: state.hotelReducer.hotelList,
    hotelStarListCount: state.hotelReducer.hotelStarListCount,
    hotelCount: state.hotelReducer.hotelCount,
    sessionId: state.hotelReducer.sessionId,
    searchPrice: state.hotelReducer.searchPrice,
    searchDate: state.hotelReducer.searchDate,
    currency: state.hotelReducer.currency,
    paging: state.hotelReducer.paging,
    searchByHotel: FilterdHotelList(
        state.hotelReducer.hotelList,
        state.hotelReducer.hotelFilterStr
    ),
    selectedCurrency: state.commonReducer.selectedCurrency,
    countryCode: state.commonReducer.countryCode,
    filterCount: state.hotelReducer.filterCount,
    minHotelRating: state.hotelReducer.minHotelRating,
    maxHotelRating: state.hotelReducer.maxHotelRating,
    skippedCount: state.hotelReducer.skippedCount,
    response: state.hotelReducer.response,
    loginDetails: state.loginReducer.loginDetails,
    compareHotelList: state.hotelReducer.compareHotelList
});
const mapDispatchToProps = dispatch => ({
    searchHotel: searchInfo => dispatch(searchHotel(searchInfo)),
    searchRoom: (sessionId, hotelId, selectedCurrency, email) =>
        dispatch(searchRoom(sessionId, hotelId, selectedCurrency, email)),
    filterHotelLoadMore: (sessionId, searchPrice, PerpageSize, filters, searchString, hotelCount) =>
        dispatch(filterHotelLoadMore(sessionId, searchPrice, PerpageSize, filters, searchString, hotelCount)),
    loadExistsData: hotels => dispatch(loadExistsData(hotels)),
    compareHotel: (hotel) => dispatch(compareHotel(hotel)),
    loadingGifSearch: () => dispatch(loadingGifSearch()),
    stopGifSearching: () => dispatch(stopGifSearching())
});
export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(SearchResult)
);
