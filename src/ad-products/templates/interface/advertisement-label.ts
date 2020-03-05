import { getTranslation } from '../../common/i18n';
import { UiComponent } from './ui-component';

export class AdvertisementLabel extends UiComponent {
	render(): HTMLDivElement {
		const label = document.createElement('div');

		label.innerText = getTranslation('labels', 'advertisement');
		label.className = 'advertisement-label';

		return label;
	}
}
