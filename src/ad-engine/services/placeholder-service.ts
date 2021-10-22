class PlaceholderService {
	stopLoading = (slotName: string, withHide: string = ''): void => {
		const slotElement: HTMLElement = document.querySelector(`#${slotName}`);
		const placeholder = slotElement?.parentElement;

		placeholder?.classList.remove('is-loading');

		if (withHide === 'slot') {
			slotElement?.setAttribute('style', 'display: none');
		} else if (withHide === 'placeholder') {
			placeholder?.setAttribute('style', 'display: none');
		}
	};
}

export const placeholderService = new PlaceholderService();
