import { SponsoredTextLogoParams } from './sponsored-text-logo-params';

export interface SponsoredTextLogoComponentConfig {
	lineColor: string;
}

export const sponsoredTextLogoComponent = (
	params: SponsoredTextLogoParams,
	config: SponsoredTextLogoComponentConfig,
) => `
<div class="title-container">
	<hr class="title-line" style="border-color: ${config.lineColor}" />
	<div class="promo-title">Sponsored By</div>
	<hr class="title-line" />
</div>
<p class="promo-text">${params.text}</p>
`;
