import { timeouts } from 'common/timeouts';

class BillTheLizard {
	pageLink = 'services/bill-the-lizard/';
	lastCallStatus = '#status';
	lastCallPredictions = '#predictions';
	serialized = '#serialized';
	targeting = '#targeting';
	allPredictions = '#predictions-all';
	allStatuses = '#status-all';
	projects = {
		queenOfHears: 'queen_of_hearts',
		cheshireCat: 'cheshirecat',
	};
	lazyCallCheshireCatButton = '#lazyCallCat';
	lazyCallCheshireCatWithIdButton = '#lazyCallCatWithId';

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
