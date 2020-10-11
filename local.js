const { appPromise, data } = require("./index.js");
const port = process.env.PORT || 8000;

// Server

appPromise.then(function (app) {
  app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
  });
});
