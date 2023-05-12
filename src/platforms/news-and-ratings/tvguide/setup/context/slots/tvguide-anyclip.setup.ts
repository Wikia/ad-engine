import { context, DiProcess, targetingService, utils } from '@wikia/ad-engine';

export class TvGuideAnyclipSetup implements DiProcess {
	private logGroup = 'Anyclip';

	execute(): void {
		context.set('services.anyclip.isApplicable', () => {
			const pname = targetingService.get('pname');
			const isApplicable = this.isApplicable(pname);

			utils.logger(this.logGroup, 'isApplicable: ', isApplicable, pname);

			return isApplicable;
		});
	}

	isApplicable(pname: string): boolean {
		const applicablePnames = ['news', 'feature_hub'];

		return applicablePnames.indexOf(pname) !== -1;
	}
}
