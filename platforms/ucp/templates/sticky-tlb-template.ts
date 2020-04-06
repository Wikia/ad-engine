import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfaaStickyHandler } from './handlers/bfaa/bfaa-sticky-handler';
import { BfaaTransitionHandler } from './handlers/bfaa/bfaa-transition-handler';
import { CloseToCollapsedButtonHandler } from './handlers/close-to-collapsed-button-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { ResolvedHandler } from './handlers/resolved-handler';
import { SlotCollapsedHandler } from './handlers/slot-collapsed-handler';
import { StickyDecisionHandler } from './handlers/sticky-decision-handler';
import { StickyTlbBlockingHandler } from './handlers/sticky-tlb/sticky-tlb-blocking-handler';
import { StickyTlbBootstrapHandler } from './handlers/sticky-tlb/sticky-tlb-bootstrap-handler';
import { StickyTlbConfigHandler } from './handlers/sticky-tlb/sticky-tlb-config-handler';
import { DomManipulator } from './helpers/manipulators/dom-manipulator';
import { ScrollCorrector } from './helpers/scroll-corrector';
import { StickinessTimeout } from './helpers/stickiness-timeout';
import { UapDomManager } from './helpers/uap-dom-manager';
import { UapDomReader } from './helpers/uap-dom-reader';

// ToDo: code prio (outstream works)

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
				BfaaStickyHandler,
				StickyDecisionHandler,
				CloseToCollapsedButtonHandler,
				DomCleanupHandler,
			],
			transition: [BfaaStickyHandler, BfaaTransitionHandler, DomCleanupHandler],
			resolved: [ResolvedHandler, DomCleanupHandler],
			collapsed: [SlotCollapsedHandler, DomCleanupHandler],
		},
		'blocking',
		[
			DomManipulator,
			UapDomManager,
			UapDomReader,
			ScrollCorrector,
			StickinessTimeout.provide(universalAdPackage.TLB_UNSTICK_DELAY),
		],
	);
}
