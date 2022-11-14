import { Targeting } from '@wikia/ad-engine';

export interface TaxonomyTags {
	age?: string[];
	bundles?: string[];
	esrb?: string[];
	gnre?: string[];
	media?: string[];
	mpa?: string[];
	pform?: string[];
	pub?: string[];
	sex?: string[];
	theme?: string[];
	tv?: string[];
}

// Added to exclude "esrb" and "mpa" tags from being combined and sent to GAM as duplicates to "rating"
// TODO - Remove after ADEN-12401 is done
export const taxonomyTags = [
	'age',
	'bundles',
	'gnre',
	'media',
	'pform',
	'pub',
	'sex',
	'theme',
	'tv',
];

export type TargetingTags = Partial<Targeting> | TaxonomyTags;
