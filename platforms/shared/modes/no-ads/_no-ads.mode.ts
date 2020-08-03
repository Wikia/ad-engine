import { Injectable } from '@wikia/dependency-injection';
import { iocDefaultWarning } from '../../utils/ioc-default-warning';

@Injectable()
export class NoAdsMode {
	constructor() {
		iocDefaultWarning('NoAdsMode');
	}

	execute(): void {}
}
