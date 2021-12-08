import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { deviceService } from '@libs/database/services';
import { middyfy } from '@libs/lambda';
import { logError } from '@libs/logError';
import { DeleteDeviceAssociation } from '@libs/models/DeviceDTO';

import schema from './schema';

const deassociateDevice: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { mac } = event.body as unknown as DeleteDeviceAssociation;

  try {
    await deviceService.deleteDevice(mac, event.requestContext.authorizer.claims.sub);

    return formatJSONResponse({
      statusCode: 200,
      body: {
        message: `Device ${mac} deassociated`,
      }
    });
  } catch (e) {
    if (e.code === 'ConditionalCheckFailedException') {
      return formatJSONResponse({ statusCode: 403 });
    }
    logError(e);
    return formatJSONResponse({ statusCode: 500 });
  }
}

export const main = middyfy(deassociateDevice);
