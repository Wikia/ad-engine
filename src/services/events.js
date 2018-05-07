import EventEmitter from 'eventemitter3';

class EventService extends EventEmitter {
	PAGE_CHANGE_EVENT = Symbol('pageChange');
	LOAD_EVENT = Symbol('load');
	MENU_OPEN_EVENT = Symbol('menuOpen');
	AFTER_PAGE_WITH_ADS_RENDER_EVENT = Symbol('afterPageWithAdsRender');

	pageChange(...args) {
		this.emit(this.PAGE_CHANGE_EVENT, ...args);
	}

	afterPageWithAdsRender(...args) {
		this.emit(this.AFTER_PAGE_WITH_ADS_RENDER_EVENT, ...args);
	}

	menuOpen(...args) {
		this.emit(this.MENU_OPEN_EVENT, ...args);
	}

	load(...args) {
		this.emit(this.LOAD_EVENT, ...args);
	}
}

export const events = new EventService();
