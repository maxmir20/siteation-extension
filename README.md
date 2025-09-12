
<img width="128" height="128" alt="icon_128" src="https://github.com/user-attachments/assets/cd248f15-9659-45e7-8da3-2f379d853708" />

# Siteation Extension

This is the browser extension companion to Siteation (pronounced "Site-ation"), a Python/FastAPI-based Github App that records sites that helped developers generate their PR.

Install the chrome extension here:
Add the Github App to your Repo here:

## Features

- Displays in the tooltip if the page you're on has helped other developers before!
- Click once to add the site you're on to the list of Site-ations
- Click twice to copy the current list of Site-ations
- Displays integers on extension badge with blue background and white text

## Screenshots



- `checkDomainMonitoring(domain)` - Check if domain should be monitored
- `getIntegerFromAPI(url)` - Get integer for specific URL

## Permissions

- `tabs` - used to fetch current URL and check if the tab changes or we navigate to a new site
- `storage` - used to hold all URLs we are looking to add as Siteations
- `clipboardWrite` - used to copy all stored URLS onto the clipboard for easy pasting into a Github PR comment
- `scripting` - used to enable us to call clipboardWrite while on Github because service_workers are not considered a secure page(See [here](https://github.com/w3c/editing/issues/458) and [here ]([url](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)))
