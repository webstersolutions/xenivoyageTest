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
        eventId:""

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
       this.setState({
           // activityDate: moment(date, "MM/DD/YYYY").format("YYYY-MM-DD"),
           // activityDateValue: new Date(date)
           //packageDate: moment(new Date(), "MM/DD/YYYY").format("YYYY-MM-DD"),
           //packageDateValue: new Date(),
           travellers: [],
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
           eventsList: []
        });
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

        setTimeout(() => { 
            this.setState({
                packageDateValue: new Date(this.state.includeDates[0]),
                eventId: this.props.selectedPackage.events[0].eventId
            })
            var aPrice = this.props.selectedPackage.events[0].price.adult*this.state.num_adults;  
            
            var temtrav = [];
            temtrav.push({count:this.state.num_adults, pricePerTraveler:aPrice, type:"adult"});
            
            this.setState({finalPrice: aPrice, selectedPackageFinalPrice:aPrice})
            this.setState({ travellers : temtrav})        
          

            console.log(this.props.selectedPackage);
            console.log(this.props.selectedPackage.events[0].price.adult);

            if( this.props.selectedPackage.duration['type']=="singleday"){
            var eventsli = []
            _map(this.props.selectedPackage.events, (det, index) => {                    
                var startdate = det.displayTime.split(" ")
                var start = startdate[0]   
                    if(start == moment(this.state.packageDateValue).format("YYYY-MM-DD")){
                        console.log("det", det.eventId);
                        eventsli.push({id: det.eventId, name: det.singledisplayTime})

                    }
                });
                this.state.eventsList=eventsli;
                this.state.eventId=eventsli[0].id;
                this.forceUpdate(); 
            }

            // var aPrice = this.state.adultPrice*this.state.num_adults;        
            // var cPrice = this.state.childrenPrice*this.state.num_child;
            // var sPrice = this.state.SrCitPrice*this.state.num_sr_citizen;
            // var fPrice = aPrice + cPrice + sPrice;
            // SelectedPFinalPrice=fPrice;
            // var temtrav = [];
            // temtrav.push({count:this.state.num_adults, pricePerTraveler:aPrice, type:"adult"});
            // temtrav.push({count:this.state.num_child, pricePerTraveler:cPrice, type:"children"}); 
            // temtrav.push({count:this.state.num_sr_citizen, pricePerTraveler:sPrice, type:"Sr.Cittizen"});
            // this.setState({finalPrice: fPrice, selectedPackageFinalPrice:fPrice})
            // this.setState({ travellers : temtrav})        
          
        })

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
        //this.props.selectedPackageFinalPrice=fPrice;
        console.log("s",temtrav);
    }

    
    getFinalPrice = (e) => {        
        this.setState({[e.target.name]: e.target.value });
        setTimeout(() => {                
        this.calculateprice(); 
        }, 100);       
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
            isProd
        });
    };

    render() {
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
        console.log(this.state.eventsList);

        let eventList = this.state.eventsList && this.state.eventsList.map((item, i) => {
            console.log("i",item.id,this.state.eventId);

            if(item.id == this.state.eventId){
            console.log("i1",item.id);

      return (
        <option key={i} value={item.id} selected>{item.name}</option>
        
      )
            }else{
        <option key={i} value={item.id}>{item.name}</option>

            }
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
                                                <img src={image}/>
                                            </div>
                                        );
                                    }) : <div>
                                    <img src={img_unAvaliable}/>
                                </div>}
                                </Carousel>
                            </div>
                            <div className="activitySearch">
                            <div className="box_style_1 expose form_outer">     

                                <div className="activitySearchHeader">
                                    from ${selectedPackage.priceInfo["dealPrice"]}
                                </div>
                                <div className="activitySearchSubHeader">
                                    Lowest price guarantee
                                </div>
                                <hr/>
                                   

{selectedPackage.priceInfo["bookingType"]!="Custom" ? 
(
<div>                                                    
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
                            var dates = det.singledisplayTime.split(" ")
                            {selectedPackage.duration['type']=="singleday" ? (ends = startdate[3]+" "+dates[3]+" "+dates[4]) : (ends = startdate[2])}
                            eventsli.push({id: det.eventId, name: det.singledisplayTime})
                            this.setState({
                                endson: ends,
                                adultPrice: price['adult'],
                                childrenPrice: price['children'],
                                SrCitPrice:price['seniorCitizen'],
                                eventId:det.eventId,
                                eventsList: eventsli             
                            })   
                            //console.log(eventsli)                                                                                                                                  
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
				<tr><td style={{"paddingLeft":"0px", "paddingBottom":"0px"}}>Ends on </td>
				<td className="text-right" style={{"paddingBottom":"0px"}}>{this.state.endson}</td>
				</tr>				
				</tbody>
				</table>
			</div>
                        </div>
                      <div className=""><label className="disp-block-sec"><i className="icon-users"></i>Select participants:<span className="gfield_required"> *</span><span className="cust-exp" id="show_price_details" style={{display:"none"}}>Price Details</span><div id="price-det-show" style={{display:"none"}}></div></label></div>

		<div className="parti-div">
			<div className="form_field">
			    
			               			<div id="adult_num_div" className="col-md-4" style={{"paddingLeft":"0px",display:"inline-block"}}>
						<div className="form-group">
							<label className="numlabel">Adults</label>
							<div className="numbers-row" data-min="0">
                            <input type="number" defaultValue="0" className="qty2 form-control" name="num_adults" id="num_adults" value={this.state.num_adults} onChange={(e) =>{this.getFinalPrice(event)} }/>
							{/* <div className="inc button_inc">+</div><div className="dec button_inc">-</div> */}
                            </div>
						</div>
					</div>

					<div id="child_num_div" className="col-md-4" style={{"paddingLeft":"0px",display:"inline-block"}}>
						<div className="form-group">
							<label className="numlabel">Children</label>
							<div className="numbers-row" data-min="0">
                            <input type="number" defaultValue="0" className="qty2 form-control" name="num_child" id="num_child" value={this.state.num_child} onChange={(e) =>{this.getFinalPrice(event)} }/>
							{/* <div className="inc button_inc">+</div><div className="dec button_inc">-</div> */}
                            </div>
						</div>
					</div>
					
					<div id="senior_num_div" className="col-md-4" style={{"paddingLeft":"0px",display:"inline-block"}}>
						<div className="form-group">
							<label className="numlabel">Sr. Citizen</label>
							<div className="numbers-row" data-min="0">
                            <input type="number" defaultValue="0" className="qty2 form-control" name="num_sr_citizen" id="num_sr_citizen" value={this.state.num_sr_citizen} onChange={(e) =>{this.getFinalPrice(event)} }/>
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
</div>
{selectedPackage.priceInfo["bookingType"]=="Book Or Customize" ? 
(<div style={{textAlign:"center", "marginBottom":"20px"}}><h4 style={{textAlign:"center","marginTop":"10px"}}>- OR -</h4>
    <a className="selectRoomBtn bottom-book-btn" style={{"position": "relative", "top": "10px", "right": "auto", "float": "none"}} href="https://xenivoyage.com/holiday-booking-form/?pk_id=20247" target="blank" >Customize for Me!</a>
</div>) : ('')} 
</div>                            
)                            
                            :
                            (  
                            <div style={{textAlign:"center", "marginBottom":"20px"}}>
                                <a className="selectRoomBtn bottom-book-btn" style={{"position": "relative", "top": "10px", "right": "auto", "float": "none"}} href="https://xenivoyage.com/holiday-booking-form/?pk_id=20247" target="blank" >Customize for Me!</a>
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
