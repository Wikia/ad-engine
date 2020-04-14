import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfaaBootstrapHandler } from './handlers/bfaa/bfaa-bootstrap-handler';
import { BfaaConfigHandler } from './handlers/bfaa/bfaa-config-handler';
import { BodyOffsetBig } from './handlers/body/body-offset-big';
import { BodyOffsetSmall } from './handlers/body/body-offset-small';
import { CloseToTransitionButton } from './handlers/close-to-transition-button';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { NavbarOffsetBigToSmall } from './handlers/navbar/navbar-offset-big-to-small';
import { NavbarOffsetSmall } from './handlers/navbar/navbar-offset-small';
import { NavbarOffsetSmallToNone } from './handlers/navbar/navbar-offset-small-to-none';
import { SlotDecisionBigToSmall } from './handlers/slot/slot-decision-big-to-small';
import { SlotDecisionTimeout } from './handlers/slot/slot-decision-timeout';
import { SlotOffsetSmallToNone } from './handlers/slot/slot-offset-small-to-none';
import { SlotSizeBigToSmall } from './handlers/slot/slot-size-big-to-small';
import { SlotSizeSmall } from './handlers/slot/slot-size-small';
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
				SlotSizeBigToSmall,
				SlotDecisionBigToSmall,
				NavbarOffsetBigToSmall,
				BodyOffsetBig,
				VideoDynamicImpactHandler,
				VideoCompletedHandler,
				DomCleanupHandler,
			],
			sticky: [
				SlotSizeSmall,
				BodyOffsetSmall,
				NavbarOffsetSmall,
				SlotDecisionTimeout,
				CloseToTransitionButton,
				VideoStickyHandler,
				DomCleanupHandler,
			],
			transition: [
				SlotSizeSmall,
				BodyOffsetSmall,
				NavbarOffsetSmall,
				SlotTransitionHandler,
				VideoTransitionHandler,
				DomCleanupHandler,
			],
			resolved: [
				SlotSizeSmall,
				SlotOffsetSmallToNone,
				NavbarOffsetSmallToNone,
				BodyOffsetSmall,
				VideoResolvedHandler,
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
