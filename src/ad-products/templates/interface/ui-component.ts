export default class UiComponent {
	get classNames() {
		return this.props.classNames || [];
	}

	constructor(props = {}) {
		this.props = props;
	}

	render() {
		return document.createDocumentFragment();
	}
}
