import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AffiliateDisclaimerUcpHandler } from './handlers/affiliate-disclaimer/affiliate-disclaimer-ucp-handler';

export function registerAffiliateDisclaimerTemplate(
	registry: TemplateRegistry,
): Observable<TemplateAction> {
	return registry.register(
		'affiliateDisclaimer',
		{
			initial: [AffiliateDisclaimerUcpHandler],
		},
		'initial',
	);
}
