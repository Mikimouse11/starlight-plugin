// src/index.ts
import type { StarlightAuthorPluginOptions } from './types'; // Assuming types.ts will be updated or created
import { z } from 'astro/zod';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Define a schema for author data (optional but good practice)
const AuthorSchema = z.object({
  name: z.string(),
  avatar: z.string(), // URL or path to avatar
  bio: z.string().optional(),
  profileSlug: z.string(), // Slug for the author's profile page
});

// Define a schema for the authors data file
const AuthorsDataSchema = z.record(AuthorSchema);

export default function starlightAuthorPlugin(options: StarlightAuthorPluginOptions) {
  const { authors: authorsDataPath = 'src/data/authors.json' } = options;

  let authorsJson: Record<string, z.infer<typeof AuthorSchema>>;
  try {
    const resolvedPath = fileURLToPath(new URL(authorsDataPath, import.meta.url).href);
    const authorsFileContent = readFileSync(resolvedPath, 'utf-8');
    const parsedAuthors = JSON.parse(authorsFileContent);
    authorsJson = AuthorsDataSchema.parse(parsedAuthors);
  } catch (e) {
    console.error(`Failed to load or parse authors data from ${authorsDataPath}:`, e);
    authorsJson = {}; // Fallback to empty authors if loading fails
  }
  
  return {
    name: 'starlight-author-plugin',
    hooks: {
      'astro:config:setup': ({ updateConfig, injectScript }: { updateConfig: (config: any) => void, injectScript: (stage: string, content: string) => void }) => {
        updateConfig({
          vite: {
            resolve: {
              alias: {
                '@starlight-author-plugin/AuthorProfile.astro': new URL('./components/AuthorProfile.astro', import.meta.url).pathname,
                '@starlight-author-plugin/autoInject.js': new URL('./autoInject.js', import.meta.url).pathname,
              },
            },
            define: {
              // Make authors data available to client-side scripts if needed,
              // or directly pass to components via props.
              __AUTHORS_DATA__: JSON.stringify(authorsJson),
            },
          },
        });

        // Inject the auto-injection script
        // This script will be responsible for finding the right place to add the AuthorProfile component.
        // It needs to be a module to use import statements if AuthorProfile.astro is imported there.
        // However, a simpler approach for autoInject.js is to receive data via __AUTHORS_DATA__
        // and then dynamically create and insert the AuthorProfile component or its placeholder.
         injectScript('page-ssr', `
           import AuthorProfile from '@starlight-author-plugin/AuthorProfile.astro';
           // This is a placeholder for how autoInject.js might get access to AuthorProfile
           // The actual autoInject.js will need to be more sophisticated.
           console.log('AuthorProfile component loaded for potential injection.');
         `);
      },
    },
    components: {
      // Expose the AuthorProfile component so users can manually place it if they prefer
      AuthorProfile: new URL('./components/AuthorProfile.astro', import.meta.url).pathname,
    },
    // Pass options or processed data if needed by other parts of the plugin or by users
    pluginOptions: {
      authorsData: authorsJson,
      ...options
    }
  };
}