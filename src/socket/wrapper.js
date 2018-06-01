const requestWrapper = (path, data) => {
    try {
        const plainRequest = JSON.stringify(data);
        return `${path}\n${plainRequest}\n`
    }
    catch (e) {
        throw new Error('Malformed json', data, e);
    }
}

exports.wrapper = requestWrapper;