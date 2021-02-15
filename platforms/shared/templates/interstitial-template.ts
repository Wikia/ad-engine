import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { CloseToRedirectButtonHandler } from './handlers/close-to-redirect-button-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { InterstitialBootstrapHandler } from './handlers/interstitial/interstitial-bootstrap-handler';
import { InterstitialClickListenerHandler } from './handlers/interstitial/interstitial-click-listener-handler';
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
			listen: [InterstitialClickListenerHandler],
			display: [CloseToRedirectButtonHandler, PreventScrollingHandler, DomCleanupHandler],
			hidden: [SlotHiddenHandler, DomCleanupHandler],
		},
		'initial',
		[DomManipulator],
	);
}
