import { utils } from '@ad-engine/core';
import { resolvedStateSwitch } from './resolved-state-switch';
import { UapParams } from './universal-ad-package';

const DEFAULT_STATE = 'default';
const RESOLVED_STATE = 'resolved';

function getQueryParam(): string {
	return utils.queryString.get('resolved_state');
}

function isForcedByURLParam(): boolean {
	return [true, 'true', '1'].indexOf(getQueryParam()) > -1;
}

function isBlockedByURLParam(): boolean {
	return [false, 'blocked', 'false', '0'].indexOf(getQueryParam()) > -1;
}

function setState(state: string, params: UapParams): Promise<[UapParams, Event, Event?]> {
	const { image1, image2 } = params;
	const promises = [];

	let srcPropertyName = 'defaultStateSrc';

	if (state === RESOLVED_STATE) {
		params.aspectRatio = params.resolvedStateAspectRatio;
		srcPropertyName = 'resolvedStateSrc';
	}

	promises.push(Promise.resolve(params));
	image1.element.src = image1[srcPropertyName];
	promises.push(
		Promise.race<Event>([utils.once(image1.element, 'load'), utils.once(image1.element, 'error')]),
	);

	if (image2 && image2[srcPropertyName]) {
		image2.element.src = image2[srcPropertyName];
		promises.push(
			Promise.race<Event>([
				utils.once(image2.element, 'load'),
				utils.once(image2.element, 'error'),
			]),
		);
	}

	return Promise.all(promises) as Promise<[UapParams, Event, Event?]>;
}

function setDefaultState(params): Promise<[UapParams, Event, Event?]> {
	return setState(DEFAULT_STATE, params);
}

function setResolvedState(params): Promise<[UapParams, Event, Event?]> {
	return setState(RESOLVED_STATE, params);
}

function templateSupportsResolvedState(params): boolean {
	return !!(params.image1 && params.image1.resolvedStateSrc) || params.theme === 'hivi';
}

function isResolvedState(params): boolean {
	let result = false;

	if (params.resolvedStateForced) {
		return true;
	}

	if (templateSupportsResolvedState(params)) {
		const showResolvedState = !isBlockedByURLParam();
		let defaultStateSeen = true;

		if (showResolvedState) {
			defaultStateSeen = resolvedStateSwitch.wasDefaultStateSeen() || isForcedByURLParam();
		}

		result = showResolvedState && defaultStateSeen;
	}

	return result;
}

export const resolvedState = {
	// This method is used by classic UAP only (not-HiVi)
	// UAP:HiVi template does not support srcPropertyNames like defaultStateSrc
	// UAP:HiVi switch images in uap/themes/hivi/hivi.js by swapping hidden-state class
	// TODO: Remove this code once we get rid of old (classic) UAP
	setImage(videoSettings): Promise<unknown> {
		const params = videoSettings.getParams();

		if (templateSupportsResolvedState(params)) {
			if (videoSettings.isResolvedState()) {
				return setResolvedState(params).then(([updatedParams, ...args]) => {
					videoSettings.updateParams(updatedParams);

					return [updatedParams, ...args];
				});
			}

			resolvedStateSwitch.updateInformationAboutSeenDefaultStateAd();

			return setDefaultState(params);
		}

		return Promise.resolve();
	},
	isResolvedState,
	updateInformationAboutSeenDefaultStateAd: () => {
		resolvedStateSwitch.updateInformationAboutSeenDefaultStateAd();
	},
};
