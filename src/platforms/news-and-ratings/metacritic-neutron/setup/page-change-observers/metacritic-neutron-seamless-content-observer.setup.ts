import { SeamlessContentObserverSetup } from '../../../shared';

export class MetacriticNeutronSeamlessContentObserverSetup extends SeamlessContentObserverSetup {
	protected notRequestedSlotWrapperSelector = '.c-adDisplay_container > .c-adDisplay:not(.gpt-ad)';
	protected dataAdAttribute = 'data-ad';
	protected useParentAsAdPlaceholder = false;
}
