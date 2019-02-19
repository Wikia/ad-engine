import UiComponent from './ui-component';

export default class Button extends UiComponent {
	get classNames() {
		return ['button-control', ...super.classNames];
	}

	render() {
		const buttonElement = document.createElement('button');

		this.classNames.forEach((className) => buttonElement.classList.add(className));
		buttonElement.addEventListener('click', (event) => this.onClick(event));

		return buttonElement;
	}

	onClick(event) {
		const { onClick } = this.props;

		if (typeof onClick === 'function') {
			return onClick(event);
		}

		return undefined;
	}
}
