import {uniqBy as _uniqBy, pick as _pick, map as _map, get as _get} from "lodash";
import actionType from './actionType';

const initialState = {
    carFilterResult: null,
    carSearchResult: null,
    carPrice: null,
    carBookedDetails: {},
    carBookingResult: null,
    carBookingCancelResult: {},
    selectedCurrency: 'INR',
    carList: [],
    carRentals: [],
    carVendorList: [],
    carCount: 0,
    sessionId: '',
    carMyTrips: [],
    pagingPayload: null,
    isLoadMoreAvailable: true,
    carPaymentInfo: null,
    rentalLocations: null,
    carTypeList: []

}
const carReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.CAR_FILTER_SUCCESS:
            let isLoadMoreAvailable
            if (action.payload.vehicles.length == 0) {
                isLoadMoreAvailable = false
            } else if (action.payload.vehicles.length != 0) {
                isLoadMoreAvailable = true
            }
            return ({
                ...state,
                carList: action.payload.vehicles,
                carRentals: action.payload.carRentals,
                isLoadMoreAvailable: isLoadMoreAvailable
                //carVendorList: action.payload.vendors,
            })
        case actionType.CAR_FILTER_FAILURE:
            return ({
                ...state,
                carList: [],

                // carRentals: [],
                // carVendorList: [],
            })
        case actionType.CAR_LOAD_MORE_SUCCESS: {
            let isLoadMoreAvailable
            if (action.payload.vehicles.length == 0) {
                isLoadMoreAvailable = false
            } else if (action.payload.vehicles.length != 0) {
                isLoadMoreAvailable = true
            }
            return ({
                ...state,
                carList: state.carList.concat(action.payload.vehicles),
                carRentals: state.carRentals.concat(action.payload.carRentals),
                isLoadMoreAvailable: isLoadMoreAvailable
                //carVendorList: action.payload.vendors,
            })
        }
        case actionType.CAR_LOAD_MORE_FAILURE:
            return ({
                ...state
            })
        case actionType.CAR_SEARCH_SUCCESS:
            let uniqList = _uniqBy(action.payload.vehicles, "type");
            let pickCarType = _.map(uniqList, i =>
                _get(i, "type", null)
            );
            return ({
                ...state,
                carList: action.payload.vehicles,
                carResultsCount: action.payload.resultsCount,
                sessionId: action.payload.sessionId,
                carRentals: action.payload.carRentals,
                carVendorList: action.payload.vendors,
                carCount: action.payload.resultsCount,
                isLoadMoreAvailable: true,
                selectedCurrency: action.payload.currency,
                rentalLocations: action.payload.rentalLocations,
                carTypeList: pickCarType
                // carSearchResult:action.payload
            })
            case actionType.CAR_EXISTS_LIST:
                return({
                    ...state,
                    carList: action.payload
                })
        case actionType.CAR_SEARCH_FAILURE:
            return ({
                ...state,
                carSearchResult: {}
            })
        case actionType.CAR_GET_PRICE_SUCCESS:
            return ({
                ...state,
                carPrice: action.payload,
                selectedCurrency: action.payload.currency
            })
        case actionType.CAR_GET_PRICE_FAILURE:
            return ({
                ...state,
                carPrice: {}
            })
        case actionType.CAR_DETAILS_FROM_DATABASE_SUCCESS:
            return ({
                ...state,
                carBookedDetails: action.payload
            })
        case actionType.CAR_DETAILS_FROM_DATABASE_FAILURE:
            return ({
                ...state,
                carBookedDetails: {}
            })
        case actionType.CAR_BOOKING_SUCCESS:
            return ({
                ...state,
                carBookingResult: action.payload
            })
        case actionType.CAR_BOOKING_FAILURE:
            return ({
                ...state,
                carBookingResult: {}
            })
        case actionType.CAR_BOOKING_CANCEL_SUCCESS:
            return ({
                ...state,
                carBookingCancelResult: action.payload
            })
        case actionType.CAR_BOOKING_CANCEL_FAILURE:
            return ({
                ...state,
                carBookingCancelResult: {}
            })

        case actionType.CAR_MY_TRIPS_SUCCESS:
            return ({
                ...state,
                carMyTrips: action.payload
            })
        case actionType.CAR_MY_TRIPS_FAILURE:
            return ({
                ...state,
                carMyTrips: []
            })

        case actionType.DELETE_PAYMENT_PROPS:
            return ({
                ...state,
                carBookingResult: {}
            })
        case actionType.PAGING_DETAILS:
            return ({
                ...state,
                pagingPayload: action.payload
            })
        case actionType.CAR_PAYLOAD_SUCCESS:
            return ({
                ...state,
                carPaymentInfo: action.payload

            })
        default:
            return state
    }

}
export default carReducer;
