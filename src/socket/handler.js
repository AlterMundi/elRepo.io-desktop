const handler = () => {
    const hd = {
        out: 0,
        in: 0,
        responses: {},
        getLast: ()=> hd.responses[hd.in + 1],
        register: () => {
            hd.out += 1;
            return new Promise((res, rej) => {
                hd.responses[hd.out] = { res, rej };
            });
        },
        respond: (err, data) => {
            return new Promise((res, rej) => {
                const response = hd.getLast()
                if (typeof response !== 'undefined') {
                    hd.in += 1;
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