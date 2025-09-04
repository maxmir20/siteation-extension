# Chrome Extension Specification Document

## Core Purpose
- Monitor active tab navigation and call APIs to determine when to display integers on the extension badge
- Display integers in a visually appealing blue badge with white text
- No user interaction required - fully automated operation

## Functional Requirements

### 1. Domain Change Detection
- Detect when user navigates to a new domain
- Call "different GET API" to determine if monitoring should be enabled
- Store response in `monitoringEnabled` variable
- If `monitoringEnabled = true`, immediately call "first GET API" and update badge if integer received
- If `monitoringEnabled = false`, do nothing

### 2. Path Change Monitoring
- When staying on same domain but changing paths:
  - If `monitoringEnabled = true`: Call "first GET API" to get integer
  - If `monitoringEnabled = false`: Do nothing
- Update badge with integer if received, clear badge if no integer

### 3. Badge Management
- Format: Blue box with white integer text
- Size: Accommodate up to 2 digits
- Clear badge entirely when `monitoringEnabled = false`
- Clear badge on API failures

### 4. State Management
- Track current domain in `currentDomain` variable
- Track monitoring status in `monitoringEnabled` variable
- Reset monitoring when domain changes

## Technical Requirements

### Permissions
- `tabs` - to monitor tab changes and query active tab

### Architecture
- Background service worker (no popup, no content scripts)
- Use `chrome.tabs.onUpdated` and `chrome.tabs.onActivated` listeners
- Use `chrome.tabs.query({active: true})` to get current URL
- No storage persistence needed

### Error Handling
- No retry logic on API failures
- Clear badge on failures
- Resume normal operation on next tab change

### Performance Considerations
- Handle ~60+ page visits per hour
- Efficient domain comparison logic
- Minimal API calls (only when necessary)

## API Placeholders
- **"different GET API"**: Called on domain change to determine monitoring status
- **"first GET API"**: Called on path change (if monitoring enabled) to get integer

## Implementation Order
1. **Project Structure Setup** - Create manifest.json and basic files
2. **Background Service Worker** - Set up the core listener infrastructure
3. **Domain Detection Logic** - Implement domain parsing and comparison
4. **API Integration** - Add placeholder API calls and response handling
5. **Badge Management** - Implement badge display/clearing with styling
6. **State Management** - Wire up the monitoring variable logic with immediate first API call
7. **Testing & Refinement** - Test navigation scenarios and optimize

## Logic Flow
- **Domain Change** → Call "different GET API" → If true: call "first GET API" immediately
- **Path Change (same domain)** → If monitoring enabled: call "first GET API"
- **Badge Updates** → Show integer if received, clear if no integer or monitoring disabled
