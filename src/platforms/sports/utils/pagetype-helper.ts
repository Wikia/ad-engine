export type PageTypes =
	| 'home'
	| 'latest'
	| 'main'
	| 'news'
	| 'players'
	| 'squads'
	| 'squad_builder'
	| 'talk';

export function getPageType(pathName: string): PageTypes {
	switch (true) {
		case pathName === '/':
			return 'home';

		case /latest/.test(pathName):
			return 'latest';

		case /news/.test(pathName):
			return 'news';

		case /players/.test(pathName):
			return 'players';

		case /squad-builder/.test(pathName):
			return 'squad_builder';

		case /squads/.test(pathName):
			return 'squads';

		case /talk/.test(pathName):
			return 'talk';

		default:
			return 'main';
	}
}
