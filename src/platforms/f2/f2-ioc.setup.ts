import { communicationService, context, DiProcess, ofType } from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';
import { take } from 'rxjs';
import { f2Ready, F2_ENV } from './setup-f2';
import { getF2StateBinder } from './utils/f2-state-binder';

@Injectable()
export class F2IocSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		const f2Env = await communicationService.action$.pipe(ofType(f2Ready), take(1)).toPromise();
		this.container.bind(F2_ENV).value(f2Env);
		this.container.bind(getF2StateBinder());
		context.set('state.isMobile', f2Env.isPageMobile);
	}
}
