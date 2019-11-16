import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import Footer from '../component/Footer';
import TopNav from '../component/container/TopNav';
import img_call from '../asset/images/aboutUs/call.png';
import img_mail from '../asset/images/aboutUs/email.png';
import img_address from '../asset/images/aboutUs/address.png';
import  ScrollToTop from '../view/ScrollToTop';
import Notifications, { notify } from "react-notify-toast";
import URL from '../asset/configUrl'
// import axios from '../'
import axios from '../Utils/request-process'
import { connect } from "react-redux";
import { loadingGifSearch,stopGifSearching } from '../service/common/action';
class ContactUs extends Component{
    constructor(props) {
        super(props)
        {
            this.state = {
              firstName: "",
              lastName: "",
              email: "",
              mobile: "",
              details: "",
              formErrors: { firstName: "", lastName: "", mobile:"" ,email:""},
              emailValid: false,
              firstNameValid: false,
              lastNameValid: false,
              mobileValid: false,
              emailValid:false,
              formValid: false
            };
        }
        
    }

    componentDidMount() {
        window.scrollTo(0, 0)
      }

      handleChange=(e)=>{
          const name= e.target.name;
          const value=e.target.value;
          this.setState({[name]:value},
             () => { this.validateField(name, value) 
          })
      }
      
validateField(fieldName, value) {
  let fieldValidationErrors = this.state.formErrors;
  let emailValid = this.state.emailValid;
  let firstNameValid = this.state.firstNameValid;
  let lastNameValid = this.state.lastNameValid;
  let mobileValid = this.state.mobileValid;

  switch (fieldName) {
    case "email":
      emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      fieldValidationErrors.email = emailValid ? "" : "Email is invalid";
      break;
    case "firstName":
      firstNameValid = value.length >= 3;
      fieldValidationErrors.firstName = firstNameValid ? "" : "FirstName is too short";
      break;
    case "lastName":
      lastNameValid = value.length > 0;
      fieldValidationErrors.lastName = lastNameValid ? "" : "Required";
      break;
    case "mobile":
      mobileValid = value.length > 0;
      fieldValidationErrors.mobile = mobileValid ? "" : "Required";
      break;
    default:
      break;
  }
  this.setState({formErrors: fieldValidationErrors,
                  emailValid: emailValid,
                  firstNameValid: firstNameValid,
                  lastNameValid:lastNameValid,
                  mobileValid:mobileValid
                }, this.validateForm);
}

validateForm() {
  this.setState({formValid: this.state.emailValid && this.state.firstNameValid && this.state.lastNameValid && this.state.mobileValid});
}



handleSubmit=(e)=>{
   e.preventDefault()
    const payload={ 
        "first_name":this.state.firstName,
        "email":this.state.email,
        "last_name":this.state.lastName,
        "phone_number":this.state.mobile,
        "message_details":this.state.details
    }
   this.props.loadingGifSearch()
   axios.post(URL.CONTACT_DETAILS,payload)
   .then(response=>{
       this.setState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        details: "",
       })

     this.props.stopGifSearching()  
     notify.show( response.data.data, "success", 3000);
    //  setTimeout(() => {
    //      this.props.history.push('/')
    //  }, 100);
   })
   .catch(error=>{
    this.props.stopGifSearching()     
    notify.show( error.response.data.data, "error", 3000);
   })
}


    render(){
        const {formErrors}=this.state
        return(
            <React.Fragment>
                <Notifications/>
            <TopNav onClick={this.props.onSignIn} />
            <section class="contactUsBg">
                <div className="container">
                    <div className="contactUsTitle"><h3>Contact Us</h3></div>
                    
                    <div className="row mt-4">
                        <div className="col-12 col-sm-12 col-md-1 col-lg-1"></div>
                         <div className="col-12 col-sm-12 col-md-5 col-lg-5">
                                 <div className="contactInfos">
                                    <ul>
                                        <li><span><img src={img_call}/></span>  <p>1 800 936 2927</p></li>
                                        <li><span><img src={img_mail}/></span>  <p>info@xeniapp.com</p></li>
                                        <li><span><img src={img_address}/></span>  
                                        <address>
                                        157 Columbus Ave, New York NY, 10023
                                        </address>
                                        </li>
                                    </ul>
                                </div>
                                <div className="contactMap">
                                     <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6042.886458928348!2d-73.980682!3d40.774269!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258f52d8a984f%3A0x5a127c2c544c367b!2s157+Columbus+Ave%2C+New+York%2C+NY+10023%2C+USA!5e0!3m2!1sen!2sin!4v1550743523241" frameborder="0"  allowfullscreen style={{width:'100%',height:'200px',border:'1px solid #ccc'}}></iframe>
                                </div>

                        </div>
                        <ScrollToTop />
                        <div className="col-12 col-sm-12 col-md-5 col-lg-5">
                            <div className="form-group">
                                <input type="text"  name="firstName" value={this.state.firstName} placeholder="First Name" onChange={this.handleChange} />
                                {formErrors && <span style={{color:"red"}}>{formErrors.firstName}</span>}
                            </div>
                            <div className="form-group">
                                <input type="text"  name="lastName" value={this.state.lastName} placeholder="Last Name" onChange={this.handleChange}/>
                                {formErrors.lastName && <span style={{color:"red"}}>{formErrors.lastName}</span>}
                            </div>
                            <div className="form-group">
                                <input type="text"  name="email" value={this.state.email} placeholder="Email" onChange={this.handleChange}/>
                                {formErrors.email && <span style={{color:"red"}}>{formErrors.email}</span>}

                            </div>
                            <div className="form-group">
                                <input type="text"  name="mobile" value={this.state.mobile} placeholder="Mobile" onChange={this.handleChange}/>
                                 {formErrors.mobile && <span style={{color:"red"}}>{formErrors.mobile}</span>}

                            </div>
                            <div className="form-group">
                               <textarea name="details"   value={this.state.details} placeholder="Write Something" onChange={this.handleChange}></textarea>
                            </div>
                            <div className="form-group">
                                <button type="button" className="searchBtn" disable={!this.state.formValid} onClick={this.handleSubmit}>Send</button>
                            </div>
                        </div>
                       
                    </div>
                </div>
            </section>
            <Footer/>
            </React.Fragment>
        )
    }

}

const mapDispatchToProps = dispatch => ({
    loadingGifSearch : () => dispatch(loadingGifSearch()),
    stopGifSearching : () => dispatch(stopGifSearching()),
  });
export default connect(null,mapDispatchToProps)(ContactUs);

