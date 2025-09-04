// Background Service Worker for Siteation Extension

// State variables
let currentDomain = null;
let currentUrl = null;
let monitoringEnabled = false;

// Utility function to extract domain from URL
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
}

// Utility function to check if domain has changed
function hasDomainChanged(newUrl) {
  const newDomain = extractDomain(newUrl);
  if (newDomain !== currentDomain) {
    return { changed: true, newDomain };
  }
  return { changed: false, newDomain: currentDomain };
}

// exists GET API - called on domain change
async function checkDomainMonitoring() {
  console.log(`Checking if there are any siteation scoores for this domain`);
  try {
    const response = await fetch(`http://127.0.0.1:8000/exists/?url=${encodeURIComponent(currentUrl)}`);
    if (!response.ok) {
      throw new Error('Failed to retrieve domain check');
    }
    const data = await response.json();
    const result = data.exists;
    return result;
  } catch (error) {
    console.error('Error checking domain monitoring:', error);
    return false; // Clear badge and do nothing else on error
  }
}

// value GET API - called to get siteation score
async function getSiteationScoreFromAPI() {
  console.log(`Getting siteation score for URL: ${currentUrl}`);
  try {
    const response = await fetch(`http://127.0.0.1:8000/value/?url=${encodeURIComponent(currentUrl)}`);
    if (!response.ok) {
      throw new Error('Failed to retrieve siteation score');
    }
    const data = await response.json();
    const result = data.site_value;
    return result;
  } catch (error) {
    console.error('Error getting siteation score:', error);
    return null; // Clear badge and do nothing else on error
  }
}

// Function to update the badge
function updateBadge(integer) {
  if (integer && monitoringEnabled) {
    chrome.action.setBadgeText({ text: integer.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#4285f4' }); // Blue background
  } else {
    chrome.action.setBadgeText({ text: '' }); // Clear badge
  }
}

// Function to handle domain change
async function handleDomainChange(newDomain) {
  console.log(`Domain changed from ${currentDomain} to ${newDomain}`);
  
  // Reset monitoring state
  monitoringEnabled = false;
  updateBadge(null); // Clear badge
  currentDomain = newDomain;

  
  // Check if we should monitor this domain
  monitoringEnabled = await checkDomainMonitoring();
  
  if (monitoringEnabled) {
    console.log(`Monitoring enabled for domain: ${newDomain}`);
    // Immediately call first API for the current page
    await handlePathChange();
  } else {
    console.log(`Monitoring disabled for domain: ${newDomain}`);
  }
}

// Function to handle path change (same domain)
async function handlePathChange() {
  if (!monitoringEnabled) {
    return;
  }
  
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab && activeTab.url) {
    const integer = await getSiteationScoreFromAPI();
    if (integer) {
      updateBadge(integer);
      console.log(`Updated badge with integer: ${integer}`);
    } else {
      updateBadge(null);
      console.log('No integer received, cleared badge');
    }
  }
}

// Event listeners
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    currentUrl = tab.url;
    const domainCheck = hasDomainChanged(tab.url);
    
    if (domainCheck.changed) {
      handleDomainChange(domainCheck.newDomain);
    } else if (monitoringEnabled) {
      // Same domain, different path
      handlePathChange();
    }
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (activeTab && activeTab.url) {
      currentUrl = activeTab.url;
      const domainCheck = hasDomainChanged(currentUrl);
      
      if (domainCheck.changed) {
        handleDomainChange(domainCheck.newDomain);
      } else if (monitoringEnabled) {
        // Same domain, different path
        handlePathChange();
      }
    }
  } catch (error) {
    console.error('Error handling tab activation:', error);
  }
});

// Initialize extension
console.log('Siteation Extension background service worker initialized');
