import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import img_car from "../../../asset/images/car/carImg.png";
import img_logo from "../../../asset/images/car/carlogo.png";
import img_carUSer from "../../../asset/images/dashboard/carUser.png";
import img_carDoor from "../../../asset/images/dashboard/door.png";
import img_carLuggage from "../../../asset/images/dashboard/luggage.png";
import clock_SVG from "../../../asset/images/Time.svg";
import PackageRating from "./PackageRating";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


import img_unAvaliable from "../../../asset/images/No_Image.jpg";



import queryString from "query-string";
import moment from "moment";

var currencies = require("country-data").currencies;

class PackageCard extends Component {
  state = {
    isExpand: false,
    photoIndex: 0,
    isOpen: false

  };

  handleSelect = () => {
      this.props.history.push('/package/extra?' + queryString.stringify({
        ...this.props.searchDetails,
        code: this.props.packageDetails.package_id,
    }))
  };
  validImage = (e) => {
    e.target.src = img_unAvaliable
  }
  render() {
    const { isExpand } = this.state;
    const { packageDetails, selectedCurrency } = this.props;
    const parser = new DOMParser();
    const decodedString="";
    return (
      <div className="sectionCard activityCard package">
        {packageDetails && (
          <div className="d-flex flex-row smallColumn">
           < div className="flex-column activityImgDiv align-self-center">
            <button style={{border:"none",background:"none",padding:"0px"}} type="button" onClick={() => this.setState({ isOpen: true })}>
              <img style={{"height":"auto"}}
                src={packageDetails.featured_image}
                alt="No logo available"
                className="activityImgWid"
                onError={this.validImage}
              />
              </button>
            </div>
            <div>
        {
        this.state.isOpen && (
          <Lightbox
            mainSrc={packageDetails.gallery[this.state.photoIndex]}
            nextSrc={packageDetails.gallery[(this.state.photoIndex + 1) % packageDetails.gallery.length]}
            prevSrc={packageDetails.gallery[(this.state.photoIndex + packageDetails.gallery.length - 1) % packageDetails.gallery.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (this.state.photoIndex + packageDetails.gallery.length - 1) % packageDetails.gallery.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (this.state.photoIndex + 1) % packageDetails.gallery.length,
              })
            }
          />
        )}
      </div>

            <div className="detailsBg flex-column activityInfo">
              {/* <PackageRating rating={packageDetails.rating} /> */}
              <h4 style= {{marginBottom:"5px"}}>{

                //packageDetails.title
                
 parser.parseFromString(`<!doctype html><body>${packageDetails.title}`, 'text/html').body.textContent

                }</h4>
              <p style= {{marginBottom:"0px" ,lineHeight:"17px" ,minHeight:"17px"}}>
                <img style={{width:"15px", height:"15px" ,float:"left", marginRight:"5px"}} 
                src="https://xenivoyage.com/wp-content/uploads/2019/01/Logos-for-fav.png"/>{packageDetails.country}</p>

              <ul className="activityInfraStru">
                <li style={{"padding-left":"0px"}}>
                  <img style={{ paddingBottom: "2px", "height":"auto" }} src={clock_SVG} /> {" "}

                  {
                    (packageDetails.duration_type == "multiday") ? 
                    ( " "+ packageDetails.duration-1 + " Nights" + " | " + packageDetails.duration + " Days" ):
                     ( packageDetails.duration + " Hours")
                  

                  }
                </li>
              </ul>
              <p>

              {  (packageDetails.food == "1" || packageDetails.pickup_drop == "1" || packageDetails.accommodation == "1" || packageDetails.flight == "1") ? 
            
            (
              

                  <div style={{padding: "5px"}}>
                    {
                   (packageDetails.flight == "1")? 
                (<span > <i title="Flight Included" className="fa fa-plane facilityicon" aria-hidden="true"></i></span>
                ) :
                ('')
                    }
                  
                    {
                 
                   (packageDetails.pickup_drop == "1")? 
                (<span > <i title="Picup Drop Included" className="fa fa-car facilityicon" aria-hidden="true"></i></span>
                ) :
                ('')
                    }
                  
                  {
                   (packageDetails.accommodation == "1")? 
                (<span > <i title="Accommodation Included" className="fa fa-building facilityicon" aria-hidden="true"></i></span>
                ) :
                ('')
                  }
                  
                 {
                   (packageDetails.food == "1")? 
                (<span > <i title="Food Included" className="fa fa-cutlery facilityicon" aria-hidden="true"></i></span>
                ) :
                ('')
                 }
                 </div>
              ): ('')
            }
                  
                {/* <span>
                  {isExpand
                    ? ReactHtmlParser(packageDetails.shortDescription)
                    : ReactHtmlParser(packageDetails.shortDescription.substring(0, 125)) }
                  <span
                    style={{ color: "cornflowerblue" }}
                    onClick={() => this.setState({ isExpand: !isExpand })}
                  >
                    {packageDetails.shortDescription !=
                    "Description not available"
                      ? isExpand
                        ? " ...show less"
                        : " ...show more"
                      : null}
                  </span>
                </span> */
                <span><ul style={{"list-style":"none", "padding-left":"0px"}}>
                <li>{packageDetails.highlights[0]}</li>
                <li>{packageDetails.highlights[1]}</li>
                </ul>
                </span>
                }
              </p>
            </div>
            <div className="rateShowDiv flex-column">
              
            
              
                
                  
              
                {/* <h2>{`${currencies[packageDetails.currencyCode].symbol}${packageDetails.price}`}</h2> */}
          
              <div className="priceDiv">
              <p class="text-center">Starting from</p>
              <h2> ${packageDetails.deal_price}</h2>

                <h2 style={{textDecoration:"line-through", fontWeight:"100", color:"#7e818c"}}> ${packageDetails.actual_price}</h2>
                
{/* 
              <span class="price"><span class="amount"><span style={{textDecoration:"line-through"}}>$1228</span>
$978.00</span></span>  */}
              </div>

              <button type="button" className="selectRoomBtn" onClick={this.handleSelect}>
                Select
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  sessionId: state.carReducer.sessionId,
  selectedCurrency: state.carReducer.selectedCurrency
});

export default withRouter(connect(mapStateToProps)(PackageCard));
