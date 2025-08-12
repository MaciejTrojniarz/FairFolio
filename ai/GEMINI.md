# AI Rules for {{project-name}}

{{project-description}}

## CODING_PRACTICES

### Guidelines for SUPPORT_LEVEL

#### SUPPORT_EXPERT

- Favor elegant, maintainable solutions over verbose code. Assume understanding of language idioms and design patterns.
- Highlight potential performance implications and optimization opportunities in suggested code.
- Frame solutions within broader architectural contexts and suggest design alternatives when appropriate.
- Focus comments on 'why' not 'what' - assume code readability through well-named functions and variables.
- Proactively address edge cases, race conditions, and security considerations without being prompted.
- When debugging, provide targeted diagnostic approaches rather than shotgun solutions.
- Suggest comprehensive testing strategies rather than just example tests, including considerations for mocking, test organization, and coverage.


### Guidelines for DOCUMENTATION

#### DOC_UPDATES

- Update relevant documentation in /docs when modifying features
- Keep README.md in sync with new capabilities
- Maintain changelog entries in CHANGELOG.md

#### JSDOC

- Document all functions, classes, and methods with consistent JSDoc comments
- Use @param, @returns, and @throws tags to document function behavior comprehensively
- Implement @example tags with realistic usage scenarios for {{complex_apis}}
- Use @typedef for documenting complex object structures when not using TypeScript
- Configure documentation generation as part of the build process to keep docs current
- Implement custom templates to match {{project_style_guidelines}}

#### TYPEDOC

- Use JSDoc-style comments with TypeScript-specific annotations for all public APIs
- Configure custom themes to match {{project_branding}} for consistent documentation
- Group related functionality using @module and @category tags for better organization
- Document edge cases and error handling for {{critical_functions}}
- Generate and publish documentation as part of the CI/CD pipeline to keep it current
- Include usage examples for complex interfaces and abstract classes

#### STORYBOOK

- Organize stories by component hierarchy to mirror the application structure
- Implement comprehensive controls to showcase component variations for {{component_types}}
- Use MDX format to combine documentation and live examples for complex components
- Configure Storybook addons for accessibility, responsive design, and {{specific_testing_needs}}
- Implement design token integration to showcase components with different themes
- Create interaction tests to verify component behavior in addition to visual appearance


### Guidelines for VERSION_CONTROL

#### GIT

- Use conventional commits to create meaningful commit messages
- Use feature branches with descriptive names following {{branch_naming_convention}}
- Write meaningful commit messages that explain why changes were made, not just what
- Keep commits focused on single logical changes to facilitate code review and bisection
- Use interactive rebase to clean up history before merging feature branches
- Leverage git hooks to enforce code quality checks before commits and pushes

#### CONVENTIONAL_COMMITS

- Follow the format: type(scope): description for all commit messages
- Use consistent types (feat, fix, docs, style, refactor, test, chore) across the project
- Define clear scopes based on {{project_modules}} to indicate affected areas
- Include issue references in commit messages to link changes to requirements
- Use breaking change footer (!: or BREAKING CHANGE:) to clearly mark incompatible changes
- Configure commitlint to automatically enforce conventional commit format


### Guidelines for ARCHITECTURE

#### ADR

- Create ADRs in /docs/adr/{name}.md for:
- 1) Major dependency changes
- 2) Architectural pattern changes
- 3) New integration patterns
- 4) Database schema changes

#### CLEAN_ARCHITECTURE

- Strictly separate code into layers: entities, use cases, interfaces, and frameworks
- Ensure dependencies point inward, with inner layers having no knowledge of outer layers
- Implement domain entities that encapsulate {{business_rules}} without framework dependencies
- Use interfaces (ports) and implementations (adapters) to isolate external dependencies
- Create use cases that orchestrate entity interactions for specific business operations
- Implement mappers to transform data between layers to maintain separation of concerns

#### DDD

- Define bounded contexts to separate different parts of the domain with clear boundaries
- Implement ubiquitous language within each context to align code with business terminology
- Create rich domain models with behavior, not just data structures, for {{core_domain_entities}}
- Use value objects for concepts with no identity but defined by their attributes
- Implement domain events to communicate between bounded contexts
- Use aggregates to enforce consistency boundaries and transactional integrity

#### MONOREPO

- Configure workspace-aware tooling to optimize build and test processes
- Implement clear package boundaries with explicit dependencies between packages
- Use consistent versioning strategy across all packages (independent or lockstep)
- Configure CI/CD to build and test only affected packages for efficiency
- Implement shared configurations for linting, testing, and {{development_tooling}}
- Use code generators to maintain consistency across similar packages or modules


### Guidelines for STATIC_ANALYSIS

#### ESLINT

- Configure project-specific rules in eslint.config.js to enforce consistent coding standards
- Use shareable configs like eslint-config-airbnb or eslint-config-standard as a foundation
- Implement custom rules for {{project_specific_patterns}} to maintain codebase consistency
- Configure integration with Prettier to avoid rule conflicts for code formatting
- Use the --fix flag in CI/CD pipelines to automatically correct fixable issues
- Implement staged linting with husky and lint-staged to prevent committing non-compliant code

#### PRETTIER

- Define a consistent .prettierrc configuration across all {{project_repositories}}
- Configure editor integration to format on save for immediate feedback
- Use .prettierignore to exclude generated files, build artifacts, and {{specific_excluded_patterns}}
- Set printWidth based on team preferences (80-120 characters) to improve code readability
- Configure consistent quote style and semicolon usage to match team conventions
- Implement CI checks to ensure all committed code adheres to the defined style


## FRONTEND

### Guidelines for REACT

#### REACT_CODING_STANDARDS

- Use functional components with hooks instead of class components
- Implement React.memo() for expensive components that render often with the same props
- Utilize React.lazy() and Suspense for code-splitting and performance optimization
- Use the useCallback hook for event handlers passed to child components to prevent unnecessary re-renders
- Prefer useMemo for expensive calculations to avoid recomputation on every render
- Implement useId() for generating unique IDs for accessibility attributes
- Use the new use hook for data fetching in React 19+ projects
- Leverage Server Components for {{data_fetching_heavy_components}} when using React with Next.js or similar frameworks
- Consider using the new useOptimistic hook for optimistic UI updates in forms
- Use useTransition for non-urgent state updates to keep the UI responsive


### Guidelines for ACCESSIBILITY

#### WCAG_PERCEIVABLE

- Provide text alternatives for non-text content including images, icons, and graphics with appropriate alt attributes
- Ensure pre-recorded audio-visual content has captions, audio descriptions, and transcripts for {{media_content}}
- Maintain minimum contrast ratios of 4.5:1 for normal text and 3:1 for large text and UI components
- Enable content to be presented in different ways without losing information or structure when zoomed or resized
- Avoid using color alone to convey information; pair with text, patterns, or icons for {{status_indicators}}
- Provide controls to pause, stop, or hide any moving, blinking, or auto-updating content
- Ensure text can be resized up to 200% without loss of content or functionality in {{responsive_layouts}}
- Use responsive design that adapts to different viewport sizes and zoom levels without horizontal scrolling
- Enable users to customize text spacing (line height, paragraph spacing, letter/word spacing) without breaking layouts

#### WCAG_OPERABLE

- Make all functionality accessible via keyboard with visible focus indicators for {{interactive_elements}}
- Avoid keyboard traps where focus cannot move away from a component via standard navigation
- Provide mechanisms to extend, adjust, or disable time limits if present in {{timed_interactions}}
- Avoid content that flashes more than three times per second to prevent seizure triggers
- Implement skip navigation links to bypass blocks of repeated content across pages
- Use descriptive page titles, headings, and link text that indicate purpose and destination
- Ensure focus order matches the visual and logical sequence of information presentation
- Support multiple ways to find content (search, site map, logical navigation hierarchy)
- Allow pointer gesture actions to be accomplished with a single pointer without path-based gestures
- Implement pointer cancellation to prevent unintended function activation, especially for {{critical_actions}}

#### WCAG_UNDERSTANDABLE

- Specify the human language of the page and any language changes using lang attributes
- Ensure components with the same functionality have consistent identification and behavior across {{application_sections}}
- Provide clear labels, instructions, and error messages for user inputs and {{form_elements}}
- Implement error prevention for submissions with legal or financial consequences (confirmation, review, undo)
- Make navigation consistent across the site with predictable patterns for menus and interactive elements
- Ensure that receiving focus or changing settings does not automatically trigger unexpected context changes
- Design context-sensitive help for complex interactions including validated input formats
- Use clear language and define unusual terms, abbreviations, and jargon for {{domain_specific_content}}
- Provide visual and programmatic indication of current location within navigation systems

#### WCAG_ROBUST

- Use valid, well-formed markup that follows HTML specifications for {{document_structure}}
- Provide name, role, and value information for all user interface components
- Ensure custom controls and interactive elements maintain compatibility with assistive technologies
- Implement status messages that can be programmatically determined without receiving focus
- Use semantic HTML elements that correctly describe the content they contain (buttons, lists, headings, etc.)
- Validate code against technical specifications to minimize compatibility errors
- Test with multiple browsers and assistive technologies for cross-platform compatibility
- Avoid deprecated HTML elements and attributes that may not be supported in future technologies

#### ARIA

- Use ARIA landmarks to identify regions of the page (main, navigation, search, etc.)
- Apply appropriate ARIA roles to custom interface elements that lack semantic HTML equivalents
- Set aria-expanded and aria-controls for expandable content like accordions and dropdowns
- Use aria-live regions with appropriate politeness settings for dynamic content updates
- Implement aria-hidden to hide decorative or duplicative content from screen readers
- Apply aria-label or aria-labelledby for elements without visible text labels
- Use aria-describedby to associate descriptive text with form inputs or complex elements
- Implement aria-current for indicating the current item in a set, navigation, or process
- Avoid redundant ARIA that duplicates the semantics of native HTML elements
- Apply aria-invalid and appropriate error messaging for form validation in {{form_validation}}

#### ACCESSIBILITY_TESTING

- Test keyboard navigation to verify all interactive elements are operable without a mouse
- Verify screen reader compatibility with NVDA, JAWS, and VoiceOver for {{critical_user_journeys}}
- Use automated testing tools like Axe, WAVE, or Lighthouse to identify common accessibility issues
- Check color contrast using tools like Colour Contrast Analyzer for all text and UI components
- Test with page zoomed to 200% to ensure content remains usable and visible
- Perform manual accessibility audits using WCAG 2.2 checklist for key user flows
- Test with voice recognition software like Dragon NaturallySpeaking for voice navigation
- Validate form inputs have proper labels, instructions, and error handling mechanisms
- Conduct usability testing with disabled users representing various disability types
- Implement accessibility unit tests for UI components to prevent regression

#### MOBILE_ACCESSIBILITY

- Ensure touch targets are at least 44 by 44 pixels for comfortable interaction on mobile devices
- Implement proper viewport configuration to support pinch-to-zoom and prevent scaling issues
- Design layouts that adapt to both portrait and landscape orientations without loss of content
- Support both touch and keyboard navigation for hybrid devices with {{input_methods}}
- Ensure interactive elements have sufficient spacing to prevent accidental activation
- Test with mobile screen readers like VoiceOver (iOS) and TalkBack (Android)
- Design forms that work efficiently with on-screen keyboards and autocomplete functionality
- Implement alternatives to complex gestures that require fine motor control
- Ensure content is accessible when device orientation is locked for users with fixed devices
- Provide alternatives to motion-based interactions for users with vestibular disorders


### Guidelines for STYLING

#### STYLED_COMPONENTS

- Use the ThemeProvider for consistent theming across components
- Implement the css helper for sharing styles between components
- Use props for conditional styling within template literals
- Leverage the createGlobalStyle for global styling
- Implement attrs method to pass HTML attributes to the underlying DOM elements
- Use the as prop for dynamic component rendering
- Leverage styled(Component) syntax for extending existing components
- Implement the css prop for one-off styling needs
- Use the & character for nesting selectors
- Leverage the keyframes helper for animations


## TESTING

### Guidelines for UNIT

#### JEST

- Use Jest with TypeScript for type checking in tests
- Implement Testing Library for component testing instead of enzyme
- Use snapshot testing sparingly and only for stable UI components
- Leverage mock functions and spies for isolating units of code
- Implement test setup and teardown with beforeEach and afterEach
- Use describe blocks for organizing related tests
- Leverage expect assertions with specific matchers
- Implement code coverage reporting with meaningful targets
- Use mockResolvedValue and mockRejectedValue for async testing
- Leverage fake timers for testing time-dependent functionality


### Guidelines for E2E

#### CYPRESS

- Use component testing for testing components in isolation
- Implement E2E testing for critical user flows
- Use cy.intercept() for network request mocking and stubbing
- Leverage custom commands for reusable test steps
- Implement fixtures for test data
- Use data-* attributes for test selectors instead of CSS classes or IDs
- Leverage the Testing Library integration for better queries
- Implement retry-ability for flaky tests
- Use the Cypress Dashboard for CI integration and test analytics
- Leverage visual testing for UI regression testing


### Guidelines for INTEGRATION

#### SUPERTEST

- Use async/await with supertest for cleaner test code
- Implement a test database for integration tests
- Use beforeEach/afterEach hooks for database setup and teardown when testing {{api_endpoints}}


