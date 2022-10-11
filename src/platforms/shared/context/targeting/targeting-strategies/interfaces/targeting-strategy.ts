import { Targeting } from '@wikia/ad-engine';

export enum TargetingStrategy {
	SITE_CONTEXT = 'siteContext',
	PAGE_CONTEXT = 'pageContext',
	COMBINED = 'combined',
}

export enum TagsType {
	SITE = 'site',
	PAGE = 'page',
}

export interface TargetingStrategyInterface {
	execute(): Partial<Targeting>;
}
