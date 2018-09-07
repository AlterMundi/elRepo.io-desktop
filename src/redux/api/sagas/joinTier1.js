import { takeEvery, put } from 'redux-saga/effects'
import httpApi from '../../../httpApi';
import { store } from '../../../redux/store';
import config from '../../../config';

const apiHttp = httpApi('http://localhost',9092);

let ipcRenderer = {
    send: (version, request) => new Promise((res, rej) => {
        console.log('IPC RENDERER',{ request })
        apiHttp.request(request.payload.path, request.payload.data, request.payload.method || 'POST')
            .then((data) =>{
                console.log('request',data)
                store.dispatch({type:request.type+'_SUCCESS', payload: data })
                res(data)
            })
            .catch((e)=> {
                console.log('errror', e)
                store.dispatch({type:request.type+'_FAILD', payload: e });
                rej(e)
            })
    })
}

export const joinTiers = function*() {
    yield takeEvery('JOIN_TIER', function*(action){        
        const exportCert = (
            "retroshare://certificate?" +
            "name=" + encodeURI(action.payload.user) +
            "&radix=" + encodeURI(action.payload.cert) +
            "&location=" + encodeURI(action.payload.user)
            );
        try {
            const result = yield fetch(action.payload.url, {
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

            yield put({type: 'JOIN_TIER_SUCCESS', payload: result });
        } catch(e) {
            yield put({type: 'JOIN_TIER_FAILD', payload: { error: e }});
        }
    });
    
    yield takeEvery ('JOIN_TIER_SUCCESS', function*(action){
        yield  yield ipcRenderer.send('api', {
            type: 'ACCEPT_TIER',
            payload: {
                path: '/rsPeers/acceptInvite',
                data: {
                    invite: config.tiers1[0].credential
                }
            }
        })
    })
}