import { combineReducers } from "redux";

const initialState = {
    online: true,
    listData: [],
    page: 1,
    total_count: 0,
    loading: false
}

export function reducer(state = initialState, action) {
    switch (action.type) {
        case "REQUEST_DATA": {
            return {
                ...state,
                loading: true
            }
        }
        case "TOGGLE_INTERNET_CONNECTION":
            return {
                ...state,
                online: action.internet
            }
        case "ADD_LIST_DATA": {
            return {
                ...state,
                page: action.data.page,
                listData: action.data.data,
                total_count: action.data.total_count,
                searchText: action.searchText,
            }
        }
        case "REQUEST_SUCCESS": {
            return {
                ...state,
                loading: false
            }
        }
        default:
            return state;
    }

}

const offlineState = {

}

export function offlineReducer(state = offlineState, action) {
    switch (action.type) {
        case "ADD_LIST_DATA":
            let searchText = action.searchText;
            return {
                ...state,
                [action.searchText]: action.data
            }
        default:
            return state;
    }
    return state;
}
export default rootReducer = combineReducers({ reducer, offlineReducer })