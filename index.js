const express = require("express");
const port = 8000;
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const router = express.Router();
var app = express();

// parse req body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router);

app.post("/token", function (req, res) {
    expires_in = 60;
    access_token = Date.now() + expires_in * 1000;

    if (req.body.grant_type === "client_credentials") {
        console.log(
            "/token",
            "Acquired tokens, will expire on ",
            new Date(access_token)
        );
    } else if (req.body.grant_type === "refresh_token") {
        console.log(
            "/token",
            "Refreshed tokens, will expire on ",
            new Date(access_token)
        );
    } else {
        res.sendStatus(400); // bad input
    }

    res_body = JSON.stringify({
        access_token,
        refresh_token: "refresh_token",
        expires_in,
        token_type: "Bearer",
    });
    console.log("res_body: ", res_body);
    res.send(res_body);
});

app.get("/check", function (req, res) {
    console.log("/check", "Received request");
    console.log("Token: ", req.headers.authorization);

    token_split = req.headers.authorization.replace("Bearer ", "");
    tokenDate = new Date(parseInt(token_split));

    if (Date.now() > tokenDate) {
        console.log("Token has expired, returning 401");
        res.sendStatus(401);
    } else {
        console.log("Token accepted");
        res.send(JSON.stringify({ status: "ok" }));
    }
});

// create multipart form endpoint
app.post('/multipart', upload.single('file'), (req, res) => {
    console.log("/multipart headers:" , req.headers);
    res.send(JSON.stringify({ req_headers: req.headers }));
});

app.get('/check-headers', (req, res) => {
    console.log("/check-headers headers:" , req.headers);
    res.send(JSON.stringify({ req_headers: req.headers }));
});

app.get('/test-content-type', function (req, res) {
    console.log("/test-content-type headers:", req.headers);
    if (req.headers['content-type'] === 'application/json') {
        res.sendStatus(400);
    } else {
        res.send(JSON.stringify({ status: "ok" }));
    }
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
    var route,
        routes = [];
    app._router.stack.forEach(function (middleware) {
        if (middleware.route) {
            // routes registered directly on the app
            routes.push(middleware.route);
        } else if (middleware.name === "router") {
            // router middleware
            middleware.handle.stack.forEach(function (handler) {
                route = handler.route;
                route && routes.push(route);
            });
        }
    });
    console.log(routes);
});
