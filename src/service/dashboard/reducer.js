import actionType from "../dashboard/actionType"

const initialState = {
    profileSuccessInfo: null,
    profileData: null,
    myTripList: [],
    recentList: [],
    refundList: [],
    cancelRouteInfo: [],
    cancelledBookingInfo: [],
    cancelledConfirm: null,
    uploadImage: "",
    cancelledState: null,
    isTravelAgent: false,
    isProfileEmpty:false
}

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.PROFILE_UPDATE_SUCCESS:

            return ({
                ...state,
                profileSuccessInfo: action.payload
            });
        case actionType.PROFILE_UPDATE_FAILURE:

            return {
                ...state,
                errors: action.errors.response
            };
        case actionType.GET_PROFILE_SUCCESS:
            let profileAddress = action.payload.address_info;
            return ({
                ...state,
                profileData: action.payload,
                isTravelAgent: action.payload.isTravelAgent,
                isProfileEmpty: Object.values(profileAddress).includes("")
            });
        case actionType.GET_PROFILE_FAILURE:
            return ({
                ...state,
                errors: action.errors,
                isTravelAgent:false,
                isProfileEmpty:false
            });
        case actionType.CHANGE_PASSWORD_SUCCESS:
            return ({
                ...state,
            });
        case actionType.CHANGE_PASSWORD_FAILURE:
            return ({
                errors: action.errors
            });
        case actionType.TRIP_SUCCES:
            return ({
                ...state,
                myTripList: action.payload
            });
        case actionType.TRIP_FAILURE:
            return ({
                errors: action.errors
            });
        case actionType.RECENT_ACTIVITY_SUCCESS:
            return ({
                ...state,
                recentList: action.payload
            });
        case actionType.RECENT_ACTIVITY_FAILURE:
            return ({
                errors: action.errors
            });
        case actionType.REFUND_SUCCESS:
            return ({
                ...state,
                refundList: action.payload,
                cancelledState: 'success'
            });
        case 'routeReset':
            return {
                ...state,
                cancelledConfirm: null
            };
        case 'cancelConfromReset' :
            return {
                ...state,
                cancelledState: null
            };
        case actionType.REFUND_FAILURE:
            return ({
                errors: action.errors
            });
        case actionType.CANCEL_ROUTE_INFO:
            return ({
                ...state,
                cancelRouteInfo: action.payload
            });
        case actionType.CANCELLED_SUCCESS:
            return ({
                ...state,
                cancelledBookingInfo: action.payload,
                cancelledConfirm: "sucess"

            });
        case actionType.CANCELLED_FAILURE:
            return ({
                errors: action.errors,
                cancelledConfirm: "failure"
            });
        case actionType.UPLOAD_IMAGE_SUCCESS:
            return {
                ...state,
                uploadImage: action.payload,
                model: false
            };
        case actionType.UPLOAD_IMAGE_FAILURE:
            return {
                ...state,
                uploadImage: action.error,
                model: true
            };
        default:
            return state;
    }

}
export default dashboardReducer;