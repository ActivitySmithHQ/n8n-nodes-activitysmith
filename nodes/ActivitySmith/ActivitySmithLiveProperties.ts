import type { INodeProperties } from 'n8n-workflow';

import { colorOptions, liveActivityOperations } from './ActivitySmithShared';

export const activitySmithLiveProperties: INodeProperties[] = [
	{
		displayName: 'Current Step',
		name: 'currentStep',
		type: 'number',
		typeOptions: {
			minValue: 1,
			numberPrecision: 0,
		},
		default: 1,
		displayOptions: {
			show: {
				operation: liveActivityOperations,
				activityType: ['segmented_progress'],
			},
		},
	},
	{
		displayName: 'Number of Steps',
		name: 'numberOfSteps',
		type: 'number',
		typeOptions: {
			minValue: 1,
			numberPrecision: 0,
		},
		default: 3,
		displayOptions: {
			show: {
				operation: liveActivityOperations,
				activityType: ['segmented_progress'],
			},
		},
	},
	{
		displayName: 'Percentage (Optional)',
		name: 'percentage',
		type: 'string',
		default: '',
		placeholder: '42',
		description: 'Progress percentage from 0 to 100. Takes precedence over Value + Upper Limit.',
		displayOptions: {
			show: {
				operation: liveActivityOperations,
				activityType: ['progress'],
			},
		},
	},
	{
		displayName: 'Value (Optional)',
		name: 'progressValue',
		type: 'string',
		default: '',
		placeholder: '210',
		description: 'Current progress value. Use together with Upper Limit when Percentage is omitted.',
		displayOptions: {
			show: {
				operation: liveActivityOperations,
				activityType: ['progress'],
			},
		},
	},
	{
		displayName: 'Upper Limit (Optional)',
		name: 'upperLimit',
		type: 'string',
		default: '',
		placeholder: '500',
		description: 'Maximum progress value. Use together with Value when Percentage is omitted.',
		displayOptions: {
			show: {
				operation: liveActivityOperations,
				activityType: ['progress'],
			},
		},
	},
	{
		displayName: 'Metrics (up to 2)',
		name: 'metrics',
		type: 'fixedCollection',
		placeholder: 'Add Metric',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Metric',
			maxAllowedFields: 2,
		},
		default: {
			metric: [
				{
					label: '',
					unit: '',
					value: 0,
				},
			],
		},
		displayOptions: {
			show: {
				operation: liveActivityOperations,
				activityType: ['metrics'],
			},
		},
		options: [
			{
				displayName: 'Metric',
				name: 'metric',
				values: [
					{
						displayName: 'Label',
						name: 'label',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Unit',
						name: 'unit',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'number',
						default: 0,
					},
				],
			},
		],
	},
	{
		displayName: 'Color',
		name: 'accentColor',
		type: 'options',
		default: 'blue',
		displayOptions: {
			show: {
				operation: liveActivityOperations,
				activityType: ['segmented_progress', 'progress'],
			},
		},
		options: colorOptions,
	},
	{
		displayName: 'Step Color',
		name: 'stepColor',
		type: 'options',
		default: '',
		displayOptions: {
			show: {
				operation: liveActivityOperations,
				activityType: ['segmented_progress'],
			},
		},
		options: [{ name: 'Inherit Color', value: '' }, ...colorOptions],
	},
	{
		displayName: 'Auto Dismiss Minutes (Optional)',
		name: 'autoDismissMinutes',
		type: 'string',
		default: '',
		placeholder: 'Leave empty to use backend default (3)',
		description: 'Set 0 for immediate dismissal',
		displayOptions: {
			show: {
				operation: ['endLiveActivity', 'endLiveActivityStream'],
			},
		},
	},
	{
		displayName: 'Action',
		name: 'liveActionType',
		type: 'options',
		default: '',
		displayOptions: {
			show: {
				operation: liveActivityOperations,
			},
		},
		options: [
			{ name: 'None', value: '' },
			{ name: 'Open URL', value: 'open_url' },
			{ name: 'Webhook', value: 'webhook' },
		],
	},
	{
		displayName: 'Title',
		name: 'liveActionTitle',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: liveActivityOperations,
				liveActionType: ['open_url', 'webhook'],
			},
		},
	},
	{
		displayName: 'URL',
		name: 'liveActionUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: liveActivityOperations,
				liveActionType: ['open_url', 'webhook'],
			},
		},
	},
	{
		displayName: 'Method',
		name: 'liveActionMethod',
		type: 'options',
		default: 'POST',
		displayOptions: {
			show: {
				operation: liveActivityOperations,
				liveActionType: ['webhook'],
			},
		},
		options: [
			{ name: 'GET', value: 'GET' },
			{ name: 'POST', value: 'POST' },
		],
	},
	{
		displayName: 'Body JSON',
		name: 'liveActionBodyJson',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		placeholder: '{\n  "job_id": "deploy-123"\n}',
		displayOptions: {
			show: {
				operation: liveActivityOperations,
				liveActionType: ['webhook'],
			},
		},
	},
];
