import React from "react";
import { connect } from "react-redux";
import TopNav from "../component/container/TopNav";
import SignIn from "../component/container/login/SignInModal";
import Loading from "../component/Loading";
import { getProfile } from '../service/dashboard/action';
import DashBoardContent from "../component/container/dashboard/DashBoardContent";
import Subscription from '../component/Subscription'
import propTypes from 'prop-types';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleSignIn: false,
      isdivHide: false,
      isgoPro: false  
    };
  }
 handleGopro=(value)=>{
   this.setState({isgoPro : value})
  }
  componentDidMount() {
    const userSession = JSON.parse(sessionStorage.getItem('loginInfo'));
    // const { email } = this.props.loginDetails;
       const { email } = userSession;
    this.props.getProfile(email);
    window.scrollTo(0,0)
    }

  handleSignIn = () => {
    this.setState({ isVisibleSignIn: true });
    this.setState({ isdivHide: true });
  };

  onClose = () => {
      this.setState({ isVisibleSignIn: false });
    };

  render() {
    const { isVisibleSignIn, isdivHide  } = this.state;
    const { isSearching, signupDetails } = this.props;

 

    const renderSignInModal = isVisibleSignIn && (
      <SignIn onHide={this.onClose} isdivHide={isdivHide} />
    );
    const subscription = this.state.isgoPro && (
      <Subscription handleGopro={this.handleGopro} />
    );

    return (
      <div>
        {renderSignInModal}
        {subscription}
        <TopNav onSignIn={this.handleSignIn}  handleGopro={this.handleGopro} />
        {subscription}
        {isSearching && <Loading />}
        <DashBoardContent />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  loginDetails: state.loginReducer.loginDetails,
  isSearching: state.hotelReducer.isSearching,
  hotelList: state.hotelReducer.hotelList,
  hotelCount: state.hotelReducer.hotelCount,

});
const mapDispatchToProps = dispatch => ({
  getProfile:value=>dispatch(getProfile(value))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);



Dashboard.propTypes = { 
  handleGopro :propTypes.func
}
 
