const http = require('http')
const socketio = require('socket.io');
const net = require('net')
var request = require('request');

const { EventEmitter } = require('events');
const { wrapper } = require('./src/socket/wrapper');
const { handler } = require('./src/socket/handler');
const v4 = require('uuid/v4');

const app = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if(req.method === 'POST') {
        let body = ''
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            request.post({
                headers: {'content-type' : 'application/json'},
                url: 'http://localhost:9092/'+req.url,
                body: body
            },(err, result) => {
                if(result) {
                    console.log(result.body)
                    res.end(result.body)
                } else {
                    res.statusCode=404
                    res.end()
                }
            })
        });
    }
    else {
        request('http://localhost:9092/'+req.url,{},(err, result) => {
            console.log(result.body)
            res.end(result.body)
        })
    }
})


app.listen(8080);

const io = socketio(app);

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

const api = socket('/tmp/retro.sock');
api.connect()

io.set('origins', 'http://localhost:3000');

io.on('connection', function (websocket) {
    websocket.emit({ hello: 'world' });
    console.log('user connected')
    websocket.on('disconnect', function(){
        console.log('user disconnected');
    });
    websocket.on('data', function(arg){
        console.log('API-SOCKET CALL',arg)
        api.request(arg.payload.path, arg.payload.data)
            .then(res => {
                console.log('api.socket data', res)
                if(res.returncode !== 'fail')
                    io.emit('socket-reply', {type: arg.type+'_SUCCESS', payload: res})
                else 
                    io.emit('socket-reply', {type: arg.type+'_FAILD', payload: res})
            })
            .catch(err => io.emit('socket-reply', {type: arg.type+'_FAILD', payload: err}))
    });
});



