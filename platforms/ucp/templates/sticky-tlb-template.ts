import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BodyOffsetSmall } from './handlers/body/body-offset-small';
import { CloseToHiddenButtonHandler } from './handlers/close-to-hidden-button-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { NavbarOffsetSmallToNone } from './handlers/navbar/navbar-offset-small-to-none';
import { SlotHiddenHandler } from './handlers/slot/slot-hidden-handler';
import { SlotOffsetSmallToNone } from './handlers/slot/slot-offset-small-to-none';
import { SlotSizeSmall } from './handlers/slot/slot-size-small';
import { SlotStickyDecisionHandler } from './handlers/slot/slot-sticky-decision-handler';
import { SlotStickyHandler } from './handlers/slot/slot-sticky-handler';
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
				SlotStickyHandler,
				SlotStickyDecisionHandler,
				CloseToHiddenButtonHandler,
				DomCleanupHandler,
			],
			transition: [SlotStickyHandler, SlotTransitionHandler, DomCleanupHandler],
			resolved: [
				SlotSizeSmall,
				SlotOffsetSmallToNone,
				NavbarOffsetSmallToNone,
				BodyOffsetSmall,
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
