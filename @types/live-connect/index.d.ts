interface LiQ {
	resolve: (
		success: (response: LiQResolveResponse) => void,
		error: (err: string) => void,
		params?: LiQParams,
	) => void;
}

interface LiQResolveResponse {
	sha1?: string;
	sha2?: string;
	md5?: string;
	unifiedId?: string;
}

interface LiQParams {
	qf: string;
	resolve: LiQResolveParams[];
}

type LiQResolveParams = 'sha1' | 'sha2' | 'md5' | 'unifiedId';
