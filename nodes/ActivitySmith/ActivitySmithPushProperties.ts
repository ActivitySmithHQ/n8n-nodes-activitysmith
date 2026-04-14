import type { INodeProperties } from 'n8n-workflow';

const pushActionValues: INodeProperties[] = [
	{
		displayName: 'Action',
		name: 'type',
		type: 'options',
		default: '',
		options: [
			{ name: 'None', value: '' },
			{ name: 'Open URL', value: 'open_url' },
			{ name: 'Webhook', value: 'webhook' },
		],
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				type: ['open_url', 'webhook'],
			},
		},
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				type: ['open_url', 'webhook'],
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
];

export const activitySmithPushProperties: INodeProperties[] = [
	{
		displayName: 'Rich Media URL (Optional)',
		name: 'media',
		type: 'string',
		default: '',
		description: 'Cannot be combined with Push Actions',
		hint: 'Supports images, video and audio.',
		displayOptions: {
			show: {
				operation: ['sendPushNotification'],
			},
		},
	},
	{
		displayName: 'Redirection URL (Optional)',
		name: 'redirection',
		type: 'string',
		default: '',
		hint: 'Opened in browser on tap.',
		displayOptions: {
			show: {
				operation: ['sendPushNotification'],
			},
		},
	},
	{
		displayName: 'Actions (Optional, up to 4)',
		name: 'pushActions',
		placeholder: 'Add Action',
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
				values: pushActionValues,
			},
		],
	},
];
