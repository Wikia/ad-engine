export interface CommonTargetingParams {
	artid?: string;
	esrb?: string;
	kid_wiki?: '0' | '1';
	lang?: string;
	s0?: string;
	s0c?: string[];
	s0v?: string;
	s1?: string;
	s2?: string;
	wpage?: string;
	word_count?: string;
	// Cleanup in https://fandom.atlassian.net/browse/ADEN-13986
	main_vertical?: string;
	main_entity_type?: string;
}
