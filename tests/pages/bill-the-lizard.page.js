import { timeouts } from '../common/timeouts';

class BillTheLizard {
	constructor() {
		this.pageLink = 'services/bill-the-lizard/';
		this.lastCallStatus = '#status';
		this.lastCallPredictions = '#predictions';
		this.serialized = '#serialized';
		this.targeting = '#targeting';
		this.allPredictions = '#predictions-all';
		this.allStatuses = '#status-all';

		this.projects = {
			queenOfHears: 'queen_of_hearts',
			cheshireCat: 'cheshirecat',
		};

		this.lazyCallCheshireCatButton = '#lazyCallCat';
		this.lazyCallCheshireCatWithIdButton = '#lazyCallCatWithId';
	}

	getLastCallStatus() {
		return $(this.lastCallStatus).getText();
	}

	getLastCallPredictions() {
		return $(this.lastCallPredictions).getText();
	}

	getSerializedValue() {
		return $(this.serialized).getText();
	}

	getTargetingValue() {
		return $(this.targeting).getText();
	}

	getAllPredictions() {
		return $(this.allPredictions).getText();
	}

	getAllStatuses() {
		return $(this.allStatuses).getText();
	}

	lazyLoadCheshireCat() {
		$(this.lazyCallCheshireCatButton).waitForEnabled(timeouts.standard);
		$(this.lazyCallCheshireCatButton).click();
	}

	lazyLoadCheshireCatWithId() {
		$(this.lazyCallCheshireCatWithIdButton).waitForEnabled(timeouts.standard);
		$(this.lazyCallCheshireCatWithIdButton).click();
	}
}

export const billTheLizard = new BillTheLizard();
