import { utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class NoAdsMode {
	constructor() {
		const warnGroup = 'NoAdsMode';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	handleNoAds(): void {}
}
