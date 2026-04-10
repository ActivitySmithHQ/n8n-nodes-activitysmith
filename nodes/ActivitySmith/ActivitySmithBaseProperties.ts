import type { INodeProperties } from 'n8n-workflow';

import { liveActivityOperations, liveActivityTypeOptions } from './ActivitySmithShared';

export const activitySmithBaseProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'sendPushNotification',
		options: [
			{
				name: 'End Live Activity',
				value: 'endLiveActivity',
				description: 'End an existing Live Activity',
				action: 'End a live activity',
			},
			{
				name: 'End Live Activity Stream',
				value: 'endLiveActivityStream',
				description: 'End a managed Live Activity stream',
				action: 'End a live activity stream',
			},
			{
				name: 'Send Push Notification',
				value: 'sendPushNotification',
				description: 'Send a push notification to paired devices',
				action: 'Send a push notification',
			},
			{
				name: 'Start Live Activity',
				value: 'startLiveActivity',
				description: 'Start a Live Activity and return an activity ID',
				action: 'Start a live activity',
			},
			{
				name: 'Stream Live Activity',
				value: 'streamLiveActivity',
				description: 'Start or update a managed Live Activity stream',
				action: 'Stream a live activity',
			},
			{
				name: 'Update Live Activity',
				value: 'updateLiveActivity',
				description: 'Update an existing Live Activity',
				action: 'Update a live activity',
			},
		],
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				operation: ['sendPushNotification', ...liveActivityOperations],
			},
		},
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['sendPushNotification'],
			},
		},
	},
	{
		displayName: 'Subtitle',
		name: 'subtitle',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['sendPushNotification', ...liveActivityOperations],
			},
		},
	},
	{
		displayName: 'Channels (Optional)',
		name: 'channels',
		type: 'string',
		default: '',
		placeholder: 'devs, ops',
		description: 'Comma-separated channel slugs. Leave empty to use API key scope recipients.',
		displayOptions: {
			show: {
				operation: ['sendPushNotification', 'startLiveActivity', 'streamLiveActivity'],
			},
		},
	},
	{
		displayName: 'Activity ID',
		name: 'activityId',
		type: 'string',
		required: true,
		default: '',
		description: 'The activity_id returned by the Start Live Activity operation',
		displayOptions: {
			show: {
				operation: ['updateLiveActivity', 'endLiveActivity'],
			},
		},
	},
	{
		displayName: 'Stream Key',
		name: 'streamKey',
		type: 'string',
		required: true,
		default: '',
		description: 'Stable key that identifies the managed stream, such as a deployment or server name',
		displayOptions: {
			show: {
				operation: ['streamLiveActivity', 'endLiveActivityStream'],
			},
		},
	},
	{
		displayName: 'Activity Type',
		name: 'activityType',
		type: 'options',
		required: true,
		default: 'segmented_progress',
		description: 'Countdown is intentionally not exposed in this n8n node',
		displayOptions: {
			show: {
				operation: liveActivityOperations,
			},
		},
		options: liveActivityTypeOptions,
	},
];
