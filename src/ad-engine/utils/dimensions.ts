/**
 * Returns element's offset of given element depending on offset parameter name
 * @param element DOM element
 * @param offsetParameter node element parameter to count overall offset
 * @returns {number}
 */
function getElementOffset(element, offsetParameter) {
	const elementWindow = element.ownerDocument.defaultView;
	let currentElement = element;
	let hideAgain = false;
	let topPos = 0;

	if (element.classList.contains('hide')) {
		hideAgain = true;
		element.classList.remove('hide');
	}

	do {
		topPos += currentElement[offsetParameter];
		currentElement = currentElement.offsetParent;
	} while (currentElement !== null);

	if (hideAgain) {
		element.classList.add('hide');
	}

	if (elementWindow && elementWindow.frameElement) {
		topPos += getElementOffset(elementWindow.frameElement, offsetParameter);
	}

	return topPos;
}

/**
 * Returns element's offset of given element from the top of the page
 * @param element DOM element
 * @returns {number}
 */
export function getTopOffset(element) {
	return getElementOffset(element, 'offsetTop');
}

/**
 * Returns element's offset of given element from the left of the page
 * @param element DOM element
 * @returns {number}
 */
export function getLeftOffset(element) {
	return getElementOffset(element, 'offsetLeft');
}

/**
 * Returns client's viewport height
 * @returns {number}
 */
export function getViewportHeight() {
	return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

/**
 * Returns client's viewport width
 * @returns {number}
 */
export function getViewportWidth() {
	return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

/**
 * Checks whether given element is in the viewport
 * @param element DOM element that is going to be checked
 * @param topOffset top offset that defines top margin of viewport, may be used to exclude navbar
 * @param bottomOffset bottom offset that defines bottom margin of viewport
 * @param areaThreshold element area that needs to be in/outside viewport to decide whether element
 * is in the viewport
 * @returns {boolean}
 */
export function isInViewport(element, topOffset = 0, bottomOffset = 0, areaThreshold = 0.5) {
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

export function isInTheSameViewport(element, elementsToCompare = []) {
	// According to https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
	// Hidden element does not have offsetParent
	if (element.offsetParent === null) {
		return false;
	}

	const elementHeight = element.offsetHeight;
	const elementOffset = getTopOffset(element);
	const viewportHeight = getViewportHeight();

	const conflicts = elementsToCompare.filter((conflictElement) => {
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
