# Starlight Author Plugin

A plugin for [Starlight](https://starlight.astro.build/) to display author information below article titles and provide dedicated author profile pages.

## Features

- Displays author's avatar, name, and bio on article pages.
- Links to a dedicated profile page for each author.
- Author data is managed through a central JSON file.
- Easy to integrate and configure.

## Installation

1.  Install the plugin using your preferred package manager:

    ```bash
    npm install starlight-author-plugin
    # or
    yarn add starlight-author-plugin
    # or
    pnpm add starlight-author-plugin
    ```

2.  Configure the plugin in your `astro.config.mjs` file:

    ```javascript
    // astro.config.mjs
    import { defineConfig } from 'astro/config';
    import starlight from '@astrojs/starlight';
    import starlightAuthorPlugin from 'starlight-author-plugin';

    export default defineConfig({
      integrations: [
        starlight({
          title: 'My Awesome Docs',
          plugins: [
            starlightAuthorPlugin({
              // Optional: Path to your authors data file.
              // Defaults to 'src/data/authors.json' relative to the project root.
              // authors: 'src/my-authors.json', 
            }),
          ],
        }),
      ],
    });
    ```

## Usage

1.  **Create an Author Data File**

    Create an `authors.json` file (or the custom path you configured) in your `src/data/` directory. The structure should be as follows:

    ```json
    {
      "johndoe": {
        "name": "John Doe",
        "avatar": "/images/authors/johndoe.jpg", // Path to avatar image
        "bio": "Tech writer and open-source enthusiast.",
        "profileSlug": "/authors/johndoe"      // Slug for the author's page
      },
      "anotherauthor": {
        "name": "Another Author",
        "avatar": "/images/authors/another.png",
        "bio": "Loves to write about space.",
        "profileSlug": "/authors/another-author"
      }
    }
    ```
    - The key for each author (e.g., `"johndoe"`) is the `authorId`.
    - `avatar` paths should be relative to your `public/` directory or absolute URLs.
    - `profileSlug` will be used to generate the URL for the author's page (e.g., `your-site.com/authors/johndoe`). Ensure these are unique.

2.  **Add Author ID to Frontmatter**

    In your Starlight Markdown or MDX files, add the `author` field to the frontmatter, using the `authorId` from your `authors.json` file:

    ```yaml
    ---
    title: "My Great Article"
    author: "johndoe" 
    ---

    Your article content here...
    ```

3.  **Expose Author ID to Client-Side Script**

    The plugin's `autoInject.js` script needs to access the `authorId` from the frontmatter. You need to ensure Starlight makes this data available on the `<html>` element's `dataset`. You can achieve this by customizing Starlight's `head` configuration or by using a remark/rehype plugin if Starlight's default templates don't do this.

    A common way to do this in Astro is to modify the `src/env.d.ts` (if using TypeScript) or directly ensure your layout passes this data. Starlight's default behavior might not expose all frontmatter to the `<html>` tag directly.

    **Example (Conceptual - may require Starlight specific adjustments):**
    If you are using a custom layout or have a way to inject into the `<html>` tag, you might do something like this in a Starlight layout component or through its configuration:

    ```astro
    // Potentially in a Starlight override or a layout file
    <html lang={Astro.props.lang} dir={Astro.props.dir} data-page-author={Astro.props.frontmatter.author}>
      {/* ... rest of the head and body ... */}
    </html>
    ```
    As of the current plugin implementation, you need to ensure `document.documentElement.dataset.pageAuthor` is set to the author's ID for the auto-injection to work.

4.  **Author Profile Pages**

    The plugin automatically creates profile pages for each author listed in your data file. These pages will be accessible via the `profileSlug` you defined (e.g., `/authors/johndoe`).

## Customization

-   **Styling**: The `AuthorProfile.astro` component and the author profile page (`[slug].astro`) have some basic inline styles. You can modify these components directly in your `node_modules/starlight-author-plugin/src/components/` and `node_modules/starlight-author-plugin/src/pages/authors/` (after installation) or by forking the plugin for more extensive changes. A better approach for overriding styles would be to use global CSS in your Starlight project that targets the classes/elements within the plugin's components.
-   **Data Source**: While the default is `src/data/authors.json`, you can configure a different path in the plugin options.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT
