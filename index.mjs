import dynamoose from 'dynamoose';
import crypto from 'crypto';

const Traffic = dynamoose.model('traffic', new dynamoose.Schema({
  id: String,
  referrer: String,
  timestamp: String,
  request_method: String,
  response_code: String,
  ip_address: String,
  user_agent: String
}));

const parseAttributes = (messageAttributes) => {
  return Object.keys(messageAttributes).reduce((acc, key) => {
    acc[key] = messageAttributes[key].Value
    return acc;
  }, {});
}

export const handler = async (event) => {
  let statusCode = 500;
  const {
    referrer,
    response_code,
    request_method,
    ip_address,
    timestamp,
  } = parseAttributes(event.Records[0].Sns.MessageAttributes);
  const user_agent = event.Records[0].Sns.Message;
  let responseBody = null;

  try {
    let record = await Traffic.create({
      id: crypto.randomUUID(),
      response_code,
      request_method,
      ip_address,
      timestamp,
      referrer,
      user_agent
    });
    statusCode = 200;
    responseBody = record;
  } catch (e) {
    console.log('TRAFFIC DATA ERROR', e);
    responseBody = { error: e };
  }
  console.log(responseBody);
  const response = {
    statusCode,
    body: JSON.stringify(responseBody),
  };
  return response;
};