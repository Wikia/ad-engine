import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfaaBootstrapHandler } from './handlers/bfaa/bfaa-bootstrap-handler';
import { BfaaConfigHandler } from './handlers/bfaa/bfaa-config-handler';
import { BodyOffsetImpactHandler } from './handlers/body/body-offset-impact-handler';
import { BodyOffsetResolvedHandler } from './handlers/body/body-offset-resolved-handler';
import { CloseToTransitionButtonHandler } from './handlers/close-to-transition-button-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { NavbarOffsetImpactToResolvedHandler } from './handlers/navbar/navbar-offset-impact-to-resolved-handler';
import { NavbarOffsetResolvedHandler } from './handlers/navbar/navbar-offset-resolved-handler';
import { NavbarOffsetResolvedToNoneHandler } from './handlers/navbar/navbar-offset-resolved-to-none-handler';
import { SlotDecisionImpactToResolvedHandler } from './handlers/slot/slot-decision-impact-to-resolved-handler';
import { SlotDecisionTimeoutHandler } from './handlers/slot/slot-decision-timeout-handler';
import { SlotOffsetResolvedToNoneHandler } from './handlers/slot/slot-offset-resolved-to-none-handler';
import { SlotSizeImpactToResolvedHandler } from './handlers/slot/slot-size-impact-to-resolved-handler';
import { SlotSizeResolvedHandler } from './handlers/slot/slot-size-resolved-handler';
import { SlotTransitionHandler } from './handlers/slot/slot-transition-handler';
import { VideoBootstrapHandler } from './handlers/video/video-bootstrap-handler';
import { VideoCompletedHandler } from './handlers/video/video-completed-handler';
import { VideoCtpHandler } from './handlers/video/video-ctp-handler';
import { VideoRestartHandler } from './handlers/video/video-restart-handler';
import { VideoSizeImpactToResolvedHandler } from './handlers/video/video-size-impact-to-resolved-handler';
import { VideoSizeResolvedHandler } from './handlers/video/video-size-resolved-handler';
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
				SlotSizeImpactToResolvedHandler,
				SlotDecisionImpactToResolvedHandler,
				NavbarOffsetImpactToResolvedHandler,
				BodyOffsetImpactHandler,
				VideoSizeImpactToResolvedHandler,
				VideoCompletedHandler,
				DomCleanupHandler,
			],
			sticky: [
				SlotSizeResolvedHandler,
				BodyOffsetResolvedHandler,
				NavbarOffsetResolvedHandler,
				SlotDecisionTimeoutHandler,
				CloseToTransitionButtonHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			transition: [
				SlotSizeResolvedHandler,
				BodyOffsetResolvedHandler,
				NavbarOffsetResolvedHandler,
				SlotTransitionHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			resolved: [
				SlotSizeResolvedHandler,
				SlotOffsetResolvedToNoneHandler,
				NavbarOffsetResolvedToNoneHandler,
				BodyOffsetResolvedHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
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
