import { utils } from '@ad-engine/core';
import { InstantConfigGroup } from './instant-config.models';

export class DeviceMatcher {
	currentDevice: utils.DeviceType = utils.client.getDeviceType();

	isProperDevice(devices: InstantConfigGroup['devices'] = []): boolean {
		if (devices.length === 0) {
			return true;
		}

		if (devices.includes(`non-${this.currentDevice}`)) {
			return false;
		}

		return devices
			.map((device) => this.mapDevice(device))
			.some((value) => (value.device === this.currentDevice) !== value.negated);
	}

	private mapDevice(device): { negated: boolean; device: any } {
		return device.startsWith('non-')
			? { device: device.replace('non-', ''), negated: true }
			: { device, negated: false };
	}
}
