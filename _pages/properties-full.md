---
layout: form-page
title: All Properties
description: Browse all our available properties and investment opportunities
permalink: /pages/properties-full.html
---

<div class="full-view-container">
    <div class="page-header">
        <h1 class="page-title">🏠 Properties</h1>
        <p class="page-subtitle">Discover all our available properties and investment opportunities</p>
        <a href="{{ site.baseurl }}/" class="btn btn-outline-primary d-inline-flex align-items-center">
            <i class="fas fa-arrow-left" style="margin-right:0.5em;"></i><span>Back to Home</span>
        </a>
    </div>
    
    <div class="filters-section mb-4">
        <div class="row">
            <div class="col-md-3">
                <label for="typeFilter" class="form-label">Property Type</label>
                <select class="form-select" id="typeFilter">
                    <option value="">All Types</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="investment">Investment</option>
                    <option value="luxury">Luxury</option>
                    <option value="rental">Rental</option>
                </select>
            </div>
            <div class="col-md-3">
                <label for="priceRangeFilter" class="form-label">Price Range</label>
                <select class="form-select" id="priceRangeFilter">
                    <option value="">All Prices</option>
                    <option value="0-200000">Under $200K</option>
                    <option value="200000-500000">$200K - $500K</option>
                    <option value="500000-1000000">$500K - $1M</option>
                    <option value="1000000+">Over $1M</option>
                </select>
            </div>
            <div class="col-md-3">
                <label for="bedroomsFilter" class="form-label">Bedrooms</label>
                <select class="form-select" id="bedroomsFilter">
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                </select>
            </div>
            <div class="col-md-3">
                <label for="searchInput" class="form-label">Search</label>
                <input type="text" class="form-control" id="searchInput" placeholder="Search properties...">
            </div>
        </div>
    </div>
    
    <div id="properties-grid" class="items-grid">
        <!-- Properties will be loaded here -->
        <div class="loading-placeholder">
            <div class="spinner-border text-primary" role="status"></div>
            <span class="ms-2">Loading properties...</span>
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