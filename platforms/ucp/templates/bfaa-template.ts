import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfaaBootstrapHandler } from './handlers/bfaa/bfaa-bootstrap-handler';
import { BfaaConfigHandler } from './handlers/bfaa/bfaa-config-handler';
import { BfaaImpactHandler } from './handlers/bfaa/bfaa-impact-handler';
import { BfaaImpactVideoHandler } from './handlers/bfaa/bfaa-impact-video-handler';
import { BfaaResolvedHandler } from './handlers/bfaa/bfaa-resolved-handler';
import { BfaaResolvedVideoHandler } from './handlers/bfaa/bfaa-resolved-video-handler';
import { BfaaStickyDurationHandler } from './handlers/bfaa/bfaa-sticky-duration-handler';
import { BfaaStickyHandler } from './handlers/bfaa/bfaa-sticky-handler';
import { BfaaStickyVideoHandler } from './handlers/bfaa/bfaa-sticky-video-handler';
import { BfaaTransitionHandler } from './handlers/bfaa/bfaa-transition-handler';
import { BfaaTransitionVideoHandler } from './handlers/bfaa/bfaa-transition-video-handler';
import { BfaaVideoHandler } from './handlers/bfaa/bfaa-video-handler';
import { CloseButtonHandler } from './handlers/close-button-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';

export function registerBfaaTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'bfaa',
		{
			initial: [
				BfaaConfigHandler,
				BfaaBootstrapHandler,
				BfaaVideoHandler,
				AdvertisementLabelHandler,
				DebugTransitionHandler,
			],
			impact: [BfaaImpactHandler, BfaaImpactVideoHandler],
			sticky: [
				BfaaStickyHandler,
				BfaaStickyDurationHandler,
				CloseButtonHandler,
				BfaaStickyVideoHandler,
			],
			transition: [BfaaTransitionHandler, BfaaTransitionVideoHandler],
			resolved: [BfaaResolvedHandler, BfaaResolvedVideoHandler],
		},
		'initial',
	);
}
