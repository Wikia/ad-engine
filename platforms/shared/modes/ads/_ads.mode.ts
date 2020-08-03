import { Injectable } from '@wikia/dependency-injection';
import { iocDefaultWarning } from '../../utils/ioc-default-warning';

@Injectable()
export class AdsMode {
	constructor() {
		iocDefaultWarning('AdsMode');
	}

	execute(): void {}
}
