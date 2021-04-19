const https = require("http");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

module.exports.hello = async (event) => {
  let dataString = "";
  const randomUserId = getRandomInt(0, 10000);

  const options = {
    hostname: "graphql-engine",
    port: 8080,
    path: "/v1/graphql",
    method: "POST",
    headers: {
      "x-hasura-user-id": randomUserId,
      "x-hasura-role": "user",
    },
  };

  const response = await new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);

      res.on("data", (d) => {
        process.stdout.write(d);
      });

      res.on("data", (chunk) => {
        dataString += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: 200,
          body: JSON.stringify(JSON.parse(dataString), null, 4),
        });
      });
    });

    req.on("error", (e) => {
      console.log(e);
      reject({
        statusCode: 500,
        body: "Something went wrong!",
      });
    });
    req.write(event.body);
    req.end();
  });

  return response;
};
