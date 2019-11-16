import React, {Component} from "react";
import PackageCard from "./PackageCard";
import PackageResultFilter from "./PackageResultFilter";

import queryString from "query-string";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import _get from "lodash/get";

import {packageSearch} from "../../../service/package/action";

import img_down from "../../../asset/images/downarrow.png";
import AlertHotelCard from "../../presentational/AlertHotelCard";

class PackageSearchResult extends Component {
    state = {
        pageNo: 1,
        offsetHeight: 1000
    };

    componentDidMount() {
        this.getPackageList(this.props.location);
    }

    componentWillReceiveProps(newProps) {
      //  console.log("package newProps ===>", newProps);
        if (this.props.location !== newProps.location) {
            this.getPackageList(newProps.location);
        }
    }

    getPackageList = location => {
        const values = queryString.parse(location.search);

        const {fromDate, toDate,searchText, limit, offsetLimit} = values;
        let packagePayload = {
            countryId: searchText,
            fromDate: fromDate,
            toDate: toDate,
            offsetLimit,
            limit,
            currencyCode: this.props.selectedCurrency,
            email: _get(this.props, 'loginDetails.email', null),
        };
        this.props.packageSearch(packagePayload);
    };


    onScroll = e => {
        if (
            e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight &&
            this.props.packageCount) {
            this.loadMore();
        }
    };



        loadMore = () => {
            if (this.props.packageCount !== 0) {
                if (this.props.skippedCount < this.props.packageCount) {
                    const values = queryString.parse(location.search);
                    const {date, searchText} = values;
                    let packagePayload = {
                        countryId: searchText,
                        fromDate: fromDate,
                        toDate: toDate,
            
                        offsetLimit: this.props.skippedCount,
                        limit: parseInt(this.props.skippedCount) + 100,
                        currencyCode: this.props.selectedCurrency,
                        email: _get(this.props, 'loginDetails.email', null),
                    };
                    this.props.packageSearch(packagePayload);
                }
            }
        };

    render() {
        let packageList = this.props.packageList.data;
        let clientWidth;
        let offsetHeight;

        try {
            clientWidth = document.body.clientWidth;
            if (+clientWidth > 1199 || +clientWidth > 1187) {
                offsetHeight = document.getElementById("filterResult").offsetHeight;
            } else {
                offsetHeight = 1190;
            }
        } catch (e) {
            offsetHeight = 1190;
        }

        return (
            <div className="d-flex flex-row tab-column justify-content-start">
               <PackageResultFilter/>
                <div className="filterResult">
                    <div className="cardDetailsHowBg" id="content" style={{height: "1735" + "px"}}
                         onScroll={this.onScroll}>
                        {packageList && packageList.length !== 0 && packageList.map((data, index) => {
                            return <PackageCard packageDetails={data}
                                                 searchDetails={queryString.parse(this.props.location.search)}/>;
                        })}
                        
                        {packageList && packageList.length === 0 &&
                        (<AlertHotelCard type="package" alertInfo="No Packages Available"/>)}
                    </div>
                </div>
            </div>
        );
   }
}

const mapStateToProps = state => ({
    packageList: state.packageReducer.packageList,
    packageCount: state.packageReducer.packageCount,
    skippedCount: state.packageReducer.skippedCount,
    isLoadMoreAvailable: state.packageReducer.isLoadMoreAvailable,
    selectedCurrency: state.commonReducer.selectedCurrency,
    countryCode: state.commonReducer.countryCode,
    loginDetails: state.loginReducer.loginDetails,
});

const mapDispatchToProps = dispatch => ({
    packageSearch: searchInfo => dispatch(packageSearch(searchInfo)),
    // searchRoom: (sessionId, hotelId, selectedCurrency, email) =>
    //     dispatch(searchRoom(sessionId, hotelId, selectedCurrency, email)),
    // filterHotelLoadMore: (sessionId, searchPrice, PerpageSize, filters, searchString, hotelCount) =>
    //     dispatch(filterHotelLoadMore(sessionId, searchPrice, PerpageSize, filters, searchString, hotelCount)),
    // loadExistsData: hotels => dispatch(loadExistsData(hotels))
});

// const mapDispatchToProps = dispatch => ({
//     packageSearch: data => dispatch(packageSearch(data))
// });


export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PackageSearchResult)
);

