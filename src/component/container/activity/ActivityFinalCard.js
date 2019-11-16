    import React, {Component} from "react";
    import {connect} from "react-redux";
    import {
        DragSource,
        ConnectDragSource,
        DragSourceConnector,
        DragSourceMonitor
    } from "react-dnd";

    import moment from "moment";
    import {filter as _filter, includes as _includes} from "lodash";
    import {map as _map, forEach as _forEach, findIndex as _findIndex, get as _get} from "lodash";
    import queryString from "query-string";
    import img_drag from "../../../asset/images/selectRoom/drag.png";
    import ImageCarousel from "../../presentational/ImageCarousel";

    import { addItinerary } from "../../../service/addCart/action";
    import {
        loadingGifSearch,
        stopGifSearching
      } from "../../../service/common/action";    

    const currencies = require("country-data").currencies;

    class ActivityFinalCard extends Component {
        state = {
            traveller: "",
            activity: "",
            isProd: false
        };

        componentDidMount() {
            const {totalTravellers, selectedCurrency, activityDetails} = this.props;
            this.setState({
                traveller: _map(
                    activityDetails.ageBands,
                    ({count, pricePerTraveler, bandId}) => {
                        let travellerType = "";
                        _forEach(totalTravellers, (value, type) => {
                            if (value.bandId === bandId) {
                                travellerType = type;
                            }
                        });
                        return ` ${currencies[activityDetails.currencyCode].symbol}${pricePerTraveler} x ${count} ${travellerType} `;
                    }
                )
            });

            let activity = this.props.activityDetails.gradeCode;

            if (_get(this.props, 'activityDetails.departure_arr', []).length > 0) {
                activity = this.props.activityDetails.departure_arr[0].value
            }

            this.setState({
                activity
            })
        }

        componentWillReceiveProps(nextProps, nextContext) {
            if (nextProps.activityDetails !== this.props.activityDetails) {
                const {totalTravellers, activityDetails} = nextProps;

                this.setState({
                    traveller: _map(
                        activityDetails.ageBands,
                        ({count, pricePerTraveler, bandId}) => {
                            let travellerType = "";
                            _forEach(totalTravellers, (value, type) => {
                                if (value.bandId === bandId) {
                                    travellerType = type;
                                }
                            });
                            return ` ${currencies[activityDetails.currencyCode].symbol}${pricePerTraveler} x ${count} ${travellerType} `;
                        }
                    )
                });
            }
        }

        handleChange = e => {
            this.setState({
                [e.target.name]: e.target.value
            });

            if (e.target.name === 'activity'
                && _findIndex(_get(this.props, 'activityDetails.departure_arr', []), departure =>
                    departure.value === this.props.selectedPackage) !== -1) {
                this.props.onSelect(e.target.value);
            }
        };

        getAvailability = () => {
            return (
                <span style={{
                    display: 'inline-block',
                    color: "#464646",
                    backgroundColor: "#fec637",
                    padding: "5px 5px 5px 5px", alignContent: "center",
                    fontWeight: 300,
                    fontSize: 12,
                    marginLeft: "4%",
                    marginBottom: 10
                }}>
                    Most Popular
                </span>
            )
        };

        onSelectProduct = (activity) => {
            this.setState({
                isProd: !this.state.isProd
            }, () => this.props.onSelect(activity, this.state.isProd))
            
        }

        mobileItinerary = () => {
            this.props.loadingGifSearch();
            const activity = this.props.activityDetails;
            const totalTravellers = this.props.totalTravellers;
            const payload = {
                type: "activity",
                price: Number(activity.retailPrice),
                activityList: activity,
                title: activity.gradeTitle,
                subtitle: activity.gradeTitle,
                currency: activity.currencyCode,
                bookingData: { ...{ currency: activity.currencyCode,activityList: activity,totalTravellers:totalTravellers,location:this.props.location } },
                searchString: activity.gradeTitle,
                selectedActivityInfo: this.props.selectedActivityInfo,
                activityHotelList: this.props.activityHotelList,
                questions: this.props.questions,
                travellerQuestions: this.props.travellerQuestions
            };
            this.props.stopGifSearching();
            this.props.addToItinerary(payload)
        }

        render() {
            const {
                connectDragSource,
                activityDetails,
                images,
                selectedPackage,
                onSelect,
                selectbtn,
                selectedCurrency,
                mostPopular,
                activityHotelList
            } = this.props;
            const {traveller, activity} = this.state;

            return connectDragSource(
                <div className="sectionCard Activity-Card">
                    {mostPopular ? this.getAvailability() : ''}
                    <div className="d-flex flex-row resWrap">
                        
                        <div className="flex-column imagesection">
                            {images.length && images[0].photoURL ? (
                                <ImageCarousel
                                    imageList={_map(images, each => ({
                                        name: each.caption,
                                        url: each.photoURL
                                    }))}
                                    thumbNail={{name: "img1", url: images[0].photoURL}}
                                />
                            ) : (
                                <ImageCarousel/>
                            )}
                        </div>
                        <div style={{width: "100%"}} className="flex-column">
                            <div style={{padding: "10px"}}>
                                <div style={{fontWeight: "bold", paddingBottom: "10px"}}>
                                    {activityDetails.gradeTitle}
                                    <span style={{paddingLeft: "15px"}}>
                                        {_get(this.props, 'activityDetails.departure_arr', []).length > 0 && (
                                            <select name="activity" id="timeSelect" onChange={this.handleChange}>
                                                {_map(activityDetails.departure_arr, each => (
                                                    <option value={each.value}>{each.label}</option>
                                                ))}
                                            </select>
                                        )}
                                    </span>
                                </div>
                                <div>
                                    <span style={{fontWeight: "bold"}}>
                                    {`${currencies[activityDetails.currencyCode].symbol}${activityDetails.retailPrice}`}
                                    </span>
                                    <span style={{color: "E0E0E0"}}> ({traveller}) + taxes</span>
                                </div>
                                <div dangerouslySetInnerHTML={{__html:activityDetails.gradeDescription}} />
                            </div>
                        </div>
                        <div className="rateShowDiv flex-column widthDiv">
                            <div className="priceDiv didCurrency">
                                <h2>
                                    <span style={{fontSize: "16px"}}>
                                    {`${currencies[activityDetails.currencyCode].symbol}${activityDetails.retailPrice}`}
                                    </span>
                                </h2>
                                {/* <div style="">
                                    
                                </div> */}
                            </div>
                            <div className="divCheck" style={{float: "right",position: "absolute",right: "0px"}}>
                                    <input     
                                    style={{margin:"6px 43px",width:"20px",height:"20px"}}
                                    type="checkbox"
                                    // checked={_get(this.props, 'activityDetails.departure_arr', []).length > 0
                                    //     ? _findIndex(activityDetails.departure_arr, departure =>
                                    //         departure.value === selectedPackage) !== -1
                                    //     : activity === selectedPackage}
                                    checked={this.state.isProd}
                                    onClick={() => this.onSelectProduct(this.state.activity)}
                                />
                                <label style={{textAlign:"center", display:"grid"}}><b>Select</b></label>
                            </div>
                            <div style={{position:"absolute",bottom:"47px",right: "10px"}}>
                            <img src={img_drag} />
                            <span className="dragDropText">Drag and Drop</span>
                            </div>
                        </div>
                        <div className="add-to-itinerary">
                            <button disabled={!this.state.isProd} onClick={this.mobileItinerary}>ADD TO ITINERARY</button>
                        </div>
                    </div>
                </div>
            );
        }
    }

    const __itemSource = {
    canDrag(props, monitor, component) {
        // return !_includes(_map(props.itineraryList, 'refId'),
        //     props.refId);
        return true;
    },
    beginDrag(props, monitor, component) {
    
        const activity = props.activityDetails;
    const totalTravellers = props.totalTravellers;
    const values = queryString.parse(props.location);
        // var noOfNights = moment(checkout).diff(moment(checkin), "days");

        // let hotelNew=Object.assign({}, hotel);
        // hotelNew.amenities=hotelNew.amenities.splice(-2)
        // hotelNew.images=hotelNew.images.splice(-2)
        if (component.state.activity != "" && component.state.isProd) {
        return {
            type: "activity",
            price: Number(activity.retailPrice),
            //   +(rate.baseFare / noOfNights).toFixed(2) || 0,
            activityList: activity,
            title: activity.gradeTitle,
            subtitle: activity.gradeTitle,
            currency: activity.currencyCode,
            bookingData: { ...{ currency: activity.currencyCode,activityList: activity,totalTravellers:totalTravellers,location:props.location } },
            searchString: activity.gradeTitle,
            selectedActivityInfo: props.selectedActivityInfo,
            activityHotelList: props.activityHotelList,
            questions: props.questions,
            travellerQuestions: props.travellerQuestions,
            selectedPackage: props.selectedPackage
            //  {...queryString.parse(props.location.search),...{sessionId:props.sessionId}}
        };
        } else {
        return;
        }

            // let hotelNew=Object.assign({}, hotel);
            // hotelNew.amenities=hotelNew.amenities.splice(-2)
            // hotelNew.images=hotelNew.images.splice(-2)
            if (component.state.activity != "" && !component.state.dragged) {
                return {
                    type: "activity",
                    price: parseInt(activity.retailPrice),
                    //   +(rate.baseFare / noOfNights).toFixed(2) || 0,
                    activityList: activity,
                    title: activity.gradeTitle,
                    subtitle: activity.gradeTitle,
                    currency: activity.currencyCode,
                    bookingData: {
                        ...{
                            currency: activity.currencyCode,
                            activityList: activity,
                            totalTravellers: totalTravellers
                        }
                    },
                    searchString: activity.gradeTitle
                    //  {...queryString.parse(props.location.search),...{sessionId:props.sessionId}}
                };
            } else {
                return;
            }

            // if(+component.state.roomCount !=0 && !component.state.dragged){

            // }else{
            //     return false
            // }
        },
        endDrag(props, monitor, component) {
            if (!monitor.didDrop()) {
                // You can check whether the drop was successful
                // or if the drag ended but nobody handled the drop
                return;
            }
            component.setState({
                dragged: true
            });
            const item = monitor.getItem();
            const dropResult = monitor.getDropResult();
        }
    };

    const __collect = (connect, monitor) => {
        return {
            connectDragSource: connect.dragSource(),
            connectDragPreview: connect.dragPreview(),
            isDragging: monitor.isDragging()
        };
    };

    const mapStateToProps = state => ({
        itineraryList: state.addcartReducer.itineraryList,
        selectedCurrency: state.commonReducer.selectedCurrency,
        sessionId: state.hotelReducer.sessionId,
        refId: state.addcartReducer.refId
    });

    const mapDispatchToProps = dispatch => ({
        addToItinerary: itPay => dispatch(addItinerary(itPay)),
        loadingGifSearch: () => dispatch(loadingGifSearch()),
        stopGifSearching: () => dispatch(stopGifSearching())
    });

    export default connect(mapStateToProps, mapDispatchToProps)(
        DragSource("ROOM", __itemSource, __collect)(ActivityFinalCard)
    );
