---
layout: form-page
title: Contact Agent
description: Contact our real estate agents for property inquiries
permalink: /pages/contact.html
---

<div class="form-wrapper">
    <h1 class="form-title">📞 Contact Agent</h1>
    <p class="form-subtitle">Get in touch with our expert real estate agents</p>
    
    <!-- Item Information Display -->
    <div id="item-info"></div>
    
    <!-- Agent Information -->
    <div class="alert alert-info mb-4">
        <h5><i class="fas fa-user-tie me-2"></i>Our Expert Agents</h5>
        <p class="mb-2">Our certified real estate professionals are here to help you with:</p>
        <ul class="mb-0">
            <li>Property viewings and tours</li>
            <li>Market analysis and pricing</li>
            <li>Negotiation and closing support</li>
            <li>Investment advice and strategies</li>
        </ul>
    </div>
    
    <form id="contactForm" action="https://formspree.io/f/xpzgwqjq" method="POST">
        <input type="hidden" name="_subject" value="Contact Agent - Property Inquiry">
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
            <label for="propertyInterest" class="form-label">Property of Interest</label>
            <select class="form-select" id="propertyInterest" name="propertyInterest">
                <option value="">Select a property (if applicable)</option>
                <option value="downtown-loft">Downtown Loft Opportunity</option>
                <option value="beachfront-villa">Luxury Beachfront Villa</option>
                <option value="other">Other properties</option>
                <option value="general">General inquiry</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="inquiryType" class="form-label">Type of Inquiry *</label>
            <select class="form-select" id="inquiryType" name="inquiryType" required>
                <option value="">Select inquiry type</option>
                <option value="buy">I want to buy</option>
                <option value="sell">I want to sell</option>
                <option value="rent">I want to rent</option>
                <option value="invest">Investment opportunity</option>
                <option value="market-analysis">Market analysis</option>
                <option value="general">General question</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="budget" class="form-label">Budget Range</label>
            <select class="form-select" id="budget" name="budget">
                <option value="">Select your budget</option>
                <option value="under-100k">Under $100,000</option>
                <option value="100k-250k">$100,000 - $250,000</option>
                <option value="250k-500k">$250,000 - $500,000</option>
                <option value="500k-1m">$500,000 - $1,000,000</option>
                <option value="over-1m">Over $1,000,000</option>
                <option value="not-specified">Not specified</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="timeline" class="form-label">Timeline</label>
            <select class="form-select" id="timeline" name="timeline">
                <option value="">Select your timeline</option>
                <option value="immediate">Immediate (within 1 month)</option>
                <option value="short-term">Short-term (1-3 months)</option>
                <option value="medium-term">Medium-term (3-6 months)</option>
                <option value="long-term">Long-term (6+ months)</option>
                <option value="exploring">Just exploring</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="preferredContact" class="form-label">Preferred Contact Method *</label>
            <select class="form-select" id="preferredContact" name="preferredContact" required>
                <option value="">Select preferred method</option>
                <option value="email">Email</option>
                <option value="phone">Phone call</option>
                <option value="text">Text message</option>
                <option value="video-call">Video call</option>
                <option value="in-person">In-person meeting</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="bestTime" class="form-label">Best Time to Contact</label>
            <select class="form-select" id="bestTime" name="bestTime">
                <option value="">Select best time</option>
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                <option value="evening">Evening (5 PM - 8 PM)</option>
                <option value="weekend">Weekend</option>
                <option value="anytime">Anytime</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="message" class="form-label">Your Message *</label>
            <textarea class="form-control" id="message" name="message" rows="5" placeholder="Please describe your inquiry, questions, or specific requirements..." required></textarea>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="urgent" name="urgent">
            <label class="form-check-label" for="urgent">
                This is an urgent inquiry (we'll prioritize your request)
            </label>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="newsletter" name="newsletter">
            <label class="form-check-label" for="newsletter">
                Subscribe to our newsletter for new listings and market updates
            </label>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="consent" name="consent" required>
            <label class="form-check-label" for="consent">
                I agree to be contacted by e-State Real Store agents regarding my inquiry *
            </label>
        </div>
        
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <a href="/" class="btn btn-outline-secondary me-md-2">Cancel</a>
            <button type="submit" class="btn btn-primary">Send Message</button>
        </div>
    </form>
</div> 