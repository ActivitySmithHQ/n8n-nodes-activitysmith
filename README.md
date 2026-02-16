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

## Usage examples

### 1. Send Push Notifications from your workflow

Use `ActivitySmith` anywhere in your n8n workflow when you want to notify yourself or your team on iOS.

Common cases:
- Mid-workflow checkpoint
- Error/alert branch
- Final success/failure notification

1. Add `ActivitySmith` node at the step where you want the push notification.
2. Set operation to `Send Push Notification`.
3. Set required fields:
   `Title` and `Message`
4. Optionally set:
   `Subtitle`
5. Optionally set:
   `Channels (Optional)` to route to specific users/devices.
   Leave empty to use API key scope recipients.

Example values:
- `Title` -> `Workflow finished`
- `Message` -> `{{$json.statusMessage}}`
- `Channels (Optional)` -> `engineering,ios-builds`

### 2. Track n8n workflow progress with Live Activities

Use Live Activities to show workflow progress on iOS from start to finish.

1. At workflow start:
   Add `ActivitySmith` node with `Start Live Activity`.
   Set `Title`, `Subtitle`, `Number of Steps`, `Current Step`, `Type`.
   Optionally set `Channels (Optional)` to target specific users/devices.
2. Save returned `activity_id` for later steps (for example in Data Store).
3. At important workflow steps:
   Add `ActivitySmith` node with `Update Live Activity`.
   Reuse `activity_id` and update `Current Step` / `Subtitle`.
4. At workflow completion:
   Add `ActivitySmith` node with `End Live Activity`.
   Reuse `activity_id` and set final `Current Step`.

Suggested mapping:
- `Title` -> `{{$workflow.name}}`
- `Subtitle` -> `{{$json.phase}}`
- `Current Step` -> `{{$json.step}}`
- `Number of Steps` -> `{{$json.totalSteps}}`
- `Channels (Optional)` -> `engineering,ios-builds`

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

### 0.1.2

Added optional `Channels` input for push notifications and live activity start.

### 0.1.1

Added workflow usage examples and improved push notification sample payload.

### 0.1.0

Initial release with push notification and Live Activity actions.
