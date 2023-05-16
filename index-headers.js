const express = require("express");
const port = 8005;
const bodyParser = require("body-parser");
const router = express.Router();
var app = express();

// parse req body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router);

app.get("/check", function (req, res) {
    console.log("/check", "Received request");
    console.log("Token accepted");
    // set headers
    res.setHeader("token", "test_token");
    res.setHeader("cookie", "test_cookie");
    res.send(JSON.stringify({ status: "ok" }));
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
