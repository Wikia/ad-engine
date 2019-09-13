interface Window {
	ga?: (
		command: string,
		eventType: 'pageview' | 'event' | 'social' | 'timing',
		...opts: string[]
	) => void;
	mw: MediaWiki;
	RLQ?: any;
	trackingOptIn: any;
	pvUID?: string;
	wgCookiePath?: string;
	beacon_id?: string;
	session_id?: string;
}
