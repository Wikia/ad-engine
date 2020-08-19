import { SponsoredTextLogoParams } from './sponsored-text-logo-params';

export const sponsoredTextLogoComponent = (params: SponsoredTextLogoParams) => `
<div class="sponsored-text-logo">
	<div class="title-container">
		<hr class="title-line" />
		<div class="promo-title">Sponsored By</div>
		<hr class="title-line" />
	</div>
	<p class="promo-text">${params.text}</p>
</div>
`;
