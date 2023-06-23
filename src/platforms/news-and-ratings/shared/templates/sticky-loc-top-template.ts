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
	SlotSizeResolvedWithPlaceholderHandler,
	SlotStateStickedHandler,
	SlotTransitionHandler,
	StickinessTimeout,
	StickyTlbBlockingHandler,
	StickyTlbBootstrapHandler,
	UapDomManager,
	UapDomReader,
} from '@platforms/shared';
import {
	TemplateAction,
	TemplateDependency,
	TemplateRegistry,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { SlotHiddenHandler } from './handlers/sticky-loc-top/slot-hidden-handler';
import { StickyLocTopConfigHandler } from './handlers/sticky-loc-top/sticky-loc-top-config-handler';

export function registerStickyLocTopTemplate(
	registry: TemplateRegistry,
	registerUapDomElements: () => TemplateDependency[],
): Observable<TemplateAction> {
	return registry.register(
		'stickyLocTop',
		{
			blocking: [StickyTlbBlockingHandler],
			initial: [
				StickyTlbBootstrapHandler,
				StickyLocTopConfigHandler,
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
			StickinessTimeout.provide(universalAdPackage.TLB_UNSTICK_DELAY),
			registerUapDomElements(),
		],
	);
}
