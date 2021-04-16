import {
    REGISTER_FAIL,
    REGISTER_SUCCESS
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
        case REGISTER_SUCCESS:
            window.localStorage.setItem('token', payload.token)
            return ({
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            })
        case REGISTER_FAIL:
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