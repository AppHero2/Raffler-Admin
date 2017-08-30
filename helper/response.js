Response = () => {
};

Response.send = (res, message) => {
   res.send(message);
   res.end();
   return; 
}

Response.render = (res, path, params) => {
    res.render(path, params);
}

Response.redirect= (res, path) => {
    res.redirect(path);
}

module.exports = Response;