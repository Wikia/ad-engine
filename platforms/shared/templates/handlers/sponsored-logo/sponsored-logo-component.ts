import { SponsoredLogoParams } from './sponsored-logo-params';

export const sponsoredLogoComponent = (params: SponsoredLogoParams) => `
<div class="sponsored-logo">
	<div class="promo-title">Sponsored By</div>
	<p class="promo-text">${params.text}</p>
</div>
`;
