# Portfolio Design Plan 2
Use colour schemes and rounding from the given components.

- The project cards should be such that, that clicking them opens up a proper bigger project card with all the information like it used to in my older portfolio website. The 3 MacOS buttons should be functional when the project card is opened up. The buttons should all on-click close the prject card with the proper animation/transition.
- I have put the favicon for the website in [assets/favicon.png](assets/favicon.png). Please use it for the website. The favicon should be visible on all pages of the website. It is in a way the logo for the webpage. My logo is literally this pciture. The website will only use `assets/my-logo.jpg` for the logo on left side of the macOS navbar/dock. The favicon is for literally everywhere else where the navbar is needed. My other usernames that can be used in the website and keep yourself only limited to these:
    - `ib_hussain`
    - `ib-hussain`
    - `ib_hussain@archlinux`
- I asked you for the MacOS Dock not just the magnificaion of it.
- For navbar/dock we will now properly build it. These are the pages we will have at the start:
    - Contact Me
    - Photos
    - Terminal
    - Resume
    - Music
    - Movies
    - Projects
    - Bin
    
    and the icons for each of them are `assets/icon-*.png` and the names of the icons are the same as the names of the pages. The icons should be in a circle and should have a hover effect which makes them look like they are being pressed down. The icons should also have a tooltip which shows the name of the page when hovered over. The icons should also have a click effect which makes them look like they are being pressed down. Each page will be designed in a new way and I will lead you and guide on each of them.


## index.html
- The startup greeting needs to take the same amount of time as the one in the repository I gave you and every page needs to have that kind of transition as the site from [dev-portfolios/Aadarshrai1801-Portfolio/](dev-portfolios/Aadarshrai1801-Portfolio/) has. If it naviagtes you to the 'Work' page then it first shows "Work" and then the page. I need effects like that for each page as well. I need the timings of that. I need my welcome page animations and transitions to be an almost replica of them.
- Use the [assets/tom-and-jerry-cursor.html](assets/tom-and-jerry-cursor.html) as it will be global cursor for this website. Use the preset values from the file for the website.
- Index page will have this as the hero [@kokonutui/topo-background.html](@kokonutui/topo-background.html) for it. Once it is scrolled past, then we show a new theme of mountains and stars visible from mountains. Our website will not have any 2 themes, just dark themes as we are showcasing the theme of mountains, night, starlight, and astronomy(this one is limited to index page). 
- I would like to use [@kokonutui/metric-card2.html](@kokonutui/metric-card2.html) but I do not understand what I can show on this, either we can show my git commit history? my work history? some dashboard of mine? some other way to show my skills grounded in reality?? idk but this needs to be used in the index page. 
- The index page will carry bits of the essence of each page. In this exact order:
    - Upto 7 MacOS wigdets showing my introduction and who i am what skills i have and my interests. Use [@kokonutui/lightbox-grid.html](@kokonutui/lightbox-grid.html) element but dont make them all rectangles the same size, we need to show good styling. Use `assets/my-display-pic.jpg` in one wigdet as well as this is my personal picture.
    - The essence of 'Photos' page will be in this component [shadcn/@reui/c-carousel-9.html](shadcn/@reui/c-carousel-9.html)
    - The skills section will be all but taken from the `dev-portfolios/aahana-surya.github.io/` repository as it's so good.

### Global footer
- Footer should have the shades of the white mountains of pakistan and should have `Nanga Parbat, 8,126 m`, `K2, 8,611 m`, `Rakaposhi, 7,788 m` and 5 other mountains with there height and location shown. The footer already has a whole mountain range underneath it. The footer should have instead of the cross section of any other mountain range it should have the cross section of the mountains of Pakistan. The footer shows mountain heights as you hover over it as it shows the height of the mountain behinnd the position of your current cursor. So it should show height and name of these mountains without any highlighting and hover as it should always be visible. 
- Remove this line from the footer or any similar lines: "© 2026 Ibrahim Hussain · Built with HTML / CSS / JS"
### Global Dock
- The dock should not be below the screen anymore. It should be at the top all the time. The dock should have the dot under the current tab under it, when it is at the top, it should also have the dot under it instead of being at the top of the icon. The direction of the tooltip should although change from being at top to being at bottom. So should the direction of magnification and hover.
- Now since I am using even the MacOS icons for the dock I want an almost exact replication of the supplied source dock adapted for the website.

## Pages
### Terminal
A terminal/CLI bash based UI which should have the UI of MacOS terminal with terminal tabs as diffferent pages.
It should be very much adapted and it should take most of it's inspiration and adaptation from `- https://akkila.dev/#top` which is in [dev-portfolios/akkila.dev/](dev-portfolios/akkila.dev/) and it should have the almost the same functionalities as that. 

### Contact Me
These components you have to use these:
- `ui.flexnative.com/blocks/hero/hero-04-art-collage.html`
- `@kokonutui/liquid-gauge-for-setting-levels2.html`
- `@kokonutui/button-presser2.html`
- `blocks.so/dialogs/01.html`
- `blocks.so/dialogs/03.html`

### Photos
We will use [ui.flexnative.com/blocks/hero/hero-12.html](ui.flexnative.com/blocks/hero/hero-12.html) for the welcome/hero/top/background of this page. Then show [ui.flexnative.com/blocks/hero/hero-04.html](ui.flexnative.com/blocks/hero/hero-04.html). After that we show [ui.flexnative.com/blocks/feature/feature-03.html](ui.flexnative.com/blocks/feature/feature-03.html) for the space under it and then add [ui.flexnative.com/blocks/content/content-02.html](ui.flexnative.com/blocks/content/content-02.html) for the end and then the global footer.

Use these as well for this page:
- `@kokonutui/card-stack.html`
- `@kokonutui/button-presser2.html`
- `@kokonutui/lightbox-grid.html`
- `@kokonutui/liquid-gauge-for-setting-levels2.html`

### Resume
This will be entirely a page of reading. My resume converted into a web page like [@kokonutui/scroll-index2.html] so that is a scrollable and intuitive. It needs to have good UI/UX.

### Music
We will use [21st.dev/@gughigug/components/liquid-sculpture-hero/Component2.html](21st.dev/@gughigug/components/liquid-sculpture-hero/Component2.html) for the welcome/hero/top/background of this page. I will just showcase a few mehdi hassan songs here and a user will be able to play 1 or 2 songs which i will present them as well.

### Movies
We will use [21st.dev/@jatin-yadav05/components/old-television-shader/](21st.dev/@jatin-yadav05/components/old-television-shader/) for the welcome/hero/top/background of this page. I want to kinda do something lke connect my letterboxd account if poosible and show case my already seen movies and my top best movies and my reviews, like make this in a way my letterboxd profile here.

### Bin
This will be decided later but just make it a treachourous dark place with no escape.
Use either of these:
- `21st.dev/@jahed/components/flow-field-background/`
- `21st.dev/@xubohuah/components/wave-background/`

You may not even integrate navbar or footer for this page.

### Projects
We will use [@kokonutui/halftone-background2.html](@kokonutui/halftone-background2.html) for the welcome/hero/top/background of this page. Then for project cards display we will use [@kokonutui/lightbox-grid2.html](@kokonutui/lightbox-grid2.html) 

```bash
ibrahim@IbLaptop{/mnt/d/Downloads/Repositories}: tree -L 1 .
.
├── 3movieCollectors
├── archRicePack                    
├── Cinemago
├── claw-code                           # Reporitory from someone else I am working on changing and adapting to my needs but this is local and just a copy
├── deepFakeDetection                   # Project I am working on making and fixing
├── developer-portfolios                # Reporitory from someone else I am working on changing and adapting to my needs 
├── disaster-recovery-analysis
├── fin-glassbox                        # My Mona Lisa. My masterpeice.
├── frag-aware-nlp-scheduler            # One of many projects I still haven't put on display. Present at `https://github.com/Izhan-Nasir/frag-aware-nlp-scheduler`
├── GameBoy
├── Game-Of-Life
├── ib-hussain
├── ib-hussain.github.io
├── icecream                            # Reporitory from someone else I am working on changing and adapting to my needs but this is local and just a copy
├── MacOSDock                           # Reporitory from someone else I am working on changing and adapting to my needs but this is local and just a copy
├── MobileInfoAnalytics                 # Flask/Streamlit frontend main branch at `https://github.com/malaika-khan12/MobileInfoAnalytics/tree/main`
├── MobileInfoAnalytics2                # typescript frontend branch at `https://github.com/malaika-khan12/MobileInfoAnalytics/tree/ts-frontend`
├── Multi-Agentic_Health_Assistant      # Reporitory from someone else I am working on changing and adapting to my needs but this is local and just a copy
├── Network-Emulator
├── odysseus                            # Reporitory from someone else I am working on changing and adapting to my needs but this is local and just a copy
├── opencode                            # Reporitory from someone else I am working on changing and adapting to my needs but this is local and just a copy
├── PredictiveCoding                    # Project I am working on making and fixing
├── Projects.py
├── raw-overfitting-transformer
├── Movie-Genre-Detection-Model
├── secret_to_happiness
├── sqlAutomation
├── TCGA-Integrative-Analysis
├── ubuntuRicePack
├── warm-prospect-radar                 # Project I am working on making and fixing
├── writers-block
└── Youtube-Video-Download-Transcribe

31 directories, 1 file

ibrahim@IbLaptop{/mnt/d/Downloads/ReverseEngineering/apk-rea}: tree -L 2 .
.
├── Cars_forked
│   ├── apktool.bat
│   ├── apktool.jar
│   ├── build
│   ├── cars_fastaslightning_fullgamedata_tutorial_error_fixed_202501
│   ├── CarsRecovery-Phase5
│   ├── CarsRecovery-Phase5.2-signed.apk
│   ├── CarsRecovery-Phase5.2-signed.apk.idsig
│   ├── delete-this
│   ├── Keystore_password.txt
│   ├── logs
│   ├── platform-tools
│   ├── preserved
│   ├── README.md
│   ├── shared_folder_for_emulator
│   ├── tempcars
│   ├── tmp
│   ├── tools
│   └── work
└── greenFarm3
    ├── GreenFarm3-Compatibility-Phase2-signed.apk
    ├── GreenFarm3-Compatibility-Phase4-signed.apk
    ├── GreenFarm3-Compatibility-Phase5-signed.apk
    ├── GreenFarm3-Recovery-Phase2
    ├── GreenFarm3-Recovery-Phase4
    └── logs

18 directories, 9 files

```
This shows my work across various domains and you may have knowlegde of many of them already as I do it all alongside you so you can gather context on all tasks if you search through your memory properly.

## OUTPUT
I need 1 zip file that I will unzip in the `ib-hussain.github.io/` repo and then commit that repository. Everything you give me needs to be replacing what already exists or something new. Don't send old things that you have already sent in the last built in this zip file again. We need to keep the zip files light so they need to not be full of unneccessary things. 
```bash
ibrahim@IbLaptop{/mnt/d/Downloads/Repositories/ib-hussain.github.io}: ls
about.html       crawl_site.py      Ibrahim_Career_Context_Prompt.md      my-site-tree.md                                 PTCL         scripts
assets           css                index.html                            navbar.html                                     __pycache__  sitemap.xml
CHANGELOG.md     docs               js                                    pictures                                        README.md    tests
component-lab    experience.html    linkedinBanner.html                   previews                                        resume.html  vendor
components.html  fin-glassbox_demo  list_of_positions_i_will_aply_to.txt  projects.html                                   resume.md
contact.html     footer.html        llms.txt                              prompt_to_gemini_for_screening_job_postings.md  robots.txt
ibrahim@IbLaptop{/mnt/d/Downloads/Repositories/ib-hussain.github.io}: 
```
I have attached a picture of the kind of bash 'echo "hello world"' I want at startup.


Start your work. Make no mistakes. I believe in you. Lock in and start working. Do work professionally now and make this production worthy. Do not slack off. think properly and properly implement everything like a serious UI/UX Engineer would. Start working.