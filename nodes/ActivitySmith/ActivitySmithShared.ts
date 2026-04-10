import type { INodePropertyOptions } from 'n8n-workflow';

export const colorOptions: INodePropertyOptions[] = [
	{ name: 'Blue', value: 'blue' },
	{ name: 'Cyan', value: 'cyan' },
	{ name: 'Green', value: 'green' },
	{ name: 'Lime', value: 'lime' },
	{ name: 'Magenta', value: 'magenta' },
	{ name: 'Orange', value: 'orange' },
	{ name: 'Purple', value: 'purple' },
	{ name: 'Red', value: 'red' },
	{ name: 'Yellow', value: 'yellow' },
];

export const liveActivityTypeOptions: INodePropertyOptions[] = [
	{
		name: 'Metrics',
		value: 'metrics',
		description: 'Show a compact set of live metrics',
	},
	{
		name: 'Progress',
		value: 'progress',
		description: 'Show continuous progress as percentage or value/limit',
	},
	{
		name: 'Segmented Progress',
		value: 'segmented_progress',
		description: 'Show step-based progress with discrete segments',
	},
];

export const liveActivityOperations = [
	'startLiveActivity',
	'updateLiveActivity',
	'endLiveActivity',
	'streamLiveActivity',
];
