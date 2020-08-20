import { DiProcess, logTemplates, TemplateRegistry, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge } from 'rxjs';
import { BingebotThemeProvider } from '../utils/bingebot-theme-provider';
import { registerSponsoredLogoTemplate } from './sponsored-logo-template';
import { registerSponsoredTextLogoTemplate } from './sponsored-text-logo-template';

@Injectable()
export class BingebotTemplatesSetup implements DiProcess {
	constructor(private registry: TemplateRegistry, private themeProvider: BingebotThemeProvider) {
		templateService.setInitializer(this.registry);
	}

	async execute(): Promise<void> {
		const sponsoredLogo$ = registerSponsoredLogoTemplate(this.registry);
		const sponsoredTextLogo$ = await registerSponsoredTextLogoTemplate(
			this.registry,
			this.themeProvider,
		);

		logTemplates(merge(sponsoredLogo$, sponsoredTextLogo$));
	}
}
