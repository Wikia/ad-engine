export interface ElementOffset {
	top: number;
	left: number;
}

/**
 * Returns element's offset of given element depending on offset parameter name
 */
export function getElementOffset(element: HTMLElement): ElementOffset {
	let hideAgain = false;
	const previousStyles: Partial<CSSStyleDeclaration> = {
		display: '',
		height: '',
	};

	if (element.classList.contains('hide')) {
		hideAgain = true;
		previousStyles.display = element.style.display;
		previousStyles.height = element.style.height;

		element.classList.remove('hide');
		element.style.display = 'block';
		element.style.height = '1px';
	}

	const offset: ElementOffset = calculateOffset(element);

	if (hideAgain) {
		element.classList.add('hide');
		element.style.display = previousStyles.display;
		element.style.height = previousStyles.height;
	}

	return offset;
}

/**
 * The result of this helpers is equal to jQuery's $.offset()
 * @see https://plainjs.com/javascript/styles/get-the-position-of-an-element-relative-to-the-document-24/
 */
function calculateOffset(element: HTMLElement): ElementOffset {
	const rect = element.getBoundingClientRect();
	const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

	return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

/**
 * Returns element's offset of given element from the top of the page
 */
export function getTopOffset(element: HTMLElement): number {
	return getElementOffset(element).top;
}

/**
 * Returns element's offset of given element from the left of the page
 */
export function getLeftOffset(element: HTMLElement): number {
	return getElementOffset(element).left;
}

/**
 * Returns client's viewport height
 */
export function getViewportHeight(): number {
	return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

/**
 * Returns client's viewport width
 */
export function getViewportWidth(): number {
	return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

/**
 * Checks whether given element is in the viewport
 * @param element DOM element that is going to be checked
 * @param topOffset top offset that defines top margin of viewport, may be used to exclude navbar
 * @param bottomOffset bottom offset that defines bottom margin of viewport
 * @param areaThreshold element area that needs to be in/outside viewport to decide whether element
 * is in the viewport
 */
export function isInViewport(
	element: HTMLElement,
	{ topOffset = 0, bottomOffset = 0, areaThreshold = 0.5 } = {},
): boolean {
	const alwaysInViewportPositions = ['fixed', 'sticky'];
	const elementPosition = window.getComputedStyle(element).position;

	if (alwaysInViewportPositions.includes(elementPosition)) {
		return true;
	}

	const elementHeight = element.offsetHeight;
	const elementTop = getTopOffset(element);
	const elementBottom = elementTop + elementHeight;
	const scrollPosition = window.scrollY;
	const viewportHeight = getViewportHeight();
	const viewportTop = topOffset + scrollPosition;
	const viewportBottom = bottomOffset + scrollPosition + viewportHeight;
	const minimumElementArea = areaThreshold * elementHeight;

	return (
		elementTop >= viewportTop - minimumElementArea &&
		elementBottom <= viewportBottom + minimumElementArea
	);
}

export function isInTheSameViewport(
	element: HTMLElement,
	elementsToCompare: HTMLElement[] = [],
): boolean {
	// According to https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
	// Hidden element does not have offsetParent
	if (element.offsetParent === null) {
		return false;
	}

	const elementHeight = element.offsetHeight;
	const elementOffset = getTopOffset(element);
	const viewportHeight = getViewportHeight();

	const conflicts = elementsToCompare.filter((conflictElement: HTMLElement) => {
		if (
			(element.previousSibling && element.previousSibling.isSameNode(conflictElement)) ||
			(element.nextSibling && element.nextSibling.isSameNode(conflictElement))
		) {
			return true;
		}

		const conflictHeight = conflictElement.offsetHeight;
		const conflictOffset = getTopOffset(conflictElement);
		const isFirst = conflictOffset < elementOffset;

		const distance = isFirst
			? elementOffset - conflictOffset - conflictHeight
			: conflictOffset - elementOffset - elementHeight;

		return distance < viewportHeight;
	});

	return conflicts.length > 0;
}
