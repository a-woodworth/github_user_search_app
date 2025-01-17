const darkThemeQuery = window.matchMedia(
  '(prefers-color-scheme: dark)'
);
const themeBtn = document.querySelector(
  'button[data-type="theme-toggle"]'
);
const themeBtnText = document.querySelector('.js-theme');

function switchTheme(color) {
  const lightIcon = document.querySelector('.js-icon-sun');
  const darkIcon = document.querySelector('.js-icon-moon');

  if (color === 'light') {
    // Set theme to light
    document.body.setAttribute('data-theme', 'light');
    lightIcon.classList.add('hidden');
    darkIcon.classList.remove('hidden');
    themeBtnText.textContent = 'Dark';

    // Save theme to local storage
    localStorage.setItem('theme', 'light');
  } else {
    // Set theme to dark
    document.body.setAttribute('data-theme', 'dark');
    darkIcon.classList.add('hidden');
    lightIcon.classList.remove('hidden');
    themeBtnText.textContent = 'Light';

    // Save theme to local storage
    localStorage.setItem('theme', 'dark');
  }
}

function initializeTheme() {
  const storedTheme = localStorage.getItem('theme');

  // Check if theme is stored in local storage
  if (storedTheme === 'dark') {
    return switchTheme('dark');
  } else if (storedTheme === 'light') {
    return switchTheme('light');
  }

  // No stored theme: Check system theme
  if (darkThemeQuery.matches) {
    return switchTheme('dark');
  } else {
    return switchTheme('light');
  }
}

// Update theme if system color changes
darkThemeQuery.addEventListener('change', (e) => {
  if (e.matches) {
    switchTheme('dark');

    // Update local storage
    localStorage.setItem('theme', 'dark');
  } else {
    switchTheme('light');

    // Update local storage
    localStorage.setItem('theme', 'light');
  }
});

// Event listener for theme button
themeBtn.addEventListener('click', () => {
  const activeTheme = document.body.getAttribute('data-theme');
  const isPressed = themeBtn.getAttribute('aria-pressed') === 'true';

  themeBtn.setAttribute('aria-pressed', !isPressed);

  if (activeTheme === 'dark') {
    switchTheme('light');
  } else {
    switchTheme('dark');
  }
});

initializeTheme();
