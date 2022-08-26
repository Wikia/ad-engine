interface LiQ {
	resolve: (
		success: (nonId: object) => void,
		error: (err: string) => void,
		params?: LiQParams,
	) => void;
}

interface LiQParams {
	qf: string;
	resolve: 'sha256' | 'sha1' | 'sha2' | 'md5';
}
