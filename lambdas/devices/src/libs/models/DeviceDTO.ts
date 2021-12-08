import Device from "./Device";

export interface AssociateDevice extends Omit<Device, 'id' | 'creationDate'> {}
export interface DeleteDeviceAssociation extends Pick<Device, 'mac' | 'id'> {}