import { expect } from 'chai';

import { getPageType, PageTypes } from '@wikia/platforms/sports/utils/pagetype-helper';

const testData: Array<{ pathName: string; expectedResult: PageTypes }> = [
	{ pathName: '/', expectedResult: 'home' },
	{ pathName: '/random-subpage/123/', expectedResult: 'main' },
	{ pathName: '/latest/', expectedResult: 'latest' },
	{
		pathName: '/news/totw-predictions/2550/fifa-23-team-of-the-week-14-prediction/',
		expectedResult: 'news',
	},
	{ pathName: '/23/players/18509/erling-haaland/', expectedResult: 'players' },
	{ pathName: '/23/squad-builder/', expectedResult: 'squad_builder' },
	{ pathName: '/22/squads/12345/', expectedResult: 'squads' },
	{ pathName: '/talk/12345-futhead/test-thread', expectedResult: 'talk' },
];

describe('pagetype helper', () => {
	testData.forEach(({ pathName, expectedResult }) =>
		it(`returns correct page type - ${expectedResult}`, () => {
			expect(getPageType(pathName)).to.equal(expectedResult);
		}),
	);
});
