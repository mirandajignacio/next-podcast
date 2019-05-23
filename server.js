const next = require("next");
const routes = require("./routes");
const app = next({ dev: process.env.NODE_ENV !== "production" });
const hanlder = routes.getRequestHandler(app);
const port = process.env.PORT || 3000;

const { createServer } = require("http");
app.prepare().then(() => {
  createServer(hanlder).listen(port);
});
