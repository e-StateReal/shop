// Admin Panel functionality for e-State Real Store (Ctrl+Shift+L to open modal)
const ADMIN_PASSWORD_HASH = '7e3b5d535fc4bcaf47302bb84133e6e61291b7e26f6300c23fb4796f120d04a7';
let links = [];
let currentEditingIndex = null;
let hasUnsavedChanges = false;

// Get the base URL dynamically from Jekyll configuration
function getBaseUrl() {
    // Try to get from Jekyll's site.baseurl first
    if (typeof window.siteBaseurl !== 'undefined') {
        return window.siteBaseurl;
    }

    // Fallback: try to detect from current URL
    const path = window.location.pathname;
    if (path.startsWith('/shop/')) {
        return '/shop';
    }

    // Fallback: try to get from meta tag
    const metaTag = document.querySelector('meta[name="jekyll-baseurl"]');
    if (metaTag && metaTag.content) {
        return metaTag.content;
    }

    // Default to root if no baseurl detected
    return '';
}

// Load published links from assets/data/db.jsonl
async function loadLinksFromJsonl() {
    try {
        const baseUrl = getBaseUrl();
        const dataUrl = `${baseUrl}/assets/data/db.jsonl`;

        console.log(`Loading data from: ${dataUrl}`);
        const resp = await fetch(dataUrl);

        if (!resp.ok) {
            if (resp.status === 404) {
                console.log('db.jsonl file not found, starting with empty list');
                links = [];
                return;
            }
            throw new Error('Could not load published links');
        }

        const text = await resp.text();
        const lines = text.split('\n').filter(Boolean);

        if (lines.length === 0) {
            console.log('db.jsonl file is empty, starting with empty list');
            links = [];
            return;
        }

        links = lines.map((line, index) => {
            try {
                return JSON.parse(line);
            } catch (parseError) {
                console.warn(`Error parsing line ${index + 1}:`, parseError);
                return null;
            }
        }).filter(Boolean); // Remove any null entries from parsing errors

        console.log(`Loaded ${links.length} valid links from db.jsonl`);

        // Validate data structure
        links.forEach((link, index) => {
            if (!link.name || !link.category || !link.url) {
                console.warn(`Link at index ${index} missing required fields:`, link);
            }
        });

    } catch (e) {
        console.warn('Could not load existing links:', e);
        showNotification('Could not load existing data. Starting with empty list.', 'warning');
        links = [];
    }
}

// Validate and clean link data
function validateAndCleanLink(link) {
    const cleaned = { ...link };

    // Ensure required fields
    if (!cleaned.name || !cleaned.category || !cleaned.url) {
        throw new Error(`Missing required fields: name, category, or url`);
    }

    // Clean and validate category
    if (!['education', 'properties'].includes(cleaned.category)) {
        throw new Error(`Invalid category: ${cleaned.category}`);
    }

    // Ensure metadata exists
    if (!cleaned.metadata) {
        cleaned.metadata = {};
    }

    // Clean empty strings and undefined values
    Object.keys(cleaned).forEach(key => {
        if (cleaned[key] === '' || cleaned[key] === undefined) {
            delete cleaned[key];
        }
    });

    // Clean metadata
    if (cleaned.metadata) {
        Object.keys(cleaned.metadata).forEach(key => {
            if (cleaned.metadata[key] === '' || cleaned.metadata[key] === undefined) {
                delete cleaned.metadata[key];
            }
        });

        // Remove metadata if empty
        if (Object.keys(cleaned.metadata).length === 0) {
            delete cleaned.metadata;
        }
    }

    return cleaned;
}

// Export links as JSONL file (maintains db.jsonl format)
function exportLinksAsJsonl() {
    if (!links.length) {
        showNotification('No links to export!', 'warning');
        return;
    }

    try {
        // Validate and clean all links
        const validLinks = [];
        const invalidLinks = [];

        links.forEach((link, index) => {
            try {
                const cleaned = validateAndCleanLink(link);
                validLinks.push(cleaned);
            } catch (error) {
                console.warn(`Invalid link at index ${index}:`, error.message);
                invalidLinks.push({ index, link, error: error.message });
            }
        });

        if (invalidLinks.length > 0) {
            const message = `${invalidLinks.length} items have validation errors and will be excluded from export.`;
            showNotification(message, 'warning');
            console.warn('Invalid links:', invalidLinks);
        }

        if (validLinks.length === 0) {
            showNotification('No valid links to export!', 'error');
            return;
        }

        // Sort links by category and date for consistent ordering
        const sortedLinks = validLinks.sort((a, b) => {
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }
            return (b.date || '').localeCompare(a.date || '');
        });

        const jsonl = sortedLinks.map(l => JSON.stringify(l)).join('\n');
        const blob = new Blob([jsonl], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'db.jsonl';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        // Show success message
        const message = `Export successful! ${sortedLinks.length} items saved to db.jsonl`;
        if (invalidLinks.length > 0) {
            showNotification(message + ` (${invalidLinks.length} invalid items excluded)`, 'success');
        } else {
            showNotification(message, 'success');
        }

        hasUnsavedChanges = false;

    } catch (error) {
        showNotification('Error during export: ' + error.message, 'error');
        console.error('Export error:', error);
    }
}

// Show notification messages
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        max-width: 300px;
        word-wrap: break-word;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
    `;

    switch (type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'warning':
            notification.style.background = '#ffc107';
            notification.style.color = '#212529';
            break;
        default:
            notification.style.background = '#17a2b8';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Reset form to add new item
function resetForm() {
    document.getElementById('adminLinkForm').reset();
    currentEditingIndex = null;
    document.getElementById('addOrUpdateLinkBtn').textContent = 'Add New Item';
    document.getElementById('addOrUpdateLinkBtn').className = 'btn btn-primary w-100 fw-semibold';
    
    // Set current date as default
    setCurrentDateAsDefault();
    
    // Update form fields based on current category selection
    setTimeout(() => {
        const currentCategory = document.getElementById('productCategory').value;
        updateFormFieldsByCategory(currentCategory);
    }, 50);
    
    showNotification('Form reset - ready to add new item', 'info');
}

// Logic to enable/disable fields depending on the selected category
function updateFormFieldsByCategory(selectedCategory = null) {
    let cat = selectedCategory;
    
    // If no category passed, get it from the select
    if (cat === null) {
        const categorySelect = document.getElementById('productCategory');
        if (!categorySelect) {
            console.warn('Category select not found');
            return;
        }
        cat = categorySelect.value;
    }
    
    console.log('updateFormFieldsByCategory called with category:', cat);
    
    // If no category is selected, disable optional fields but keep date enabled
    if (!cat || cat === '') {
        console.log('No category selected - disabling optional fields (Date always enabled)');
        disableAllOptionalFields();
        return;
    }

    // Get all form elements
    const priceInput = document.getElementById('productPrice');
    const agentInput = document.getElementById('productAgent');
    const statusInput = document.getElementById('productStatus');
    const authorInput = document.getElementById('productAuthor');
    const dateInput = document.getElementById('productDate');
    const ctaInput = document.getElementById('productCta');
    const ctaUrlInput = document.getElementById('productCtaUrl');

    // Get parent containers for visual feedback
    const colPrice = document.getElementById('colPrice');
    const colAgent = document.getElementById('colAgent');
    const colStatus = document.getElementById('colStatus');
    const rowAuthor = document.getElementById('rowAuthor');
    const colDate = document.getElementById('colDate');
    const rowCta = document.getElementById('rowCta');
    
    console.log('Found elements:', {
        priceInput: !!priceInput,
        agentInput: !!agentInput,
        statusInput: !!statusInput,
        authorInput: !!authorInput,
        dateInput: !!dateInput,
        ctaInput: !!ctaInput,
        ctaUrlInput: !!ctaUrlInput
    });

    // Reset all fields to enabled state and show all
    [priceInput, agentInput, statusInput, authorInput, ctaInput, ctaUrlInput].forEach(input => {
        if (input) {
            input.disabled = false;
            input.style.opacity = '1';
            input.style.backgroundColor = '';
        }
    });
    
    // Always keep date field enabled
    if (dateInput) {
        dateInput.disabled = false;
        dateInput.style.opacity = '1';
        dateInput.style.backgroundColor = '';
    }
    
    console.log('Reset all fields to enabled state (Date always enabled)');

    // Show all containers
    [colPrice, colAgent, colStatus, colDate].forEach(container => {
        if (container) {
            container.style.opacity = '1';
        }
    });

    // Handle rowAuthor visibility specifically
    if (rowAuthor) {
        rowAuthor.classList.remove('d-none');
        rowAuthor.classList.add('d-flex');
        rowAuthor.style.opacity = '1';
    }

    // Handle rowCta - just opacity, no display changes
    if (rowCta) {
        rowCta.style.opacity = '1';
    }

    // Apply category-specific field states
    if (cat === 'education') {
        console.log('Applying Education category rules');
        
        // Education: Enable author and general fields, disable property-specific fields
        if (authorInput) {
            authorInput.disabled = false;
            authorInput.style.opacity = '1';
            authorInput.style.backgroundColor = '';
            console.log('✓ Author field enabled for education');
        }

        // Enable general fields for education (date is always enabled)
        [ctaInput, ctaUrlInput].forEach(input => {
            if (input) {
                input.disabled = false;
                input.style.opacity = '1';
                input.style.backgroundColor = '';
            }
        });
        
        // Date field is always enabled
        if (dateInput) {
            dateInput.disabled = false;
            dateInput.style.opacity = '1';
            dateInput.style.backgroundColor = '';
        }
        
        console.log('✓ General fields (cta, ctaUrl) enabled for education, Date always enabled');

        // Disable property-specific fields
        [priceInput, agentInput, statusInput].forEach(input => {
            if (input) {
                input.disabled = true;
                input.style.opacity = '0.5';
                input.style.backgroundColor = '#f8f9fa';
                input.value = ''; // Clear disabled fields
            }
        });
        console.log('✗ Property fields (price, agent, status) disabled for education');

        // Visual feedback for disabled containers
        [colPrice, colAgent, colStatus].forEach(container => {
            if (container) {
                container.style.opacity = '0.6';
            }
        });

    } else if (cat === 'properties') {
        console.log('Applying Properties category rules');
        
        // Properties: Enable all property fields (date is always enabled)
        [priceInput, agentInput, statusInput, ctaInput, ctaUrlInput].forEach(input => {
            if (input) {
                input.disabled = false;
                input.style.opacity = '1';
                input.style.backgroundColor = '';
            }
        });
        
        // Date field is always enabled
        if (dateInput) {
            dateInput.disabled = false;
            dateInput.style.opacity = '1';
            dateInput.style.backgroundColor = '';
        }
        
        console.log('✓ Property fields (price, agent, status, cta, ctaUrl) enabled, Date always enabled');

        // Disable education fields
        if (authorInput) {
            authorInput.disabled = true;
            authorInput.style.opacity = '0.5';
            authorInput.style.backgroundColor = '#f8f9fa';
            authorInput.value = ''; // Clear disabled field
            console.log('✗ Author field disabled for properties');
        }

        // Visual feedback for disabled container
        if (rowAuthor) {
            rowAuthor.style.opacity = '0.6';
        }

    }
    
    console.log('updateFormFieldsByCategory completed for category:', cat);
}

// Helper function to disable all optional fields
function disableAllOptionalFields() {
    const fields = [
        'productPrice', 'productAgent', 'productStatus', 
        'productAuthor', 'productCta', 'productCtaUrl'
    ];
    
    const containers = ['colPrice', 'colAgent', 'colStatus'];
    const rows = ['rowAuthor', 'rowCta'];
    
    // Disable all fields except date
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.disabled = true;
            field.style.opacity = '0.5';
            field.style.backgroundColor = '#f8f9fa';
            field.value = ''; // Clear disabled fields
        }
    });
    
    // Date field is always enabled
    const dateField = document.getElementById('productDate');
    if (dateField) {
        dateField.disabled = false;
        dateField.style.opacity = '1';
        dateField.style.backgroundColor = '';
        // Don't clear the date value
    }
    
    // Visual feedback for containers (excluding date container)
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.style.opacity = '0.6';
        }
    });
    
    // Visual feedback for rows
    rows.forEach(rowId => {
        const row = document.getElementById(rowId);
        if (row) {
            row.style.opacity = '0.6';
        }
    });
    
    console.log('✗ Optional fields disabled (no category selected) - Date field always enabled');
}

// Render the links list in the admin modal with improved UI
function renderAdminLinksList() {
    const listDiv = document.getElementById('adminLinksList');
    if (!listDiv) return;

    if (!links.length) {
        listDiv.innerHTML = `
            <div style="text-align:center;color:#888;padding:2rem;">
                <i class="fas fa-inbox" style="font-size:3rem;margin-bottom:1rem;opacity:0.5;"></i>
                <h4>No items yet</h4>
                <p>Start by adding your first item!</p>
            </div>
        `;
        return;
    }

    // Group links by category
    const grouped = {};
    links.forEach((l, i) => {
        if (!grouped[l.category]) grouped[l.category] = [];
        grouped[l.category].push({ ...l, _idx: i });
    });

    let html = '';
        Object.keys(grouped).sort().forEach(cat => {
        const categoryCount = grouped[cat].length;
        const featuredCount = grouped[cat].filter(l => l.featured).length;
        const categoryId = `category-${cat}`;
        
        html += `
            <div style='margin-bottom:1.5rem;'>
                <div style='font-weight:700;font-size:1.1rem;margin-bottom:0.5rem;color:#3498db;display:flex;justify-content:space-between;align-items:center;cursor:pointer;padding:0.5rem;border-radius:6px;transition:background 0.2s;' 
                     onclick="toggleCategory('${categoryId}')" 
                     onmouseover="this.style.background='#f8f9fa'" 
                     onmouseout="this.style.background='transparent'">
                    <div style='display:flex;align-items:center;gap:0.5rem;'>
                        <i class="fas fa-chevron-down" id="icon-${categoryId}" style='transition:transform 0.3s;font-size:0.9rem;'></i>
                        <span>${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                    </div>
                    <span style='font-size:0.8rem;color:#666;'>
                        ${categoryCount} item${categoryCount !== 1 ? 's' : ''}
                        ${featuredCount > 0 ? ` (${featuredCount} featured)` : ''}
                    </span>
                </div>
                <div id="${categoryId}" style='transition:all 0.3s ease;overflow:hidden;'>
        `;

                grouped[cat].forEach(l => {
            const isFeatured = l.featured ? '<span style="color:#ffc107;margin-left:0.3rem;" title="Featured">★</span>' : '';
            const hasImage = l.image ? `<i class="fas fa-image" style="color:#3498db;margin-left:0.3rem;cursor:pointer;" title="View Image" onclick="showImageModal('${l.image.replace(/'/g, "\\'")}', '${(l.name || '').replace(/'/g, "\\'")}')"></i>` : '';
            
            // Build metadata display
            const meta = l.metadata || {};
            const metaItems = [];
            if (meta.author) metaItems.push(`<span><i class="fas fa-user"></i> ${meta.author}</span>`);
            if (meta.agent) metaItems.push(`<span><i class="fas fa-user-tie"></i> ${meta.agent}</span>`);
            if (meta.price) metaItems.push(`<span><i class="fas fa-dollar-sign"></i> ${meta.price.toLocaleString ? meta.price.toLocaleString() : meta.price}</span>`);
            if (meta.status) metaItems.push(`<span><i class="fas fa-info-circle"></i> ${meta.status}</span>`);
            if (meta.location) metaItems.push(`<span><i class="fas fa-map-marker-alt"></i> ${meta.location}</span>`);
            if (meta.area) metaItems.push(`<span><i class="fas fa-ruler-combined"></i> ${meta.area}</span>`);
            if (meta.bedrooms) metaItems.push(`<span><i class="fas fa-bed"></i> ${meta.bedrooms} bd</span>`);
            if (meta.bathrooms) metaItems.push(`<span><i class="fas fa-bath"></i> ${meta.bathrooms} ba</span>`);
            if (meta.duration) metaItems.push(`<span><i class="fas fa-clock"></i> ${meta.duration}</span>`);
            if (meta.level) metaItems.push(`<span><i class="fas fa-signal"></i> ${meta.level}</span>`);
            if (meta.format) metaItems.push(`<span><i class="fas fa-file-alt"></i> ${meta.format}</span>`);
            if (meta.language) metaItems.push(`<span><i class="fas fa-language"></i> ${meta.language}</span>`);
            
            const metaDisplay = metaItems.length > 0 ? `<div style="font-size:0.75rem;color:#666;margin-bottom:0.3rem;display:flex;flex-wrap:wrap;gap:0.4rem;">${metaItems.join('')}</div>` : '';
            
            // Build tags display
            const tagsDisplay = meta.tags && meta.tags.length > 0 ? 
                `<div style="font-size:0.7rem;margin-bottom:0.3rem;display:flex;flex-wrap:wrap;gap:0.2rem;">${meta.tags.map(tag => `<span style="background:#e3f2fd;color:#1976d2;padding:0.1rem 0.3rem;border-radius:3px;font-weight:500;">${tag}</span>`).join('')}</div>` : '';
            
            html += `
                <div style="background:#f8f9fa;border-radius:8px;padding:0.8rem;margin-bottom:0.5rem;border-left:3px solid #3498db;">
                    <div style="display:flex;align-items:flex-start;gap:0.7rem;">
                        <div style="flex:1;overflow:hidden;">
                            <div style="font-weight:600;color:#222;margin-bottom:0.3rem;display:flex;align-items:center;font-size:0.95rem;">
                                ${l.name || 'Untitled'}${isFeatured}${hasImage}
                            </div>
                            ${metaDisplay}
                            ${tagsDisplay}
                            <div style="font-size:0.75rem;color:#666;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                                ${l.url ? `<a href='${l.url}' target='_blank' style='color:#3498db;text-decoration:none;'><i class="fas fa-external-link-alt"></i> ${l.url}</a>` : '<span style="color:#999;">No URL</span>'}
                            </div>
                        </div>
                        <div style="display:flex;flex-direction:column;gap:0.2rem;flex-shrink:0;">
                            <button title="Edit Item" data-edit="${l._idx}" style="background:none;border:none;color:#f1c40f;font-size:1rem;cursor:pointer;padding:0.25rem;border-radius:4px;transition:background 0.2s;width:28px;height:28px;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.background='#fff8e1'" onmouseout="this.style.background='none'">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button title="Delete Item" data-delete="${l._idx}" style="background:none;border:none;color:#e74c3c;font-size:1rem;cursor:pointer;padding:0.25rem;border-radius:4px;transition:background 0.2s;width:28px;height:28px;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.background='#ffebee'" onmouseout="this.style.background='none'">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div></div>';
    });

    listDiv.innerHTML = html;

    // Add event listeners for buttons
    addListEventListeners();
    
    // Initialize all categories as expanded
    setTimeout(() => {
        Object.keys(grouped).sort().forEach(cat => {
            const categoryId = `category-${cat}`;
            const categoryDiv = document.getElementById(categoryId);
            if (categoryDiv) {
                categoryDiv.style.maxHeight = categoryDiv.scrollHeight + 'px';
                categoryDiv.style.opacity = '1';
            }
        });
    }, 100);
}

// Show image modal
function showImageModal(imageUrl, title) {
    // Escape HTML to prevent XSS
    const safeTitle = title ? title.replace(/[<>]/g, '') : 'Image Preview';
    const safeImageUrl = imageUrl.replace(/[<>]/g, '');
    
    console.log('Opening image modal for:', safeImageUrl); // Debug log
    
    const imageModal = document.createElement('div');
    imageModal.id = 'imageModal';
    imageModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        backdrop-filter: blur(4px);
    `;
    
    imageModal.innerHTML = `
        <div style="
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            max-width: 90vw;
            max-height: 90vh;
            overflow: hidden;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        ">
            <button id="closeImageModal" style="
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                font-size: 1.8rem;
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                z-index: 10;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s;
            " onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='none'">&times;</button>
            
            <div style="text-align: center; max-height: calc(90vh - 3rem); overflow-y: auto;">
                <h4 style="color: #3498db; margin-bottom: 1rem; font-size: 1.2rem;">${safeTitle}</h4>
                <div id="imageContainer" style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 200px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border: 2px dashed #dee2e6;
                ">
                    <div id="imageLoading" style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 0.5rem;
                        color: #6c757d;
                    ">
                        <i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i>
                        <span>Loading image...</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(imageModal);
    
    // Create image element separately to handle events properly
    const img = document.createElement('img');
    img.id = 'modalImage';
    img.src = safeImageUrl;
    img.alt = safeTitle;
    img.style.cssText = `
        max-width: 100%;
        max-height: 70vh;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        display: none;
    `;
    
    img.onload = function() {
        console.log('Image loaded successfully'); // Debug log
        const loading = document.getElementById('imageLoading');
        if (loading) loading.style.display = 'none';
        img.style.display = 'block';
    };
    
    img.onerror = function() {
        console.log('Image failed to load'); // Debug log
        handleImageError();
    };
    
    const imageContainer = document.getElementById('imageContainer');
    if (imageContainer) {
        imageContainer.appendChild(img);
    }
    
    // Close button functionality
    document.getElementById('closeImageModal').onclick = function() {
        imageModal.remove();
    };
    
    // Close on background click
    imageModal.onclick = function(e) {
        if (e.target === imageModal) {
            imageModal.remove();
        }
    };
    
    // Close on Escape key
    const handleEscape = function(e) {
        if (e.key === 'Escape') {
            imageModal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Clean up event listener when modal is removed
    imageModal.addEventListener('remove', function() {
        document.removeEventListener('keydown', handleEscape);
    });
}

// Handle image loading errors
function handleImageError() {
    const imageContainer = document.getElementById('imageContainer');
    const imageLoading = document.getElementById('imageLoading');
    
    if (imageContainer && imageLoading) {
        imageLoading.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                color: #dc3545;
            ">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem;"></i>
                <span>Failed to load image</span>
                <button onclick="document.getElementById('imageModal').remove()" style="
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-top: 0.5rem;
                ">Close</button>
            </div>
        `;
    }
}

// Toggle category visibility
function toggleCategory(categoryId) {
    const categoryDiv = document.getElementById(categoryId);
    const icon = document.getElementById(`icon-${categoryId}`);
    
    if (categoryDiv.style.maxHeight === '0px' || !categoryDiv.style.maxHeight) {
        // Expand category
        categoryDiv.style.maxHeight = categoryDiv.scrollHeight + 'px';
        icon.style.transform = 'rotate(0deg)';
        categoryDiv.style.opacity = '1';
    } else {
        // Collapse category
        categoryDiv.style.maxHeight = '0px';
        icon.style.transform = 'rotate(-90deg)';
        categoryDiv.style.opacity = '0.7';
    }
}

// Add event listeners to the list buttons
function addListEventListeners() {
    const listDiv = document.getElementById('adminLinksList');
    if (!listDiv) return;

    // Edit button logic
    listDiv.querySelectorAll('button[data-edit]').forEach(btn => {
        btn.onclick = function () {
            const idx = parseInt(this.getAttribute('data-edit'));
            const l = links[idx];

            // Fill form with item data
            document.getElementById('productName').value = l.name || '';
            document.getElementById('affiliateLink').value = l.url || '';
            document.getElementById('productImage').value = l.image || '';
            document.getElementById('productCategory').value = l.category || '';
            document.getElementById('productDescription').value = l.description || '';
            document.getElementById('productPrice').value = l.metadata && l.metadata.price !== undefined ? l.metadata.price : '';
            document.getElementById('productAgent').value = l.metadata && l.metadata.agent ? l.metadata.agent : '';
            document.getElementById('productAuthor').value = l.metadata && l.metadata.author ? l.metadata.author : '';
            document.getElementById('productStatus').value = l.metadata && l.metadata.status ? l.metadata.status : '';
            document.getElementById('productTags').value = l.metadata && l.metadata.tags ? l.metadata.tags.join(',') : '';
            document.getElementById('productFeatured').checked = !!l.featured;
            document.getElementById('productDate').value = l.date || '';
            document.getElementById('productCta').value = l.metadata && l.metadata.cta ? l.metadata.cta : '';
            document.getElementById('productCtaUrl').value = l.metadata && l.metadata.cta_url ? l.metadata.cta_url : '';

            // Update button and form state
            currentEditingIndex = idx;
            document.getElementById('addOrUpdateLinkBtn').textContent = 'Update Item';
            document.getElementById('addOrUpdateLinkBtn').className = 'btn btn-warning w-100 fw-semibold';

            // Update field visibility based on current category
            setTimeout(() => {
                const currentCategory = document.getElementById('productCategory').value;
                updateFormFieldsByCategory(currentCategory);
            }, 50);

            showNotification(`Editing: ${l.name}`, 'info');
        };
    });

    // Delete button logic
    listDiv.querySelectorAll('button[data-delete]').forEach(btn => {
        btn.onclick = function () {
            const idx = parseInt(this.getAttribute('data-delete'));
            const l = links[idx];

            if (confirm(`Are you sure you want to delete "${l.name}"?`)) {
                links.splice(idx, 1);
                hasUnsavedChanges = true;
                renderAdminLinksList();
                showNotification(`Deleted: ${l.name}`, 'success');

                // If we were editing this item, reset the form
                if (currentEditingIndex === idx) {
                    resetForm();
                } else if (currentEditingIndex > idx) {
                    // Adjust editing index if we deleted an item before the current one
                    currentEditingIndex--;
                }
            }
        };
    });
}

async function showAdminModal() {
    // Prompt for password before showing modal
    let pass = prompt('Enter admin password:');
    if (!pass) return;

    // Hash password using SubtleCrypto
    let encoder = new TextEncoder();
    let data = encoder.encode(pass);
    let hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    let hashArray = Array.from(new Uint8Array(hashBuffer));
    let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Allow override of hash in localStorage
    let storedHash = localStorage.getItem('ADMIN_PASSWORD_HASH') || ADMIN_PASSWORD_HASH;
    if (hashHex !== storedHash) {
        alert('Incorrect password');
        return;
    }

    // If modal already exists, just show it
    let modal = document.getElementById('adminModal');
    if (modal) {
        modal.style.display = 'flex';
        // Set current date as default when showing existing modal
        setCurrentDateAsDefault();
        return;
    }

    // Load existing links
    await loadLinksFromJsonl();

    // Create modal overlay
    modal = document.createElement('div');
    modal.id = 'adminModal';
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = 9999;

    modal.innerHTML = `
      <div style="background:#fff; color:#222; border-radius:14px; min-width:1000px; max-width:1400px; width:95vw; height:90vh; box-shadow:0 8px 32px rgba(0,0,0,0.18); position:relative; display:flex; flex-direction:column; overflow:hidden;">
        
        <!-- TITLE ZONE - Fixed Header -->
        <div style="flex-shrink:0; padding:1.5rem 2.2rem 1rem 2.2rem; border-bottom:1px solid #eee; background:#fff; position:relative;">
          <button id="closeAdminModal" style="position:absolute;top:1rem;right:1.5rem;font-size:2.2rem;background:none;border:none;color:#888;cursor:pointer;">&times;</button>
          
          <div style="text-align:center;">
            <h2 style="color:#3498db; margin-bottom:0.5rem;">Content Management Panel</h2>
            <div style="display:flex; justify-content:center; gap:2rem; font-size:0.9rem; color:#666;">
              <span id="totalItems">Total: ${links.length} items</span>
              <span id="featuredItems">Featured: ${links.filter(l => l.featured).length} items</span>
              <span id="unsavedIndicator" style="color:#ffc107; display:none;">⚠️ Unsaved changes</span>
            </div>
            <div style="font-size:0.8rem; color:#888; margin-top:0.5rem;">
              Read from: <span id="dataSourcePath">assets/data/db.jsonl</span> | Export to: db.jsonl
            </div>
          </div>
          
          <!-- Tabs -->
          <div style="width:100%; display:flex; margin-top:1rem;">
            <button id="tabManageLinks" class="admin-tab active" style="flex:1; padding:0.7rem 0; background:none; border:none; font-weight:600; font-size:1.1rem; cursor:pointer; border-bottom:2px solid #3498db; color:#3498db;">Manage Items</button>
            <button id="tabChangePass" class="admin-tab" style="flex:1; padding:0.7rem 0; background:none; border:none; font-weight:600; font-size:1.1rem; cursor:pointer; color:#888;">Change Password</button>
          </div>
        </div>
        
        <!-- CONTENT ZONE - Scrollable Area -->
        <div style="flex:1; overflow-y:auto; padding:1.5rem 2.2rem;">
          <!-- Manage Items Tab Content -->
          <div id="adminTabContent" style="width:100%; display:flex; gap:2rem; height:100%; min-height:400px;">
            <!-- Sidebar: Items List -->
            <div id="adminLinksList" style="width:350px; min-width:280px; max-width:400px; overflow-y:auto; border-right:1px solid #eee; padding-right:1.2rem; height:100%; min-height:500px;"></div>
            
            <!-- Main: Form -->
            <form id="adminLinkForm" autocomplete="off" class="container-fluid" style="flex:1; height:100%; overflow-y:auto;">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Title *</label>
                  <input type="text" id="productName" class="form-control" placeholder="Item Title" required>
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Category *</label>
                  <select id="productCategory" class="form-select" required onchange="updateFormFieldsByCategory(this.value)">
                    <option value="">Select Category</option>
                    <option value="education">Education</option>
                    <option value="properties">Properties</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <div class="form-check d-flex align-items-center pt-5" style="height:38px;">
                    <input type="checkbox" id="productFeatured" class="form-check-input me-2" style="margin-top:0;">
                    <label class="form-check-label fw-semibold mb-0" for="productFeatured">Featured</label>
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Destination URL *</label>
                  <input type="url" id="affiliateLink" class="form-control" placeholder="Destination URL" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Image URL</label>
                  <input type="url" id="productImage" class="form-control" placeholder="Image URL (optional)">
                </div>
              </div>
              <div class="row mb-3" id="rowPriceAgentStatus">
                <div class="col-md-4" id="colPrice">
                  <label class="form-label fw-semibold">Price</label>
                  <input type="number" id="productPrice" class="form-control" placeholder="Price (optional)">
                </div>
                <div class="col-md-4" id="colAgent">
                  <label class="form-label fw-semibold">Agent</label>
                  <input type="text" id="productAgent" class="form-control" placeholder="Agent (Properties only)">
                </div>
                <div class="col-md-4" id="colStatus">
                  <label class="form-label fw-semibold">Status</label>
                  <input type="text" id="productStatus" class="form-control" placeholder="Status (optional)">
                </div>
              </div>
              <div class="row mb-3 d-none" id="rowAuthor">
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Author</label>
                  <input type="text" id="productAuthor" class="form-control" placeholder="Author (Education only)">
                </div>
              </div>
            <div class="row mb-3">
                <div class="col-md-8">
                    <label class="form-label fw-semibold">Tags (comma separated)</label>
                    <input type="text" id="productTags" class="form-control" placeholder="e.g. luxury, beach, city">
                </div>
                <div class="col-md-4" id="colDate">
                    <label class="form-label fw-semibold">Date</label>
                    <input type="date" id="productDate" class="form-control">
                </div>
            </div>
            <div class="row mb-3" id="rowCta">
                <div class="col-md-4">
                    <label class="form-label fw-semibold">CTA Text</label>
                    <input type="text" id="productCta" class="form-control" placeholder="e.g. View Property, Start Learning">
                </div>
                <div class="col-md-8">
                    <label class="form-label fw-semibold">CTA URL</label>
                    <input type="url" id="productCtaUrl" class="form-control" placeholder="CTA URL (optional)">
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-12 text-help">
                    <h6 class="text-muted mb-2">
                        <i class="fas fa-bullhorn me-1"></i>
                        <span class="text-secondary">Call-to-Action (CTA): Text and link that invites the user to perform a specific action.</span>
                    </h6>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-12">
                  <label class="form-label fw-semibold">Description</label>
                  <textarea id="productDescription" class="form-control" placeholder="Brief description (optional)" rows="3"></textarea>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-6">
                  <button type="submit" id="addOrUpdateLinkBtn" class="btn btn-primary w-100 fw-semibold" style="font-size:1.08rem;">Add New Item</button>
                </div>
                <div class="col-6">
                  <button type="button" id="resetFormBtn" class="btn btn-secondary w-100 fw-semibold" style="font-size:1rem;">Reset Form</button>
                </div>
              </div>
            </form>
          </div>
          
          <!-- Password change tab -->
          <div id="adminTabChangePass" class="d-none">
            <div class="container-fluid">
              <div class="row justify-content-center">
                <div class="col-md-6 col-lg-4">
                  <form id="changePassForm" autocomplete="off" class="d-flex flex-column gap-3">
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Current Password</label>
                      <input type="password" id="oldPassInput" class="form-control" placeholder="Enter current password" required autocomplete="current-password">
                    </div>
                    <div class="mb-3">
                      <label class="form-label fw-semibold">New Password</label>
                      <input type="password" id="newPassInput" class="form-control" placeholder="Enter new password" required autocomplete="new-password">
                    </div>
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Confirm New Password</label>
                      <input type="password" id="newPassInput2" class="form-control" placeholder="Repeat new password" required autocomplete="new-password">
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- FOOTER ZONE - Fixed Footer -->
        <div style="flex-shrink:0; padding:1rem 2.2rem 1.5rem 2.2rem; border-top:1px solid #eee; background:#fff;">
          <div style="display:flex; justify-content:center; align-items:center;">
            <!-- Export button for Manage Items tab -->
            <button type="button" id="exportLinksBtn" style="padding:0.7rem 1.5rem;background:#28a745;color:#fff;border:none;border-radius:6px;font-weight:600;font-size:1rem;transition:background 0.2s;">
              <i class="fas fa-download"></i> Export Updated db.jsonl
            </button>
            
            <!-- Change Password button for Change Password tab -->
            <button type="submit" form="changePassForm" id="changePassBtn" style="padding:0.7rem 1.5rem;background:#28a745;color:#fff;border:none;border-radius:6px;font-weight:600;font-size:1rem;transition:background 0.2s;display:none;">
              <i class="fas fa-key"></i> Change Password
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    addModalEventListeners();

    // Initialize the interface
    renderAdminLinksList();
    updateStats();
    
    // Set current date as default when modal opens
    setCurrentDateAsDefault();
    
    // Trigger category state after a short delay to ensure DOM is ready
    setTimeout(() => {
        console.log('Initializing category state');
        const currentCategory = document.getElementById('productCategory').value;
        updateFormFieldsByCategory(currentCategory);
        
        // Set date AFTER category processing to ensure it's not overwritten
        setTimeout(() => {
            console.log('Setting date after category processing');
            setCurrentDateAsDefault();
        }, 50);
    }, 100);

    // Update the data source path display
    const dataSourcePath = document.getElementById('dataSourcePath');
    if (dataSourcePath) {
        const baseUrl = getBaseUrl();
        dataSourcePath.textContent = `${baseUrl}/assets/data/db.jsonl`;
    }
}

// Add all event listeners for the modal
function addModalEventListeners() {
    // Category change listener - direct binding
    const categorySelect = document.getElementById('productCategory');
    if (categorySelect) {
        // Remove any existing onchange attribute and add our own
        categorySelect.removeAttribute('onchange');
        categorySelect.addEventListener('change', function(e) {
            console.log('=== CATEGORY CHANGE EVENT ===');
            console.log('Category select changed to:', e.target.value);
            console.log('Event type:', e.type);
            console.log('Target:', e.target);
            updateFormFieldsByCategory(e.target.value);
        });
        console.log('Category select event listener added');
    }

    // Backup event delegation for category changes
    document.addEventListener('change', function(e) {
        if (e.target && e.target.id === 'productCategory') {
            console.log('Category changed via delegation to:', e.target.value);
            updateFormFieldsByCategory(e.target.value);
        }
    });

    // Trigger initial state after modal is fully loaded
    setTimeout(() => {
        console.log('Triggering initial category state');
        const currentCategory = document.getElementById('productCategory').value;
        updateFormFieldsByCategory(currentCategory);
    }, 200);

    // Tab switching logic
    const tabManage = document.getElementById('tabManageLinks');
    const tabChange = document.getElementById('tabChangePass');
    const tabContent = document.getElementById('adminTabContent');
    const tabChangeDiv = document.getElementById('adminTabChangePass');

    tabManage.onclick = function () {
        tabManage.classList.add('active');
        tabChange.classList.remove('active');
        tabContent.style.display = 'flex';
        tabChangeDiv.classList.add('d-none');
        tabManage.style.color = '#3498db';
        tabManage.style.borderBottom = '2px solid #3498db';
        tabChange.style.color = '#888';
        tabChange.style.borderBottom = 'none';
        
        // Show export button, hide change password button
        document.getElementById('exportLinksBtn').style.display = 'inline-block';
        document.getElementById('changePassBtn').style.display = 'none';
        
        // Re-trigger category state when switching back to manage tab
        setTimeout(() => {
            const currentCategory = document.getElementById('productCategory').value;
            updateFormFieldsByCategory(currentCategory);
            // Ensure date is set when switching back to manage tab
            setCurrentDateAsDefault();
        }, 50);
    };

    tabChange.onclick = function () {
        tabChange.classList.add('active');
        tabManage.classList.remove('active');
        tabContent.style.display = 'none';
        tabChangeDiv.classList.remove('d-none');
        tabChange.style.color = '#3498db';
        tabChange.style.borderBottom = '2px solid #3498db';
        tabManage.style.color = '#888';
        tabManage.style.borderBottom = 'none';
        
        // Hide export button, show change password button
        document.getElementById('exportLinksBtn').style.display = 'none';
        document.getElementById('changePassBtn').style.display = 'inline-block';
    };

    // Close modal logic
    document.getElementById('closeAdminModal').onclick = function () {
        if (hasUnsavedChanges) {
            if (confirm('You have unsaved changes. Are you sure you want to close?')) {
                document.getElementById('adminModal').style.display = 'none';
            }
        } else {
            document.getElementById('adminModal').style.display = 'none';
        }
    };

    // Export button logic
    document.getElementById('exportLinksBtn').onclick = function () {
        exportLinksAsJsonl();
    };



    // Reset form button
    document.getElementById('resetFormBtn').onclick = function () {
        resetForm();
    };

    // Form submit logic (Add/Update Item)
    document.getElementById('adminLinkForm').onsubmit = function (e) {
        e.preventDefault();

        const name = document.getElementById('productName').value.trim();
        const description = document.getElementById('productDescription').value.trim();
        const image = document.getElementById('productImage').value.trim();
        const url = document.getElementById('affiliateLink').value.trim();
        const category = document.getElementById('productCategory').value;
        const price = document.getElementById('productPrice').value.trim();
        const agent = document.getElementById('productAgent').value.trim();
        const author = document.getElementById('productAuthor') ? document.getElementById('productAuthor').value.trim() : '';
        const status = document.getElementById('productStatus').value.trim();
        const tags = document.getElementById('productTags').value.split(',').map(t => t.trim()).filter(Boolean);
        const featured = document.getElementById('productFeatured').checked;
        const date = document.getElementById('productDate').value;
        const cta = document.getElementById('productCta').value.trim();
        const cta_url = document.getElementById('productCtaUrl').value.trim();

        if (!name || !url || !category) {
            showNotification('Please fill in all required fields (Title, URL, Category)', 'error');
            return;
        }

        // Compose metadata object
        const metadata = {};
        if (price) metadata.price = isNaN(Number(price)) ? price : Number(price);
        if (agent) metadata.agent = agent;
        if (status) metadata.status = status;
        if (tags.length) metadata.tags = tags;
        if (cta) metadata.cta = cta;
        if (cta_url) metadata.cta_url = cta_url;
        if (date) metadata.date = date;
        if (category === 'education' && author) metadata.author = author;
        if (category === 'properties' && agent) metadata.agent = agent;

        // Compose link object
        const linkObj = {
            name,
            description,
            image,
            url,
            category,
            featured,
            date: date || undefined,
            metadata
        };

        if (currentEditingIndex !== null) {
            // Update existing link
            links[currentEditingIndex] = linkObj;
            showNotification(`Updated: ${name}`, 'success');
        } else {
            // Add new link
            links.push(linkObj);
            showNotification(`Added: ${name}`, 'success');
        }

        hasUnsavedChanges = true;
        updateStats();
        renderAdminLinksList();
        resetForm();
    };

    // Form reset logic
    document.getElementById('adminLinkForm').onreset = function () {
        resetForm();
    };

    // Change password form logic
    document.getElementById('changePassForm').onsubmit = async function (e) {
        e.preventDefault();
        const oldPass = document.getElementById('oldPassInput').value;
        const newPass = document.getElementById('newPassInput').value;
        const newPass2 = document.getElementById('newPassInput2').value;

        if (!oldPass || !newPass || !newPass2) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (newPass !== newPass2) {
            showNotification('New passwords do not match', 'error');
            return;
        }

        // Hash old password
        let encoder = new TextEncoder();
        let data = encoder.encode(oldPass);
        let hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        let hashArray = Array.from(new Uint8Array(hashBuffer));
        let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        let storedHash = localStorage.getItem('ADMIN_PASSWORD_HASH') || ADMIN_PASSWORD_HASH;

        if (hashHex !== storedHash) {
            showNotification('Current password is incorrect', 'error');
            return;
        }

        // Hash new password and update
        let newData = encoder.encode(newPass);
        let newHashBuffer = await window.crypto.subtle.digest('SHA-256', newData);
        let newHashArray = Array.from(new Uint8Array(newHashBuffer));
        let newHashHex = newHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        localStorage.setItem('ADMIN_PASSWORD_HASH', newHashHex);

        showNotification('Password changed successfully!', 'success');
        document.getElementById('adminModal').style.display = 'none';
    };
}

// Update statistics display
function updateStats() {
    const totalItems = document.getElementById('totalItems');
    const featuredItems = document.getElementById('featuredItems');
    const unsavedIndicator = document.getElementById('unsavedIndicator');

    if (totalItems) totalItems.textContent = `Total: ${links.length} items`;
    if (featuredItems) featuredItems.textContent = `Featured: ${links.filter(l => l.featured).length} items`;
    if (unsavedIndicator) {
        unsavedIndicator.style.display = hasUnsavedChanges ? 'inline' : 'none';
    }
}

// Render links for the main page
function renderLinks() {
    const linksContainer = document.getElementById('affiliateLinks');
    if (!linksContainer) return;

    linksContainer.innerHTML = '';
    if (!links.length) {
        linksContainer.innerHTML = '<div class="empty-state"><i class="fas fa-info-circle"></i><h4>No links yet</h4></div>';
        return;
    }

    links.forEach(function (link) {
        const card = document.createElement('div');
        card.className = 'link-card';
        card.innerHTML = `
            <div class="link-content">
                <div class="link-icon">${link.image ? `<img src="${link.image}" alt="${link.name}">` : `<i class="fas fa-link"></i>`}</div>
                <div class="link-text">
                    <div class="link-title">${link.name}</div>
                    <a href="${link.url}" target="_blank">View</a>
                </div>
            </div>
        `;
        linksContainer.appendChild(card);
    });
}

// Helper function to set current date as default
function setCurrentDateAsDefault() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('productDate');
    if (dateInput) {
        // Store the current value for comparison
        const previousValue = dateInput.value;
        
        // Set the new value
        dateInput.value = today;
        
        // Force the input to update visually
        dateInput.setAttribute('value', today);
        
        // Trigger change event to ensure UI updates
        const event = new Event('change', { bubbles: true });
        dateInput.dispatchEvent(event);
        
        console.log('Set default date to:', today, 'Previous value was:', previousValue);
        console.log('Date input current value:', dateInput.value);
        console.log('Date input attribute value:', dateInput.getAttribute('value'));
        
        return today;
    } else {
        console.warn('Date input not found');
        return null;
    }
}

// Test function for debugging category field updates
window.testCategoryUpdate = function(category) {
    console.log('=== TESTING CATEGORY UPDATE ===');
    const select = document.getElementById('productCategory');
    if (select) {
        select.value = category;
        console.log('Manually set category to:', category);
        updateFormFieldsByCategory(category);
    } else {
        console.log('Category select not found');
    }
};

// Test function for debugging date field
window.testDateField = function() {
    console.log('=== TESTING DATE FIELD ===');
    const dateInput = document.getElementById('productDate');
    if (dateInput) {
        console.log('Date input found');
        console.log('Current value:', dateInput.value);
        console.log('Current attribute value:', dateInput.getAttribute('value'));
        console.log('Is disabled:', dateInput.disabled);
        console.log('Opacity:', dateInput.style.opacity);
        console.log('Background:', dateInput.style.backgroundColor);
        
        // Try to set the date
        setCurrentDateAsDefault();
        
        console.log('After setting date:');
        console.log('New value:', dateInput.value);
        console.log('New attribute value:', dateInput.getAttribute('value'));
    } else {
        console.log('Date input not found');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function () {
    await loadLinksFromJsonl();
    renderLinks();
});

// Keyboard shortcut: Ctrl+Shift+L
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
        e.preventDefault();
        showAdminModal();
    }
});
