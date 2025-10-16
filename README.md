
<img width="128" height="128" alt="icon_128" src="https://github.com/user-attachments/assets/cd248f15-9659-45e7-8da3-2f379d853708" />

# Site-ation Browser Extension

## What if you could use crowd-sourcing to see how often an online resource helped a developer? What if you could better credit the articles and posts that helped you?
### That's the idea behind Site-ation, an open-source collaborative database that lets developers credit the resources (e.g. webpages/articles/blogs/StackOverflow posts/etc) that helped them write their PR. 

This is the code for the browser extension companion to [Site-ation](https://github.com/maxmir20/siteation-api), a Python/FastAPI-based Github App that uses DynamoDB to record URLs in merged PRs

Site-ations are links that you and other developers have included in PRs to indicate that it helped with your solution. Similar to research paper citations, you can then see on websites how often an article or blog post has been Site-d by others.

With Site-ation installed you can:
1. See whether the website has been Site-d by any users <img width="29" height="24" alt="Screenshot 2025-10-16 at 2 55 50 PM" src="https://github.com/user-attachments/assets/c1733181-3eda-4fe1-b1a3-3ae0d85788cb" />
2. See how often the page you're on has been Site-d <img width="23" height="24" alt="Screenshot 2025-10-16 at 2 55 37 PM" src="https://github.com/user-attachments/assets/4557cece-11d5-4a9e-a1d8-612027e62a04" />

3. Contribute Site-ations by including them in your PRs in a bibliography-style format
<img width="600" height="268" alt="Screenshot 2025-10-16 at 3 26 07 PM" src="https://github.com/user-attachments/assets/e0a89016-c75c-4dda-a13d-4fa89037386c" />

## Install Links
- Install the chrome extension here: https://chromewebstore.google.com/detail/nbflhjdhpokppngahofkpjgoamnnoffe?utm_source=item-share-cb

- Add the Github App to your Repo here: https://github.com/apps/site-ation

- Github Repo for Github App: https://github.com/maxmir20/siteation-api/tree/main

## Features
- Shows if the Site/Page has been added as a Site-ation <img width="29" height="24" alt="Screenshot 2025-10-16 at 2 55 50 PM" src="https://github.com/user-attachments/assets/c1733181-3eda-4fe1-b1a3-3ae0d85788cb" />
- Displays in the tooltip if the page you're on has helped other developers before! <img width="23" height="24" alt="Screenshot 2025-10-16 at 2 55 37 PM" src="https://github.com/user-attachments/assets/4557cece-11d5-4a9e-a1d8-612027e62a04" />

- Click once to add the site you're on to the list of Site-ations

- Click twice to copy the current list of Site-ations

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
- `scripting` - used to enable us to call clipboardWrite while on `https://github.com` because service_workers are not considered a secure page(See [here](https://github.com/w3c/editing/issues/458) and [here](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts))
