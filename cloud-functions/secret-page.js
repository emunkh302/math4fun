exports.handler = function (event, context, callback) {
  const secretContent = `
        <h3> Welcome to Secret Page</h3>
        <p>this is for registered <strong>user</strong> only page</p>
    `;

  let body;
  if (event.body) {
    body = JSON.parse(event.body);
  } else {
    body = {};
  }

  if (body.password == "MyPassword") {
    callback(null, {
      statusCode: 200,
      body: secretContent,
    });
  } else {
    callback(null, {
      statusCode: 404,
    });
  }
};
