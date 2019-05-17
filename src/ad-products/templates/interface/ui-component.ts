export abstract class UiComponent {
	constructor(props = {}) {
		this.props = props;
		this.id = Math.floor(Math.random() * 100);
	}

	abstract render(): HTMLElement;

	getClassNames(): string[] {
		return this.props.classNames || [];
	}
}
