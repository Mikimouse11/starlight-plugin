document.addEventListener("DOMContentLoaded", () => {
  const container = document.createElement("div");
  container.id = "starlight-cta-container";

  // Use the globally defined __CTA_OPTIONS__ injected via Vite define
  const options = typeof __CTA_OPTIONS__ !== "undefined" ? __CTA_OPTIONS__ : {
    message: 'Join us today and unlock exclusive offers!',
    buttonText: 'Sign Up Now',
    buttonLink: '#'
  };

  container.innerHTML = `
    <div class="cta-box" style="padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; text-align: center; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-size: 1.2rem; margin-bottom: 10px;">${options.message}</p>
      <a href="${options.buttonLink}" class="cta-button" style="display: inline-block; padding: 10px 20px; background-color: #007acc; color: #fff; text-decoration: none; border-radius: 4px;">${options.buttonText}</a>
    </div>
  `;

  document.body.appendChild(container);
}); 