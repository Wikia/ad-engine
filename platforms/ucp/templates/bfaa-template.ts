import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfaaBootstrapHandler } from './handlers/bfaa/bfaa-bootstrap-handler';
import { BfaaConfigHandler } from './handlers/bfaa/bfaa-config-handler';
import { BodyOffsetBigHandler } from './handlers/body/body-offset-big-handler';
import { BodyOffsetSmallHandler } from './handlers/body/body-offset-small-handler';
import { CloseToTransitionButton } from './handlers/close-to-transition-button';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { NavbarOffsetBigToSmallHandler } from './handlers/navbar/navbar-offset-big-to-small-handler';
import { NavbarOffsetSmallHandler } from './handlers/navbar/navbar-offset-small-handler';
import { NavbarOffsetSmallToNoneHandler } from './handlers/navbar/navbar-offset-small-to-none-handler';
import { SlotDecisionBigToSmallHandler } from './handlers/slot/slot-decision-big-to-small-handler';
import { SlotDecisionTimeoutHandler } from './handlers/slot/slot-decision-timeout-handler';
import { SlotOffsetSmallToNoneHandler } from './handlers/slot/slot-offset-small-to-none-handler';
import { SlotSizeBigToSmallHandler } from './handlers/slot/slot-size-big-to-small-handler';
import { SlotSizeSmallHandler } from './handlers/slot/slot-size-small-handler';
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
				SlotSizeBigToSmallHandler,
				SlotDecisionBigToSmallHandler,
				NavbarOffsetBigToSmallHandler,
				BodyOffsetBigHandler,
				VideoSizeImpactToResolvedHandler,
				VideoCompletedHandler,
				DomCleanupHandler,
			],
			sticky: [
				SlotSizeSmallHandler,
				BodyOffsetSmallHandler,
				NavbarOffsetSmallHandler,
				SlotDecisionTimeoutHandler,
				CloseToTransitionButton,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			transition: [
				SlotSizeSmallHandler,
				BodyOffsetSmallHandler,
				NavbarOffsetSmallHandler,
				SlotTransitionHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			resolved: [
				SlotSizeSmallHandler,
				SlotOffsetSmallToNoneHandler,
				NavbarOffsetSmallToNoneHandler,
				BodyOffsetSmallHandler,
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
