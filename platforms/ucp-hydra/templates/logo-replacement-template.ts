import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { LogoReplacementUcpHydraHandler } from './handlers/logo-replacement/logo-replacement-ucp-hydra-handler';

export function registerLogoReplacementTemplate(
	registry: TemplateRegistry,
): Observable<TemplateAction> {
	return registry.register(
		'logoReplacement',
		{
			initial: [LogoReplacementUcpHydraHandler],
		},
		'initial',
	);
}
