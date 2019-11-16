import React, { Component } from 'react';
import CarCard from './CarCard';
import CarResultFilter from './CarResultFilter';

import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import moment from "moment";

import { carSearch, existsCarList } from '../../../service/car/action';
//import img_down from "../../../asset/images/downarrow.png";
import img_down from "../../../asset/images/downarrow.png";
import AlertHotelCard from "../../presentational/AlertHotelCard";
import { carFilter, carFilterLoadMore } from '../../../service/car/action';

class CarSearchResult extends Component {

    state = {
        pageNo: 1,
        offsetHeight:1000,
        offSet:1000
    }

    componentDidMount() {
        this.getCarList(this.props.location)
        sessionStorage.setItem("carSearchURL", window.location.search);
    }
    

    componentWillReceiveProps(newProps) {
      
        if (this.props.location !== newProps.location) {
            this.getCarList(newProps.location);
        }
        if (newProps.hasOwnProperty("pagingDetails") && newProps.pagingDetails) {
            if (newProps.pagingDetails.paging.pageNo == 1) {
                this.setState({
                    pageNo: 1
                })
            }
        }
    }

    loadMore = () => {
        if (this.props.pagingDetails) {
            this.setState({
                pageNo: +this.state.pageNo + 1,
            }, () => {
                let oldPageDetails = this.props.pagingDetails
                oldPageDetails.paging.pageNo = +this.state.pageNo
                this.props.carFilterLoadMore(oldPageDetails)
            })
        } else {
            this.setState({
                pageNo: +this.state.pageNo + 1,
            }, () => {

                let email=null
                if(this.props.loginDetails){
                  email=this.props.loginDetails.email
                }
        
                let pay = {
                     email,
                    "sessionId": this.props.sessionId,
                    "currency": this.props.selectedCurrency,
                    "paging": {
                        "pageNo": this.state.pageNo,
                        "pageSize": 30,
                        "orderBy": "price asc"
                    },
                    "contentPrefs": [
                        "All"
                    ],
                    // "filters": {
                    //     "price": {
                    //         "min": 0,
                    //         "max": 10000
                    //     }
                    // }
                }
                this.props.carFilterLoadMore(pay)
            })
        }

    }

    getCarList = location => {
        console.log("location" ,location)
        const values = queryString.parse(location.search);

        const day = moment( values.carDropDate).diff(moment(values.carPickUpDate), 'days');

        let email=null
        if(this.props.loginDetails){
          email=this.props.loginDetails.email
        }

        let carSearchPayload = {
            email,
            currency: this.props.selectedCurrency,
            driverInfo: {
                age: "25",
                nationality: "US"
            },
            pickUp: {
                pickUpSearchString: values.pickUpLocation,
                date: values.carPickUpDate,
                time: values.carPickUpTime

            },
            dropOff: {
                dropOffSearchString: values.dropOffLocation,
                date: values.carDropDate,
                time: values.carDropTime
            },
            radiusKms: 10,
            day 
        }
        if(this.props.carList.length > 0 && sessionStorage.getItem("carSearchURL") !=null && sessionStorage.getItem("carSearchURL") !="" && sessionStorage.getItem("carSearchURL") !=undefined){
            console.log("carlist ? ", this.props.carList)
            this.props.existsCarList(this.props.carList)
        }else{
            this.props.searchCar(carSearchPayload);
            console.log("carSearchPayloadDavdid", carSearchPayload)
        }
    };
 
    checkOffsetHeight = (offSetHeight) => {
        console.log("qwqw", offSetHeight)
        this.setState({
            offSet: offSetHeight
        })
    }
    render() {
         
        
        const { carList } = this.props;
        
        let clientWidth
        let offsetHeight
        let offSet;
    
        try{
           clientWidth = document.body.clientWidth;
           offSet = document.getElementById("carFilterBg").offsetHeight
           if(+clientWidth > 1199 || +clientWidth > 1187){
            offsetHeight = offSet;
           }else{
            offsetHeight=1000
           }
        }catch(e){
          offsetHeight=1000
        }

        console.log("carlist --->",this.props)
        return (

            <div className="d-flex flex-row tab-column justify-content-start">

                <CarResultFilter checkOffsetHeight={this.checkOffsetHeight} />

                <div className="filterResult">
                    <div className='cardDetailsHowBg' id="content" style={{height:offsetHeight+'px'}}>

                        {carList && carList.length != 0 && carList.map((singleCarData, index) => {

                            let vendorLogoDetails = this.props.carVendorList.find((singleVendor) => {
                                return singleVendor.code == this.props.carRentals[index].vendorCode
                            })
                        
                            // let rentalLocations =this.props.carRentals.map((each,index)=>{
                            //     let pickUp = this.props.rentalLocations.find((data,i)=>{
                            //         return data.id == each.pickUpLocationId &&  data.id==each.dropOffLocationId
                            //     })
                            //     console.log("pickup",pickUp)
                            // })




                            console.log("renta;llocaton",carList,this.props.carRentals)
                            var finalResult=[];
                            var rentalLocations1 =this.props.carRentals.map((each,index)=>{
                                
                                 var drop = this.props.rentalLocations.filter((data,i)=>{

                                 return  data.id==each.dropOffLocationId
                                })
                                var  pickup = this.props.rentalLocations.filter((data,i)=>{

                                    return  data.id==each.pickUpLocationId
                                   })
                                   finalResult.push({drop,pickup})
                                                                  
                            })
                            console.log("finalResult",finalResult)
                            let Logo;
                            if (vendorLogoDetails) {
                                Logo = vendorLogoDetails.logo
                            } else {
                                Logo = ""
                            }
                            if(Logo){
                            return (
                                <CarCard
                                    searchDetails={queryString.parse(this.props.location.search)}
                                    rentalId={this.props.carRentals[index].id}
                                    carDetails={singleCarData}
                                    carRentals={this.props.carRentals[index]}
                                    logoVendor={Logo}
                                    // rentalLocations={rentalLocations[index]}
                                    rentalLocations={finalResult[index]}

                                />
                            )
                          }
                        })
                        }
                        {carList && carList.length == 0 &&
                            <AlertHotelCard type="car" alertInfo="No Cars Available" />
                        }


                        <div className="text-center">
                            {this.props.isLoadMoreAvailable && this.props.isLoadMoreAvailable == true &&
                                <button type='button' className='clickMoreBtn searchBtn' onClick={this.loadMore}><img src={img_down} alt='down' /></button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    carList: state.carReducer.carList,
    sessionId: state.carReducer.sessionId,
    carRentals: state.carReducer.carRentals,
    carVendorList: state.carReducer.carVendorList,
    pagingDetails: state.carReducer.pagingPayload,
    isLoadMoreAvailable: state.carReducer.isLoadMoreAvailable,
    selectedCurrency: state.commonReducer.selectedCurrency,
    countryCode: state.commonReducer.countryCode,
    loginDetails: state.loginReducer.loginDetails,
    rentalLocations:state.carReducer.rentalLocations
});

const mapDispatchToProps = dispatch => ({
    searchCar: searchInfo => dispatch(carSearch(searchInfo)),
    carFilterLoadMore: filterInfo => dispatch(carFilterLoadMore(filterInfo)),
    existsCarList: data => dispatch(existsCarList(data)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CarSearchResult));