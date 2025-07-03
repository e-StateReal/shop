---
layout: form-page
title: Get Started
description: Begin your real estate journey with e-State Real Store
permalink: /pages/get-started.html
---

<div class="form-wrapper">
    <h1 class="form-title">🚀 Get Started</h1>
    <p class="form-subtitle">Begin your real estate journey with our expert guidance</p>
    
    <!-- Item Information Display -->
    <div id="item-info"></div>
    
    <form id="getStartedForm" action="https://formspree.io/f/xpzgwqjq" method="POST">
        <input type="hidden" name="_subject" value="Get Started - New Real Estate Inquiry">
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
                <label for="phone" class="form-label">Phone Number *</label>
                <input type="tel" class="form-control" id="phone" name="phone" required>
            </div>
        </div>
        
        <div class="mb-3">
            <label for="experience" class="form-label">Real Estate Experience *</label>
            <select class="form-select" id="experience" name="experience" required>
                <option value="">Select your experience level</option>
                <option value="beginner">Beginner - New to real estate</option>
                <option value="intermediate">Intermediate - Some experience</option>
                <option value="advanced">Advanced - Experienced investor</option>
                <option value="professional">Professional - Licensed agent/broker</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="goals" class="form-label">Investment Goals *</label>
            <select class="form-select" id="goals" name="goals" required>
                <option value="">Select your primary goal</option>
                <option value="buy-home">Buy a home to live in</option>
                <option value="rental-income">Generate rental income</option>
                <option value="flip-properties">Flip properties for profit</option>
                <option value="commercial">Commercial real estate</option>
                <option value="portfolio">Build a real estate portfolio</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="budget" class="form-label">Investment Budget *</label>
            <select class="form-select" id="budget" name="budget" required>
                <option value="">Select your budget range</option>
                <option value="under-100k">Under $100,000</option>
                <option value="100k-250k">$100,000 - $250,000</option>
                <option value="250k-500k">$250,000 - $500,000</option>
                <option value="500k-1m">$500,000 - $1,000,000</option>
                <option value="over-1m">Over $1,000,000</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="timeline" class="form-label">Investment Timeline *</label>
            <select class="form-select" id="timeline" name="timeline" required>
                <option value="">Select your timeline</option>
                <option value="immediate">Immediate (within 3 months)</option>
                <option value="short-term">Short-term (3-12 months)</option>
                <option value="medium-term">Medium-term (1-3 years)</option>
                <option value="long-term">Long-term (3+ years)</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="message" class="form-label">Additional Information</label>
            <textarea class="form-control" id="message" name="message" rows="4" placeholder="Tell us about your specific needs, preferences, or any questions you have..."></textarea>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="newsletter" name="newsletter">
            <label class="form-check-label" for="newsletter">
                Subscribe to our newsletter for market updates and investment opportunities
            </label>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="consent" name="consent" required>
            <label class="form-check-label" for="consent">
                I agree to receive communications from e-State Real Store and understand my data will be handled according to our privacy policy *
            </label>
        </div>
        
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <a href="/" class="btn btn-outline-secondary me-md-2">Cancel</a>
            <button type="submit" class="btn btn-primary">Get Started</button>
        </div>
    </form>
</div> 