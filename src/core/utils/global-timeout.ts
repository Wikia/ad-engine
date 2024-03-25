// @ts-strict-ignore
import { Injectable } from '@wikia/dependency-injection';
import { logger } from './logger';

@Injectable({ scope: 'Singleton' })
export class GlobalTimeout {
	public timeouts: Record<string, Promise<void>> = {};

	get(label: string): Promise<void> {
		logger('global-timeout', `Getting timeout ${label}`);
		return this.timeouts[label];
	}

	set(label: string, timeout: number): Promise<void> {
		if (this.timeouts[label]) {
			logger('global-timeout', `Timeout ${label} already set`);
			return this.timeouts[label];
		}
		logger('global-timeout', `Setting timeout ${label} for ${timeout}ms`);
		this.timeouts[label] = new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, timeout);
		});

		return this.timeouts[label];
	}
}
