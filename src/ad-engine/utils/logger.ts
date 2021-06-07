import { communicationService, globalAction } from '@ad-engine/communication';
import { props } from 'ts-action';
import { debug } from '../services/debug';

const debugGroup = debug.getDebugGroup() || '';
const groups = debugGroup.split(',');

interface CommunicatorPayload {
	name: string;
	state: string;
}

if (debugGroup !== '') {
	window.console.info('AdEngine debug mode - groups:', debugGroup === '1' ? 'all' : groups);
}

export function logger(logGroup: string, ...logValues: any[]): void {
	if (debugGroup === '') {
		return;
	}

	if (debugGroup === '1' || groups.indexOf(logGroup) !== -1) {
		window.console.info(logGroup, logValues);
	}
}

export function warner(warnGroup: string, ...warnValues: any[]): void {
	if (debugGroup === '') {
		return;
	}

	if (debugGroup === '1' || groups.indexOf(warnGroup) !== -1) {
		window.console.warn(warnGroup, warnValues);
	}
}

export function communicator(
	communicatorEvent: string,
	communicatorValues: CommunicatorPayload | {} = {},
): void {
	const aeCommunicatorEvent = globalAction(
		`[AdEngine] ${communicatorEvent}`,
		props<CommunicatorPayload | {}>(),
	);

	communicationService.dispatch(aeCommunicatorEvent(communicatorValues));
}
