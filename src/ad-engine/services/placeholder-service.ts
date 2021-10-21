import { context } from './context-service';

class PlaceholderService {
	stopLoading = (placeholder: HTMLElement, withHide: string = ''): void => {
		placeholder.parentElement.classList.remove('is-loading');

		if (withHide === 'placeholder') {
			placeholder?.setAttribute('style', 'display: none');
		} else if (withHide === 'parent') {
			placeholder?.parentElement?.setAttribute('style', 'display: none');
		}
	};

	removeAdLabel = (placeholder: HTMLElement): void => {
		if (!context.get(`slots.${placeholder.id}.label`)) {
			return;
		}

		const parentElement =
			placeholder.id === 'top_leaderboard'
				? placeholder.parentElement.parentElement
				: placeholder.parentElement;

		const labelElement = parentElement.querySelector('.ae-translatable-label');
		labelElement?.classList.add('hide');
	};
}

export const placeholderService = new PlaceholderService();
