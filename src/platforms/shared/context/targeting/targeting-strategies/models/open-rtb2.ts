/**
 * @see: https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf
 * OpenRTB2.5 is only used by A9 which implements Site and User sections.
 * From FandomContext we can obtain details about Site.
 */
export interface OpenRtb2Object {
	// Section 3.2.13 - Object: Site
	site: {
		id: string;
		name: string;
		domain: string;
		cat: OpenRtb2ContentCategories[];
		mobile: 0 | 1;
		// Section 3.2.16 - Object: Content
		content: {
			language: string;
			// Section 5.18 - Content Context
			context: number;
		};
		keywords: string;
	};
	// Section 3.2.20 - Object: User
	user: Record<string, never>; // currently not used
}

// Section: 5.1 - Content Categories
export enum OpenRtb2ContentCategories {
	// IAB1 Arts & Entertainment
	BOOKS = 'IAB1-1',
	MOVIES = 'IAB1-5',
	MUSIC = 'IAB1-6',
	TV = 'IAB1-7',
	// IAB9 Hobbies & Interests
	CARD_GAMES = 'IAB9-7',
	COMIC_BOOKS = 'IAB9-11',
	GAMES = 'IAB9-30',
}
