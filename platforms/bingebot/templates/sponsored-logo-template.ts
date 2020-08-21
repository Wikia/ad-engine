import { SponsoredLogoHandler } from '@platforms/shared';
import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';

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
