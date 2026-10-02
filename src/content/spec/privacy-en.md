Welcome to **Sky's personal website**, maintained by Sky at [xiaoxiaoboluo.cn](https://xiaoxiaoboluo.cn). This site shares essays, learning and technology notes, and everyday updates. This page explains data handling and the ground rules for using content and participating in discussions.

## 🔒 Privacy Policy

### 1. The website and this policy

The main site is built with Astro and served as static pages. Reading articles requires no site account. Static hosting does not mean that no personal information is processed: comment backends, hosting platforms and external resources may still receive necessary data.

This policy covers this website and its configured interactive features. External websites have their own policies. This site does not use the information you provide for the purpose of selling visitors' personal data.

### 2. Guestbook and article comments

The site currently uses **Twikoo** for comments and replies in the guestbook and on articles where comments are enabled. A GitHub login is not required.

- **Information you submit:** a nickname, email, optional website address and comment text. Your nickname, avatar, text, timestamp and website link may be publicly displayed. Do not post passwords, home addresses, phone numbers or other people's private information.
- **Email:** used for comment identification and avatar matching. If reply notifications are configured on the backend, it may also be used to notify you of replies, not for this site's marketing emails. Your full email is not displayed as ordinary comment content, but the site administrator can process it in the administration panel.
- **Technical information:** the comment service may receive and store your IP address, browser and operating-system information, page path and request time for spam prevention, rate limiting, troubleshooting and moderation. This site does not publicly display IP addresses or IP locations in comments. **Not displaying them does not mean the backend does not process them.**
- **Avatars:** a numeric QQ email can use its corresponding QQ avatar; other emails may use Gravatar or a default avatar. Avatar requests may contain a QQ number or an email hash, along with ordinary network request information. A hash is not encryption and is not guaranteed to prevent association with an email or avatar account.
- **Hosting and storage:** this site's Twikoo backend is hosted on Netlify. Submitted comments are not stored only in your browser. See the [Twikoo documentation](https://twikoo.js.org/en/intro.html) for its technical features.

You can read without commenting if you do not wish to submit this information. Do not impersonate someone else or use another person's email. A public real name is not required, and your email should not be included in the public comment text.

### 3. Hosting and third-party resources

Depending on the page and feature, the site requests external services to display content. Some requests occur when a page opens, without waiting for a button click. Providers can generally receive an IP address, request time, resource URL, browser information and any referrer information actually sent by the browser.

- **Site hosting:** static pages are published through GitHub Pages. The host may process access logs for delivery, security and troubleshooting. See the [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement). Comment-backend hosting is covered by the [Netlify Privacy Policy](https://www.netlify.com/privacy/).
- **Scripts and resources:** some components load through CDNs such as jsDelivr. The comment script may use a fallback such as npmmirror when the primary address is unavailable.
- **Music:** Meting and fallback APIs provide playlists, covers, lyrics and playback URLs. Resources may then be requested from QQ Music, NetEase Cloud Music or another provider returned by the API. Providers can receive these requests and necessary network information. This site does not provide music-platform account login or read your music-platform password.
- **Welcome message and weather:** ipwho.is estimates your region from your IP address, and Open-Meteo provides weather for that region. Weather requests include the approximate coordinates returned by the IP lookup. These features do not use browser GPS or request precise device-location permission, but external services still receive your network address.
- **Daily quote:** short quotes may be requested from Hitokoto.
- **Footprints map:** opening the footprints page requests map tiles for the current viewport from OpenStreetMap. The map shows places recorded by the site owner, not automatically recorded visitor locations. See the [OpenStreetMap Foundation Privacy Policy](https://osmfoundation.org/wiki/Privacy_Policy).
- **Other external content:** remote images, videos, avatars and embedded content are provided by their respective services. Links to BiliBili, GitHub and other platforms lead to services with their own rules.

Providers may process data outside your region and have different retention arrangements. This site cannot control all third-party processing or guarantee uninterrupted service.

### 4. Visit analytics

The site has support for **Umami**, enabled only when configured for a deployment. The status for this deployment appears at the top of this page. When disabled, its tracking script is not loaded. Fixed numbers displayed in the sidebar are not live measurements. Article visit counts from the comment component are a separate feature.

When enabled, Umami may measure page views, referrers, browser, operating system, device category, approximate region and outbound-link clicks to understand visits and improve the site. According to [Umami's official FAQ](https://docs.umami.is/docs/faq), standard analytics does not use tracking cookies. Request information such as an IP address can be used to generate an anonymous session identifier, while standard analytics does not store raw IP addresses. Anonymous measurement does not mean requests never involve an IP address or that the site precisely identifies an individual. The site does not deliberately attach comment emails or comment text to analytics events.

Session replay is a separate feature, with its status also shown above. Before enabling it in the future, this policy should be updated to explain its scope and safeguards.

### 5. Cookies, browser storage and caching

The site primarily uses browser storage and caching for functional state, not to build advertising profiles.

- **Preferences:** theme, language, wallpaper, visual effects and article layout may be saved in Local Storage for your next visit.
- **Playback memory:** the recent track identifier, playback position, volume and update time are saved to resume where you left off. This remembers playback state, not a downloaded copy of the song; playback may still require the network.
- **Comment inputs and drafts:** Twikoo may remember your nickname, email, website and unsent draft in your browser. Clear relevant site data after using a shared device.
- **Temporary state and caches:** session storage can keep short-term prompt state, while the browser can cache images and scripts. Weather and IP lookup results are also cached locally for a limited time to reduce repeat requests.

Saving this local state does not, by itself, upload it as a personal profile. Submitting a comment or requesting an external resource still transmits the data needed for that feature as described above. Any browser-managed synchronisation is governed by the browser provider.

You can delete this site's cookies, Local Storage and caches through browser settings, or restrict scripts and external resources. This may reset preferences, remove playback memory or make comments and maps unavailable. **Clearing browser data does not delete comments already submitted to the backend.** Private browsing does not hide your network IP address.

### 6. Retention, security and your choices

Comments generally remain with the relevant page until administrative cleanup or a reasonable deletion request is processed. Local preferences remain until you clear them, the browser removes them or a relevant cache expires. Third-party logs, backups and analytics have retention periods determined by their configurations and policies; this site cannot promise immediate removal of every copy.

Within its control, the site limits administrative access, maintains components and avoids exposing sensitive fields. Internet transmission and storage cannot be guaranteed perfectly secure. Contact the owner if you notice a possible leak or incorrectly public information.

Subject to applicable law, you can ask how your data is used and request access, correction or deletion of information about you that this site controls. You can also avoid commenting or restrict third-party requests. Contact Sky at [xiaoxiaoboluo@outlook.com](mailto:xiaoxiaoboluo@outlook.com), identifying the relevant page, comment time or record. Reasonable identity checks may be needed to prevent mistaken deletion. Do not send passwords, identity documents or unnecessary sensitive material.

### 7. Minors and policy changes

Minors should use public interactive features with a guardian's guidance and avoid publishing their own or others' private information. Guardians can contact the address above about comments that need attention.

This page and its update date will change when site features, providers or applicable requirements change. Significant changes to data handling will be highlighted on the site. Read the latest explanation before using interactive features. Merely browsing is not treated as blanket consent to every optional form of data processing, and this policy does not limit your statutory rights.

## 📜 Terms of Use

### 1. Original content and reuse

Unless stated otherwise, original articles are shared under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Reuse or adaptations should credit **Sky**, link to the original and the licence, identify changes, and meet its non-commercial and share-alike requirements. The full licence text controls.

A separately stated licence takes precedence for the relevant material. Images, music, videos, game assets, trademarks and quoted material remain the property of their respective rights holders and are not automatically covered by the article licence. Theme and program source-code licences are also separate. Contact the appropriate rights holder before commercial use or any use requiring additional permission.

### 2. Comments and acceptable use

Questions, discussion and differing views are welcome. Treat others respectfully. Do not post unlawful content, harassment, abuse, hate or discrimination, impersonation, private information, spam or malicious links, or attempt to attack the site or bypass administrative restrictions.

You should have the right to post your submissions. You allow the site to store and display them as necessary to provide comments, replies and moderation, without transferring your copyright. The owner may review, hide or remove rule-breaking comments and reasonably restrict abuse. Commenters' views do not represent the site.

Access the site reasonably. When reusing content, scraping pages or using external resources, respect applicable licences, service rules and resource capacity.

### 3. Informational content and external links

The site records personal experience and opinions. Information can contain mistakes or become outdated, especially software instructions, learning guides and descriptions of external services. Consider your own environment and back up important data before consequential operations. Seek appropriate professional advice when needed.

The site does not guarantee that every detail remains accurate or complete, or that links, music APIs and comment services remain available. External links do not endorse all content or conduct of the destination. Liability is determined by applicable law; this explanation does not exclude liability that cannot lawfully be excluded.

### 4. Contact and updates

Report errors, copyright concerns, problematic comments or privacy issues through [About Me](/about/) or [xiaoxiaoboluo@outlook.com](mailto:xiaoxiaoboluo@outlook.com), including a relevant URL and enough context to investigate.

These terms may change as the site develops. The latest version and date appear on this page. They are interpreted and applied under applicable law without limiting mandatory rights in your location.

Thank you for visiting, and for helping keep this little space welcoming.
