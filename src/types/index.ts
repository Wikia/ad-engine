interface Ads {
	runtime: any;
}

interface Window {
	ads?: Ads;
	[key: string]: any;
}
