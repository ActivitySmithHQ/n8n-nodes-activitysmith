import type { INodeProperties } from 'n8n-workflow';

export const activitySmithStreamProperties: INodeProperties[] = [
	{
		displayName: 'Final Stream Content State JSON',
		name: 'finalContentStateJson',
		type: 'string',
		typeOptions: {
			rows: 6,
		},
		default: '',
		placeholder:
			'{\n  "title": "Deployment finished",\n  "type": "segmented_progress",\n  "current_step": 4,\n  "number_of_steps": 4\n}',
		description: 'Optional raw content_state object sent when ending a managed stream',
		displayOptions: {
			show: {
				operation: ['endLiveActivityStream'],
			},
		},
	},
	{
		displayName: 'Final Stream Action JSON',
		name: 'finalActionJson',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		placeholder:
			'{\n  "title": "Open Dashboard",\n  "type": "open_url",\n  "url": "https://ops.example.com"\n}',
		description: 'Optional raw action object sent when ending a managed stream',
		displayOptions: {
			show: {
				operation: ['endLiveActivityStream'],
			},
		},
	},
	{
		displayName: 'Final Stream Alert JSON',
		name: 'finalAlertJson',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		placeholder: '{\n  "title": "Deployment complete",\n  "body": "All checks passed"\n}',
		description: 'Optional raw alert object sent when ending a managed stream',
		displayOptions: {
			show: {
				operation: ['endLiveActivityStream'],
			},
		},
	},
];
