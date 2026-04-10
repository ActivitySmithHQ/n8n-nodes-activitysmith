import type { INodeProperties } from 'n8n-workflow';

export const activitySmithPushProperties: INodeProperties[] = [
	{
		displayName: 'Push Options',
		name: 'pushOptions',
		type: 'collection',
		default: {},
		displayOptions: {
			show: {
				operation: ['sendPushNotification'],
			},
		},
		options: [
			{
				displayName: 'Badge (Optional)',
				name: 'badge',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Media URL',
				name: 'media',
				type: 'string',
				default: '',
				description: 'HTTPS URL for image, audio, or video preview. Cannot be combined with Push Actions.',
			},
			{
				displayName: 'Payload JSON',
				name: 'payloadJson',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: '{\n  "workflowId": "123"\n}',
				description: 'Optional JSON object sent as custom payload',
			},
			{
				displayName: 'Redirection URL',
				name: 'redirection',
				type: 'string',
				default: '',
				description: 'HTTPS URL opened when the notification body is tapped',
			},
			{
				displayName: 'Sound',
				name: 'sound',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Push Actions',
		name: 'pushActions',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Push Action',
			maxAllowedFields: 4,
		},
		default: {},
		displayOptions: {
			show: {
				operation: ['sendPushNotification'],
			},
		},
		options: [
			{
				displayName: 'Action',
				name: 'action',
				values: [
					{
						displayName: 'Body JSON',
						name: 'bodyJson',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						placeholder: '{\n  "job_id": "reindex-42"\n}',
						displayOptions: {
							show: {
								type: ['webhook'],
							},
						},
					},
					{
						displayName: 'Method',
						name: 'method',
						type: 'options',
						default: 'POST',
						displayOptions: {
							show: {
								type: ['webhook'],
							},
						},
						options: [
							{ name: 'GET', value: 'GET' },
							{ name: 'POST', value: 'POST' },
						],
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						default: 'open_url',
						options: [
							{ name: 'Open URL', value: 'open_url' },
							{ name: 'Webhook', value: 'webhook' },
						],
					},
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
];
