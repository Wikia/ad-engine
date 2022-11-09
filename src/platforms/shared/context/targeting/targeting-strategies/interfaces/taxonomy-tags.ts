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

export type TargetingTags = Partial<Targeting> | TaxonomyTags;
