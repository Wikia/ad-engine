import * as svgs from './icons-data.json';

export interface Icons {
	CROSS: string;
	LEARN_MORE: string;
	PAUSE: string;
	PLAY: string;
	REPLAY: string;
	FULLSCREEN_OFF: string;
	FULLSCREEN_ON: string;
	VOLUME_OFF: string;
	VOLUME_ON: string;
	HIVI_VOLUME_OFF: string;
	HIVI_VOLUME_ON: string;
}

const parser: DOMParser = new window.DOMParser();

export function createIcon(iconName: string, classNames: string[] = []): HTMLElement | null {
	if (svgs[iconName]) {
		const element: HTMLElement = parser.parseFromString(svgs[iconName], 'image/svg+xml')
			.documentElement;

		// IE 11 doesn't support classList nor className on SVG elements
		element.setAttribute('class', classNames.join(' '));

		return element;
	}

	return null;
}

export const icons: Partial<Icons> = Object.keys(svgs).reduce((map, name) => {
	map[name] = name;

	return map as Icons;
}, {});
