import { TemplateAction, TemplateRegistry } from '@ad-engine/core';
import {
	AdvertisementLabelHandler,
	CloseButtonHelper,
	CloseToHiddenButtonHandler,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	ScrollCorrector,
	SlotDecisionTimeoutHandler,
	SlotHeightClippingHandler,
	SlotHiddenHandler,
	SlotSizeResolvedWithPlaceholderHandler,
	SlotStateStickedHandler,
	SlotTransitionHandler,
	StickinessTimeout,
	StickyTlbBlockingHandler,
	StickyTlbBootstrapHandler,
	StickyTlbConfigHandler,
	UapDomManager,
	UapDomReader,
} from '@platforms/shared';
import { universalAdPackage } from '@wikia/ad-products';
import { Observable } from 'rxjs';
import { registerF2UapDomElements } from './configs/register-f2-uap-dom-elements';
import { HideSmartBannerHandler } from './handlers/hide-smart-banner-handler';

export function registerStickyTlbTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'stickyTlb',
		{
			blocking: [StickyTlbBlockingHandler],
			initial: [
				StickyTlbBootstrapHandler,
				StickyTlbConfigHandler,
				AdvertisementLabelHandler,
				HideSmartBannerHandler,
				DebugTransitionHandler,
			],
			sticky: [
				SlotSizeResolvedWithPlaceholderHandler,
				SlotDecisionTimeoutHandler,
				CloseToHiddenButtonHandler,
				DomCleanupHandler,
				SlotStateStickedHandler,
			],
			transition: [
				SlotSizeResolvedWithPlaceholderHandler,
				SlotTransitionHandler,
				DomCleanupHandler,
				SlotStateStickedHandler,
			],
			resolved: [
				SlotSizeResolvedWithPlaceholderHandler,
				SlotHeightClippingHandler,
				DomCleanupHandler,
			],
			hidden: [SlotHiddenHandler, DomCleanupHandler],
		},
		'blocking',
		[
			DomManipulator,
			UapDomManager,
			UapDomReader,
			ScrollCorrector,
			CloseButtonHelper,
			StickinessTimeout.provide(universalAdPackage.TLB_UNSTICK_DELAY),
			registerF2UapDomElements(),
		],
	);
}
