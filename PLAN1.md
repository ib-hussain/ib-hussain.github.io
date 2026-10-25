# Portfolio Design Plan
 
### Places from where we will take inspiration for components & elements (we don't have source code for these but I will take features from them and tell you what exactly to do):
- https://achint.vercel.app/
- https://aditya-chauhan.vercel.app/
- https://portfolio-mti1.vercel.app/
- https://ross.aleksei.digital/
- https://kaisermann.me/

### Places from where we will borrow components & elements (as we already have the source codes of these repositories in `dev-portfolios/` folder):
- https://aadarshrai.vercel.app/
- https://aahana-surya.github.io/
- https://mal1k.xyz/
- https://akkila.dev/#top

## Plan
We will be building everything in HTML - CSS - JS. There needs to be a consistent theme throughout the website. It should not be things coupled together. We will develop iteratively. At first we will put things together and then slowly I will put together the theme and bring it together.

### For the entire portfolio these are your basic instructions and requirements:
- Go to [dev-portfolios/Aadarshrai1801-Portfolio/](dev-portfolios/Aadarshrai1801-Portfolio/) and from there (specifically from `dev-portfolios/Aadarshrai1801-Portfolio/src/components/PageLoader.jsx`) we will take the whole idea and implementation of the fact that whenever a user for the first time opens up the index page(not when user naviagtes to that page from another page on the site, just that each time after closing the website whenever user opens it again or when user opens it on the first time or when he reloads the index.html page) then the user is greeted in English, Arabic script Urdu, Italian with:
    - 'Hello!'
    - '!السلام علیکم'
    - 'Ciao!'
    
    and as all three of these change like they do in the animation of [dev-portfolios/Aadarshrai1801-Portfolio/](dev-portfolios/Aadarshrai1801-Portfolio/) but in our case at the bottom of the screen there will also be written `echo "hello world"` in a bash terminal font with bash terminal background color and the text will be in white color and the text will be in a typewriter effect. The text will be written in a way that it looks like it is being typed in a bash terminal. The cursor will be block and blinking at the end of the text. This whole welcome screen will at max take 1 second, after 1 second it will automatically go up with the same transition effect as in [dev-portfolios/Aadarshrai1801-Portfolio/](dev-portfolios/Aadarshrai1801-Portfolio/) and the index.html page will be loaded. 

- MacOS 3 button project card. Each project card has the 3 macos buttons at the top right corner.
- The navbar for the website is the same as the MacOS Dock from [macos-navbar.md](macos-navbar.md) and it will be fixed at the bottom and as soon as the user scrolls-down the width of the dock, the dock will come to the top of the screen and invert itself vertically. Which means the magnification now goes not from down to up but from up to down because the dock is at top of the screen. The dock will also show on hover the names of the icons in a tooltip. 
- The navbar of the website needs to also be like the [@kokonutui/morphic-navbar.tsx](@kokonutui/morphic-navbar.tsx) and it needs to have 3 different places where it will be set. It needs to have in the top-left corner detached from the MacOS dock my picture `my-logo.jpg` in fully circle for going back to index.html page from any other page. On the top-right corner is the circle theme changing button. Both these buttons/icons/elements are detached from main navbar but stay consistent with it's theme and styling and algnment.
- The index.html background will for the first draft be [@kokonutui/halftone-background2.html](@kokonutui/halftone-background2.html) for the entire first page no matter if you scroll it.
- The footer will be [21st.dev/@kedhareswer/components/ridgeline-dither-footer/Component2.html](21st.dev/@kedhareswer/components/ridgeline-dither-footer/Component2.html) and it will be fixed at the bottom of the page. The footer will have a dithered effect and it will be a ridgeline effect. The footer will also have a button which when clicked will take the user to the top of the page. The button will be a circle with an arrow pointing up. The button will have a hover effect which will make it look like it is being pressed down. The button will also have a tooltip which will say "Back to top". The footer when fully visible will not allow for the user to see the MacOS navbar as it will become hidden. As the user scrolls up, then the macos navbar starts becoming visible
- We will need a planet animation with the planet rotating. That animation we will need for showcasing our skills and that will be boorrowed from [dev-portfolios/aahana-surya.github.io](dev-portfolios/aahana-surya.github.io) so since it is already implemented in that, for first iteration let's just copy it entirely. Then customise it.
- If any html file is named as `**2.html` then it means that it's html implementation was not properly or not perfectly made by you from the tsx version due to which it was again made from the `.tsx` file. If the original file you made didnot exist then the new implementattion is better and should be used. If both files exist(yours and new one) then both are equally good. If the new file exists but does not contain the code, then it's code is being worked upon.
- Use [@kokonutui/theme-changer2.html](@kokonutui/theme-changer2.html) for the theme changing functionality. It will be a button on top right of the screen and when it will be dark mod ethen the button would be the light version of it and in light mode the button will be it's dark mode version. The animation of the button needs to be there.
