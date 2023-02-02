import { context, DiProcess } from '@wikia/ad-engine';

export class GamefaqsAnyclipApplierSetup implements DiProcess {
	private isUserLoggedInBasedOnTargeting() {
		return context.get('targeting.user') === 'anon';
	}

	execute(): void {
		context.set('services.anyclip.isApplicable', () => this.isUserLoggedInBasedOnTargeting());
	}
}
