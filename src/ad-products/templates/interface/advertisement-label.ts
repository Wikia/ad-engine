import { utils } from '@ad-engine/core';
import { UiComponent } from './ui-component';

export class AdvertisementLabel extends UiComponent {
	render(): HTMLDivElement {
		const label = document.createElement('div');

		label.innerText = utils.getTranslation('advertisement');
		label.className = 'advertisement-label';

		return label;
	}
}
