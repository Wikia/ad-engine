class StickyTlb {
	constructor() {
		this.pageLink = 'templates/sticky-tlb/';
		this.stickedAd = '.sticky-bfaa';
		this.unstickedAd = '.theme-resolved';
		this.classUnstickButton = '.button-unstick';
	}

	isAdSticked() {
		return $(this.stickedAd).isExisting() && !$(this.unstickedAd).isExisting();
	}
}

export const stickyTlb = new StickyTlb();
