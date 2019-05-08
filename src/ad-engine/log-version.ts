import { get, set } from 'lodash';
import { logger } from './utils';

export function logVersion(): void {
	const versionField = 'ads.adEngineVersion';

	if (get(window, versionField, null)) {
		window.console.warn('Multiple <?= PACKAGE(name) ?> initializations. This may cause issues.');
	}

	set(window, versionField, 'v<?= PACKAGE(version) ?>');
	logger('ad-engine', 'v<?= PACKAGE(version) ?>');
}
