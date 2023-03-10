import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { LogoReplacementUcpMobileHandler } from './handlers/logo-replacement/logo-replacement-ucp-mobile-handler';

export function registerLogoReplacementTemplate(
	registry: TemplateRegistry,
): Observable<TemplateAction> {
	return registry.register(
		'logoReplacement',
		{
			initial: [LogoReplacementUcpMobileHandler],
		},
		'initial',
	);
}
