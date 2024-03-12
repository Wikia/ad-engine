import { getTranslation } from '../../../core/utils/i18n';
import { UiComponent } from './ui-component';

export class AdvertisementLabel extends UiComponent {
	render(): HTMLDivElement {
		const label = document.createElement('div');

		label.innerText = getTranslation('advertisement');
		label.className = 'advertisement-label';

		return label;
	}
}
