// import '@babel/polyfill';
import { logout, login } from './login';
import { displayMap } from './mapbox';
import { updateUser, updateUserSettings } from './updateSettings';
import { bookTour } from './razorpay';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.formlogin');
const updateUserData = document.querySelector('.form-user-data');
const updateUserPassword = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const proceedBtn = document.getElementById('proceed-payment');

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
    const formData = new FormData();
    formData.append('email', document.getElementById('email').value);
    formData.append('name', document.getElementById('name').value);
    formData.append('photo', document.getElementById('photo').files[0]);
    // console.log(formData.values);
    updateUserSettings(formData, 'data');
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
// if (bookBtn) {
//   bookBtn.addEventListener('click', (e) => {
//     e.target.textContent = 'processing..';
//     const { tourId } = e.target.dataset;
//     console.log(tourId);
//     bookTour(tourId);
//   });
// }
// public/js/index.js
// import '@babel/polyfill';
// import { bookTour } from './payment';

// Book tour button (on tour detail page)
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    const { tourId } = e.target.dataset;
    console.log(tourId);
    // Redirect to checkout page
    location.assign(`/checkout/${tourId}`);
  });
}

// Proceed to payment button (on checkout page)
if (proceedBtn) {
  proceedBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    e.target.disabled = true;
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
