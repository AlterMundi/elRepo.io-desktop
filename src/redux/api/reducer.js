import actions from "./actions";

const initState = {
    runstate: '',
    channels: []
}

export default function apiReducer(state = initState, action) {
    switch(action.type) {
        case 'RUNSTATE_SUCCESS':
            return {
                ...state,
                runstate: action.payload.data.runstate
            }
        case 'LOADCHANNELS_SUCCESS': {
            return {
                ...state,
                channels: action.payload
            }
        }
        default:
            return state;
    }
}