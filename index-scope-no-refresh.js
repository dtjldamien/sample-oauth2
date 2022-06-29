const express = require("express");
const port = 8004;
const bodyParser = require("body-parser");
const router = express.Router();
var app = express();

// parse req body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router);

app.post("/token", function (req, res) {
    let expires_in = 60;
    let scope = req.body.scope;
    let access_token = Date.now() + expires_in * 1000;

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
    let res_body = JSON.stringify({
        access_token,
        expires_in,
        token_type: "Bearer",
    });
    console.log("res_body: ", res_body);
    res.send(res_body);
});

app.get("/check", function (req, res) {
    console.log("/check", "Received request");
    console.log("Token: ", req.headers.authorization);

    let token_split = req.headers.authorization.replace("Bearer ", "").split(".");
    let tokenDate = new Date(parseInt(token_split[0]));
    let scope = token_split[1];

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
