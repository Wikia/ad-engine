import { context } from '@wikia/ad-engine';
import { TRANSLATIONS } from './translations';

const defaultLanguage = 'en';

export function getTranslation(category, key) {
	const lang = context.get('options.contentLanguage');
	const language =
		lang && typeof TRANSLATIONS[category][lang] !== 'undefined' ? lang : defaultLanguage;

	return TRANSLATIONS[category][language][key] || TRANSLATIONS[category][defaultLanguage][key];
}
