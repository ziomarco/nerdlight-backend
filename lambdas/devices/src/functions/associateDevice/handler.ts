import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { deviceService } from '@libs/database/services';
import { middyfy } from '@libs/lambda';
import { logError } from '@libs/logError';
import { AssociateDevice } from '@libs/models/DeviceDTO';
import { v4 } from 'uuid';

import schema from './schema';

const associateDevice: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { name, type, mac, queues } = event.body as AssociateDevice;

  try {
    await deviceService.createDevice({
      id: v4(),
      creationDate: new Date().toISOString(),
      isConnected: false,
      lastAliveDate: null,
      ownerId: event.requestContext.authorizer.claims.sub,
      queues,
      mac,
      name,
      type,
    });

    return formatJSONResponse({
      statusCode: 200,
      body: { message: `Device ${name} associated` }
    });
  } catch (e) {
    if (e.code === 'ConditionalCheckFailedException') {
      return formatJSONResponse({ statusCode: 409 });
    }
    logError(e);
    return formatJSONResponse({ statusCode: 500 });
  }
}

export const main = middyfy(associateDevice);
