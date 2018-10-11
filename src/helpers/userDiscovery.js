import { store } from '../redux/store';

let UDS = {
    startService: ()=> Promise.resolve()
}

if(typeof window.require !== 'undefined') {
    const { ipcRenderer } = window.require('electron');
    UDS = {
        startService: ({user, key})=> new Promise((res,rej) => {
            if(typeof user === 'undefined' || typeof key === 'undefined'){
                rej({error: 'no_user_data'})
            }else{
                try {
                    ipcRenderer.on('discovery-result',(event, result)=>{
                        store.dispatch({type: 'USER_DISCOVERY_RESULT',payload: result})
                    })
                    ipcRenderer.send('discovery-start',{user, key});
                    res({status: 'ok'})
                } catch (e) {
                    rej({status: 'error', error: e})
                }
            }
        })
    
    }
}

export const userDiscovery = UDS;