export interface PrefixableTaxonomyTags {
	gnre?: string[];
	media?: string[];
	pform?: string[];
	pub?: string[];
	theme?: string[];
	tv?: string[];
}

export interface TaxonomyTags extends PrefixableTaxonomyTags {
	age?: string[];
	bundles?: string[];
	sex?: string[];
}
