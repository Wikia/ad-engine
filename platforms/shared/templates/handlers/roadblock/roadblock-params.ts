export interface RoadblockParams {
	newTakeoverConfig: boolean;
	type: 'roadblock';
	uap: string;
	/**
	 * @default uap
	 */
	adProduct: string;
}
