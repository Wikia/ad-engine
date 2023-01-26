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
	franchise?: string;
	game?: string;
	gnre?: string;
	env?: string;
	pform?: string;
	publisher?: string;
	ptype?: string;
	rating?: string;
	rdate?: string;
	score?: string;
	tv?: string;
	user?: string;
	vguid?: string;
}
