var mdns = require('mdns');
var uuid = require('uuid/v4')
var net = require('net');
    
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
        key = key.replace(/\n/g, "\\n");
        discoveyService.user = { user, key }
        if(discoveyService.status || typeof discoveyService.user.key === 'undefined') return;
        startSocket(discoveyService.user)
            .then(()=>
                startBrowser(discoveyService.user.user)
            );
        discoveyService.status = true;
    },
    onUser: (userData) => { return true }
  }

  module.exports = { discoveyService}