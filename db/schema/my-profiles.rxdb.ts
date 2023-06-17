const localProfileSchema = {
  version: 0,
  title: 'my profiles schema',
  description: 'describes the local users profiles',
  primaryKey: 'handle',
  type: 'object',
  properties: {
    account: {
      type: 'object',
      properties: {
        number: {
          type: 'integer',
        },
        address: {
          type: 'string',
          maxLength: '128',
        },
      },
    },
    handle: {
      type: 'string',
      maxLength: '128',
    },
    displayName: {
      type: 'string',
      maxLength: '128',
    },
    localAvatarUri: {
      type: 'string',
    },
    metadataUri: {
      type: 'string',
      maxLength: '128',
    },
    avatarUri: {
      type: 'string',
      maxLength: '128',
    },
  },
  required: ['account', 'handle', 'displayName'],
};

export default localProfileSchema;
