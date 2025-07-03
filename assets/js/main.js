// Enhanced functionality for e-State Real Store landing page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        // Ensure modals are properly initialized
        if (typeof bootstrap !== 'undefined') {
            new bootstrap.Modal(modal);
        }
    });

    // Make modals draggable
    initializeDraggableModals();

    // Load preview items
    loadPreviewItems();

    // Enhanced button functionality
    const actionButtons = document.querySelectorAll('.btn-primary, .btn-success');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add loading state
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;
            
            // Simulate action (replace with actual functionality)
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                
                // Close modal if it's inside one
                const modal = this.closest('.modal');
                if (modal && typeof bootstrap !== 'undefined') {
                    const bsModal = bootstrap.Modal.getInstance(modal);
                    if (bsModal) {
                        bsModal.hide();
                    }
                }
                
                // Show success message
                showNotification('Action completed successfully!', 'success');
            }, 1000);
        });
    });

    // Social media links enhancement
    const socialLinks = document.querySelectorAll('.social-icons a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add tracking or analytics here if needed
            console.log('Social link clicked:', this.href);
        });
    });

    // Smooth scrolling for any anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#28a745' : '#007bff'};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Add hover effects to link list items
    const linkItems = document.querySelectorAll('.link-list li');
    linkItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.01)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Keyboard navigation for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                if (typeof bootstrap !== 'undefined') {
                    const bsModal = bootstrap.Modal.getInstance(modal);
                    if (bsModal) {
                        bsModal.hide();
                    }
                }
            });
        }
    });

    // Performance optimization: Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Load preview items for the main page
function loadPreviewItems() {
    // Load educational materials preview
    const educationPreview = document.getElementById('education-preview');
    if (educationPreview) {
        loadEducationPreview(educationPreview);
    }
    
    // Load properties preview
    const propertiesPreview = document.getElementById('properties-preview');
    if (propertiesPreview) {
        loadPropertiesPreview(propertiesPreview);
    }
}

function loadEducationPreview(container) {
    // Get educational materials (latest 5)
    const materials = window.getEducationalMaterials ? window.getEducationalMaterials() : [];
    const latestMaterials = materials.slice(0, 5);
    
    if (latestMaterials.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-graduation-cap"></i>
                <h4>No Educational Materials</h4>
                <p>Check back soon for new courses and webinars!</p>
            </div>
        `;
        return;
    }
    
    const itemsHTML = latestMaterials.map(item => createEducationCard(item)).join('');
    container.innerHTML = itemsHTML;
}

function loadPropertiesPreview(container) {
    // Get properties (latest 5)
    const properties = window.getProperties ? window.getProperties() : [];
    const latestProperties = properties.slice(0, 5);
    
    if (latestProperties.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-building"></i>
                <h4>No Properties Available</h4>
                <p>Check back soon for new property listings!</p>
            </div>
        `;
        return;
    }
    
    const itemsHTML = latestProperties.map(item => createPropertyCard(item)).join('');
    container.innerHTML = itemsHTML;
}

function createEducationCard(item) {
    const priceDisplay = item.original_price && item.original_price !== item.price 
        ? `<span class="original-price">${item.original_price}</span>` : '';
    
    const metaInfo = [];
    if (item.duration) metaInfo.push(`<span class="meta-item"><i class="fas fa-clock"></i>${item.duration}</span>`);
    if (item.type) metaInfo.push(`<span class="meta-item"><i class="fas fa-tag"></i>${item.type}</span>`);
    
    // Determine which buttons to show based on type
    let actionButtons = '';
    if (item.type === 'course') {
        actionButtons = `
            <a href="#" onclick="handleGetStarted('${item.guid}'); return false;" class="btn btn-outline-primary">Get Started</a>
            <a href="#" onclick="handleEnrollNow('${item.guid}'); return false;" class="btn btn-primary">Enroll Now</a>
        `;
    } else {
        // For webinars, workshops, etc. - only show Enroll Now
        actionButtons = `
            <a href="#" onclick="handleEnrollNow('${item.guid}'); return false;" class="btn btn-primary">Enroll Now</a>
        `;
    }
    
    return `
        <div class="item-card">
            <div class="item-header">
                <h5 class="item-title">${item.title}</h5>
                <div class="item-price">${item.price}${priceDisplay}</div>
            </div>
            <div class="item-details">
                <div class="item-meta">${metaInfo.join('')}</div>
                <p class="item-description">${item.description || 'Learn more about this educational opportunity.'}</p>
            </div>
            <div class="item-actions">
                ${actionButtons}
            </div>
        </div>
    `;
}

function createPropertyCard(item) {
    const metaInfo = [];
    if (item.location) metaInfo.push(`<span class="meta-item"><i class="fas fa-map-marker-alt"></i>${item.location}</span>`);
    if (item.size) metaInfo.push(`<span class="meta-item"><i class="fas fa-ruler-combined"></i>${item.size}</span>`);
    if (item.bedrooms) metaInfo.push(`<span class="meta-item"><i class="fas fa-bed"></i>${item.bedrooms} bed</span>`);
    
    return `
        <div class="item-card">
            <div class="item-header">
                <h5 class="item-title">${item.title}</h5>
                <div class="item-price">${item.price}</div>
            </div>
            <div class="item-details">
                <div class="item-meta">${metaInfo.join('')}</div>
                <p class="item-description">${item.description || 'Discover this amazing property opportunity.'}</p>
            </div>
            <div class="item-actions">
                <a href="#" onclick="handleContactAgent('${item.guid}'); return false;" class="btn btn-outline-primary">Contact Agent</a>
                <a href="#" onclick="handleScheduleVisit('${item.guid}'); return false;" class="btn btn-primary">Schedule Visit</a>
            </div>
        </div>
    `;
}

// Draggable modal functionality
function initializeDraggableModals() {
    const draggableModals = document.querySelectorAll('.modal-draggable');
    
    draggableModals.forEach(modalDialog => {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const modalHeader = modalDialog.querySelector('.modal-header');
        
        if (modalHeader) {
            modalHeader.style.cursor = 'move';
            modalHeader.style.userSelect = 'none';
            
            modalHeader.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        }

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === modalHeader || modalHeader.contains(e.target)) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, modalDialog);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        // Reset position when modal is hidden
        const modal = modalDialog.closest('.modal');
        if (modal) {
            modal.addEventListener('hidden.bs.modal', function() {
                xOffset = 0;
                yOffset = 0;
                modalDialog.style.transform = 'translate3d(0px, 0px, 0)';
            });
        }
    });
}

// Helper: Get Jekyll baseurl from meta tag or set on window
if (!window.siteBaseurl) {
  var baseurlMeta = document.querySelector('meta[name="jekyll-baseurl"]');
  window.siteBaseurl = baseurlMeta ? baseurlMeta.content : (window.JEKYLL_BASEURL || '');
}

// Global handlers for new buttons - Redirect to form pages with specific identifiers
window.handleGetStarted = function(itemId) {
    const url = `${window.siteBaseurl || ''}/pages/get-started.html?item=${encodeURIComponent(itemId)}`;
    window.location.href = url;
};

window.handleEnrollNow = function(itemId) {
    const url = `${window.siteBaseurl || ''}/pages/enroll.html?item=${encodeURIComponent(itemId)}`;
    window.location.href = url;
};

window.handleRegister = function(itemId) {
    const url = `${window.siteBaseurl || ''}/pages/register.html?item=${encodeURIComponent(itemId)}`;
    window.location.href = url;
};

window.handleContactAgent = function(itemId) {
    const url = `${window.siteBaseurl || ''}/pages/contact.html?item=${encodeURIComponent(itemId)}`;
    window.location.href = url;
};

window.handleScheduleVisit = function(itemId) {
    const url = `${window.siteBaseurl || ''}/pages/schedule.html?item=${encodeURIComponent(itemId)}`;
    window.location.href = url;
};