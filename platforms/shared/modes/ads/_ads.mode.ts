import { utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class AdsMode {
	constructor() {
		const warnGroup = 'AdsMode';
		utils.warner('##### IOC - you are not implementing:', warnGroup);
	}

	handleAds(): void {}
}
