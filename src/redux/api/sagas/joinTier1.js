import { call, take, takeEvery, put, fork } from 'redux-saga/effects'
import config from '../../../config'
import { encode } from 'punycode';

let ipcRenderer = {
    send: ()=> new Promise.resolve('fake ipc rednerer')
}

try {
    ipcRenderer = window.require('electron').ipcRenderer;
} catch (e) {
    console.log('In browser')
}

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

export const joinTiers = function*() {
    yield takeEvery('JOIN_TIER', function*(action){
        if(action.payload.remote !== true) {
            yield ipcRenderer.send('api', {
                type: 'JOIN_TIER',
                payload: {
                    path: 'PUT /peers',
                    data: {
                        cert_string: action.payload.cert,
                        flags:
                        {
                            allow_direct_download: true,
                            allow_push: false,
                            require_whitelist: false,
                        }
                    }
                }
            });
        }
        else {
            /*const exportCert = (
                "retroshare://certificate?" +
                "name=" + encodeURI(action.payload.user) +
                "&radix=" + encodeURI(action.payload.cert) +
                "&location=" + encodeURI(action.payload.user)
            );*/
            try {
                const result = yield call(()=> {
                    return fetch(action.payload.url, {
                        body: JSON.stringify({
                            cert_string: action.payload.cert,
                            flags:
                            {
                                allow_direct_download: true,
                                allow_push: false,
                                require_whitelist: false,
                            }
                        }),
                        headers: {'content-type': 'application/json'},
                        method: 'POST'
                    }).then(res => res.json())
                })
                yield put({type: 'JOIN_TIER_SUCCESS', payload: { ...result, remote: true }});
            } catch(e) {
                yield put({type: 'JOIN_TIER_FAILD', payload: { error: e }});
            }
        }
    })
    yield takeEvery ('JOIN_TIER_SUCCESS', function*(action){
        console.log('jtier success', action.payload)
        if(action.payload.remote === true) {
            yield put({ type: 'JOIN_TIER', payload: {
                cert: config.tiers1[0].credential
            }})
        }
    })
}