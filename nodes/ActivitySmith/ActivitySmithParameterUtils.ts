import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ApplicationError } from 'n8n-workflow';

type ActionType = 'open_url' | 'webhook';
type WebhookMethod = 'GET' | 'POST';

export const getTrimmedString = (value: unknown): string =>
	typeof value === 'string' ? value.trim() : '';

export const isObject = (value: unknown): value is IDataObject =>
	value !== null && typeof value === 'object' && !Array.isArray(value);

export const parseOptionalInteger = (value: unknown, fieldName: string): number | undefined => {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}

	if (typeof value === 'number' && Number.isInteger(value)) {
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

export const parseOptionalNumber = (value: unknown, fieldName: string): number | undefined => {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}

	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === 'string') {
		const parsed = Number.parseFloat(value);
		if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
			return parsed;
		}
	}

	throw new ApplicationError(`${fieldName} must be a valid number`);
};

export const parseOptionalStringList = (value: unknown, fieldName: string): string[] | undefined => {
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

	throw new ApplicationError(`${fieldName} must be a comma-separated list`);
};

export const parseOptionalJsonObject = (value: unknown, fieldName: string): IDataObject | undefined => {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}

	if (isObject(value)) {
		return value;
	}

	if (typeof value === 'string') {
		try {
			const parsed = JSON.parse(value);
			if (isObject(parsed)) {
				return parsed;
			}
		} catch (error) {
			throw new ApplicationError(
				`${fieldName} must be a valid JSON object: ${(error as Error).message}`,
			);
		}
	}

	throw new ApplicationError(`${fieldName} must be a valid JSON object`);
};

export const getFixedCollectionEntries = (value: unknown, key: string): IDataObject[] => {
	if (!isObject(value)) {
		return [];
	}

	const entries = value[key];
	return Array.isArray(entries) ? (entries.filter(isObject) as IDataObject[]) : [];
};

const hasConfiguredValues = (value: IDataObject): boolean =>
	Object.values(value).some((entry) => {
		if (typeof entry === 'string') {
			return entry.trim().length > 0;
		}
		if (Array.isArray(entry)) {
			return entry.length > 0;
		}
		return entry !== undefined && entry !== null;
	});

export const buildActionFromObject = (value: IDataObject, fieldName: string): IDataObject | undefined => {
	if (!hasConfiguredValues(value)) {
		return undefined;
	}

	const title = getTrimmedString(value.title);
	const type = getTrimmedString(value.type);
	const url = getTrimmedString(value.url);

	if (title === '' || type === '' || url === '') {
		throw new ApplicationError(`${fieldName} requires Title, Type, and URL`);
	}

	const action: IDataObject = {
		title,
		type: type as ActionType,
		url,
	};

	if (type === 'webhook') {
		action.method = (getTrimmedString(value.method) || 'POST') as WebhookMethod;

		const body = parseOptionalJsonObject(value.bodyJson, `${fieldName} Body JSON`);
		if (body !== undefined) {
			action.body = body;
		}
	}

	return action;
};

export const buildPushActions = (
	context: IExecuteFunctions,
	itemIndex: number,
): IDataObject[] | undefined => {
	const rawActions = context.getNodeParameter('pushActions', itemIndex, {}) as IDataObject;
	const actions = getFixedCollectionEntries(rawActions, 'action')
		.map((entry, index) => buildActionFromObject(entry, `Push Action ${index + 1}`))
		.filter((entry): entry is IDataObject => entry !== undefined);

	if (actions.length === 0) {
		return undefined;
	}

	if (actions.length > 4) {
		throw new ApplicationError('Push Actions can contain at most 4 items');
	}

	return actions;
};

export const buildLiveAction = (
	context: IExecuteFunctions,
	itemIndex: number,
): IDataObject | undefined => {
	const rawAction = context.getNodeParameter('liveAction', itemIndex, {}) as IDataObject;
	return buildActionFromObject(rawAction, 'Live Activity Action');
};

export const buildAlert = (context: IExecuteFunctions, itemIndex: number): IDataObject | undefined => {
	const rawAlert = context.getNodeParameter('liveAlert', itemIndex, {}) as IDataObject;

	if (!hasConfiguredValues(rawAlert)) {
		return undefined;
	}

	const title = getTrimmedString(rawAlert.title);
	const body = getTrimmedString(rawAlert.body);

	if (title === '' && body === '') {
		return undefined;
	}

	const alert: IDataObject = {};

	if (title !== '') {
		alert.title = title;
	}

	if (body !== '') {
		alert.body = body;
	}

	return alert;
};

export const buildMetrics = (
	context: IExecuteFunctions,
	itemIndex: number,
): IDataObject[] | undefined => {
	const rawMetrics = context.getNodeParameter('metrics', itemIndex, {}) as IDataObject;
	const metrics = getFixedCollectionEntries(rawMetrics, 'metric').map((entry, index) => {
		const label = getTrimmedString(entry.label);
		const value = entry.value;

		if (label === '' || typeof value !== 'number' || !Number.isFinite(value)) {
			throw new ApplicationError(`Metric ${index + 1} requires a Label and numeric Value`);
		}

		const metric: IDataObject = {
			label,
			value,
		};

		const unit = getTrimmedString(entry.unit);
		if (unit !== '') {
			metric.unit = unit;
		}

		return metric;
	});

	return metrics.length > 0 ? metrics : undefined;
};
