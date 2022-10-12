export interface RoadblockParams {
	/**
	 * @default uap
	 */
	adProduct: string;
	newTakeoverConfig?: boolean;
	stickedTlb?: boolean;
	type: 'roadblock';
	uap: string;
}
