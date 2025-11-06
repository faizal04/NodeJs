const { default: axios } = require('axios');
const catchAsync = require('../../utils/catchAsync');
const { showAlert } = require('./alert');

exports.updateUserSettings = async (data, type) => {
  const url =
    type === 'password'
      ? 'http://localhost:3000/api/v1/users/changePassword'
      : 'http://localhost:3000/api/v1/users/updateMe';
  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success')
      showAlert('success', `${type.toUpperCase()} Updated Successfully`);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
