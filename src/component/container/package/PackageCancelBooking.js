import React from 'react';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import Footer from '../../Footer';
import TopNav from '../TopNav';
import Loading from "../../Loading";

import queryString from "query-string";
import {getSingleBookingTripInformation, cancelPackage, getCancellationCode} from "../../../service/package/action";
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import _get from "lodash/get";
const currencies = require("country-data").currencies;
class PackageCancelBooking extends React.Component {


    state = {
        selectedCode: 78,
        cancelDescription:"duplicate purchase"
    };

    componentDidMount() {
        this.props.getCancellationCode();
        window.scrollTo(0, 0);
        let queryParam = queryString.parse(this.props.location.search);
        if (!_isEmpty(queryParam)) {
            this.props.getBookingStatus(queryParam);
        } else {
            this.props.history.push('/package');
        }
    }

    handleSignIn = () => {
        this.setState({isVisibleSignIn: true});
        this.setState({isdivHide: true});
    };

    bookingCancel = (obj) => {
        const {distributorItemRef, distributorRef, response} = obj;
        let payload = {
            bookingId: response.bookingId,
            distributorRef,
            cancelItems: [
                {
                    // itemId: response.data.itemSummaries[0].itemId,
                    // distributorItemRef: distributorItemRef,
                    cancelCode: this.state.selectedCode,
                    cancelDescription: this.state.cancelDescription
                }
            ],
            email: this.props.loginDetails.email
        };
        let queryParam = queryString.parse(this.props.location.search);
        this.props.cancelPackage(payload, queryParam)
    };

    render() {
        const {packageBookingStatus, packageCancelReasonList, refundStatus, refundAmount} = this.props;
        // console.log(";;;;;packageBookingStatus",packageBookingStatus)
        return (
            <React.Fragment>
                <TopNav/>
                {<Loading/>}
                {
                    packageBookingStatus !== null && packageBookingStatus !== undefined && packageBookingStatus.response !==undefined &&
                    <section className="searchSection">
                        <div className="container">
                            <div className="bookingConfirmation">
                                <div className="bookingStatus">
                                    <div className="d-flex flex-row justify-content-between">
                                        <div className="flex-column">
                                            <div className="bookingStatusContent cancelledBook">
                                                { packageBookingStatus.booking_status && !packageBookingStatus.isCancel && !packageBookingStatus.refund &&
                                                <h3 className="text-success">
                                                    Your Booking has Been Confirmed.
                                                </h3>}

                                                {packageBookingStatus.booking_status && packageBookingStatus.isCancel && !packageBookingStatus.refund &&
                                                <h3 className="text-danger">
                                                    Your request for cancel booking has been sent successfully.
                                                </h3>
                                                }
                                                {packageBookingStatus.booking_status && packageBookingStatus.refund  &&
                                                <h3 className="text-danger">
                                                    Your booking has been cancelled successfully.
                                                </h3>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-row">
                                        <div className="bookingHotelName">
                                            <h5>{packageBookingStatus.response.packageTitle}</h5>
                                        </div>
                                        <div className="clearfix"/>
                                        <ul className="bookingHotelInfo mt-5 mb-4">
                                            <li className="borderRight">
                                                <b> Travel Date :</b>
                        {packageBookingStatus.request.items[0].travelDatefrom+ " To "+ packageBookingStatus.request.items[0].travelDateto}

                                            </li>
                                           
                                            <li className="borderRight">
                                                <b> Total Cost :</b>  {currencies[packageBookingStatus.currencyCode].symbol}{packageBookingStatus.fare}
                                            </li>
                                            <li>
                                                Xeniapp Booking Id : <b>{packageBookingStatus.response.bookingId}</b>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bookingStatus">
                                    <div className="d-flex flex-row smallTabColumn justify-content-between">
                                        <div className="flex-column hotelImage">
                                            <img src={packageBookingStatus.images[0]}/>
                                        </div>
                                        <div className="flex-column bookingConfirmRoom">
                                            <div className="d-flex flex-row">
                                                <div className="flex-row">
                                                    <div className="bookingHotelName">
                                                        <h5>Booking Information </h5>
                                                    </div>
                                                    <ul className="">
                                                       
                                                        <li className="borderRight">
                                                <b> Travel Date From</b>:&nbsp;
                        {packageBookingStatus.request.items[0].travelDatefrom+ " To "+ packageBookingStatus.request.items[0].travelDateto}

                                                
                                            </li>
                                          
                                                        {/* {packageBookingStatus.response.data.itemSummaries[0].startingTime !== null &&
                                                        <li className="borderRight">
                                                            <b>Starting Time</b>:&nbsp;
                                                            <b>{packageBookingStatus.response.data.itemSummaries[0].startingTime}</b>
                                                        </li>} */}
                                                        
                                                    </ul>
                                                    <ul className="">
                                                    <li className="borderRight">
                                                            <b>Price Formatted</b>:&nbsp;
                                                            {/* <b>{packageBookingStatus.response.data.itemSummaries[0].priceFormatted}</b> */}
                                                            <b>{currencies[packageBookingStatus.currencyCode].symbol}{packageBookingStatus.fare}</b>
                                                        </li>
                                                                                                               <li className="borderRight">
                                                            <b>Booking Date</b>:&nbsp;
                                                            <b>{packageBookingStatus.request.transDetails.transDate.substring(0, 10)}</b>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bookingStatus">
                    {packageBookingStatus.request.items[0].package_cancellation !=="" ? (

                                    <h5> Cancellation Policy</h5>
                    ):("")}
                                    <span>
                    {packageBookingStatus.request.items[0].package_cancellation}

                                    </span>
                                    {/* <span
                                        dangerouslySetInnerHTML={{__html: _get(packageBookingStatus.response.data.itemSummaries, "merchantTermsAndConditions.termsAndConditions", '')}}/> */}
                                    {/* <b>Refund : 
                                    {refundAmount}
                                     % </b> */}
                                    <br/>

                                    {!packageBookingStatus.isCancel && <div className="row">
                                        <div className="col-md-3 mt-5">
                                            <select className="form-control selectWidth" style={{width: 300}} onChange={e =>
                                            {
                                                var id = e.nativeEvent.target.selectedIndex;


                                                var text=e.nativeEvent.target[id].text;

                                                this.setState({
                                                    selectedCode: e.target.value,
                                                    cancelDescription : text
                                                })


                                            }

                                            } defaultValue={this.state.selectedCode}>
                                                <option>Select Reason</option>
                                                {_map(packageCancelReasonList, (obj, i) => {
                                                    return (
                                                        <option value={i}>{obj}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                        <div className="col-md-3 marginCancell" style={{marginLeft: -10, paddingLeft: -10}}>
                                            <button type="submit"
                                                    onClick={() => this.bookingCancel(packageBookingStatus)}
                                                    className="searchBtn completebtn float-right mt-5"> Cancel
                                            </button>
                                        </div>
                                    </div>}
                                    <p className="text-center">We have sent a confirmation of the cancellation
                                        to: <b>{this.props.loginDetails.email}</b>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Footer/>

                    </section>}
            </React.Fragment>);
    }
}

const mapStateToProps = state => ({
    selectedCurrency: state.commonReducer.selectedCurrency,
    loginDetails: state.loginReducer.loginDetails,
    packageBookingStatus: state.packageReducer.packageBookingStatus,
    packageCancelReasonList: state.packageReducer.packageCancelReasonList,
    refundStatus: state.packageReducer.refundStatus,
    refundAmount: state.packageReducer.refundAmount,
});

const mapDispatchToProps = dispatch => ({
    getBookingStatus: (requestParam) => dispatch(getSingleBookingTripInformation(requestParam)),
    cancelPackage: (payload, requestParam) => dispatch(cancelPackage(payload, requestParam)),
    getCancellationCode: (payload) => dispatch(getCancellationCode(payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PackageCancelBooking));
