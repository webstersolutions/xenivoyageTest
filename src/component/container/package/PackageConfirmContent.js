import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import PackageReservation from "./PackageReservation";
import PackagePayment from "./PackagePayment";
import moment from 'moment';
import queryString from "query-string";
import {find as _find, forEach as _forEach, get as _get, isEmpty as _isEmpty, map as _map} from "lodash";

import {getPackageInfo, getPackagePrice, getPackageHotels} from "../../../service/package/action";

class PackageConfirmContent extends Component {

    state = {
        selectedPackagePrice: "",
        traveller: 0,
        totalTravellers: 0,
    };

    componentDidMount() {


        const {code, date, ageBands} = queryString.parse(this.props.location.search);
        const{selectedPackageFinalPrice,num_adults,num_child,num_sr_citizen,package_date,endson,eventId}=this.props.location.state;
        this.setState({
            selectedPackagePrice:selectedPackageFinalPrice,
            num_adults:num_adults,
            num_child:num_child,
            num_sr_citizen:num_sr_citizen,
            package_date:package_date,
            endson:endson,
            eventId:eventId
        });

        if (_isEmpty(this.props.selectedPackage)) {

            let payload = {
                packageId: code,
                //currencyCode: this.props.selectedCurrency,
                email: _get(this.props, 'loginDetails.email', null),
            }; 
            this.props.getPackageInfo(payload);
           

            // this.props.getPackageInfo(code +
            //     `&currencyCode=${this.props.selectedCurrency}&email=${_get(this.props, 'loginDetails.email', null)}`);
        } else if (this.props.selectedPackage.hotelPickup) {
            this.props.getPackageHotels(code)
        }
        // console.log(this.props.getPackageHotels(code))
        // if (_isEmpty(selectedPackageFinalPrice)) {
        //     const payload = {
        //         productCode: code,
        //         currencyCode: this.props.selectedCurrency,
        //         bookingDate: moment(date, "MM/DD/YYYY").format("YYYY-MM-DD"),
        //         ageBands: JSON.parse(ageBands),
        //         email: _get(this.props, 'loginDetails.email', null),
        //     };
        //     this.props.getPackagePrice(payload);
        // } else {
        //     const {gradeCode} = queryString.parse(this.props.location.search);
        //     this.setState({
        //         selectedPackagePrice: _find(selectedPackageFinalPrice, ['gradeCode', gradeCode])
        //     }, () => {
        //         if (!_isEmpty(selectedPackagePrice) && !_isEmpty(this.props.selectedPackage)) {
        //             let totalTravellers = 0;
        //             this.setState({
        //                 traveller: _map(
        //                     this.state.selectedPackagePrice.ageBands,
        //                     ({count, pricePerTravelerFormatted, bandId}, i) => {
        //                         let travellerType = '';
        //                         let separation = '';
        //                         _forEach(this.props.selectedPackage.ageBands, value => {
        //                             if (value.bandId === bandId) {
        //                                 travellerType = value.description;
        //                             }
        //                         });

        //                         if (i >= 1 && i < this.state.selectedPackagePrice.ageBands.length) {
        //                             separation = ', '
        //                         }
        //                         totalTravellers += count;
        //                         return ` ${count} ${travellerType}${separation} `;
        //                     }
        //                 )
        //             }, () => {
        //                 this.setState({
        //                     totalTravellers,
        //                 })
        //             });
        //         }
        //     });
        // }
        //console.log(this.props.selectedPackageFinalPrice)
   
    
    }
    
    componentWillReceiveProps(nextProps) {
        // if(this.props.selectedPackage){
        // const {gradeCode, code} = queryString.parse(this.props.location.search);
        // this.setState({
        //     selectedPackagePrice: _find(nextProps.selectedPackageFinalPrice, ['gradeCode', gradeCode])
        // }, () => {
        //     if (!_isEmpty(this.state.selectedPackagePrice) && !_isEmpty(nextProps.selectedPackage)) {
        //         let totalTravellers = 0;
        //         this.setState({
        //             traveller: _map(
        //                 this.state.selectedPackagePrice.ageBands,
        //                 ({count, pricePerTravelerFormatted, bandId}, i) => {
        //                     let travellerType = '';
        //                     let separation = '';

        //                     _forEach(nextProps.selectedPackage.ageBands, value => {
        //                         if (value.bandId === bandId) {
        //                             travellerType = value.description;
        //                         }
        //                     });

        //                     if (i >= 1 && i < this.state.selectedPackagePrice.ageBands.length) {
        //                         separation = ', '
        //                     }
        //                     totalTravellers += count;
        //                     return ` ${count} ${travellerType}${separation} `;
        //                 }
        //             )
        //         }, () => {
        //             this.setState({
        //                 totalTravellers,
        //             })
        //         });
        //     }
        // });

        // if (nextProps.selectedPackage && this.props.selectedPackage !== nextProps.selectedPackage && nextProps.selectedPackage.hotelPickup) {
        //     this.props.getPackageHotels(code);
        // }

       if (nextProps.packageBookingStatus !== null) {

       if(nextProps.packageBookingStatus.data[0].status == true)
        {
            this.props.history.push(
                "/packageBookingConfirmation" + this.props.location.search + '&' + queryString.stringify({
                     distributorRef: nextProps.packageBookingStatus.distributorRef,
                    distributorItemRef: nextProps.packageBookingStatus.distributorItemRef,

                }),{
                    packageBookingStatus:nextProps.packageBookingStatus
                }
            );
       }
    }
    // }
    // else{

    //     var a='"'+this.props.location.pathname + this.props.location.search+'"';
    //     this.props.history.push(a

    //     );
 
    //     console.log("a",a);
    // }
}

    render() {
        const { selectedPackage, packageHotelList } = this.props;
        const { selectedPackagePrice, num_adults, num_child, num_sr_citizen, eventId,traveller, totalTravellers, package_date, endson } = this.state;

       
        return (

            
                selectedPackage ? (
          <div> 
              

                <PackageReservation 
                    selectedPackage={selectedPackage}
                    selectedPackagePrice={selectedPackagePrice}
                    num_adults={num_adults}
                    num_child={num_child}
                    num_sr_citizen={num_sr_citizen}
                    traveller={traveller}
                    package_date={package_date}
                    endson={endson}
                />
                <div className="d-flex flex-wrap otherSectionBg">
                    <PackagePayment
                        selectedPackage={selectedPackage}
                        selectedPackagePrice={selectedPackagePrice}
                        packageHotelList={packageHotelList}
                        totalTravellers={totalTravellers}
                        num_adults={num_adults}
                    num_child={num_child}
                    num_sr_citizen={num_sr_citizen}
                    package_date={package_date}
                    eventId={eventId}
                    endson={endson}
                    />
                </div>
            </div>
                ):('')
        );
    }
}

const mapStateToProps = state => ({
    selectedPackage: state.packageReducer.selectedPackage,
    selectedPackageFinalPrice: state.packageReducer.selectedPackageFinalPrice,
    packageBookingStatus: state.packageReducer.packageBookingStatus,
    packageHotelList: state.packageReducer.packageHotelList,
    selectedCurrency: state.commonReducer.selectedCurrency,
    loginDetails: state.loginReducer.loginDetails,
});

const mapDispatchToProps = dispatch => ({
    getPackageInfo: (payloadInfo, clb, clbPayload) =>
        dispatch(getPackageInfo(payloadInfo, clb, clbPayload)),
    getPackagePrice: payloadInfo => dispatch(getPackagePrice(payloadInfo)),
    getPackageHotels: payloadInfo => dispatch(getPackageHotels(payloadInfo)),
});

export default withRouter(connect(mapStateToProps,
    mapDispatchToProps)(PackageConfirmContent));
