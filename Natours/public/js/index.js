// import '@babel/polyfill';
import { logout, login } from './login';
import { displayMap } from './mapbox';
import { updateUser, updateUserSettings } from './updateSettings';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.formlogin');
const updateUserData = document.querySelector('.form-user-data');
const updateUserPassword = document.querySelector('.form-user-password');

const logoutbtn = document.querySelector('.nav__el--logout');
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.location);
  console.log(locations);
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

if (updateUserData) {
  updateUserData.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    updateUserSettings({ name, email }, 'data');
  });
}

if (updateUserPassword) {
  updateUserPassword.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.querySelector('#password-current').value;
    const newpassword = document.querySelector('#password').value;
    const newconfirmPassword =
      document.querySelector('#password-confirm').value;
    await updateUserSettings(
      { currentPassword, newpassword, newconfirmPassword },
      'password',
    );
    document.querySelector('#password-current').value = '';
    document.querySelector('#password').value = '';
    document.querySelector('#password-confirm').value = '';
  });
}
