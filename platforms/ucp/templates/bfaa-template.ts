import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfaaBootstrapHandler } from './handlers/bfaa/bfaa-bootstrap-handler';
import { BfaaConfigHandler } from './handlers/bfaa/bfaa-config-handler';
import { CloseToTransitionButtonHandler } from './handlers/close-to-transition-button-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { SlotDynamicImpactDecisionHandler } from './handlers/slot/slot-dynamic-impact-decision-handler';
import { SlotDynamicImpactHandler } from './handlers/slot/slot-dynamic-impact-handler';
import { SlotResolvedHandler } from './handlers/slot/slot-resolved-handler';
import { SlotStickyDecisionHandler } from './handlers/slot/slot-sticky-decision-handler';
import { SlotStickyHandler } from './handlers/slot/slot-sticky-handler';
import { SlotTransitionHandler } from './handlers/slot/slot-transition-handler';
import { VideoBootstrapHandler } from './handlers/video/video-bootstrap-handler';
import { VideoCompletedHandler } from './handlers/video/video-completed-handler';
import { VideoCtpHandler } from './handlers/video/video-ctp-handler';
import { VideoDynamicImpactHandler } from './handlers/video/video-dynamic-impact-handler';
import { VideoResolvedHandler } from './handlers/video/video-resolved-handler';
import { VideoRestartHandler } from './handlers/video/video-restart-handler';
import { VideoStickyHandler } from './handlers/video/video-sticky-handler';
import { VideoTransitionHandler } from './handlers/video/video-transition-handler';
import { CloseButtonHelper } from './helpers/close-button-helper';
import { DomManipulator } from './helpers/manipulators/dom-manipulator';
import { PlayerRegistry } from './helpers/player-registry';
import { ScrollCorrector } from './helpers/scroll-corrector';
import { StickinessTimeout } from './helpers/stickiness-timeout';
import { UapDomManager } from './helpers/uap-dom-manager';
import { UapDomReader } from './helpers/uap-dom-reader';
import { VideoDomManager } from './helpers/video-dom-manager';

export function registerBfaaTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'bfaa',
		{
			initial: [
				BfaaConfigHandler,
				BfaaBootstrapHandler,
				VideoBootstrapHandler,
				VideoCtpHandler,
				VideoRestartHandler,
				AdvertisementLabelHandler,
				DebugTransitionHandler,
			],
			impact: [
				SlotDynamicImpactHandler,
				SlotDynamicImpactDecisionHandler,
				VideoDynamicImpactHandler,
				VideoCompletedHandler,
				DomCleanupHandler,
			],
			sticky: [
				SlotStickyHandler,
				SlotStickyDecisionHandler,
				CloseToTransitionButtonHandler,
				VideoStickyHandler,
				DomCleanupHandler,
			],
			transition: [
				SlotStickyHandler,
				SlotTransitionHandler,
				VideoTransitionHandler,
				DomCleanupHandler,
			],
			resolved: [SlotResolvedHandler, VideoResolvedHandler, DomCleanupHandler],
		},
		'initial',
		[
			ScrollCorrector,
			PlayerRegistry,
			DomManipulator,
			UapDomManager,
			UapDomReader,
			VideoDomManager,
			CloseButtonHelper,
			StickinessTimeout.provide(universalAdPackage.BFAA_UNSTICK_DELAY),
		],
	);
}
