import { context } from '../services/context-service';
import { TRANSLATIONS } from './translations';

const defaultLanguage = 'en';

export function getTranslation(category: string, key: string): string {
	const lang = context.get('wiki.targeting.wikiLanguage');
	const language =
		lang && typeof TRANSLATIONS[category][lang] !== 'undefined' ? lang : defaultLanguage;

	return TRANSLATIONS[category][language][key] || TRANSLATIONS[category][defaultLanguage][key];
}

export function translateLabels(): void {
	const labels = document.querySelectorAll('.ae-translatable-label');

	labels.forEach((label: HTMLElement) => {
		const key = label.dataset.key;
		const translation = getTranslation('labels', key);

		if (translation) {
			label.innerText = translation;
		}
	});
}
