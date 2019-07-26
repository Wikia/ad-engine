import { utils } from '@ad-engine/core';
import { InstantConfigGroup, negativePrefix } from '../instant-config.models';
import { extractNegation } from './negation-extractor';

export class DeviceMatcher {
	currentDevice: utils.DeviceType = utils.client.getDeviceType();

	isProperDevice(devices: InstantConfigGroup['devices'] = []): boolean {
		if (devices.length === 0) {
			return true;
		}

		if (devices.includes(`${negativePrefix}${this.currentDevice}`)) {
			return false;
		}

		return devices
			.map((device) => extractNegation(device))
			.some((object) => (object.value === this.currentDevice) !== object.negated);
	}
}
