import React, {Component} from "react";
import {withRouter} from 'react-router-dom';
import {Switch, Route} from 'react-router-dom';
import {connect} from "react-redux";

import TransferNavBanner from "./TransferNavBanner";
import TransferSearchResult from './TransferSearchResult';
import TransferConfirmContent from './TransferConfirmContent';
import TransferExtraContent from './TransferExtraContent';

class TransferContent extends Component {
    constructor(props, context) {
        super(props, context)
    }

    render() {
        return (
            <React.Fragment>
                <div className="d-flex flex-row tab-column justify-content-start">
                    <TransferNavBanner {...this.props} />
                </div>

                {<Switch>
                    <Route key='transfer' {...this.props} exact path="/transfer/search"
                           component={TransferSearchResult}/>
                    <Route key='confirm' {...this.props} exact path="/transfer/confirm"
                           component={TransferConfirmContent}/>
                    <Route key='extras' {...this.props} exact path="/transfer/extras" component={TransferExtraContent}/>
                </Switch>}

            </React.Fragment>
        );
    }

}

const mapStateToProps = state => ({
    isSearching: state.hotelReducer.isSearching
});

export default withRouter(connect(
    mapStateToProps,
    null
)(TransferContent));
