import actions from "./actions";

const initState = {
    login: false,
    runstate: null,
    channels: [],
    cert: null,
    search: [],
    results: [],
    searchId: ''
}

export default function apiReducer(state = initState, action) {
    switch(action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                login: true,
                runstate: true
            }
        case 'CHECK_LOGGIN_SUCCESS':
            return {
                ...state,
                runstate: action.payload.retval
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
                peers: (typeof action.payload.sslIds !== 'undefined' && action.payload.sslIds.length > 0)? action.payload.sslIds: []
            }
        }
        case 'QUERY_LOCATIONS_SUCCESS':
            return {
                ...state,
                user: action.payload.locations[0],
            }
        case 'REQUERY_LOCATIONS_SUCCESS': 
            return {
                ...state,
                user: action.payload.locations[0]
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
                channels: action.payload.channelsInfo || []
            }
        case 'GET_SELF_CERT_SUCCESS': 
            return {
                ...state,
                cert: action.payload.retval
            }
        case 'SEARCH_GET_ACTIVES_SUCCESS':
            return {
                ...state,
                search: action.payload.data,
                searchId: (state.searchId === '' && action.payload.data.length > 0)? action.payload.data[0].id: state.searchId
            }
        case 'SEARCH_GET_RESULTS_SUCCESS':
            return {
                ...state,
                results: {
                    ...state.results,
                    [state.searchId]: action.payload.data || []
                },
                searchId: (typeof state.search.map(x => x.id)[state.search.map(x => x.id).indexOf(state.searchId)+1] !== 'undefined')? state.search[state.search.map(x => x.id).indexOf(state.searchId)+1].id: state.search[0].id
            }
        case 'SEARCH_NEW_SUCCESS':
            return {
                ...state,
                results: {
                    ...state.results,
                    [action.payload.data.search_id]: []
                }
            }
        case 'SEARCH_GET_RESULTS':
            return {
                ...state,
                //searchId: action.payload || state.searchId
            }
        default:
            return state;
    }
}