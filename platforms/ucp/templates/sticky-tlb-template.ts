import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BodyOffsetResolvedHandler } from './handlers/body/body-offset-resolved-handler';
import { CloseToHiddenButtonHandler } from './handlers/close-to-hidden-button-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { NavbarOffsetResolvedHandler } from './handlers/navbar/navbar-offset-resolved-handler';
import { NavbarOffsetResolvedToNoneHandler } from './handlers/navbar/navbar-offset-resolved-to-none-handler';
import { SlotDecisionTimeoutHandler } from './handlers/slot/slot-decision-timeout-handler';
import { SlotHiddenHandler } from './handlers/slot/slot-hidden-handler';
import { SlotOffsetResolvedToNoneHandler } from './handlers/slot/slot-offset-resolved-to-none-handler';
import { SlotSizeResolvedHandler } from './handlers/slot/slot-size-resolved-handler';
import { SlotTransitionHandler } from './handlers/slot/slot-transition-handler';
import { StickyTlbBlockingHandler } from './handlers/sticky-tlb/sticky-tlb-blocking-handler';
import { StickyTlbBootstrapHandler } from './handlers/sticky-tlb/sticky-tlb-bootstrap-handler';
import { StickyTlbConfigHandler } from './handlers/sticky-tlb/sticky-tlb-config-handler';
import { CloseButtonHelper } from './helpers/close-button-helper';
import { DomManipulator } from './helpers/manipulators/dom-manipulator';
import { ScrollCorrector } from './helpers/scroll-corrector';
import { StickinessTimeout } from './helpers/stickiness-timeout';
import { UapDomManager } from './helpers/uap-dom-manager';
import { UapDomReader } from './helpers/uap-dom-reader';

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
