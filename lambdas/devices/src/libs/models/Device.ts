interface Device {
    id: string;
    mac: string;
    name: string;
    type: 'send' | 'receive'
    queues?: string[];
    ownerId: string;
    creationDate: string;
    lastAliveDate?: string;
    isConnected?: boolean;
}

export default Device;