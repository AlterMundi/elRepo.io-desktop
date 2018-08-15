const handler = () => {
    const hd = {
        responses: {},
        getCallback: (uuid)=> hd.responses[uuid],
        register: (uuid) => {
            return new Promise((res, rej) => {
                hd.responses[uuid] = { res, rej };
            });
        },
        respond: (err, data) => {
            return new Promise((res, rej) => {
                const response = hd.getCallback(data.callback_name)
                if (typeof response !== 'undefined') {
                    if (err) {
                        response.rej(err);
                        res('sended')
                        return;
                    }
                    response.res(data)
                    res('sended')
                    return;
                }
                rej('not found')
                return;
            });
        }
    }
    return hd;
}

exports.handler = handler;