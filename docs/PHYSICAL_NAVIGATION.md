# Physical-only navigation

User decision: remove the top navigation and keep the existing right-side television controls. On phones, show the complete TV rather than cropping the controls away.

- Removed the whole top masthead/navigation, including the duplicated case-study return link. The physical Projects button returns to the collection. Existing project browsing, index, contextual links, and Back to desk remain.
- Home opens the personal introduction; Experience opens the timeline; Education opens the existing globe (with academic-details links); Skills, Projects, Credentials, and Contact open their corresponding sections. The dial and active LEDs follow those destinations.
- Transparent native buttons follow the projected 3D meshes, providing semantic names, keyboard activation, selected state and focus outlines directly on the hardware. No second visible menu is added.
- Portrait/tablet camera framing includes the whole cabinet without stretching it. Content scrolls inside the CRT; the compact index, Contact and globe adapt to the smaller screen. Section alignment updates when screen dimensions change.
- When WebGL is unavailable, the same right-side controls have a visible HTML fallback. Modal background controls remain inert even if reduced-motion preferences change.

Verification: all seven physical controls exercised on the 390×844 production preview; Home activated with Enter; dial advanced Home → Experience; index search opened NASA, Projects returned to collection; Education → Valencia → UPV study details worked. All physical-control bounds were within the phone viewport. Full TV and removed top bar reviewed on desktop and phone. Index search retained its accessible name. Index remained open with focus in search and hardware inert during a reduced-motion preference change. No-WebGL Contact control worked. Temporary preference/viewport overrides cleared.

The complete-TV phone view necessarily makes the physical buttons and content area smaller. Controls retain the actual model geometry; this is not a claim that every physical touch target is 44px. No duplicate large mobile menu was introduced, per the chosen direction.

The standalone browser regression script was updated to use the physical controls but was not run; the interactions above were performed through the connected browser. Full unit-suite and production-build results are reported in the PR. No deployment is performed by this change.
