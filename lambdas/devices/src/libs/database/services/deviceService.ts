import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Device from "../../models/Device";

class DeviceService {
    constructor(
        private readonly docClient: DocumentClient,
        private readonly tableName: string
    ) { }

    async getAllUserDevices(uid: string): Promise<Device[]> {
        const result = await this.docClient
            .scan({
                TableName: this.tableName,
                FilterExpression: "ownerId = :uid",
                ExpressionAttributeValues: {
                    ":uid": uid
                }
            })
            .promise();

        return result.Items as Device[];
    }

    async createDevice(Device: Device): Promise<Device> {
        await this.docClient
            .put({
                TableName: this.tableName,
                Item: Device,
                ConditionExpression: "attribute_not_exists(mac)"
            })
            .promise();

        return Device;
    }

    async updateDevice(DeviceId: string, partialDevice: Partial<Device>): Promise<Device> {
        const updated = await this.docClient
            .update({
                TableName: this.tableName,
                Key: { DeviceId },
                UpdateExpression: "set isConnected = :isConnected, lastAliveDate = :lastAliveDate, name = :name, type = :type, queues = :queues",
                ConditionExpression: "(ownerId = :uid)",
                ExpressionAttributeValues: {
                    ":isConnected": partialDevice.isConnected,
                    ":lastAliveDate": partialDevice.lastAliveDate,
                    ":name": partialDevice.name,
                    ":type": partialDevice.type,
                    ":ownerId": partialDevice.ownerId,
                    ":queues": partialDevice.queues,
                    ":mac": partialDevice.mac,
                    ":uid": partialDevice.ownerId,
                },
                ReturnValues: "ALL_NEW",
            })
            .promise();

        return updated.Attributes as Device;
    }

    async deleteDevice(mac: string, ownerId: string) {
        return this.docClient
            .delete({
                TableName: this.tableName,
                Key: { mac },
                ConditionExpression: "(mac = :mac AND ownerId = :ownerId)",
                ExpressionAttributeValues: {
                    ":mac": mac,
                    ":ownerId": ownerId,
                }
            })
            .promise();
    }
}

export default DeviceService;