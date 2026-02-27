# Implementation Plan: Date Adapter Interface

## Overview

This plan implements a minimal 4-method date adapter interface that abstracts calendar operations while keeping direct timestamp comparisons and arithmetic in native JavaScript for performance. The implementation follows an incremental approach: define interfaces, implement core adapter, add registration mechanism, integrate with timeline components, and migrate to timestamp storage.

## Tasks

- [x] 1. Define core adapter interface and types
  - Create TimelineDateAdapter interface with 4 methods (parse, startOf, add, format)
  - Define DateInput, TimeInstant, and Unit types
  - Add comprehensive JSDoc comments explaining each method's behavior
  - _Requirements: 1.1, 1.2, 1.3, 5.1_

- [x] 2. Implement NativeDateAdapter
  - [x] 2.1 Implement parse() method
    - Handle number, Date, and string inputs
    - Return null for invalid inputs (no exceptions)
    - _Requirements: 5.1, 5.2, 10.2_
  
  - [ ]* 2.2 Write property test for parse() method
    - **Property 3: Parse Handles Multiple Input Types**
    - **Validates: Requirements 5.1**
  
  - [ ]* 2.3 Write property test for parse() null handling
    - **Property 5: Parse Returns Null for Invalid Input**
    - **Validates: Requirements 5.3, 10.2**
  
  - [x] 2.4 Implement startOf() method
    - Handle all time units (year, month, week, day, hour, minute, second, millisecond)
    - Week starts on Sunday (day 0)
    - _Requirements: 8.1, 8.2_
  
  - [ ]* 2.5 Write property test for startOf() method
    - **Property 6: StartOf Returns Earlier or Equal Timestamp**
    - **Property 7: StartOf Is Idempotent**
    - **Validates: Requirements 8.1, 8.2**
  
  - [x] 2.6 Implement add() method
    - Handle all time units with correct calendar arithmetic
    - Support negative amounts for subtraction
    - Handle month-end edge cases and leap years
    - _Requirements: 6.1, 6.2, 6.4_
  
  - [ ]* 2.7 Write property test for add() method
    - **Property 8: Add-Subtract Inverse Relationship**
    - **Validates: Requirements 6.1, 6.2**
  
  - [x] 2.8 Implement format() method
    - Call date-format-parse library directly (DateFormatter is redundant)
    - _Requirements: 1.3, 3.5_
  
  - [ ]* 2.9 Write unit tests for NativeDateAdapter edge cases
    - Test month-end dates (Jan 31 + 1 month)
    - Test leap years
    - Test year boundaries
    - Test week boundaries
    - _Requirements: 6.4, 8.1_

- [x] 3. Implement AdapterRegistry
  - [x] 3.1 Create AdapterRegistry class with static methods
    - Implement register() with validation
    - Implement get() with lazy default adapter creation
    - Implement reset() for test isolation
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ]* 3.2 Write property test for adapter registration
    - **Property 1: Adapter Registration and Retrieval**
    - **Validates: Requirements 2.3**
  
  - [ ]* 3.3 Write property test for adapter validation
    - **Property 2: Adapter Validation Rejects Incomplete Implementations**
    - **Validates: Requirements 2.4, 2.5**
  
  - [ ]* 3.4 Write unit tests for AdapterRegistry
    - Test default adapter instantiation
    - Test validation error messages
    - Test reset functionality
    - _Requirements: 2.2, 2.4, 2.5_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Add public API to Timeline class
  - Add static registerDateAdapter() method
  - Add static getDateAdapter() method
  - _Requirements: 2.1, 2.3_

- [x] 6. Integrate adapter into TimelineRangeView
  - [x] 6.1 Update _getTickDates() to use adapter
    - Replace hardcoded date arithmetic with adapter.startOf() and adapter.add()
    - Keep direct timestamp comparisons (no adapter needed)
    - _Requirements: 3.2, 3.4, 8.1_
  
  - [ ]* 6.2 Write unit tests for TimelineRangeView integration
    - Test tick calculation with custom adapter
    - Test that direct comparisons still work
    - _Requirements: 3.2, 3.4_

- [x] 7. Remove DateFormatter and update references
  - [x] 7.1 Delete DateFormatter.ts (now redundant)
    - Adapter.format() replaces DateFormatter functionality
    - _Requirements: 3.5_
  
  - [x] 7.2 Update all DateFormatter references to use adapter
    - Find all usages of DateFormatter in codebase
    - Replace with adapter.format() calls
    - _Requirements: 3.5, 4.2_
  
  - [ ]* 7.3 Write property test for format/parse round-trip
    - **Property 4: Parse Round-Trip with Format**
    - **Validates: Requirements 5.5**
  
  - [ ]* 7.4 Write unit tests for format() integration
    - Test various format patterns
    - Test with custom adapter
    - _Requirements: 3.5, 4.2_

- [-] 8. Integrate adapter into Utilities.parseDate()
  - [x] 8.1 Update Utilities.parseDate() to delegate to adapter
    - Replace direct Date parsing with adapter.parse()
    - Maintain backward compatibility
    - _Requirements: 3.2, 5.1, 5.2_
  
  - [ ]* 8.2 Write unit tests for Utilities.parseDate() integration
    - Test various input formats
    - Test error handling
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 9. Checkpoint - Ensure all integration tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Migrate Date storage to timestamps throughout codebase
  - [x] 10.1 Update TimelineDataSet to store timestamps
    - Change Date properties to number (timestamps)
    - Update getters/setters
    - _Requirements: 3.1_
  
  - [x] 10.2 Update TimelineBand to use timestamps
    - Replace Date objects with timestamps
    - Update comparison logic to use direct operators
    - _Requirements: 3.1, 3.4_
  
  - [x] 10.3 Update TimelineRangeView to use timestamps
    - Replace Date objects with timestamps
    - Update arithmetic to use direct subtraction
    - _Requirements: 3.1, 3.4_
  
  - [ ]* 10.4 Write unit tests for timestamp migration
    - Test that comparisons work correctly
    - Test that arithmetic works correctly
    - Test backward compatibility
    - _Requirements: 3.1, 3.3, 3.4_

- [ ] 11. Add error handling and validation
  - [ ] 11.1 Add input validation to adapter methods
    - Validate timestamps are valid numbers
    - Validate units are recognized
    - Provide descriptive error messages
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ] 11.2 Add graceful degradation in rendering code
    - Wrap adapter calls in try-catch
    - Fall back to ISO string display on error
    - Log errors to console
    - _Requirements: 10.1, 10.4_
  
  - [ ]* 11.3 Write unit tests for error handling
    - Test invalid inputs to each adapter method
    - Test error message content
    - Test graceful degradation
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design
- Unit tests validate specific examples, edge cases, and integration points
- Direct timestamp comparisons and arithmetic don't need adapter methods (performance optimization)
- The minimal 4-method interface eliminates 20+ unnecessary methods from earlier proposals
