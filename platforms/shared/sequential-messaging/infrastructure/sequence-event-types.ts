import { props } from 'ts-action';
import { Dictionary } from '@wikia/ad-engine';

export interface SequenceEventOptions {
	category: string;
	name: string;
	payload: any;
}

export const sequenceEventsTypes: Dictionary<SequenceEventOptions> = {
	// This event is fired in a GAM template
	GAM_SEQUENTIAL_MESSAGING_STARTED: {
		category: '[GAM iframe]',
		name: 'Sequential messaging started',
		payload: props<any>(),
	},
	// This event is fired in a GAM template
	GAM_SEQUENTIAL_MESSAGING_END: {
		category: '[GAM iframe]',
		name: 'Sequential messaging end',
		payload: props<any>(),
	},
};
