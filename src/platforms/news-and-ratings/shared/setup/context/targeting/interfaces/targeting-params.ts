export interface CookieBasedTargetingParams {
	ftag?: string;
	ttag?: string; // TODO: Is this key needed?
	pv?: string;
	session?: string;
	subses?: string;
}

export interface TargetingParams extends CookieBasedTargetingParams {
	category?: string;
	cid?: string;
	con?: string;
	collection?: string;
	franchise?: string;
	game?: string;
	genre?: string;
	env?: string;
	publisher?: string;
	ptype?: string;
	rating?: string;
	rdate?: string;
	score?: string;
	user?: string;
	vguid?: string;
}
