import Button from './button';
import { createIcon, icons } from './icons';
import UiComponent from './ui-component';

export default class CloseButton extends UiComponent {
	get classNames() {
		return ['button-close', ...super.classNames];
	}

	render() {
		const { onClick } = this.props;
		const { classNames } = this;
		const button = new Button({ onClick, classNames }).render();
		const closeIcon = createIcon(icons.CROSS, ['icon']);

		button.appendChild(closeIcon);

		return button;
	}
}
