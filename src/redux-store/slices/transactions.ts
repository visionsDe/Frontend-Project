const initialState = {
    bookingCountriesListData: [],
    bookingRegionsListData: [],
    bookingCitiesListData: [],
    bookingTransactionListData: [],
    loading: true
}
export const getBookingTransactionsData = (bookingTransactionsData: any) => {
    return {
        type: "getBookingTransactions",
        payload: bookingTransactionsData
    }
}
export const getBookingCountriesData = (bookingCountriesData: any) => {
    return {
        type: "getBookingCountries",
        payload: bookingCountriesData
    }
}
export const getBookingRegionsData = (bookingRegionsData: any) => {
    return {
        type: "getBookingRegions",
        payload: bookingRegionsData
    }
}
export const getBookingCitiesData = (bookingCitiesData: any) => {
    return {
        type: "getBookingCities",
        payload: bookingCitiesData
    }
}
const bookingTransactionsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "getBookingTransactions":
            return {
                ... state,
                bookingTransactionListData: action.payload,
                loading: false
            }
        case "getBookingCountries":
            return {
                ... state,
                bookingCountriesListData: action.payload,
                loading: false
            }
        case "getBookingRegions":
            return {
                ... state,
                bookingRegionsListData: action.payload,
                loading: false
            }
        case "getBookingCities":
            return {
                ... state,
                bookingCitiesListData: action.payload,
                loading: false
            }
  
        default: 
            return state    
    }
}
export default bookingTransactionsReducer;