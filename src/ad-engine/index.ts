import { get, set } from 'lodash';
import * as utils from './utils';

const versionField = 'ads.adEngineVersion';
const commitField = 'ads.adEngineCommit';

if (get(window, versionField, null)) {
	window.console.warn('Multiple <?= PACKAGE(name) ?> initializations. This may cause issues.');
}

set(window, versionField, 'v<?= PACKAGE(version) ?>');
set(window, commitField, '<?= PACKAGE_REPO_COMMIT ?>');
utils.logger('ad-engine', 'v<?= PACKAGE(version) ?> (<?= PACKAGE_REPO_COMMIT ?>)');

export * from './ad-engine';
export * from './listeners';
export * from './models';
export * from './providers';
export * from './services';
export * from './video';
export { utils };
