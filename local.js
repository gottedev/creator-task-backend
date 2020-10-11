const { appPromise } = require("./index.js");
const port = process.env.PORT || 8000;

(async () => {
  const app = await appPromise();
  app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
  });
})();
