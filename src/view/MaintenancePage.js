import React, { Component } from "react";

import img_logo from '../asset/images/erroePageLogo.png';
import { NavLink } from 'react-router-dom';
class MaintenancePage extends Component{

    render(){
        return(
            <section className="errorPageBg">
                <div className="errorPageContent">
                    <h1 style={{fontSize:"58px"}}>We'll be back soon!</h1>
                    <h5 style={{fontSize:"25px"}}>Sorry for the inconvenince but we are performing some maintenance at the moment. If you need to, you can always contact us, otherwise we'll be back online shortly!</h5>
                    {/* <button type="button" className="errorPageBtn">Back To Home</button> */}
                    <NavLink to="/" className="errorPageBtn">Back To Home</NavLink>
                </div>
            </section>
        )
    }
}export default MaintenancePage;