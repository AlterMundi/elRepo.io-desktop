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

    sendRequest: ({ type, payload }) => (dispatch) => dispatch({
        type: actions.SEND_REQUEST,
        payload: {
            type,
            payload: {
                path: payload.path,
                data: payload.data,
            }
        }
    })
}

export default actions