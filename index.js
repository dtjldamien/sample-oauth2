const express = require("express");
const port = 8000;
const bodyParser = require("body-parser");
const router = express.Router();
var app = express();
var fs = require('fs');
var https = require('https');

// parse req body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router);

app.post("/token", function (req, res) {
    expires_in = 60;
    scope = req.body.scope;
    access_token = Date.now() + expires_in * 1000;

    //   let cert = req.socket.getPeerCertificate();
    //   console.log(cert);
    //   if (req.client.authorized) {
    //     console.log(
    //       `Certificate is VALID`
    //     );
    //   }
    //   // The Certificate is NOT VALID
    //   else if (cert.subject) {
    //     console.log(
    //       `Certificates are NOT VALID`
    //     );
    //     res.sendStatus(403);
    //   }
    //   // A Certificate was NOT PROVIDED
    //   else {
    //     console.log(`No Certificate provided by the client`);
    //     res.status(403).send(`Certificate Required`);
    //   }

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

    access_token += "." + scope;
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

    // let cert = req.socket.getPeerCertificate();
    // if (req.client.authorized) {
    //     console.log(
    //         `Certificate "${cert.subject.CN}" is VALID and was issued by "${cert.issuer.CN}"`
    //     );
    // } else if (cert.subject) {
    //     // The Certificate is NOT VALID
    //     console.log(
    //         `Certificates from "${cert.issuer.CN}" are NOT VALID. User "${cert.subject.CN}"`
    //     );
    //     res.sendStatus(403);
    // } else {
    //     // A Certificate was NOT PROVIDED
    //     console.log(`No Certificate provided by the client`);
    //     res.status(403).send(`Certificate Required`);
    // }

    token_split = req.headers.authorization.replace("Bearer ", "").split(".");
    tokenDate = new Date(parseInt(token_split[0]));
    scope = token_split[1];

    if (Date.now() > tokenDate) {
        console.log("Token has expired, returning 401");
        res.sendStatus(401);
    } else {
        // check scope
        if (scope === "check") {
            console.log("Token accepted");
            res.send(JSON.stringify({ status: "ok" }));
        } else {
            console.log("Token does not has required scope");
            res.sendStatus(403);
        }
    }
});

var options = {
    key: fs.readFileSync('certs/server.key'),
    cert: fs.readFileSync('certs/server.crt'),
    ca: fs.readFileSync('certs/client.crt'),

    requestCert: false
};

// https.createServer(options, app).listen(port, function () {
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
