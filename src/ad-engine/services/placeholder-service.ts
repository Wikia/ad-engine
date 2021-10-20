class PlaceholderService {
	stopLoading = (slotName: string, withHide: string = ''): void => {
		const parentClass = `.${slotName.replace('_', '-')}`;
		const placeholder: HTMLElement = document.querySelector(parentClass);

		placeholder?.classList.remove('is-loading');

		if (withHide === 'placeholder') {
			placeholder?.setAttribute('style', 'display: none');
		} else if (withHide === 'parent') {
			placeholder?.parentElement?.setAttribute('style', 'display: none');
		}
	};

	addAdvertisementLabel = (className: string): void => {
		const classElements: NodeListOf<HTMLElement> = document.querySelectorAll(className);

		classElements?.forEach((element) => {
			const div = document.createElement('div');
			div.className = 'ae-translatable-label';
			div.innerText = 'Advertisement';
			element.appendChild(div);
		});
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
