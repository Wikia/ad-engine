import { context, DiProcess, targetingService } from '@wikia/ad-engine';
import { loadNewUap } from "../../../../core/services/load-new-uap";

export class TvGuideMTCContextSetup implements DiProcess {
	execute(): void {
		targetingService.set('skin', 'tvguide-mtc');

		context.set('state.provider', 'nothing');
		context.set('state.external.adengine', 'mtc');

		context.set('uap.slots.toEnable', Object.keys(context.get('slots')));
		context.set('uap.dom.nav', '.c-siteHeader');
		context.set('uap.dom.footer', 'footer.c-siteFooter');
		loadNewUap();
	}
}
