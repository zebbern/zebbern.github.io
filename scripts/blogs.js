// blog.js
// Dynamically fetch latest Medium articles using RSS2JSON
document.addEventListener("DOMContentLoaded", () => {
  const mediumContainer = document.getElementById("medium-articles");
  if (!mediumContainer) return;

  async function loadMediumArticles() {
    try {
      const url = "https://api.rss2json.com/v1/api.json?rss=https://medium.com/feed/@Zebbern";
      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== "ok") {
        mediumContainer.innerHTML = "<p>Failed to load Medium articles.</p>";
        return;
      }

      // Filter out items with no categories (often "updates" or placeholders)
      const articles = data.items.filter(item => item.categories.length > 0);
      mediumContainer.innerHTML = "";

      articles.slice(0, 3).forEach(article => {
        const thumbnail = article.thumbnail || "https://via.placeholder.com/300";
        const articleDiv = document.createElement("div");
        articleDiv.className = "blog-card";
        articleDiv.innerHTML = `
          <img src="${thumbnail}" alt="Blog Thumbnail" />
          <h3>
            <a href="${article.link}" target="_blank">${article.title}</a>
          </h3>
          <p>${article.description.replace(/<[^>]*>/g, "").slice(0, 150)}...</p>
          <small>Published: ${new Date(article.pubDate).toLocaleDateString()}</small>
        `;
        mediumContainer.appendChild(articleDiv);
      });
    } catch (error) {
      console.error(error);
      mediumContainer.innerHTML = "<p>Unable to fetch Medium posts at this time.</p>";
    }
  }

  loadMediumArticles();
});
