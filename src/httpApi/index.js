import { store } from '../redux/store';

const api = (url, port) => {
    const apiHttp = (path, data, method, headers) => fetch(url+':'+port+path, { headers, method , body: data? JSON.stringify(data): undefined}   )
        .then(res => res.json());

    return  {
        send: (version, request) => new Promise((res, rej) => {
            if(version === 'api') {
                
                let headers = new Headers()
                //Add auth headers
                const {Api} = store.getState();
                if (Api && Api.login === true) {
                    headers.set('Authorization', 'Basic ' + btoa(Api.user.mLocationId + ":" + Api.password))
                }

                return apiHttp(request.payload.path, request.payload.data, request.payload.method || 'POST', headers)
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
            }
            else if(version === 'stream') {
                const evtSource = new EventSource(url+':'+port+request.payload.path, request.payload.data);
                res(evtSource);
            }
        })
    };
};


export default api;