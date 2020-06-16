import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { LogoReplacementHandler } from './handlers/logo-replacement/logo-replacement-handler';

export function registerLogoReplacementTemplate(
	registry: TemplateRegistry,
): Observable<TemplateAction> {
	return registry.register(
		'logoReplacement',
		{
			initial: [LogoReplacementHandler],
		},
		'initial',
	);
}
