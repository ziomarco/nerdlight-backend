const AWS = require("aws-sdk");
const mylocalAuthProxyFn = async (event, context) => {

    // const lambda = new AWS.Lambda();
    // const result = await lambda.invoke({
    //     FunctionName: "my-shared-lambda-authorizer",
    //     InvocationType: "RequestResponse",
    //     Payload: JSON.stringify(event),
    // }).promise();

    // if (result.StatusCode === 200) {
    //     return JSON.parse(result.Payload);
    // }
    return { result: 'ok', principalId: 'user' };
};

module.exports = { mylocalAuthProxyFn };