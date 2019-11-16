import actionType from "./actionType";
import _map from 'lodash/map';

const initialState = {
    packagesearchResult: null,
    packageList: [],
    selectedPackage: null,
    availableDate: [],
    selectedPackageFinalPrice: [],
    packageCount: 0,
    isLoadMoreAvailable: false,
    destId: "",
    packageTripList: [],
    packageBookingResult: null,
    packageHotelList: [],
    packageBookingStatus: null,
    packageCategoryList: [],
    packageInterestList:[],
    packageCancelReasonList: [],
    refundStatus:false,
    refundAmount:"100%",
    locations: [],
};

const packageReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.PACKAGE_SEARCH_SUCCESS:
            // console.log(":::action.destId", action)
            return {
                ...state,
                packageList: action.payload,
                packageCount: action.payload.count,
                skippedCount: action.skippedCount,
                selectedPackage: null,
                selectedPackageFinalPrice: [],
               destId: action.payload.countryId,
                packageBookingStatus: null,
            };
        case actionType.PACKAGE_SEARCH_FAILURE:
            return {
                ...state,
                packageSearchResult: {},
                packageList: {data: []},
                packageCount: 0,
                selectedPackage: null,
                selectedPackageFinalPrice: []
            };
        case actionType.PACKAGE_INFO_SUCCESS:
            return {
                ...state,
                selectedPackage: action.payload,
                selectedPackageFinalPrice: []
            };
        case actionType.PACKAGE_INFO_FAILURE:
            return {
                ...state,
                selectedPackage: null,
                selectedPackageFinalPrice: []
            };
        case actionType.PACKAGE_CALENDER_SUCCESS:
            return {
                ...state,
                availableDate: action.payload
            };
        case actionType.PACKAGE_CALENDER_FAILURE:
            return {
                ...state,
                availableDate: []
            };
        case actionType.PACKAGE_PRICE_SUCCESS:
            return {
                ...state,
                selectedPackageFinalPrice: action.payload
            };
        case actionType.PACKAGE_PRICE_FAILURE:
            return {
                ...state,
                selectedPackageFinalPrice: []
            };
        case actionType.PACKAGE_FILTER_SUCCESS:
            return {
                ...state,
                PackageFilterList: action.payload
            };
        case actionType.PACKAGE_MYTRIP_SUCCESS:
            return {
                ...state,
                packageTripList: action.payload.data
            };
        case actionType.PACKAGE_BOOKING_STATUS_SUCCESS:
            return {
                ...state,
                packageBookingStatus: action.payload.data,
                refundAmount:action.payload.refund,
                refundStatus:action.payload.refundStatus
            };
        case actionType.PACKAGE_BOOKING_STATUS_FAILURE:
            return {
                ...state,
                packageBookingStatus: null
            };
        case actionType.PACKAGE_MYTRIP_FAILURE:
            return {
                ...state,
                packageTripList: []
            };
        case actionType.PACKAGE_BOOKING_SUCCESS:
            return {
                ...state,
                packageBookingStatus: action.payload,
            };
        case actionType.PACKAGE_BOOKING_FAILURE:
            return {
                ...state,
                packageBookingResult: null,
            };
        case actionType.PACKAGE_LIST_HOTEL_SUCCESS:
            return {
                ...state,
                packageHotelList: action.payload,
            };
        case actionType.PACKAGE_LIST_HOTEL_FAILURE:
            return {
                ...state,
                packageHotelList: []
            };
        case  actionType.PACKAGE_BOOKING_CANCELLED_SUCCESSFULLY:
            return {
                ...state,
            };
        case  actionType.PACKAGE_GET_CATEGORY_SUCCESS:
            return {
                ...state,
                packageCategoryList: action.payload
            };
        case  actionType.PACKAGE_GET_CATEGORY_FAILURE:
            return {
                ...state,
                packageCategoryList: []
            };
            

            case  actionType.PACKAGE_GET_INTEREST_SUCCESS:
                return {
                    ...state,
                    packageInterestList: action.payload
                };
            case  actionType.PACKAGE_GET_INTEREST_FAILURE:
                return {
                    ...state,
                    packageInterstList: []
                };
          

        case  actionType.PACKAGE_GET_CANCEL_SUCCESS:
            return {
                ...state,
                packageCancelReasonList: action.payload
            };
        case  actionType.PACKAGE_GET_CANCEL_FAILURE:
            return {
                ...state,
                packageCancelReasonList: []
            };
        case  actionType.PACKAGE_BOOKING_CANCELLED_FAILURE:
            return {
                ...state,
            };
        case actionType.PACKAGE_GET_LOCATIONS_REQUEST:
            return {
                ...state,
                locations: [{ label: 'Searching...', value: null }],
            };
        case actionType.PACKAGE_GET_LOCATIONS_SUCCESS:

            return {
                ...state,
                locations: action.payload.length > 0 ? _map(action.payload, location => ({
                    label: location.name,
                    value: location.id,
                })) : [{ label: 'please try some other location', value: null }],
                
            };
            
        case actionType.PACKAGE_GET_LOCATIONS_FAILURE:
            return {
                ...state,
                locations: [],
            };
        default:
            return state;
    }
};
export default packageReducer;
