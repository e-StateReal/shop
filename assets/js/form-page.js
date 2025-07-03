// Form page functionality for e-State Real Store

document.addEventListener('DOMContentLoaded', function() {
    // Get item identifier from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('item');
    
    if (itemId) {
        displayItemInfo(itemId);
        updateFormFields(itemId);
    }
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize progress steps
    initializeProgressSteps();
    
    // Handle form submissions
    handleFormSubmissions();
    
    // Set active nav link
    setActiveNavLink();
});

function displayItemInfo(itemId) {
    const itemInfoContainer = document.getElementById('item-info');
    
    if (itemInfoContainer) {
        // Look up item information from the items data
        const itemInfo = getItemInfo(itemId);
        
        if (itemInfo) {
            // Create a rich display with item information
            let priceDisplay = '';
            if (itemInfo.price) {
                priceDisplay = `<p class="mb-2"><strong>Price:</strong> ${itemInfo.price}`;
                if (itemInfo.original_price && itemInfo.original_price !== itemInfo.price) {
                    priceDisplay += ` <span class="text-muted"><del>${itemInfo.original_price}</del></span>`;
                }
                priceDisplay += '</p>';
            }
            
            let additionalInfo = '';
            if (itemInfo.duration) {
                additionalInfo += `<p class="mb-1"><strong>Duration:</strong> ${itemInfo.duration}</p>`;
            }
            if (itemInfo.location) {
                additionalInfo += `<p class="mb-1"><strong>Location:</strong> ${itemInfo.location}</p>`;
            }
            if (itemInfo.size) {
                additionalInfo += `<p class="mb-1"><strong>Size:</strong> ${itemInfo.size}</p>`;
            }
            
            itemInfoContainer.innerHTML = `
                <div class="alert alert-info">
                    <h5><i class="fas fa-info-circle me-2"></i>You're interested in: <strong>${itemInfo.title}</strong></h5>
                    <p class="mb-2">${itemInfo.description || 'We\'ll provide you with specific information about this item.'}</p>
                    ${priceDisplay}
                    ${additionalInfo}
                </div>
            `;
        } else {
            // Fallback if item info not found
            itemInfoContainer.innerHTML = `
                <div class="alert alert-warning">
                    <h5><i class="fas fa-exclamation-triangle me-2"></i>Item Information</h5>
                    <p class="mb-0">We'll provide you with specific information about your selected item once you submit the form.</p>
                </div>
            `;
        }
    }
}

// Proxy to global getItemInfo from items-data.js, but avoid recursion if already global
function getItemInfo(itemId) {
    // Use the getItemInfo from items-data.js if it exists and is not THIS function
    if (window.getItemInfo && window.getItemInfo !== getItemInfo) {
        return window.getItemInfo(itemId);
    }
    return null;
}

function updateFormFields(itemId) {
    // Add hidden field to track which item the user is interested in
    const form = document.querySelector('form');
    if (form) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = 'item_interest';
        hiddenField.value = itemId;
        form.appendChild(hiddenField);
    }
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(form)) {
                submitForm(form);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(field)} is required`);
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Password validation
    if (field.type === 'password' && value) {
        if (value.length < 8) {
            showFieldError(field, 'Password must be at least 8 characters long');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback d-block';
    errorDiv.textContent = message;
    
    field.classList.add('is-invalid');
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : field.name || field.id;
}

// Progress steps
function initializeProgressSteps() {
    const progressSteps = document.querySelectorAll('.progress-steps');
    
    progressSteps.forEach(container => {
        const steps = container.querySelectorAll('.step');
        let currentStep = 0;
        
        // Show first step
        if (steps.length > 0) {
            steps[0].classList.add('active');
        }
        
        // Handle next/previous buttons
        const nextButtons = container.parentNode.querySelectorAll('.btn-next');
        const prevButtons = container.parentNode.querySelectorAll('.btn-prev');
        
        nextButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (currentStep < steps.length - 1) {
                    steps[currentStep].classList.remove('active');
                    steps[currentStep].classList.add('completed');
                    currentStep++;
                    steps[currentStep].classList.add('active');
                }
            });
        });
        
        prevButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (currentStep > 0) {
                    steps[currentStep].classList.remove('active');
                    currentStep--;
                    steps[currentStep].classList.remove('completed');
                    steps[currentStep].classList.add('active');
                }
            });
        });
    });
}

// Form submission with Formspree
function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');
    submitBtn.textContent = 'Processing...';
    
    // Get form data
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Add form metadata
    formObject['_subject'] = getFormSubject(form.id);
    formObject['_format'] = 'html';
    formObject['_captcha'] = 'false';
    
    // Submit to Formspree
    fetch('https://formspree.io/f/xpzgwqjq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject)
    })
    .then(response => {
        if (response.ok) {
            showAlert('Form submitted successfully! We will contact you soon.', 'success');
            form.reset();
            
            // Redirect after success
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('There was an error submitting the form. Please try again.', 'warning');
    })
    .finally(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        submitBtn.textContent = originalText;
    });
}

function getFormSubject(formId) {
    const subjects = {
        'getStartedForm': 'Get Started - New Real Estate Inquiry',
        'enrollForm': 'Course Enrollment - Premium Real Estate Course',
        'registerForm': 'Webinar Registration - Investment Strategies',
        'contactForm': 'Contact Agent - Property Inquiry',
        'scheduleForm': 'Schedule Visit - Property Viewing'
    };
    return subjects[formId] || 'Form Submission - e-State Real Store';
}

// Alert system
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.form-container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Handle form submissions
function handleFormSubmissions() {
    // Get Started form
    const getStartedForm = document.getElementById('getStartedForm');
    if (getStartedForm) {
        getStartedForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this);
        });
    }
    
    // Enroll form
    const enrollForm = document.getElementById('enrollForm');
    if (enrollForm) {
        enrollForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this);
        });
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this);
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this);
        });
    }
    
    // Schedule form
    const scheduleForm = document.getElementById('scheduleForm');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this);
        });
    }
}

// Set active navigation link
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Date picker enhancement
function initializeDatePickers() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        input.setAttribute('min', today);
        
        // Add custom styling
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    });
}

// Time picker enhancement
function initializeTimePickers() {
    const timeInputs = document.querySelectorAll('input[type="time"]');
    
    timeInputs.forEach(input => {
        // Set default time to current time + 1 hour
        const now = new Date();
        now.setHours(now.getHours() + 1);
        const defaultTime = now.toTimeString().slice(0, 5);
        input.setAttribute('value', defaultTime);
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeDatePickers();
    initializeTimePickers();
}); 