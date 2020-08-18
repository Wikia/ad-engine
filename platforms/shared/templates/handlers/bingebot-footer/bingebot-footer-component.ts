import { BingebotFooterParams } from './bingebot-footer-params';

export const bingebotFooterComponent = (params: BingebotFooterParams) => `
<div class="bingebot-footer">
	<p>${params.text}</p>
	<a href="${params.ctrUrl}" rel="noopener noreferrer" target="_blank">
		<img src="${params.imageUrl}">
	</a>
</div>
`;
