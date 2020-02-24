import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AdvertisementLabelHandler } from './handlers/advertisement-label-handler';
import { BfaaBootstrapHandler } from './handlers/bfaa-bootstrap-handler';
import { BfaaImpactHandler } from './handlers/bfaa-impact-handler';
import { BfaaResolvedHandler } from './handlers/bfaa-resolved-handler';
import { BfaaStickyHandler } from './handlers/bfaa-sticky-handler';
import { BfaaTransitionHandler } from './handlers/bfaa-transition-handler';
import { CloseButtonHandler } from './handlers/close-button-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';

export function registerBfaaTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'bfaa',
		{
			initial: [BfaaBootstrapHandler, AdvertisementLabelHandler, DebugTransitionHandler],
			impact: [BfaaImpactHandler],
			sticky: [BfaaStickyHandler, CloseButtonHandler],
			transition: [BfaaTransitionHandler],
			resolved: [BfaaResolvedHandler],
		},
		'initial',
	);
}
