import AdBlockDetect from 'blockadblock';
import currentDevice from 'current-device';

class Client {
	private bab: BlockAdBlock = null;
	private browser: string = null;
	private operatingSystem: string = null;

	isSmartphone(): boolean {
		return currentDevice.mobile();
	}

	isTablet(): boolean {
		return currentDevice.tablet();
	}

	isDesktop(): boolean {
		return !this.isSmartphone() && !this.isTablet();
	}

	checkBlocking(enabled: () => void = null, disabled: () => void = null): void {
		if (this.bab === null) {
			if (typeof AdBlockDetect === 'undefined' || typeof BlockAdBlock === 'undefined') {
				if (enabled !== null) enabled();

				return;
			}

			this.bab = new BlockAdBlock({
				checkOnLoad: false,
				resetOnEnd: true,
				loopCheckTime: 50,
				loopMaxNumber: 5,
			});
		}

		if (enabled !== null) this.bab.onDetected(enabled);
		if (disabled !== null) this.bab.onNotDetected(disabled);

		this.bab.check(true);
	}

	getDeviceType(): string {
		if (this.isTablet()) {
			return 'tablet';
		}
		if (this.isSmartphone()) {
			return 'smartphone';
		}

		return 'desktop';
	}

	getOperatingSystem(): string {
		if (this.operatingSystem !== null) {
			return this.operatingSystem;
		}

		const { userAgent } = window.navigator;

		this.operatingSystem = 'unknown';
		if (userAgent.indexOf('Win') !== -1) {
			this.operatingSystem = 'Windows';
		}
		if (userAgent.indexOf('Mac') !== -1) {
			this.operatingSystem = 'OSX';
		}
		if (userAgent.indexOf('Linux') !== -1) {
			this.operatingSystem = 'Linux';
		}
		if (userAgent.indexOf('Android') !== -1) {
			this.operatingSystem = 'Android';
		}
		if (userAgent.indexOf('like Mac') !== -1) {
			this.operatingSystem = 'iOS';
		}

		return this.operatingSystem;
	}

	getBrowser(): string {
		if (this.browser !== null) {
			return this.browser;
		}

		const { appName, appVersion, userAgent } = window.navigator;
		let temp: RegExpMatchArray;
		let matches =
			userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

		if (/trident/i.test(matches[1])) {
			temp = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
			this.browser = `IE ${temp[1] || ''}`;

			return this.browser;
		}
		if (matches[1] === 'Chrome') {
			temp = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
			if (temp !== null) {
				this.browser = temp
					.slice(1)
					.join(' ')
					.replace('OPR', 'Opera');

				return this.browser;
			}
		}

		matches = matches[2] ? [matches[1], matches[2]] : [appName, appVersion, '-?'];
		temp = userAgent.match(/version\/(\d+)/i);
		if (temp !== null) {
			matches.splice(1, 1, temp[1]);
		}
		this.browser = matches.join(' ');

		return this.browser;
	}
}

export const client = new Client();
