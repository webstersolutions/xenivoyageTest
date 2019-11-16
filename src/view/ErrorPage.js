import React, { Component } from "react";

import img_logo from '../asset/images/erroePageLogo.png';
import { NavLink } from 'react-router-dom';
class ErrorPage extends Component{

    render(){
        return(
            <section className="errorPageBg">
                <div className="errorPageContent">
                    <h1>404 <span className="errorCodeLogo"></span></h1>
                    <h5>We’re Sorry , the page requested could not found</h5>
                    {/* <button type="button" className="errorPageBtn">Back To Home</button> */}
                    <NavLink to="/" className="errorPageBtn">Back To Home</NavLink>
                </div>
            </section>
        )
    }
}export default ErrorPage;