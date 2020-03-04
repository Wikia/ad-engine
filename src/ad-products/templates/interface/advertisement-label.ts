import { getTranslation } from '../../common/i18n';
import { UiComponent } from './ui-component';

export class AdvertisementLabel extends UiComponent {
	render(): HTMLDivElement {
		const { isDarkTheme } = this.props;
		const label = document.createElement('div');
		const classNames = this.getClassNames();

		label.innerText = getTranslation('labels', 'advertisement');
		label.className = 'advertisement-label';

		return label;
	}

	getClassNames(): string[] {
		return ['advertisement-label', ...super.getClassNames()];
	}
}
