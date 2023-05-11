import { context, DiProcess, utils } from '@wikia/ad-engine';

export class TvGuideAnyclipSetup implements DiProcess {
	execute(): void {
		context.set('services.anyclip.isApplicable', () => {
			const isApplicable = this.isApplicable(location.pathname);
			utils.logger('Anyclip', 'isApplicable: ', isApplicable);

			return isApplicable;
		});
	}

	isApplicable(pathname: string): boolean {
		const applicablePaths = ['/news/', '/services/netflix/'];

		return applicablePaths.indexOf(pathname) !== -1;
	}
}
