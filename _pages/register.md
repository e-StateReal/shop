---
layout: form-page
title: Register
description: Register for our Investment Strategies Webinar
permalink: /pages/register.html
---

<div class="form-wrapper">
    <h1 class="form-title">📝 Register</h1>
    <p class="form-subtitle">Register for our exclusive real estate events and webinars</p>
    
    <!-- Item Information Display -->
    <div id="item-info"></div>
    
    <!-- Webinar Information -->
    <div class="alert alert-info mb-4">
        <h5><i class="fas fa-calendar-alt me-2"></i>Webinar Details</h5>
        <ul class="mb-0">
            <li><strong>Date:</strong> December 15, 2024</li>
            <li><strong>Time:</strong> 7:00 PM EST</li>
            <li><strong>Duration:</strong> 90 minutes</li>
            <li><strong>Format:</strong> Live online webinar</li>
            <li><strong>Cost:</strong> FREE</li>
        </ul>
    </div>
    
    <form id="registerForm" action="https://formspree.io/f/xpzgwqjq" method="POST">
        <input type="hidden" name="_subject" value="Webinar Registration - Investment Strategies">
        <input type="hidden" name="_format" value="html">
        <input type="hidden" name="_captcha" value="false">
        
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="firstName" class="form-label">First Name *</label>
                <input type="text" class="form-control" id="firstName" name="firstName" required>
            </div>
            <div class="col-md-6 mb-3">
                <label for="lastName" class="form-label">Last Name *</label>
                <input type="text" class="form-control" id="lastName" name="lastName" required>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="email" class="form-label">Email Address *</label>
                <input type="email" class="form-control" id="email" name="email" required>
            </div>
            <div class="col-md-6 mb-3">
                <label for="phone" class="form-label">Phone Number</label>
                <input type="tel" class="form-control" id="phone" name="phone">
            </div>
        </div>
        
        <div class="mb-3">
            <label for="company" class="form-label">Company/Organization</label>
            <input type="text" class="form-control" id="company" name="company">
        </div>
        
        <div class="mb-3">
            <label for="role" class="form-label">Job Title/Role</label>
            <input type="text" class="form-control" id="role" name="role">
        </div>
        
        <div class="mb-3">
            <label for="experience" class="form-label">Investment Experience *</label>
            <select class="form-select" id="experience" name="experience" required>
                <option value="">Select your experience level</option>
                <option value="none">No investment experience</option>
                <option value="beginner">Beginner (0-2 years)</option>
                <option value="intermediate">Intermediate (2-5 years)</option>
                <option value="advanced">Advanced (5+ years)</option>
                <option value="professional">Professional investor</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="interests" class="form-label">Topics of Interest *</label>
            <select class="form-select" id="interests" name="interests" required>
                <option value="">Select your primary interest</option>
                <option value="market-timing">Market timing strategies</option>
                <option value="risk-management">Risk management</option>
                <option value="tax-strategies">Tax optimization strategies</option>
                <option value="technology">Technology in real estate</option>
                <option value="all">All topics</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="timezone" class="form-label">Your Timezone *</label>
            <select class="form-select" id="timezone" name="timezone" required>
                <option value="">Select your timezone</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="CST">Central Time (CST)</option>
                <option value="MST">Mountain Time (MST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="other">Other/International</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="questions" class="form-label">Questions for the Presenters</label>
            <textarea class="form-control" id="questions" name="questions" rows="3" placeholder="Any specific questions you'd like addressed during the webinar..."></textarea>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="reminder" name="reminder" checked>
            <label class="form-check-label" for="reminder">
                Send me reminder emails before the webinar
            </label>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="recording" name="recording" checked>
            <label class="form-check-label" for="recording">
                Send me the webinar recording after the event
            </label>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="resources" name="resources" checked>
            <label class="form-check-label" for="resources">
                Send me additional resources and materials
            </label>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="newsletter" name="newsletter">
            <label class="form-check-label" for="newsletter">
                Subscribe to our newsletter for future events and updates
            </label>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="consent" name="consent" required>
            <label class="form-check-label" for="consent">
                I agree to receive communications about this webinar and future events *
            </label>
        </div>
        
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <a href="/" class="btn btn-outline-secondary me-md-2">Cancel</a>
            <button type="submit" class="btn btn-primary">Register for Free</button>
        </div>
    </form>
</div> 