export interface CookieBasedTargetingParams {
	ftag?: string;
	ttag?: string; // TODO: Is this key needed?
	pv?: string;
	session?: string;
	subses?: string;
}

export interface TargetingParams extends CookieBasedTargetingParams {
	category?: string;
	contentid_nr?: string;
	collection?: string;
	franchise?: string | string[];
	franchiseRoot?: string;
	game?: string;
	gnre?: string | string[];
	env?: string;
	pform?: string | string[];
	publisher?: string;
	pub?: string | string[];
	ptype?: string;
	rating?: string;
	rdate?: string;
	score?: string;
	theme?: string | string[];
	tv?: string | string[];
	user?: string;
	vguid?: string;
}
