const awsServerlessExpress = require("aws-serverless-express");
const { appPromise } = require("./index");

module.exports.universal = async (event, context) => {
  const app = await appPromise();
  const server = awsServerlessExpress.createServer(app);
  return awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;
};
