/* global BlockAdBlock */
import AdBlockDetect from 'blockadblock';
import currentDevice from 'current-device';

let bab = null;
let browser = null;
let operatingSystem = null;

class Client {
	isSmartphone() {
		return currentDevice.mobile();
	}

	isTablet() {
		return currentDevice.tablet();
	}

	isDesktop() {
		return !this.isSmartphone() && !this.isTablet();
	}

	checkBlocking(enabled = null, disabled = null) {
		if (bab === null) {
			if (typeof AdBlockDetect === 'undefined' || typeof BlockAdBlock === 'undefined') {
				if (enabled !== null) enabled();

				return;
			}

			bab = new BlockAdBlock({
				checkOnLoad: false,
				resetOnEnd: true,
				loopCheckTime: 50,
				loopMaxNumber: 5,
			});
		}

		if (enabled !== null) bab.onDetected(enabled);
		if (disabled !== null) bab.onNotDetected(disabled);

		bab.check(true);
	}

	getDeviceType() {
		if (this.isTablet()) {
			return 'tablet';
		}
		if (this.isSmartphone()) {
			return 'smartphone';
		}

		return 'desktop';
	}

	getOperatingSystem() {
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

	getBrowser() {
		if (browser !== null) {
			return browser;
		}

		const { appName, appVersion, userAgent } = window.navigator;
		let temp;
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
