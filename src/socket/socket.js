const { EventEmitter } = require('events');
const net = require('net');
const { wrapper } = require('./wrapper');
const { handler } = require('./handler');
const v4 = require('uuid/v4');

const defaultPath = '/home/okupa/.retroshare/libresapi.sock'

const socket = (path) => {
    let api = {
        path: path || defaultPath,
        socket: null,
        connect: () => {
            api.socket = net.createConnection(api.path)
            api.addListeners()
            return api;
        },
        quewe: [],
        call: (apiRequest) => {
            if(api.quewe.length === 0) {
                api.quewe = api.quewe.concat(apiRequest);
                api.next()
                return; 
            }
            api.quewe = api.quewe.concat(apiRequest);
        },
        next: () => {
            const nextRequest = api.quewe.shift();
            console.log('3. -------------> nextRequest()', nextRequest)
            api.tmp='';
            if(typeof nextRequest !== 'undefined') {
                api.socket.write(nextRequest);
            }
        },
        handler: handler(),
        tmp: '',
        listeners: {
            onConnect:  (x) => { 
                console.log('0. Connected')
                api.emmiter.emit('event',{ action :'connect', data: x }) 
            },
            onEnd:      (x) => { api.emmiter.emit('event',{ action :'end',     data: x }) },
            onMessage:  (x) => { api.emmiter.emit('event',{ action :'message', data: x }) },
            onError:    (x) => { api.emmiter.emit('event',{ action :'error',   data: x }) },
            onData:  (x) => {
                api.tmp += x.toString()
                console.log('TMP: \n\n\n', api.tmp,'\n\n\n')
                let data = ''
                try {
                    data = JSON.parse(api.tmp);
                    console.log(data)
                } catch(e) {
                    return;
                }
                api.emmiter.emit('event',{ action :'data',   data: data });
                api.handler.respond(null, data);
                api.next() 
            }
        },
        addListeners: () => {
            api.socket.on('connect', api.listeners.onConnect);
            api.socket.on('data', api.listeners.onData);
            api.socket.on('message', api.listeners.onData);
            api.socket.on('end', api.listeners.onEnd);
            api.socket.on('error', api.listeners.onError);
        },
        request: (path, data) => {
            let callback_name = v4();
            api.call(wrapper(path, Object.assign({}, data, { callback_name: callback_name })));
            return api.handler.register(callback_name)
        },
        emmiter: new EventEmitter()
    }
    return api;
}

exports.socket = socket;


    
/*

// TEST
let api = socket();

// addEventListener(api.emmiter, console.log)

api.emmiter.on('event', (data) => {
    if (data.action === 'connect') {
        console.log('connect')
        api.request('/control/locations/', {})
        .then(data => {
            console.log('locations', data)
        })    
        .catch(e => console.log('error', e))
    }
})

api.connect();




const apiSocket = (path) => {
    const socket = net.createConnection({path:path || '/home/okupa/.retroshare/libresapi.sock'});

    // 'connect' listener
    socket.on('connect', (data) => {
        console.log('connected to server!');
        socket.write('/control/locations/\n{}\n', console.log);
        socket.write('/control/login/\n{"id":"e3455fa2537098b0945e1009ade723b2"}\n', console.log);
        socket.write('/control/login/\n{"id":"e3455fa2537098b0945e1009ade723b2"}\n', console.log);
        
        setTimeout(()=>
        socket.write('/control/password/\n{"password":"test"}\n', console.log),
        2000)
        setTimeout(()=>socket.write('/channels/list_channels\n{}\n',console.log),5000)
        
    });

    

    socket.on('data', (data) => {
        console.log('FROM SOCKET', data.toString());
    });
    socket.on('message', (data) => {
        console.log('FROM SOCKET', data.toString());
    });
    socket.on('error', (data) => {
        console.log('FROM SOCKET', data.toString());
    });
    socket.on('end', () => {
        console.log('disconnected from server');
    });

    
}

apiSocket()

module.exports =  { apiSocket }
*/