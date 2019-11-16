import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import InputRange from 'react-input-range';
import downArrow from '../../../asset/images/selarrow.png';
import { toast } from "react-toastify";
import Notifications, { notify } from "react-notify-toast";
import queryString from 'query-string';
import moment from "moment";



import {carESFilter, updatePagingDetails} from '../../../service/car/action';

var currencies = require('country-data').currencies;

const _carTypeValuesArray = [
    "CargoVan",
    "Compact",
    "CompactElite",
    "Convertible",
    "Economy",
    "EconomyElite",
    "Estate",
    "Exotic",
    "ExoticSuv",
    "FifteenPassengerVan",
    "FiftyPassengerCoach",
    "FiveSeatMiniVan",
    "FourWheelDrive",
    "Fullsize",
    "FullsizeElite",
    "Intermediate",
    "IntermediateElite",
    "LargeSuv",
    "LargeTruck",
    "Luxury",
    "LuxuryElite",
    "MediumSuv",
    "MidSize",
    "Mini",
    "MiniElite",
    "MiniVan",
    "Moped",
    "MovingVan",
    "NineSeatMiniVan",
    "Oversize",
    "Premium",
    "PremiumElite",
    "Regular",
    "SevenSeatMiniVan",
    "SmallOrMediumTruck",
    "SmallSuv",
    "Special",
    "Standard",
    "StandardElite",
    "Stretch",
    "Subcompact",
    "SUV",
    "TwelveFootTruckSUV",
    "TwelvePassengerVan",
    "TwentyFootTruck",
    "TwentyFourFootTruck",
    "TwentySixFootTruck",
    "Unique",
]

class CarResultFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                min: 0,
                max: 10000
            },
            isFliterExpand: false,
            isCarTypeExpanded: true,
            selectedCarTypeArray: [],
            selectedVendorArray: [],
            checkbox: {},
            checkboxVendor: {},
            checkboxAuto: false,
            checkboxManual: false,
            checkboxLowToHigh: false,
            checkboxHighToLow: false,
            minPrice:0,
            maxPrice:10000,
            maximumPriceRange: 10000,
            minimumPriceRange: 0,
            dimenstions:null,

        };
    }

    componentWillReceiveProps(nextProps){
        const isUSD = nextProps.currencyDetails && nextProps.currencyDetails.ABR_NAME;
        console.log("state price ? ", this.state.values.max + "<===>" + this.state.values.max)
        if(isUSD == "USD" && this.props.sessionId != nextProps.sessionId){
            this.setState({
                minimumPriceRange: 0,
                maximumPriceRange: 1000,
                values: {
                    min: 0,
                    max: 1000
                },
                minPrice: 0,
                maxPrice: 1000
            })
        } else if (isUSD != "USD" && this.props.sessionId != nextProps.sessionId) {
            this.setState({
                minimumPriceRange: 0,
                maximumPriceRange: 10000 ,
                values: {
                    min: 0,
                    max: 100000
                },
                minPrice: 0,
                maxPrice: 100000
            })
        }
        if(this.props.vendorList !== nextProps.vendorList){
            setTimeout(() => {
              this.setState({
                dimensions: {
                  width: this.container.offsetWidth,
                  height: this.container.offsetHeight,
                },
              }, () => {
                this.props.checkOffsetHeight(this.state.dimensions.height)
              })
            }, 1000);
          }
    }

    handleChange = value => {
        // let res = Object.assign({}, this.state.values);
        //     res.min = value.min < 0 ? 0 : value.min;
        //     res.max = value.max > this.state.values.max ? this.state.values.max :value.max
        // this.setState({values: res });

        let newValue = value
        newValue.min = value.min < 0 ? 0 : value.min
        newValue.max = value.max > 10000 ? 100000 : value.max
        this.setState({values: newValue});
    };

    checkBoxHandler(index, contentType) {

        let selectedCarType = []
        let selectedVendor = []

        let checkbox = this.state.checkbox
        let checkboxVendor = this.state.checkboxVendor

        if (contentType === "type") {

            if (checkbox[index] === true) {
                checkbox[index] = false
            } else if (!checkbox[index]) {
                checkbox[index] = true
            }

        } else if (contentType === "vendor") {

            if (checkboxVendor[index] === true) {
                checkboxVendor[index] = false
            } else if (!checkboxVendor[index]) {
                checkboxVendor[index] = true
            }
        }

        this.setState({
            checkbox,
            checkboxVendor
        }, () => {
            Object.keys(checkbox).map((key, index) => {
                if (this.state.checkbox[key] === true) {
                    selectedCarType.push(this.props.carTypeList[key])
                }
            })

            Object.keys(checkboxVendor).map((key, index) => {
                if (this.state.checkboxVendor[key] === true) {
                    // selectedVendor.push(this.props.vendorList[key].code) Doing With Direct Filter CALL
                    selectedVendor.push(this.props.vendorList[key].name) // Doing with ES f
                }
            })

            this.setState({
                selectedCarTypeArray: selectedCarType,
                selectedVendorArray: selectedVendor
            }, () => {
                this.filterResultsCar()
            })
        })
    }

    filterResultsCar = () => {

        const values = queryString.parse(location.search);

        const {carDropDate, carPickUpDate} = values;

        const days = moment(carDropDate).diff(moment(carPickUpDate), 'days');

        let transmissionType;
        if (this.state.checkboxAuto && !this.state.checkboxManual) {
            transmissionType = "Automatic"
        } else if (this.state.checkboxManual && !this.state.checkboxAuto) {
            transmissionType = "Manual"
        } else {
            transmissionType = ""
        }

        let orderBy;
        if (this.state.checkboxLowToHigh) {
            orderBy = "price asc"
        } else if (this.state.checkboxHighToLow) {
            orderBy = "price desc"
        } else {
            orderBy = null
        }
        let email = null;
        if (this.props.loginDetails) {
            email = this.props.loginDetails.email
        }
        let maxVal = 10000;
        if (this.state.values.max > 10000) {
            maxVal = 100000
        } else {
            maxVal = this.state.values.max
        }


        let filterPayload = {
            email,
            sessionId: this.props.sessionId,
            "currency": this.props.selectedCurrency,
            "paging": {
                "pageNo": 1,
                "pageSize": 30,
                "orderBy": orderBy
            },
            "contentPrefs": [
                "All"
            ],
            "filters": {
                "vehicleType": {
                    "allow": this.state.selectedCarTypeArray
                },
                "vendor": {
                    "allow": this.state.selectedVendorArray
                },
                "price": {
                    "min": +this.state.values.min,
                    "max": maxVal
                },
                "transmission": transmissionType,
            },
            companyList: this.props.vendorList,
            carsType:this.props.carTypeList,
            days
        };

        this.props.updatePagingDetails(filterPayload);
        this.props.filterCar(filterPayload);
    }
    handleMinPrice=(e)=>{
    console.log(this.state.values.max)
        if(this.state.values.max <= Number(e.target.value))
        {
            notify.show("The min cannot be greater than max. Please enter the valid range",'error')
        }  
        else{      
        this.setState({
            minPrice: (e.target.value),
            values: {
                min: Number(e.target.value),
                max: this.state.values.max
            }
        });
    
    this.handleChange({
        min: (e.target.value),
        max: this.state.values.max,
        
    },() => this.filterResultsCar());
}
    
    };

    handleMaxPrice=(e)=>{
        if (this.state.values.min >= Number(e.target.value)) {
            notify.show("The min cannot be greater than max. Please enter the valid range",'error')
        }
        else{
        this.setState({
            maxPrice: (e.target.value),
            values: {
                min: this.state.values.min,
                max: (e.target.value)
            }
        },() => this.filterResultsCar());

       

        
        this.handleChange({
            min: this.state.values.min,
            max: (e.target.value)
        });
    }
    };

    maxRangeChange = e => {
        console.log(e.target.value);
        let max = e.target.value;
        // if (e.target.value == "10000plus") {
        //   max = 100000;
        // } else {
        //   max = e.target.value;
        // }
        if (this.state.values.min > Number(max)) {
          return false;
        }
    
        this.setState({
          maxPrice: Number(max),
          values: {
            min: this.state.values.min,
            max: Number(max)
          }
        }, () => this.filterResultsCar());
            // this.props.priceFiltering(price);
            this.handleChange({
                min: this.state.values.min,
                max: Number(e.target.value)
            });
        };

        minRangeChange = e => {
            console.log(e.target.value);
            if (this.state.values.max < Number(e.target.value)) {
              return false;
            }
            this.setState({
              minPrice: Number(e.target.value),
              values: {
                min: Number(e.target.value),
                max: this.state.values.max
              }
            }, () => this.filterResultsCar());
        
            this.handleChange({
              min: Number(e.target.value),
              max: this.state.values.max
            });
          };


    render() {
        console.log("height", this.state.dimensions)
        const {isFliterExpand, maximumPriceRange, minimumPriceRange} = this.state;
        const {selectedCurrency, carTypeList} = this.props;
        const selectedCurrencyVal = currencies[this.props.selectedCurrency].symbol;
        const {minPrice, maxPrice} = this.state;
        const styles = {
            "f-right": {
                float: "right"
            }
        };  
        let isUSDCurrency = JSON.parse(localStorage.getItem("currency"));
        isUSDCurrency = isUSDCurrency.ABR_NAME;
        let maxVals;
        if (this.state.values.max > 10000 && isUSDCurrency == "USD") {
            maxVals = "1000+";
        } else if (this.state.values.max > 10000 && isUSDCurrency != "USD") {
            maxVals = "10000+";
        } else {
            maxVals = this.state.values.max;
        }

          return (
            <div id="carFilterBg" className={
                isFliterExpand
                    ? "filterBg flex-column align-self-start showFilterBg"
                    : "filterBg flex-column align-self-start"
            }
            ref={el => (this.container = el)}
            >
                <h2>FILTER BY</h2>
                <div className="filterTitle" onClick={() => this.setState({isFliterExpand: !isFliterExpand})}>
                    <h2> FILTER BY <img src={downArrow} className="downArrowImg"/></h2></div>
                <div className="respDeskShow">
                    <div>
                        <h4>Price Range</h4>
                        <div className="slideRange">
                            <InputRange
                                step={50}
                                maxValue={maximumPriceRange}
                                minValue={minimumPriceRange}
                                formatLabel={value => ``}
                                onChangeComplete={value => this.filterResultsCar()}
                                onChange={value => this.handleChange(value)}
                                value={this.state.values}
                            />
                        </div>
                        <span className="rangeVauleLeft"><span
                            style={{fontSize: '16px'}}>{selectedCurrencyVal}</span>&nbsp;{this.state.values.min}</span>
                        <span className="rangeVauleRight"><span
                            style={{fontSize: '16px'}}>{selectedCurrencyVal}</span>&nbsp;{maxVals}</span>
                    
                    {/* <input 
                    style={{width:"80px", height:"27px",padding:"4px",paddingBottom:"4px",colour:"black",borderWidth:"1px",borderStyle:"solid",fontSize:"15px"}}
                    type="number"
                    name="minPrice"
                    placeholder="min"
                    value={this.state.values.min}
                    onChange={this.handleMinPrice}
                    />
                    <input 
                    style={{width:"80px", height:"27px", float:"right",padding:"4px",paddingBottom:"4px",colour:"black",borderWidth:"1px",borderStyle:"solid",fontSize:"15px"}}
                    type="number"
                    name="maxPrice"
                    placeholder="max "
                    value={this.state.values.max}
                    onChange={this.handleMaxPrice}
                    /> */}
                                 {isUSDCurrency != "USD" ?
                                  <div>
                                    <select
                                        value={minPrice}
                                        name="minPrice"
                                        onChange={this.minRangeChange}
                                    >
                                        <option value={0}>0</option>
                                        <option value={2000} selected={minPrice == 2000}>
                                            2000
                                        </option>
                                        <option value={4000} selected={minPrice == 4000}>
                                            4000
                                        </option>
                                        <option value={7000} selected={minPrice == 7000}>
                                            7000
                                        </option>
                                        <option value={10000} selected={minPrice == 10000}>
                                            10000
                                        </option>
                                    </select>
                                    <select
                                        value={maxPrice}
                                        onChange={this.maxRangeChange}
                                        style={styles["f-right"]}
                                    >
                                        <option value={2000} selected={maxPrice == 2000}>
                                            2000
                                        </option>
                                        <option value={4000} selected={maxPrice == 4000}>
                                            4000
                                        </option>
                                        <option value={7000} selected={maxPrice == 7000}>
                                            7000
                                        </option>
                                        <option value={10000} selected={maxPrice == 10000}>
                                            10000
                                        </option>
                                        <option
                                            value={100000}
                                            selected={this.state.values.max == 100000}
                                        >
                                            10000+
                                        </option>
                                    </select>
                                </div>
                                :
                                <div>
                                    <select
                                        value={minPrice}
                                        name="minPrice"
                                        onChange={this.minRangeChange}
                                    >
                                        <option value={0}>0</option>
                                        <option value={200} selected={minPrice == 200}>
                                            200
                                        </option>
                                        <option value={400} selected={minPrice == 400}>
                                            400
                                        </option>
                                        <option value={700} selected={minPrice == 700}>
                                            700
                                        </option>
                                        <option value={1000} selected={minPrice == 1000}>
                                            1000
                                        </option>
                                    </select>
                                    <select
                                        value={maxPrice}
                                        onChange={this.maxRangeChange}
                                        style={styles["f-right"]}
                                    >
                                        <option value={200} selected={maxPrice == 200}>
                                            200
                                        </option>
                                        <option value={400} selected={maxPrice == 400}>
                                            400
                                        </option>
                                        <option value={700} selected={maxPrice == 700}>
                                            700
                                        </option>
                                        <option value={1000} selected={maxPrice == 1000}>
                                            1000
                                        </option>
                                        <option
                                            value={100000}
                                            selected={this.state.values.max == 100000}
                                        >
                                            1000+
                                        </option>
                                    </select>
                                </div>
                                 }
                    </div>
                    <div>
                        <h4>Sort By Price</h4>
                        <ul className="priceRange">
                            <li><input
                                className="filtercheckbox"
                                id="priceRange90"
                                type="checkbox"
                                onChange={() => {
                                    this.setState({
                                        checkboxLowToHigh: !this.state.checkboxLowToHigh,
                                        checkboxHighToLow: false
                                    }, () => this.filterResultsCar())
                                }}
                                checked={this.state.checkboxLowToHigh}
                            />
                                <label htmlFor="priceRange90">
                                    <p>Low to High </p>
                                </label></li>
                            <li><input
                                className="filtercheckbox"
                                id="priceRange91"
                                type="checkbox"
                                onChange={() => {
                                    this.setState({
                                        checkboxHighToLow: !this.state.checkboxHighToLow,
                                        checkboxLowToHigh: false
                                    }, () => this.filterResultsCar())
                                }}
                                checked={this.state.checkboxHighToLow}
                            />
                                <label htmlFor="priceRange91">
                                    <p>High to Low </p>
                                </label></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Car Transmission</h4>
                        <ul>
                            <li>
                                <input
                                    id="acc_877"
                                    type="checkbox"
                                    className="filtercheckbox"
                                    value={this.state.checkboxAuto}
                                    onChange={() => {
                                        this.setState({checkboxAuto: !this.state.checkboxAuto}, () => {
                                            this.filterResultsCar()
                                        })
                                    }}
                                />
                                <label htmlFor={`acc_877`}>Automatic</label>
                            </li>
                            <li>
                                <input
                                    id="acc_787"
                                    type="checkbox"
                                    className="filtercheckbox"
                                    value={this.state.checkboxManual}
                                    onChange={() => {
                                        this.setState({checkboxManual: !this.state.checkboxManual}, () => {
                                            this.filterResultsCar()
                                        })
                                    }}

                                />
                                <label htmlFor={`acc_787`}>Manual</label>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4>Car Type</h4>
                        <ul>
                            {carTypeList.map((each, i) => {

                                if (this.state.isCarTypeExpanded == false) {
                                    return (
                                        <li key={i}>
                                            <input
                                                type="checkbox"
                                                id={`acc_${i}`}
                                                name={each}
                                                className="filtercheckbox"
                                                value={this.state.checkbox[i]}
                                                onChange={this.checkBoxHandler.bind(this, i, "type")}
                                            />
                                            <label htmlFor={`acc_${i}`}>{each}</label>
                                        </li>
                                    )
                                }
                                else if (this.state.isCarTypeExpanded == true) {
                                    if (i <= 5) {
                                        return (
                                            <li key={i}>
                                                <input
                                                    type="checkbox"
                                                    id={`acc_${i}`}
                                                    name={each}
                                                    className="filtercheckbox"
                                                    value={this.state.checkbox[i]}
                                                    onChange={this.checkBoxHandler.bind(this, i, "type")}
                                                />
                                                <label htmlFor={`acc_${i}`}>{each}</label>
                                            </li>
                                        )
                                    }
                                }
                            })}
                        </ul>

                        <a className="showmore" style={{color: '#00a0ff', fontSize: '14px', cursor: 'pointer'}}
                           onClick={() => this.setState({isCarTypeExpanded: !this.state.isCarTypeExpanded})}>
                            {this.state.isCarTypeExpanded == true ? 'Show More' : "Show less"}
                        </a>
                    </div>
                    <div>
                        <h4>Car Company</h4>
                        <ul>
                            {this.props.vendorList && this.props.vendorList.map((each, i) => (
                                <li key={i}>
                                    <input
                                        type="checkbox"
                                        id={`acc_1${i}`}
                                        name={each}
                                        className="filtercheckbox"
                                        value={this.state.checkboxVendor[i]}
                                        onChange={this.checkBoxHandler.bind(this, i, "vendor")}
                                    />
                                    <label htmlFor={`acc_1${i}`}>{each.name}</label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    sessionId: state.carReducer.sessionId,
    selectedCurrency: state.commonReducer.selectedCurrency,
    vendorList: state.carReducer.carVendorList,
    loginDetails: state.loginReducer.loginDetails,
    currencyDetails: state.hotelReducer.currencyDetails,
    carTypeList: state.carReducer.carTypeList
});

const mapDispatchToProps = dispatch => ({
    filterCar: filterInfo => dispatch(carESFilter(filterInfo)),
    updatePagingDetails: payload => dispatch(updatePagingDetails(payload)),
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CarResultFilter));
