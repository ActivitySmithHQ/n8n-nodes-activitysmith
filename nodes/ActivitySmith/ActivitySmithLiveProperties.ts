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
		displayName: 'Number of Steps (Optional)',
		name: 'numberOfSteps',
		type: 'string',
		default: '',
		placeholder: 'Leave empty to omit',
		description:
			'Required when starting segmented progress. For stream updates, include it the first time you use a stream key.',
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
		displayName: 'Metrics',
		name: 'metrics',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Metric',
		},
		default: {},
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
		default: '',
		displayOptions: {
			show: {
				operation: liveActivityOperations,
			},
		},
		options: [{ name: 'Default (Blue)', value: '' }, ...colorOptions],
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
		displayName: 'Completed Step Accents (Optional)',
		name: 'completedStepAccents',
		type: 'string',
		default: '',
		placeholder: 'yellow, orange, green',
		description: 'Comma-separated color slugs for completed steps',
		displayOptions: {
			show: {
				operation: liveActivityOperations,
				activityType: ['segmented_progress'],
			},
		},
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
				operation: ['endLiveActivity'],
			},
		},
	},
	{
		displayName: 'Live Activity Action',
		name: 'liveAction',
		type: 'collection',
		default: {},
		displayOptions: {
			show: {
				operation: liveActivityOperations,
			},
		},
		options: [
			{
				displayName: 'Body JSON',
				name: 'bodyJson',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: '{\n  "job_id": "deploy-123"\n}',
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
	{
		displayName: 'Live Activity Alert',
		name: 'liveAlert',
		type: 'collection',
		default: {},
		description: 'Optional alert shown alongside start or stream updates',
		displayOptions: {
			show: {
				operation: ['startLiveActivity', 'streamLiveActivity'],
			},
		},
		options: [
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
		],
	},
];
