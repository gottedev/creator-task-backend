const { app, data } = require("./index.js");
const port = process.env.PORT || 8000;

// Server
(async () => {
  await data();
  app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
  });
})();
