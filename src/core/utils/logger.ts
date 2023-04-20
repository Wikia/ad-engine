import { debug } from '../services/debug';

const debugGroup = debug.getDebugGroup() || '';
const groups = debugGroup.split(',');

if (debugGroup !== '') {
	window.console.info('AdEngine debug mode - groups:', debugGroup === '1' ? 'all' : groups);
}

const BACKUP_ORIGIN_TIME = Date.now(); // fallback for timeorigin
export function getTimeDelta(): number {
	const currentTimeStamp = Date.now();
	const originTime = window.performance?.timeOrigin ?? BACKUP_ORIGIN_TIME;

	return currentTimeStamp - originTime;
}

export function getTimeDeltaFixed(): string {
	const delta = getTimeDelta();
	const secondsResult = delta / 1000;

	return secondsResult.toFixed(4);
}

export function logger(logGroup: string, ...logValues: any[]): void {
	if (debugGroup === '') {
		return;
	}

	if (debugGroup === '1' || groups.indexOf(logGroup) !== -1) {
		window.console.info(`${getTimeDeltaFixed()}s\t\t ${logGroup}`, logValues);
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
