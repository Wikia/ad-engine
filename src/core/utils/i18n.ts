// @ts-strict-ignore
import { context } from '../services/context-service';
import { TRANSLATIONS } from './translations';

const defaultLanguage = 'en';

export function getTranslation(key: string): string {
	const lang = context.get('wiki.targeting.wikiLanguage');
	const language = lang && typeof TRANSLATIONS[lang] !== 'undefined' ? lang : defaultLanguage;

	return TRANSLATIONS[language][key] || TRANSLATIONS[defaultLanguage][key];
}
