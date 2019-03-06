type VisibilityStatusType = 'visible' | 'hidden' | 'not_implemented';

export const VISIBILITY_STATUS = {
	visible: 'visible',
	hidden: 'hidden',
	notImplemented: 'not_implemented',
};

/**
 * Returns document visibility status.
 */
export function getDocumentVisibilityStatus(): VisibilityStatusType {
	let status;

	switch (document.hidden) {
		case true:
			status = VISIBILITY_STATUS.hidden;
			break;
		case false:
			status = VISIBILITY_STATUS.visible;
			break;
		default:
			status = VISIBILITY_STATUS.notImplemented;
	}

	return status as VisibilityStatusType;
}
