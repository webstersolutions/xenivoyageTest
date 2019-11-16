import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import InputRange from 'react-input-range';
import downArrow from '../../../asset/images/selarrow.png';

import { carFilter,updatePagingDetails } from '../../../service/car/action';

const _cabinClass = [
  'Basic Economy',
  'Economy',
  'premium Economy',
  'Business',
  'Fixed',
  'Mixed'
]
const _airlines = [
    'Air India',
    'Air Canada',
    'American Airlines',
    'Delta',
    'SriLankan',
    'SouthWest'
]

class FlightResultFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFliterExpand: false,
     // isCarTypeExpanded: true,
      
      values: {
        min: 0,
        max: 10000
      },
    };
  }

 

 

  

  render() {
    const { isFliterExpand } = this.state;
    return (
      <div id="top" className={
        isFliterExpand
          ? "filterBg flex-column align-self-start showFilterBg"
          : "filterBg flex-column align-self-start"
      }>
        <h2>FILTER BY</h2>
        <div className="filterTitle" onClick={() => this.setState({ isFliterExpand: !isFliterExpand })} >
          <h2> FILTER BY  <img src={downArrow} className="downArrowImg" /> </h2></div>
        <div className="respDeskShow">
          <div>
            <h4>Price Range</h4>
            <div className="slideRange">
              <InputRange
                  step={50}
                maxValue={10000}
                minValue={0}
                formatLabel={value => ``}
                onChangeComplete={value => this.filterResultsCar()}
                onChange={value => this.handleChange(value)}
                value={this.state.values}
              />
            </div>
            <span className="rangeVauleLeft">${this.state.values.min}</span>
            <span className="rangeVauleRight">${this.state.values.max}</span>
          </div>
          <div>
          <h4>Cabin Class</h4>         <ul>
            {_cabinClass.map((each, i) => {

             
                  return (
                    <li key={i}>
                      <input
                        type="checkbox"
                        id={`acc_${i}`}
                        name={each}
                        className="filtercheckbox"
                        
                       
                      />
                      <label htmlFor={`acc_${i}`}>{each}</label>
                    </li>
                  )
              }
              
            )}
          </ul>

          </div>
          <div>
            <h4>Flight Times</h4>
            <div className="slideRange">
               <span className="rangeSlidername">Depart Form Mumbai</span> 
              <InputRange
                  step={50}
                maxValue={10000}
                minValue={20}
                formatLabel={value => ``}
                onChangeComplete={value => this.filterResultsCar()}
                onChange={value => this.handleChange(value)}
                value={this.state.values}
              />
            </div>
            <span className="rangeVauleLeft">12.00am</span>
            <span className="rangeVauleRight">12.00pm</span>

            <div className="slideRange">
                <span className="rangeSlidername">Arrival to Mumbai</span> 
              <InputRange
                  step={50}
                maxValue={10000}
                minValue={20}
                formatLabel={value => ``}
                onChangeComplete={value => this.filterResultsCar()}
                onChange={value => this.handleChange(value)}
                value={this.state.values}
              />
            </div>
            <span className="rangeVauleLeft">12.00am</span>
            <span className="rangeVauleRight">12.00pm</span>
          </div>

          <div>
            <h4>Airlines</h4>         <ul>
              {_airlines.map((each, i) => (
                <li key={i}>
                  <input
                    type="checkbox"
                    id={`acc_1${i}`}
                    name={each}
                    className="filtercheckbox"
                  />
                  <label htmlFor={`acc_1${i}`}>{each}</label>
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
 
});

const mapDispatchToProps = dispatch => ({

})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FlightResultFilter));