import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { deviceService } from '@libs/database/services';
import { middyfy } from '@libs/lambda';
import { logError } from '@libs/logError';
import { AssociateDevice } from '@libs/models/DeviceDTO';

import schema from './schema';

const updateDevice: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { name, type, queues, lastAliveDate, isConnected } = event.body as AssociateDevice;
  const { deviceId } = event.pathParameters;

  try {
    await deviceService.updateDevice(deviceId, {
      queues,
      name,
      type,
      lastAliveDate,
      isConnected,
    });

    return formatJSONResponse({
      statusCode: 200,
      body: { message: `Device ${name} updated` }
    });
  } catch (e) {
    if (e.code === 'ConditionalCheckFailedException') {
      return formatJSONResponse({ statusCode: 403 });
    }
    logError(e);
    return formatJSONResponse({ statusCode: 500 });
  }
}

export const main = middyfy(updateDevice);
