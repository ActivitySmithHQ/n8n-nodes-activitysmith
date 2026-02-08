# n8n-nodes-activitysmith

This is an n8n community node for ActivitySmith.

ActivitySmith lets you send push notifications and trigger Live Activities to your iOS devices paired with your ActivitySmith account.

## Installation

Follow the n8n community node installation guide:
https://docs.n8n.io/integrations/community-nodes/installation/

Package name:
`n8n-nodes-activitysmith`

## Operations

The `ActivitySmith` node supports:

- Send Push Notification
- Start Live Activity
- Update Live Activity
- End Live Activity

## Credentials

Use the `ActivitySmith API` credential.

1. Get your API key from `https://activitysmith.com/app/keys`
2. In n8n, create credentials for `ActivitySmith API`
3. Paste your API key

Note: n8n credential testing sends one test push notification to verify your key.

## Compatibility

Tested with current n8n community node tooling via `@n8n/node-cli`.

## Development

```bash
npm run lint
npm run build
npm run dev
```

## Resources

- n8n community nodes docs: https://docs.n8n.io/integrations/#community-nodes
- ActivitySmith API docs: https://activitysmith.com/docs/api-reference/introduction

## Version history

### 0.1.0

Initial release with push notification and Live Activity actions.
