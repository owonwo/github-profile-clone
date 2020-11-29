const getGithubUser = (username) => `
  query { 
    user(login: "${username}") {
      name,
      login,
      location,
      avatarUrl,
      bio,
      repositories(last:20) {
        nodes {
          id,
          name,
          description,
          stargazerCount,
          forkCount,
          updatedAt,
          primaryLanguage{
            name,
            color
          },
          url
        }
        totalCount
      }
    }
  }

`;

function runQuery(query) {
  const GRAPHQL_ENTRY_POINT = "https://api.github.com/graphql";
  //const TOKEN = "5828d5a44bb27e6cc4fe8f54a0e3c1939d219666";
  const TOKEN = "13df0c3f3e62d337da44c9c878d90329963a0a0e";

  return fetch(GRAPHQL_ENTRY_POINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      query,
    }),
  }).then((res) => res.json());
}

const updateImgUrl = (imgUrl) => {
  const imgElements = document.querySelectorAll(".profile-pics");
  imgElements.forEach((el) => {
    el.src = imgUrl;
  });
};

const updateNames = (name, username, bio) => {
  const nameElement = document.getElementById("name");
  const usernameElements = document.querySelectorAll(".username");
  const bioElement = document.getElementById("bio");

  nameElement.innerHTML = name;
  usernameElements.forEach((el) => {
    el.innerHTML = username;
  });
  bioElement.innerHTML = bio;
};

const createRepo = (
  name,
  description,
  updatedAt,
  forkCount,
  stargazerCount,
  primaryLanguage,
  url
) => {
  const repoContainer = document.createElement("li");
  repoContainer.classList.add("repo-list");
  repoContainer.innerHTML = `
  <div style="">
  <a href=${url}>
    <h3>
      ${name}
    </h3>
  </a>
  <p>${description == null ? "" : description}</p>
  <div style="font-size: smaller; display:flex;">

    <li style="margin-right: .5rem;" class="flex">
      <span style="background-color: ${
        primaryLanguage == null ? "" : primaryLanguage.color
      }; margin-right: .2rem;" class="lang-color"></span>
      ${primaryLanguage == null ? "" : primaryLanguage.name}
    </li>

    <li style="margin-right: .5rem; color: #586069;" class="flex">
    <svg style="margin-right: .15rem;" viewBox="0 0 16 16" version="1.1" fill="#586069" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
      ${stargazerCount}
    </li>

    <li style="margin-right: .5rem; color: #586069;" class="flex">
    <svg aria-label="fork" style="margin-right: .15rem;" fill="#586069" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
      ${forkCount}
    </li>

    <li style="margin-right: .5rem;"> Updated ${dateFns.distanceInWords(
      dateFns.format(updatedAt),
      new Date()
    )} ago.</li>
  </div>
</div>
<div>
  <button class="star_btn" style="margin-right: .5rem; color: #586069;">
    <svg class="" viewBox="0 0 16 16" version="1.1" fill="#586069" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>Star
        </button>
</div>
  `;
  return repoContainer;
};

const updateRepos = (repos, totalCount) => {
  const reposHolder = document.getElementById("repo_cont");
  const totalCountElement = document.getElementById("repo_count");
  totalCountElement.innerHTML = totalCount;
  const repoElements = repos.reverse().map((repo) => {
    const {
      name,
      description,
      updatedAt,
      forkCount,
      stargazerCount,
      primaryLanguage,
      url,
    } = repo;

    return createRepo(
      name,
      description,
      updatedAt,
      forkCount,
      stargazerCount,
      primaryLanguage,
      url
    );
  });

  reposHolder.innerHTML = "";
  repoElements.forEach((node) => {
    reposHolder.append(node);
  });
};

const useApiData = (data) => {
  const userData = data.data.user;
  const { avatarUrl, name, login, bio } = userData;
  const { nodes, totalCount } = userData.repositories;

  updateImgUrl(avatarUrl);
  updateNames(name, login, bio);
  updateRepos(nodes, totalCount);
};

window.addEventListener("load", () => {
  console.info("Fetching the User information now.");
  runQuery(getGithubUser("laviedegeorge"))
    .then((res) => {
      console.log("The response data", res);
      useApiData(res);
    })
    .catch((error) => {
      console.error("failed to fetch the Github user information", error);
    });
});

const toggleBtn = document.getElementById("toggle_btn");
const dropDown = document.getElementById("drop_down");
toggleBtn.addEventListener("click", () => {
  dropDown.classList.toggle("show");
});
