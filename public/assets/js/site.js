function ready (callback) {
  if (document.readyState != 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  };
};

async function getCurrentYear() {
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/America/New_York');
    if (!response.ok) {
      console.warn('Unable to retrieve current year from worldtimeapi')
    }
    const data = await response.json();
    const currentDateTime = new Date(data.datetime);
    const currentYear = currentDateTime.getFullYear();
    return currentYear;
  } catch (error) {
    console.error('Error parsing date from worldtimeapi:', error);
  }
}

function renderProject(name, data) {
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const screenshotContainer = document.getElementById('screenshot-container')

  // Clear any existing content
  modalDescription.innerHTML = '';
  screenshotContainer.innerHTML = '';
  modalTitle.textContent = '';

  // Set title
  modalTitle.textContent = name + ' - DEMO';

  // Create heading and feature lists
  Object.entries(data.headings).forEach(([heading, features]) => {
    const headingElement = document.createElement('h3');
    headingElement.textContent = heading;
    headingElement.classList.add('feature-heading');
    modalDescription.appendChild(headingElement);

    // Create UL for features
    const featureList = document.createElement('ul');
    featureList.classList.add('feature-list');

    Object.entries(features).forEach(([featureKey, featureDescription]) => {
      const listItem = document.createElement('li');
      listItem.classList.add('feature-item');

      const boldFeature = document.createElement('strong');
      boldFeature.textContent = featureKey;
      boldFeature.classList.add('feature-key');

      // Create text node for description
      const descriptionText = document.createTextNode(`: ${featureDescription}`);

      // Append bold feature and description to list item
      listItem.appendChild(boldFeature);
      listItem.appendChild(descriptionText);

      // Append list item to feature list
      featureList.appendChild(listItem);
    });

    // Append feature list to modal description
    modalDescription.appendChild(featureList);
  });

  // Create image gallery
  if (data.screenshots.length) {
    const galleryContainer = document.createElement('div');
    galleryContainer.classList.add('image-gallery');

    data.screenshots.forEach((screenshot, index) => {
      // Create figure for each screenshot
      const figure = document.createElement('figure');
      figure.classList.add('screenshot-figure');

      // Create image
      const img = document.createElement('img');
      img.src = screenshot.path;
      img.alt = `${name} screenshot - ${screenshot.caption}`;
      img.loading = 'lazy';
      img.classList.add('screenshot-img');
      img.dataset.index = index;

      // Add loading animation
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });

      img.addEventListener('click', () => {
        openFullSizeImage(data.screenshots, index);
      });

      // Create caption
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = screenshot.caption;
      figcaption.classList.add('screenshot-caption');

      // Append image and caption to figure
      figure.appendChild(img);
      figure.appendChild(figcaption);

      // Append figure to gallery
      galleryContainer.appendChild(figure);
    });

    // Append gallery to screenshot container
    screenshotContainer.appendChild(galleryContainer);
  }
}

function openFullSizeImage(screenshots, index) {
  const currentScreenshot = screenshots[index];

  // Create DOS-style viewer
  const viewer = document.createElement('div');
  viewer.classList.add('dos-viewer');
  viewer.dataset.currentIndex = index;
  viewer.dataset.screenshots = JSON.stringify(screenshots);

  viewer.innerHTML = `
    <div class="dos-viewer-header">
      <div class="dos-viewer-title">${currentScreenshot.caption}</div>
    </div>
    <div class="dos-viewer-body">
      <img class="dos-viewer-image" src="${currentScreenshot.path}" alt="${currentScreenshot.caption}">
    </div>
    <div class="dos-viewer-footer">
      <div class="dos-viewer-nav">
        <span class="dos-nav-item previous-image"><span class="dos-key">◄</span> Previous</span> |
        <span class="dos-nav-item next-image"><span class="dos-key">►</span> Next</span> |
        <span class="dos-nav-item close-viewer"><span class="dos-key">ESC</span> Exit</span>
      </div>
      <div class="dos-viewer-counter">${index + 1}/${screenshots.length}</div>
    </div>
  `;

  document.body.appendChild(viewer);

  // Store original body overflow
  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  // Add keyboard navigation
  function handleKeyDown(e) {
    // Only handle keys if the viewer is open
    if (!document.querySelector('.dos-viewer')) return;

    switch (e.key) {
      case 'Escape':
        closeViewer();
        e.stopPropagation(); // Prevent event from bubbling up to modal
        break;
      case 'ArrowLeft':
        navigateViewer(-1);
        break;
      case 'ArrowRight':
        navigateViewer(1);
        break;
    }
  }

  document.addEventListener('keydown', handleKeyDown);

  // Mobile swipe navigation

  const mc = new Hammer.Manager(document.querySelector('.dos-viewer-body'));
  mc.add(new Hammer.Swipe());
  mc.on('swipeleft', () => navigateViewer(-1));
  mc.on('swiperight', () => navigateViewer(1));

  // Navigation function
  function navigateViewer(direction) {
    const currentIndex = parseInt(viewer.dataset.currentIndex);
    const screenshots = JSON.parse(viewer.dataset.screenshots);
    const newIndex = (currentIndex + direction + screenshots.length) % screenshots.length;

    // Update current image
    const newScreenshot = screenshots[newIndex];
    const viewerImage = viewer.querySelector('.dos-viewer-image');
    const viewerTitle = viewer.querySelector('.dos-viewer-title');
    const viewerCounter = viewer.querySelector('.dos-viewer-counter');

    // Apply loading effect
    viewerImage.style.opacity = '0';

    setTimeout(() => {
      viewerImage.src = newScreenshot.path;
      viewerImage.alt = newScreenshot.caption;
      viewerTitle.textContent = newScreenshot.caption;
      viewerCounter.textContent = `${newIndex + 1}/${screenshots.length}`;

      // Fade in new image
      viewerImage.style.opacity = '1';

      // Update current index
      viewer.dataset.currentIndex = newIndex;
    }, 200);
  }

  // Close function
  function closeViewer() {
    // Add exit animation
    viewer.classList.add('dos-viewer-exit');

    setTimeout(() => {
      document.body.removeChild(viewer);
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    }, 300);
  }

  // Add click events for navigation
  const prevButton = viewer.querySelector('.dos-nav-item.previous-image');
  const nextButton = viewer.querySelector('.dos-nav-item.next-image');
  const exitButton = viewer.querySelector('.dos-nav-item.close-viewer');

  prevButton.addEventListener('click', () => navigateViewer(-1));
  nextButton.addEventListener('click', () => navigateViewer(1));
  exitButton.addEventListener('click', closeViewer);
}

ready(async function() {
  // Turn off screen loading effect.
  // See https://github.com/kristopolous/BOOTSTRA.386
  _386 = { fastLoad: true };

  getCurrentYear().then((year) => {
    if (year) {
      document.getElementById('copyright-year').textContent = year
    }
  });

  // Fetch project data
  const data = await fetch('/assets/js/data.json')
        .then(response => response.json())
        .catch(error => console.error('Error fetching data:', error));

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
  const modal = document.getElementById('demo-modal');

  projects.forEach(proj => {
    // Demo link
    const demoLink = proj.querySelector('.demo-link');

    demoLink.addEventListener('click', function(e) {
      e.preventDefault();

      const projectName = proj.dataset.projectName;
      const projectData = data[projectName];

      renderProject(projectName, projectData);

      // Show the modal with a typing effect for the description
      modal.style.display = 'block';
    });
  });

  // Project modal

  const closeBtn = document.querySelector('.close-modal');

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
    const dosViewer = document.querySelector('.dos-viewer');

    // If the DOS viewer is open, ESP key only closes it and not the modal as well
    if (!dosViewer && e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
    }
  });
});
