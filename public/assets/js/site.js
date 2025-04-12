function ready (callback) {
  if (document.readyState != 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  };
};

ready(function() {
  // Turn off screen loading effect.
  // See https://github.com/kristopolous/BOOTSTRA.386
  _386 = { fastLoad: true };

  // Keyboard short cuts
  document.addEventListener('keyup', function (keyBoardEvent) {
    switch (keyBoardEvent.key) {
    case 'A':
      document.querySelector('#home-link').click();
      break;
    case 'N':
      document.querySelector('#notes-link').click();
    default:
    };
  });

  // Projects

  const projects = document.querySelectorAll('.project');

  // Get modal elements
  const modal = document.getElementById('demo-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalImage = document.getElementById('modal-image');
  const modalDesc = document.getElementById('modal-description');
  const closeBtn = document.querySelector('.close-modal');


  projects.forEach(proj => {
    // project description typing effect
    const desc = proj.querySelector('.project-desc')
    const text = desc.textContent;
    desc.textContent = '';
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        desc.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 8);
      }
    }

    // Start typing when element is in viewport
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        typeWriter();
        observer.disconnect();
      }
    });

    observer.observe(desc);

    // Demo link

    const demoLink = proj.querySelector('.demo-link')

    demoLink.addEventListener('click', function(e) {
      e.preventDefault();

      // Get data from link attributes
      const title = proj.querySelector('.project-title').textContent
      const desc = proj.querySelector('.project-desc').textContent

      // Set modal content
      modalTitle.textContent = title + ' - DEMO';
      modalDesc.textContent = desc;

      // Show the modal with a typing effect for the description
      modal.style.display = 'block';
    });
  });

  // Project modal

  // Close modal stuff
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
    }
  });
});
