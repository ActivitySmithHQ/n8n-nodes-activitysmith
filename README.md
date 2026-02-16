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

### 1. Webhook to push notification

Use this when another system posts alerts into n8n.

1. Add `Webhook` node.
2. Set method to `POST` and path to `activitysmith-alert`.
3. Add `ActivitySmith` node.
4. Set operation to `Send Push Notification`.
5. Map fields:
   `Title` -> `{{$json.body.title}}`
   `Message` -> `{{$json.body.message}}`
   `Channels (Optional)` -> `{{$json.body.channels}}`
6. Activate the workflow.

Example request:

```bash
curl -X POST 'https://<your-n8n-host>/webhook/activitysmith-alert' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "💸 New subscription",
    "message": "New user subscribed to Pro: john@example.com",
    "channels": ["marketing", "sales"]
  }'
```

### 2. GitHub CI workflow to Live Activity lifecycle

Use this to mirror CI progress on iOS Live Activities.

1. Add `GitHub Trigger` node for workflow run events.
2. Add `Switch` node on workflow status (`queued`, `in_progress`, `completed`).
3. On `queued`:
   Add `ActivitySmith` node with `Start Live Activity`.
   Save returned `activity_id` in `Data Store` keyed by GitHub run ID.
4. On `in_progress`:
   Load saved `activity_id` from `Data Store`.
   Add `ActivitySmith` node with `Update Live Activity`.
5. On `completed`:
   Load saved `activity_id`.
   Add `ActivitySmith` node with `End Live Activity`.
   Optionally set `Auto Dismiss Minutes` to `0` for immediate dismiss.

Suggested field mapping:
`Title` -> `{{$json.repository.full_name}} CI`
`Subtitle` -> `{{$json.workflow_run.status}}`
`Channels (Optional)` -> `engineering,ios-builds`
`Current Step` -> map from CI phase (for example 1=start, 2=test, 3=deploy, 4=done)
`Number of Steps` -> `4`

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
