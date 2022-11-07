import { Targeting } from '@wikia/ad-engine';

export interface TaxonomyTags {
	age?: string[];
	bundles?: string[];
	gnre?: string[];
	media?: string[];
	pform?: string[];
	pub?: string[];
	sex?: string[];
	theme?: string[];
	tv?: string[];
}

export type TargetingTags = Partial<Targeting> | TaxonomyTags;
