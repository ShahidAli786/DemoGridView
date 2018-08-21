import { Alert, ToastAndroid, Platform } from 'react-native';
async function fetchData(url) {
    let res = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization:
                "Basic  NjViY2YtMTE0NWUtMTQ4ZTMtZDk5MTEtNGQ1NWUtYzllZWI6NjEzNDYtMDczMjktN2FjNzMtZmYwMGMtMDA5ZWYtOTdlY2Q="
        }
    });
    return res.json();
}

export function getListData(searchText) {
    const url = `https://api.shutterstock.com/v2/images/search?query=${searchText}&&page=1`;
    return (dispatch, getState) => {
        if (getState().reducer.online) {
            dispatch({ type: 'REQUEST_DATA' })
            let response = fetchData(url);
            response.then(data => {
                dispatch({ type: 'REQUEST_SUCCESS' })
                dispatch({ type: 'ADD_LIST_DATA', data: data, searchText: searchText })
            }).catch((err) => {
                //console.log(err.message)
                Alert.alert("Error", err.message);
                dispatch({ type: 'REQUEST_SUCCESS' })
            })
        }
        else {
            if (typeof getState().offlineReducer[searchText] != 'undefined') {
                if (Platform.OS == 'android') {
                    ToastAndroid.show(`No Internet ! Showing Offline Data for ${searchText} `, ToastAndroid.LONG, ToastAndroid.CENTER)
                }
                dispatch({ type: 'ADD_LIST_DATA', data: getState().offlineReducer[searchText], searchText: searchText })
            }
            else {
                Alert.alert("No Internet Connection")
            }
        }

    }
}
export function getMoreData() {
    return (dispatch, getState) => {
        const url = `https://api.shutterstock.com/v2/images/search?query=${getState().reducer.searchText}&&page=${getState().reducer.page + 1}`;
        if (getState().reducer.online) {
            //dispatch({ type: 'REQUEST_DATA' })
            let response = fetchData(url);
            response.then(data => {
                dispatch({ type: 'REQUEST_SUCCESS' })
                let persistData = {
                    ...data,
                    data: [...getState().reducer.listData, ...data.data]
                }
                dispatch({ type: 'ADD_LIST_DATA', data: persistData, searchText: getState().reducer.searchText })
            }).catch((err) => {
                Alert.alert("Error", err.message);
                dispatch({ type: 'REQUEST_SUCCESS' })
            })
        }
        else {
            Alert.alert("No Internet Connection")
        }

    }
}