import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { sumBy as _sumBy, map as _map, get as _get } from 'lodash'
import base64Img from "base64-img";
import { profileImageChange, upload, getProfile } from "../../../service/dashboard/action";
import DashboardRightPane from "./DashboardRightPane";
import img_manuser from "../../../asset/images/dashboard/man-user.png";
import img_history from "../../../asset/images/dashboard/history.png";
import img_settings from "../../../asset/images/dashboard/settings.png";
// import img_xeniapp from "../../../asset/images/dashboard/xeniapp.png";
import img_payment from "../../../asset/images/dashboard/payment.png";
import img_heart from "../../../asset/images/dashboard/heart.png";
// import img_sachine from "../../../asset/images/dashboard/sachine.jpg";
import img_xennies from "../../../asset/images/dashboard/logo-xennies.png";
import img_user from "../../../asset/images/dashboard/download.jpg";
import img_subscription from "../../../asset/images/dashboard/subscription.png";
import img_helpicon from "../../../asset/images/dashboard/helpicon.png";
import swal from "sweetalert";
import axios from "../../../Utils/request-process";
import configURL from "../../../asset/configUrl";

class DashBoardContent extends Component {
  constructor() {
    super();
    this.state = {
      model: false,
      file: "",
      fileImage: "",
      error: "",
      errorValid: null,
      imageUrl: img_user,
      imagePath: "",
      fileName: ""
    };
  }
  imageUpload = e => {
    
    let reader = new FileReader();
    let file = e.target.files[0];
    if(file.type=="image/png" || file.type=="image/jpg" || file.type == "image/jpeg" )
    {
    this.setState({ errorValid: false });
    this.setState({file: "", imagePreviewUrl: null, fileImage: ""})
    if (file.size < 5000000 ){
      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result,
          fileImage: URL.createObjectURL(file),
          error: "",
          fileName: file.name
         
        }); 
      };
     
    }
    
    else {
      this.setState({
        file: file,
        fileImage: URL.createObjectURL(file),
        error: ""
      })
    }
  
}
  else{
    this.setState({ errorValid:true });
    swal("Only .JPG and .PNG  files are  allowed")
  }

    reader.readAsDataURL(file);
    e.preventDefault();
    // this.setState({
    //   file: readAsDataURL(event.target.files[0])
    // });
  };
  handleUpload = () => {
    this.setState({ model: !this.state.model ,imagePreviewUrl: null, file :"" ,error: "",fileImage:""});
  };

  uploadImageSubmit = e => {
    e.preventDefault();

    // const payload = {
    //   userPhoto: this.state.file,
    //   email: "prakash@yopmail.com",
    //   fileToDelete: "uploads/userPhoto-1546429500670"
    // };
    if(this.state.file.size > 5000000){
      this.setState({
        error: "Maximum image size is 5MB"
      });
    }
    else if(this.state.fileImage === ""){
      this.setState({
        error: "No Image Selected"
      });
      
    }
  
  else {
    
   if( this.state.errorValid==false)
  {
    
    
      const { email, profile_image } = this.props.loginDetails;
      // const { model } = this.props.uploadImage;
      var formData = new FormData();
      formData.append("userPhoto", this.state.file);
      formData.append("email", email);
      formData.append("fileToDelete", profile_image ? profile_image : null);
      this.props.upload(formData);
      this.setState({ model: false ,file:"", fileName: ""});
     }
   
    setTimeout(() => {
      this.setState({ error: "" });
    }, 1000);
  }

  };
  getImagePath = email => {
    axios
      .get(configURL.GET_PROFILE_PIC + "/" + email)
      .then(response => {
        console.log(response);
        this.setState(
          {
            imagePath: response.data.data.image_path
          },
          () => {
            this.props.dummyRender();
          }
        );
      })
      .catch(err => {
        this.setState({
          imagePath: ""
        });
      });
    console.log(this.state.imagePath);
  };

  getImageURL = email => {
    axios
      .get(configURL.GET_PROFILE_PIC + "/" + email)
      .then(response => {
        this.setState(
          {
            imageUrl: response.data.data.image_path
          },
          () => {
            this.props.dummyRender();
          }
        );
      })
      .catch(err => {
        this.setState({
          imageUrl: img_user
        });
      });
  };

  componentDidMount() {
    const userSession = JSON.parse(sessionStorage.getItem("loginInfo"));
    if (userSession.email) {
      // this.getImageURL(userSession.email);
      // this.getImagePath(userSession.email);
      this.props.getProfile(userSession.email);
    }
  }

  componentWillReceiveProps(nextProps, prevProps) {
    if (nextProps.uploadImage != this.props.uploadImage) {
      const userSession = JSON.parse(sessionStorage.getItem("loginInfo"));
      if (userSession.email) {
        // this.getImageURL(userSession.email);
        // this.getImagePath(userSession.email);
        this.props.getProfile(userSession.email);
      }
    }
  }

  render() {
    const userSession = JSON.parse(sessionStorage.getItem("loginInfo"));
    const { pathname } = this.props.history.location;
    // const { loginDetails } = this.props;
    const createdDate = moment(userSession.created_date).format("MMMM YYYY");
    const { imagePreviewUrl } = this.state;

    const { email, profile_image, image_path } = userSession;
    const imageUploadedPath =
      this.props.uploadImage && this.props.uploadImage.image_path;
    let a = this.state.imagePath;

    const {profileData} = this.props
    const imageDecodeURL = _get(profileData, "personal_info.profile_image");
    var base64Matcher = new RegExp("^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$");
    let isBaseCode = false;
    let imgURL;
    // if (base64Matcher.test(imageDecodeURL)) {
    if(imageDecodeURL !=""){  
      imgURL = imageDecodeURL;
      isBaseCode = true
    }else{
      imgURL = img_user;
      isBaseCode = false
    }

    return (
      <section className="dashSection">
        <div className="container">
          <div className="dashContainer">
            <div className="dashTitleBg">
              <h3>{this.getTitle(pathname)}</h3>
            </div>
            <div className="dashLeftSide">
              <div className="profileView">
                <div className="profileImgBg">
                  {/* <img
                    src={
                      this.props.uploadImage.image_path ? image_path_uploadImage : !profile_image ?  image_path:img_user
                    }
                    alt=""
                  />{" "} */}
                  {<img src={imgURL} />}
                  <span className="uploadIcon" onClick={this.handleUpload}>
                    <i className="fas fa-upload" />
                  </span>
                </div>

                <h4>{userSession.name}</h4>
                <p>{userSession.email}</p>
                <p>Member since {createdDate}</p>
              </div>
              <ul className="dashboardMenuItems">
                <li
                  className={pathname === "/dashboard/overview" ? "active" : ""}
                  onClick={() => this.props.history.push("/dashboard/overview")}
                >
                  <span>
                    <img src={img_manuser} />
                  </span>{" "}
                  <h4>Overview</h4>
                </li>
                <li
                  className={pathname === "/dashboard/my-trips" ? "active" : ""}
                  onClick={() => this.props.history.push("/dashboard/my-trips")}
                >
                  <span>
                    <img src={img_heart} />
                  </span>{" "}
                  <h4>My Trips</h4>
                </li>
                <li
                  className={
                    pathname === "/dashboard/wish-list" ? "active" : ""
                  }
                  onClick={() =>
                    this.props.history.push("/dashboard/wish-list")
                  }
                >
                  <span>
                    <img src={img_history} />
                  </span>{" "}
                  <h4>Wishlist</h4>
                </li>
                <li
                  className={pathname === "/dashboard/payment" ? "active" : ""}
                  onClick={() => this.props.history.push("/dashboard/payment")}
                >
                  <span>
                    <img src={img_payment} />
                  </span>{" "}
                  <h4>Payment Method</h4>
                </li>
                <li
                  className={
                    pathname === "/dashboard/xeni-coin" ? "active" : ""
                  }
                  onClick={() =>
                    this.props.history.push("/dashboard/xeni-coin")
                  }
                >
                  <span>
                    <img src={img_xennies} />
                  </span>{" "}
                  <h4>Xennies</h4>
                </li>
                <li
                  className={pathname === "/dashboard/profile" ? "active" : ""}
                  onClick={() => this.props.history.push("/dashboard/profile")}
                >
                  <span>
                    <img src={img_settings} />
                  </span>{" "}
                  <h4>Profile Setting</h4>
                </li>
                <li
                  className={
                    pathname === "/dashboard/mySubscription" ? "active" : ""
                  }
                  onClick={() =>
                    this.props.history.push("/dashboard/mySubscription")
                  }
                >
                  <span>
                    <img src={img_subscription} />
                  </span>{" "}
                  <h4>My Subscription</h4>
                </li>
                <li>
                  <span>
                    <img src={img_helpicon} />
                  </span>{" "}
                  <a
                    target="_blank"
                    href="http://help.xeniapp.com/support/home"
                  >
                    <h4>Support</h4>
                  </a>
                </li>
              </ul>
            </div>
            <DashboardRightPane />
          </div>
        </div>
        {this.state.model === true && (
          <div
            className="modal backgroundDark"
            id="myAddCard"
            style={{ display: "block" }}
          >
            <div className="modal-dialog myNewAddCard">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Upload Profile</h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    onClick={this.handleUpload}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <div className="cardDetailForm">
                    <div className="uploadPreview">
                      {/* <img
                        src={
                          this.state.fileImage
                            ? this.state.fileImage
                            : !profile_image
                            ? img_user
                            : image_path_uploadImage
                        }
                        alt="preview image"
                      /> */}
                      <img
                        src={(() => {
                          if (isBaseCode && !imagePreviewUrl) {
                            return imgURL;
                          } else if (imagePreviewUrl) {
                            return imagePreviewUrl;
                          } else {
                            return img_user;
                          }
                        })()}
                        alt="previe image"
                      />
                    </div>
                    <div className="form-group file-input">
                      <input
                        style={{ color: "white" }}
                        type="file"
                        id="imageId"
                        className="chooseInput"
                        onChange={this.imageUpload}
                        accept=".png,.jpg,.jpeg"
                      />
                      {this.state.fileName == "" ? (
                        <span
                          style={{
                            textOverflow: "ellipsis",
                            left: "116px",
                            width: "181px",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            position: "absolute",
                            bottom: "39px"
                          }}
                        >
                          {a.substring(26)}
                        </span>
                      ) : (
                        <span
                          className="input-img-name"
                          style={{
                            textOverflow: "ellipsis",
                            left: "116px",
                            width: "181px",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            position: "absolute",
                            bottom: "39px"
                          }}
                        >
                       { this.state.fileName }
                        </span>
                      )}
                      

                      {this.state.error && (
                        <span style={{ color: "red", position:"absolute", left:"20px", bottom:"10px" }}>{this.state.error}</span>
                      )}
                    </div>
                    <div className="uploadButton">
                        <button
                          type="button"
                          className={
                            this.state.errorValid == false
                              ? "searchBtn"
                              : "searchBtn cursorNotAllowed"
                          }
                          onClick={this.uploadImageSubmit}
                          disabled={this.state.errorValid}
                        >
                          Upload
                        </button>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  getTitle = pathName => {
    switch (pathName) {
      case "/dashboard/overview":
        return "overview";
      case "/dashboard/payment":
        return "payment method";
      case "/dashboard/profile":
        return "profile settings";
      case "/dashboard/my-trips":
        return "my trips";
      case "/dashboard/xeni-coin":
        return "Xennies";
      case "/dashboard/wish-list":
        return "my wishlist";
      case "/dashboard/mySubscription":
        return "My Subscription";
      default:
        break;
    }
  };
}
const mapStateToProps = state => ({
  loginDetails: state.loginReducer.loginDetails,
  uploadImage: state.dashboardReducer.uploadImage,
  profileData:state.dashboardReducer.profileData
});

const mapDispatchToProps = dispatch => ({
  dummyRender: () => dispatch({ type: "dummyRender" }),
  profileImageChange: profile_img => dispatch(profileImageChange),
  upload: data => dispatch(upload(data)),
  getProfile: data => dispatch(getProfile(data))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DashBoardContent)
);

DashBoardContent.defaultProps = {
  loginDetails: {}
};
