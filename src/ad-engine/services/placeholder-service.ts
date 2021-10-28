class PlaceholderService {
	stopLoading = (slotName: string): void => {
		const slotElement: HTMLElement = document.querySelector(`#${slotName}`);
		const placeholder: HTMLElement = slotElement?.parentElement;

		placeholder?.classList.remove('is-loading');
	};

	hidePlaceholder = (slotName: string): void => {
		const slotElement: HTMLElement = document.querySelector(`#${slotName}`);
		const placeholder: HTMLElement =
			slotName === 'top_leaderboard'
				? document.querySelector('.top-ads-container')
				: slotElement?.parentElement;

		placeholder?.classList.add('hide');
	};
}

export const placeholderService = new PlaceholderService();
