import actionType from "./actionType";

const InitialState = {
  paymentDetails: null,
  paymentFailureDetails:null,
  bookingConfirm: null,
  paymentInfo : null , 
  bookingConfirmFailure: false,
  loginDetails: null,
  signupDetails: null,
  loginStatus: false,
  isSignUp: false,
  forgetPasswordDetails: null,
  newPasswordDetails:null,


};

const paymentReducer = (state = InitialState, action) => {
 
  switch (action.type) {
    case actionType.PAYMENT_SUCCESS:
      return {
        ...state,
        paymentDetails: action.payload,
        bookingConfirm: 'success'
      };
    case actionType.PAYMENT_FAILURE:
      return {
        
        ...state,
        paymentFailureDetails: action.payload.data && action.payload.data,
      
        bookingConfirm: 'failure'
        
      };
      case 'bookingReset': 
      return {
          ...state,
          bookingConfirm: null
      }
    case actionType.PAYMENTWITHCARD_SUCCESS:
      return {
        ...state,
        paymentDetails: action.payload
      };
    case actionType.PAYMENTWITHCARD_FAILURE:
      return {
        ...state,
        paymentDetails: action.error
      };

      case actionType.PAYLOADINFO:
       return{
        ...state,
        paymentInfo: action.payload
       };

      // sto complete login
    
      // case actionType.BOOKING_LOGIN_SUCCESS:
      // return {
      //   ...state,
      //   loginDetails: action.payload,
      //   loginStatus: true,
              
      // };
    // case actionType.BOOKING_LOGIN_FAILURE:
    //   return {
    //     ...state,
    //     loginDetails: action.error,
              
    //   };
  
      
    // case actionType.BOOKING_SIGNUP_SUCCESS:
    //   return {
    //     ...state,
       
    //     signupDetails: action.payload,
    //     isSignUp: true,
       
    //   };
  
    // case actionType.BOOKING_SIGNUP_FAILURE:
    //   return {
    //     ...state,
    //     signupDetails: action.error,
       
    //   };
    // case actionType.BOOKING_FORGETPASSWORD_SUCCESS:
    //   return {
    //     ...state,
    //     forgetPasswordDetails: action.payload,
    //     isforget: false
    //   };
    // case actionType.BOOKING_FORGETPASSWORD_FAILURE:
    //   return {
    //     ...state,
    //     forgetPasswordDetails: action.error
    //   };

    // case actionType.BOOKING_NEWPASSWORD_SUCCESS:
    //   return {
    //     ...state,
    //     newPasswordDetails: action.payload,
    //     isforget: false
    //   };
    // case actionType.BOOKING_NEWPASSWORD_FAILURE:
    //   return {
    //     ...state,
    //     newPasswordDetails: action.error
    //   };

      //eno complete login


    default:
      return state;
  }
};
export default paymentReducer;
