import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { deviceService } from '@libs/database/services';
import { middyfy } from '@libs/lambda';
import { logError } from '@libs/logError';

import schema from './schema';

const getUserDevices: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  try {
    const devices = await deviceService.getAllUserDevices(event.requestContext.authorizer.claims.sub);

    return formatJSONResponse({
      statusCode: 200,
      body: devices,
    });
  } catch (e) {
    logError(e);
    return formatJSONResponse({ statusCode: 500 });
  }
}

export const main = middyfy(getUserDevices);
