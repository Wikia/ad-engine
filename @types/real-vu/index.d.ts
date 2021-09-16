type Status = 'yes' | 'no' | 'na';

interface RealVu {
	addUnitById: (any) => Status;
	getStatusById: (
		string,
	) => {
		realvu: Status;
	};
	regUnit: (string) => string;
}
