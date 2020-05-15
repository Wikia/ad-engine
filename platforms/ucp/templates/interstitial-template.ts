import {
	AdvertisementLabelHandler,
	CloseToHiddenIhiButtonHandler,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	InterstitialBootstrapHandler,
	PreventScrollingHandler,
	SlotHiddenHandler,
} from '@platforms/shared';
import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';

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
