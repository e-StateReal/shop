---
layout: default
title: e-State Real Store
description: Your premier real estate affiliate platform for discovering curated properties and real estate resources.
---

<!-- Education Section -->
<div>
  <div class="section-title">
    <div class="title-content">
      <i class="fas fa-graduation-cap"></i>
      <span>Education</span>
    </div>
    <a href="{{ site.baseurl }}/pages/education-full.html" class="view-all-link">
      <i class="fas fa-arrow-right"></i> View All
    </a>
  </div>
  <div id="education-preview" class="items-preview">
    <div class="loading-placeholder">
      <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
      <span class="ms-2">Loading educational materials...</span>
    </div>
  </div>
</div>
<!--split-->
<!-- Properties Section -->
<div>
  <div class="section-title">
    <div class="title-content">
      <i class="fas fa-building"></i>
      <span>Properties</span>
    </div>
    <a href="{{ site.baseurl }}/pages/properties-full.html" class="view-all-link">
      <i class="fas fa-arrow-right"></i> View All
    </a>
  </div>
  <div id="properties-preview" class="items-preview">
    <div class="loading-placeholder">
      <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
      <span class="ms-2">Loading properties...</span>
    </div>
  </div>
<script>
// Load and render latest 5 education and properties from _data/db.jsonl, using all available fields
async function loadHomePreviews() {
  try {
    // Get base URL dynamically
    const baseUrl = window.siteBaseurl || '';
    const dataUrl = `${baseUrl}/assets/data/db.jsonl`;
    
    console.log(`Loading home previews from: ${dataUrl}`);
    const resp = await fetch(dataUrl);
    if (!resp.ok) throw new Error('Could not load data');
    const text = await resp.text();
    const items = text.split('\n').filter(Boolean).map(line => JSON.parse(line));
    // Education: show up to 2 featured, or fill with most recent if not enough
    let edu = items.filter(i => i.category === 'education' && i.featured)
      .sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,2);
    if (edu.length < 2) {
      const extra = items.filter(i => i.category === 'education' && !i.featured)
        .sort((a,b) => new Date(b.date)-new Date(a.date))
        .slice(0, 2 - edu.length);
      edu = edu.concat(extra);
    }
    renderPreviewCards('education-preview', edu, 'No educational materials found.');
    // Properties: show up to 2 featured, or fill with most recent if not enough
    let props = items.filter(i => i.category === 'properties' && i.featured)
      .sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,2);
    if (props.length < 2) {
      const extra = items.filter(i => i.category === 'properties' && !i.featured)
        .sort((a,b) => new Date(b.date)-new Date(a.date))
        .slice(0, 2 - props.length);
      props = props.concat(extra);
    }
    renderPreviewCards('properties-preview', props, 'No properties found.');
  } catch (e) {
    document.getElementById('education-preview').innerHTML = '<div class="text-danger">Failed to load educational materials.</div>';
    document.getElementById('properties-preview').innerHTML = '<div class="text-danger">Failed to load properties.</div>';
  }
}

function getButtonText(item, meta) {
  // Determinar el botón basado en la categoría y contenido
  const category = item.category;
  const name = (item.name || '').toLowerCase();
  const description = (item.description || '').toLowerCase();
  const url = (meta.cta_url || item.url || '').toLowerCase();
  
  // Educación - Learn More
  if (category === 'education' || 
      name.includes('course') || name.includes('training') || name.includes('education') || name.includes('learn') ||
      description.includes('course') || description.includes('training') || description.includes('education') || description.includes('learn') ||
      url.includes('course') || url.includes('training') || url.includes('education') || url.includes('learn')) {
    return 'Learn More';
  }
  
  // Propiedades - Shop
  if (category === 'properties' || 
      name.includes('property') || name.includes('house') || name.includes('apartment') || name.includes('home') || name.includes('real estate') ||
      description.includes('property') || description.includes('house') || description.includes('apartment') || description.includes('home') || description.includes('real estate') ||
      url.includes('property') || url.includes('house') || url.includes('apartment') || url.includes('home') || url.includes('real estate')) {
    return 'Shop';
  }
  
  // Todo lo demás - Sign Up
  return 'Sign Up';
}

function getButtonClass(item, meta) {
  const buttonText = getButtonText(item, meta);
  
  switch (buttonText) {
    case 'Learn More':
      return 'btn-learn-more';
    case 'Shop':
      return 'btn-shop';
    case 'Sign Up':
      return 'btn-sign-up';
    default:
      return 'btn-sign-up'; // Fallback a Sign Up
  }
}

function renderPreviewCards(containerId, items, emptyMsg) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!items.length) {
    el.innerHTML = `<div class='text-muted'>${emptyMsg}</div>`;
    return;
  }
  const baseurl = window.siteBaseurl || '';
  const fallbackImg = `${baseurl}/assets/img/logo.png`;
  el.innerHTML = items.map(item => {
    const meta = item.metadata || {};
    // Fix image path for baseurl and fallback
    let imgSrc = '';
    if (item.image) {
      imgSrc = item.image.startsWith('http') ? item.image : `${baseurl}/${item.image.replace(/^\/+/, '')}`;
    }
    // Use fallback if image is missing or fails to load
    const imgTag = `<img src="${imgSrc || fallbackImg}" alt="${item.name}" onerror="this.onerror=null;this.src='${fallbackImg}';">`;
    return `
    <div class="preview-card${item.featured ? ' featured' : ''}">
      <div class="preview-img">
        <img src="${imgSrc || fallbackImg}" alt="${item.name}" onerror="this.onerror=null;this.src='${fallbackImg}';">
      </div>
      <div class="preview-info">
        <div class="preview-title">
          ${item.name || ''}
          ${item.featured ? ' <span class="badge featured" title="Featured"></span>' : ''}
        </div>
        <div class="preview-desc">${item.description || ''}</div>
        <div class="preview-meta">
          ${meta.author ? `<span><i class='fas fa-user'></i> ${meta.author}</span>` : ''}
          ${meta.agent ? `<span><i class='fas fa-user-tie'></i> ${meta.agent}</span>` : ''}
          ${meta.duration ? `<span><i class='fas fa-clock'></i> ${meta.duration}</span>` : ''}
          ${meta.price ? `<span><i class='fas fa-dollar-sign'></i> ${meta.price.toLocaleString ? meta.price.toLocaleString() : meta.price}</span>` : ''}
          ${meta.location ? `<span><i class='fas fa-map-marker-alt'></i> ${meta.location}</span>` : ''}
          ${meta.area ? `<span><i class='fas fa-ruler-combined'></i> ${meta.area}</span>` : ''}
          ${meta.bedrooms ? `<span><i class='fas fa-bed'></i> ${meta.bedrooms} bd</span>` : ''}
          ${meta.bathrooms ? `<span><i class='fas fa-bath'></i> ${meta.bathrooms} ba</span>` : ''}
          ${meta.level ? `<span><i class='fas fa-signal'></i> ${meta.level}</span>` : ''}
          ${meta.format ? `<span><i class='fas fa-file-alt'></i> ${meta.format}</span>` : ''}
          ${meta.language ? `<span><i class='fas fa-language'></i> ${meta.language}</span>` : ''}
          ${meta.status ? `<span><i class='fas fa-info-circle'></i> ${meta.status}</span>` : ''}
          ${meta.tags && meta.tags.length ? meta.tags.map(t => `<span class='badge'>${t}</span>`).join('') : ''}
        </div>
        <div class="preview-date">${item.date ? `<i class='fas fa-calendar-alt'></i> ${item.date}` : ''}</div>
        <a href="${meta.cta_url || item.url}" target="_blank" class="btn btn-sm btn-outline-primary ${getButtonClass(item, meta)}">${getButtonText(item, meta)}</a>
      </div>
    </div>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', loadHomePreviews);
</script>
</div>

<!-- Admin Login Button (Hidden by default, shown only with #admin) -->
<div class="admin-login" id="adminLogin" style="display: none; margin-top:2rem; text-align:center;">
  <button onclick="showAdminPanel()">
    <i class="fas fa-lock"></i> Admin Login
  </button>
</div>

<!-- Admin Panel (Hidden by default) -->
<div class="admin-panel" id="adminPanel" style="display: none; margin-top:2rem;">
  <h2><i class="fas fa-cog"></i> Manage Links</h2>
  <div class="link-form">
    <form onsubmit="event.preventDefault();">
      <input type="text" name="username" id="adminUsername" autocomplete="username" style="display:none;">
      <input type="password" id="adminPassword" placeholder="Enter Admin Password" class="password-input" autocomplete="new-password">
    </form>
    <div class="form-grid" style="display:grid; gap:0.5rem; grid-template-columns:repeat(auto-fit,minmax(200px,1fr));">
      <input type="text" id="productName" placeholder="Link Title" required>
      <input type="url" id="affiliateLink" placeholder="Destination URL" required>
      <input type="url" id="productImage" placeholder="Image URL (optional)">
      <select id="productCategory" required>
        <option value="">Select Category</option>
        <option value="education">Education</option>
        <option value="featured">Featured</option>
        <option value="properties">Properties</option>
        <option value="investments">Investments</option>
        <option value="services">Services</option>
      </select>
      <textarea id="productDescription" placeholder="Brief description (optional)" rows="2"></textarea>
    </div>
    <div class="form-actions" style="margin-top:0.5rem; display:flex; gap:0.5rem;">
      <button onclick="addLink()" class="add-button">
        <i class="fas fa-plus"></i> Add Link
      </button>
      <button onclick="hideAdminPanel()" class="cancel-button">
        <i class="fas fa-times"></i> Cancel
      </button>
    </div>
  </div>
</div>
