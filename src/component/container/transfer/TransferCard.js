import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import _capitalize from 'lodash/capitalize';
import queryString from "query-string";
import img_carUSer from '../../../asset/images/dashboard/carUser.png'
import img_carLuggage from '../../../asset/images/dashboard/luggage.png';
import img_transfer from '../../../asset/images/chauffeur.png';
import img_clock from '../../../asset/images/clock.svg';
import moment from "moment";
import _get from "lodash/get";

class TransferCard extends Component {


    // Used To Call Direct Confirm Old Impl
    /*onTaxiSelect = () => {
        this.props.history.push('/transfer/confirm?' + queryString.stringify({
            ...this.props.searchDetails,
            vehicle: this.props.taxiDetails.id
        }));
    };*/


    onTaxiSelect = (stateTime, endTime) => {
        this.props.history.push('/transfer/extras?' + queryString.stringify({
            ...this.props.searchDetails,
            vehicle: this.props.taxiDetails.id,
            pickUpTime: stateTime,
            dropOffTime: endTime
        }));
    };

    render() {
        const {taxiDetails, timeObj} = this.props;
        let startTime = timeObj.estimatedTime.startTime.split("+").shift();
        let endTime = timeObj.estimatedTime.endTime.split("+").shift();
        //  startTime = moment(startTime).tz(JSON.parse(localStorage.getItem('currency')).TIMEZONE).format('hh:mm a ');
        // endTime = moment(endTime).tz(JSON.parse(localStorage.getItem('currency')).TIMEZONE).format('hh:mm a ');

        startTime = moment(startTime, "YYYY-MM-DD hh:mm:ss").format('hh:mm a ');
        endTime = moment(endTime, "YYYY-MM-DD hh:mm:ss").format('hh:mm a ');

        // let mins = moment.utc(moment(endTime, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss"))).format("HH:mm");
        const payload = queryString.parse(this.props.location.search);
        let pickUpTime = _get(payload, 'start_time_time', '');
        pickUpTime = moment(pickUpTime, "H:mm").format("hh:mm a");
        const location = queryString.parse(this.props.location.search);
        const dropOffTime = _get(payload, 'dropOffTime', '');
        const category = taxiDetails.extended_booking_category.split('_');
        const subCategoryPre = category[0] ? category[0].toUpperCase() : '';
        const subCategorySuf = category[1] ? category[1].toUpperCase() : '';

        return (
            <div className="sectionCard carCard">
                <div className="d-flex flex-row smallColumn">
                    <div className="flex-column carImgDiv align-self-center">
                    <img className="trans-car-img-right" src={img_transfer} style={{width:"30px", float:"right"}} />
                        <img src={taxiDetails.image_url} className="carImgWid"/>
                    </div>
                    <div className="detailsBg flex-column carInfo">
                        
                        <h4>{taxiDetails.car_model.toUpperCase()}</h4>
                        <ul className="carCategories">
                            <li>{_capitalize(taxiDetails.vehicle_type)}</li>
                            <li>{_capitalize(taxiDetails.booking_category)}</li>
                        </ul>

                        <ul className="carInfraStru" style={{width: '220px'}}>
                            <li>
                                <img src={img_carUSer}/> {taxiDetails.seats}
                            </li>
                            <li>
                                <img src={img_clock}/> {taxiDetails.included_waiting_time} mins
                            </li>
                            <li>
                                <img src={img_carLuggage}/> {taxiDetails.luggage}
                            </li>
                        </ul>
                        <ul className="pickupDropDet">
                            <li>
                                <h6>Pick-Up</h6>
                                <p>{location.searchString}</p>
                                {startTime}
                            </li>
                            <li>
                                <h6>Drop-Off</h6>
                                <p>{location.end_point}</p>
                                {endTime}
                            </li>
                        </ul>
                    </div>
                    <div className="rateShowDiv flex-column">
                        <div className="priceDiv">
                            {
                                <h2>{taxiDetails.currency_symbol} {taxiDetails.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h2>}
                            <p className="text-center">per transfer</p>
                        </div>
                        <button type="button" className="selectRoomBtn"
                                onClick={() => this.onTaxiSelect(startTime, endTime)}>Select
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(TransferCard));
