var mdns = require('mdns');
var uuid = require('uuid/v4')
var net = require('net');
    
var myServiceId = 'Repo at fh4239v732dj298hc432fd98v' //+ uuid();
var key = "marcos-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"

var sequence = [
 mdns.rst.DNSServiceResolve(),
'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({ families: [0] }),
 mdns.rst.makeAddressesUnique()
];

const startBrowser = (user) => {
    var tcp = mdns.tcp('repo')
    var browser = mdns.createBrowser(tcp,{resolverSequence: sequence});
    browser.on('serviceUp', function(service) {
    if(service && service.name !== 'Repo at '+ user) {
        console.log("service up:", service);
        try {
            trySocket(service)
        } catch(e) {
            console.log('error', e)
        }
    }
    });
    browser.on('serviceDown', function(service) {
        //if(service.name !== myServiceId)
            //console.log("service down: ", service);
    });
    browser.start()
}


///////SOCKET SERVER
const startSocket = ({user, key}) => new Promise((res, rej) =>{
    var server = net.createServer(function(conn) {
        console.log("AS SERVER - Connection from " + conn.remoteAddress + " on port " + conn.remotePort);
        conn.setEncoding("utf8");
        var buffer = "";
        console.log('AS SERVER - Sending key')
        conn.write(key+'\n',()=> conn.end());
    });
    
    server.on("listening",()=>{
        console.log('AS SERVER - Opened server on', server.address());
        console.log('AS SERVER - Create advertisment', user)
        var ad = mdns.createAdvertisement(mdns.tcp('repo'), server.address().port,{ name: 'Repo at '+ user});
        ad.start();
        res();
    })
    server.listen(0,'0.0.0.0');    
})


////////SOCKET CLIENT
  var trySocket = (service) => {
    try {
        console.log('AS CLIENT - Try to connect on ', service.port, service.addresses[0])
        let socket = net.createConnection(service.port, service.addresses[0])
        
        socket.on('data', (data)=> { 
            console.log('AS CLIENT - Remote key', Buffer.from(data).toString())
            discoveyService.onUser({
                user: service.host,
                key: Buffer.from(data).toString()
            })
            socket.end();
        })
    } catch(e){
        console.log('Socket not found', e)
    }
  }

  
  const discoveyService = {
    status: false,
    user: {},
    serviceStart: ({ user, key }) => {
        discoveyService.user = { user, key }
        if(discoveyService.status || typeof discoveyService.user.key === 'undefined') return;
        startSocket({user, key})
            .then(()=>
                startBrowser(user)
            );
        discoveyService.status = true;
    },
    onUser: (userData) => { return true }
  }

  module.exports = { discoveyService}