type Status = 'yes' | 'no' | 'na';

interface RealVu {
	addUnitById: (any) => Status;
	getStatusById: (string) => Status;
	regUnit: (string) => string;
}
