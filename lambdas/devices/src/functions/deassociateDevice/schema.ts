export default {
  type: "object",
  properties: {
    id: { type: 'string' },
    mac: { type: 'string' }
  },
  required: ['id', 'mac']
} as const;
