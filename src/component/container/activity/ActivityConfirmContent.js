import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import ActivityReservation from "./ActivityReservation";
import ActivityPayment from "./ActivityPayment";
import moment from 'moment';
import queryString from "query-string";
import {find as _find, forEach as _forEach, get as _get, isEmpty as _isEmpty, map as _map} from "lodash";

import {getActivityInfo, getActivityPrice, getActivityHotels} from "../../../service/activities/action";

class ActivityConfirmContent extends Component {
    state = {
        selectedActivityPrice: null,
        traveller: null,
        totalTravellers: 0,
    };

    componentDidMount() {
        const {code, date, ageBands} = queryString.parse(this.props.location.search);

        if (_isEmpty(this.props.selectedActivity)) {
            this.props.getActivityInfo(code +
                `&currencyCode=${this.props.selectedCurrency}&email=${_get(this.props, 'loginDetails.email', null)}`);
        } else if (this.props.selectedActivity.hotelPickup) {
            this.props.getActivityHotels(code)
        }

        if (_isEmpty(this.props.selectedActivityFinalPrice)) {
            const payload = {
                productCode: code,
                currencyCode: this.props.selectedCurrency,
                bookingDate: moment(date, "MM/DD/YYYY").format("YYYY-MM-DD"),
                ageBands: JSON.parse(ageBands),
                email: _get(this.props, 'loginDetails.email', null),
            };

            this.props.getActivityPrice(payload);
        } else {
            const {gradeCode} = queryString.parse(this.props.location.search);
            this.setState({
                selectedActivityPrice: _find(this.props.selectedActivityFinalPrice, ['gradeCode', gradeCode])
            }, () => {
                if (!_isEmpty(this.state.selectedActivityPrice) && !_isEmpty(this.props.selectedActivity)) {
                    let totalTravellers = 0;
                    this.setState({
                        traveller: _map(
                            this.state.selectedActivityPrice.ageBands,
                            ({count, pricePerTravelerFormatted, bandId}, i) => {
                                let travellerType = '';
                                let separation = '';
                                _forEach(this.props.selectedActivity.ageBands, value => {
                                    if (value.bandId === bandId) {
                                        travellerType = value.description;
                                    }
                                });

                                if (i >= 1 && i < this.state.selectedActivityPrice.ageBands.length) {
                                    separation = ', '
                                }
                                totalTravellers += count;
                                return ` ${count} ${travellerType}${separation} `;
                            }
                        )
                    }, () => {
                        this.setState({
                            totalTravellers,
                        })
                    });
                }
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const {gradeCode, code} = queryString.parse(this.props.location.search);
        this.setState({
            selectedActivityPrice: _find(nextProps.selectedActivityFinalPrice, ['gradeCode', gradeCode])
        }, () => {
            if (!_isEmpty(this.state.selectedActivityPrice) && !_isEmpty(nextProps.selectedActivity)) {
                let totalTravellers = 0;
                this.setState({
                    traveller: _map(
                        this.state.selectedActivityPrice.ageBands,
                        ({count, pricePerTravelerFormatted, bandId}, i) => {
                            let travellerType = '';
                            let separation = '';

                            _forEach(nextProps.selectedActivity.ageBands, value => {
                                if (value.bandId === bandId) {
                                    travellerType = value.description;
                                }
                            });

                            if (i >= 1 && i < this.state.selectedActivityPrice.ageBands.length) {
                                separation = ', '
                            }
                            totalTravellers += count;
                            return ` ${count} ${travellerType}${separation} `;
                        }
                    )
                }, () => {
                    this.setState({
                        totalTravellers,
                    })
                });
            }
        });

        if (nextProps.selectedActivity && this.props.selectedActivity !== nextProps.selectedActivity && nextProps.selectedActivity.hotelPickup) {
            this.props.getActivityHotels(code);
        }

        if (nextProps.activityBookingStatus !== null) {
            this.props.history.push(
                "/activityBookingConfirmation" + this.props.location.search + '&' + queryString.stringify({
                    distributorRef: nextProps.activityBookingStatus.distributorRef,
                    distributorItemRef: nextProps.activityBookingStatus.distributorItemRef
                }),
            );
        }
    }

    render() {
        const { selectedActivity, activityHotelList } = this.props;
        const { selectedActivityPrice, traveller, totalTravellers } = this.state;


        return (
            <div>
                <ActivityReservation
                    selectedActivity={selectedActivity}
                    selectedActivityPrice={selectedActivityPrice}
                    traveller={traveller}
                />
                <div className="d-flex flex-wrap otherSectionBg">
                    <ActivityPayment
                        selectedActivity={selectedActivity}
                        selectedActivityPrice={selectedActivityPrice}
                        activityHotelList={activityHotelList}
                        totalTravellers={totalTravellers}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    selectedActivity: state.activityReducer.selectedActivity,
    selectedActivityFinalPrice: state.activityReducer.selectedActivityFinalPrice,
    activityBookingStatus: state.activityReducer.activityBookingStatus,
    activityHotelList: state.activityReducer.activityHotelList,
    selectedCurrency: state.commonReducer.selectedCurrency,
    loginDetails: state.loginReducer.loginDetails,
});

const mapDispatchToProps = dispatch => ({
    getActivityInfo: (payloadInfo, clb, clbPayload) =>
        dispatch(getActivityInfo(payloadInfo, clb, clbPayload)),
    getActivityPrice: payloadInfo => dispatch(getActivityPrice(payloadInfo)),
    getActivityHotels: payloadInfo => dispatch(getActivityHotels(payloadInfo)),
});

export default withRouter(connect(mapStateToProps,
    mapDispatchToProps)(ActivityConfirmContent));
