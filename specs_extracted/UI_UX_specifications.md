routes/s.$postId

post_with_profile

postWithProfile

messagingRoomId

imagegenOgImagePolicy

current_wide

preferIntrinsicAspectRatioForOgImage

enforceRenderedOgImg

ogImageVariantOverride

defaultOgDescription

ChatGPT helps you get answers, find inspiration, and be more productive.

shareReceivePerformance

loaderDurationMs

apiDurationMs

profile_picture_url

https://cdn.openai.com/sora/images/profile_placeholder_v4.png

profile_picture_id

is_default_profile_picture

follower_count

is_following

display_name

character_count

owner_profile

social_context

follows_you

t_6a9eb4820fc08191a685073e66e0a6dc

Recall SIH Detection Idea

Check out this chat

og_description

Here's a chat someone thought you'd want to see.

og_image_variant

attachments

preview_image_url

https://ogimg.chatgpt.com/?postId=t_6a9eb4820fc08191a685073e66e0a6dc

https://chatgpt.com/s/t_6a9eb4820fc08191a685073e66e0a6dc

permissions

use_experimental_unfurl

share_setting

t_6a9eb4820fc08191a685073e66e0a6dc-attachment-0

message_slice

group_chat_id

source_attachment_type

widget_type

widget_name

fa470acd-a495-47e1-a335-409b511260fa

create_time

update_time

finished_successfully

finish_details

is_complete

content_references

story_events

resolved_model_slug

gpt-5-6-t-mini

g-p-6a9eaa38adf08191bc382145cb235374

code_blocks

search_result_groups

cot_version

conversation_followup_suggestions_eligible

9b5393ca-9de5-43d6-956a-d9e4ea50757e

message_type

turn_exchange_id

61f0f978-59dc-4c51-9ef0-2478d550e025

working_turn_id

default_model_slug

7e521e06-5335-41fa-8a1d-64ad047c163e

writing_blocks

# Diagnotech — UI/UX Specifications

## 1. Product Design Overview

### Product Name
**Diagnotech**

### Product Purpose

Diagnotech is an AI-powered early-risk screening platform for:

- Diabetes
- Cardiovascular Disease

The interface must communicate three things clearly:

**1. The system can analyze health data.**  
**2. The AI result can be explained.**  
**3. The result is a screening prediction, not a confirmed medical diagnosis.**

The design should therefore combine:

**Healthcare + AI + Data Visualization + Trust**

---

# 2. UX Design Principles

The entire application should follow these principles.

### 2.1 Clarity First

Users should understand what to do without reading lengthy instructions.

Every screen should have:

- one clear primary action
- clear hierarchy
- concise supporting information

### 2.2 Progressive Disclosure

Do not expose every technical detail immediately.

For example:

```text
First:
Risk Result

Then:
Why did the model predict this?

Then:
Detailed SHAP analysis

Then:
Model performance
```

This prevents information overload.

### 2.3 Explainability by Default

The explanation should not be hidden behind a completely separate system.

The result page should immediately show:

> **Top factors influencing this prediction**

with a **View Detailed Analysis** option.

### 2.4 Trust Without False Certainty

The UI should look professional without making the model appear infallible.

Avoid:

> “Disease Confirmed”

Use:

> “Higher Predicted Risk”

### 2.5 Data Before Decoration

Charts and animations should improve understanding, not simply make the UI look impressive.

---

# 3. Information Architecture

The application structure should be:

```text
Diagnotech
│
├── Home
│
├── Screening
│   ├── Select Disease
│   ├── Diabetes
│   └── Cardiovascular Disease
│
├── Results
│   ├── Prediction
│   └── Detailed Analysis
│
├── Analytics
│   ├── Dataset Analysis
│   ├── Model Performance
│   └── Explainability
│
├── Model Comparison
│   ├── Classical Models
│   └── Quantum Benchmark
│
└── About / Responsible AI
```

---

# 4. Navigation

## Desktop Navigation

Header:

```text
┌──────────────────────────────────────────────────────────────┐
│ ❤️ Diagnotech   Home   Screening   Analytics   About   [Start]│
└──────────────────────────────────────────────────────────────┘
```

### Navigation Items

**Home**  
Returns to landing page.

**Screening**  
Opens disease selection.

**Analytics**  
Opens model/dataset analytics.

**About**  
Explains the project and responsible AI principles.

**Start Screening**  
Primary CTA, always visually prominent.

---

# 5. Mobile Navigation

On mobile:

```text
┌─────────────────────────────┐
│ ❤️ Diagnotech          ☰   │
└─────────────────────────────┘
```

Menu:

```text
Home
Screening
Analytics
About
```

A **New Screening** button may remain fixed near the bottom on result screens.

---

# 6. Visual Identity

## Brand Personality

The design should feel:

- trustworthy
- intelligent
- clean
- modern
- calm
- scientific
- approachable

It should avoid looking:

- overly corporate
- overly futuristic
- frightening
- like a hospital billing system
- like a generic AI dashboard

---

# 7. Color System

### Primary

Deep blue/navy:

```text
#163B68
```

Use for:

- headings
- navigation
- important text
- major UI elements

### Primary Action

Blue:

```text
#2563EB
```

Use for:

- primary buttons
- links
- active navigation
- interactive controls

### Secondary / Health

Teal:

```text
#0F9B81
```

Use for:

- health indicators
- secondary actions
- successful processing
- supporting visuals

### Positive

Green:

```text
#16A34A
```

### Warning

Amber:

```text
#F59E0B
```

### Higher Risk / Error

Red:

```text
#EF4444
```

### Neutral

```text
#64748B
```

### Background

```text
#F8FAFC
```

### Card Background

```text
#FFFFFF
```

---

# 8. Risk Color Philosophy

Risk must **never be communicated through color alone**.

Use:

```text
Higher Predicted Risk
72%
```

rather than just displaying a red circle.

Recommended:

```text
Lower Risk       Green
Moderate Risk    Amber
Higher Risk      Red
```

Always combine with:

- text
- numerical probability
- iconography where appropriate

---

# 9. Typography

Recommended font:

**Inter**

Alternative:

**Manrope**

### Typography scale

```text
H1       40px / Bold
H2       30px / Semibold
H3       22px / Semibold
H4       18px / Semibold

Body     16px / Regular
Small    14px / Regular
Caption  12px / Regular
```

Mobile:

```text
H1       30–32px
H2       24px
H3       18–20px
Body     14–16px
```

---

# 10. Spacing System

Use an 8px-based spacing system.

```text
4px
8px
12px
16px
24px
32px
48px
64px
80px
```

Cards should generally use:

```text
Padding: 24px
Border radius: 12–16px
```

---

# 11. Border & Shadow System

Cards:

```text
Border:
1px solid #E2E8F0
```

Shadow:

Use extremely subtle shadows.

Avoid heavy floating-card effects.

The interface should feel flat and professional.

---

# 12. Button System

## Primary Button

```text
[ Start Screening → ]
```

Properties:

- blue background
- white text
- 10–12px radius
- medium/bold font
- height ~44–48px

## Secondary Button

```text
[ Learn More ]
```

White/light background with border.

## Success Button

Used sparingly for successful workflows.

## Text Button

For low-priority actions:

```text
View Details →
```

---

# 13. Input Component

Standard:

```text
Glucose Level *
┌─────────────────────────┐
│ Enter glucose value     │
└─────────────────────────┘
mg/dL
```

States:

### Default

Normal border.

### Focus

Blue border + subtle focus ring.

### Valid

Small success indicator.

### Error

Red border + error message.

Example:

```text
Glucose Level *
┌─────────────────────────┐
│ abc                     │
└─────────────────────────┘
Please enter a numerical value.
```

---

# 14. Landing Page

## Purpose

Immediately communicate:

- what Diagnotech does
- supported diseases
- why it is different
- how to begin

---

## Hero Section

Layout:

```text
┌──────────────────────────────────────────────────────┐
│                                                      │
│  AI-Powered Early Risk Screening                    │
│                                                      │
│  Understand potential diabetes and cardiovascular   │
│  disease risk through explainable AI.               │
│                                                      │
│  [ Start Screening ]  [ How It Works ]              │
│                                  ┌───────────────┐   │
│                                  │ Health + AI   │   │
│                                  │ Illustration  │   │
│                                  └───────────────┘   │
└──────────────────────────────────────────────────────┘
```

Headline should be short.

Suggested:

> **Early Detection. Clearer Insights. Smarter Screening.**

---

# 15. Landing Page — Disease Cards

Below the hero:

```text
Choose a Screening

┌─────────────────────┐   ┌──────────────────────┐
│ 🩸                  │   │ ❤️                   │
│ Diabetes            │   │ Cardiovascular       │
│                     │   │ Disease              │
│ AI-assisted risk    │   │ AI-assisted risk     │
│ screening           │   │ screening            │
│                     │   │                      │
│ [ Start Screening ] │   │ [ Start Screening ]  │
└─────────────────────┘   └──────────────────────┘
```

Cards should use distinct icons but maintain the same structure.

---

# 16. Landing Page — Why Diagnotech

Four feature cards:

```text
Accurate Screening
Explainable AI
Model Comparison
Privacy First
```

Each card:

```text
Icon
Heading
1–2 lines of explanation
```

---

# 17. Landing Page — How It Works

Use a simple horizontal process:

```text
01
Enter Data
   ↓
02
AI Analysis
   ↓
03
Risk Prediction
   ↓
04
Understand Why
   ↓
05
Explore Evidence
```

Do not use complex technical terminology here.

---

# 18. Landing Page — Responsible AI Section

A dedicated section should state:

> Diagnotech provides AI-assisted screening insights, not medical diagnosis.

Include:

- model limitations
- dataset limitations
- need for professional evaluation
- privacy principles

This increases trust.

---

# 19. Disease Selection Page

Heading:

> **Select a Disease for Screening**

Subtitle:

> Choose the condition you want to analyze.

Two large cards:

```text
┌──────────────────────┐
│ 🩸                   │
│ Diabetes             │
│                      │
│ Assess diabetes-     │
│ related risk using   │
│ health parameters.   │
│                      │
│ [ Select → ]         │
└──────────────────────┘

┌──────────────────────┐
│ ❤️                   │
│ Cardiovascular       │
│ Disease              │
│                      │
│ Assess cardiovascular│
│ risk using clinical  │
│ parameters.          │
│                      │
│ [ Select → ]          │
└──────────────────────┘
```

---

# 20. Screening Form UX

This is one of the most important screens.

Instead of showing a huge list of variables with no structure, divide inputs into logical groups.

---

# 21. Diabetes Form

Heading:

> **Diabetes Risk Screening**

Subtitle:

> Enter the required health parameters to generate an AI-assisted screening result.

### Group 1 — Basic Information

```text
Age
Pregnancies
```

### Group 2 — Measurements

```text
Glucose
Blood Pressure
BMI
```

### Group 3 — Additional Parameters

```text
Skin Thickness
Insulin
Diabetes Pedigree Function
```

The exact fields depend on the finalized model.

---

# 22. CVD Form

Heading:

> **Cardiovascular Risk Screening**

Possible grouped sections:

### Basic Information

```text
Age
Sex
```

### Clinical Measurements

```text
Resting Blood Pressure
Cholesterol
Maximum Heart Rate
```

### Cardiac / Exercise Indicators

```text
Chest Pain Type
Resting ECG
Exercise Angina
ST Depression
ST Slope
```

Again, the final fields must correspond exactly to the selected dataset/model.

---

# 23. Form Layout

Desktop:

```text
┌──────────────────────────────────────┐
│ Section                              │
│                                      │
│ [ Input ]             [ Input ]      │
│                                      │
│ [ Input ]             [ Input ]      │
│                                      │
│ [ Input ]             [ Input ]      │
└──────────────────────────────────────┘
```

Mobile:

```text
[ Input ]

[ Input ]

[ Input ]

[ Input ]
```

---

# 24. Form UX Requirements

Every input should have:

- label
- unit where applicable
- example/placeholder
- required indicator
- validation
- accessible label

Don't rely on placeholders as the only label.

---

# 25. Form Progress Indicator

For longer workflows:

```text
1. Information
   ↓
2. Measurements
   ↓
3. Review
```

For the MVP, a simple single-page form is acceptable if the number of inputs remains manageable.

---

# 26. Review Before Prediction

Before submission, optionally provide:

```text
Review Information

Age             42
Glucose         135
BMI             28.4
...

[ Edit ]        [ Analyze Risk → ]
```

This reduces accidental input errors.

---

# 27. Loading Screen

When the user presses **Analyze Risk**, don't immediately jump to an unexplained blank page.

Show:

```text
Analyzing your information

✓ Input validated
✓ Features processed
● Running prediction model
○ Generating explanation
○ Preparing analysis
```

The animation should remain subtle.

---

# 28. Result Page

This is the most important UX screen.

The user should understand the result within approximately a few seconds.

Top section:

```text
Screening Result

Diabetes

          72%
  Estimated Model Probability

  HIGHER PREDICTED RISK
```

---

# 29. Result Card

Recommended structure:

```text
┌─────────────────────────────────────────┐
│ Prediction Completed                    │
│                                         │
│       ┌──────────────┐                  │
│       │     72%      │                  │
│       │ Probability  │                  │
│       └──────────────┘                  │
│                                         │
│ Higher Predicted Risk                   │
│ Based on the information provided.      │
└─────────────────────────────────────────┘
```

Use a circular gauge or semi-circular gauge.

---

# 30. Risk Explanation

Immediately beneath prediction:

> **What influenced this result?**

Example:

```text
Glucose          ███████████  0.31
BMI              ████████     0.18
Age              █████        0.12
Blood Pressure   ████         0.08
Insulin          ███          0.06
```

The visual should make the ranking obvious.

---

# 31. Important Explanation Wording

The UI should say:

> “These features contributed strongly to the model's prediction.”

Not:

> “These features caused your disease.”

This distinction must remain consistent throughout the product.

---

# 32. Model Information Card

Example:

```text
Model Information

Model             Random Forest
Version           v1.0
Features          8
Explanation       SHAP
```

This is primarily useful for transparency and the technical audience.

---

# 33. Model Performance Card

Display a few important metrics directly:

```text
Model Performance

Accuracy     78%
Recall       81%
Specificity  76%
ROC-AUC      84%
```

Don't make users open another page just to discover whether the model was evaluated.

---

# 34. Detailed Analysis CTA

Primary secondary action:

```text
[ View Detailed Analysis → ]
```

This opens the explainability/analytics page.

---

# 35. Disclaimer on Result Page

A small but highly visible box:

```text
ⓘ Important

This is an AI-assisted screening result, not a medical diagnosis.
Please consult a qualified healthcare professional for appropriate
evaluation.
```

Don't bury this in a footer.

---

# 36. Detailed Analysis Page

This page is aimed at users who want to understand the prediction more deeply.

Tabs:

```text
Feature Importance
SHAP Analysis
Model Performance
Confusion Matrix
ROC Curve
```

---

# 37. Feature Importance View

Example:

```text
Feature Contribution

Glucose          █████████████  0.31
BMI              █████████      0.18
Age              ██████         0.12
Blood Pressure   ████           0.08
Insulin          ███            0.06
```

Use horizontal bars because feature names can be long.

---

# 38. SHAP Summary View

The SHAP summary plot should be rendered in a large card.

Include a plain-language explanation next to it:

> Higher or lower feature values can influence the model output in different directions. SHAP visualizations describe model behavior rather than medical causation.

---

# 39. Model Performance Page

Display:

```text
Model Performance

┌──────────┬──────────┬─────────┬──────────┐
│ Accuracy │ Precision│ Recall  │ ROC-AUC  │
│   XX%    │   XX%    │  XX%    │   XX%    │
└──────────┴──────────┴─────────┴──────────┘
```

Then:

- ROC curve
- confusion matrix
- precision-recall curve

---

# 40. Confusion Matrix UX

Use a large, readable matrix:

```text
                     ACTUAL

                  Positive  Negative

PREDICTED
Positive             TP        FP

Negative             FN        TN
```

Show counts and labels.

Do not depend only on colors.

---

# 41. Model Comparison Dashboard

This should be one of the most impressive screens for SIH.

Header:

> **Model Comparison**

Controls:

```text
[ Diabetes ] [ Cardiovascular ]

[ All Models ] [ Classical vs Quantum ]
```

---

# 42. Model Comparison Table

```text
┌──────────────┬────────┬────────┬────────┬────────┐
│ Model        │ Acc.   │ Recall │ F1     │ AUC    │
├──────────────┼────────┼────────┼────────┼────────┤
│ Logistic     │ XX     │ XX     │ XX     │ XX     │
│ SVM          │ XX     │ XX     │ XX     │ XX     │
│ RandomForest │ XX     │ XX     │ XX     │ XX     │
│ XGBoost      │ XX     │ XX     │ XX     │ XX     │
└──────────────┴────────┴────────┴────────┴────────┘
```

---

# 43. Quantum Comparison UX

Create a separate highlighted section:

```text
Classical ML vs Quantum Kernel

                 Classical       Quantum
Accuracy             XX%            XX%
Recall               XX%            XX%
F1                   XX%            XX%
ROC-AUC              XX%            XX%
```

Then show:

**Benchmark Interpretation**

For example:

> “The quantum-kernel approach achieved comparable performance to the strongest classical baseline on the evaluated dataset.”

Only display conclusions supported by actual experiments.

---

# 44. Analytics Dashboard

The analytics dashboard should be more technical than the normal user result page.

Top metric cards:

```text
Total Samples
Features
Positive Cases
Negative Cases
```

Then:

```text
Class Distribution
Feature Overview
Model Performance
ROC Curves
```

---

# 45. Dataset Overview

Example:

```text
Diabetes Dataset

768 Samples
8 Features
268 Positive
500 Negative
```

The frontend must pull these values from the backend rather than hard-coding them.

---

# 46. Analytics Navigation

Recommended tabs:

```text
Dataset
Models
Explainability
Quantum Benchmark
```

This avoids an extremely long scrolling dashboard.

---

# 47. About Page

Sections:

### What is Diagnotech?

Short explanation.

### How It Works

```text
Data
 ↓
Preprocessing
 ↓
Machine Learning
 ↓
Prediction
 ↓
Explainability
 ↓
Analysis
```

### Technology

Show:

```text
React
FastAPI
scikit-learn
XGBoost
SHAP
Qiskit/PennyLane
PostgreSQL
```

### Responsible AI

Explain limitations.

---

# 48. Empty States

Example:

```text
No screening yet

Start your first screening to see
your results and analysis.

[ Start Screening ]
```

Avoid blank pages.

---

# 49. Error States

Example API failure:

```text
Something went wrong

We couldn't complete the screening right now.

[ Try Again ]
```

Do not show:

```text
500 Internal Server Error
Traceback...
```

to users.

---

# 50. Form Error State

Use inline errors:

```text
Blood Pressure *
┌───────────────────┐
│ -20               │
└───────────────────┘
⚠ Please enter a valid value.
```

The user should know exactly what needs correction.

---

# 51. Accessibility Specification

The UI should target approximately **WCAG 2.1 AA** principles.

Requirements:

- sufficient text/background contrast
- keyboard navigation
- visible focus state
- semantic HTML
- labels for every input
- accessible chart descriptions
- clear error messages
- don't communicate information through color alone

---

# 52. Responsive Design

### Desktop

Two-column layouts can be used.

### Tablet

Reduce card widths and spacing.

### Mobile

Everything becomes primarily single-column.

Example:

```text
Desktop:
[ Input ] [ Input ]

Mobile:
[ Input ]
[ Input ]
```

Analytics charts should support horizontal scrolling or responsive resizing when necessary.

---

# 53. Mobile Result Page

Important result information should remain above the fold:

```text
Diabetes

72%
Higher Predicted Risk

Top Factors
Glucose
BMI
Age

[ View Detailed Analysis ]
```

Don't force users to scroll through technical metrics before seeing their result.

---

# 54. Chart Guidelines

Charts should:

- have titles
- have axis labels
- include legends where necessary
- use tooltips
- remain readable on mobile
- use consistent units
- avoid decorative 3D effects

Recommended charts:

**Risk:** Gauge  
**Feature contribution:** Horizontal bar  
**Model comparison:** Bar chart  
**ROC:** Line chart  
**Class distribution:** Donut/bar  
**SHAP:** Standard SHAP summary visualization

---

# 55. Animation

Keep animations minimal.

Recommended:

- page fade/slide
- card hover
- progress animation
- chart entry animation
- button loading state

Avoid:

- excessive particles
- rotating 3D medical objects
- artificial “AI brain thinking” animations
- long splash screens

The product should feel fast.

---

# 56. Design Tokens

Create centralized frontend tokens:

```text
colors
typography
spacing
radius
shadows
breakpoints
transitions
```

This makes the UI consistent.

---

# 57. Reusable Component Library

The frontend should have:

```text
Button
Card
Input
Select
Checkbox
Badge
Alert
Modal
Tooltip
Progress
Tabs
MetricCard
RiskGauge
ChartCard
DataTable
Navbar
Footer
```

Disease-specific components:

```text
DiabetesForm
CVDForm
```

Shared components:

```text
PredictionResult
RiskGauge
ExplanationChart
MetricsCard
```

---

# 58. Design Consistency Between Diseases

The Diabetes and CVD workflows should feel like the same product.

Example:

```text
Diabetes
 └── Form
 └── Result
 └── Explanation
 └── Analytics

CVD
 └── Form
 └── Result
 └── Explanation
 └── Analytics
```

Only the clinical input fields and model-specific content should change.

---

# 59. UX State Architecture

Each major screen should support:

```text
idle
loading
success
error
empty
```

For prediction:

```text
FORM
 ↓
SUBMITTING
 ↓
ANALYZING
 ↓
RESULT
```

For API failure:

```text
SUBMITTING
 ↓
ERROR
 ↓
RETRY
```

---

# 60. Frontend Route Structure

Recommended:

```text
/
 /screening
 /screening/diabetes
 /screening/cardiovascular

 /results/:id
 /analysis/:id

 /analytics
 /analytics/dataset
 /analytics/models
 /analytics/quantum

 /about
```

---

# 61. API ↔ UI Mapping

| UI Screen | API |
|---|---|
| Disease Selection | No API required |
| Diabetes Form | `POST /predict/diabetes` |
| CVD Form | `POST /predict/cardiovascular` |
| Result | Prediction response |
| Model Info | `GET /models/{disease}` |
| Analytics | `GET /analytics/...` |
| Model Comparison | `GET /analytics/models/{disease}` |
| Quantum Benchmark | `GET /analytics/quantum/{disease}` |

---

# 62. Result Object → UI Mapping

Backend:

```text
probability
```

→ Risk Gauge

```text
risk_category
```

→ Risk Badge

```text
top_features
```

→ Feature Contribution Chart

```text
model_metrics
```

→ Metric Cards

```text
model
```

→ Model Information Card

```text
disclaimer
```

→ Disclaimer Alert

This keeps frontend logic simple.

---

# 63. Screen Hierarchy

The visual importance should generally be:

```text
1. Disease
2. Prediction
3. Risk Category
4. Why?
5. Main Contributors
6. Model Information
7. Performance
8. Technical Details
```

Not:

```text
1. Technical Model Name
2. Dataset
3. Confusion Matrix
4. Prediction
```

The user result must always come first.

---

# 64. SIH Presentation Mode

Create an optional **Demo Mode**.

A simple button:

```text
[ Demo Mode ]
```

could populate controlled demonstration data.

This allows the team to show:

```text
Input
 ↓
Prediction
 ↓
Explainability
 ↓
Model Comparison
```

quickly during judging.

The demo data must be clearly labelled as demonstration/test data.

---

# 65. Recommended SIH Demo Flow

The ideal presentation sequence:

```text
HOME
  ↓
START SCREENING
  ↓
DIABETES
  ↓
ENTER DEMO DATA
  ↓
ANALYZE
  ↓
72% HIGHER PREDICTED RISK
  ↓
“WHY DID THE MODEL SAY THIS?”
  ↓
SHAP EXPLANATION
  ↓
MODEL PERFORMANCE
  ↓
CLASSICAL VS QUANTUM
  ↓
RESPONSIBLE AI
```

This creates a strong narrative instead of simply clicking through pages.

---

# 66. UI/UX Acceptance Criteria

The UI is considered complete when:

### Navigation

- all major screens are reachable
- active page is clearly indicated
- mobile navigation works

### Forms

- every field is labelled
- validation works
- errors are understandable
- mobile form works

### Prediction

- result appears clearly
- probability is visible
- risk category is visible
- model is identified

### Explainability

- feature contributions are visible
- explanation is understandable
- SHAP visualization works

### Analytics

- metrics are displayed
- model comparison works
- charts are responsive

### Responsible AI

- disclaimer is visible
- no unsupported diagnosis claims are made

---

# 67. Final UX Architecture

```text
                           DIAGNOTECH
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                USER                       JUDGE
                 │                           │
                 ▼                           ▼
             HOME PAGE                 DEMO MODE
                 │                           │
                 └─────────────┬─────────────┘
                               ▼
                       DISEASE SELECTION
                         │             │
                         ▼             ▼
                     DIABETES         CVD
                         │             │
                         └──────┬──────┘
                                ▼
                           INPUT FORM
                                │
                                ▼
                             ANALYZE
                                │
                                ▼
                         PREDICTION RESULT
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
                  RISK        WHY?       METRICS
                    │           │           │
                    │           ▼           │
                    │      EXPLAINABILITY   │
                    │           │           │
                    └───────────┼───────────┘
                                ▼
                       DETAILED ANALYSIS
                                │
                   ┌────────────┴────────────┐
                   ▼                         ▼
             MODEL COMPARISON          QUANTUM BENCHMARK
                   │                         │
                   └────────────┬────────────┘
                                ▼
                         RESPONSIBLE AI
```

# 68. Final Design Direction

The final interface should communicate this story visually:

> **“Enter relevant data → let the AI analyze it → see the risk → understand why → inspect the evidence → make an informed decision with professional guidance.”**

The strongest visual element should therefore **not** be the AI/quantum technology itself.

The strongest visual element should be the **transparent journey from input to prediction to explanation**.

That is what makes Diagnotech feel like a complete product rather than a machine-learning model wrapped in a website.

Diagnotech — Complete UI/UX Specifications

suggested_followups

Standardize risk terminology and probability

Define form fields and validation rules

Add an MVP-versus-future scope

previewable

preview_language

matched_text

Create a sequence of UI states from form input to result display

prompt_text

Using the recommended UX state architecture, describe the detailed UI state transitions and user feedback from the Diabetes or Cardiovascular form submission through loading, analyzing, success, and error states. Describe what the user sees and how the UI responds at each step, including validation errors, loading animations, messaging, and fallback options.

receiver_followup_intent

tailored_continuation

receiver_followup_position

receiver_followups_tailored

receiver_followup_treatment

receiver_followup_capability_scope

receiver_followup_prompt_version

Outline the mobile and desktop result page layouts

Create detailed design guidelines for the screening result page on both desktop and mobile based on the provided specs, including placement and style of the main prediction card, risk explanation section, important disclaimers, and calls to action. Include advice on how to prioritize information to keep the result quick to understand and within 'above the fold' content on mobile.

Specify detailed UI components for the Diabetes form

Using the UI/UX specifications, please provide a detailed breakdown of the Diabetes screening form components, including labels, placeholders, validation rules, and layout instructions for each input field in the three groups defined (Basic Information, Measurements, Additional Parameters). Please specify how the form should be structured and visually styled on desktop and mobile.

stop_tokens

content_type

Great. We’ll now turn the concept into a **proper implementation-ready UI/UX specification** that a frontend developer can directly follow.

:::writing{variant="document" id="41857" title="Diagnotech — Complete UI/UX Specifications"}
# Diagnotech — UI/UX Specifications

## 1. Product Design Overview

### Product Name
**Diagnotech**

### Product Purpose

Diagnotech is an AI-powered early-risk screening platform for:

- Diabetes
- Cardiovascular Disease

The interface must communicate three things clearly:

**1. The system can analyze health data.**  
**2. The AI result can be explained.**  
**3. The result is a screening prediction, not a confirmed medical diagnosis.**

The design should therefore combine:

**Healthcare + AI + Data Visualization + Trust**

---

# 2. UX Design Principles

The entire application should follow these principles.

### 2.1 Clarity First

Users should understand what to do without reading lengthy instructions.

Every screen should have:

- one clear primary action
- clear hierarchy
- concise supporting information

### 2.2 Progressive Disclosure

Do not expose every technical detail immediately.

For example:

```text
First:
Risk Result

Then:
Why did the model predict this?

Then:
Detailed SHAP analysis

Then:
Model performance
```

This prevents information overload.

### 2.3 Explainability by Default

The explanation should not be hidden behind a completely separate system.

The result page should immediately show:

> **Top factors influencing this prediction**

with a **View Detailed Analysis** option.

### 2.4 Trust Without False Certainty

The UI should look professional without making the model appear infallible.

Avoid:

> “Disease Confirmed”

Use:

> “Higher Predicted Risk”

### 2.5 Data Before Decoration

Charts and animations should improve understanding, not simply make the UI look impressive.

---

# 3. Information Architecture

The application structure should be:

```text
Diagnotech
│
├── Home
│
├── Screening
│   ├── Select Disease
│   ├── Diabetes
│   └── Cardiovascular Disease
│
├── Results
│   ├── Prediction
│   └── Detailed Analysis
│
├── Analytics
│   ├── Dataset Analysis
│   ├── Model Performance
│   └── Explainability
│
├── Model Comparison
│   ├── Classical Models
│   └── Quantum Benchmark
│
└── About / Responsible AI
```

---

# 4. Navigation

## Desktop Navigation

Header:

```text
┌──────────────────────────────────────────────────────────────┐
│ ❤️ Diagnotech   Home   Screening   Analytics   About   [Start]│
└──────────────────────────────────────────────────────────────┘
```

### Navigation Items

**Home**  
Returns to landing page.

**Screening**  
Opens disease selection.

**Analytics**  
Opens model/dataset analytics.

**About**  
Explains the project and responsible AI principles.

**Start Screening**  
Primary CTA, always visually prominent.

---

# 5. Mobile Navigation

On mobile:

```text
┌─────────────────────────────┐
│ ❤️ Diagnotech          ☰   │
└─────────────────────────────┘
```

Menu:

```text
Home
Screening
Analytics
About
```

A **New Screening** button may remain fixed near the bottom on result screens.

---

# 6. Visual Identity

## Brand Personality

The design should feel:

- trustworthy
- intelligent
- clean
- modern
- calm
- scientific
- approachable

It should avoid looking:

- overly corporate
- overly futuristic
- frightening
- like a hospital billing system
- like a generic AI dashboard

---

# 7. Color System

### Primary

Deep blue/navy:

```text
#163B68
```

Use for:

- headings
- navigation
- important text
- major UI elements

### Primary Action

Blue:

```text
#2563EB
```

Use for:

- primary buttons
- links
- active navigation
- interactive controls

### Secondary / Health

Teal:

```text
#0F9B81
```

Use for:

- health indicators
- secondary actions
- successful processing
- supporting visuals

### Positive

Green:

```text
#16A34A
```

### Warning

Amber:

```text
#F59E0B
```

### Higher Risk / Error

Red:

```text
#EF4444
```

### Neutral

```text
#64748B
```

### Background

```text
#F8FAFC
```

### Card Background

```text
#FFFFFF
```

---

# 8. Risk Color Philosophy

Risk must **never be communicated through color alone**.

Use:

```text
Higher Predicted Risk
72%
```

rather than just displaying a red circle.

Recommended:

```text
Lower Risk       Green
Moderate Risk    Amber
Higher Risk      Red
```

Always combine with:

- text
- numerical probability
- iconography where appropriate

---

# 9. Typography

Recommended font:

**Inter**

Alternative:

**Manrope**

### Typography scale

```text
H1       40px / Bold
H2       30px / Semibold
H3       22px / Semibold
H4       18px / Semibold

Body     16px / Regular
Small    14px / Regular
Caption  12px / Regular
```

Mobile:

```text
H1       30–32px
H2       24px
H3       18–20px
Body     14–16px
```

---

# 10. Spacing System

Use an 8px-based spacing system.

```text
4px
8px
12px
16px
24px
32px
48px
64px
80px
```

Cards should generally use:

```text
Padding: 24px
Border radius: 12–16px
```

---

# 11. Border & Shadow System

Cards:

```text
Border:
1px solid #E2E8F0
```

Shadow:

Use extremely subtle shadows.

Avoid heavy floating-card effects.

The interface should feel flat and professional.

---

# 12. Button System

## Primary Button

```text
[ Start Screening → ]
```

Properties:

- blue background
- white text
- 10–12px radius
- medium/bold font
- height ~44–48px

## Secondary Button

```text
[ Learn More ]
```

White/light background with border.

## Success Button

Used sparingly for successful workflows.

## Text Button

For low-priority actions:

```text
View Details →
```

---

# 13. Input Component

Standard:

```text
Glucose Level *
┌─────────────────────────┐
│ Enter glucose value     │
└─────────────────────────┘
mg/dL
```

States:

### Default

Normal border.

### Focus

Blue border + subtle focus ring.

### Valid

Small success indicator.

### Error

Red border + error message.

Example:

```text
Glucose Level *
┌─────────────────────────┐
│ abc                     │
└─────────────────────────┘
Please enter a numerical value.
```

---

# 14. Landing Page

## Purpose

Immediately communicate:

- what Diagnotech does
- supported diseases
- why it is different
- how to begin

---

## Hero Section

Layout:

```text
┌──────────────────────────────────────────────────────┐
│                                                      │
│  AI-Powered Early Risk Screening                    │
│                                                      │
│  Understand potential diabetes and cardiovascular   │
│  disease risk through explainable AI.               │
│                                                      │
│  [ Start Screening ]  [ How It Works ]              │
│                                  ┌───────────────┐   │
│                                  │ Health + AI   │   │
│                                  │ Illustration  │   │
│                                  └───────────────┘   │
└──────────────────────────────────────────────────────┘
```

Headline should be short.

Suggested:

> **Early Detection. Clearer Insights. Smarter Screening.**

---

# 15. Landing Page — Disease Cards

Below the hero:

```text
Choose a Screening

┌─────────────────────┐   ┌──────────────────────┐
│ 🩸                  │   │ ❤️                   │
│ Diabetes            │   │ Cardiovascular       │
│                     │   │ Disease              │
│ AI-assisted risk    │   │ AI-assisted risk     │
│ screening           │   │ screening            │
│                     │   │                      │
│ [ Start Screening ] │   │ [ Start Screening ]  │
└─────────────────────┘   └──────────────────────┘
```

Cards should use distinct icons but maintain the same structure.

---

# 16. Landing Page — Why Diagnotech

Four feature cards:

```text
Accurate Screening
Explainable AI
Model Comparison
Privacy First
```

Each card:

```text
Icon
Heading
1–2 lines of explanation
```

---

# 17. Landing Page — How It Works

Use a simple horizontal process:

```text
01
Enter Data
   ↓
02
AI Analysis
   ↓
03
Risk Prediction
   ↓
04
Understand Why
   ↓
05
Explore Evidence
```

Do not use complex technical terminology here.

---

# 18. Landing Page — Responsible AI Section

A dedicated section should state:

> Diagnotech provides AI-assisted screening insights, not medical diagnosis.

Include:

- model limitations
- dataset limitations
- need for professional evaluation
- privacy principles

This increases trust.

---

# 19. Disease Selection Page

Heading:

> **Select a Disease for Screening**

Subtitle:

> Choose the condition you want to analyze.

Two large cards:

```text
┌──────────────────────┐
│ 🩸                   │
│ Diabetes             │
│                      │
│ Assess diabetes-     │
│ related risk using   │
│ health parameters.   │
│                      │
│ [ Select → ]         │
└──────────────────────┘

┌──────────────────────┐
│ ❤️                   │
│ Cardiovascular       │
│ Disease              │
│                      │
│ Assess cardiovascular│
│ risk using clinical  │
│ parameters.          │
│                      │
│ [ Select → ]          │
└──────────────────────┘
```

---

# 20. Screening Form UX

This is one of the most important screens.

Instead of showing a huge list of variables with no structure, divide inputs into logical groups.

---

# 21. Diabetes Form

Heading:

> **Diabetes Risk Screening**

Subtitle:

> Enter the required health parameters to generate an AI-assisted screening result.

### Group 1 — Basic Information

```text
Age
Pregnancies
```

### Group 2 — Measurements

```text
Glucose
Blood Pressure
BMI
```

### Group 3 — Additional Parameters

```text
Skin Thickness
Insulin
Diabetes Pedigree Function
```

The exact fields depend on the finalized model.

---

# 22. CVD Form

Heading:

> **Cardiovascular Risk Screening**

Possible grouped sections:

### Basic Information

```text
Age
Sex
```

### Clinical Measurements

```text
Resting Blood Pressure
Cholesterol
Maximum Heart Rate
```

### Cardiac / Exercise Indicators

```text
Chest Pain Type
Resting ECG
Exercise Angina
ST Depression
ST Slope
```

Again, the final fields must correspond exactly to the selected dataset/model.

---

# 23. Form Layout

Desktop:

```text
┌──────────────────────────────────────┐
│ Section                              │
│                                      │
│ [ Input ]             [ Input ]      │
│                                      │
│ [ Input ]             [ Input ]      │
│                                      │
│ [ Input ]             [ Input ]      │
└──────────────────────────────────────┘
```

Mobile:

```text
[ Input ]

[ Input ]

[ Input ]

[ Input ]
```

---

# 24. Form UX Requirements

Every input should have:

- label
- unit where applicable
- example/placeholder
- required indicator
- validation
- accessible label

Don't rely on placeholders as the only label.

---

# 25. Form Progress Indicator

For longer workflows:

```text
1. Information
   ↓
2. Measurements
   ↓
3. Review
```

For the MVP, a simple single-page form is acceptable if the number of inputs remains manageable.

---

# 26. Review Before Prediction

Before submission, optionally provide:

```text
Review Information

Age             42
Glucose         135
BMI             28.4
...

[ Edit ]        [ Analyze Risk → ]
```

This reduces accidental input errors.

---

# 27. Loading Screen

When the user presses **Analyze Risk**, don't immediately jump to an unexplained blank page.

Show:

```text
Analyzing your information

✓ Input validated
✓ Features processed
● Running prediction model
○ Generating explanation
○ Preparing analysis
```

The animation should remain subtle.

---

# 28. Result Page

This is the most important UX screen.

The user should understand the result within approximately a few seconds.

Top section:

```text
Screening Result

Diabetes

          72%
  Estimated Model Probability

  HIGHER PREDICTED RISK
```

---

# 29. Result Card

Recommended structure:

```text
┌─────────────────────────────────────────┐
│ Prediction Completed                    │
│                                         │
│       ┌──────────────┐                  │
│       │     72%      │                  │
│       │ Probability  │                  │
│       └──────────────┘                  │
│                                         │
│ Higher Predicted Risk                   │
│ Based on the information provided.      │
└─────────────────────────────────────────┘
```

Use a circular gauge or semi-circular gauge.

---

# 30. Risk Explanation

Immediately beneath prediction:

> **What influenced this result?**

Example:

```text
Glucose          ███████████  0.31
BMI              ████████     0.18
Age              █████        0.12
Blood Pressure   ████         0.08
Insulin          ███          0.06
```

The visual should make the ranking obvious.

---

# 31. Important Explanation Wording

The UI should say:

> “These features contributed strongly to the model's prediction.”

Not:

> “These features caused your disease.”

This distinction must remain consistent throughout the product.

---

# 32. Model Information Card

Example:

```text
Model Information

Model             Random Forest
Version           v1.0
Features          8
Explanation       SHAP
```

This is primarily useful for transparency and the technical audience.

---

# 33. Model Performance Card

Display a few important metrics directly:

```text
Model Performance

Accuracy     78%
Recall       81%
Specificity  76%
ROC-AUC      84%
```

Don't make users open another page just to discover whether the model was evaluated.

---

# 34. Detailed Analysis CTA

Primary secondary action:

```text
[ View Detailed Analysis → ]
```

This opens the explainability/analytics page.

---

# 35. Disclaimer on Result Page

A small but highly visible box:

```text
ⓘ Important

This is an AI-assisted screening result, not a medical diagnosis.
Please consult a qualified healthcare professional for appropriate
evaluation.
```

Don't bury this in a footer.

---

# 36. Detailed Analysis Page

This page is aimed at users who want to understand the prediction more deeply.

Tabs:

```text
Feature Importance
SHAP Analysis
Model Performance
Confusion Matrix
ROC Curve
```

---

# 37. Feature Importance View

Example:

```text
Feature Contribution

Glucose          █████████████  0.31
BMI              █████████      0.18
Age              ██████         0.12
Blood Pressure   ████           0.08
Insulin          ███            0.06
```

Use horizontal bars because feature names can be long.

---

# 38. SHAP Summary View

The SHAP summary plot should be rendered in a large card.

Include a plain-language explanation next to it:

> Higher or lower feature values can influence the model output in different directions. SHAP visualizations describe model behavior rather than medical causation.

---

# 39. Model Performance Page

Display:

```text
Model Performance

┌──────────┬──────────┬─────────┬──────────┐
│ Accuracy │ Precision│ Recall  │ ROC-AUC  │
│   XX%    │   XX%    │  XX%    │   XX%    │
└──────────┴──────────┴─────────┴──────────┘
```

Then:

- ROC curve
- confusion matrix
- precision-recall curve

---

# 40. Confusion Matrix UX

Use a large, readable matrix:

```text
                     ACTUAL

                  Positive  Negative

PREDICTED
Positive             TP        FP

Negative             FN        TN
```

Show counts and labels.

Do not depend only on colors.

---

# 41. Model Comparison Dashboard

This should be one of the most impressive screens for SIH.

Header:

> **Model Comparison**

Controls:

```text
[ Diabetes ] [ Cardiovascular ]

[ All Models ] [ Classical vs Quantum ]
```

---

# 42. Model Comparison Table

```text
┌──────────────┬────────┬────────┬────────┬────────┐
│ Model        │ Acc.   │ Recall │ F1     │ AUC    │
├──────────────┼────────┼────────┼────────┼────────┤
│ Logistic     │ XX     │ XX     │ XX     │ XX     │
│ SVM          │ XX     │ XX     │ XX     │ XX     │
│ RandomForest │ XX     │ XX     │ XX     │ XX     │
│ XGBoost      │ XX     │ XX     │ XX     │ XX     │
└──────────────┴────────┴────────┴────────┴────────┘
```

---

# 43. Quantum Comparison UX

Create a separate highlighted section:

```text
Classical ML vs Quantum Kernel

                 Classical       Quantum
Accuracy             XX%            XX%
Recall               XX%            XX%
F1                   XX%            XX%
ROC-AUC              XX%            XX%
```

Then show:

**Benchmark Interpretation**

For example:

> “The quantum-kernel approach achieved comparable performance to the strongest classical baseline on the evaluated dataset.”

Only display conclusions supported by actual experiments.

---

# 44. Analytics Dashboard

The analytics dashboard should be more technical than the normal user result page.

Top metric cards:

```text
Total Samples
Features
Positive Cases
Negative Cases
```

Then:

```text
Class Distribution
Feature Overview
Model Performance
ROC Curves
```

---

# 45. Dataset Overview

Example:

```text
Diabetes Dataset

768 Samples
8 Features
268 Positive
500 Negative
```

The frontend must pull these values from the backend rather than hard-coding them.

---

# 46. Analytics Navigation

Recommended tabs:

```text
Dataset
Models
Explainability
Quantum Benchmark
```

This avoids an extremely long scrolling dashboard.

---

# 47. About Page

Sections:

### What is Diagnotech?

Short explanation.

### How It Works

```text
Data
 ↓
Preprocessing
 ↓
Machine Learning
 ↓
Prediction
 ↓
Explainability
 ↓
Analysis
```

### Technology

Show:

```text
React
FastAPI
scikit-learn
XGBoost
SHAP
Qiskit/PennyLane
PostgreSQL
```

### Responsible AI

Explain limitations.

---

# 48. Empty States

Example:

```text
No screening yet

Start your first screening to see
your results and analysis.

[ Start Screening ]
```

Avoid blank pages.

---

# 49. Error States

Example API failure:

```text
Something went wrong

We couldn't complete the screening right now.

[ Try Again ]
```

Do not show:

```text
500 Internal Server Error
Traceback...
```

to users.

---

# 50. Form Error State

Use inline errors:

```text
Blood Pressure *
┌───────────────────┐
│ -20               │
└───────────────────┘
⚠ Please enter a valid value.
```

The user should know exactly what needs correction.

---

# 51. Accessibility Specification

The UI should target approximately **WCAG 2.1 AA** principles.

Requirements:

- sufficient text/background contrast
- keyboard navigation
- visible focus state
- semantic HTML
- labels for every input
- accessible chart descriptions
- clear error messages
- don't communicate information through color alone

---

# 52. Responsive Design

### Desktop

Two-column layouts can be used.

### Tablet

Reduce card widths and spacing.

### Mobile

Everything becomes primarily single-column.

Example:

```text
Desktop:
[ Input ] [ Input ]

Mobile:
[ Input ]
[ Input ]
```

Analytics charts should support horizontal scrolling or responsive resizing when necessary.

---

# 53. Mobile Result Page

Important result information should remain above the fold:

```text
Diabetes

72%
Higher Predicted Risk

Top Factors
Glucose
BMI
Age

[ View Detailed Analysis ]
```

Don't force users to scroll through technical metrics before seeing their result.

---

# 54. Chart Guidelines

Charts should:

- have titles
- have axis labels
- include legends where necessary
- use tooltips
- remain readable on mobile
- use consistent units
- avoid decorative 3D effects

Recommended charts:

**Risk:** Gauge  
**Feature contribution:** Horizontal bar  
**Model comparison:** Bar chart  
**ROC:** Line chart  
**Class distribution:** Donut/bar  
**SHAP:** Standard SHAP summary visualization

---

# 55. Animation

Keep animations minimal.

Recommended:

- page fade/slide
- card hover
- progress animation
- chart entry animation
- button loading state

Avoid:

- excessive particles
- rotating 3D medical objects
- artificial “AI brain thinking” animations
- long splash screens

The product should feel fast.

---

# 56. Design Tokens

Create centralized frontend tokens:

```text
colors
typography
spacing
radius
shadows
breakpoints
transitions
```

This makes the UI consistent.

---

# 57. Reusable Component Library

The frontend should have:

```text
Button
Card
Input
Select
Checkbox
Badge
Alert
Modal
Tooltip
Progress
Tabs
MetricCard
RiskGauge
ChartCard
DataTable
Navbar
Footer
```

Disease-specific components:

```text
DiabetesForm
CVDForm
```

Shared components:

```text
PredictionResult
RiskGauge
ExplanationChart
MetricsCard
```

---

# 58. Design Consistency Between Diseases

The Diabetes and CVD workflows should feel like the same product.

Example:

```text
Diabetes
 └── Form
 └── Result
 └── Explanation
 └── Analytics

CVD
 └── Form
 └── Result
 └── Explanation
 └── Analytics
```

Only the clinical input fields and model-specific content should change.

---

# 59. UX State Architecture

Each major screen should support:

```text
idle
loading
success
error
empty
```

For prediction:

```text
FORM
 ↓
SUBMITTING
 ↓
ANALYZING
 ↓
RESULT
```

For API failure:

```text
SUBMITTING
 ↓
ERROR
 ↓
RETRY
```

---

# 60. Frontend Route Structure

Recommended:

```text
/
 /screening
 /screening/diabetes
 /screening/cardiovascular

 /results/:id
 /analysis/:id

 /analytics
 /analytics/dataset
 /analytics/models
 /analytics/quantum

 /about
```

---

# 61. API ↔ UI Mapping

| UI Screen | API |
|---|---|
| Disease Selection | No API required |
| Diabetes Form | `POST /predict/diabetes` |
| CVD Form | `POST /predict/cardiovascular` |
| Result | Prediction response |
| Model Info | `GET /models/{disease}` |
| Analytics | `GET /analytics/...` |
| Model Comparison | `GET /analytics/models/{disease}` |
| Quantum Benchmark | `GET /analytics/quantum/{disease}` |

---

# 62. Result Object → UI Mapping

Backend:

```text
probability
```

→ Risk Gauge

```text
risk_category
```

→ Risk Badge

```text
top_features
```

→ Feature Contribution Chart

```text
model_metrics
```

→ Metric Cards

```text
model
```

→ Model Information Card

```text
disclaimer
```

→ Disclaimer Alert

This keeps frontend logic simple.

---

# 63. Screen Hierarchy

The visual importance should generally be:

```text
1. Disease
2. Prediction
3. Risk Category
4. Why?
5. Main Contributors
6. Model Information
7. Performance
8. Technical Details
```

Not:

```text
1. Technical Model Name
2. Dataset
3. Confusion Matrix
4. Prediction
```

The user result must always come first.

---

# 64. SIH Presentation Mode

Create an optional **Demo Mode**.

A simple button:

```text
[ Demo Mode ]
```

could populate controlled demonstration data.

This allows the team to show:

```text
Input
 ↓
Prediction
 ↓
Explainability
 ↓
Model Comparison
```

quickly during judging.

The demo data must be clearly labelled as demonstration/test data.

---

# 65. Recommended SIH Demo Flow

The ideal presentation sequence:

```text
HOME
  ↓
START SCREENING
  ↓
DIABETES
  ↓
ENTER DEMO DATA
  ↓
ANALYZE
  ↓
72% HIGHER PREDICTED RISK
  ↓
“WHY DID THE MODEL SAY THIS?”
  ↓
SHAP EXPLANATION
  ↓
MODEL PERFORMANCE
  ↓
CLASSICAL VS QUANTUM
  ↓
RESPONSIBLE AI
```

This creates a strong narrative instead of simply clicking through pages.

---

# 66. UI/UX Acceptance Criteria

The UI is considered complete when:

### Navigation

- all major screens are reachable
- active page is clearly indicated
- mobile navigation works

### Forms

- every field is labelled
- validation works
- errors are understandable
- mobile form works

### Prediction

- result appears clearly
- probability is visible
- risk category is visible
- model is identified

### Explainability

- feature contributions are visible
- explanation is understandable
- SHAP visualization works

### Analytics

- metrics are displayed
- model comparison works
- charts are responsive

### Responsible AI

- disclaimer is visible
- no unsupported diagnosis claims are made

---

# 67. Final UX Architecture

```text
                           DIAGNOTECH
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                USER                       JUDGE
                 │                           │
                 ▼                           ▼
             HOME PAGE                 DEMO MODE
                 │                           │
                 └─────────────┬─────────────┘
                               ▼
                       DISEASE SELECTION
                         │             │
                         ▼             ▼
                     DIABETES         CVD
                         │             │
                         └──────┬──────┘
                                ▼
                           INPUT FORM
                                │
                                ▼
                             ANALYZE
                                │
                                ▼
                         PREDICTION RESULT
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
                  RISK        WHY?       METRICS
                    │           │           │
                    │           ▼           │
                    │      EXPLAINABILITY   │
                    │           │           │
                    └───────────┼───────────┘
                                ▼
                       DETAILED ANALYSIS
                                │
                   ┌────────────┴────────────┐
                   ▼                         ▼
             MODEL COMPARISON          QUANTUM BENCHMARK
                   │                         │
                   └────────────┬────────────┘
                                ▼
                         RESPONSIBLE AI
```

# 68. Final Design Direction

The final interface should communicate this story visually:

> **“Enter relevant data → let the AI analyze it → see the risk → understand why → inspect the evidence → make an informed decision with professional guidance.”**

The strongest visual element should therefore **not** be the AI/quantum technology itself.

The strongest visual element should be the **transparent journey from input to prediction to explanation**.

That is what makes Diagnotech feel like a complete product rather than a machine-learning model wrapped in a website.
:::

---

If you want, I can:

- Specify detailed UI components for the Diabetes form
- Outline the mobile and desktop result page layouts
- Create a sequence of UI states from form input to result display

disablePrefetch

shouldPrefetchAccount

shouldPrefetchUser

shouldPrefetchSystemHints

manageRootRouteStylesheet

mobileWebHandoffEnabled

stripModulepreloadImports

paidCampaignAppRedirect

statsigGateEvaluationsPromise

7328161320806816460