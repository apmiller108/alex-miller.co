function ready (callback) {
  if (document.readyState != 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  };
};

ready(function() {
  // Turns off screen loading effect.
  // See https://github.com/kristopolous/BOOTSTRA.386
  _386 = { fastLoad: true };

  document.addEventListener('keyup', function (keyBoardEvent) {
    switch (keyBoardEvent.key) {
    case 'A':
      document.querySelector('#home-link').click();
      break;
    case 'N':
      document.querySelector('#notes-link').click();
    default:
      console.log('no key');
    };
  });
});
