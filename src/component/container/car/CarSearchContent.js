import React, { Component } from 'react';
import CarContent from '../car/CarContent';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

class CarSearchContent extends Component {
    render() {
        return (
            <div className={ this.props.location.pathname != "/car" ? "sectionCard" : ''}>
             <CarContent {...this.props}/>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    carList: state.carReducer.carList,
});

const mapDispatchToProps = dispatch => ({

})

CarSearchContent.defaultProps={
    carList:[]
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(CarSearchContent));
