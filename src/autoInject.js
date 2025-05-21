// src/autoInject.js
document.addEventListener('DOMContentLoaded', () => {
  // Ensure __AUTHORS_DATA__ is available
  if (typeof __AUTHORS_DATA__ === 'undefined') {
    console.error('Authors data not found. Make sure it is defined in vite.config.');
    return;
  }

  const authors = __AUTHORS_DATA__;

  // Find the main content area where Starlight renders the article body
  // This selector might need adjustment based on Starlight's DOM structure.
  // Common Starlight main content containers are #main-content or article role.
  const articleHeader = document.querySelector('header.sl-container'); // Starlight's article header, title is usually in here
  
  if (!articleHeader) {
    console.warn('Article header not found. Cannot inject author profile.');
    return;
  }

  // Retrieve authorId from the page's frontmatter.
  // This requires that the authorId is made available in a way that client-side JS can access it.
  // For example, by rendering it into a meta tag or a data attribute in the body/main element.
  // Let's assume Starlight or the user's setup makes `page.frontmatter.author` available like this:
  const authorId = document.documentElement.dataset.pageAuthor; // e.g. <html data-page-author="johndoe">

  if (!authorId) {
    // If no authorId is found in frontmatter, do nothing.
    // console.log('No author ID found in frontmatter. Author profile will not be injected.');
    return;
  }

  const author = authors[authorId];

  if (!author) {
    console.warn(`Author details for "${authorId}" not found in authors data.`);
    return;
  }

  // Create the AuthorProfile component container
  const authorProfileContainer = document.createElement('div');
  authorProfileContainer.id = 'starlight-author-profile-container';
  
  // Basic styling for the inserted element, can be enhanced
  authorProfileContainer.style.marginTop = '1rem';
  authorProfileContainer.style.marginBottom = '2rem';
  authorProfileContainer.style.display = 'flex';
  authorProfileContainer.style.alignItems = 'center';
  authorProfileContainer.style.fontFamily = 'sans-serif'; // Example style

  // Populate the container with author data
  // This is a simplified version of what AuthorProfile.astro does.
  // For full component reuse, you'd typically use client-side components or Astro Islands if available.
  authorProfileContainer.innerHTML = `
    <a href="${author.profileSlug}" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
      <img src="${author.avatar}" alt="${author.name}" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;" />
      <div>
        <span style="font-weight: bold;">${author.name}</span>
        ${author.bio ? `<p style="font-size: 0.9em; margin: 0;">${author.bio}</p>` : ''}
      </div>
    </a>
  `;

  // Inject the author profile container after the article header
  articleHeader.parentNode.insertBefore(authorProfileContainer, articleHeader.nextSibling);
});