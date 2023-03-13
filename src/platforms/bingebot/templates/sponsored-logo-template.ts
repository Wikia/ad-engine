import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { SponsoredLogoHandler } from './handlers/sponsored-logo/sponsored-logo-handler';

export function registerSponsoredLogoTemplate(
	registry: TemplateRegistry,
): Observable<TemplateAction> {
	return registry.register(
		'sponsored-logo',
		{
			initial: [SponsoredLogoHandler],
		},
		'initial',
	);
}
