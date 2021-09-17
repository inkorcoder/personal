const perfData = window.performance.timing;
const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
console.log("pageLoadTime = ", pageLoadTime)
console.log(performance);