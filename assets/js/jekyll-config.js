// Jekyll Configuration exposed to frontend
// This file is processed by Jekyll and exposes site configuration to JavaScript

window.siteBaseurl = '{{ site.baseurl }}';
window.siteUrl = '{{ site.url }}';
window.siteTitle = '{{ site.title }}';
window.siteDescription = '{{ site.description }}';

// Log configuration for debugging
console.log('Jekyll config loaded:', {
    baseurl: window.siteBaseurl,
    url: window.siteUrl,
    title: window.siteTitle
}); 