import type {
	Icon,
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ActivitySmithApi implements ICredentialType {
	name = 'activitySmithApi';

	displayName = 'ActivitySmith API';

	icon: Icon = {
		light: 'file:../nodes/ActivitySmith/activitysmith.svg',
		dark: 'file:../nodes/ActivitySmith/activitysmith.dark.svg',
	};

	documentationUrl = 'https://activitysmith.com/docs/api-reference/introduction';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			required: true,
			default: '',
			description: 'Get your API key from https://activitysmith.com/app/keys',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://activitysmith.com/api',
			url: '/push-notification',
			method: 'POST',
			body: {
				title: 'ActivitySmith n8n connection test',
				message: 'Connection verified from n8n.',
			},
		},
	};
}
