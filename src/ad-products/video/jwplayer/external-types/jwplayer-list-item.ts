export interface JWPlayerListItem {
	sources: Source[];
	tracks: Track[];
	minDvrWindow: number;
	dvrSeekLimit: number;
	mediaid: string;
	description: string;
	pubdate: number;
	title: string;
	image: string;
	tags: string;
	variations: any[];
	images: Image[];
	link: string;
	duration: number;
	preload: string;
	allSources: AllSource[];
	file: string;
	feedData: FeedData;
}

type FeedData = any;

interface AllSource {
	default: boolean;
	type: string;
	file: string;
	label: string;
	mimeType: string;
	preload: string;
	width?: number;
	height?: number;
}

interface Image {
	src: string;
	type: string;
	width: number;
}

interface Track {
	kind: string;
	default: boolean;
	file: string;
}

interface Source {
	default: boolean;
	type: string;
	file: string;
	label: string;
	mimeType: string;
	preload: string;
}
