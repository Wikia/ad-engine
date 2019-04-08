export interface VideoEventPayload {
	ad_product: string;
	creative_id: string | number;
	event_name: string;
	line_item_id: string | number;
	player: string;
	position: string;
}

export interface VideoParams {
	adProduct: string;
}

export interface VideoListener {
	isEnabled(): void;
	onEvent(eventName: string, params: VideoParams, data: VideoEventPayload): void;
}

export {}; // tslint no-sole-types fix
