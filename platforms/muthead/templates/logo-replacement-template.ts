import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { LogoReplacementMutheadHandler } from './handlers/logo-replacement/logo-replacement-muthead-handler';

export function registerLogoReplacementTemplate(
	registry: TemplateRegistry,
): Observable<TemplateAction> {
	return registry.register(
		'logoReplacement',
		{
			initial: [LogoReplacementMutheadHandler],
		},
		'initial',
	);
}
