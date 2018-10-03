import { call, select, takeEvery, take, put, race } from 'redux-saga/effects';
import actions from './actions';
import uuidv1 from 'uuid/v1';
import config from '../../config';
import httpApi from '../../httpApi';
import { store } from '../../redux/store';
import { apiCall } from '../../helpers/apiWrapper'

const apiHttp = httpApi(config.api.url,config.api.port);

// wait :: Number -> Promise
const wait = ms => (
    new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
);

export const user = function*() {
    
    yield takeEvery('LOGOUT', function*(){
        yield apiHttp.send('-socket', {
            type: 'LOGOUT',
            payload: {
                path: '/control/logout/'
            }
        })
    })

    yield takeEvery('CONNECT', function*(){
        yield apiCall('CHECK_LOGGIN', '/rsLoginHelper/isLoggedIn')
    })

    yield takeEvery(['CHECK_LOGGIN_SUCCESS','QUERY_LOCATIONS'], function*(){
        yield apiCall('QUERY_LOCATIONS','/rsLoginHelper/getLocations')
    })

    yield takeEvery('QUERY_LOCATIONS_SUCCESS', function*(action) {
        const isLogged = yield select(state => state.Api.runstate === true);
        //Si no hay cuentas crear una
        if(action.payload.locations.length === 0)
            yield put({type: actions.CREATE_ACCOUNT})
        //Si el sistema tiene cuentas y fugura sin login hago lopgin
        else if (isLogged === false)
            yield put({type: actions.LOGIN, payload: action.payload.locations[0]})
        //Sino simulo un login exitoso
        else
            yield put({type: actions.LOGIN_SUCCESS, payload: action.payload.locations[0]})
    })

    yield takeEvery(actions.CREATE_ACCOUNT, function*(action){
        const username = uuidv1() + '_repo';
        yield apiCall(
            actions.CREATE_ACCOUNT,
            '/rsLoginHelper/createLocation',
            {
                location: {
                    mPpgName: username,
                    mLocationName: username
                },
                password: '0000',
                makeHidden: false,
                makeAutoTor: false
            }
        )
    })

    yield takeEvery(actions.CREATE_ACCOUNT_SUCCESS, function*(action){
        yield put({ type: 'QUERY_LOCATIONS'})
    })

    yield takeEvery(actions.LOGIN, function*(action) {
        yield apiCall(actions.LOGIN,'/rsLoginHelper/attemptLogin', {
            account: action.payload.mLocationId,
            password: '0000'
        })
    });

    yield takeEvery(['LOGIN_SUCCESS','GET_SELF_CERT'], function*(){
        const userId = yield select(state => state.Api.user.mLocationId)
        yield apiCall('GET_SELF_CERT','/rsPeers/GetRetroshareInvite',{
            sslId: userId
        })
    })

    yield takeEvery(actions.LOGIN_SUCCESS, function*() {
        yield put({type: 'START_SYSTEM'})
    });
}


export const channels = function*() {
    yield takeEvery('START_SYSTEM' , function*(){
        yield put({ type: 'LOADCHANNELS' })
    })

    yield takeEvery('LOADCHANNELS', function*() {
        yield apiCall('LOADCHANNELS','/rsGxsChannels/getChannelsSummaries');
    })

    yield takeEvery('LOADCHANNEL_EXTRADATA', function*(action) {
        yield apiCall('LOADCHANNEL_EXTRADATA','/rsGxsChannels/getChannelsInfo',{
            chanIds: action.payload.channels
        })
    })
}

export const peers = function*() {
    yield takeEvery(['START_SYSTEM'], function*(action){
        yield put({type: 'LOADPEERS'})
        while(true) {
            const winner = yield race({
                stopped: take('PEER_MONITOR_STOP'),
                tick: call(wait, 10000)
            })

            if (!winner.stopped) {
                yield put({type: 'LOADPEERS'})
            } else {
                break
            }
        }
    });

    yield takeEvery('LOADPEERS', function*() {
        yield apiCall('PEERS','/rsPeers/getFriendList')
    })

    yield takeEvery('PEERS_SUCCESS', function*(action){
        const sslIds = action.payload.sslIds || [];
        if(sslIds.length > 0) {
            let i = 0;
            while(i < sslIds.length){
                yield put({type: 'LOADPEER_INFO', payload: {id: sslIds[i]}});
                i++;
            }
        }
        return;
    })

    yield takeEvery('LOADPEER_INFO', function*(action){
        yield apiCall('LOADPEER_INFO','/rsPeers/getPeerDetails',{
            sslId: action.payload.id
        })
    })

   /*
   yield takeEvery('LOADPEER_INFO_SUCCESS', function*(action){
        yield apiCall('PEER_STATUS','/rsPeers/isOnline',{
                    sslId: action.payload.det.id
        })
    })
    */

    let joinTier = 0;
    yield takeEvery('PEERS_SUCCESS', function*(action){
        if(joinTier !== 0) return;
        joinTier = 1;
        if (typeof action.payload.sslIds !== 'undefined' && action.payload.sslIds.length === 0){
            const api = yield select(state => state.Api)
            yield put({
                type: actions.JOIN_TIER,
                payload: {
                    url: config.tiers1[0].url,
                    remote: true,
                    cert: api.cert,
                    user: api.user.mLocationName
                }
            })
        }
    })
}

export const search = function*(){
    yield takeEvery('START_SYSTEM' , function*(){
    })

    let resultSockets = null;

    //START SEARCH
    yield takeEvery('SEARCH_NEW', function*(action) {
        const jsonData = JSON.stringify({
            matchString: action.payload
        });
        
        if(resultSockets !== null) {
            resultSockets.close();
            resultSockets = null;
        }

        resultSockets = yield apiHttp.send('stream', {
                type: 'SEARCH_NEW',
                payload: {
                    path: `/rsGxsChannels/turtleSearchRequest?jsonData=${encodeURIComponent(jsonData)}`
                }
            })

        resultSockets.onmessage = (eventData) => {
            if(typeof eventData.data.retval === 'undefined')
                store.dispatch({type: 'SEARCH_GET_RESULTS_SUCCESS', payload: JSON.parse(eventData.data)})
        }
    })
}

export const contentMagnament = function*() {

    yield takeEvery([actions.CREATE_ACCOUNT_SUCCESS, 'CREATE_USER_CHANNEL'],function*({action, payload={}}){
        console.log(action)
        const user = yield select(state => state.Api.user);
        const newGroupData = {
            group: {
                mDescription: "Open Repo",
                mAutoDownload: true,
                mMeta: {
                    mGroupName: typeof payload.location !== 'undefined' ? payload.location.mLocationName: false || user.mLocationName,
                    mGroupFlags: 4,
                    mSignFlags: 520,
                }
            }
        };
        yield apiCall('CREATE_USER_CHANNEL','/rsGxsChannels/createGroup',newGroupData)
    })

    yield takeEvery('PUBLISH_CONTENT', function*(action){
        yield apiCall('PUBLISH_CONTENT', '', {

        })
    })
}