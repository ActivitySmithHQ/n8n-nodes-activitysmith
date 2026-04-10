import type { INodeProperties } from 'n8n-workflow';

import { activitySmithBaseProperties } from './ActivitySmithBaseProperties';
import { activitySmithLiveProperties } from './ActivitySmithLiveProperties';
import { activitySmithPushProperties } from './ActivitySmithPushProperties';
import { activitySmithStreamProperties } from './ActivitySmithStreamProperties';

export const activitySmithProperties: INodeProperties[] = [
	...activitySmithBaseProperties,
	...activitySmithLiveProperties,
	...activitySmithPushProperties,
	...activitySmithStreamProperties,
];
