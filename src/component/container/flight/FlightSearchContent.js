import React, { Component } from 'react';
import FlightContent from '../flight/FlightContent';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

class FlightSearchContent extends Component {
    render() {
        

        return (
            <div className="sectionCard">
             <FlightContent />
            </div>
        )
      
    }
}
const mapStateToProps = state => ({
    //carList: state.carReducer.carList,
});

const mapDispatchToProps = dispatch => ({

})


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(FlightSearchContent));
