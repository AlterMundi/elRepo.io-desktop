
import { all, call, select, takeEvery, take, put, race, fork } from 'redux-saga/effects';
import actions from './actions';
import uuidv1 from 'uuid/v1';
import config from '../../config'

// util function -> take only once
function* takeFirst(pattern, saga, ...args) {
    const task = yield fork(function* () {
        while(true) {
            const action = yield take(pattern);
            yield call(saga, ...args.concat(action));
        }
    });
    return task;
}

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
        yield ipcRenderer.send('api', {
            type: 'CONNECT',
            payload:{
                path: '/control/runstate/'
            }
        })
    });
}

export const manageRunState = function*() {
    let firstOk = true;
    yield takeEvery('CONNECT_SUCCESS', function*(action) {
        const runningState = yield select(state => state.Api.runstate)
        if(firstOk && runningState === 'running_ok'){
            firstOk = false;
            yield put([{ type: 'GET_IDENTITY'},{ type: 'LOADCHANNELS'}])
        } else {
            switch(runningState) {
                case 'waiting_account_select':
                    const logged =yield select(state=>state.Api.login)
                    if(logged === false)
                        yield put({ type: 'QUERY_LOCATIONS'});
                default:
                    return;
            }
        }
    })
}

export const queryLocations = function*() {
    yield takeEvery('QUERY_LOCATIONS', function*(action) {
        const payload = (typeof action.payload !== 'undefined')? action.payload: {};
        yield ipcRenderer.send('api', {
            type: (payload.afterLogin)? 'REQUERY_LOCATIONS':'QUERY_LOCATIONS',
            payload: {
                path: '/control/locations/',
                data: {},
            }
        })
    })
};

export const loadLocations = function*() {
    yield takeEvery('QUERY_LOCATIONS_SUCCESS', function*(action) {
        const isLogged = yield select(state => state.Api.login);
        if(action.payload.data.length === 0)
            yield put({type: actions.CREATE_ACCOUNT})
        else if (isLogged === false)
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
        yield put({ type: 'LISTEN_PASSWORD'})
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
    yield takeEvery('TRY_PASSWORD_SUCCESS', function*(action){
            //yield put({ type: 'GET_IDENTITY' })
    })
}

export const Identity = function*() {

    yield takeEvery('GET_IDENTITY', function*(){
        yield ipcRenderer.send('api', {
            type: 'GET_IDENTITY',
            payload: {
                path: '/identity/own'
            }
        })
    })

    yield takeEvery('GET_IDENTITY_SUCCESS', function*(action){
        if(action.payload.data.length === 0) {
            yield put({ type: 'ADD_IDENTITY' })
        } else {
            yield put({ type: 'GET_SELF_CERT'})
        }
    })

    yield takeEvery('GET_SELF_CERT_SUCCESS', function*(){
        yield put({ 
            type: 'SEND_REQUEST',
            payload: {
                type: 'PEERS',
                payload:{
                    path: '/peers/*'
                }
            }
        })
    })

    yield takeEvery('ADD_IDENTITY',function*(){
        yield ipcRenderer.send('api', {
            type: 'ADD_IDENTITY',
            payload: {
                path: '/identity/create_identity',
                data: {
                    pgp_linked: false,
                    name: 'openrepo'
                }
            }
        })
    })

    yield takeEvery('ADD_IDENTITY_SUCCESS', function*(){
        yield put({ type: 'GET_IDENTITY'})
    })
}

export const peerMonitor = function*() {
    yield takeEvery(['PEER_MONITOR_START'], function*(action){
        while(true) {
            const winner = yield race({
                stopped: take('PEER_MONITOR_STOP'),
                tick: call(wait, 5324)
            })

            if (!winner.stopped) {
                yield put({ 
                    type: 'SEND_REQUEST',
                    payload: {
                        type: 'PEERS',
                        payload:{
                            path: '/peers/*'
                        }
                    }
                })
            } else {
                break
            }
        }
    });

    yield takeFirst('PEERS_SUCCESS', function*(action){
        if (typeof action.payload.data !== 'undefined' && action.payload.data.length === 0){
            const api = yield select(state => state.Api)
            yield put({
                type: actions.JOIN_TIER,
                payload: {
                    url: config.tiers1[0].url,
                    remote: true,
                    cert: api.cert,
                    user: api.user.name
                }
            })
        }
    })
}



export const sendPassword = function*() {
    yield takeEvery('LISTEN_PASSWORD_SUCCESS', function*(action){
        if(action.payload.data.want_password === true)
            yield put({ type: 'TRY_PASSWORD'})
    });
}

export const loadChannels = function*() {
    /* yield takeEvery(['CHANNELS_MONITOR_START'], function*(action){
        while(true) {
            const winner = yield race({
                stopped: take('CHANNELS_MONITOR_STOP'),
                tick: call(wait, 0)
            })

            if (!winner.stopped) {
                yield put({ type: 'LOADCHANNELS' })
            } else {
                break
            }
        }
    }); */

    yield takeEvery('LOADCHANNELS', function*() {
        yield ipcRenderer.send('api', {
            type: 'LOADCHANNELS',
            payload: {
                path: '/channels/list_channels'
            }
        })
    })
}

export const getSlefCert = function*() {
    yield takeEvery('GET_SELF_CERT', function*(){
        yield ipcRenderer.send('api', {
            type: 'GET_SELF_CERT',
            payload: {
                path: '/peers/self/certificate/'
            }
        })
    })
}

export const search = function*() {

    //START SEARCH
    yield takeEvery('SEARCH_NEW', function*(action) {
        yield ipcRenderer.send('api', {
            type: 'SEARCH_NEW',
            payload: {
                path: '/filesearch/create_search',
                data: {
                    distant: true,
                    search_string: action.payload
                }
            }
        })
    })

    yield takeEvery('SEARCH_GET_RESULTS', function*(action) {
        yield ipcRenderer.send('api', {
            type: 'SEARCH_GET_RESULTS',
            payload: {
                path: '/filesearch/get_search_result',
                data: {
                    search_id: action.payload
                }
            }
        })
    })

    yield takeEvery('SEARCH_GET_ACTIVES', function*() {
        yield ipcRenderer.send('api', {
            type: 'SEARCH_GET_ACTIVES',
            payload: {
                path: '/filesearch'
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