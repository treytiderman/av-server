localStorage.setItem('name','trey');
console.log(localStorage.getItem('name'));
localStorage.removeItem('name');
console.log(localStorage.getItem('name'));

sessionStorage.setItem('name','jess');
sessionStorage.setItem('1','1');
sessionStorage.setItem('2','2');
sessionStorage.setItem('3','3');
sessionStorage.setItem('4','4');
console.log(sessionStorage.getItem('name'));
sessionStorage.clear();
console.log(sessionStorage.getItem('name'));

// Jan 1 2023
const expires = new Date(2023, 0, 1).toUTCString(); 
document.cookie = `jump=high; expires=${expires}`;
document.cookie = `name=trey; expires=${expires}`;

console.log(document.cookie);

