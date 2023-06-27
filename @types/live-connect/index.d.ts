interface LiQ {
	resolve: (
		success: (nonId: object) => void,
		error: (err: string) => void,
		params?: LiQParams,
	) => void;
}

interface LiQParams {
	qf: string;
	resolve: LiQResolveParams[];
}

type LiQResolveParams = 'sha1' | 'sha2' | 'md5' | 'unifiedId';
