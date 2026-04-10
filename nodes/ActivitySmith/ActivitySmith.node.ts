import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { ApplicationError, NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { activitySmithProperties } from './ActivitySmithDescription';
import { buildActivitySmithRequestOptions } from './ActivitySmithRequestBuilder';

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
		properties: activitySmithProperties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const requestOptions = buildActivitySmithRequestOptions(this, itemIndex);
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
						json: items[itemIndex].json,
						error,
						pairedItem: { item: itemIndex },
					});
					continue;
				}

				if (error instanceof NodeApiError || error instanceof NodeOperationError) {
					throw error;
				}

				if (error instanceof ApplicationError) {
					throw new NodeOperationError(this.getNode(), error, { itemIndex });
				}

				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
			}
		}

		return [returnData];
	}
}
