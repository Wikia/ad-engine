// TODO remove this module
// It is a workaround for issue with mocking Math.random in our environment
// https://github.com/babel/babel/issues/5426#issuecomment-284839994

function getRandom(): number {
	return Math.random();
}

export default {
	getRandom,
};
