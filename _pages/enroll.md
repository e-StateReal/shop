---
layout: form-page
title: Enroll Now
description: Enroll in our Premium Real Estate Course
permalink: /pages/enroll.html
---

<div class="form-wrapper">
    <h1 class="form-title">📚 Enroll Now</h1>
    <p class="form-subtitle">Join our premium real estate education programs</p>
    
    <!-- Item Information Display -->
    <div id="item-info"></div>
    
    <!-- Course Information -->
    <div class="alert alert-info mb-4">
        <h5><i class="fas fa-info-circle me-2"></i>Course Details</h5>
        <ul class="mb-0">
            <li><strong>Duration:</strong> 12 weeks intensive learning</li>
            <li><strong>Investment:</strong> $997 (Save $500 - Limited time offer)</li>
            <li><strong>Access:</strong> Lifetime access to course materials</li>
            <li><strong>Format:</strong> Online with live Q&A sessions</li>
        </ul>
    </div>
    
    <form id="enrollForm" action="https://formspree.io/f/xpzgwqjq" method="POST">
        <input type="hidden" name="_subject" value="Course Enrollment - Premium Real Estate Course">
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
            <label for="occupation" class="form-label">Current Occupation *</label>
            <input type="text" class="form-control" id="occupation" name="occupation" required>
        </div>
        
        <div class="mb-3">
            <label for="experience" class="form-label">Real Estate Experience *</label>
            <select class="form-select" id="experience" name="experience" required>
                <option value="">Select your experience level</option>
                <option value="none">No experience</option>
                <option value="beginner">Beginner (0-2 years)</option>
                <option value="intermediate">Intermediate (2-5 years)</option>
                <option value="advanced">Advanced (5+ years)</option>
                <option value="professional">Professional (Licensed)</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="motivation" class="form-label">Primary Motivation for Taking This Course *</label>
            <select class="form-select" id="motivation" name="motivation" required>
                <option value="">Select your motivation</option>
                <option value="career-change">Career change to real estate</option>
                <option value="investment-knowledge">Improve investment knowledge</option>
                <option value="professional-development">Professional development</option>
                <option value="personal-investment">Personal investment goals</option>
                <option value="business-expansion">Expand existing business</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="timeCommitment" class="form-label">Weekly Time Commitment *</label>
            <select class="form-select" id="timeCommitment" name="timeCommitment" required>
                <option value="">Select your availability</option>
                <option value="5-10">5-10 hours per week</option>
                <option value="10-15">10-15 hours per week</option>
                <option value="15-20">15-20 hours per week</option>
                <option value="20+">20+ hours per week</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label for="startDate" class="form-label">Preferred Start Date *</label>
            <input type="date" class="form-control" id="startDate" name="startDate" required>
        </div>
        
        <div class="mb-3">
            <label for="goals" class="form-label">What do you hope to achieve with this course? *</label>
            <textarea class="form-control" id="goals" name="goals" rows="4" placeholder="Describe your specific goals and what you want to learn..." required></textarea>
        </div>
        
        <div class="mb-3">
            <label for="questions" class="form-label">Questions or Special Requirements</label>
            <textarea class="form-control" id="questions" name="questions" rows="3" placeholder="Any specific questions or special accommodations needed..."></textarea>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="liveSessions" name="liveSessions" checked>
            <label class="form-check-label" for="liveSessions">
                I want to participate in live Q&A sessions
            </label>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="certificate" name="certificate" checked>
            <label class="form-check-label" for="certificate">
                I want to receive a completion certificate
            </label>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="newsletter" name="newsletter">
            <label class="form-check-label" for="newsletter">
                Subscribe to our newsletter for additional resources and updates
            </label>
        </div>
        
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="consent" name="consent" required>
            <label class="form-check-label" for="consent">
                I agree to the course terms and conditions and understand the payment process *
            </label>
        </div>
        
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <a href="/" class="btn btn-outline-secondary me-md-2">Cancel</a>
            <button type="submit" class="btn btn-success">Enroll Now - $997</button>
        </div>
    </form>
</div> 