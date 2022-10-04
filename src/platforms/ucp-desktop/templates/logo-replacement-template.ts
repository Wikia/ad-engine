import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { LogoReplacementUcpDesktopHandler } from './handlers/logo-replacement/logo-replacement-ucp-desktop-handler';

export function registerLogoReplacementTemplate(
	registry: TemplateRegistry,
): Observable<TemplateAction> {
	return registry.register(
		'logoReplacement',
		{
			initial: [LogoReplacementUcpDesktopHandler],
		},
		'initial',
	);
}
