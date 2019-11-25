export interface JWPlayerPayload {
	autostart: boolean; // from config
	mute: boolean; // from getMute
}

export interface JWPlayerBeforePlayPayload {
	mediaid: string; // from playlist item
}
