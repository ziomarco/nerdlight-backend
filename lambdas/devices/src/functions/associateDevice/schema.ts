export default {
  type: "object",
  properties: {
    id: { type: "string" },
    mac: { type: "string" },
    name: { type: "string" },
    type: { type: "string" },
    ownerId: { type: "string" },
    creationDate: { type: "string" },
    queues: { type: "array", items: { type: "string" } },
    lastAliveDate: { type: "string" },
    isConnected: { type: "boolean" },
  },
  required: [
    'mac',
    'name',
    'type'
  ]
} as const;
