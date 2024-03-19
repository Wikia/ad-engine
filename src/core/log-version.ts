import { logger } from './utils';

export function logVersion(): void {
	logger('ad-engine', window.ads.version?.ae);
}
