# PUSH — LOCKED CANONICAL STATE

Locked: 2026-08-30

The current Push workout is the canonical reference implementation for the workout-card system. Do not redesign or alter this state unless explicitly requested.

## Card structure
- Exercise title
- Prescription line beneath title
- Quiet Note / Similar / Skip controls
- Full-width anatomy panel
- Set logging table: SET / KG / REPS / DONE
- Existing card radius, border, spacing and dark visual treatment are locked

## Anatomy rules
- Every exercise has its own unique image
- Full-body faceless anatomical figure
- Flat near-black background
- Neutral grey anatomy
- Target muscles highlighted in muted brass / amber
- No glow, halo, bloom, haze or cinematic lighting
- Sharp muscle detail
- Images use the working small-WebP -> base64 asset pipeline

## Push exercises
1. Incline Dumbbell Press
2. Flat Dumbbell Press
3. Cable Fly
4. Cable Lateral Raise
5. Rope Triceps Pushdown
6. Overhead Cable Extension
7. Cable Crunch

## Cable Crunch reference
The current Cable Crunch asset is the verified working version and should not be regenerated or replaced unless explicitly requested.

## Build rule
Use Push as the visual and interaction reference when building Pull, Legs and Upper / Chest. Match the system; only exercise content and anatomy emphasis should change.
