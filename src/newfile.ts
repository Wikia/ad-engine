const element = document.getElementById('ID');

// this line should cause `TS18047: element is possibly null` error in strict mode
console.log(element.classList);
