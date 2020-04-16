export interface SkinParams {
	type: 'skin';
	/**
	 * URL to go when the background is clicked
	 */
	destUrl: string;
	/**
	 *  URL of the 1700x800 image to show in the background
	 */
	skinImage: string;
	/**
	 * background color to use (rrggbb, without leading #)
	 */
	backgroundColor: string;
	/**
	 * color to use in the middle (rrggbb, without leading #)
	 */
	middleColor: string;
	/**
	 * URLs of tracking pixels to append when showing the skin
	 */
	pixels: string[];
	ten64: boolean;
}
