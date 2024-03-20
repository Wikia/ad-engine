// @ts-strict-ignore
const element = document.getElementById('ID');

// this line should not cause `TS18047: element is possibly null` error as strict mode is disabled
console.log(element.classList);
