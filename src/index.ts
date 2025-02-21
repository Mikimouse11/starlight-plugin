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
                 // Alias for the CTA component
                 '@starlight/cta-box': new URL('./components/CtaBox.astro', import.meta.url).pathname
               }
             }
           }
         });
      }
    },
    components: {
      CtaBox: new URL('./components/CtaBox.astro', import.meta.url).pathname
    },
    options: config
  };
} 