import { context, DiProcess, targetingService, utils } from '@wikia/ad-engine';

export class TvGuideAnyclipSetup implements DiProcess {
	private logGroup = 'Anyclip';

	execute(): void {
		context.set('services.anyclip.isApplicable', () => {
			const pname = targetingService.get('pname');
			const pathname = window.location.pathname.toLowerCase();

			const isApplicable = this.isApplicable(pname)
				? this.isApplicable(pname)
				: this.isApplicable(pathname);

			utils.logger(this.logGroup, 'isApplicable: ', isApplicable, pname);

			return isApplicable;
		});
	}

	isApplicable(pathname: string): boolean {
		return this.isApplicableByPnameAdTag(pathname) || this.isApplicableByPathname(pathname);
	}

	private isApplicableByPnameAdTag(pname: string): boolean {
		const applicablePnames = ['news', 'feature_hub'];

		return applicablePnames.includes(pname);
	}

	private isApplicableByPathname(pathname: string): boolean {
		const applicablePathnames = ['/news/'];

		return applicablePathnames.includes(pathname);
	}
}
