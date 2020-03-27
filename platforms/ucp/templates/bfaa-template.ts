import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfaaBootstrapHandler } from './handlers/bfaa/bfaa-bootstrap-handler';
import { BfaaConfigHandler } from './handlers/bfaa/bfaa-config-handler';
import { BfaaImpactDecisionHandler } from './handlers/bfaa/bfaa-impact-decision-handler';
import { BfaaImpactHandler } from './handlers/bfaa/bfaa-impact-handler';
import { BfaaStickyDecisionHandler } from './handlers/bfaa/bfaa-sticky-decision-handler';
import { BfaaStickyHandler } from './handlers/bfaa/bfaa-sticky-handler';
import { BfaaTransitionHandler } from './handlers/bfaa/bfaa-transition-handler';
import { BfaaVideoImpactHandler } from './handlers/bfaa/bfaa-video-impact-handler';
import { BfaaVideoStickyHandler } from './handlers/bfaa/bfaa-video-sticky-handler';
import { BfaaVideoTransitionHandler } from './handlers/bfaa/bfaa-video-transition-handler';
import { CloseButtonHandler } from './handlers/close-button-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { ResolvedHandler } from './handlers/resolved-handler';
import { VideoBootstrapHandler } from './handlers/video-bootstrap-handler';
import { VideoCompletedHandler } from './handlers/video-completed-handler';
import { VideoCtpHandler } from './handlers/video-ctp-handler';
import { VideoResolvedHandler } from './handlers/video-resolved-handler';
import { VideoRestartHandler } from './handlers/video-restart-handler';
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
				BfaaImpactHandler,
				BfaaImpactDecisionHandler,
				BfaaVideoImpactHandler,
				VideoCompletedHandler,
				DomCleanupHandler,
			],
			sticky: [
				BfaaStickyHandler,
				BfaaStickyDecisionHandler,
				CloseButtonHandler,
				BfaaVideoStickyHandler,
				DomCleanupHandler,
			],
			transition: [
				BfaaStickyHandler,
				BfaaTransitionHandler,
				BfaaVideoTransitionHandler,
				DomCleanupHandler,
			],
			resolved: [ResolvedHandler, VideoResolvedHandler, DomCleanupHandler],
		},
		'initial',
		[
			ScrollCorrector,
			PlayerRegistry,
			DomManipulator,
			UapDomManager,
			UapDomReader,
			VideoDomManager,
			StickinessTimeout.provide(universalAdPackage.BFAA_UNSTICK_DELAY),
		],
	);
}
