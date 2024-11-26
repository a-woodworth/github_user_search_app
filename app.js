const GitHub_URL = 'https://api.github.com/users/';
const searchForm = document.querySelector('#usersearch');
const searchInput = document.querySelector('#usersearch input');
const searchError = document.querySelector('.error');
const defaultUser = 'octocat';

function clearError() {
  searchError.classList.add('hidden');
  searchError.removeAttribute('aria-live', 'polite');
}

function noUserFoundMessage() {
  searchError.classList.remove('hidden');
  searchInput.placeholder = '';
  searchError.textContent = 'No results';
  searchError.setAttribute('aria-live', 'polite');
  searchInput.focus();
}

function formatUserDate(date) {
  const cardDateFormat = new Date(date);
  return cardDateFormat.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function displayUser(data) {
  const userAvatar = document.querySelector('.js-user-avatar');
  const userName = document.querySelector('.js-user-name');
  const userID = document.querySelector('.js-user-id a');
  const userCreated = document.querySelector('.js-user-created-at');
  const userBio = document.querySelector('.js-user-bio');
  const userRepos = document.querySelector('.js-user-public-repos');
  const userFollowers = document.querySelector('.js-user-followers');
  const userFollowing = document.querySelector('.js-user-following');
  const userLocation = document.querySelector(
    '.js-user-location'
  ).lastElementChild;
  const userBlog =
    document.querySelector('.js-user-blog').lastElementChild;
  const userTwitter = document.querySelector(
    '.js-user-twitter'
  ).lastElementChild;
  const userCompany = document.querySelector(
    '.js-user-company'
  ).lastElementChild;
  const locationDiv = userLocation.parentNode.parentNode;
  const blogDiv = userBlog.parentNode.parentNode;
  const twitterDiv = userTwitter.parentNode.parentNode;
  const companyDiv = userCompany.parentNode.parentNode;

  // Return user image and alt text
  userAvatar.src = data.avatar_url;
  userAvatar.alt = `${data.login} avatar`;

  // Return user name
  if (data.name === null || data.name === '') {
    userName.innerText = data.login;
  } else {
    userName.innerText = data.name;
  }

  // Return user ID and link
  userID.innerText = `@${data.login}`;
  userID.href = data.html_url;

  // Return user created date
  userCreated.innerText = `${formatUserDate(data.created_at)}`;

  // Return user bio
  if (data.bio === null || data.bio === '') {
    userBio.innerText = 'This profile has no bio';
    userBio.classList.add('not-available');
  } else {
    // Remove not-available class if it exists
    if (userBio.classList.contains('not-available')) {
      userBio.classList.remove('not-available');
    }
    userBio.innerText = data.bio;
  }

  // Return user stat list
  userRepos.innerText = data.public_repos;
  userFollowers.innerText = data.followers;
  userFollowing.innerText = data.following;

  // Return user location
  if (data.location === null || data.location === '') {
    locationDiv.classList.add('not-available');
    userLocation.innerText = 'Not Available';
  } else {
    // Remove not-available class if it exists
    if (locationDiv.classList.contains('not-available')) {
      locationDiv.classList.remove('not-available');
    }
    userLocation.innerText = data.location;
  }

  // Return user blog
  if (data.blog === null || data.blog === '') {
    blogDiv.classList.add('not-available');
    userBlog.outerHTML = `<span>Not Available</span>`;
  } else {
    // Remove not-available class if it exists
    if (blogDiv.classList.contains('not-available')) {
      blogDiv.classList.remove('not-available');
    }

    userBlog.outerHTML = `
      <a href="${data.blog}" target="_blank" rel="noopener">
        ${data.blog}
      </a>
    `;
  }

  // Return Twitter username
  if (
    data.twitter_username !== null &&
    data.twitter_username !== ''
  ) {
    // Remove not-available class if it exists
    if (twitterDiv.classList.contains('not-available')) {
      twitterDiv.classList.remove('not-available');
    }

    userTwitter.outerHTML = `
      <a href="https://twitter.com/${data.twitter_username}" target="_blank" rel="noopener">
        @${data.twitter_username}
      </a>
    `;
  } else {
    twitterDiv.classList.add('not-available');
    userTwitter.outerHTML = `<span>Not Available</span>`;
  }

  // Return Company
  if (data.company === null || data.company === '') {
    companyDiv.classList.add('not-available');
    userCompany.outerHTML = `<span>Not Available</span>`;
  } else if (data.company !== null) {
    // Remove not-available class if it exists
    if (companyDiv.classList.contains('not-available')) {
      companyDiv.classList.remove('not-available');
    }

    const checkForGitHubCompanyPage = data.company.charAt(0) === '@';

    if (checkForGitHubCompanyPage === true) {
      userCompany.outerHTML = `
      <a href="https://github.com/${data.company.slice(
        1
      )}" target="_blank" rel="noopener">
        ${data.company}
      </a>
    `;
    } else {
      userCompany.outerHTML = `<span>${data.company}</span>`;
    }
  }
}

async function fetchGitHubUser(username) {
  try {
    const response = await fetch(GitHub_URL + username);

    if (!response.ok) {
      noUserFoundMessage();
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    return displayUser(data);
  } catch (error) {
    console.log(error);
  }
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchValue = searchInput.value.trim();

  if (searchValue === '') {
    searchError.classList.remove('hidden');
    searchInput.placeholder = '';
    searchError.textContent = 'Please enter a GitHub username';
    searchError.setAttribute('aria-live', 'polite');
    searchInput.focus();
  } else {
    fetchGitHubUser(searchValue);
  }
});

// Clear error message when user starts typing
searchInput.addEventListener('input', clearError);

// Display default user
// fetchGitHubUser(defaultUser);
