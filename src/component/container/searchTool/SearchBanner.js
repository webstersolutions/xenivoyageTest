import React, { Component } from "react";
import moment from 'moment';
import { connect } from "react-redux";
import queryString from "query-string";

import img_DateArrow from "../../../asset/images/Date Arrow.png";
import { searchHotel } from "../../../service/hotel/action";
class SearchBanner extends Component {
  
  state={
     checkin:"",
     checkout:""
  };

  static defaultProps = {
    style: {},
  };

  componentDidMount=()=>{
    const values = queryString.parse(window.location.search);
    const { checkin, checkout, adult, child } = values;
    this.setState({ checkin: checkin ,checkout:checkout});
  };
 
  render() {
    const { hotelCount, searchDate: { start, end }, resultCount, style } = this.props;
    return (
      <div>
        {!!resultCount && (
          <div className="sectionCard searchRes" style={style}>
            <div className="text-center searchInfo">
              <h3 className="respone-mobileHotel"> Displaying  {resultCount} out of {hotelCount} hotels available from  <ul className="hotelDate">
                <li className="border">
                  <h5 style={{fontSize:"20px"}}>
                    {moment(start ? start : this.state.checkin)
                      .format("MMM DD")
                      .toUpperCase()}
                  </h5>
                  <p style={{fontSize:"17px",minWidth:"77px"}}>
                    {moment(start ? start : this.state.checkin).format(
                      "dddd"
                    )}
                  </p>
                </li>
                <li>
                  <img src={img_DateArrow} alt="" />
                </li>
                <li className="border">
                  <h5 style={{fontSize:"20px"}}>
                    {moment(end ? end : this.state.checkout)
                      .format("MMM DD")
                      .toUpperCase()}
                  </h5>
                  <p style={{fontSize:"17px",minWidth:"77px"}}>
                    {moment(end ? end : this.state.checkout).format("dddd")}
                  </p>
                </li>
              </ul></h3>
             
            </div>
            {/* <button>load More</button> */}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hotelCount: state.hotelReducer.hotelCount,
  resultCount: state.hotelReducer.hotelList.length,
  searchDate: state.hotelReducer.searchDate,
});
const mapDispatchToProps = dispatch => ({
  searchHotel: searchInfo => dispatch(searchHotel(searchInfo)),
  
})
export default connect(mapStateToProps, null)(SearchBanner);
