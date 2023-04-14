export enum AdSlotEvent {
	CUSTOM_EVENT = 'customEvent',
	SLOT_ADDED_EVENT = 'slotAdded',
	SLOT_REQUESTED_EVENT = 'slotRequested',
	SLOT_LOADED_EVENT = 'slotLoaded',
	SLOT_VIEWED_EVENT = 'slotViewed',
	SLOT_RENDERED_EVENT = 'slotRendered',
	SLOT_VISIBILITY_CHANGED = 'slotVisibilityChanged',
	SLOT_BACK_TO_VIEWPORT = 'slotBackToViewport',
	SLOT_LEFT_VIEWPORT = 'slotLeftViewport',
	SLOT_STATUS_CHANGED = 'slotStatusChanged',
	DESTROYED_EVENT = 'slotDestroyed',
	DESTROY_EVENT = 'slotDestroy',
	HIDDEN_EVENT = 'slotHidden',
	SHOWED_EVENT = 'slotShowed',

	VIDEO_VIEWED_EVENT = 'videoViewed',
	VIDEO_AD_REQUESTED = 'videoAdRequested',
	VIDEO_AD_ERROR = 'videoAdError',
	VIDEO_AD_IMPRESSION = 'videoAdImpression',
	VIDEO_AD_USED = 'videoAdUsed',

	TEMPLATES_LOADED = 'Templates Loaded',
}
