import React from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import TopNav from '../component/container/TopNav'
import MainContainer from '../component/container/mainPage/MainContainer'
import ContentContainer from '../component/container/mainPage/ContentContainer'
import Itinerary from '../component/container/Itinerary';
import SearchTool from '../component/container/searchTool/SearchTool';
import SearchBanner from '../component/container/searchTool/SearchBanner';
import SearchResult from '../component/container/mainPage/SearchResult';
import ActivitySearchBanner from  '../component/container/activity/ActivitySearchBanner';
import CarSearchBanner from  '../component/container/car/CarSearchBanner';
// import CarSearchContent from  '../component/container/car/CarSearchContent'
import CarSearchContent from '../component/container/car/CarSearchContent';
import TransferSearchContent from '../component/container/transfer/TransferSearchContent';
import ActivitySearchContent from '../component/container/activity/ActivitySearchContent';
import FlightSearchBanner from  '../component/container/flight/FlightSearchBanner';
import FlightSearchContent from '../component/container/flight/FlightSearchContent';

import MultipleViewContent from '../component/container/multiplebooking/MultipleContent'

import AboutUS from '../component/AboutUs'

import SignIn from "../component//container/login/SignInModal";
import Subscription from '../component/Subscription';
import Loading from '../component/Loading';
import ScrollToTop from '../view/ScrollToTop';
import { init } from '../service/common/action'; 
import CompareContent from "../component/container/hotel/CompareContent";

class Dashboard extends React.Component {
 
constructor(props){
  super(props)
  this.state={
    isVisibleSignIn: false,
    isdivHide:false,
    isgoPro:false
   
  }
}

componentDidMount() {
      window.scrollTo(0,0)
  }
  handleGopro=(value)=>{
  //  this.setState({isgoPro : !this.state.isgoPro})
      this.setState({ isgoPro: value });

  }
handleSignIn =() =>{
  this.setState({isVisibleSignIn:true})
  this.setState({isdivHide:true})
}

onClose =() => {
  this.setState({isVisibleSignIn:false})
}
render() {
  const { isVisibleSignIn ,isdivHide} = this.state;
  const { isSearching, hotelCount, compareHotelList } = this.props;
  console.log(this.props.match.path)
  const renderSignInModal =isVisibleSignIn && <SignIn onHide={this.onClose} isdivHide={isdivHide} handleGopro={this.handleGopro}/>
   const subscription = this.state.isgoPro && (
     <Subscription handleGopro={this.handleGopro} />
   );
  const carCount = 0;
  return (
    <div>
      {renderSignInModal}
      {subscription}
      <TopNav onSignIn={this.handleSignIn} handleGopro={this.handleGopro}  {...this.props}/>
      <MainContainer>
        {<Loading />}
        <ContentContainer>
          <SearchTool path={this.props.match.path} onSignIn={this.handleSignIn}/>

          {this.props.location.pathname == "/hotel/search" &&
            hotelCount != 0 && 
            <React.Fragment>  
              <SearchBanner />
              {compareHotelList.length > 0 && <CompareContent {...this.props} />}
            </React.Fragment>
          }

          {this.props.location.search &&
            hotelCount != 0 &&
            !this.props.location.pathname.includes("/car") && !this.props.location.pathname.includes("/transfer") && !this.props.location.pathname.includes("/activity") &&(
              <SearchResult />
            )}
          {this.props.location.pathname.includes("/car/search") &&
            this.props.carList.length != 0 && <CarSearchBanner />}
          {this.props.location.pathname.includes("/car") && (
            <CarSearchContent />
          )}
          {this.props.location.pathname.includes("/transfer") && (
              <TransferSearchContent />
          )}
           {this.props.location.pathname.includes("/activity") &&   <ActivitySearchContent/>}
         


          {/* {this.props.location.pathname.includes("/flight/search") && (
            <FlightSearchBanner />
          )} */}
          {/* {this.props.location.pathname.includes("/flight") && (
            <FlightSearchContent />
          )} */}

{this.props.location.pathname.includes("/hotel/multiplebooking") && (
            <MultipleViewContent />
          )}

        </ContentContainer>
        <Itinerary />
        <ScrollToTop />
      </MainContainer>
    </div>
  );
  }
}

Dashboard.defaultProps = {
  carList:[]
}
const mapStateToProps = state => ({
  hotelList: state.hotelReducer.hotelList,
  hotelCount: state.hotelReducer.hotelCount,
  carList: state.carReducer.carList,
  compareHotelList: state.hotelReducer.compareHotelList
})

const mapDispatchToProps = dispatch => ({
 // init: () => dispatch(init())
})

export default connect(mapStateToProps, mapDispatchToProps)(DragDropContext(HTML5Backend)(Dashboard))