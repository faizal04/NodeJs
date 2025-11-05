// import '@babel/polyfill';
import { logout, login } from './login';
import { displayMap } from './mapbox';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutbtn = document.querySelector('.nav__el--logout');
if (mapBox) {
  const locations = JSON.parse(dataset.location);
  displayMap(locations);
}
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password);
    login(email, password);
  });
}
if (logoutbtn) {
  logoutbtn.addEventListener('click', logout);
}
