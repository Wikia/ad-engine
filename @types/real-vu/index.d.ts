type Status = 'yes' | 'no' | 'na' | 'too_late';

interface RealVu {
	addUnitById: (any) => Partial<Status>;
	getStatusById: (string) => Status;
	regUnit: (string) => string;
}
