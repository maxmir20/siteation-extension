
<img width="128" height="128" alt="icon_128" src="https://github.com/user-attachments/assets/cd248f15-9659-45e7-8da3-2f379d853708" />

# Siteation Extension

This is the browser extension companion to Siteation (pronounced "Site-ation"), a Python/FastAPI-based Github App that records sites that helped developers generate their PR.

Install the chrome extension here:
Add the Github App to your Repo here: https://github.com/apps/site-ation

Github Repo for Github App: https://github.com/maxmir20/siteation-api/tree/main

## Features

- Shows if the Site/Page has been added as a Site-ation
- Displays in the tooltip if the page you're on has helped other developers before!
- Click once to add the site you're on to the list of Site-ations
- Click twice to copy the current list of Site-ations
- Displays integers on extension badge with blue background and white text

## Video/Screenshots

<img width="305" height="74" alt="site_without_siteations" src="https://github.com/user-attachments/assets/4a790e99-0e2f-453f-b69b-055b6d495feb" />
<p>
    <em>Icon on Site without Site-ation</em>
</p>


<img width="301" height="79" alt="site_with_siteations" src="https://github.com/user-attachments/assets/4564dda1-c7b8-4a1d-831a-a407b8349ba8" />

<p>
    <em>Icon on Site with Site-ation</em>
</p>



<img width="323" height="91" alt="page_with_siteation" src="https://github.com/user-attachments/assets/f18085be-e7e6-4841-ba42-2427af66efae" />
<p>
    <em>Icon on Page with Site-ation</em>
</p>




[Loom Video Demo - Viewing Site-ations](https://www.loom.com/share/7c5f427c92fe4559a9cddc7f56300e76?sid=4622ccbf-466e-44a7-a679-e0c1634d21a1) 


[Loom Video Demonstration - Adding Site-ations](https://www.loom.com/share/3365ee925f134b249249fde9e1031c56?sid=460e06c3-7d57-4a54-9b1f-bda5aa032c40)



## Permissions

- `tabs` - used to fetch current URL and check if the tab changes or we navigate to a new site
- `storage` - used to hold all URLs we are looking to add as Siteations
- `clipboardWrite` - used to copy all stored URLS onto the clipboard for easy pasting into a Github PR comment
- `scripting` - used to enable us to call clipboardWrite while on `https://github.com` because service_workers are not considered a secure page(See [here](https://github.com/w3c/editing/issues/458) and [here ]([url](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)))
