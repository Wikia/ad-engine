import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfaaBootstrapHandler } from './handlers/bfaa/bfaa-bootstrap-handler';
import { BfaaConfigHandler } from './handlers/bfaa/bfaa-config-handler';
import { BfaaImpactDecisionHandler } from './handlers/bfaa/bfaa-impact-decision-handler';
import { BfaaImpactHandler } from './handlers/bfaa/bfaa-impact-handler';
import { BfaaImpactVideoHandler } from './handlers/bfaa/bfaa-impact-video-handler';
import { BfaaResolvedHandler } from './handlers/bfaa/bfaa-resolved-handler';
import { BfaaStickyDecisionHandler } from './handlers/bfaa/bfaa-sticky-decision-handler';
import { BfaaStickyHandler } from './handlers/bfaa/bfaa-sticky-handler';
import { BfaaStickyVideoHandler } from './handlers/bfaa/bfaa-sticky-video-handler';
import { BfaaTransitionHandler } from './handlers/bfaa/bfaa-transition-handler';
import { BfaaTransitionVideoHandler } from './handlers/bfaa/bfaa-transition-video-handler';
import { BootstrapVideoHandler } from './handlers/bootstrap-video-handler';
import { CloseButtonHandler } from './handlers/close-button-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { ResolvedVideoHandler } from './handlers/resolved-video-handler';
import { VideoCtpHandler } from './handlers/video-ctp-handler';
import { VideoRestartHandler } from './handlers/video-restart-handler';
import { PlayerRegistry } from './helpers/player-registry';

export function registerBfaaTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'bfaa',
		{
			initial: [
				BfaaConfigHandler,
				BfaaBootstrapHandler,
				BootstrapVideoHandler,
				VideoCtpHandler,
				VideoRestartHandler,
				AdvertisementLabelHandler,
				DebugTransitionHandler,
			],
			impact: [BfaaImpactHandler, BfaaImpactDecisionHandler, BfaaImpactVideoHandler],
			sticky: [
				BfaaStickyHandler,
				BfaaStickyDecisionHandler,
				CloseButtonHandler,
				BfaaStickyVideoHandler,
			],
			transition: [BfaaTransitionHandler, BfaaTransitionVideoHandler],
			resolved: [BfaaResolvedHandler, ResolvedVideoHandler],
		},
		'initial',
		[PlayerRegistry],
	);
}
