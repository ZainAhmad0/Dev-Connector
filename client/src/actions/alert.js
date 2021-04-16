import { SET_ALERT, REMOVE_ALERT } from './types'
import uniqid from 'uniqid'

export const setAlert = (msg, alertType,timeOut=2500) => {
    return (dispatch) => {
        // console.log( uuid.v4())
        const id = uniqid()
        dispatch({
            type: SET_ALERT,
            payload: {
                msg, alertType, id
            }
        })
        setTimeout(()=>dispatch({type:REMOVE_ALERT,payload:id}),timeOut)
    }
}
