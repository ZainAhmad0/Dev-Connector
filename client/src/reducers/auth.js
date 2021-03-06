import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    AUTH_ERROR,
    USER_LOADED,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    ACCOUNT_DELETED
} from '../actions/types'

const intialState = {
    token: window.localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function (state = intialState, action) {
    const { type, payload } = action;
    switch (type) {
        case USER_LOADED:
            return ({
                ...state,
                isAuthenticated:true,
                loading: false,
                user: payload
            })
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            window.localStorage.setItem('token', payload.token)
            return ({
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            })
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case ACCOUNT_DELETED:
        case LOGOUT:
            localStorage.removeItem('token')
            return ({
                ...state,
                token:null,
                isAuthenticated: null,
                loading: false
            })
        default:
            return state;
    }
}