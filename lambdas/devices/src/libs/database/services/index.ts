
import createDynamoDBClient from "../db";
import DeviceService from "./deviceService";

const { DEVICES_TABLE } = process.env;

const deviceService = new DeviceService(createDynamoDBClient(), DEVICES_TABLE);

export { deviceService };