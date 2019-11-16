import React, { Component } from 'react';
import { connect } from "react-redux"
import { reduxForm, Field } from "redux-form";
import Select from 'react-select'
import countryList from 'react-select-country-list';
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

import { updateProfile, changePassword, getProfile } from '../../../service/dashboard/action';
import ResetPassword from '../../container/dashboard/ResetPassword';
import InputField from '../../../component/Fields/TextField';

class DBProfileSetting extends Component {
    constructor(props){
        super(props)
        this.state={
            options: countryList().getData(),
            country:"",
            state:"",
                      
        }
    }
    componentWillMount(){
        window.scrollTo(0,0);
    }
    componentDidMount() {
      this.handleFormInitialValues();
     
    }
  
    handleFormInitialValues = () => {
         const { profileData } = this.props;


         if(profileData){
             try{
                const {  street_address, city, state, postal_code, country,home_airport} =  profileData.address_info
                const { first_name, last_name, phone_number, email } = profileData.personal_info
       
               this.props.initialize({
                  
                   street_address,
                   city,
                   state,
                   postal_code,
                   country,
                   first_name,
                   last_name,
                   phone_number,
                   email,
                   home_airport
               })
               this.setState({country})
               this.setState({state})
             
             }catch(e){

             }
            }
         
    }
   
    handleProfileSubmit = formValues => {
        
      
        const { email } =this.props.loginDetails;
        const { first_name, last_name, phone_number, home_airport,
            street_address, city, postal_code } = formValues;
            const { country , state } = this.state;
           

        const payloadInfo = {
            personal_information: {
                first_name,
                last_name,
                email,
                phone_number
            },
            address: {
                home_airport,
                street_address,
                city,
                state,
                postal_code,
                country
            }

        }

        this.props.updateProfile(payloadInfo);
    }

    // changeHandler = nationality => {
    //     this.setState({ nationality });
    //   };

    selectCountry(val) {
        if (val !== "" && this.state.state !== "") {
          this.setState({ country: val, btnDisable: true });
        } else {
          this.setState({ country: val, btnDisable: false });
        }
      }
    
      selectRegion(val) {
       
        if (val !== "" && this.state.country !== "" ) {
          this.setState({ state: val, btnDisable: true });
        } else {
          this.setState({ state: val, btnDisable: false });
        }
      }
    handleChangePassword = value => {
        const {email} =this.props.loginDetails;

        const payload = {
            email: email,
            current_password: value.current_password,
            new_password: value.new_password,
            confirm_password: value.confirm_password
        }
        this.props.changePassword(payload);
    }

    render() {

        const { handleSubmit } = this.props;
        const { country ,state } = this.state;
       
        return (
            <div className="dashRightSide align-self-start">
                <div className="profileSetting">

                    <h5>Personal Information</h5>
                    <form onSubmit={handleSubmit(this.handleProfileSubmit)}>
                        <div className="row">
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <div className="form-group userIcon">
                                    <Field
                                        label="First Name"
                                        name="first_name"
                                        type="text"
                                        className="form-control"
                                        component={InputField}
                                        placeholder=""/>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <div className="form-group userIcon">
                                    <Field
                                        label="Last Name"
                                        name="last_name"
                                        type="text"
                                        className="form-control"
                                        component={InputField}
                                        placeholder="Last Name"
                                        value="hh"/>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <div className="form-group mailIcon">
                                    <Field
                                        disabled                                
                                        name="email"
                                        type="text"
                                        label="E-mail"
                                        component={InputField}
                                        placeholder="E-mail"
                                        className="form-control" />
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <div className="form-group callIcon">
                                    <Field
                                        name="phone_number"
                                        type="text"
                                        label="Phone Number"
                                        component={InputField}
                                        placeholder="Phone Number"
                                        className="form-control"
                                        value="" />
                                </div>
                            </div>
                        </div>
                        <h5>Home Location</h5>
                        <div className="row">
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <div className="form-group flightIcon">
                                    <Field
                                        name="home_airport"
                                        type="text"
                                        label="Home Airport"
                                        component={InputField}
                                        placeholder="Home Airport"
                                        className="form-control"
                                        value="" />
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <div className="form-group streetIcon">
                                    <Field
                                        name="street_address"
                                        type="text"
                                        label="Street Address"
                                        component={InputField}
                                        placeholder="Street Address"
                                        className="form-control"
                                        value="" />
                                </div>
                            </div>
                            {/* <div className="col-sm-12 col-md-3 col-lg-3">
                                <div className="form-group noIcons">
                                    <Field
                                        name="city"
                                        type="text"
                                        label="City"
                                        component={InputField}
                                        placeholder="City"
                                        className="form-control"
                                        value=""
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-3 col-lg-3">
                                <div className="form-group noIcons">
                                   
                                        <Field
                                            name="state"
                                            type="text"
                                            label="State/Province/Region"
                                            component={InputField}
                                            placeholder="State"
                                            className="form-control"
                                            value=""
                                        />
                                    
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-3 col-lg-3">
                                <div className="form-group noIcons">
                                    
                                        <Field
                                            name="postal_code"
                                            type="text"
                                            label="Zip/Postal Code"
                                            component={InputField}
                                            placeholder="Zip/Postal Code"
                                            className="form-control"
                                            value=""
                                        />
                                   
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-3 col-lg-3">
                                <div className="form-group noIcons">
                                   
                                    
                                        <Field
                                            name="country"
                                            type="text"
                                            label="Country"
                                            component={InputField}
                                            placeholder="Country"
                                            className="form-control"
                                            value=""
                                        />
                                    
                                </div>
                            </div> */}
                          
              </div>
              <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-3">
                  <div className="form-group">
                    <label>Select Country</label>
                    <CountryDropdown
                      name={country}
                      value={country}
                      valueType="short"
                      className="form-control"
                      //countryValueType="short"
                      onChange={val => this.selectCountry(val)}
                    />
                  </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-3">
                  <div className="form-group">
                    <Field
                      name="city"
                      type="text"
                      label="City/Town"
                      className="form-control"
                      component={InputField}
                      placeholder="City/Town "
                    />
                  </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-3">
                  <div className="form-group">
                    <label>State</label>
                    <RegionDropdown
                      countryValueType="short"
                      country={country}
                      value={state}
                      valueType="short"
                      className="form-control"
                      onChange={val => this.selectRegion(val)}
                    />
                  </div>
                  </div>
                  <div className="col-sm-12 col-md-3 col-lg-3">
                                <div className="form-group noIcons">
                                    
                                        <Field
                                            name="postal_code"
                                            type="text"
                                            label="Zip/Postal Code"
                                            component={InputField}
                                            placeholder="Zip/Postal Code"
                                            className="form-control"
                                            value=""
                                        />
                                   
                                </div>
                            </div>
                            {/* <div className="col-xl-3 col-lg-3 col-md-3">
                                <div className="form-group noIcons">
                                    <label>Nationality</label>
                                    <Select
                                    options={this.state.options}
                                    value={this.state.nationality}
                                    onChange={this.changeHandler}
                                    />
                                </div>
                             </div> */}
                            <div className="col-sm-12 col-md-12 col-lg-12"><button className="searchBtn float-right mb-3">Save Changes</button></div>
                        </div>
                    </form>
                    <ResetPassword resetPassword={this.handleChangePassword} />
                </div>
            </div>
        );
    }
}

const validateProfile = formValues => {
    const errors = {};
    if (!formValues.first_name) {
        errors.first_name = 'Please Enter Firstname'
    }
    if (!formValues.last_name) {
        errors.last_name = 'Please Enter Lastname'
    }
    if (!formValues.email) {
        errors.email = "Please Enter E-mail";
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)
    ) {
        errors.email = "Invalid Email Address";
    }

    if (!formValues.phone_number) {
        errors.phone_number = "Required";
      } else if (/\D/.test(formValues.phone_number)) {
        errors.phone_number = "Numbers only allowed";
      }
   
    if (!formValues.home_airport) {
        errors.home_airport = "Please Enter Home Airport"
    }
    if (!formValues.street_address) {
        errors.street_address = "Please Enter Street Address"
    }
    if (!formValues.city) {
        errors.city = "Please Enter City"
    }
    if (!formValues.state) {
        errors.state = "Please Enter State"
    }
    if (!formValues.postal_code) {
        errors.postal_code = "Please Enter Zip Code"
    }
    if (!formValues.country) {
        errors.country = "Please Enter Country"
    }
    return errors;
}

const mapStateToprops = state => ({
    profileSuccessInfo: state.dashboardReducer.profileSuccessInfo,
    loginDetails: state.loginReducer.loginDetails,
    profileData:state.dashboardReducer.profileData
})
const mapDispatchToProps = dispatch => ({
    updateProfile: value => dispatch(updateProfile(value)),
    changePassword: value => dispatch(changePassword(value)),
    getProfile:value=>dispatch(getProfile(value))
})

export default reduxForm({
    form: "profileForm",
    validate: validateProfile,
    
})(connect(
    mapStateToprops,
    mapDispatchToProps
)(DBProfileSetting)
);