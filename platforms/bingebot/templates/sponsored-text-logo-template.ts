import { SponsoredTextLogoHandler } from '@platforms/shared';
import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { BingebotThemeProvider } from '../utils/bingebot-theme-provider';

export async function registerSponsoredTextLogoTemplate(
	registry: TemplateRegistry,
	themeProvider: BingebotThemeProvider,
): Promise<Observable<TemplateAction>> {
	return registry.register(
		'sponsored-text-logo',
		{
			initial: [SponsoredTextLogoHandler],
		},
		'initial',
		[SponsoredTextLogoHandler.config({ lineColor: (await themeProvider.theme).color.offBody })],
	);
}
