const configUrl = {
    init: `/api/init`,
    hotel: {
        HOTEL_SEARCH: `/api/hotel/search`,
        HOTEL_FILTER: `/api/hotel/filter`,
        ROOM_SEARCH: `/api/hotel/getRoom`,
        ROOM_PRICE: `/api/hotel/getPrice`,
        ROOM_BOOKING: `/api/hotel/Booking`,
        ROOM_CANCEL: `/api/hotel/status/cancellation`,
        ROOM_SEARCHSTATELESS: `/api/hotel/getroominit`,
        HOTEL_NAME: `/api/hotel/esfilter?`,
        HOTELS_RATING: `/api/hotel/rating?sessionid=`,
        GET_COUNTRY_CODE: `/api/code`,
    },
    // HOTEL_INIT: `/api/hotel`,
    // HOTEL_STATUS: `/api/status`,
    // HOTEL_RESULTS: `/api/search`

    //CAR
    CAR_SEARCH: `/api/car/search`,
    CAR_FILTER: `/api/car/filter`,
    CAR_ES_FILTER: `/api/car/esfilter`,
    CAR_PRICE: `/api/car/getPrice`,
    CAR_BOOKING: `/api/car/booking`,
    CAR_BOOKING_CANCEL: `/api/car/cancellation`,
    CAR_MYTRIPS: `/api/car/mytrips`,

    // TRANSFER
    TRANSFER_SEARCH: `/api/taxi/vehicles/booking_query`,
    TRANSFER_BOOK: `/api/taxi/vehicle_booking`,
    TRANSFER_MYTRIPS: `/api/taxi/mytrips`,
    TRANSFER_BOOKING_INFO: `/api/taxi/getBookinginfo`,
    TRANSFER_CANCEL_BOOKING: `/api/taxi/cancel_taxi`,

    //ACTIVITICS
    ACTIVITY_SEARCH: `/api/activity/product`,
    ACTIVITY_INFO: `/api/activity/product/info?code=`,
    ACTIVITY_PRICE: `/api/activity/product/price`,
    ACTIVITY_CALENDER: `/api/activity/product/calendar`,
    ACTIVITY_FILTER: `/api/activity/product/filter`,
    ACTIVITY_MYTRIPS: `/api/activity/product/getAllActivityBookingByEmail?email=`,
    ACTIVITY_GET_BOOKING: `/api/activity/product/getAllActivityBookingByEmail?email=`,
    ACTIVITY_GET_STATUS_BOOKING: `/api/activity/product/booking/status?`,
    ACTIVITY_BOOKING: `/api/activity/product/booking`,
    ACTIVITY_LIST_HOTELS: `/api/activity/product/hotels?productCode=`,
    ACTIVITY_CANCEL_BOOKING: `/api/activity/product/cancelBooking`,
    ACTIVITY_GET_CATEGORY: `/api/activity/product/category?code=`,
    ACTIVITY_GET_CANCEL: `/api/activity/product/cancelReason`,
    ACTIVITY_GET_LOCATIONS: '/api/activity/taxonomySearch?search_term=',

    //user
    USER_GOOGLE_LOGIN: `/api/user/googleLogin`,
    USER_SIGNUP: `/api/user/signUp`,
    USER_LOGIN: `/api/user/login`,
    USER_FORGETPASSWORD: `/api/user/forgotPasswordLink?emailId=`,
    USER_NEWPASSWORD: `/api/user/forgotPassword`,
    USER_PASSWORD_VALIDITY: `/api/user/forgotPwdValidity?email=`,
    USER_INFO: `/api/user/userinfo?email=`,

    card: {
        CARD_GET: `/api/user/getSavedCardList?email=`,
        CARD_ADD: `/api/user/createCard`,
        CARD_DELETE: `/api/user/deleteSavedCard`
    },
    //dashboard
    PROFILE_EDIT: `/api/user/editProfile`,
    GET_PROFILE: `/api/user/getProfile?email=`,
    GET_PROFILE_PIC: `/api/user/viewProfilePic`,
    CHANGE_PASSWORD: `/api/user/changePassword`,
    TRIP_DETAILS: `/api/user/getUserTransactions`,
    RECENT_ACTIVITY: `/api/user/getRecentActivity?email=`,
    GET_REFUND_AMOUNT: `/api/hotel/getRefundAmount `,
    CANCELLED_BOOKING: `/api/hotel/status/cancel `,
    GOPROREGISTER: `/api/subscription/addSubscription`,
    GOPROPLANLIST: `/api/subscription/planList`,
    UPLOAD_PICTURE: `/api/user/uploadPicture`,
    // https://xeniapp.com:8443/api/user/uploadPicture
    //Itinery
    ADD_WISHLIST: `/api/wishlist/save`,
    VIEW_WISHLIST: `/api/wishlist/all?email=`,
    UPDATE_WISHLIST: `/api/wishlist/update`,

    //User Subscription
    GET_SUBSCRIPTIONLIST: `/api/subscription/getUserSubscription?email=`,
    DELETE_SUBSCRIPTION: `/api/subscription/deleteSubscription`,
    UPDATE_CARD: `/api/subscription/updateCard`,
    CHECKSUBCRIPTION: `/api/user/subscriptionTypeCheck`,

    DELETE_WISHLIST: `/api/wishlist/delete`,

    //contactForm
    CONTACT_DETAILS: `/api/user/contactDetails`,

    //Details sending 
    EMAIL_TO_AGENT: `/api/user/email`,
    GUEST_LOGIN: `/api/auth`,

    ERROR_LOG: 'api/error/status?key='
};
export default configUrl;
