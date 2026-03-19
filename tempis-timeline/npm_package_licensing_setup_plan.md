# NPM Package Commercial Licensing Setup Plan

## Overview
This document outlines the step-by-step process to implement a dual licensing model for your npm package:
- Free for independent / non-commercial developers
- Paid subscription for commercial use

The setup uses Lemon Squeezy as the payment and licensing platform.

---

## Phase 1: Define Your Licensing Model

### 1.1 Decide License Terms
- Free usage:
  - Individuals
  - Open-source projects
  - Non-commercial usage

- Paid usage:
  - Companies
  - SaaS products
  - Internal business tools

### 1.2 Create License Tiers
Example:
- Free Tier: Non-commercial use
- Pro Tier: $10/month (commercial use)
- Team Tier: $25/month (multiple developers)

---

## Phase 2: Set Up Lemon Squeezy

### 2.1 Create Account
- Sign up at Lemon Squeezy
- Complete onboarding
- Connect bank account

### 2.2 Create Product
- Product name: Your package name
- Add description
- Upload logo

### 2.3 Configure Pricing
- Add subscription pricing (monthly/yearly)
- Optionally add one-time license option

### 2.4 Enable License Keys
- Enable license key generation
- Set activation limits (e.g. per seat)

### 2.5 Configure Webhooks
- Add webhook endpoint in your backend
- Listen for:
  - subscription_created
  - subscription_updated
  - subscription_cancelled

---

## Phase 3: Backend License Service (Optional but Recommended)

### 3.1 Create License API
Endpoints:
- POST /validate-license
- GET /license-status

### 3.2 Store License Data
Store:
- License key
- Subscription status
- Expiry date

### 3.3 Handle Webhooks
- Update license status when subscription changes

---

## Phase 4: Integrate with Your NPM Package

### 4.1 Accept License Key
- Allow users to pass a license key via:
  - Environment variable
  - Config option

### 4.2 Validate License (Optional)
- Call your API to validate key
- Cache result locally

### 4.3 Define Behavior
Free mode:
- Full functionality OR limited features
- Console message indicating free usage terms

Paid mode:
- Unlock premium features
- Remove warnings

---

## Phase 5: Legal Setup

### 5.1 Write License Agreement
Include:
- Definition of non-commercial use
- Requirement for commercial license
- Terms of subscription

### 5.2 Add to Repository
- LICENSE file
- Link in README

### 5.3 Add Notice in Package
- Console message or docs stating license terms

---

## Phase 6: Documentation & UX

### 6.1 Update README
Include:
- What is free vs paid
- How to purchase license
- How to use license key

### 6.2 Create Pricing Page
- Link to Lemon Squeezy checkout

### 6.3 Add Examples
- Show how to use with and without license

---

## Phase 7: Launch Strategy

### 7.1 Soft Launch
- Release with licensing in place
- Monitor feedback

### 7.2 Announce
- Dev communities
- Twitter / LinkedIn
- Product Hunt (optional)

### 7.3 Iterate
- Adjust pricing
- Improve onboarding
- Add premium features

---

## Phase 8: Future Enhancements

- Add team/seat-based licensing
- Add plugin marketplace
- Add enterprise plans
- Add analytics dashboard

---

## Key Principles

- Keep free tier frictionless
- Use soft enforcement over strict DRM
- Make pricing simple and fair
- Focus on companies as paying customers

---

## Summary

You will:
1. Define a dual license (free + commercial)
2. Use Lemon Squeezy for billing and license keys
3. Optionally validate licenses via a backend
4. Integrate licensing into your npm package
5. Clearly communicate terms to users

This approach maximizes adoption while creating reliable recurring revenue.

