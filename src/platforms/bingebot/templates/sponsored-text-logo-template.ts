import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { SponsoredTextLogoHandler } from './handlers/sponsored-text-logo/sponsored-text-logo-handler';

export function registerSponsoredTextLogoTemplate(
	registry: TemplateRegistry,
): Observable<TemplateAction> {
	return registry.register(
		'sponsored-text-logo',
		{
			initial: [SponsoredTextLogoHandler],
		},
		'initial',
	);
}
