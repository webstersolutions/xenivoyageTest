import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import DBOverview from './DBOverview';
import DBPaymentMethod from './DBPaymentMethod';
import DBProfileSetting from './DBProfileSetting';
import DBTrips from './DBTrips';
import DBWishList from './DBWishList';
import DBMySubscription from './DBMySubscription';
import XeniCoin from './XeniCoin'


class DashboardRightPane extends Component {
  render() {
    return (
        <Switch>
        <Redirect path="/dashboard" exact to="/dashboard/overview" />
        <Route path="/dashboard/overview" component={DBOverview}/>
        <Route path="/dashboard/payment" component={DBPaymentMethod}/>
        <Route path="/dashboard/profile" component={DBProfileSetting}/>
        <Route path="/dashboard/my-trips" component={DBTrips}/>
        <Route path="/dashboard/wish-list" component={DBWishList}/>
        <Route path="/dashboard/mySubscription" component={DBMySubscription}/>
      
        <Route path="/dashboard/xeni-coin" component={XeniCoin}/>
      </Switch>
    );
  }
}

export default DashboardRightPane;