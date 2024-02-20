import { DiProcess } from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';
import { getF2StateBinder } from './utils/f2-state-binder';

@Injectable()
export class F2IocSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		// this.container
		// 	.bind(F2_ENV)
		// 	.value(await communicationService.action$.pipe(ofType(f2Ready), take(1)).toPromise());
		this.container.bind(getF2StateBinder());
	}
}
