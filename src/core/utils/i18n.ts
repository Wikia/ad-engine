import { TRANSLATIONS } from './translations';

const defaultLanguage = 'en';

export function getTranslation(key: string): string {
	const lang = window.ads.context?.targeting.wikiLanguage;
	const language = lang && typeof TRANSLATIONS[lang] !== 'undefined' ? lang : defaultLanguage;

	return TRANSLATIONS[language][key] || TRANSLATIONS[defaultLanguage][key];
}

export function translateLabels(): void {
	const labels = document.querySelectorAll('.ae-translatable-label');

	labels.forEach((label: HTMLElement) => {
		const key = label.dataset.key;
		const translation = getTranslation(key);

		if (translation) {
			label.innerText = translation;
		}
	});
}
