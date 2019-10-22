import { Injectable } from '@wikia/dependency-injection';
import { iocDefaultWarning } from '../../utils/iocDefaultWarning';

@Injectable()
export class AdsMode {
	constructor() {
		const className = 'AdsMode';
		iocDefaultWarning(className);
	}

	handleAds(): void {}
}
