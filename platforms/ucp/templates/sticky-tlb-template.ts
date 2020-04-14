import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BodyOffsetSmallHandler } from './handlers/body/body-offset-small-handler';
import { CloseToHiddenButton } from './handlers/close-to-hidden-button';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { NavbarOffsetSmallHandler } from './handlers/navbar/navbar-offset-small-handler';
import { NavbarOffsetSmallToNoneHandler } from './handlers/navbar/navbar-offset-small-to-none-handler';
import { SlotDecisionTimeoutHandler } from './handlers/slot/slot-decision-timeout-handler';
import { SlotHiddenHandler } from './handlers/slot/slot-hidden-handler';
import { SlotOffsetSmallToNoneHandler } from './handlers/slot/slot-offset-small-to-none-handler';
import { SlotSizeSmallHandler } from './handlers/slot/slot-size-small-handler';
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
				SlotSizeSmallHandler,
				BodyOffsetSmallHandler,
				NavbarOffsetSmallHandler,
				SlotDecisionTimeoutHandler,
				CloseToHiddenButton,
				DomCleanupHandler,
			],
			transition: [
				SlotSizeSmallHandler,
				BodyOffsetSmallHandler,
				NavbarOffsetSmallHandler,
				SlotTransitionHandler,
				DomCleanupHandler,
			],
			resolved: [
				SlotSizeSmallHandler,
				SlotOffsetSmallToNoneHandler,
				BodyOffsetSmallHandler,
				NavbarOffsetSmallToNoneHandler,
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
		],
	);
}
