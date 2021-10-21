class PlaceholderService {
	stopLoading = (placeholder: HTMLElement, withHide: string = ''): void => {
		placeholder?.parentElement.classList.remove('is-loading');

		if (withHide === 'placeholder') {
			placeholder?.setAttribute('style', 'display: none');
		} else if (withHide === 'parent') {
			placeholder?.parentElement?.setAttribute('style', 'display: none');
		}
	};

	removeAdLabel = (slotName: string): void => {
		const parentElement =
			slotName !== 'top_leaderboard'
				? document.querySelector(`#${slotName}`).parentElement
				: document.querySelector('.top-ads-container');

		let adLabel: HTMLElement;
		for (const child of parentElement.children as any) {
			if (child.className.includes('ae-translatable-label')) {
				adLabel = child;
			}
		}
		adLabel?.classList.add('hide');
	};
}

export const placeholderService = new PlaceholderService();
