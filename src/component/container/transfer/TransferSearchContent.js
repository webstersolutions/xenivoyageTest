import React, { Component } from 'react';
import TransferContent from './TransferContent';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

class TransferSearchContent extends Component {
    render() {
        return (
            <div className={ this.props.location.pathname !== "/car" &&  this.props.location.pathname !== "/transfer" ? "sectionCard" : ''}>
                {this.props.location.pathname !== "/transfer" ? <TransferContent {...this.props}/> :""}
            </div>
        )
    }
}
const mapStateToProps = state => ({
    carList: state.carReducer.carList,
});

const mapDispatchToProps = dispatch => ({

})

TransferSearchContent.defaultProps={
    carList:[]
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(TransferSearchContent));
