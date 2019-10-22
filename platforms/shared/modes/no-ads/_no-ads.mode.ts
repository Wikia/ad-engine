import { Injectable } from '@wikia/dependency-injection';
import { iocDefaultWarning } from '../../utils/iocDefaultWarning';

@Injectable()
export class NoAdsMode {
	constructor() {
		const className = 'NoAdsMode';
		iocDefaultWarning(className);
	}

	handleNoAds(): void {}
}
