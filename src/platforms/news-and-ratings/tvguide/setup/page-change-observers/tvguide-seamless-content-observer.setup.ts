import { SeamlessContentObserverSetup } from '../../../shared';

export class TvguideSeamlessContentObserverSetup extends SeamlessContentObserverSetup {
	protected notRequestedSlotWrapperSelector = '.c-adDisplay_container > .c-adDisplay:not(.gpt-ad)';
	protected elementToObserveMutationSelector = '.c-pageArticleContainer';
	protected dataAdAttribute = 'data-ad';
	protected useParentAsAdPlaceholder = false;
}
