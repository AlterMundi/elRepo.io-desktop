import actions from "./actions";

const initState = {
    login: false,
    runstate: '',
    channels: [],
    cert: null,
    search: null,
    results: []
}

export default function apiReducer(state = initState, action) {
    switch(action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                login: true
            }
        case 'RUNSTATE_SUCCESS':
            return {
                ...state,
                runstate: (typeof action.payload.data !== 'undefined' && typeof action.payload.data.runstate !== 'undefined')? action.payload.data.runstate: state.runstate
            }
        case 'CONNECT_SUCCESS':
            return {
                ...state,
                runstate: (typeof action.payload.data !== 'undefined' && typeof action.payload.data.runstate !== 'undefined')? action.payload.data.runstate: state.runstate
            }
        case 'QUERY_LOCATIONS': {
            return {
                ...state,
                user: {}
            }
        }
        case 'PEERS_SUCCESS': {
            return {
                ...state,
                peers: (typeof action.payload.data !== 'undefined' && action.payload.data.length > 0)? action.payload.data: []
            }
        }
        case 'QUERY_LOCATIONS_SUCCESS':
            return {
                ...state,
                user: action.payload.data[0]
            }
        case 'REQUERY_LOCATIONS_SUCCESS': 
            return {
                ...state,
                user: action.payload.data[0]
            }
        case 'GET_IDENTITY_SUCCESS':
            return {
                ...state,
                identity: (action.payload.data.length > 0)? action.payload.data[0]: undefined
            }
        case 'LOADCHANNELS_SUCCESS': 
            console.log(action.payload)
            return {
                ...state,
                channels: action.payload.data || []
            }
        case 'GET_SELF_CERT_SUCCESS': 
            return {
                ...state,
                cert: action.payload.data.cert_string
            }
        case 'SEARCH_GET_RESULTS_SUCCESS':
            return {
                ...state,
                results: action.payload.data || []
            }
        default:
            return state;
    }
}