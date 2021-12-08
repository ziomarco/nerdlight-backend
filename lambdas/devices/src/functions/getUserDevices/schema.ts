export default {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: 'string' },
      mac: { type: 'string' },
      name: { type: 'string' },
      type: { type: 'string' },
      ownerId: { type: 'string' },
      creationDate: { type: 'string' },
      queues: { type: 'string' },
      lastAliveDate: { type: 'string' },
      isConnected: { type: 'string' },
    }
  }
} as const;
