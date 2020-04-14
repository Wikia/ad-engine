import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BodyOffsetSmall } from './handlers/body/body-offset-small';
import { CloseToHiddenButton } from './handlers/close-to-hidden-button';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { NavbarOffsetSmall } from './handlers/navbar/navbar-offset-small';
import { NavbarOffsetSmallToNone } from './handlers/navbar/navbar-offset-small-to-none';
import { SlotDecisionTimeout } from './handlers/slot/slot-decision-timeout';
import { SlotHidden } from './handlers/slot/slot-hidden';
import { SlotOffsetSmallToNone } from './handlers/slot/slot-offset-small-to-none';
import { SlotSizeSmall } from './handlers/slot/slot-size-small';
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
				SlotSizeSmall,
				BodyOffsetSmall,
				NavbarOffsetSmall,
				SlotDecisionTimeout,
				CloseToHiddenButton,
				DomCleanupHandler,
			],
			transition: [
				SlotSizeSmall,
				BodyOffsetSmall,
				NavbarOffsetSmall,
				SlotTransitionHandler,
				DomCleanupHandler,
			],
			resolved: [
				SlotSizeSmall,
				SlotOffsetSmallToNone,
				NavbarOffsetSmallToNone,
				BodyOffsetSmall,
				DomCleanupHandler,
			],
			hidden: [SlotHidden, DomCleanupHandler],
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
