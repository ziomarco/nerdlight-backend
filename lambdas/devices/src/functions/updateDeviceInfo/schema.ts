export default {
  type: "object",
  properties: {
    name: { type: "string" },
    type: { type: "string" },
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
