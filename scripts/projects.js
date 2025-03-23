// projects.js
// Dynamically fetch the latest repos from GitHub and display them
document.addEventListener("DOMContentLoaded", () => {
  const repoList = document.getElementById("repo-list");
  if (!repoList) return;

  async function loadRepos() {
    try {
      const response = await fetch(
        "https://api.github.com/users/zebbern/repos?sort=updated"
      );
      const repos = await response.json();

      repoList.innerHTML = ""; // clear placeholder

      repos.slice(0, 5).forEach(repo => {
        const repoCard = document.createElement("div");
        repoCard.className = "repo-card";
        repoCard.innerHTML = `
          <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
          <p>${repo.description || "No description provided."}</p>
          <small>
            ⭐ ${repo.stargazers_count} | Updated: ${new Date(repo.updated_at).toLocaleDateString()}
          </small>
        `;
        repoList.appendChild(repoCard);
      });
    } catch (error) {
      console.error(error);
      repoList.innerHTML = "Failed to load repositories.";
    }
  }

  loadRepos();
});
