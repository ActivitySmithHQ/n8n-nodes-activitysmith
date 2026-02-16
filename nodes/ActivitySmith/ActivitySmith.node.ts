import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { ApplicationError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const colorOptions: INodePropertyOptions[] = [
	{ name: 'Lime', value: 'lime' },
	{ name: 'Green', value: 'green' },
	{ name: 'Cyan', value: 'cyan' },
	{ name: 'Blue', value: 'blue' },
	{ name: 'Purple', value: 'purple' },
	{ name: 'Magenta', value: 'magenta' },
	{ name: 'Red', value: 'red' },
	{ name: 'Orange', value: 'orange' },
	{ name: 'Yellow', value: 'yellow' },
];

const parseOptionalInteger = (value: unknown, fieldName: string): number | undefined => {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}

	if (typeof value === 'number') {
		return value;
	}

	if (typeof value === 'string') {
		const parsed = Number.parseInt(value, 10);
		if (!Number.isNaN(parsed)) {
			return parsed;
		}
	}

	throw new ApplicationError(`${fieldName} must be a valid integer`);
};

const parseOptionalStringList = (value: unknown, fieldName: string): string[] | undefined => {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}

	if (Array.isArray(value)) {
		const normalized = value
			.map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
			.filter((entry) => entry.length > 0);
		return normalized.length > 0 ? normalized : undefined;
	}

	if (typeof value === 'string') {
		const normalized = value
			.split(/[\n,]/)
			.map((entry) => entry.trim())
			.filter((entry) => entry.length > 0);
		return normalized.length > 0 ? normalized : undefined;
	}

	throw new ApplicationError(`${fieldName} must be a comma-separated list of channel slugs`);
};

export class ActivitySmith implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ActivitySmith',
		name: 'activitySmith',
		icon: { light: 'file:activitysmith.svg', dark: 'file:activitysmith.dark.svg' },
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Send push notifications and manage Live Activities',
		defaults: {
			name: 'ActivitySmith',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'activitySmithApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'sendPushNotification',
				options: [
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
						name: 'Update Live Activity',
						value: 'updateLiveActivity',
						description: 'Update an existing Live Activity',
						action: 'Update a live activity',
					},
					{
						name: 'End Live Activity',
						value: 'endLiveActivity',
						description: 'End an existing Live Activity',
						action: 'End a live activity',
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
						operation: ['sendPushNotification', 'startLiveActivity', 'updateLiveActivity', 'endLiveActivity'],
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
						operation: ['sendPushNotification', 'startLiveActivity', 'updateLiveActivity', 'endLiveActivity'],
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
						operation: ['sendPushNotification', 'startLiveActivity'],
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
				displayName: 'Current Step',
				name: 'currentStep',
				type: 'number',
				typeOptions: {
					minValue: 1,
					numberPrecision: 0,
				},
				required: true,
				default: 1,
				displayOptions: {
					show: {
						operation: ['startLiveActivity', 'updateLiveActivity', 'endLiveActivity'],
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
				required: true,
				default: 1,
				displayOptions: {
					show: {
						operation: ['startLiveActivity'],
					},
				},
			},
			{
				displayName: 'Number of Steps (Optional)',
				name: 'numberOfStepsOptional',
				type: 'string',
				default: '',
				placeholder: 'Leave empty to omit',
				displayOptions: {
					show: {
						operation: ['updateLiveActivity', 'endLiveActivity'],
					},
				},
			},
			{
				displayName: 'Type',
				name: 'activityType',
				type: 'options',
				required: true,
				default: 'segmented_progress',
				displayOptions: {
					show: {
						operation: ['startLiveActivity'],
					},
				},
				options: [{ name: 'Segmented Progress', value: 'segmented_progress' }],
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'options',
				default: '',
				displayOptions: {
					show: {
						operation: ['startLiveActivity', 'updateLiveActivity', 'endLiveActivity'],
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
						operation: ['startLiveActivity', 'updateLiveActivity', 'endLiveActivity'],
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
						operation: ['endLiveActivity'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const title = this.getNodeParameter('title', itemIndex) as string;
				const subtitle = this.getNodeParameter('subtitle', itemIndex, '') as string;
				const color = this.getNodeParameter('color', itemIndex, '') as string;
				const stepColor = this.getNodeParameter('stepColor', itemIndex, '') as string;

				let endpoint = '';
				let body: IDataObject = {};

				if (operation === 'sendPushNotification') {
					const message = this.getNodeParameter('message', itemIndex, '') as string;
					const channels = parseOptionalStringList(
						this.getNodeParameter('channels', itemIndex, '') as string,
						'Channels (Optional)',
					);
					body = {
						title,
					};
					if (message !== '') {
						body.message = message;
					}
					if (subtitle !== '') {
						body.subtitle = subtitle;
					}
					if (channels !== undefined) {
						body.target = { channels };
					}
					endpoint = '/push-notification';
				} else if (operation === 'startLiveActivity') {
					const numberOfSteps = this.getNodeParameter('numberOfSteps', itemIndex) as number;
					const currentStep = this.getNodeParameter('currentStep', itemIndex) as number;
					const activityType = this.getNodeParameter('activityType', itemIndex) as string;
					const channels = parseOptionalStringList(
						this.getNodeParameter('channels', itemIndex, '') as string,
						'Channels (Optional)',
					);

					const contentState: IDataObject = {
						title,
						number_of_steps: numberOfSteps,
						current_step: currentStep,
						type: activityType,
					};

					if (subtitle !== '') {
						contentState.subtitle = subtitle;
					}
					if (color !== '') {
						contentState.color = color;
					}
					if (stepColor !== '') {
						contentState.step_color = stepColor;
					}

					body = { content_state: contentState };
					if (channels !== undefined) {
						body.target = { channels };
					}
					endpoint = '/live-activity/start';
				} else if (operation === 'updateLiveActivity') {
					const activityId = this.getNodeParameter('activityId', itemIndex) as string;
					const currentStep = this.getNodeParameter('currentStep', itemIndex) as number;
					const numberOfStepsOptional = this.getNodeParameter(
						'numberOfStepsOptional',
						itemIndex,
						'',
					) as string;

					const contentState: IDataObject = {
						title,
						current_step: currentStep,
					};

					if (subtitle !== '') {
						contentState.subtitle = subtitle;
					}
					if (color !== '') {
						contentState.color = color;
					}
					if (stepColor !== '') {
						contentState.step_color = stepColor;
					}

					const parsedNumberOfSteps = parseOptionalInteger(
						numberOfStepsOptional,
						'Number of Steps (Optional)',
					);
					if (parsedNumberOfSteps !== undefined) {
						contentState.number_of_steps = parsedNumberOfSteps;
					}

					body = {
						activity_id: activityId,
						content_state: contentState,
					};
					endpoint = '/live-activity/update';
				} else if (operation === 'endLiveActivity') {
					const activityId = this.getNodeParameter('activityId', itemIndex) as string;
					const currentStep = this.getNodeParameter('currentStep', itemIndex) as number;
					const numberOfStepsOptional = this.getNodeParameter(
						'numberOfStepsOptional',
						itemIndex,
						'',
					) as string;
					const autoDismissMinutes = this.getNodeParameter('autoDismissMinutes', itemIndex, '') as string;

					const contentState: IDataObject = {
						title,
						current_step: currentStep,
					};

					if (subtitle !== '') {
						contentState.subtitle = subtitle;
					}
					if (color !== '') {
						contentState.color = color;
					}
					if (stepColor !== '') {
						contentState.step_color = stepColor;
					}

					const parsedNumberOfSteps = parseOptionalInteger(
						numberOfStepsOptional,
						'Number of Steps (Optional)',
					);
					if (parsedNumberOfSteps !== undefined) {
						contentState.number_of_steps = parsedNumberOfSteps;
					}

					const parsedAutoDismissMinutes = parseOptionalInteger(
						autoDismissMinutes,
						'Auto Dismiss Minutes (Optional)',
					);
					if (parsedAutoDismissMinutes !== undefined) {
						contentState.auto_dismiss_minutes = parsedAutoDismissMinutes;
					}

					body = {
						activity_id: activityId,
						content_state: contentState,
					};
					endpoint = '/live-activity/end';
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
						itemIndex,
					});
				}

				const requestOptions: IHttpRequestOptions = {
					method: 'POST',
					url: `https://activitysmith.com/api${endpoint}`,
					body,
					json: true,
				};

				const responseData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'activitySmithApi',
					requestOptions,
				);

				if (responseData !== null && typeof responseData === 'object' && !Array.isArray(responseData)) {
					returnData.push({
						json: responseData as IDataObject,
						pairedItem: { item: itemIndex },
					});
				} else {
					returnData.push({
						json: { response: responseData as string },
						pairedItem: { item: itemIndex },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: this.getInputData(itemIndex)[0].json,
						error,
						pairedItem: { item: itemIndex },
					});
					continue;
				}
				if (error instanceof NodeOperationError) {
					throw error;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
			}
		}

		return [returnData];
	}
}
