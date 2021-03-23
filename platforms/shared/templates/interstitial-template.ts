import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { CloseToHiddenIhiButtonHandler } from './handlers/close-to-hidden-ihi-button-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { InterstitialBootstrapHandler } from './handlers/interstitial/interstitial-bootstrap-handler';
import { PreventScrollingHandler } from './handlers/prevent-scrolling-handler';
import { SlotHiddenHandler } from './handlers/slot/slot-hidden-handler';
import { DomManipulator } from './helpers/manipulators/dom-manipulator';

export function registerInterstitialTemplate(
	registry: TemplateRegistry,
): Observable<TemplateAction> {
	return registry.register(
		'interstitial',
		{
			initial: [InterstitialBootstrapHandler, AdvertisementLabelHandler, DebugTransitionHandler],
			display: [CloseToHiddenIhiButtonHandler, PreventScrollingHandler, DomCleanupHandler],
			hidden: [SlotHiddenHandler, DomCleanupHandler],
		},
		'initial',
		[DomManipulator],
	);
}
