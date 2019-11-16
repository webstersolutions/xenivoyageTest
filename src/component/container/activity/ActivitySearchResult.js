import React, {Component} from "react";
import ActivityCard from "./ActivityCard";
import ActivityResultFilter from "./ActivityResultFilter";

import queryString from "query-string";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import _get from "lodash/get";

import {activitySearch} from "../../../service/activities/action";

import img_down from "../../../asset/images/downarrow.png";
import AlertHotelCard from "../../presentational/AlertHotelCard";

class ActivitySearchResult extends Component {
    state = {
        pageNo: 1,
        offsetHeight: 1000,
        offSet: 1000
    };

    componentDidMount() {
        this.getActivityList(this.props.location);
    }

    componentWillReceiveProps(newProps) {
        console.log("activity newProps ===>", newProps);
        if (this.props.location !== newProps.location) {
            this.getActivityList(newProps.location);
        }
    }

    getActivityList = location => {
        const values = queryString.parse(location.search);
        const {date, searchText, limit, offsetLimit} = values;
        let activityPayload = {
            destinationName: searchText,
            activityDate: date,
            offsetLimit,
            limit,
            currencyCode: this.props.selectedCurrency,
            email: _get(this.props, 'loginDetails.email', null),
        };
        this.props.activitySearch(activityPayload);
    };


    onScroll = e => {
        if (
            e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight &&
            this.props.activityCount) {
            this.loadMore();
        }
    };


    loadMore = () => {
        if (this.props.activityCount !== 0) {
            if (this.props.skippedCount < this.props.activityCount) {
                const values = queryString.parse(location.search);
                const {date, searchText} = values;
                let activityPayload = {
                    destinationName: searchText,
                    activityDate: date,
                    offsetLimit: this.props.skippedCount,
                    limit: parseInt(this.props.skippedCount) + 100,
                    currencyCode: this.props.selectedCurrency,
                    email: _get(this.props, 'loginDetails.email', null),
                };
                this.props.activitySearch(activityPayload);
            }
        }
    };

    checkOffsetHeight = (offSetHeight) => {
        console.log("qwqw", offSetHeight)
        this.setState({
            offSet: offSetHeight
        })
    }

    render() {
        let activityList = this.props.activityList.data;
       
        let clientWidth;
        let offsetHeight;
        let offSet;

        try {
            clientWidth = document.body.clientWidth;
            offSet = document.getElementById("filterResultId").offsetHeight;
            if (+clientWidth > 1199 || +clientWidth > 1187) {
                offsetHeight = offSet;
            } else {
                offsetHeight = 1190;
            }
        } catch (e) {
            offsetHeight = 1190;
        }
        return (
            <div className="d-flex flex-row tab-column justify-content-start">
                <ActivityResultFilter checkOffsetHeight={this.checkOffsetHeight} />
                <div className="filterResult" id="filterResultId">
                    <div className="cardDetailsHowBg" id="content" style={{height: this.state.offSet + "px"}}
                         onScroll={this.onScroll}>
                        {activityList && activityList.length !== 0 && activityList.map((data, index) => {
                            return <ActivityCard activityDetails={data}
                                                 searchDetails={queryString.parse(this.props.location.search)}/>;
                        })}
                        {activityList && activityList.length === 0 &&
                        (<AlertHotelCard type="activity" alertInfo="No Activities Available"/>)}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    activityList: state.activityReducer.activityList,
    activityCount: state.activityReducer.activityCount,
    skippedCount: state.activityReducer.skippedCount,
    isLoadMoreAvailable: state.activityReducer.isLoadMoreAvailable,
    selectedCurrency: state.commonReducer.selectedCurrency,
    countryCode: state.commonReducer.countryCode,
    loginDetails: state.loginReducer.loginDetails,
});

const mapDispatchToProps = dispatch => ({
    activitySearch: data => dispatch(activitySearch(data))
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ActivitySearchResult)
);
