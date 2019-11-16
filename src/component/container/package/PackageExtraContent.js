import React, {Component} from "react";
import {withRouter} from "react-router-dom";

import {connect} from "react-redux";
import {
    getPackageInfo,
  //  getPackagePrice,
   // getPackageCalendar,
  //  getPackageHotels
} from "../../../service/package/action";
import queryString from "query-string";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import Popup from "reactjs-popup";

import "./style.scss";
import {
    map as _map,
    forEach as _forEach,
    sum as _sum,
    get as _get,
    includes as _includes,
    find as _find,
    uniqBy as _uniqBy,
    isEmpty as _isEmpty,
    clone as _clone,
    remove as _remove
} from "lodash";
import {Carousel} from "react-responsive-carousel";
import img_Calendar from "../../../asset/images/Calendar.svg";
import img_avatar from "../../../asset/images/avatar.jpg";
import moment from "moment";
// import PackageRatthis.props.getPackageInfoing from "./PackageRating";
import PackageFinalCard from "./PackageFinalCard";
import ItineraryInfo from "./ItineraryInfo";
import clock_SVG from "../../../asset/images/Time.svg";

import img_unAvaliable from "../../../asset/images/No_Image.jpg";

const currencies = require("country-data").currencies;
var price = [];
var SelectedPFinalPrice="0";

class PackageExtraContent extends Component {
    state = {
        isDescription: false,
        isInclusion: true,
        isDepartAndReturn: false,
        isItinerary: false,
        isHighlights: false,
        isAdditionalInfo: false,
        isCancellationPolicy: false,
        isPackageCalendar: false,
        packageDate: moment(sessionStorage.getItem("GEO_ZONE")).format(
            "YYYY-MM-DD"
        ),
        /*packageDate:moment().add(2, 'days'),*/
        isPackageTraveller: false,
        traveller: {},
        travellerSummary: "",
        minPackageDateValue: new Date(),
        includeDates: [],
        packageDateValue: new Date(),
        selectedPackage: null,
        selecedTime: null,
        packageHotelList: null,
        travellerQuestions: [],
        questions: [],
        isProd: false,
        eventId:"",
        packageDate: '',
        packageDateValue: '',
        eventId: null,
        adultPrice: 0,
        childrenPrice: 0,
        SrCitPrice: 0,
        endson: "-",
        finalPrice: "0",
        num_adults: 1,
        num_child: 0,
        num_sr_citizen:0,
        eventsList: [],
        photoIndex: 0,
           isOpen: false


    };

    componentDidMount() {
        const {code, date} = queryString.parse(this.props.location.search);
        let payload = {
            packageId: code,
            //currencyCode: this.props.selectedCurrency,
            month: moment(date, "MM/DD/YYYY").format("MM"),
            year: moment(date, "MM/DD/YYYY").format("YYYY"),
            email: _get(this.props, 'loginDetails.email', null),
        };

       // this.props.getPackageInfo(code + `&currencyCode=${this.props.selectedCurrency}&email=${_get(this.props, 'loginDetails.email', null)}`,
          //  this.props.getPackageCalendar, payload);
    //    this.setState({
           // activityDate: moment(date, "MM/DD/YYYY").format("YYYY-MM-DD"),
           // activityDateValue: new Date(date)
           //packageDate: moment(new Date(), "MM/DD/YYYY").format("YYYY-MM-DD"),
           //packageDateValue: new Date(),
          
         // });
       this.props.getPackageInfo(payload);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (
            nextProps.selectedPackage &&
            this.props.selectedPackage !== nextProps.selectedPackage
        ) {
        this.setState({
            includeDates: _map(nextProps.selectedPackage.available_dates, date =>
                moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
            ),
        });
        // setTimeout(() => { 
        //     this.setState({
        //         packageDateValue: new Date(this.state.includeDates[0]),
        //         eventId: this.props.selectedPackage.events[0].eventId
        //     })
        //     var aPrice = this.props.selectedPackage.events[0].price.adult*this.state.num_adults;  
            
        //     var temtrav = [];
        //     temtrav.push({count:this.state.num_adults, pricePerTraveler:aPrice, type:"adult"});
            
        //     this.setState({finalPrice: aPrice, selectedPackageFinalPrice:aPrice})
        //     this.setState({ travellers : temtrav})        
          

           
        //     var eventsli = [];
        //     var ends = "";
        //     var starts = "";
        //     var startdate = "";
        //     var start = ""; 
        //     var dates;
           
        //     _map(this.props.selectedPackage.events, (det, index) => {                    
        //          startdate = det.displayTime.split(" ");
        //          start = startdate[0];   
        //     if( this.props.selectedPackage.duration['type']=="singleday"){

        //                 if(start == moment(this.state.packageDateValue).format("YYYY-MM-DD")){

                       
        //                 eventsli.push({id: det.eventId, name: det.singledisplayTime})
        //                 }
        //                 this.state.eventsList=eventsli;
        //                 this.state.eventId=eventsli[0].id;
        

        //             }
        //         });
             
        //     if( this.props.selectedPackage.duration['type']=="singleday"){
               
        //         this.forceUpdate(); 
        //     }
            
        //     if(this.state.eventId == this.props.selectedPackage.events[0].eventId){
        //     if( this.props.selectedPackage.duration['type']=="singleday"){

        //          dates = eventsli[0].name.split(" ")
        //     }
        //         {this.props.selectedPackage.duration['type']=="singleday" ? (starts = startdate[0]+" "+dates[0]+" "+dates[1]) : (starts = startdate[0])}
        //         {this.props.selectedPackage.duration['type']=="singleday" ? (ends = startdate[3]+" "+dates[3]+" "+dates[4]) : (ends = startdate[2])}
        //         }
        //         this.state.endson=ends;
     
        //   console.log(this.state.travellers);
        // });


            const {code, hotelPickup} = nextProps.selectedPackage;
            if(hotelPickup){
                this.props.getPackageHotels(code)
            }
            const questions = _clone(nextProps.selectedPackage.bookingQuestions);

            this.setState({
                travellerQuestions: _map(nextProps.selectedPackage.passengerAttributes, attr => {
                    const matchedQuestion = _find(nextProps.selectedPackage.bookingQuestions, q => q.stringQuestionId === attr.questionId);
                    let id = attr.questionId;
                    if (matchedQuestion) {
                        id = matchedQuestion.questionId;
                        _remove(questions, question => question.questionId === id);
                    }
                    return {
                        ...attr,
                        id
                    };
                })
            }, () => {
                this.setState({
                    questions,
                })
            });

            let traveller = {};
            let childBandId = 0;
            let adultBandId = 0;
            let travellerSummary = "";

            _forEach(
                nextProps.selectedPackage.ageBands,
                ({bandId, ageTo, ageFrom, description, adult}, i) => {
                    const count = adult
                        ? Math.min(2, nextProps.selectedPackage.maxTravellerCount)
                        : 0;
                    traveller[description] = {
                        ageFrom,
                        ageTo,
                        bandId,
                        count,
                        limit: adult
                            ? {
                                Minimum: count,
                                Maximum: nextProps.selectedPackage.maxTravellerCount
                            }
                            : {
                                Maximum: nextProps.selectedPackage.maxTravellerCount - count
                            },
                        disableInc: count === nextProps.selectedPackage.maxTravellerCount,
                        disableDec: true
                    };

                    travellerSummary =
                        travellerSummary +
                        (i === 0 ? "" : ", ") +
                        `${count} ${description}`;
                }
                
            );

            this.setState({
                childBandId,
                adultBandId,
                traveller,
                travellerSummary
            });
            // this.props.getPackageHotels(code)
        }

        if(this.props.packageHotelList !== nextProps.packageHotelList){
            this.setState({
                packageHotelList: nextProps.packageHotelList
            })
        }

        if (nextProps.availableDate && nextProps.availableDate.length > 0 && nextProps.availableDate !== this.props.availableDate) {
            const {code, date} = queryString.parse(this.props.location.search);
            let packageDate = moment(date).format('YYYY-MM-DD')

            // _forEach(nextProps.availableDate, aDate => {
            //     if (aDate.bookingDate === date) {
            //         activityDate = date;
            //     }
            //     else{
            //         activityDate = date
            //     }
            

            // });

            // this.setState({
            //     includeDates: _map(nextProps.availableDate, date =>
            //         moment(date.bookingDate, "YYYY-MM-DD").format("YYYY-MM-DD")
            //     ),
            //     packageDate: packageDate,
            //     packageDateValue: new Date(packageDate)
            // });

            if (_isEmpty(nextProps.selectedPackageFinalPrice)) {
                const currency = JSON.parse(localStorage.getItem("currency")).ABR_NAME;

                const payload = {
                    productCode: code,
                    currencyCode: this.props.selectedCurrency,
                    bookingDate: packageDate,
                    ageBands: _map(this.state.traveller, ({count, bandId}) => ({
                        bandId,
                        count
                    })),
                    email: _get(this.props, 'loginDetails.email', null),
                };

                let queryStringlocal = queryString.parse(this.props.location.search);
                this.props.history.push('/package/extra?' + queryString.stringify({
                    ...queryStringlocal,
                    date: moment(payload.bookingDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
                }));

                this.props.getPackagePrice(payload);
            }
        }
    }

    checkHandleOnReserve = (e) => {
        this.setState({selecedTime: e})
    };

    handleOnReserve = () => {
        sessionStorage.setItem("packageConfirmURL", "");
        const queryStringlocal = queryString.parse(this.props.location.search);
        const ageBands = _map(this.state.traveller, ({count, bandId}) => ({
            bandId,
            count
        }));
        this.props.history.push('/package/confirm?' + queryString.stringify({
            ...queryStringlocal,
            gradeCode: this.state.selectedPackage,
            ageBands: JSON.stringify(ageBands),

            

        
        }),
        {
            
            selectedPackageFinalPrice:this.state.selectedPackageFinalPrice,
            num_adults:this.state.num_adults,
            num_child:this.state.num_child,
            num_sr_citizen:this.state.num_sr_citizen,
            package_date: this.state.packageDate,
            endson:this.state.endson,
            eventId:this.state.eventId
        }
        
        );
        
       
    };

    /* new code */
    calculateprice() {
        var aPrice = this.state.adultPrice*this.state.num_adults;        
        var cPrice = this.state.childrenPrice*this.state.num_child;
        var sPrice = this.state.SrCitPrice*this.state.num_sr_citizen;
        var fPrice = aPrice + cPrice + sPrice;
        SelectedPFinalPrice=fPrice;
        var temtrav = [];
        temtrav.push({count:this.state.num_adults, pricePerTraveler:aPrice, type:"adult"});
        temtrav.push({count:this.state.num_child, pricePerTraveler:cPrice, type:"children"}); 
        temtrav.push({count:this.state.num_sr_citizen, pricePerTraveler:sPrice, type:"Sr.Cittizen"});
        this.setState({finalPrice: fPrice, selectedPackageFinalPrice:fPrice})
        this.setState({ travellers : temtrav})  
        if(fPrice <= 0){
            this.state.isProd=false;
        }      
        //this.props.selectedPackageFinalPrice=fPrice;
    }

    
    getFinalPrice = (e) => {        
        this.setState({[e.target.name]: e.target.value });
        setTimeout(() => {                
        this.calculateprice(); 
        }, 100);    
        // console.log("n",this.state.num_adults);   
    }    
    getEventId = (e) => {        
        this.setState({eventId: e.target.value });   
        
        setTimeout(() => {  
      _map(this.props.selectedPackage.events, (det, index) => {                    
        var startdate = det.displayTime.split(" ");
        
            if(this.state.eventId == det.eventId){                       
                price  = det.price
                var dates = det.singledisplayTime.split(" ");                
                this.setState({
                    packageDate: this.state.packageDate+" "+dates[0]+" "+dates[1],
                    endson: startdate[3]+" "+dates[3]+" "+dates[4],
                    adultPrice: price['adult'],
                    childrenPrice: price['children'],
                    SrCitPrice:price['seniorCitizen']
                })   
        this.calculateprice(); 
                                                                                                                                                 
        }
    },100);
    }) ; 
    
    // setTimeout(() => {        
    //     console.log(this.state.eventId);
    //     this.calculateprice(); 
    //     }, 100)
          
    }    
    /* End new code */

    handleChangeTravellerCount = (adjust, travellerType) => {
        let {traveller} = this.state;
        const {selectedPackage} = this.props;

        traveller[travellerType].count += adjust;

        const travellerCount = _sum(_map(traveller, t => t.count));
        const isMaxLimitReached =
            travellerCount === selectedPackage.maxTravellerCount;
        let travellerSummary = "";
        let i = 0;

        _forEach(traveller, ({limit, count}, type) => {
            const minimum = _get(limit, "Minimum", 0);
            traveller[type].disableInc = isMaxLimitReached;
            traveller[type].disableDec = count === minimum;
            travellerSummary =
                travellerSummary + (i === 0 ? "" : ", ") + `${count} ${type}`;
            i++;
        });

        this.setState({
            traveller,
            travellerSummary
        });
    };

    handleGetFinalPrice = () => {
        const queryStringlocal = queryString.parse(this.props.location.search);
        const currency = JSON.parse(localStorage.getItem("currency")).ABR_NAME;
        const {traveller} = this.state;

        const payload = {
            productCode: queryStringlocal.code,
            currencyCode: this.props.selectedCurrency,
            bookingDate: this.state.packageDate,
            ageBands: _map(traveller, ({count, bandId}) => ({
                bandId,
                count
            })),
            email: _get(this.props, 'loginDetails.email', null),
        };

        this.props.history.push('/package/extra?' + queryString.stringify({
            ...queryStringlocal,
            date: moment(payload.bookingDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
        }));

        this.props.getPackagePrice(payload);
    };

    handleSelectPackage = (packageId, isProd) => {
        this.setState({
            selectedPackage: packageId,
            // isProd
        });
    };

    render() {
        const Modal = () => (
            <Popup
              trigger={<button className="selectRoomBtn bottom-book-btn" className="selectRoomBtn bottom-book-btn" style={{"position": "relative", "top": "10px", "right": "auto", "float": "none"}}> Book Instantly </button>}
              modal
              closeOnDocumentClick
            >
            {close => (
              <div className="modal1"> 
              <a className="close" onClick={close}>
          &times;
        </a>
              <div className="col-md-12 cutom-booking">
<h5>Custom Booking Request</h5>

<h6>For the Package: Wadi Rum &amp; Aqaba Tour</h6>
<form method="post" action="#" id="form-book-bus">
    
    <input type="hidden" name="pk_id" value="19579"/>
    <input type="hidden" name="pk_name" value="Wadi Rum &amp; Aqaba Tour"/>
                                                                             
                                       <div className="col-md-6">
 <div className="form-group">
                                            <label className="control-label">First Name<span className="gfield_required"> *</span>
                                            </label><br/>                                            
                                              <input type="text" className="form-control" name="f_name" value="" required=""/>
                                              <span className="help-block"></span>
                                          </div>                                           
                                       </div>  
                                      
                                       <div className="col-md-6">
 <div className="form-group">
                                            <label className="control-label">Last Name<span className="gfield_required"> *</span>
                                            </label><br/>                                            
                                              <input type="text" className="form-control" name="l_name" value="" required=""/>
                                              <span className="help-block"></span>
                                          </div>                                           
                                       </div><br/>                           
                                       
                                       
                                       <div className="col-md-6">
 <div className="form-group">
                                            <label className="control-label">Email<span className="gfield_required"> *</span>
                                            </label><br/>                                            
                                              <input type="email" className="form-control" name="h_email" value="" required=""/>
                                              <span className="help-block"></span>
                                          </div>                                           
                                       </div>                                                                   
                                       
                                       
                                       <div className="col-md-6">
 <div className="form-group">
                                            <label className="control-label">Mobile Number<span className="gfield_required"> *</span></label><br/>                                            
                                              <input type="tel" className="form-control" name="h_phone" value="" required=""/>
                                              <span className="help-block"></span>
                                          </div>                                           
                                       </div><br/>                                     

<h6 >Departure</h6>                                      
                                       <div className="col-md-6">
 <div className="form-group">

                                            <label className="control-label">From<span className="gfield_required"> *</span>
                                            </label><br/><div className="cal-div-up">                                             
                                              <input type="text" className="form-control" name="pick_loc" id="pick_loc" value="" required="" placeholder="Enter a location" autocomplete="off"/><i className="fa icon-location"></i></div>
                                              <span className="help-block"></span>
                                          </div>                                           
                                       </div>
                                       
                                       <div className="col-md-6">
 <div className="form-group">
                                            <label className="control-label">Holiday Destination<span className="gfield_required"> *</span>
                                            </label><br/><div className="cal-div-up">                                            
                                              <input type="text" className="form-control" name="drop_loc" id="drop_loc" value="" placeholder="Enter your destination" required=""/>
                                              
                                              </div>
                                              <span className="help-block"></span>
                                          </div>                                           
                                       </div>
                                       <div style={{clear:"both"}}></div>
                                       <h6 >Travel Dates</h6>
                                       <div className="col-md-6">

 <div className="form-group">
                                            <label className="control-label">From<span className="gfield_required"> *</span>
                                            </label><br/>  <div className="cal-div-up">                                          
                                              <input type="text" className="form-control" name="leave_from" id="leave_from" value="" required=""/></div>
                                              <span className="help-block"></span>
                                          </div>                                           
                                       </div>
                                       
                                       <div className="col-md-6">
 <div className="form-group">
                                            <label className="control-label">To<span className="gfield_required"> *</span>
                                            </label><br/> <div className="cal-div-up">                                            
                                              <input type="text" className="form-control" name="return_to" id="return_to" value="" required=""/></div>
                                              <span className="help-block"></span>
                                          </div>                                           
                                       </div>
<div className="col-md-6">
<h6 >Accommodation Type</h6>
<div  className="radio">                       
                           <input type="radio" id="hotel" name="accom_type" value="hotel" checked=""/> 
                           <label for="hotel">Hotel</label> 
                  </div>
<div  className="radio">                       
                           <input type="radio" id="villa" name="accom_type" value="villa"/> 
                           <label for="villa">Villa</label> 
                  </div>
                                       
<div className="form-group">
<h6 >Hotel Ratings</h6>
                 <div  className="radio">                       
                           <input type="radio" id="economy" name="hotel_class" value="economy" checked=""/> 
                           <label for="economy">Economy</label> 
                  </div>
                  <div  className="radio">                       
                           <input type="radio" id="3_star" name="hotel_class" value="3 star"/> 
                           <label for="3_star"><i className="fa fa-star" aria-hidden="true" ></i><i className="fa fa-star" aria-hidden="true" ></i><i className="fa fa-star" aria-hidden="true" ></i><i className="fa fa-star" aria-hidden="true" ></i><i className="fa fa-star" aria-hidden="true" ></i>
</label> 
                  </div>
                  <div  className="radio">                       
                           <input type="radio" id="4_star" name="hotel_class" value="4 star"/> 
                           <label for="4_star"><i className="fa fa-star" aria-hidden="true" ></i><i className="fa fa-star" aria-hidden="true" ></i><i className="fa fa-star" aria-hidden="true" ></i><i className="fa fa-star" aria-hidden="true" ></i><i className="fa fa-star" aria-hidden="true" ></i>
</label> 
                  </div>
                  <div  className="radio">                       
                           <input type="radio" id="5_star" name="hotel_class" value="5 star"/> 
                           <label for="5_star"><i className="fa fa-star" aria-hidden="true" ></i><i className="fa fa-star" aria-hidden="true" ></i><i className="fa fa-star" aria-hidden="true" ></i><i className="fa fa-star" aria-hidden="true" ></i><i className="fa fa-star" aria-hidden="true" ></i>
</label> 
                  </div>
</div>
</div>

<div className="col-md-6">
    <h6 >Vacation Type</h6>
    <select name="vacation_type" className="form-control">
        <option value="Honeymoon Trip">Honeymoon Trip</option>
        <option value="Leisure Trip">Leisure Trip</option>
        <option value="Bachelor Trip">Bachelor Trip</option>
        <option value="Family Trip">Family Trip</option>
        <option value="Other">Other</option>
    </select>
</div>

<div >   
<div className="col-md-6" style={{marginTop:"15px"}}>
<h6 >Group Size</h6>    
<div className="col-md-4">
<div className="form-group">
      <div className="control-group">
          <label className="control-label">Adults:</label>          

                              <div className="numbers-row" data-min="0">
<input type="text" className="qty2 form-control" value="2" name="aqty" id="aqtye"/>
       <div className="inc button_inc">+</div><div className="dec button_inc">-</div>
                              <div className="inc button_inc">+</div><div className="dec button_inc">-</div></div>
      </div>
   </div>    
</div>   
<div className="col-md-4">
<div className="form-group">
      <div className="control-group">
          <label className="control-label">Children:</label>          

                              <div className="numbers-row" data-min="0">
<input type="text" className="qty2 form-control" value="0" name="cqty" id="cqty"/>
       <div className="inc button_inc">+</div><div className="dec button_inc">-</div>
                              <div className="inc button_inc">+</div><div className="dec button_inc">-</div></div>
      </div>
   </div>    
</div> 
<div className="col-md-4">
<div className="form-group">
      <div className="control-group">
          <label className="control-label">Sr. Citizen:</label>          

                              <div className="numbers-row" data-min="0">
<input type="text" className="qty2 form-control" value="0" name="sqty" id="sqtye"/>
       <div className="inc button_inc">+</div><div className="dec button_inc">-</div>
                              <div className="inc button_inc">+</div><div className="dec button_inc">-</div></div>
      </div>
   </div>    
</div>  
<div className="col-md-12">
    <p >Minimum two adults are must.</p>
</div>
</div>
<div style={{clear:"both"}}></div>
<div className="col-md-12 row" >
<div className="col-md-6">
<h6 >Tour Guide</h6><br/>             
                  <div  className="radio">                       
                           <input type="radio" id="yes" name="guide" value="yes" checked=""/> 
                           <label for="yes" >Yes</label>                       
                  </div>                
                  <div  className="radio">                       
                           <input type="radio" id="no" name="guide" value="no"/> 
                           <label for="no">No</label> 
                  </div>                   
            </div>
<div className="col-md-6">
<h6 >Your Budget</h6><br/>
<select name="budget" className="form-control">
<option value="$500 To $2500">$500 To $2500</option>
<option value="$2500 To $5000">$2500 To $5000</option>
<option value="$5000 To $10000">$5000 To $10000</option>
<option value="$10000 To $20000">$10000 To $20000</option>
<option value="$20000 To $30000">$20000 To $30000</option>
<option value="$30000 To $40000">$30000 To $40000</option>
<option value="$40000 To $50000">$40000 To $50000</option>
</select>
</div>
</div>

<div style={{clear:"both"}}></div>

<div className="col-md-12">
    <h6 >Other Info</h6>
    <textarea name="other_info" rows="7" placeholder="My trip should be ultra luxury. I want all 5 star hotels and private butler."  className="form-control"></textarea>
</div>


                                       
                                       
                                       <div className="form-group">
              <div className="col-lg-10">                
                <input className="btn btn-primary" type="submit" id="book-bus" value="Submit"/>               
              </div>
            </div>                            
                                       
                                  

</div>
<div className="col-md-2"></div>


</form>
</div>         
        </div>
            )}
            </Popup>
        );


        const {
            connectDragSource,
            selectedPackage,
            selectedPackageFinalPrice,
            selectedCurrency,
        } = this.props;
        const {
            isDescription,
            isInclusion,
            isDepartAndReturn,
            isItinerary,
            isHighlights,
            isAdditionalInfo,
            isCancellationPolicy,
            isPackageTraveller,
            traveller,
            travellerSummary,
            packageHotelList,
            travellerQuestions,
            questions
        } = this.state;


        let eventList = this.state.eventsList && this.state.eventsList.map((item, i) => {

            // if(item.id == this.state.eventId){
            // console.log("i1",item.id);

      return (
        <option key={i} value={item.id}>{item.name}</option>
        
      )
        //     }
        //     else{
        // <option key={i} value={item.id}>{item.name}</option>

            // }
    }, this);
    
        let uniqPackage = _uniqBy(selectedPackageFinalPrice, 'gradeDescription');

        for (let y = 0; y < uniqPackage.length; y++) {
            let arr = [];
            for (let i = 0; i < selectedPackageFinalPrice.length; i++) {
                if (uniqPackage[y].gradeDescription == selectedPackageFinalPrice[i].gradeDescription) {
                    let temparr = selectedPackageFinalPrice[i].gradeDepartureTime;
                    if (temparr) {
                        arr.push({label: temparr, value: selectedPackageFinalPrice[i].gradeCode})
                    }
                }
            }

            if (arr.length > 1 && selectedPackage) {
                uniqPackage[y].departure_arr = arr;
                uniqPackage[y].gradeTitle = selectedPackage.shortTitle;
            }
        }

        let languageService = null;

        if (selectedPackage && selectedPackage.tourGradesAvailable) {
            let count = 0;
            _forEach(selectedPackage.tourGrades[0].langServices, lang => {
                if (count === 0) {
                    languageService = `Offered in ${lang.split('-')[0]}`;
                }
                count++;
            });

            if (count > 1) {
                languageService += ` and ${count} more`
            }
        };

        const { photoIndex, isOpen } = this.state;
        return (


            selectedPackage && (
                <div>
                    
                    <div
                        className="mb-2"
                        style={{padding: "10px", backgroundColor: "#FFF"}}
                    >
                        

                        <div className="mb-3 title">{selectedPackage.title}</div>
                        <div className="mb-3 d-flex activityInfo">
                            
                        
                            <div className=""> <i className="fa fa-map-marker"/> {selectedPackage.country}</div>
                        </div>
                        <div className="activitySearchWrapper">

<div className="activitySearchWrapDiv">
                                <Carousel
                                    swipeScrollTolerance={5}
                                    swipeable={true}
                                    showIndicators={false}
                                    verticalSwipe="standard"
                                    dynamicHeight={false}
                                    emulateTouch={true}
                                    showThumbs={false}
                                >
                                    {selectedPackage.gallery   ?
                                    _map(selectedPackage.gallery, (image, index) => {
                                        return (
                                            <div>
                                                <button style={{border:"none",background:"none",padding:"0px"}} type="button" onClick={() => this.setState({ isOpen: true })}>
                                                <img src={image} />
                                                </button>
                                            </div>
                                        );
                                    }) : <div>
                                    <img src={img_unAvaliable}/>
                                </div>}
                                </Carousel>
                                <div>
        {
        isOpen && (
          <Lightbox
            mainSrc={selectedPackage.gallery[photoIndex]}
            nextSrc={selectedPackage.gallery[(photoIndex + 1) % selectedPackage.gallery.length]}
            prevSrc={selectedPackage.gallery[(photoIndex + selectedPackage.gallery.length - 1) % selectedPackage.gallery.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + selectedPackage.gallery.length - 1) % selectedPackage.gallery.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % selectedPackage.gallery.length,
              })
            }
          />
        )}
      </div>
                            </div>

                            <div className="activitySearch">
                      
                            <div className="box_style_1 expose form_outer">     

                                <div className="activitySearchHeader">
                                    from ${selectedPackage.priceInfo["dealPrice"]}
                                </div>
                                <div className="activitySearchSubHeader">
                                    Lowest price guaranteed
                                </div>
                                <hr/>
                                   

{selectedPackage.priceInfo["bookingType"]!="Custom" ? 
(
<div>  

{   
                             selectedPackage.events.length > 0
                                    // _map(selectedPackage.events, (image, index) => {

                          ?(
                            <div>
                                <div className="booking_tb">
                                <div className="activitySearchHeaderInfo">
                                    Select Date and Travelers
                                </div>
		<div className="">
			<div className="form-group">
				<label><i className="icon-calendar-7"></i>Select Date:<span className="gfield_required"> *</span></label>
                
                <DatePicker        
        showYearDropdown
        selected={this.state.packageDateValue}
        

        filterDate={date =>
            _includes(
                this.state.includeDates,
                moment(date).format("YYYY-MM-DD")
            )
        }

        onChange={packageDateValue => {
            this.setState({
                packageDate: moment(packageDateValue).format(
                    "YYYY-MM-DD"
                ),
                packageDateValue
            });    
            var eventsli = []
                _map(selectedPackage.events, (det, index) => {                    
                    var startdate = det.displayTime.split(" ")
                    var start = startdate[0]   
                        if(start == moment(packageDateValue).format("YYYY-MM-DD")){
                            price  = det.price
                            var ends = ""
                            var starts = ""
                            var dates = det.singledisplayTime.split(" ")
                            {selectedPackage.duration['type']=="singleday" ? (starts = startdate[0]+" "+dates[0]+" "+dates[1]) : (starts = startdate[0])}
                            {selectedPackage.duration['type']=="singleday" ? (ends = startdate[3]+" "+dates[3]+" "+dates[4]) : (ends = startdate[2])}
                            eventsli.push({id: det.eventId, name: det.singledisplayTime})
                            this.setState({
                                packageDate: starts,
                                endson: ends,
                                adultPrice: price['adult'],
                                childrenPrice: price['children'],
                                SrCitPrice:price['seniorCitizen'],
                                eventId:det.eventId,
                                eventsList: eventsli,
                                isProd:true             
                            })   
                    }
                })                  
                setTimeout(() => {                           
                    this.calculateprice(); 
                    }, 100);           
            }}
        //includeDates={avdts}
      />
                            <p>
                             <span style={{fontSize:"11px",lineHeight:"12px"}}>Note: Available Dates Are Highlighted In Calendar.</span>

                                 </p>  
      {selectedPackage.duration['type']=="singleday" ? (<div>
      <select name="eventId" style={{width:"100%"}}
      value={this.state.eventId}
      onChange={(e) =>{this.getEventId(event)      
      }}>
          <option value="0">Select Timeslot</option>
      {eventList}
      </select></div>
       ) : ('')      
    }
    
			{/* <input type="text" className="form-control" id="occur_from" name="occur_from" defaultValue="" style={{width:"100%", display:"block"}}/> */}
                              
                                <input type="text" id="faketxt" style={{padding:" 0px !important",border: "0px !important",lineHeight: "0px !important",margin:" 0px !important",fontSize: "0px !important",position: "fixed",top: "-50px"}} className="form-control"/>
			</div>
		
        
        </div>
		
		
	{/*	<div className="">
                        <div id="load_events"></div>
			<div className="form-group load_events_default" style={{display: "none"}}>
				<label><i className="icon-eventful"></i>Select Start Time:<span className="gfield_required"> *</span></label>

				<select className="form-control large gfield_select" disabled=""><option>Choose</option></select>
			</div>
		</div>
        <br></br> */}
		<div className="">
		        <div className="other_info_container_default">
         		<div className="event_info">
                                <table className="table table_summary">
				<tbody>
				<tr><td style={{"padding-left":"0px", "padding-bottom":"0px"}}>Ends on </td>
				<td className="text-right" style={{"padding-bottom":"0px"}}>{this.state.endson}</td>
				</tr>				
				</tbody>
				</table>
			</div>
                        </div>
                      <div className=""><label className="disp-block-sec"><i className="icon-users"></i>Select participants:<span className="gfield_required"> *</span><span className="cust-exp" id="show_price_details" style={{display:"none"}}>Price Details</span><div id="price-det-show" style={{display:"none"}}></div></label></div>

		<div className="parti-div">
			<div className="form_field">
			    
			               			<div id="adult_num_div" className="col-md-4" style={{"padding-left":"0px",display:"inline-block"}}>
						<div className="form-group">
							<label className="numlabel">Adults</label>
							<div className="numbers-row" data-min="0">
                            <input type="number" defaultValue="0" min="0" className="qty2 form-control" name="num_adults" id="num_adults" value={this.state.num_adults} onChange={(e) =>{this.getFinalPrice(event)} }/>
							{/* <div className="inc button_inc">+</div><div className="dec button_inc">-</div> */}
                            </div>
						</div>
					</div>

					<div id="child_num_div" className="col-md-4" style={{"padding-left":"0px",display:"inline-block"}}>
						<div className="form-group">
							<label className="numlabel">Children</label>
							<div className="numbers-row" data-min="0">
                            <input type="number" defaultValue="0" min="0" className="qty2 form-control" name="num_child" id="num_child" value={this.state.num_child} onChange={(e) =>{this.getFinalPrice(event)} }/>
							{/* <div className="inc button_inc">+</div><div className="dec button_inc">-</div> */}
                            </div>
						</div>
					</div>
					
					<div id="senior_num_div" className="col-md-4" style={{"padding-left":"0px",display:"inline-block"}}>
						<div className="form-group">
							<label className="numlabel">Sr. Citizen</label>
							<div className="numbers-row" data-min="0">
                            <input type="number" defaultValue="0"  min="0" className="qty2 form-control" name="num_sr_citizen" id="num_sr_citizen" value={this.state.num_sr_citizen} onChange={(e) =>{this.getFinalPrice(event)} }/>
							{/* <div className="inc button_inc">+</div><div className="dec button_inc">-</div> */}
                            </div>
						</div>
					</div>
								
								
									
<div id="error_max_cap" className="error"></div>

        		</div>
        <div className="form_field" style={{display:"none"}}>

					<div className="">
						<label className="disp-block-sec"><i className="icon-language"></i>Language:<span className="gfield_required"> *</span></label>
						<select name="language" id="language" className="form-control large gfield_select"><option value="English">English</option></select>					</div>
			</div>
        		<div className="form_field">

					<div className="">						
                                                <table className="table table_summary">
				<tbody>
				<tr className="total">
					<td>Subtotal</td>
					<td className="text-right total-cost"><span className="dyatotal">${this.state.finalPrice}</span></td>
				</tr>
				</tbody>
				</table>
				
					</div>
			</div>
            <div style={{textAlign:"center"}}>
            
            <button
                                    type="button"
                                    style={{float:"none",position:"unset"}}
                                    onClick={this.handleOnReserve}
                                    className="selectRoomBtn bottom-book-btn"
                                    disabled={!this.state.isProd}

                                >
                                    BOOK NOW
                                </button>
                </div>

			<div className="form_field">

					<div className="">
						<div id="bookcontent"></div>
					</div>
			</div>

		</div>
                                </div>
                            </div>

{selectedPackage.priceInfo["bookingType"]=="Book Or Customize" ? 
(<div style={{textAlign:"center", "margin-bottom":"20px"}}><h4 style={{textAlign:"center","margin-top":"10px"}}>- OR -</h4>
</div>) : ('')}
</div>

):
(
<p>
{selectedPackage.priceInfo["bookingType"]=="Book Or Customize" ? (
   <h4 style={{textAlign:"center","margin-top":"10px"}}> Can be booked instantly</h4>
):(
<h4 style={{textAlign:"center","margin-top":"10px"}}>No Dates Available</h4>

)}
<span style={{fontSize:"13px",lineHeight:"12px"}}>Note: Minimum 72 hours notice is required for confirmation.</span>

    </p>
) }
{selectedPackage.priceInfo["bookingType"]=="Book Or Customize" ? 
(<div style={{textAlign:"center", "margin-bottom":"20px"}}>
    {/* <h4 style={{textAlign:"center","margin-top":"10px"}}>- OR -</h4> */}
    {/* <Modal className="selectRoomBtn bottom-book-btn" style={{"position": "relative", "top": "10px", "right": "auto", "float": "none"}} href="https://xenivoyage.com/holiday-booking-form/?pk_id=20247" target="blank" >Customize for Me!</Modal> */}
<Modal/>
</div>) : ('')} 
</div>                            
)                            
                            :
                            (  
                            
                            <div style={{textAlign:"center", "margin-bottom":"20px"}}>
                            <h4 style={{textAlign:"center","margin-top":"10px"}}> Can be booked instantly</h4>
                                <Modal/>
                            </div>
                            ) 
}

                       </div>
                       
                       
                        </div>
                </div>
                </div>
                
               
                
            
                
                        <div className="mb-3 d-flex activityInfo activity-options">
                        <div className="ml-3 marginDatehours">
                            <img style={{paddingBottom: "2px", width: "20px"}} className="ml-3 mr-1 marginDatehours" src={clock_SVG}/>
                            -{" "}{
                    (selectedPackage.duration.type == "multiday") ? 
                    ( " "+ selectedPackage.duration.time-1 + " Nights" + " | " + selectedPackage.duration.time + " Days" ):
                     ( selectedPackage.duration.time + " Hours")}
                        </div>
                        
                    </div>
                    <div className="d-flex flex-wrap justify-content-between webResp">
                        <div
                            className={`flex-column tabInfoActivity ${
                                isDescription ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: true,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isItinerary: false,
                                    isHighlights: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Description
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isInclusion ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: false,
                                    isInclusion: true,
                                    isDepartAndReturn: false,
                                    isItinerary: false,
                                    isHighlights: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Inclusions & Exclusions
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isItinerary ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: false,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isItinerary: true,
                                    isHighlights: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Itinerary
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isHighlights ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: false,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isItinerary: false,
                                    isHighlights: true,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Highlights
                        </div>
                       
                        </div>
                  
                        <ItineraryInfo
                        itinerary={selectedPackage}
                        isDescription={isDescription}
                        isInclusion={isInclusion}
                        isItinerary={isItinerary}
                        isHighlights={isHighlights}

                       // isDepartAndReturn={isDepartAndReturn}
                        // isHotelPickup={isHotelPickup}
                        // isCancellationPolicy={isCancellationPolicy}
                        // isActivityTraveller={isActivityTraveller}
                        // isAdditionalInfo={isAdditionalInfo}
                        
                    />

                    <div className="d-flex flex-wrap justify-content-between mobileResp">
                        <div
                            className={`flex-column tabInfoActivity ${
                                isDescription ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: true,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isItinerary: false,
                                    isHighlights: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Description
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isInclusion ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: false,
                                    isInclusion: true,
                                    isDepartAndReturn: false,
                                    isItinerary: false,
                                    isHighlights: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Inclusions & Exclusions
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isItinerary ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: false,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isItinerary: true,
                                    isHighlights: false,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Itinerary
                        </div>
                        <div
                            className={`flex-column tabInfoActivity ${
                                isHighlights ? "activeTab" : ""
                                }`}
                            style={{cursor: "pointer"}}
                            onClick={() =>
                                this.setState({
                                    isDescription: false,
                                    isInclusion: false,
                                    isDepartAndReturn: false,
                                    isItinerary: false,
                                    isHighlights: true,
                                    isAdditionalInfo: false,
                                    isCancellationPolicy: false
                                })
                            }
                        >
                            Highlights
                        </div>

                    </div>
                    {uniqPackage.length > 0 && (
                        <div className="selectRoomBg d-flex flex-wrap">
                            <div className="selectRoomTitle">
                                <h4>Select your itinerary</h4>
                            </div>
                            <div className="selectRoomItemsBg  bottom-btn-pad">
                                <div className="flex-row smallTabColumn mb-5">
                                    <button
                                        type="button"
                                        style={{float: "right", cursor: (this.state.isProd ? "pointer" : "not-allowed")}}
                                        onClick={this.handleOnReserve}
                                        disabled={!this.state.isProd}
                                        className="selectRoomBtn reserveBtn"
                                    >
                                        BOOK NOW
                                    </button>
                                </div>
                               { _map(uniqPackage, (packages,i) => ( 
                                    <PackageFinalCard
                                        packageDetails={packages}
                                        images={selectedPackage.gallery}
                                        selectedPackage={this.props.selectedPackage}
                                        onSelect={this.handleSelectPackage}
                                        totalTravellers={this.state.travellers}
                                        selectTime={this.state.selectTime}
                                        selectbtn={this.checkHandleOnReserve}
                                        //mostPopular={i === 0 && uniqActivity.length > 1}
                                        location={queryString.parse(this.props.location.search)}
                                        selectedPackageInfo={selectedPackage}
                                        finalPrice={this.state.finalPrice}
                                        isProd={this.state.isProd}
                                        //packageHotelList={packageHotelList}
                                        //questions={questions}
                                        //travellerQuestions={travellerQuestions}
                                    />
                                ))}
                                <button
                                    type="button"
                                    style={{cursor: (this.state.isProd ? "pointer" : "not-allowed")}}
                                    onClick={this.handleOnReserve}
                                    disabled={!this.state.isProd}
                                    className="selectRoomBtn bottom-book-btn"
                                >
                                    BOOK NOW
                                </button>
                            </div>
                        </div>
                    )}
                  
                        </div>

                     
            )
        );
    }
}

const mapStateToProps = state => ({
    selectedPackage: state.packageReducer.selectedPackage,
    availableDate: state.packageReducer.availableDate,
    selectedPackageFinalPrice: SelectedPFinalPrice,
    //selectedPackageFinalPrice: state.selectedPackageFinalPrice,
    selectedCurrency: state.commonReducer.selectedCurrency,
    loginDetails: state.loginReducer.loginDetails,
    packageHotelList: state.packageReducer.packageHotelList
});
const mapDispatchToProps = dispatch => ({
    getPackageInfo: (payloadInfo, clb, clbPayload) =>
        dispatch(getPackageInfo(payloadInfo, clb, clbPayload)),
  //  getPackagePrice: payloadInfo => dispatch(getPackagePrice(payloadInfo)),
   // getPackageCalendar: payloadInfo => dispatch(getPackageCalendar(payloadInfo)),
  //  getPackageHotels: payloadInfo => dispatch(getPackageHotels(payloadInfo))
});


export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PackageExtraContent)
);
