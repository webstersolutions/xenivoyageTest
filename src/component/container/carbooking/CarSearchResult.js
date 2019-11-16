import React, { Component } from "react";
import CarContent from "../car/CarContent"

class CarSearchResult extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="sectionCard">
               <CarContent/>
        </div>
      </React.Fragment>
    );
  }
}

export default CarSearchResult;
