// blockadblock doesn't export anything meaningful
// it sets blockAdBlock and BlockAdBlock properties on window
import 'blockadblock';
import currentDevice from 'current-device';

let bab: BlockAdBlock;
let browser: string = null;
let isBabInitialised = false;
let operatingSystem: string = null;

export type DeviceType = 'tablet' | 'smartphone' | 'desktop';

function setupBab(): void {
	bab = new BlockAdBlock({
		checkOnLoad: false,
		resetOnEnd: true,
		loopCheckTime: 50,
		loopMaxNumber: 5,
	});
	isBabInitialised = true;
}

class Client {
	isSmartphone(): boolean {
		return currentDevice.mobile();
	}

	isTablet(): boolean {
		return currentDevice.tablet();
	}

	isDesktop(): boolean {
		return !this.isSmartphone() && !this.isTablet();
	}

	checkBlocking(enabled = () => {}, disabled = () => {}): Promise<boolean> {
		return new Promise((resolve) => {
			if (!isBabInitialised) {
				if (typeof BlockAdBlock === 'undefined') {
					resolve(true);

					return;
				}
				setupBab();
			}

			bab.onDetected(() => resolve(true));
			bab.onNotDetected(() => resolve(false));

			bab.check(true);
		}).then(
			(detected: boolean): boolean => {
				if (detected) {
					enabled();
				} else {
					disabled();
				}

				return detected;
			},
		);
	}

	getDeviceType(): DeviceType {
		if (this.isTablet()) {
			return 'tablet';
		}
		if (this.isSmartphone()) {
			return 'smartphone';
		}

		return 'desktop';
	}

	getOperatingSystem(): string {
		if (operatingSystem !== null) {
			return operatingSystem;
		}

		const { userAgent } = window.navigator;

		operatingSystem = 'unknown';
		if (userAgent.indexOf('Win') !== -1) {
			operatingSystem = 'Windows';
		}
		if (userAgent.indexOf('Mac') !== -1) {
			operatingSystem = 'OSX';
		}
		if (userAgent.indexOf('Linux') !== -1) {
			operatingSystem = 'Linux';
		}
		if (userAgent.indexOf('Android') !== -1) {
			operatingSystem = 'Android';
		}
		if (userAgent.indexOf('like Mac') !== -1) {
			operatingSystem = 'iOS';
		}

		return operatingSystem;
	}

	getBrowser(): string {
		if (browser !== null) {
			return browser;
		}

		const { appName, appVersion, userAgent } = window.navigator;
		let temp: RegExpMatchArray;
		let matches =
			userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

		if (/trident/i.test(matches[1])) {
			temp = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
			browser = `IE ${temp[1] || ''}`;

			return browser;
		}
		if (matches[1] === 'Chrome') {
			temp = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
			if (temp !== null) {
				browser = temp
					.slice(1)
					.join(' ')
					.replace('OPR', 'Opera');

				return browser;
			}
		}

		matches = matches[2] ? [matches[1], matches[2]] : [appName, appVersion, '-?'];
		temp = userAgent.match(/version\/(\d+)/i);
		if (temp !== null) {
			matches.splice(1, 1, temp[1]);
		}
		browser = matches.join(' ');

		return browser;
	}
}

export const client = new Client();
