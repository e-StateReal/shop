---
layout: form-page
title: All Educational Materials
description: Browse all our educational materials, courses, and webinars
permalink: /pages/education-full.html
---

<div class="full-view-container">
    <div class="page-header">
        <h1 class="page-title">🎓 Educational Materials</h1>
        <p class="page-subtitle">Discover all our courses, webinars, and educational resources</p>
        <a href="{{ site.baseurl }}/" class="btn btn-outline-primary d-inline-flex align-items-center">
            <i class="fas fa-arrow-left" style="margin-right:0.5em;"></i><span>Back to Home</span>
        </a>
    </div>
    
    <div class="filters-section mb-4">
        <div class="row">
            <div class="col-md-4">
                <label for="typeFilter" class="form-label">Filter by Type</label>
                <select class="form-select" id="typeFilter">
                    <option value="">All Types</option>
                    <option value="course">Courses</option>
                    <option value="webinar">Webinars</option>
                    <option value="workshop">Workshops</option>
                    <option value="ebook">E-books</option>
                    <option value="certification">Certifications</option>
                    <option value="masterclass">Masterclasses</option>
                </select>
            </div>
            <div class="col-md-4">
                <label for="priceFilter" class="form-label">Filter by Price</label>
                <select class="form-select" id="priceFilter">
                    <option value="">All Prices</option>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                </select>
            </div>
            <div class="col-md-4">
                <label for="searchInput" class="form-label">Search</label>
                <input type="text" class="form-control" id="searchInput" placeholder="Search materials...">
            </div>
        </div>
    </div>
    
    <div id="education-grid" class="items-grid">
        <!-- Educational materials will be loaded here -->
        <div class="loading-placeholder">
            <div class="spinner-border text-primary" role="status"></div>
            <span class="ms-2">Loading educational materials...</span>
        </div>
    </div>
    
    <div id="load-more-container" class="text-center mt-4" style="display: none;">
        <button id="load-more-btn" class="btn btn-primary">
            <i class="fas fa-plus me-2"></i>Load More
        </button>
    </div>
</div>

<style>
.full-view-container {
    max-width: 1200px;
    margin: 0 auto;
}

.page-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 0;
    border-bottom: 2px solid #e9ecef;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 1rem;
}

.page-subtitle {
    font-size: 1.2rem;
    color: #6c757d;
    margin-bottom: 2rem;
}

.items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.loading-placeholder {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    color: #6c757d;
}

.filters-section {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #e9ecef;
}
</style> 