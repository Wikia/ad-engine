import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfaaBootstrapHandler } from './handlers/bfaa-bootstrap-handler';
import { BfaaConfigHandler } from './handlers/bfaa-config-handler';
import { BfaaImpactHandler } from './handlers/bfaa-impact-handler';
import { BfaaImpactVideoHandler } from './handlers/bfaa-impact-video-handler';
import { BfaaResolvedHandler } from './handlers/bfaa-resolved-handler';
import { BfaaResolvedVideoHandler } from './handlers/bfaa-resolved-video-handler';
import { BfaaStickyDurationHandler } from './handlers/bfaa-sticky-duration-handler';
import { BfaaStickyHandler } from './handlers/bfaa-sticky-handler';
import { BfaaStickyVideoHandler } from './handlers/bfaa-sticky-video-handler';
import { BfaaTransitionHandler } from './handlers/bfaa-transition-handler';
import { BfaaTransitionVideoHandler } from './handlers/bfaa-transition-video-handler';
import { BfaaVideoHandler } from './handlers/bfaa-video-handler';
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
