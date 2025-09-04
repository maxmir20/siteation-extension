# Siteation Extension

A Chrome browser extension that monitors tab navigation and displays integers on the extension badge based on API responses.

## Features

- Automatically detects domain changes and enables/disables monitoring
- Calls APIs to determine monitoring status and retrieve integers
- Displays integers on extension badge with blue background and white text
- Handles up to 2-digit numbers
- No user interaction required - fully automated operation

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the `siteation-extension` folder
4. The extension should now appear in your extensions list

## Testing

1. Navigate to different websites to test domain change detection
2. Navigate to different pages on the same website to test path change monitoring
3. Check the browser console for detailed logging of extension operations
4. The extension badge should display random numbers (1-99) during testing

## Development

### Current Status
- ✅ Project structure setup
- ✅ Background service worker
- ✅ Domain detection logic
- ✅ API integration (placeholders)
- ✅ Badge management
- ✅ State management
- 🔄 Testing & refinement

### Files
- `manifest.json` - Extension configuration
- `background.js` - Core logic and event handling
- `SPECIFICATION.md` - Detailed requirements and technical specs

### Next Steps
- Replace placeholder API calls with actual endpoints
- Test navigation scenarios
- Optimize performance if needed

## API Integration

The extension currently uses placeholder functions for API calls. Replace these in `background.js`:

- `checkDomainMonitoring(domain)` - Check if domain should be monitored
- `getIntegerFromAPI(url)` - Get integer for specific URL

## Permissions

- `tabs` - Monitor tab changes and query active tab
