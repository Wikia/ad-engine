interface Window {
	__cmpStored?: WindowCMP;
	ga?: (
		command: string,
		eventType: 'pageview' | 'event' | 'social' | 'timing',
		...opts: string[]
	) => void;
	mw: MediaWiki;
	RLQ?: any;
	XMLHttpRequest?: any;
	sessionId?: string;
	pvUID?: string;
	wgWikiaCookieDomain?: string;
	wgCookiePath?: string;
	beacon_id?: string;
	session_id?: string;
	wikiaSessionId?: string;
}
