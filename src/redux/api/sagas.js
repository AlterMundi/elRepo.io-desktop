
import { call, takeEvery, take, put, race } from 'redux-saga/effects';
import actions from './actions';
import uuidv1 from 'uuid/v1';

// wait :: Number -> Promise
const wait = ms => (
    new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
);

let ipcRenderer = {
    send: ()=> new Promise.resolve('fake ipc rednerer')
}

try {
    ipcRenderer = window.require('electron').ipcRenderer;
} catch (e) {
    console.log('In browser')
}

export const sendRequest = function* () {
    yield takeEvery(actions.SEND_REQUEST, function*(action){
        yield ipcRenderer.send('api', action.payload)
    });
};

export const runState = function* () {
    yield takeEvery(['CONNECT','RUNSTATE'], function*(action){
        while(true) {
            const winner = yield race({
                stopped: take('CLOSE'),
                tick: call(wait, 2000)
            })

            if (!winner.stopped) {
                yield ipcRenderer.send('api', {
                    type: 'RUNSTATE',
                    payload:{
                        path: '/control/runstate/'
                    }
                })
            } else {
                break
            }
        }
    });
}

export const manageRunState = function*() {
    yield takeEvery('RUNSTATE_SUCCESS', function*(action) {
        console.log(action.payload)
        switch(action.payload.data.runstate) {
            case 'waiting_account_select':
                yield put({ type: 'QUERY_LOCATIONS'});
            default:
                return;
        }
    })
}

export const queryLocations = function*() {
    yield takeEvery('QUERY_LOCATIONS', function*() {
        yield ipcRenderer.send('api', {
            type: 'QUERY_LOCATIONS',
            payload: {
                path: '/control/locations/',
                data: {},
            }
        })
    })
};

export const loadLocations = function*() {
    yield takeEvery('QUERY_LOCATIONS_SUCCESS', function*(action) {
        if(action.payload.data.length === 0)
            yield put({type: actions.CREATE_ACCOUNT})
        else
            yield put({type: actions.LOGIN, payload: action.payload.data[0]})
    })
}

export const createAccount = function*() {
    yield takeEvery(actions.CREATE_ACCOUNT, function*(action){
        const username = uuidv1() + '_repo';
        yield ipcRenderer.send('api', {
            type: actions.CREATE_ACCOUNT,
            payload: {
                path: '/control/create_location/',
                data: {
                    pgp_name: username,
                    ssl_name: username,
                    pgp_password: 'demorepo'
                },
            }
        })
    })
}

export const loginAccount = function*() {
    yield takeEvery(actions.LOGIN, function*(action) {
        yield ipcRenderer.send('api', {
            type: actions.LOGIN,
            payload: {
                path: '/control/login/',
                data: {
                    id: action.payload.peer_id
                }
            }
        })
    });
}

export const listenPassword = function*() {
    yield takeEvery(actions.LISTEN_PASSWORD, function*() {
        yield ipcRenderer.send('api', {
            type: actions.LISTEN_PASSWORD,
            payload: {
                path: '/control/password/',
                data: ''
            }
        })
    });
}

export const manageAuth = function*() {
    yield takeEvery(actions.LOGIN_SUCCESS, function*(action) {
        while(true) {
            const winner = yield race({
                stopped: take('TRY_PASSWORD'),
                tick: call(wait, 2000)
            })
    
            if (!winner.stopped) {
                yield put({ type: 'LISTEN_PASSWORD'})
            } else {
                break
            }
        }
    })
}   

export const tryPassword = function*() {
    yield takeEvery('TRY_PASSWORD', function*(action){
        yield ipcRenderer.send('api', {
            type: 'TRY_PASSWORD',
            payload: {
                path: '/control/password/',
                data: { password: 'demorepo' }
            }
        })
    })
}

export const sendPassword = function*() {
    yield takeEvery('LISTEN_PASSWORD_SUCCESS', function*(action){
        if(action.payload.data.want_password === true)
            yield put({ type: 'TRY_PASSWORD'})
    });
}

export const loadChannels = function*() {
    yield takeEvery('LOADCHANNELS', function*() {
        yield ipcRenderer.send('api', {
            type: 'LOADCHANNELS',
            payload: {
                path: '/channels/list_channels'
            }
        })
    })
}

export const logout = function*() {
    yield takeEvery('LOGOUT', function*(){
        yield ipcRenderer.send('api', {
            type: 'LOGOUT',
            payload: {
                path: '/control/logout/'
            }
        })
    })
}