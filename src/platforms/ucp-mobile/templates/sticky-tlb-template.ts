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
import { TemplateAction, TemplateRegistry, uapConsts } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { registerUcpMobileUapDomElements } from './configs/register-ucp-mobile-uap-dom-elements';

export function registerStickyTlbTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'stickyTlb',
		{
			blocking: [StickyTlbBlockingHandler],
			initial: [
				StickyTlbBootstrapHandler,
				StickyTlbConfigHandler,
				AdvertisementLabelHandler,
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
			StickinessTimeout.provide(uapConsts.TLB_UNSTICK_DELAY),
			registerUcpMobileUapDomElements(),
		],
	);
}
