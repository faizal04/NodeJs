import axios from 'axios';
import { showAlert } from './alert';
export const login = async function (email, password) {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'logged in succesfuly');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
// export const signup = async function (name, email, password, confirmPassword) {
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: 'http://localhost:3000/api/v1/users/login',
//       data: {
//         name,
//         email,
//         password,
//         confirmPassword,
//       },
//     });
//     console.log(res);
//     if (res.data.status === 'success') {
//     }
//   } catch (error) {
//     showAlert('error', err.response.data.message);
//   }
// };
export const logout = async () => {
  try {
    console.log('reached axios');
    const result = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    });
    if (result.data.status === 'success') {
      showAlert('success', 'Logout Successfully');
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', result.data.message);
  }
};
