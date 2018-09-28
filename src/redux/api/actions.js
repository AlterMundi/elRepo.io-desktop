export const actions = {    
    SEND_REQUEST: 'SEND_REQUEST',
    CONNECT: 'CONNECT',
    CONNECT_SUCCESS: 'CONNECT_SUCCESS',
    CREATE_ACCOUNT: 'CREATE_ACCOUNT',
    CREATE_ACCOUNT_SUCCESS: 'CREATE_ACCOUNT_SUCCESS',
    CREATE_ACCOUNT_FAILD: 'CREATE_ACCOUNT_FAILD',
    LOGIN: 'LOGIN',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILD: 'LOGIN_FAILD',
    LISTEN_PASSWORD: 'LISTEN_PASSWORD',
    LISTEN_PASSWORD_SUCCESS: 'LISTEN_PASSWORD_SUCCESS',
    LISTEN_PASSWORD_FAILD: 'LISTEN_PASSWORD_FAILD',
    JOIN_TIER: 'JOIN_TIER',
    JOIN_TIER_SUCCESS: 'JOIN_TIER_SUCCESS',
    JOIN_TIER_FAILD: 'JOIN_TIER_FAILD',

    SEARCH_GET_RESULTS: 'SEARCH_GET_RESULTS',

    updateSearchResults: ( id ) => (dispatch) => {
        dispatch({
        type: actions.SEARCH_GET_RESULTS,
        payload: id
    })},

    updateChannels: () => dispatch => dispatch({
        type: 'LOADCHANNELS'
    }),

    sendRequest: ({ type, payload }) => (dispatch) => dispatch({
        type: actions.SEND_REQUEST,
        payload: {
            type,
            payload: {
                path: payload.path,
                data: payload.data,
            }
        }
    }),

    checkUser: (payload) => (dispatch, getState) => {
        if(typeof getState().Api.user === 'undefined') {
            dispatch({
                type: 'QUERY_LOCATIONS',
                payload: {
                    afterLogin: true
                }
            })
        }
    },

    loadExtraData:(channelId) => (dispatch) => {
        dispatch({
            type: 'LOADCHANNEL_EXTRADATA',
            payload: {
                channels: [channelId]
            }
        })
    },

    joinTier1: (payload) => (dispatch, getState) => {
        dispatch({
            type: actions.JOIN_TIER,
            payload: {
                url: payload.url,
                remote: payload.remote || false,
                cert: (!payload.remote)? payload.cert: getState().Api.cert,
                user: (!payload.remote  )? payload.user: getState().Api.user.name
            }
        })
    },

    newSearch: (payload) => dispatch => {
        dispatch({type: 'SEARCH_NEW', payload})
    }
}

export default actions