// Elements
let attemts = 0;
const message = document.querySelector('input');
const submit = document.querySelector('button');
const result = document.querySelector('span');

submit.addEventListener('click', () => {
  const data = { 'message': message.value };
  post('test/body', data)
    .then( res => {
      if (!res) return location.href = '/api/login';
      result.innerHTML = `Server recived: ${res}`;
    });
});
message.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    submit.click();
  }
});
