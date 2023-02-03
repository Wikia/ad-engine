import { context, DiProcess } from '@wikia/ad-engine';

export class ComicvineAnyclipApplierSetup implements DiProcess {
	execute(): void {
		// TODO: change it to the flag in <meta name="ad-settings" /> once it's available
		context.set('services.anyclip.isApplicable', () => true);
	}
}
