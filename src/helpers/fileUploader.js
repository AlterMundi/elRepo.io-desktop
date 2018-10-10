let fileUP = {
    openDialog: ()=> Promise.reject('no electron'),
    getFilesInfo: ()=> Promise.reject('no electron'),
}

if(typeof window.require !== 'undefined') {
    const uuid = require('uuid/v4');
    const { remote, ipcRenderer } = window.require('electron');
    const Dialog = remote.dialog;
    fileUP = {
        openDialog: ()=> new Promise((res,rej) => {
            const filesNames = Dialog.showOpenDialog()
            if(typeof filesNames === 'undefined'){
                rej({error: 'no_file_selected'})           
            }else{
                res({ files : filesNames})
            }
        }),
        getFilesInfo: ({files= []}) => new Promise((res,rej)=>{
            const requestCb = uuid()
            console.warn(requestCb)
            ipcRenderer.send('getFilesInfo',{files,cb: requestCb});
            ipcRenderer.once(requestCb,(ev,result)=>{
                if (!result.error)
                    //-- { files: [{filename:...., hash:...., size:....}] }
                    res(result.files)
                else
                    // -- { error: '.....' }
                    rej(result)
            })
        })
    
    }
}

export const fileUploader = fileUP;