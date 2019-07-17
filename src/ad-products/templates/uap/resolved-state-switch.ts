import { localCache } from '@ad-engine/core';
import { universalAdPackage } from './universal-ad-package';

const cacheKey = 'adEngine_resolvedStateCounter';
const cacheTtl = 24 * 3600;
const now = new Date();

function createCacheKey() {
	return `${cacheKey}_${universalAdPackage.getUapId()}`;
}

function findRecordInCache() {
	return localCache.get(createCacheKey());
}

function wasDefaultStateSeen() {
	const record = findRecordInCache();

	// check for presence in localStorage and if present, make sure that we're
	// not comparing to current session data - bfab that wants to load after bfaa
	return !!record && now.getTime() !== record.lastSeenDate;
}

function updateInformationAboutSeenDefaultStateAd() {
	localCache.set(
		createCacheKey(),
		{
			adId: universalAdPackage.getUapId(),
			lastSeenDate: now.getTime(),
		},
		cacheTtl,
	);
}

export const resolvedStateSwitch = {
	updateInformationAboutSeenDefaultStateAd,
	wasDefaultStateSeen,
};
