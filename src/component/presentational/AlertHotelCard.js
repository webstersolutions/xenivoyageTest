import React from "react";

const AlertHotelCard = props => {
  const { alertInfo } = props;
  if (props.type == "hotel") {
    return (
      <div className="sectionCard marginTop0">
        <span className="noHotels">
          <i className="fas fa-hotel"></i>
        </span>
        <h2 className="noHotelText">{alertInfo}</h2>
      </div>
    );
  } else if (props.type == "car") {
    return (
      <div>
      <div className="sectionCard marginTop0">
        <span className="noHotels">
          <i className="fas fa-car"></i>
        </span>
        <h2 className="noHotelText">{alertInfo}</h2>
       
      </div>
       <div className="sectionCard marginTop0">
       <div className="row" style={{padding:"15px"}}>
         <p>
           Currenlty the services you are searching are not available. Click
           the Submit button below & we will check with our other partners
           for the above request and update you shortly.
         </p>
       </div>
       <div className="row" style={{justifyContent:"center"}}>
         <span style={{background:"#FFC107",padding:"8px 40px",borderRadius:"50px",cursor:"pointer",border:"1px solid #795548"}} >
         {/* ⦁	PDF download - I will send you the details */}

         <a>submit</a>
         </span>
        
       </div>
     </div>
     </div>
    );
  } else if (props.type == "activity") {
    return (
      <div className="sectionCard marginTop0">
        <span className="noHotels">
          <i className="fas fa-hotel"></i>
        </span>
        <h2 className="noHotelText">{alertInfo}</h2>
      </div>
    );
  }else if (props.type == "package") {
    return (
      <div className="sectionCard marginTop0">
        <span className="noHotels">
          <i className="fas fa-hotel"></i>
        </span>
        <h2 className="noHotelText">{alertInfo}</h2>
      </div>
    );
  }
};

export default AlertHotelCard;
