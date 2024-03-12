import { communicationService, ofType } from '@ad-engine/communication';
import { DiProcess } from '@ad-engine/pipeline';
import { Container, Injectable } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';
import { f2Ready, F2_ENV } from './setup-f2';
import { getF2StateBinder } from './utils/f2-state-binder';

@Injectable()
export class F2IocSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		this.container
			.bind(F2_ENV)
			.value(await communicationService.action$.pipe(ofType(f2Ready), take(1)).toPromise());
		this.container.bind(getF2StateBinder());
	}
}
