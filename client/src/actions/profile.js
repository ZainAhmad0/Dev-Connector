import axios from 'axios'
import { setAlert } from './alert'
import {
    PROFILE_ERROR,
    GET_PROFILE,
    UPDATE_PROFILE,
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_PROFILES
} from './types'

// get current user profile

export const getCurrentProfile = () => {
    return async (dispatch) => {
        try {
            const res = await axios.get('http://localhost:5000/api/profile/me')
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}

// get all profiles
export const getProfiles = () => {
    return async (dispatch) => {
        dispatch({ type: CLEAR_PROFILE });
        try {
            const res = await axios.get('http://localhost:5000/api/profile')
            dispatch({
                type: GET_PROFILES,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}

// get profile by id
export const getProfileById = (userId) => {
    return async (dispatch) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/profile/user/${userId}`)
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}

// Create or update profile
export const createProfile = (formData, history, edit = false) => {
    return async (dispatch) => {
        try {
            const config = {
                headers: {
                    'Content-Type': "application/json"
                }
            }
            const res = await axios.post('http://localhost:5000/api/profile', formData, config)
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            });
            dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));
            if (!edit) {
                history.push('/dashboard');
            }
        } catch (err) {
            const errors = err.response.data.errors;
            if (errors) {
                errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
            }
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }
    }
}

// ADD EXPERIENCE 
export const addExperience = (formData, history) => {
    return async (dispatch) => {
        try {
            const config = {
                headers: {
                    'Content-Type': "application/json"
                }
            }
            const res = await axios.put('http://localhost:5000/api/profile/experiance', formData, config)
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            });
            dispatch(setAlert('Experience Added', 'success'));
            history.push('/dashboard');
        } catch (err) {
            const errors = err.response.data.errors;
            if (errors) {
                errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
            }
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }

    }
}

// ADD EDUCATION 
export const addEducation = (formData, history) => {
    return async (dispatch) => {
        try {
            const config = {
                headers: {
                    'Content-Type': "application/json"
                }
            }
            const res = await axios.put('http://localhost:5000/api/profile/education', formData, config)
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            });
            dispatch(setAlert('Education Added', 'success'));
            history.push('/dashboard');
        } catch (err) {
            const errors = err.response.data.errors;
            if (errors) {
                errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
            }
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }

    }
}

// delete experience

export const deleteExperience = id => {
    return async (dispatch) => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/profile/experiance/${id}`)
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            })
            dispatch(setAlert('Experience Removed', 'success'));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }
    }
}

// delete education

export const deleteEducation = id => {
    return async (dispatch) => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/profile/education/${id}`)
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            })
            dispatch(setAlert('Education Removed', 'success'));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }
    }
}

// delete profile & account

export const deleteAccount = id => {
    return async (dispatch) => {
        if (window.confirm("Are you sure? This can't be undone!")) {
            try {
                await axios.delete('http://localhost:5000/api/profile')
                dispatch({
                    type: CLEAR_PROFILE,
                })
                dispatch({
                    type: ACCOUNT_DELETED,
                })
                dispatch(setAlert('Your account has been permanently deleted'));
            } catch (err) {
                dispatch({
                    type: PROFILE_ERROR,
                    payload: { msg: err.response.statusText, status: err.response.status }
                });
            }
        }
    }

}