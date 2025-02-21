import type { CtaBoxOptions } from './types';

export default function ctaBoxPlugin(options: CtaBoxOptions = {}) {
  // Default settings for the CTA box (you can override these when using the plugin)
  const defaultOptions: CtaBoxOptions = {
    message: 'Join us today and unlock exclusive offers!',
    buttonText: 'Sign Up Now',
    buttonLink: '#'
  };
  const config = { ...defaultOptions, ...options };

  return {
    name: 'starlight-cta-box',
    hooks: {
      'astro:config:setup': ({ updateConfig }: { updateConfig: (config: any) => void }) => {
         updateConfig({
           vite: {
             resolve: {
               alias: {
                 // Alias for the CTA component (optional)
                 '@starlight/cta-box': new URL('./components/CtaBox.astro', import.meta.url).pathname,
                 // Alias for the auto injection script
                 '@starlight/cta-auto': new URL('./autoInject.js', import.meta.url).pathname
               }
             },
             plugins: [
               {
                 name: 'starlight-cta-auto-inject',
                 transformIndexHtml(html: string) {
                   // Inject the auto-injection script before the closing body tag
                   return html.replace('</body>', '<script type="module" src="@starlight/cta-auto"></script></body>');
                 }
               }
             ],
             define: {
               __CTA_OPTIONS__: JSON.stringify(config)
             }
           }
         });
      }
    },
    // Expose the component in case manual usage is desired
    components: {
      CtaBox: new URL('./components/CtaBox.astro', import.meta.url).pathname
    },
    options: config
  };
} 