---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Validation**: Do not add unit, integration, or E2E test tasks. Use implementation,
manual verification, responsive checks, and documentation tasks instead.

**Organization**: Tasks are grouped by user story to enable independent implementation
and independent manual validation of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Nuxt web app**: `frontend/app/src/`, `frontend/app/public/`
- Adjust paths based on plan.md when a feature touches a narrower module set

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Validated independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Confirm affected files and directories in `frontend/app`
- [ ] T002 Initialize required dependencies within the approved stack only
- [ ] T003 [P] Review existing components/composables to avoid duplication

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Define shared types/interfaces in `frontend/app/src/types/`
- [ ] T005 [P] Establish shared layout/state dependencies for the feature
- [ ] T006 [P] Prepare routing, data access, or content loading needed by all stories
- [ ] T007 Create reusable UI primitives or composables that multiple stories depend on
- [ ] T008 Confirm responsive layout rules and breakpoint expectations

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Validation**: [How to verify this story works on its own]

### Implementation for User Story 1

- [ ] T009 [P] [US1] Create or update UI components in `frontend/app/src/components/`
- [ ] T010 [P] [US1] Implement page logic in `frontend/app/src/pages/`
- [ ] T011 [US1] Integrate data flow with composables/plugins as needed
- [ ] T012 [US1] Refine copy, states, and interaction clarity for simple UX
- [ ] T013 [US1] Validate mobile and desktop responsive behavior manually

**Checkpoint**: At this point, User Story 1 should be fully functional and manually verifiable

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Validation**: [How to verify this story works on its own]

### Implementation for User Story 2

- [ ] T014 [P] [US2] Create or update feature-specific components
- [ ] T015 [US2] Implement page/composable behavior for the story
- [ ] T016 [US2] Align the interaction flow with User Story 1 where needed
- [ ] T017 [US2] Validate mobile and desktop responsive behavior manually

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Validation**: [How to verify this story works on its own]

### Implementation for User Story 3

- [ ] T018 [P] [US3] Create or update feature-specific components
- [ ] T019 [US3] Implement page/composable behavior for the story
- [ ] T020 [US3] Complete story-specific UX and content refinement
- [ ] T021 [US3] Validate mobile and desktop responsive behavior manually

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Consolidate duplicated logic and simplify code paths
- [ ] TXXX Review mobile and desktop layout consistency across stories
- [ ] TXXX [P] Update docs or content references in `docs/` or feature notes
- [ ] TXXX Run manual end-to-end verification for the main user flows

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should remain independently verifiable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should remain independently verifiable

### Within Each User Story

- Shared structure before story-specific behavior
- Core implementation before content polish
- UX clarity before final verification
- Manual responsive validation before story completion

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Component work and content work in separate files can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```text
Task: "Create or update shared UI components in frontend/app/src/components/"
Task: "Implement page behavior in frontend/app/src/pages/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Manually verify User Story 1 on mobile and desktop
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Validate independently → Deploy/Demo (MVP)
3. Add User Story 2 → Validate independently → Deploy/Demo
4. Add User Story 3 → Validate independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and manually verifiable
- Do not add automated test tasks
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
