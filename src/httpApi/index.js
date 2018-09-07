
const api = (url, port) => {
    return {
        request: (path, data, method) => fetch(url+':'+port+path, { method , body: data? JSON.stringify(data): undefined}   )
            .then(res => res.json())
    };
};

export default api;