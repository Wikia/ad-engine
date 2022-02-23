import { logger } from './utils';

export function logVersion(): void {
	if (window.ads.adEngineVersion) {
		window.console.warn('Multiple <?= PACKAGE(name) ?> initializations. This may cause issues.');
	}

	window.ads.adEngineVersion = 'v<?= PACKAGE(version) ?>';
	logger('ad-engine', 'v<?= PACKAGE(version) ?>');
}
