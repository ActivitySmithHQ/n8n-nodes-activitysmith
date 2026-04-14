import type { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { ApplicationError } from 'n8n-workflow';

import {
	buildLiveAction,
	buildMetrics,
	buildPushActions,
	getTrimmedString,
	parseOptionalInteger,
	parseOptionalNumber,
	parseOptionalStringList,
} from './ActivitySmithParameterUtils';

type ActivitySmithOperation =
	| 'sendPushNotification'
	| 'startLiveActivity'
	| 'updateLiveActivity'
	| 'endLiveActivity'
	| 'streamLiveActivity'
	| 'endLiveActivityStream';

type LiveActivityType = 'metrics' | 'progress' | 'segmented_progress';

const buildPushNotificationBody = (
	context: IExecuteFunctions,
	itemIndex: number,
): IDataObject => {
	const title = context.getNodeParameter('title', itemIndex) as string;
	const message = context.getNodeParameter('message', itemIndex, '') as string;
	const subtitle = context.getNodeParameter('subtitle', itemIndex, '') as string;
	const channels = parseOptionalStringList(
		context.getNodeParameter('channels', itemIndex, '') as string,
		'Channels (Optional)',
	);
	const actions = buildPushActions(context, itemIndex);

	const body: IDataObject = {
		title,
	};

	if (message !== '') {
		body.message = message;
	}

	if (subtitle !== '') {
		body.subtitle = subtitle;
	}

	const media = context.getNodeParameter('media', itemIndex, '') as string;
	const trimmedMedia = getTrimmedString(media);
	if (trimmedMedia !== '') {
		body.media = trimmedMedia;
	}

	const redirection = context.getNodeParameter('redirection', itemIndex, '') as string;
	const trimmedRedirection = getTrimmedString(redirection);
	if (trimmedRedirection !== '') {
		body.redirection = trimmedRedirection;
	}

	if (actions !== undefined) {
		body.actions = actions;
	}

	if (body.media !== undefined && body.actions !== undefined) {
		throw new ApplicationError('Rich Media URL cannot be combined with Push Actions');
	}

	if (channels !== undefined) {
		body.target = { channels };
	}

	return body;
};

const buildLiveContentState = (
	context: IExecuteFunctions,
	itemIndex: number,
): IDataObject => {
	const title = context.getNodeParameter('title', itemIndex) as string;
	const subtitle = context.getNodeParameter('subtitle', itemIndex, '') as string;
	const activityType = context.getNodeParameter('activityType', itemIndex) as LiveActivityType;
	const color = context.getNodeParameter('accentColor', itemIndex, '') as string;
	const contentState: IDataObject = {
		title,
		type: activityType,
	};

	if (subtitle !== '') {
		contentState.subtitle = subtitle;
	}

	if (color !== '' && activityType !== 'metrics') {
		contentState.color = color;
	}

	if (activityType === 'segmented_progress') {
		const currentStep = context.getNodeParameter('currentStep', itemIndex) as number;
		const numberOfSteps = context.getNodeParameter('numberOfSteps', itemIndex) as number;
		const stepColor = context.getNodeParameter('stepColor', itemIndex, '') as string;

		contentState.current_step = currentStep;
		contentState.number_of_steps = numberOfSteps;

		if (stepColor !== '') {
			contentState.step_color = stepColor;
		}

		return contentState;
	}

	if (activityType === 'progress') {
		const percentage = parseOptionalNumber(
			context.getNodeParameter('percentage', itemIndex, '') as string,
			'Percentage (Optional)',
		);
		const value = parseOptionalNumber(
			context.getNodeParameter('progressValue', itemIndex, '') as string,
			'Value (Optional)',
		);
		const upperLimit = parseOptionalNumber(
			context.getNodeParameter('upperLimit', itemIndex, '') as string,
			'Upper Limit (Optional)',
		);

		if (percentage === undefined && (value === undefined || upperLimit === undefined)) {
			throw new ApplicationError(
				'Progress Live Activities require either Percentage or both Value and Upper Limit',
			);
		}

		if (percentage !== undefined) {
			contentState.percentage = percentage;
		}

		if (value !== undefined) {
			contentState.value = value;
		}

		if (upperLimit !== undefined) {
			contentState.upper_limit = upperLimit;
		}

		return contentState;
	}

	const metrics = buildMetrics(context, itemIndex);
	if (metrics === undefined) {
		throw new ApplicationError('Metrics Live Activities require at least one metric');
	}

	contentState.metrics = metrics;
	return contentState;
};

const buildLiveActivityBody = (
	context: IExecuteFunctions,
	itemIndex: number,
	operation: Exclude<ActivitySmithOperation, 'sendPushNotification'>,
): IDataObject => {
	const body: IDataObject = {
		content_state: buildLiveContentState(context, itemIndex),
	};

	if (operation === 'updateLiveActivity' || operation === 'endLiveActivity') {
		body.activity_id = context.getNodeParameter('activityId', itemIndex) as string;
	}

	if (operation === 'startLiveActivity' || operation === 'streamLiveActivity') {
		const channels = parseOptionalStringList(
			context.getNodeParameter('channels', itemIndex, '') as string,
			'Channels (Optional)',
		);

		if (channels !== undefined) {
			body.target = { channels };
		}
	}

	const action = buildLiveAction(context, itemIndex);
	if (action !== undefined) {
		body.action = action;
	}

	if (operation === 'endLiveActivity' || operation === 'endLiveActivityStream') {
		const autoDismissMinutes = parseOptionalInteger(
			context.getNodeParameter('autoDismissMinutes', itemIndex, '') as string,
			'Auto Dismiss Minutes (Optional)',
		);

		if (autoDismissMinutes !== undefined) {
			(body.content_state as IDataObject).auto_dismiss_minutes = autoDismissMinutes;
		}
	}

	return body;
};

export const buildActivitySmithRequestOptions = (
	context: IExecuteFunctions,
	itemIndex: number,
): IHttpRequestOptions => {
	const operation = context.getNodeParameter('operation', itemIndex) as ActivitySmithOperation;
	const baseUrl = 'https://activitysmith.com/api';
	let method: IHttpRequestOptions['method'] = 'POST';
	let url = '';
	let body: IDataObject | undefined;

	switch (operation) {
		case 'sendPushNotification':
			url = `${baseUrl}/push-notification`;
			body = buildPushNotificationBody(context, itemIndex);
			break;
		case 'startLiveActivity':
		case 'updateLiveActivity':
		case 'endLiveActivity':
			url = `${baseUrl}/live-activity/${operation.replace('LiveActivity', '').toLowerCase()}`;
			body = buildLiveActivityBody(context, itemIndex, operation);
			break;
		case 'streamLiveActivity':
			method = 'PUT';
			url = `${baseUrl}/live-activity/stream/${encodeURIComponent(
				context.getNodeParameter('streamKey', itemIndex) as string,
			)}`;
			body = buildLiveActivityBody(context, itemIndex, operation);
			break;
		case 'endLiveActivityStream':
			method = 'DELETE';
			url = `${baseUrl}/live-activity/stream/${encodeURIComponent(
				context.getNodeParameter('streamKey', itemIndex) as string,
			)}`;
			body = buildLiveActivityBody(context, itemIndex, operation);
			break;
		default:
			throw new ApplicationError(`Unknown operation: ${String(operation)}`);
	}

	const requestOptions: IHttpRequestOptions = {
		method,
		url,
		json: true,
	};

	if (body !== undefined) {
		requestOptions.body = body;
	}

	return requestOptions;
};
