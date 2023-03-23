import { utils } from '@ad-engine/core';
import { resolvedStateSwitch } from './resolved-state-switch';

let resolveStateForcedExternally = false;

function getQueryParam(): string {
	return utils.queryString.get('resolved_state');
}

function isForcedByURLParam(): boolean {
	return [true, 'true', '1'].indexOf(getQueryParam()) > -1;
}

function forceUapResolveState(): void {
	resolveStateForcedExternally = true;
}

function isBlockedByURLParam(): boolean {
	return [false, 'blocked', 'false', '0'].indexOf(getQueryParam()) > -1;
}

function templateSupportsResolvedState(params): boolean {
	return !!(params.image1 && params.image1.resolvedStateSrc) || params.adProduct === 'vuap';
}

function isResolvedState(params): boolean {
	let result = false;

	if (templateSupportsResolvedState(params)) {
		const showResolvedState = !isBlockedByURLParam();
		let defaultStateSeen = true;

		if (showResolvedState) {
			defaultStateSeen =
				resolvedStateSwitch.wasDefaultStateSeen() ||
				isForcedByURLParam() ||
				resolveStateForcedExternally;
		}

		result = showResolvedState && defaultStateSeen;
	}

	return result;
}

export const resolvedState = {
	isResolvedState,
	updateInformationAboutSeenDefaultStateAd: () => {
		resolvedStateSwitch.updateInformationAboutSeenDefaultStateAd();
	},
	forceUapResolveState,
};
