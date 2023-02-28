import { SeamlessContentObserverSetup } from '../../../shared';

export class TvGuideSeamlessContentObserverSetup extends SeamlessContentObserverSetup {
	protected notRequestedSlotWrapperSelector = '.c-adDisplay_container > .c-adDisplay:not(.gpt-ad)';
	protected elementToObserveMutationSelector = 'title';
	protected dataAdAttribute = 'data-ad';
	protected useParentAsAdPlaceholder = false;
}
