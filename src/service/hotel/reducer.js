import actionType from "./actionType";
import {filter as _filter, orderBy as _orderBy} from "lodash";

const InitialState = {
    // data from user input
    searchDate: {start: null, end: null},
    // data from hotel search/filter
    hotelCount: null,
    completedSuppliers: null,
    hotelList: [],
    sessionId: null,
    currency: "INR",
    // values got from user input
    searchPrice: {min: 0, max: 10000},
    pageSize: 10,
    minHotelRating: 1,
    maxHotelRating: 5,
    hotelFilterStr: "",
    // data from room search
    hotel: null,
    rateList: [],
    recommendations: [],
    roomOccupanciesList: [],
    roomList: [],
    isHotelRest: false,
    // data from get Price
    fareBreakup: null,
    // hotel: null,
    isRateAvailable: false,
    isReserve: false,
    pricedRooms: [],
    rooms: [],
    pricedTotalFare: null,
    quotedTotalFare: null,
    rateOccupancies: [],
    requestedOccupancies: [],
    // roomOccupancies: [],

    hotelsearch: null,
    hotelFilter: null,
    // roomList: null,
    roomPrice: null,
    roomBooking: null,
    roomCancel: null,
    isSearching: false,
    gifPop: false,
    isSearchingFilter: false,
    hotelStarListCount: [],
    hotelFilterRating: "",
    roomPriceInfo: null,
    selectedCurrency: "INR",
    isPriceFail: false,
    filterCount: -1,
    searchHotelCount: null,
    skippedCount: 0,
    isFilter: false,
    response: "",
    ratingCount: {},
    currencyDetails: null,
    priceErrMsg: null,
    countries: [],
};
const reducer = (state = InitialState, action) => {
    switch (action.type) {
        case actionType.HOTEL_SEARCH_SUCCESS:
            const {
                hotelCount,
                completedSuppliers,
                hotels,
                sessionId,
                currency,
                filterCount = -1
            } = action.payload;
            // console.log("hotels---------------> ",_filter(hotels,(each,i)=>{return each.rating >= 2}))
            let hotLn = hotelCount;
            return {
                ...state,
                searchDate: action.inputPayload,

                completedSuppliers,
                sessionId,
                hotelList: _filter(hotels, (each, i) => {
                    if (
                        each.rating < 2 ||
                        each.images.length <= 0 ||
                        each.rooms[0].availableRoomCount <= 0
                    ) {
                        state.skippedCount += 1;
                        hotLn -= 1;
                    }
                    return (
                        each.rating >= 2 &&
                        each.images.length > 0 &&
                        each.rooms[0].availableRoomCount > 0
                    );
                }),
                hotelStarListCount: _filter(hotels, (each, i) => {
                    return (
                        each.rating >= 2 &&
                        each.images.length > 0 &&
                        each.rooms[0].availableRoomCount > 0
                    );
                }),
                hotelCount: hotLn,
                isSearching: false,
                isReserve: false,
                //Whenever new search happens following values should be rest
                searchPrice: {min: 0, max: 10000},
                paging: action.page,
                minHotelRating: 1,
                maxHotelRating: 5,
                isHotelRest: true,
                selectedCurrency: currency,
                hotelsearch: null,
                filterCount,
                searchHotelCount: hotelCount,
                isFilter: true,
                skippedCount: state.skippedCount
            };
        case actionType.HOTEL_SEARCH_FAILURE:
            return {
                ...state,
                hotelsearch: action.error,
                isSearching: false,
                hotelList: [],
                hotelCount: null,
                response: action.error1
            };
        case actionType.HOTEL_FILTER_SUCCESS:
            // console.log("success", action.inputPayload)
            return {
                ...state,
                hotelList: state.hotelList.concat(
                    _filter(action.payload.hotels, (each, i) => {
                        if (
                            each.rating < 2 ||
                            each.images.length <= 0 ||
                            each.rooms[0].availableRoomCount <= 0
                        ) {
                            state.skippedCount += 1;
                            state.hotelCount -= 1;
                        }
                        return (
                            each.rating >= 2 &&
                            each.images.length > 0 &&
                            each.rooms[0].availableRoomCount > 0
                        );
                    })
                ),
                // searchPrice: action.inputPayload.price,
                hotelStarListCount: state.hotelList.concat(
                    _filter(action.payload.hotels, (each, i) => {
                        return (
                            each.rating >= 2 &&
                            each.images.length > 0 &&
                            each.rooms[0].availableRoomCount > 0
                        );
                    })
                ),
                paging: action.inputPayload,
                minHotelRating: action.inputPayload.minHotelRating,
                maxHotelRating: action.inputPayload.maxHotelRating,
                isSearching: false,
                isReserve: false,
                isHotelRest: false,
                skippedCount: state.skippedCount
            };
        case actionType.HOTEL_FILTER_FAILURE:
            return {
                ...state,
                hotelList: [],
                isSearching: false
            };
        case actionType.LOAD_EXISTS_DATA:
            return {
                ...state,
                hotelList: action.payload
            };

        case actionType.FILTER_OPTIONS_SUCCESS:
            return {
                ...state,
                // hotelList: _filter(action.payload.hotels, (each, i) => {
                //   return each.rating >= 2;
                // }),
                // // searchPrice: action.inputPayload.price,
                // hotelStarListCount: _filter(action.payload.hotels, (each, i) => {
                //   return each.rating >= 2;
                // }),
                sessionId: action.payload.sessionId,
                hotelList: _filter(action.payload.hotels, (each, i) => {
                    if (
                        each.rating < 2 ||
                        each.images.length <= 0 ||
                        each.rooms[0].availableRoomCount <= 0
                    ) {
                        state.skippedCount += 1;
                    }
                    return (
                        each.rating >= 2 &&
                        each.images.length > 0 &&
                        each.rooms[0].availableRoomCount > 0
                    );
                }),
                hotelStarListCount: _filter(action.payload.hotels, (each, i) => {
                    return (
                        each.rating >= 2 &&
                        each.images.length > 0 &&
                        each.rooms[0].availableRoomCount > 0
                    );
                }),
                paging: action.inputPayload,
                minHotelRating: action.filterOptions.minHotelRating,
                maxHotelRating: action.filterOptions.maxHotelRating,
                searchPrice: {
                    max: action.filterOptions.maxHotelPrice,
                    min: action.filterOptions.minHotelPrice
                },
                hotelCount: action.payload.hotelCount,
                currency: action.payload.currency,
                isSearching: false,
                isReserve: false,
                isHotelRest: false,
                isFilter: false,
                skippedCount: state.skippedCount
            };
        case actionType.FILTER_OPTIONS_ERROR:
            return {
                ...state,
                hotelList: [],
                isSearching: false
            };
        case actionType.ROOM_SEARCH_SUCCESS:
            const {
                hotel,
                rates,
                recommendations,
                roomOccupancies,
                rooms
            } = action.payload;

            return {
                ...state,
                sessionId: action.payload.sessionId,
                hotel,
                recommendations: _orderBy(recommendations, ["FreeTotal"], ["asc"]),
                rateList: _orderBy(rates, ["FreeTotal"], ["asc"]),
                gifPop: true,
                roomOccupanciesList: roomOccupancies,
                roomList: _orderBy(rooms, ["FreeTotal"], ["asc"]),
                isSearching: false,
                searchDate: {start: action.startDate, end: action.endDate},
                isReserve: false,
                selectedCurrency: currency
            };
        case actionType.ROOM_SEARCH_FAILURE:
            return {
                ...state,
                // roomList: action.error,
                isSearching: false
            };
        case actionType.ROOM_PRICE_SUCCESS:
            // const { hotel,
            //   fareBreakup,
            //   isRateAvailable,
            //   pricedRooms,
            //   pricedTotalFare,
            //   quotedTotalFare,
            //   rateOccupancies,
            //   requestedOccupancies,
            //   roomOccupancies, } = action.payload;
            return {
                ...state,
                selectedCurrency: action.payload[0].currency,
                pricedRooms: action.payload,
                roomPriceInfo: action.payload,
                isReserve: true,
                isPriceFail: false,
                isSearching: false,
                priceErrMsg: null
            };
        case actionType.ROOM_PRICE_FAILURE:
            return {
                ...state,
                roomPrice: action.errorPrice,
                isPriceFail: true,
                priceErrMsg: action.payload
            };
        case actionType.ROOM_BOOKING_SUCCESS:
            return {
                ...state,
                roomBooking: action.payload
            };
        case actionType.ROOM_BOOKING_FAILURE:
            return {
                ...state,
                roomBooking: action.error
            };
        case actionType.ROOM_CANCEL_SUCCESS:
            return {
                ...state,
                roomCancel: action.payload
            };
        case actionType.ROOM_CANCEL_FAILURE:
            return {
                ...state,
                roomCancel: action.error
            };
        case actionType.ROOM_SEARCHSTATELESS_SUCCESS:
            return {
                ...state,
                roomCancel: action.payload
            };
        case actionType.ROOM_SEARCHSTATELESS_FAILURE:
            return {
                ...state,
                roomCancel: action.error
            };
        case actionType.ENABLE_LOADING_SEARCH:
            return {
                ...state,
                isSearching: true
            };
        case actionType.ENABLE_LOADING_SEARCH_FILTER:
            return {
                ...state,
                isSearchingFilter: true
            };
        case actionType.DISABLE_LOADING_SEARCH:
            return {
                ...state,
                isSearching: false
            };
        case actionType.DISABLE_LOADING_SEARCH_FILTER:
            return {
                ...state,
                isSearchingFilter: false
            };
        case actionType.SEARCHBY_HOTEL_NAME:
            // return {
            //   ...state,
            //   hotelFilterStr: action.payload
            // };
            let hotelLength;
            if (action.payload.length >= 1 && action.apiHit === true) {
                hotelLength = action.payload.length;
            } else if (action.apiHit === false) {
                hotelLength = state.searchHotelCount;
            }
            return {
                ...state,
                // hotelList: action.payload,
                hotelList: _filter(action.payload, (each, i) => {
                    if (
                        each.rating < 2 ||
                        each.images.length <= 0 ||
                        each.rooms[0].availableRoomCount <= 0
                    ) {
                        state.skippedCount += 1;
                        hotelLength -= 1;
                    }
                    return (
                        each.rating >= 2 &&
                        each.images.length > 0 &&
                        each.rooms[0].availableRoomCount > 0
                    );
                }),
                // hotelStarListCount: action.payload,
                hotelCount: hotelLength,
                isFilter: false
            };
        case actionType.ELASTIC_FILTER_APPLY:
            let hotelLen = action.payload.length;
            return {
                ...state,
                hotelList: _filter(action.payload, (each, i) => {
                    if (
                        each.rating < 2 ||
                        each.images.length <= 0 ||
                        each.rooms[0].availableRoomCount <= 0
                    ) {
                        state.skippedCount += 1;
                        hotelLen -= 1;
                    }
                    return (
                        each.rating >= 2 &&
                        each.images.length > 0 &&
                        each.rooms[0].availableRoomCount > 0
                    );
                }),
                minHotelRating: action.filterOptions.minHotelRating,
                maxHotelRating: action.filterOptions.maxHotelRating,
                searchPrice: {
                    max: action.filterOptions.maxHotelPrice,
                    min: action.filterOptions.minHotelPrice
                },
                hotelCount: hotelLen,
                isFilter: false,
                skippedCount: state.skippedCount
            };
        case actionType.SEARCHBY_RATING:
            // return {
            //   ...state,
            //   hotelList: action.payload
            // };
            return {
                ...state,
                hotelList: state.hotelList.concat(
                    _filter(action.payload.hotels, (each, i) => {
                        return each.rating >= 2;
                    })
                ),
                // searchPrice: action.inputPayload.price,
                hotelStarListCount: state.hotelList.concat(
                    _filter(action.payload.hotels, (each, i) => {
                        return each.rating >= 2;
                    })
                ),
                paging: action.inputPayload,
                minHotelRating: action.inputPayload.minHotelRating,
                maxHotelRating: action.inputPayload.maxHotelRating,
                sessionId: action.payload.sessionId
                // isSearching: false,
                // isReserve: false,
                // isHotelRest: false
            };
        case actionType.PRICE_FILTER:
            return {
                ...state,
                hotelList: action.payload
            };
        case actionType.SELECTED_COUNTRYCODE_SUCCESS:
            return {
                ...state,
                selectedCurrency: action.payload.currency,
                countryCode: action.payload.code
            };
        case actionType.HOTELS_RATING:
            return {
                ...state,
                ratingCount: action.payload
            };
        case actionType.GET_CURRENCY_DETAILS_SUCCESS:
            return {
                ...state,
                currencyDetails: action.payload
            };
        case actionType.GET_COUNTRYCODE_SUCCESS:
            return {
                ...state,
                countries: action.payload,
            };
        case action.GET_COUNTRYCODE_FAILURE:
            return {
                ...state
            };
        default:
            return state;
    }
};

export default reducer;
