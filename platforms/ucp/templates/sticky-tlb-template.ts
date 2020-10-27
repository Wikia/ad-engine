import {
	AdvertisementLabelHandler,
	CloseButtonHelper,
	CloseToHiddenButtonHandler,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	NavbarOffsetResolvedHandler,
	NavbarOffsetResolvedToNoneHandler,
	PageOffsetResolvedHandler,
	ScrollCorrector,
	SlotDecisionTimeoutHandler,
	SlotHiddenHandler,
	SlotOffsetResolvedToNoneHandler,
	SlotSizeResolvedHandler,
	SlotTransitionHandler,
	StickinessTimeout,
	StickyTlbBlockingHandler,
	StickyTlbBootstrapHandler,
	StickyTlbConfigHandler,
	UapDomManager,
	UapDomReader,
} from '@platforms/shared';
import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { registerUcpUapDomElements } from './configs/register-ucp-uap-dom-elements';

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
				PageOffsetResolvedHandler,
				NavbarOffsetResolvedHandler,
				SlotDecisionTimeoutHandler,
				CloseToHiddenButtonHandler,
				DomCleanupHandler,
			],
			transition: [
				SlotSizeResolvedHandler,
				PageOffsetResolvedHandler,
				NavbarOffsetResolvedHandler,
				SlotTransitionHandler,
				DomCleanupHandler,
			],
			resolved: [
				SlotSizeResolvedHandler,
				SlotOffsetResolvedToNoneHandler,
				PageOffsetResolvedHandler,
				NavbarOffsetResolvedToNoneHandler,
				DomCleanupHandler,
			],
			hidden: [SlotHiddenHandler, PageOffsetResolvedHandler, DomCleanupHandler],
		},
		'blocking',
		[
			DomManipulator,
			UapDomManager,
			UapDomReader,
			ScrollCorrector,
			CloseButtonHelper,
			StickinessTimeout.provide(universalAdPackage.TLB_UNSTICK_DELAY),
			registerUcpUapDomElements(),
		],
	);
}
