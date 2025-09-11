// Background Service Worker for Siteation Extension

// State variables
let currentDomain = null;
let currentUrl = null;
let monitoringEnabled = false;
let clickTimeout = null;

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
    const response = await fetch(`https://site-ation.onrender.com/exists/?url=${encodeURIComponent(currentUrl)}`);
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
    const response = await fetch(`https://site-ation.onrender.com/value/?url=${encodeURIComponent(currentUrl)}`);
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
    chrome.action.setBadgeBackgroundColor({ color: '#ff4500' }); // Vermillion
  } else {
    chrome.action.setBadgeText({ text: '' }); // Clear badge
  }
}

// Function to handle domain change
async function handleDomainChange(newDomain) {
  console.log(`Handling domain change`);

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
  console.log(`Handling path change`);
  if (!monitoringEnabled) {
    return;
  }
  
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!activeTab || !activeTab.url) {
    return;
  }
  console.log(`mad eit to title`);

  const integer = await getSiteationScoreFromAPI();
  const defaultTitle = await chrome.action.getTitle({});
  const currentBanner = defaultTitle.split('\n', 1)[0];
  console.log(`title is now: ${defaultTitle}`);

  if (integer) {
    siteationScoreBanner = `This Page has been Site-d ${integer} times!`;
    chrome.action.setTitle({ title: defaultTitle.replace(currentBanner, siteationScoreBanner), tabId: activeTab.id});
    updateBadge(integer);
    console.log(`Updated badge with integer: ${integer}`);
  } else {
    originalBanner = `Siteation: Cite your sites!`;
    chrome.action.setTitle({ title: defaultTitle.replace(currentBanner, originalBanner), tabId: activeTab.id});
    
    updateBadge(null);
    console.log('No integer received, cleared badge');
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

// Function to add current URL to siteations set
async function addCurrentUrlToSiteations() {
  if (!currentUrl) {
    console.log('No current URL to add');
    return;
  }
  
  try {
    // Store current URL as a key in storage
    await chrome.storage.local.set({ [currentUrl]: true });
  } catch (error) {
    console.error('Error adding URL to siteations:', error);
  }
}

// Function to format and copy siteations to clipboard
async function copySiteationsToClipboard() {
  try {
    // Get all keys from storage
    const siteationsUrls = await chrome.storage.local.getKeys();
    
    if (siteationsUrls.length === 0) {
      console.log('No siteations to copy');
      return;
    }
    
    // Format the text
    let formattedText = "[Site-ations]\n";
    siteationsUrls.forEach(url => {
      formattedText += `- ${url}\n`;
    });
    
    // Check if we're on github.com
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const isGithub = activeTab && activeTab.url && activeTab.url.includes('github.com');
    
    if (isGithub) {
      // Use navigator.clipboard on github.com
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (text) => {
          navigator.clipboard.writeText(text).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        },
        args: [formattedText]
      });
    } else {
      // Fallback for non-github.com sites
      console.log('Not on github.com - clipboard copy not available');
      return;
    }
    
    // Clear all siteations after copying
    await chrome.storage.local.clear();
    
  } catch (error) {
    console.error('Error copying siteations to clipboard:', error);
  }
}

// Handle extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  // Clear any existing timeout
  if (clickTimeout) {
    clearTimeout(clickTimeout);
    clickTimeout = null;
    // This is a double-click
    await copySiteationsToClipboard();
  } else {
    // Set timeout for potential double-click
    clickTimeout = setTimeout(async () => {
      // This is a single-click
      await addCurrentUrlToSiteations();
      clickTimeout = null;
    }, 100); // 100ms delay to detect double-click
  }
});
