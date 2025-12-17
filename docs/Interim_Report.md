# Final Year Project Interim Report

**Student:** Emma Myo Nyunt  
**Course:** LM121 Computer Systems  
**Supervisor:** Dr. Lilian Motti Ader  
**Project Title:** Mental Health Tracker Web App (MoodGarden)  
**Date:** December 2024

---

## 1. Introduction

### 1.1 Project Overview

For my Final Year Project, I am developing **MoodGarden**, a comprehensive mental health tracking web application designed specifically for students and young adults. The application serves as a digital wellbeing tool that enables users to monitor various aspects of their mental health through mood tracking, journaling, stress monitoring, sleep analysis, and appetite logging. Importantly, the app is not intended to replace professional mental health services, but rather to promote emotional awareness and self-reflection among its users.

The project addresses a critical gap in the current digital mental health landscape. While numerous mobile applications exist in this domain—such as Daylio, Moodpath, Sanvello, and Headspace—they often present significant barriers including subscription fees, mobile-only access, and oversimplified emotional representation. MoodGarden seeks to overcome these limitations by providing a free, accessible, desktop-friendly web application that offers nuanced emotional tracking through the arousal-valence model and comprehensive data visualisation.

### 1.2 Motivation

The motivation for this project stems from several interconnected factors. First, the increasing prevalence of mental health challenges among university students has been well-documented, with academic pressures, social isolation, and burnout contributing to rising stress levels. Second, during my initial research phase, I identified that existing solutions often fail to capture the complexity of human emotions, reducing feelings to simple categories like "happy" or "sad" without acknowledging the multifaceted nature of emotional experiences.

Additionally, the COVID-19 pandemic has highlighted the importance of accessible mental health resources, particularly for students who may face financial barriers to traditional therapy or counselling services. By creating a free, web-based tool that can be accessed from any device, MoodGarden aims to democratise access to mental health tracking and self-reflection tools.

### 1.3 Project Goals and Objectives

The primary objectives of this project are:

1. **Technical Implementation:**
   - Design and develop a responsive web application using modern web technologies (React, TypeScript, Tailwind CSS)
   - Implement a comprehensive tracking system for mood, stress, sleep, appetite, and journal entries
   - Create an intuitive dashboard with data visualisation using Chart.js/Recharts
   - Develop an anonymous, pet-based user identification system to ensure privacy
   - Integrate an AI-powered chatbot for general mental health support (with optional OpenAI API integration)

2. **Emotional Representation:**
   - Explore and implement the arousal-valence model for representing complex emotional states
   - Allow users to select up to two emotions per entry to capture mixed emotional experiences
   - Provide a library of 20+ emotions mapped to the arousal-valence framework

3. **User Experience:**
   - Conduct user studies to inform design decisions and usability improvements
   - Ensure accessibility across desktop and mobile devices
   - Implement dark mode and theme customisation options
   - Create a visually appealing, garden-themed interface that promotes a sense of calm and wellbeing

4. **Research Contribution:**
   - Investigate how digital tools can raise emotional awareness among students
   - Evaluate the effectiveness of the arousal-valence model in user-facing applications
   - Contribute to the understanding of user preferences in mental health tracking interfaces

### 1.4 Deliverables

The project deliverables will include:

- A fully functional web application prototype (MoodGarden)
- A comprehensive written report documenting the development process, user studies, and findings
- Supporting documentation including ethics materials, participant consent forms, and user study protocols
- Source code repository on GitHub with proper documentation
- User study results and analysis
- Presentation materials for project demonstration

---

## 2. Background and Literature Review

### 2.1 Existing Mental Health Applications

My initial research involved a comprehensive review of existing mental health tracking applications to identify their strengths, limitations, and opportunities for improvement. I examined several prominent applications:

**Daylio:** A popular mood tracking app that allows users to log daily activities and moods. While user-friendly, it primarily uses a simple mood scale (1-5) and requires a subscription for advanced features. The mobile-only interface limits accessibility for users who prefer desktop environments.

**Moodpath:** Focuses on depression and anxiety screening with mood tracking. However, it requires payment for full functionality and lacks the nuanced emotional representation that would allow users to express complex emotional states.

**Sanvello:** A comprehensive mental health app offering mood tracking, guided meditations, and cognitive behavioural therapy (CBT) tools. While feature-rich, it operates on a subscription model and is primarily mobile-focused.

**Headspace:** Primarily a meditation app with limited mood tracking capabilities. The subscription barrier and focus on mindfulness rather than comprehensive tracking make it less suitable for users seeking detailed emotional awareness tools.

**Finch:** A gamified self-care app with a virtual pet companion. While engaging, it simplifies emotional tracking and requires in-app purchases for premium features.

**Mental Health Journal:** A basic journaling app with minimal tracking features and limited visualisation capabilities.

Through this analysis, I identified several common limitations:

1. **Financial Barriers:** Most applications require subscriptions or in-app purchases for full functionality, limiting access for students with limited budgets.
2. **Platform Limitations:** The majority of apps are mobile-only, excluding users who prefer desktop interfaces or need cross-platform accessibility.
3. **Oversimplified Emotions:** Most apps reduce complex emotional experiences to single categories (e.g., "happy," "sad," "anxious"), failing to capture the nuanced and often mixed nature of human emotions.
4. **Limited Visualisation:** Many apps provide basic charts but lack comprehensive analytics and trend analysis.
5. **Privacy Concerns:** Some apps require account creation and cloud storage, raising privacy concerns for sensitive mental health data.

### 2.2 Academic Literature

My literature review focused on three key areas: emotional representation models, digital mental health interventions, and user-centred design in health applications.

**The Arousal-Valence Model:** The arousal-valence model, developed by Russell (1980) and expanded by others, provides a two-dimensional framework for representing emotions. The model maps emotions along two axes:
- **Valence:** The pleasantness dimension, ranging from negative (-2) to positive (+2)
- **Arousal:** The activation/energy dimension, ranging from low (1) to high (5)

This model allows for the representation of complex emotional states that cannot be captured by simple categorical systems. For example, "anxious" (negative valence, high arousal) is distinct from "sad" (negative valence, low arousal), and "excited" (positive valence, high arousal) differs from "calm" (positive valence, low arousal). Research by Posner et al. (2005) and others has demonstrated the validity and utility of this model in both research and applied settings.

**Digital Mental Health Interventions:** Studies by Mohr et al. (2013) and Firth et al. (2017) have shown that digital mental health tools can be effective in supporting wellbeing, particularly when they incorporate self-monitoring, personalised feedback, and evidence-based techniques. However, engagement remains a challenge, with many users abandoning apps after initial use. This highlights the importance of user-centred design and intuitive interfaces.

**Emotional Awareness and Self-Reflection:** Research by Salovey and Mayer (1990) on emotional intelligence suggests that regular self-reflection and emotional awareness can contribute to improved mental wellbeing. Digital tools that facilitate this process through structured logging and visualisation can support users in developing greater emotional literacy.

**Privacy and Data Security:** Given the sensitive nature of mental health data, privacy is paramount. Studies by Torous et al. (2018) emphasise the importance of local data storage and transparent privacy policies in mental health applications. This informed my decision to implement local storage (localStorage) rather than cloud-based solutions, ensuring user data remains on their device.

### 2.3 Research Gaps and Opportunities

Based on my review of existing applications and academic literature, I identified several research gaps and opportunities:

1. **Nuanced Emotional Representation:** While the arousal-valence model is well-established in research, it has not been widely implemented in user-facing mental health applications. MoodGarden addresses this gap by providing an intuitive interface for selecting emotions based on this model.

2. **Mixed Emotions:** Most applications force users to select a single emotion, despite research showing that people often experience multiple emotions simultaneously. MoodGarden allows users to select up to two emotions per entry, better reflecting the complexity of human emotional experience.

3. **Free and Accessible Tools:** There is a need for comprehensive, free mental health tracking tools that do not require subscriptions or in-app purchases. MoodGarden fills this gap by providing full functionality without financial barriers.

4. **Desktop-Friendly Mental Health Apps:** The mental health app market is dominated by mobile applications. MoodGarden's web-based approach ensures accessibility across all devices, including desktops and laptops.

5. **Anonymous User Experience:** Many apps require account creation, which can be a barrier for users concerned about privacy. MoodGarden's pet-based anonymous system allows users to engage without creating accounts or providing personal information.

---

## 3. Methodology

### 3.1 Development Approach

I am employing an **iterative, user-centred design process** that combines agile development principles with user feedback loops. This approach allows for continuous refinement based on testing and user input.

**Technology Stack:**

The application is built using modern web technologies:

- **Frontend Framework:** React 18 with TypeScript for type safety and improved developer experience
- **Build Tool:** Vite for fast development and optimised production builds
- **Styling:** Tailwind CSS for utility-first styling with custom design system
- **Routing:** React Router v6 for single-page application navigation
- **Data Visualisation:** Recharts for interactive charts and graphs
- **Date Utilities:** date-fns for date manipulation and formatting
- **Icons:** Lucide React for consistent iconography
- **State Management:** React Context API for global state (theme, pet preferences)
- **Data Persistence:** Browser localStorage for client-side data storage

**Development Environment:**

- **Version Control:** GitHub for source code management and collaboration
- **Development Server:** Vite dev server with hot module replacement
- **Code Quality:** TypeScript for static type checking, ESLint for code linting
- **Deployment:** Planned deployment via Vercel, Netlify, or similar platform

**Architecture:**

The application follows a component-based architecture with clear separation of concerns:

- **Components:** Modular React components for each feature (MoodTracker, Journal, Dashboard, etc.)
- **Contexts:** Global state management for theme and pet preferences
- **Types:** TypeScript interfaces and types for type safety
- **Utils:** Utility functions for emotion mapping and data processing
- **Routes:** React Router configuration for navigation

### 3.2 Key Features Implementation

**1. Mood Tracking with Arousal-Valence Model:**

The mood tracking system implements the arousal-valence model with 20+ emotions organised into five categories:
- **Yellow (High Energy Positive):** Elated, Excited, Energetic, Happy, Joyful, Cheerful
- **Red (High Energy Negative):** Panicked, Angry, Anxious, Stressed, Frustrated, Worried, Irritated
- **Green (Low Energy Positive):** Peaceful, Serene, Content, Calm, Relaxed, Satisfied
- **Blue (Low Energy Negative):** Depressed, Empty, Sad, Tired, Melancholy, Lonely, Exhausted
- **Gray (Neutral):** Neutral, Indifferent, Alert, Bored

Users can select up to two emotions per entry, allowing for the representation of mixed emotional states. Each emotion is mapped to specific valence (-2 to +2) and arousal (1 to 5) values, enabling quantitative analysis while maintaining intuitive user experience.

**2. Comprehensive Tracking Modules:**

- **Mood Tracker:** Calendar-based interface with emotion selection and notes
- **Stress Tracker:** 5-point stress scale with trigger identification and notes
- **Sleep Tracker:** Hours, quality rating (1-5), bedtime, wake time, and notes
- **Appetite Tracker:** Water intake logging and meal tracking with ratings
- **Journal:** Free-form journal entries with titles, content, and optional mood tags
- **Todo List:** Task management with importance levels (low, medium, high)

**3. Dashboard and Visualisation:**

The dashboard provides:
- Today's overview cards for mood, stress, sleep, and appetite
- Weekly calendar view showing all tracked data
- Statistics cards (total entries, average mood, etc.)
- Recent journal entries preview

The Insights page includes:
- 30-day mood trend line chart
- Weekly mood distribution bar chart
- Mood distribution analysis
- Current streak tracking
- Arousal-valence scatter plot for emotional mapping

**4. AI Mental Health Chatbot:**

An integrated chatbot provides general mental health support with two modes:
- **Rule-based Mode:** Pre-programmed responses for common queries (default, no API key required)
- **OpenAI Mode:** Enhanced responses using GPT-3.5-turbo when users optionally provide their API key

The chatbot includes appropriate disclaimers about not replacing professional help and references to HSE (Health Service Executive) resources.

**5. Anonymous Pet-Based System:**

To ensure privacy and eliminate barriers to entry, users select a pet companion (cat or dog) and name it. All data is stored locally using keys based on the pet's type and name, creating isolated data spaces without requiring account creation.

**6. Theme and Customisation:**

- Light and dark mode support
- Garden-themed colour palette (lavender, mint, peach, cream)
- Smooth animations and transitions
- Responsive design for all screen sizes

### 3.3 User Studies Methodology

**Phase 1: Early Prototype Testing (Current Phase)**

The first phase of user testing focuses on:
- **Usability Testing:** Participants complete tasks such as logging a mood entry, writing a journal entry, and navigating the dashboard
- **Interface Evaluation:** Feedback on layout, colour scheme, navigation, and overall user experience
- **Feature Assessment:** Evaluation of core features including emotion selection, calendar interface, and data visualisation
- **Accessibility Testing:** Assessment of responsiveness across devices and accessibility for users with different needs

**Participant Recruitment:**
- Target: 5-8 participants (students and young adults aged 18-25)
- Recruitment through university networks and social media
- Sessions lasting 30-45 minutes
- Tasks include:
  1. Setting up the app (pet selection)
  2. Logging a mood entry with two emotions
  3. Creating a journal entry
  4. Logging stress, sleep, and appetite data
  5. Exploring the dashboard and insights
  6. Using the AI chatbot
  7. Providing feedback via questionnaire and discussion

**Phase 2: Co-Design Workshop (Planned)**

A co-design workshop will be conducted to:
- Refine emotional visualisation methods
- Gather input on desired features and improvements
- Explore alternative interface designs
- Discuss the effectiveness of the arousal-valence model implementation

**Phase 3: Final Prototype Testing (Planned)**

Comprehensive testing of the final prototype with:
- Extended use over 1-2 weeks
- Evaluation of engagement and retention
- Assessment of emotional awareness outcomes
- Final usability and satisfaction surveys

### 3.4 Ethical Considerations

Ethics approval has been obtained for user studies involving human participants. Key ethical considerations include:

**Informed Consent:**
- Detailed information sheets explaining the project, data usage, and participant rights
- Consent forms ensuring voluntary participation and right to withdraw
- Clear explanation that the app is for research purposes and not a clinical tool

**Privacy and Confidentiality:**
- All data stored locally on participants' devices (no cloud storage)
- No personal identifiers collected
- Anonymous participation through pet-based system
- Audio recordings (if taken during feedback sessions) will be securely destroyed after transcription

**Data Security:**
- No sensitive data transmitted to external servers (except optional OpenAI API calls, which use participants' own API keys)
- Local storage encryption considerations for future iterations
- Clear privacy policy explaining data handling

**Participant Welfare:**
- Clear disclaimers that the app is not a replacement for professional mental health support
- Information about accessing professional help (HSE resources, crisis helplines)
- Support resources provided in the app and information sheets

---

## 4. Progress to Date

### 4.1 Project Initiation and Planning

**Proposal Development:**
- Completed and submitted project proposal form
- Received supervisor approval (Dr. Lilian Motti Ader)
- Defined project scope, objectives, and deliverables
- Established initial timeline and milestones

**Background Research:**
- Conducted comprehensive review of existing mental health applications
- Analysed academic literature on emotional representation models, digital mental health interventions, and user-centred design
- Identified research gaps and opportunities
- Documented findings in project notes and literature review

### 4.2 Ethics and Documentation

**Ethics Materials:**
- Drafted participant information sheet explaining the project, procedures, and participant rights
- Created consent forms ensuring informed and voluntary participation
- Prepared ethics application materials
- Received ethics approval for Phase 1 user testing

**Project Documentation:**
- Established GitHub repository: https://github.com/EmmaMyoNyunt/Mental-Health-Tracker
- Created README with project overview, features, and setup instructions
- Documented technical architecture and component structure
- Maintained meeting notes and development logs

### 4.3 Technical Development

**Core Application Structure:**
- Set up React + TypeScript project with Vite
- Configured Tailwind CSS with custom design system
- Implemented React Router for navigation
- Created component architecture with modular design
- Set up Context API for global state management (ThemeContext, PetContext)

**Implemented Features:**

1. **Pet Selection System:**
   - Pet type selection (cat/dog)
   - Pet naming interface
   - Local storage integration with pet-based keys
   - Pet context for app-wide state management

2. **Mood Tracking:**
   - Calendar-based interface with month navigation
   - Arousal-valence emotion model with 20+ emotions
   - Dual emotion selection (up to 2 emotions per entry)
   - Emotion categorisation by colour (yellow, red, green, blue, gray)
   - Notes field for additional context
   - Backward compatibility with legacy mood scale (1-5)

3. **Stress Tracking:**
   - 5-point stress level scale
   - Trigger identification (comma-separated)
   - Notes field
   - Calendar view with stress level indicators

4. **Sleep Tracking:**
   - Hours of sleep input
   - Quality rating (1-5 scale)
   - Bedtime and wake time logging
   - Notes field
   - Calendar integration

5. **Appetite Tracking:**
   - Water intake logging (glasses/cups)
   - Meal tracking with type (breakfast, lunch, dinner, snack)
   - Meal rating (optional 1-5 scale)
   - Notes field

6. **Journal:**
   - Title and content fields
   - Optional mood association
   - Date-based organisation
   - Edit and delete functionality
   - Recent entries preview on dashboard

7. **Dashboard:**
   - Statistics cards (mood entries, stress entries, journal entries, average mood)
   - Today's overview for mood, stress, sleep, and appetite
   - Weekly calendar view with all tracked data
   - Recent journal entries section
   - Responsive grid layout

8. **Insights/Analytics:**
   - 30-day mood trend line chart
   - Weekly mood distribution bar chart
   - Mood distribution analysis
   - Current streak tracking
   - Arousal-valence scatter plot (planned)
   - Average mood calculation

9. **Calendar View:**
   - Monthly and weekly view options
   - Filter by data type (mood, stress, sleep, appetite)
   - Visual indicators for tracked data
   - Date navigation

10. **Todo List:**
    - Task creation with title and description
    - Importance levels (low, medium, high)
    - Completion tracking
    - Creation and completion timestamps

11. **AI Chatbot:**
    - Floating chat interface
    - Rule-based fallback responses
    - Optional OpenAI API integration
    - Mental health disclaimers and HSE resource references
    - Message history and scrolling

12. **Mindful Tips:**
    - Personalized recommendations based on tracked data
    - Context-aware suggestions
    - Integration with mood, stress, sleep, and appetite data

13. **Settings:**
    - Theme toggle (light/dark mode)
    - OpenAI API key configuration (optional)
    - Pet information display
    - Data management options

14. **UI/UX Features:**
    - Garden-themed design with soft colour palette
    - Smooth animations and transitions
    - Glass-morphism effects
    - Responsive design for mobile, tablet, and desktop
    - Dark mode support
    - Accessible navigation with sidebar

**Data Management:**
- Local storage implementation with pet-based keys
- Automatic data persistence on state changes
- Data loading on app initialisation
- Error handling for corrupted data
- Backward compatibility for data migration

### 4.4 Testing and Quality Assurance

**Development Testing:**
- Manual testing of all features
- Cross-browser compatibility testing (Chrome, Firefox, Safari, Edge)
- Responsive design testing across device sizes
- Local storage functionality verification
- Error handling and edge case testing

**Code Quality:**
- TypeScript type checking
- ESLint configuration and code linting
- Component modularity and reusability
- Consistent code formatting
- Commented code for complex logic

### 4.5 Presentation and Communication

**Week 8/9 Presentation:**
- Delivered project presentation outlining:
  - Project motivation and objectives
  - Background research findings
  - Technical approach and architecture
  - Progress to date
  - Planned timeline and next steps
- Received feedback from supervisor and peers
- Incorporated suggestions into development plan

**Supervisor Meetings:**
- Regular meetings with Dr. Lilian Motti Ader
- Progress updates and discussion of challenges
- Guidance on user study design and ethics
- Technical advice and architecture review

### 4.6 Current Status

**Completed:**
- ✅ Project proposal and approval
- ✅ Background research and literature review
- ✅ Ethics materials and approval
- ✅ Core application architecture
- ✅ All major tracking features (mood, stress, sleep, appetite, journal)
- ✅ Dashboard and insights visualisation
- ✅ AI chatbot implementation
- ✅ Theme system and UI/UX polish
- ✅ Local storage and data persistence
- ✅ Responsive design implementation
- ✅ GitHub repository setup and documentation

**In Progress:**
- 🔄 User study preparation (Phase 1)
- 🔄 Final UI/UX refinements based on self-testing
- 🔄 Additional visualisation features (arousal-valence scatter plot)

**Planned:**
- ⏳ Phase 1 user testing (5-8 participants)
- ⏳ User feedback integration
- ⏳ Co-design workshop (Phase 2)
- ⏳ Final prototype development
- ⏳ Phase 3 extended user testing
- ⏳ Final report writing
- ⏳ Project demonstration

---

## 5. Timeline and Constraints

### 5.1 Project Timeline

**October 2024:**
- ✅ Project proposal development and submission
- ✅ Initial background research
- ✅ Supervisor meetings and project planning
- ✅ Ethics application preparation

**November 2024:**
- ✅ Literature review completion
- ✅ Ethics approval obtained
- ✅ Technology stack selection and setup
- ✅ Initial prototype development
- ✅ Core features implementation
- ✅ Week 8/9 presentation

**December 2024:**
- ✅ Feature completion (mood, stress, sleep, appetite, journal, dashboard, insights)
- ✅ UI/UX refinement
- ✅ Testing and bug fixes
- 🔄 Phase 1 user study preparation
- 🔄 Begin Phase 1 user testing

**January 2025:**
- ⏳ Complete Phase 1 user testing
- ⏳ Analyse user feedback
- ⏳ Implement improvements based on feedback
- ⏳ Co-design workshop (Phase 2)
- ⏳ Continue feature development and refinement

**February 2025:**
- ⏳ Final prototype development
- ⏳ Phase 3 extended user testing
- ⏳ Data analysis and evaluation
- ⏳ Report writing (initial draft)

**March 2025:**
- ⏳ Finalise web application
- ⏳ Complete user study analysis
- ⏳ Project demonstration preparation
- ⏳ Report finalisation

**April-May 2025:**
- ⏳ Final report submission
- ⏳ Project presentation
- ⏳ Project completion

### 5.2 Constraints and Challenges

**Time Constraints:**
- Limited time for user testing phases, requiring efficient recruitment and session scheduling
- Balancing development work with user study coordination and analysis
- Academic deadlines for interim and final reports
- Need to complete development while allowing time for iterative improvements based on feedback

**Technical Challenges:**
- **Data Migration:** Ensuring backward compatibility as features evolve and data structures change
- **Performance:** Optimising local storage operations and rendering performance with large datasets
- **Cross-Browser Compatibility:** Ensuring consistent functionality across different browsers and devices
- **Type Safety:** Maintaining TypeScript type safety while allowing flexible data structures

**User Study Challenges:**
- **Recruitment:** Finding willing participants for user studies, particularly during busy academic periods
- **Scheduling:** Coordinating sessions that fit both participant and researcher availability
- **Data Collection:** Balancing comprehensive feedback collection with session time constraints
- **Ethics Compliance:** Ensuring all procedures adhere to ethical guidelines while maintaining research rigour

**Design Challenges:**
- **Emotional Representation:** Making the arousal-valence model intuitive for users unfamiliar with the framework
- **Information Architecture:** Organising numerous features (mood, stress, sleep, appetite, journal, insights, etc.) in a way that feels cohesive and not overwhelming
- **Visual Design:** Creating an interface that feels supportive and calming while remaining functional and informative
- **Accessibility:** Ensuring the app is usable by people with different abilities and preferences

**Scope Management:**
- Balancing feature richness with development time constraints
- Prioritising core features while leaving room for enhancements
- Managing expectations for what can be achieved within the project timeline

### 5.3 Risk Management

**Technical Risks:**
- **Browser Compatibility Issues:** Mitigated through early cross-browser testing and using well-supported web standards
- **Performance Degradation:** Addressed through code optimisation, efficient state management, and performance monitoring
- **Data Loss:** Prevented through robust local storage implementation and error handling

**User Study Risks:**
- **Low Participation:** Mitigated through multiple recruitment channels and flexible scheduling
- **Incomplete Feedback:** Addressed through structured questionnaires and follow-up discussions
- **Technical Issues During Sessions:** Prepared with backup devices and alternative testing methods

**Project Risks:**
- **Scope Creep:** Managed through clear feature prioritisation and regular supervisor check-ins
- **Timeline Delays:** Addressed through buffer time in schedule and flexible milestone adjustments
- **Technical Blockers:** Mitigated through early research, proof-of-concept development, and supervisor consultation

---

## 6. Conclusions

### 6.1 Progress Summary

At this interim stage, I have made substantial progress on the MoodGarden mental health tracking application. The project has successfully moved from initial concept through research and planning phases into active development, with a functional prototype that demonstrates all core features. The application now provides a comprehensive tracking system for mood (using the arousal-valence model), stress, sleep, appetite, and journal entries, along with visualisation dashboards and an AI chatbot for support.

The technical implementation has been successful, with a modern, responsive web application built using React, TypeScript, and Tailwind CSS. The architecture is modular and maintainable, with clear separation of concerns and type safety throughout. The pet-based anonymous system ensures user privacy while eliminating barriers to entry, and local storage implementation keeps all sensitive data on users' devices.

From a research perspective, I have completed a thorough review of existing applications and academic literature, identifying clear gaps in the market and opportunities for innovation. The implementation of the arousal-valence model with dual emotion selection addresses the limitation of oversimplified emotional representation in existing apps, while the free, web-based approach removes financial and platform barriers.

### 6.2 Key Achievements

1. **Technical Implementation:** Successfully developed a fully functional web application with 10+ major features, demonstrating proficiency in modern web development technologies and best practices.

2. **Innovation:** Implemented the arousal-valence emotional model in an accessible, user-friendly interface, allowing for nuanced emotional representation that goes beyond simple mood scales.

3. **User-Centred Design:** Created an intuitive, visually appealing interface with garden-themed aesthetics that promotes a sense of calm and wellbeing, while maintaining functionality and information clarity.

4. **Privacy-First Approach:** Designed an anonymous system that eliminates the need for account creation while ensuring data privacy through local storage.

5. **Comprehensive Feature Set:** Developed a holistic tracking system that addresses multiple aspects of mental health (mood, stress, sleep, appetite, journaling) in a single, cohesive application.

6. **Research Foundation:** Established a solid research foundation through literature review and gap analysis, positioning the project within the broader context of digital mental health interventions.

### 6.3 Challenges and Learning

The development process has presented several valuable learning opportunities. Working with the arousal-valence model required careful consideration of how to make a research framework accessible to end users, leading to the development of colour-coded emotion categories and intuitive selection interfaces. Managing state in a complex React application with multiple interconnected features has improved my understanding of state management patterns and component architecture.

The process of designing for mental health applications has also highlighted the importance of considering the emotional impact of design choices, from colour palettes to interaction patterns. This has deepened my appreciation for user-centred design and the responsibility that comes with creating tools that people will use during vulnerable moments.

### 6.4 Next Steps

The immediate next steps involve:

1. **Phase 1 User Testing:** Conducting usability testing with 5-8 participants to gather feedback on the current prototype, focusing on interface usability, feature effectiveness, and overall user experience.

2. **Feedback Integration:** Analysing user study results and implementing improvements based on participant feedback, prioritising changes that enhance usability and emotional awareness outcomes.

3. **Feature Refinement:** Completing planned features such as the arousal-valence scatter plot visualisation and any additional insights that emerge from user testing.

4. **Co-Design Workshop:** Organising and conducting Phase 2 co-design workshop to gather deeper insights into user needs and preferences, particularly around emotional visualisation methods.

5. **Extended Testing:** Planning and executing Phase 3 extended user testing to evaluate engagement, retention, and longer-term outcomes.

6. **Report Development:** Beginning work on the final project report, documenting the development process, user study findings, and project outcomes.

### 6.5 Reflection

This project has been both challenging and rewarding. Developing a mental health application requires careful consideration of user needs, privacy, and the sensitive nature of the data being handled. The iterative development process has allowed me to refine the application based on my own testing and will be further enhanced through user feedback.

The integration of research (arousal-valence model) with practical application (user-friendly interface) has been particularly interesting, requiring creative solutions to make academic concepts accessible to end users. The project has also reinforced the importance of user-centred design, particularly in applications that deal with sensitive personal information.

I am confident that the project is on track to deliver a meaningful contribution to the digital mental health space, providing a free, accessible tool that promotes emotional awareness and self-reflection among students and young adults. The combination of comprehensive tracking, nuanced emotional representation, and thoughtful design positions MoodGarden as a valuable alternative to existing subscription-based and oversimplified solutions.

As I move into the user testing phases, I look forward to gathering real-world feedback that will inform further improvements and validate the design decisions made thus far. The project remains on schedule, and I am optimistic about completing all deliverables within the established timeline.

---

## Appendices

### Appendix A: Screenshots

*[Screenshots of the current prototype would be included here, showing:]*
- Homepage/Dashboard view
- Mood Tracker with emotion selection
- Journal interface
- Insights/Analytics page
- Calendar view
- AI Chatbot interface
- Settings page

### Appendix B: Ethics Materials

*[Draft Information Sheet and Consent Form would be included here]*

### Appendix C: Feature Comparison Table

| Feature | MoodGarden | Daylio | Moodpath | Sanvello | Headspace |
|---------|-----------|--------|----------|----------|-----------|
| Free Access | ✅ Yes | ❌ Subscription | ❌ Subscription | ❌ Subscription | ❌ Subscription |
| Web/Desktop | ✅ Yes | ❌ Mobile Only | ❌ Mobile Only | ❌ Mobile Only | ❌ Mobile Only |
| Arousal-Valence Model | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| Multiple Emotions | ✅ Up to 2 | ❌ Single | ❌ Single | ❌ Single | ❌ Limited |
| Stress Tracking | ✅ Yes | ⚠️ Limited | ✅ Yes | ✅ Yes | ❌ No |
| Sleep Tracking | ✅ Yes | ⚠️ Limited | ❌ No | ✅ Yes | ❌ No |
| Appetite Tracking | ✅ Yes | ⚠️ Limited | ❌ No | ❌ No | ❌ No |
| Journal | ✅ Yes | ⚠️ Limited | ✅ Yes | ✅ Yes | ❌ No |
| Data Visualisation | ✅ Comprehensive | ⚠️ Basic | ⚠️ Basic | ✅ Yes | ❌ No |
| AI Chatbot | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| Anonymous/No Account | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| Local Storage | ✅ Yes | ❌ Cloud | ❌ Cloud | ❌ Cloud | ❌ Cloud |

### Appendix D: Technology Stack Details

**Core Technologies:**
- React 18.2.0
- TypeScript 5.2.2
- Vite 5.0.8
- Tailwind CSS 3.3.6

**Key Dependencies:**
- react-router-dom 6.20.0 (routing)
- recharts 2.10.3 (data visualisation)
- date-fns 2.30.0 (date utilities)
- lucide-react 0.294.0 (icons)

**Development Tools:**
- ESLint (code linting)
- TypeScript ESLint (type checking)
- PostCSS & Autoprefixer (CSS processing)

### Appendix E: GitHub Repository

**Repository:** https://github.com/EmmaMyoNyunt/Mental-Health-Tracker

**Key Files:**
- `src/App.tsx` - Main application component
- `src/components/` - Feature components
- `src/contexts/` - Global state management
- `src/types.ts` - TypeScript type definitions
- `src/utils/emotions.ts` - Arousal-valence emotion model implementation

### Appendix F: Emotion Model Implementation

The arousal-valence model implementation includes 20+ emotions mapped to specific valence and arousal values:

**High Energy Positive (Yellow):**
- Elated (valence: 2, arousal: 5)
- Excited (valence: 2, arousal: 4)
- Energetic (valence: 1, arousal: 5)
- Happy (valence: 1, arousal: 4)
- Joyful (valence: 2, arousal: 3)
- Cheerful (valence: 1, arousal: 3)

**High Energy Negative (Red):**
- Panicked (valence: -2, arousal: 5)
- Angry (valence: -2, arousal: 4)
- Anxious (valence: -1, arousal: 5)
- Stressed (valence: -1, arousal: 4)
- Frustrated (valence: -2, arousal: 3)
- Worried (valence: -1, arousal: 3)
- Irritated (valence: -2, arousal: 2)

**Low Energy Positive (Green):**
- Peaceful (valence: 2, arousal: 2)
- Serene (valence: 2, arousal: 1)
- Content (valence: 1, arousal: 2)
- Calm (valence: 1, arousal: 1)
- Relaxed (valence: 2, arousal: 3)
- Satisfied (valence: 1, arousal: 3)

**Low Energy Negative (Blue):**
- Depressed (valence: -2, arousal: 2)
- Empty (valence: -2, arousal: 1)
- Sad (valence: -1, arousal: 2)
- Tired (valence: -1, arousal: 1)
- Melancholy (valence: -2, arousal: 3)
- Lonely (valence: -1, arousal: 3)
- Exhausted (valence: -1, arousal: 1)

**Neutral (Gray):**
- Neutral (valence: 0, arousal: 3)
- Indifferent (valence: 0, arousal: 2)
- Alert (valence: 0, arousal: 4)
- Bored (valence: 0, arousal: 1)

---

**Word Count:** Approximately 6,500 words

**References:**
- Firth, J., et al. (2017). The efficacy of smartphone-based mental health interventions for depressive symptoms: a meta-analysis of randomized controlled trials. World Psychiatry, 16(3), 287-298.
- Mohr, D. C., et al. (2013). The behavioral intervention technology model: an integrated conceptual and technological framework for eHealth and mHealth interventions. Journal of Medical Internet Research, 15(6), e146.
- Posner, J., et al. (2005). The circumplex model of affect: An integrative approach to affective neuroscience, cognitive development, and psychopathology. Development and Psychopathology, 17(3), 715-734.
- Russell, J. A. (1980). A circumplex model of affect. Journal of Personality and Social Psychology, 39(6), 1161-1178.
- Salovey, P., & Mayer, J. D. (1990). Emotional intelligence. Imagination, Cognition and Personality, 9(3), 185-211.
- Torous, J., et al. (2018). The growing field of digital psychiatry: current evidence and the future of apps, social media, chatbots, and virtual reality. World Psychiatry, 17(3), 276-290.

