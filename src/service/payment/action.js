import axios from "../../Utils/request-process";
import actionType from "./actionType";
import URL from "./../../asset/configUrl";
import Notifications, { notify } from "react-notify-toast";
import { toast } from "react-toastify";
import {
  loadingSearch,
  stopSearching,
  loadingFailureSearch,
  stopFailureSearching
} from "../loader/action"
import {
  loadingGifSearch,
  stopGifSearching
} from "../common/action";

export const payment = payload => dispatch => {
  dispatch(loadingGifSearch())
  axios
    .post(URL.hotel.ROOM_BOOKING, payload)
    .then(res => {
      dispatch(stopGifSearching())
      if (res.status === 200) {
        dispatch({
          type: actionType.PAYMENT_SUCCESS,
          payload: res.data
        });
      }
      else {
        dispatch({
        
          type: actionType.PAYMENT_FAILURE,
          payload: res.status
        });
      }

      dispatch(loadingSearch());
      setTimeout(() => {
        dispatch(stopSearching());
      }, 2000)
    })
    .catch(error => {
      dispatch(stopGifSearching())
      dispatch(stopSearching());
      dispatch({
        type: actionType.PAYMENT_FAILURE,
        payload: error.response
      });
      dispatch(loadingSearch());
      setTimeout(() => {
        dispatch(stopSearching());
      }, 2000)
    });
};

export const bookingReset = () => dispatch => {
  dispatch({
    type: 'bookingReset'
  })
}

export const paymentWithSaveCard = payload => dispatch => {
  axios
    .post(`http://localhost:8080/api/hotel/booking/savedcards`, payload)
    .then(res => {
      dispatch({
        type: actionType.PAYMENTWITHCARD_SUCCESS,
        payload: res.data
      });
    })
    .catch(error => {
      dispatch({
        type: actionType.PAYMENTWITHCARD_FAILURE,
        payload: error.response.data
      })
    })
}


// STO trigger event for auotlogin and booking

export const getPayload = (data) => dispatch =>{
  dispatch({
    type: actionType.PAYLOADINFO,
    payload: data
  })

}


// export const bookingGoogleLogin = googlepayload => dispatch => {
   
//   axios
//     .post(URL.USER_GOOGLE_LOGIN, googlepayload) 
//     .then(res => {
//       dispatch(loadingGifSearch());
//       sessionStorage.setItem("loginInfo", JSON.stringify(res.data));
//       if (res.status === 200) {
//         dispatch(stopGifSearching());
//         dispatch({
//           type: actionType.BOOKING_LOGIN_SUCCESS,
//           payload: res.data.data
//         });
//               notify.show("Logged in successfully", "success", 3000);
//         // _toast({
//         //   type: "success",
//         //   message: "Logged in successfully",
//         //   position: toast.POSITION.TOP_CENTER
//         // });
//       }
//       else if(res.status === 400) {
//               notify.show(res.data.message, "warning", 3000);
//         // _toast({
//         //   type: "warning",
//         //   message: res.data.message,
//         //   position: toast.POSITION.TOP_CENTER
//         // });
//       }
//     })
//     .catch(error => {
//       dispatch(stopGifSearching());
//       dispatch({
//         type: actionType.BOOKING_LOGIN_FAILURE,
//         payload: error.response.data
//       });
//             notify.show(error.response.data.message, "error", 3000);
//       // _toast({
//       //   type: "error",
//       //   message: error.response.data.message,
//       //   position: toast.POSITION.TOP_CENTER
//       // });
//     });
// };

// export const bookingSignUpInfo = (signuppayload ,payloadInfo ) => dispatch => {

//   dispatch(loadingGifSearch());
//   axios
//     .post(URL.USER_SIGNUP, signuppayload)
//     .then(res => {
//       dispatch(stopGifSearching());
//       sessionStorage.setItem("loginInfo", JSON.stringify(res.data));
     
//       if(res.status === 200){
        
//        const userInfo =  JSON.parse(sessionStorage.getItem('loginInfoBooking'))
//        const payload ={
        
//           "email": userInfo && userInfo.email,
//           "password": userInfo && userInfo.password
        
//        }
//         dispatch({
//           type: actionType.BOOKING_SIGNUP_SUCCESS,
//           payload: res.data
//         });
//         notify.show("Thanks for Registering with Us , Welcome to Xeniapp .Logged in successfully" ,"success", 3000);
//         dispatch(bookingLoginInfo(payload ,payloadInfo));
//       }else if(res.status === 400) {
//         notify.show("Registeration failed ,Please try again " ,"warning", 3000);
//       }
      
     
//       // _toast({
//       //   type: "success",
//       //   message: "Thanks for Registering with Us , Welcome to Xeniapp",
//       //   // message: res.data.message,
//       //   position: toast.POSITION.TOP_CENTER
//       // });
//     })
//     .catch(error => {
    
//       dispatch(stopGifSearching());
//       dispatch({
//         type: actionType.BOOKING_SIGNUP_FAILURE,
//         error: error.response.data.data
//       });
//       notify.show(error.response.data.data, "error", 3000);
//       // _toast({
//       //   type: "error",
//       //   message: error.response.data.data,
//       //   position: toast.POSITION.TOP_CENTER
//       // });
    
//     });
// };

// export const bookingLoginInfo = (loginpayload ) => dispatch => {
//   dispatch(loadingGifSearch());
//   axios
//     .post(URL.USER_LOGIN, loginpayload)
//     .then(res => {
//       dispatch(stopGifSearching());
//       sessionStorage.setItem("loginInfo", JSON.stringify(res.data.data));
//      // sessionStorage.setItem("userLogin", JSON.stringify(res.data.data));
//       if (res.status === 200) {
//         dispatch({
//           type: actionType.BOOKING_LOGIN_SUCCESS,
//           payload: res.data.data
//         });
//       //  this.props.history.push("/hotel");
//       sessionStorage.setItem("loginInfo", JSON.stringify(res.data.data));
//         notify.show("Logged in successfully", "success", 3000);    
//        // dispatch(payment(payloadInfo));    
//         // _toast({
//         //   type: "success",
//         //   message: "Logged in successfully",
//         //   position: toast.POSITION.TOP_CENTER
//         // });
//       }
//       else  if(res.status === 400){
//         notify.show({ message: res.data.message }, "warning", 3000);
//         _toast({
//           type: "warning",
//           message: res.data.message,
//           position: toast.POSITION.TOP_CENTER
//         });
//       }
//     })
//     .catch(error => {
//       dispatch(stopGifSearching());
//       dispatch({
//         type: actionType.BOOKING_LOGIN_FAILURE,
//         error: error.response.data
//       });
//        notify.show( error.response.data.data , "error", 3000);
//       // _toast({
//       //   type: "error",
//       //   message: error.response.data.data,
//       //   position: toast.POSITION.TOP_CENTER
//       // });
//     });
// };

// export const bookingForgetInfo = loginpayload => dispatch => {
//   const { email } = loginpayload;
//   // dispatch(loadingGifSearch());
//   axios
//     .get(URL.USER_FORGETPASSWORD + email)
//     .then(res => {
//       // dispatch(stopGifSearching());
//       if (res.status === 200) {
//         dispatch({
//           type: actionType.BOOKING_FORGETPASSWORD_SUCCESS,
//           payload: res.data
//         });
//         notify.show(res.data.data, "success", 3000);
//       }
//     })
//     .catch(error => {
//       dispatch(stopGifSearching());
//       dispatch({
//         type: actionType.BOOKING_FORGETPASSWORD_FAILURE,
//         error: error.response.data
//       });
//       notify.show(error.response.data.data, "error", 3000);
//     });
// };

// export const  bookingNewpasswordInfo = payload => dispatch => {
//          // dispatch(loadingGifSearch());
//          axios
//            .post(URL.USER_NEWPASSWORD , payload)
//            .then(res => {
//              // dispatch(stopGifSearching());
//              if (res.status === 200) {
//                dispatch({
//                  type: actionType.BOOKING_NEWPASSWORD_SUCCESS,
//                  payload: res.data
//                });
//                notify.show(res.data.data, "success", 3000);
//              }
//            })
//            .catch(error => {
//              dispatch(stopGifSearching());
//              dispatch({
//                type: actionType.BOOKING_NEWPASSWORD_FAILURE,
//                error: error.response
//              });
//             //  notify.show(error.response.data, "error", 3000);
//            });
//        };

       const _toast = ({ type, message, position }) => {
        switch (type) {
          case "success":
            toast.success(message, {
              position: position
            });
            break;
          case "error":
            toast.error(message, {
              position: position
            });
            break;
          case "warning":
            break;
            toast.warn(message, {
              position: position
            });
          case "info":
            break;
            toast.info(message, {
              position: position
            });
          case "default":
            break;
            toast(message, {
              position: position
            });
          default:
            break;
        }
      };

//ENO triggrr event for auotlogin and booking