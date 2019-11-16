import actionTypes from "./actionType";
const code = JSON.parse(localStorage.getItem("currency"));
console.log("data-->", initialState);

const initialState = {
  isSearching: false,
  isGifSearching: false,
  // TODO: confirm which is priority (current location? or user recently used?)
  countryCode: code ? code.COUNTRY_CODE : "",
  selectedCurrency: code ? code.ABR_NAME : "",
  currencySym: code ? code.SYM : "",
  currencyFlag: code ? code.COUNTRY_FLAG : "",
  randomProp: Math.random()
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ENABLE_LOADING_SEARCH:
      return {
        ...state,
        isSearching: true
      };
    case actionTypes.DISABLE_LOADING_SEARCH:
      return {
        ...state,
        isSearching: false
      };
    case actionTypes.ENABLE_LOADING_GIF_SEARCH:
      return {
        ...state,
        isGifSearching: true
      };
    case actionTypes.DISABLE_LOADING_GIF_SEARCH:
      return {
        ...state,
        isGifSearching: false
      };
    case actionTypes.COUNTRYCODE_SUCCESS:
      return {
        ...state,
        countryCode: action.payload
      };
    case actionTypes.COUNTRYCODE_FAILURE:
      return {
        ...state,
        countryCode: action.error
      };
    case actionTypes.SELECTED_COUNTRYCODE_SUCCESS:
      return {
        ...state,
        selectedCurrency: action.payload.currency,
        countryCode: action.payload.code,
        currencyFlag: action.payload.currencyFlag,
        currencySym: action.payload.currencySym
      };
    case actionTypes.USERIP_SUCCESS:
      const code = currencyListInfo.filter((each, i) => {
        return each.COUNTRY_CODE == action.payload;
      });
      return {
        ...state,
        userCountry: action.payload,
        countryCode: action.payload
        // currencyFlag: code[0].COUNTRY_FLAG,
        // currencySym: code[0].SYM,
        // selectedCurrency:code[0].ABR_NAME
      };
    case actionTypes.USERIP_FAILURE:
      return {
        ...state,
        userCountry: action.payload
      };
    case "dummyRender":
      return {
          ...state,
          randomProp: Math.random()
      }  

    default:
      return state;
  }
};
export default reducer;

const currencyListInfo = [
  {
    ABR_NAME: "INR",
    COUNTRY_CODE: "IN",
    DESC: "India Rupee",
    SYM: "₹",
    COUNTRY_FLAG: "currencyFlag curInd"
  },
  {
    ABR_NAME: "AUD",
    COUNTRY_CODE: "AU",
    DESC: "Australia Dollar",
    SYM: "$",
    COUNTRY_FLAG: "currencyFlag curAus"
  },
  {
    ABR_NAME: "BHD",
    COUNTRY_CODE: "BH",
    DESC: "Bahrain Dinar",
    SYM: "$",
    COUNTRY_FLAG: "currencyFlag curBah"
  },
  {
    ABR_NAME: "QAR",
    COUNTRY_CODE: "QA",
    DESC: "Qatar Riyal",
    SYM: "$",
    COUNTRY_FLAG: "currencyFlag curQat"
  },
  {
    ABR_NAME: "THB",
    COUNTRY_CODE: "TH",
    DESC: "Thailand Baht",
    SYM: "$",
    COUNTRY_FLAG: "currencyFlag curTha"
  },
  {
    ABR_NAME: "CAD",
    DESC: "Canada Dollar",
    COUNTRY_CODE: "CA",
    SYM: "$",
    COUNTRY_FLAG: "currencyFlag curCan"
  },
  {
    ABR_NAME: "EUR",
    DESC: "Euro",
    COUNTRY_CODE: "FR",
    SYM: "€",
    COUNTRY_FLAG: "currencyFlag curEur"
  },
  {
    ABR_NAME: "SGD",
    DESC: "Singapore Dollar",
    COUNTRY_CODE: "SG",
    SYM: "S$",
    COUNTRY_FLAG: "currencyFlag curSin"
  },
  {
    ABR_NAME: "HKD",
    DESC: "Hong Kong Dollar",
    COUNTRY_CODE: "HK",
    SYM: "HK$",
    COUNTRY_FLAG: "currencyFlag curHKD"
  },
  {
    ABR_NAME: "AED",
    DESC: "UAE Dirham",
    COUNTRY_CODE: "AE",
    SYM: " د.إ",
    COUNTRY_FLAG: "currencyFlag curUae"
  },
  {
    ABR_NAME: "IDR",
    DESC: "Indonesia Rupiah",
    COUNTRY_CODE: "ID",
    SYM: "Rp",
    COUNTRY_FLAG: "currencyFlag curIno"
  },
  {
    ABR_NAME: "JPY",
    DESC: "Japan Yen",
    COUNTRY_CODE: "QP",
    SYM: "¥",
    COUNTRY_FLAG: "currencyFlag curJap"
  },
  {
    ABR_NAME: "LKR",
    DESC: "Sri Lanka Rupee",
    COUNTRY_CODE: "LK",
    SYM: "Rs",
    COUNTRY_FLAG: "currencyFlag curSri"
  },
  {
    ABR_NAME: "USD",
    DESC: "United States",
    COUNTRY_CODE: "US",
    SYM: "$",
    COUNTRY_FLAG: "currencyFlag curUni"
  }
];
