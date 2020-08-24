import { SponsoredTextLogoHandler } from '@platforms/shared';
import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';

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
