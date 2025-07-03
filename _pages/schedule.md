---
layout: form-page
title: Schedule Visit
description: Schedule a property viewing with our agents
permalink: /pages/schedule.html
---

<div class="form-wrapper">
    <h1 class="form-title">📅 Schedule Visit</h1>
    <p class="form-subtitle">Schedule a property viewing with our expert agents</p>
    
    <!-- Item Information Display -->
    <div id="item-info"></div>
    
    <!-- Scheduling Information -->
    <div class="alert alert-info mb-4">
        <h5><i class="fas fa-calendar-check me-2"></i>Scheduling Details</h5>
        <ul class="mb-0">
            <li><strong>Available:</strong> Monday - Saturday, 9 AM - 7 PM</li>
            <li><strong>Duration:</strong> 30-60 minutes per viewing</li>
            <li><strong>Format:</strong> In-person or virtual tours available</li>
            <li><strong>Preparation:</strong> We'll send you property details before the visit</li>
        </ul>
    </div>
    
    <form id="scheduleForm" action="https://formspree.io/f/xpzgwqjq" method="POST">
        <input type="hidden" name="_subject" value="Schedule Visit - Property Viewing">
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
            <label for="propertyInterest" class="form-label">Property to Visit *</label>
            <select class="form-select" id="propertyInterest" name="propertyInterest" required>
                <option value="">Select a property</option>
                <option value="downtown-loft">Downtown Loft Opportunity - $450,000</option>
                <option value="beachfront-villa">Luxury Beachfront Villa - $2,850,000</option>
                <option value="other">Other properties (specify in message)</option>
            </select>
        </div>
        
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="visitDate" class="form-label">Preferred Date *</label>
                <input type="date" class="form-control" id="visitDate" name="visitDate" required>
            </div>
            <div class="col-md-6 mb-3">
                <label for="visitTime" class="form-label">Preferred Time *</label>
                <input type="time" class="form-control" id="visitTime" name="visitTime" required>
            </div>
        </div>
        
        <div class="mb-3">
            <label for="visitType" class="form-label">Type of Visit *</label>
            <select class="form-select" id="visitType" name="visitType" required>
                <option value="">Select visit type</option>
                <option value="in-person">In-person viewing</option>
                <option value="virtual">Virtual tour (video call)</option>
                <option value="both">Both (in-person + virtual follow-up)</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="groupSize" class="form-label">Number of Visitors</label>
            <select class="form-select" id="groupSize" name="groupSize">
                <option value="1">1 person</option>
                <option value="2" selected>2 people</option>
                <option value="3">3 people</option>
                <option value="4">4 people</option>
                <option value="5+">5+ people</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="purpose" class="form-label">Purpose of Visit *</label>
            <select class="form-select" id="purpose" name="purpose" required>
                <option value="">Select purpose</option>
                <option value="buy">I want to buy this property</option>
                <option value="rent">I want to rent this property</option>
                <option value="invest">Investment evaluation</option>
                <option value="compare">Comparing with other properties</option>
                <option value="curious">Just curious to see it</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="timeline" class="form-label">Your Timeline</label>
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
            <label for="specialRequirements" class="form-label">Special Requirements</label>
            <textarea class="form-control" id="specialRequirements" name="specialRequirements" rows="3" placeholder="Any special requirements, accessibility needs, or specific areas you want to focus on..."></textarea>
        </div>
        
        <div class="mb-3">
            <label for="questions" class="form-label">Questions for the Agent</label>
            <textarea class="form-control" id="questions" name="questions" rows="3" placeholder="Any specific questions you'd like to ask during the visit..."></textarea>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="reminder" name="reminder" checked>
            <label class="form-check-label" for="reminder">
                Send me reminder notifications before the visit
            </label>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="followUp" name="followUp" checked>
            <label class="form-check-label" for="followUp">
                Send me follow-up information after the visit
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
                I agree to the scheduling terms and confirm my availability for the selected time *
            </label>
        </div>
        
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <a href="/" class="btn btn-outline-secondary me-md-2">Cancel</a>
            <button type="submit" class="btn btn-success">Schedule Visit</button>
        </div>
    </form>
</div> 