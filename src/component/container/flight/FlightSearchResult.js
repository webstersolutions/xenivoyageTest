import React,{Component} from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";

import img_down from "../../../asset/images/downarrow.png";
import FlightResultFilter from '../flight/FlightResultFilter';
import FlightCard from '../flight/FlightCard';

class FlightSearchResult extends Component{
    render(){
        return(
            <div className="d-flex flex-row tab-column justify-content-start">  
         <FlightResultFilter />
      
         <div className="filterResult">
                 <div className='cardDetailsHowBg' id="content" >
            
                   <FlightCard/>  
                
             <div className="text-center">
             
               <button type='button' className='clickMoreBtn searchBtn' ><img src={img_down} alt='down' /></button>
            
               </div> 
             </div> 
          </div>
       </div>
        );
    }
}
const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({
    
})

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(FlightSearchResult));