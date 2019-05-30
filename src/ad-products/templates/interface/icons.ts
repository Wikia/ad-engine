import * as svgs from './icons-data.json';

const parser = new window.DOMParser();

export function createIcon(iconName, classNames = []) {
	if (svgs[iconName]) {
		const element = parser.parseFromString(svgs[iconName], 'image/svg+xml').documentElement;

		// IE 11 doesn't support classList nor className on SVG elements
		element.setAttribute('class', classNames.join(' '));

		return element;
	}

	return null;
}

export const icons = Object.keys(svgs).reduce((map, name) => {
	map[name] = name;

	return map;
}, {});
