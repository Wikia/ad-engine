declare module 'current-device' {
	class CurrentDevice {
		readonly orientation: DeviceOrientation;
		readonly type: DeviceType;
		readonly os: OsType;

		macos(): boolean;
		ios(): boolean;
		iphone(): boolean;
		ipod(): boolean;
		ipad(): boolean;
		android(): boolean;
		androidPhone(): boolean;
		androidTablet(): boolean;
		blackberry(): boolean;
		blackberryPhone(): boolean;
		blackberryTablet(): boolean;
		windows(): boolean;
		windowsPhone(): boolean;
		windowsTablet(): boolean;
		fxos(): boolean;
		fxosPhone(): boolean;
		fxosTablet(): boolean;
		meego(): boolean;
		cordova(): boolean;
		nodeWebkit(): boolean;
		mobile(): boolean;
		tablet(): boolean;
		desktop(): boolean;
		television(): boolean;

		portrait(): boolean;
		landscape(): boolean;
		onChangeOrientation(cb: (newOrientation: DeviceOrientation) => void): void;

		noConflict(): CurrentDevice;
	}

	export type DeviceOrientation = 'landscape' | 'portrait' | 'unknown';
	export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';
	export type OsType =
		| 'ios'
		| 'iphone'
		| 'ipad'
		| 'ipod'
		| 'android'
		| 'blackberry'
		| 'windows'
		| 'fxos'
		| 'meego'
		| 'television'
		| 'unknown';

	const instance: CurrentDevice;
	export default instance;
}
