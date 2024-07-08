/**
 * Account Settings - Account
 */

'use strict';

document.addEventListener('DOMContentLoaded', function (e) {
  (function () {
    const deactivateAcc = document.querySelector('#formAccountDeactivation');

    // Update/reset user image of account page
    let accountUserImage = document.getElementById('uploadedAvatar');
    const fileInput = document.querySelector('.account-file-input'),
      resetFileInput = document.querySelector('.account-image-reset');
      //saveFileInput = document.querySelector('.account-image-save');

    if (accountUserImage) {
      const resetImage = accountUserImage.src;
      fileInput.onchange = () => {
        if (fileInput.files[0]) {
          //saveFileInput.hidden = false;
          accountUserImage.src = window.URL.createObjectURL(fileInput.files[0]);
          console.log(fileInput.files[0]);
        }
      };
      resetFileInput.onclick = () => {
      //   //saveFileInput.hidden = true;
      fileInput.value = '';
      accountUserImage.src = resetImage;
      };
    }
  })();
});
