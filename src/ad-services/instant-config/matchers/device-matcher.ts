import { utils } from '@ad-engine/core';
import { InstantConfigGroup } from '../instant-config.models';
import { extractNegation, NegationObject } from './negation-extractor';

export class DeviceMatcher {
	private currentDevice: utils.DeviceType = utils.client.getDeviceType();

	isValid(devices: InstantConfigGroup['devices'] = []): boolean {
		const deviceObjects = devices
			.map((browser) => browser.toLowerCase())
			.map((browser) => extractNegation(browser));

		if (deviceObjects.length === 0) {
			return true;
		}

		if (this.isCurrentNegated(deviceObjects)) {
			return false;
		}

		return deviceObjects.some((object) => (object.value === this.currentDevice) !== object.negated);
	}

	private isCurrentNegated(deviceObjects: NegationObject[]): boolean {
		return deviceObjects.some(
			(object) => this.currentDevice.includes(object.value) && object.negated,
		);
	}
}
