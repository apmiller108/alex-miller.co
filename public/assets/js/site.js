function ready (callback) {
  if (document.readyState != 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  };
};

ready(function() {
  setInterval(function() {
    for (var i = 1; i < 5; i++) {
      console.log(i);
      document.querySelector('.polygon-' + i).classList.toggle('polygon-animate-' + i)
    }
  }, 5000)
});
