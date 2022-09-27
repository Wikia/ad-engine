import { props } from 'ts-action';

export interface SequenceEventOptions {
	category: string;
	name: string;
	payload: any;
}

export class SequenceEventTypes {
	// This event is fired in a GAM template
	static readonly SEQUENTIAL_MESSAGING_STARTED: SequenceEventOptions = {
		category: '[iframe]',
		name: 'Sequential messaging started',
		payload: props<any>(),
	};
	// This event is fired in a GAM template
	static readonly SEQUENTIAL_MESSAGING_INTERMEDIATE: SequenceEventOptions = {
		category: '[iframe]',
		name: 'Sequential messaging intermediate step',
		payload: props<any>(),
	};
	// This event is fired in a GAM template
	static readonly SEQUENTIAL_MESSAGING_END: SequenceEventOptions = {
		category: '[iframe]',
		name: 'Sequential messaging end',
		payload: props<any>(),
	};
}
