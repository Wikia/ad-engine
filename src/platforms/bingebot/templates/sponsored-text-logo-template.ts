import { TemplateAction, TemplateRegistry } from '@ad-engine/core';
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
