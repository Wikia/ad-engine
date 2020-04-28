import {
	AdvertisementLabelHandler,
	BodyOffsetResolvedHandler,
	CloseButtonHelper,
	CloseToHiddenButtonHandler,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	NavbarOffsetResolvedHandler,
	NavbarOffsetResolvedToNoneHandler,
	ScrollCorrector,
	SlotDecisionTimeoutHandler,
	SlotHiddenHandler,
	SlotOffsetResolvedToNoneHandler,
	SlotSizeResolvedHandler,
	SlotTransitionHandler,
	StickinessTimeout,
	UapDomManager,
	UapDomReader,
} from '@platforms/shared';
import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { StickyTlbBlockingHandler } from './handlers/sticky-tlb/sticky-tlb-blocking-handler';
import { StickyTlbBootstrapHandler } from './handlers/sticky-tlb/sticky-tlb-bootstrap-handler';
import { StickyTlbConfigHandler } from './handlers/sticky-tlb/sticky-tlb-config-handler';

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
				SlotSizeResolvedHandler,
				BodyOffsetResolvedHandler,
				NavbarOffsetResolvedHandler,
				SlotDecisionTimeoutHandler,
				CloseToHiddenButtonHandler,
				DomCleanupHandler,
			],
			transition: [
				SlotSizeResolvedHandler,
				BodyOffsetResolvedHandler,
				NavbarOffsetResolvedHandler,
				SlotTransitionHandler,
				DomCleanupHandler,
			],
			resolved: [
				SlotSizeResolvedHandler,
				SlotOffsetResolvedToNoneHandler,
				BodyOffsetResolvedHandler,
				NavbarOffsetResolvedToNoneHandler,
				DomCleanupHandler,
			],
			hidden: [SlotHiddenHandler, BodyOffsetResolvedHandler, DomCleanupHandler],
		},
		'blocking',
		[
			DomManipulator,
			UapDomManager,
			UapDomReader,
			ScrollCorrector,
			CloseButtonHelper,
			StickinessTimeout.provide(universalAdPackage.TLB_UNSTICK_DELAY),
		],
	);
}
