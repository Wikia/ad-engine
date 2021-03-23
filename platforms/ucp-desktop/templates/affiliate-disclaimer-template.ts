import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { AffiliateDisclaimerUcpDesktopHandler } from './handlers/affiliate-disclaimer/affiliate-disclaimer-ucp-desktop-handler';

export function registerAffiliateDisclaimerTemplate(
	registry: TemplateRegistry,
): Observable<TemplateAction> {
	return registry.register(
		'affiliateDisclaimer',
		{
			initial: [AffiliateDisclaimerUcpDesktopHandler],
		},
		'initial',
	);
}
