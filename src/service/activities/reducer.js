import actionType from "./actionType";
import _map from 'lodash/map';

const initialState = {
    activitySearchResult: null,
    activityList: [],
    selectedActivity: null,
    availableDate: [],
    selectedActivityFinalPrice: [],
    activityCount: 0,
    isLoadMoreAvailable: false,
    destId: "",
    activityTripList: [],
    activityBookingResult: null,
    activityHotelList: [],
    activityBookingStatus: null,
    activityCategoryList: [],
    activityCancelReasonList: [],
    refundStatus:false,
    refundAmount:"100%",
    locations: [],
};

const activityReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.ACTIVITY_SEARCH_SUCCESS:
            console.log(":::action.destId", action.destId)
            return {
                ...state,
                activityList: action.payload,
                activityCount: action.payload.count,
                skippedCount: action.skippedCount,
                selectedActivity: null,
                selectedActivityFinalPrice: [],
                destId: action.destId,
                activityBookingStatus: null,
            };
        case actionType.ACTIVITY_SEARCH_FAILURE:
            return {
                ...state,
                activitySearchResult: {},
                activityList: {data: []},
                activityCount: 0,
                selectedActivity: null,
                selectedActivityFinalPrice: []
            };
        case actionType.ACTIVITY_INFO_SUCCESS:
            return {
                ...state,
                selectedActivity: action.payload,
                selectedActivityFinalPrice: []
            };
        case actionType.ACTIVITY_INFO_FAILURE:
            return {
                ...state,
                selectedActivity: null,
                selectedActivityFinalPrice: []
            };
        case actionType.ACTIVITY_CALENDER_SUCCESS:
            return {
                ...state,
                availableDate: action.payload
            };
        case actionType.ACTIVITY_CALENDER_FAILURE:
            return {
                ...state,
                availableDate: []
            };
        case actionType.ACTIVITY_PRICE_SUCCESS:
            return {
                ...state,
                selectedActivityFinalPrice: action.payload
            };
        case actionType.ACTIVITY_PRICE_FAILURE:
            return {
                ...state,
                selectedActivityFinalPrice: []
            };
        case actionType.ACTIVITY_FILTER_SUCCESS:
            return {
                ...state,
                ActivityFilterList: action.payload
            };
        case actionType.ACTIVITY_MYTRIP_SUCCESS:
            return {
                ...state,
                activityTripList: action.payload.data
            };
        case actionType.ACTIVITY_BOOKING_STATUS_SUCCESS:
            return {
                ...state,
                activityBookingStatus: action.payload.data,
                refundAmount:action.payload.refund,
                refundStatus:action.payload.refundStatus
            };
        case actionType.ACTIVITY_BOOKING_STATUS_FAILURE:
            return {
                ...state,
                activityBookingStatus: null
            };
        case actionType.ACTIVITY_MYTRIP_FAILURE:
            return {
                ...state,
                activityTripList: []
            };
        case actionType.ACTIVITY_BOOKING_SUCCESS:
            return {
                ...state,
                activityBookingStatus: action.payload,
            };
        case actionType.ACTIVITY_BOOKING_FAILURE:
            return {
                ...state,
                activityBookingResult: null,
            };
        case actionType.ACTIVITY_LIST_HOTEL_SUCCESS:
            return {
                ...state,
                activityHotelList: action.payload,
            };
        case actionType.ACTIVITY_LIST_HOTEL_FAILURE:
            return {
                ...state,
                activityHotelList: []
            };
        case  actionType.ACTIVITY_BOOKING_CANCELLED_SUCCESSFULLY:
            return {
                ...state,
            };
        case  actionType.ACTIVITY_GET_CATEGORY_SUCCESS:
            return {
                ...state,
                activityCategoryList: action.payload
            };
        case  actionType.ACTIVITY_GET_CATEGORY_FAILURE:
            return {
                ...state,
                activityCategoryList: []
            };
        case  actionType.ACTIVITY_GET_CANCEL_SUCCESS:
            return {
                ...state,
                activityCancelReasonList: action.payload
            };
        case  actionType.ACTIVITY_GET_CANCEL_FAILURE:
            return {
                ...state,
                activityCancelReasonList: []
            };
        case  actionType.ACTIVITY_BOOKING_CANCELLED_FAILURE:
            return {
                ...state,
            };
        case actionType.ACTIVITY_GET_LOCATIONS_REQUEST:
            return {
                ...state,
                locations: [{ label: 'Searching...', value: null }],
            };
        case actionType.ACTIVITY_GET_LOCATIONS_SUCCESS:
            return {
                ...state,
                locations: action.payload.length > 0 ? _map(action.payload, location => ({
                    label: location.destinationUrlName,
                    value: location.destinationName,
                })) : [{ label: 'please try some other location', value: null }],
            };
        case actionType.ACTIVITY_GET_LOCATIONS_FAILURE:
            return {
                ...state,
                locations: [],
            };
        default:
            return state;
    }
};
export default activityReducer;
