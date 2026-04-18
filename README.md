# OmniEvent AI – Smart Crowd Assistant

## Overview

OmniEvent AI is a lightweight, AI-powered web application designed to help users navigate crowd-heavy environments such as stadiums, theatres, airports, railway stations, and public events. It provides intelligent, context-aware suggestions to reduce waiting time and improve user movement within crowded spaces.

---

## Problem Statement

Large-scale events and public environments often suffer from:

* Long queues and waiting times
* Poor crowd distribution
* Lack of real-time guidance for users

Users typically do not know:

* Which gate is less crowded
* Where to go to avoid congestion
* How long they might have to wait

---

## Solution

OmniEvent AI solves this by acting as a smart assistant that:

* Understands the user’s location and venue
* Analyzes crowd conditions
* Provides actionable recommendations in real time

---

## How the System Works

### 1. User Input

The user:

* Searches for a location
* Selects an environment (e.g., stadium, airport)
* Chooses a venue

---

### 2. Crowd Data Simulation

* The system generates dynamic crowd levels for different zones (e.g., gates, platforms, food courts)
* Data updates automatically using timed intervals
* Each zone is categorized as:

  * Low
  * Medium
  * High

---

### 3. AI Processing (Gemini API)

When a user asks a question:

* The system sends:

  * City
  * Venue
  * Environment
  * Live crowd data
* A structured prompt is sent to the Gemini model

The AI then:

* Interprets the context
* Identifies the least crowded zones
* Estimates wait times
* Suggests optimal routes or areas

---

### 4. Response Generation

The AI responds with:

* Specific location references (city + venue)
* Zone-based suggestions (e.g., Gate B, Platform 1)
* Estimated waiting times
* Practical navigation advice

---

## Key Features

* AI-powered crowd navigation assistant
* Multi-environment support (stadiums, airports, theatres, etc.)
* Location-based venue selection
* Dynamic crowd simulation
* Context-aware recommendations
* Smart fallback for unsupported locations
* Clean, modern UI with glassmorphism design
* Lightweight and fast (<100 KB frontend)

---

## Limitations (By Design for Prototype)

To ensure performance, simplicity, and hackathon constraints:

* Only a few major cities are included (Hyderabad, Mumbai, Delhi)
* Crowd data is simulated instead of real-time
* No external APIs (e.g., Google Maps) are used
* Location search is based on predefined datasets

These limitations were intentionally chosen to:

* Keep the system lightweight and fast
* Avoid dependency on external APIs and billing
* Ensure stable performance during evaluation

---

## Scalability

The architecture is designed to scale easily:

### Future Enhancements:

* Integration with Google Maps / Places API for real-time location detection
* Live crowd data using:

  * IoT sensors
  * CCTV analytics
  * Mobile GPS aggregation
* Expansion to all cities and venues
* Real-time event integration (ticketing platforms)

---

## Why This Approach?

Instead of building a heavy, API-dependent system, this prototype focuses on:

* Core intelligence (AI decision-making)
* User experience
* Scalability design

This ensures:

* Fast performance
* Easy deployment
* Clear demonstration of concept

---

## Tech Stack

* Frontend: HTML, CSS, Vanilla JavaScript
* Backend: Node.js (Express)
* AI: Google Gemini API
* Deployment: Google Cloud Run

---

## Deployment

The application is containerized using Docker and deployed on Google Cloud Run for:

* Scalability
* Reliability
* Easy access via public URL

---

## Conclusion

OmniEvent AI demonstrates how AI can transform crowd navigation by providing intelligent, real-time assistance in complex environments. While the current version uses simulated data, the system is fully designed to scale into a real-world solution with live integrations.
