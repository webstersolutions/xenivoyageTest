import actionType from "../login/actionType";

const sessionInfo = JSON.parse(sessionStorage.getItem("isTrue"));

const initialState = {
  loginDetails: (sessionInfo && sessionInfo.loginDetails) || null,
  signupDetails: null,
  loginStatus: (sessionInfo && sessionInfo.loginStatus) || false,
  isLogin: null,
  isSignUp: false,
  forgetPasswordDetails: null,
  newPasswordDetails: null,
  goproStatus: false,
  bookingConfirm: null,
  guestLogin: null,
  gustLoginCar: null,
  gustLoginTrans: null,
  carBookingResult: null,
  forget_validity: false
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.PAYMENT_SUCCESS:
      return {
        ...state,
        paymentDetails: action.payload,
        bookingConfirm: "success"
      };
    case actionType.PAYMENT_FAILURE:
      return {
        ...state,
        paymentFailureDetails: action.payload.data && action.payload.data,
        guestLogin: "success",
        bookingConfirm: "failure"
      };
    case "bookingReset":
      return {
        ...state,
        bookingConfirm: null
      };
    case actionType.LOGIN_SUCCESS:
      sessionStorage.setItem(
        "isTrue",
        JSON.stringify({
          loginDetails: action.payload,
          loginStatus: true,
          isLogin: true
        })
      );
      return {
        ...state,
        loginDetails: action.payload,
        loginStatus: true,
        isLogin: true
      };

    case actionType.GUEST_LOGIN_SUCCESS:
      return {
        ...state,
        loginDetails: action.payload,
        loginStatus: true,
        isLogin: true,
        guestLogin: "success",
        gustLoginCar: "success",
        gustLoginTrans: "success"
      };
    case actionType.GUEST_LOGIN_FAILURE:
      return {
        ...state,
        loginDetails: action.payload
      };

    case actionType.CAR_BOOKING_SUCCESS:
      return {
        ...state,
        carBookingResult: action.payload
      };
    case actionType.CAR_BOOKING_FAILURE:
      return {
        ...state,
        carBookingResult: {},
        gustLoginCar: "success"
      };
    case actionType.LOGIN_FAILURE:
      return {
        ...state,
        loginDetails: action.error
      };
    case actionType.LOGOUT_SUCCESS:
      return {
        ...state,
        loginDetails: null,
        loginStatus: false
      };
    case actionType.SIGNUP_SUCCESS:
      return {
        ...state,

        signupDetails: action.payload,
        isSignUp: true
      };

    case actionType.GUEST_SIGNUP_SUCCESS:
      return {
        ...state,
        signupDetails: action.payload,
        isSignUp: true,
        guestLogin: "success",
        gustLoginCar: "success",
        gustLoginTrans: "success"
      };

    case actionType.GUEST_SIGNUP_FAILURE:
      return {
        signupDetails: action.error,
        guestLogin: "failure",
        gustLoginCar: "failure",
        gustLoginTrans: "failure",
        loginStatus: false
      };

    case "signupReset":
      return {
        ...state,
        guestLogin: null,
        gustLoginCar: null,
        gustLoginTrans: null
      };
    //  case 'carSignupReset':
    //  return{
    //    ...state,
    //    gustLoginCar: null
    //  }

    case actionType.SIGNUP_FAILURE:
      return {
        ...state,
        signupDetails: action.error
      };
    case actionType.FORGETPASSWORD_SUCCESS:
      return {
        ...state,
        forgetPasswordDetails: action.payload,
        isforget: false
      };
    case actionType.FORGETPASSWORD_FAILURE:
      return {
        ...state,
        forgetPasswordDetails: action.error,
        isforget: true
      };

    case actionType.NEWPASSWORD_SUCCESS:
      return {
        ...state,
        newPasswordDetails: action.payload,
        isforget: false
      };
    case actionType.NEWPASSWORD_FAILURE:
      return {
        ...state,
        newPasswordDetails: action.error
      };
    case actionType.PAYMENTPRO_SUCCESS:
      return {
        ...state,
        paymentDetails: action.payload,
        goproStatus: true
      };
    case actionType.PAYMENTPRO_FAILURE:
      return {
        ...state,
        paymentDetails: action.error.data.data.error.raw,
        goproStatus: false
      };
    case actionType.TRANSFER_BOOK_SUCCESS:
      return {
        ...state,
        bookingNumber: action.payload.booking_number
      };
    case actionType.TRANSFER_BOOK_FAILURE:
      return {
        ...state,
        bookingNumber: null,
        gustLoginTrans: "success"
      };
      case actionType.FORGET_VALIDITY_SUCCESS:
        return {
          ...state,
          forget_validity: action.payload
        };
      case actionType.FORGET_VALIDITY_FAILURE:
        return {
          ...state,
          forget_validity: action.payload
        };              
    default:
      return state;
  }
};
export default loginReducer;
