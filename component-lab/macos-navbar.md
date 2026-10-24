## SOURCE: 
https://codepen.io/vihanga/pen/gOmXvRr

## HTML:
```html
<div class="dock">
  <div class="dock-container">
    <li class="li-1">
      <div class="name">Finder</div>
      <img class="ico" src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853981255cc36b3a37af_finder.png" alt="">
    </li>
    <li class="li-2">
      <div class="name">Siri</div>
      <img class="ico" src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853ff3bafbac60495771_siri.png" alt="">
    </li>
    <li class="li-3">
      <div class="name">LaunchPad</div>
      <img class="ico" src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853943597517f128b9b4_launchpad.png" alt="">
    </li>
    <li class="li-4">
      <div class="name">Contacts</div>
      <img class="ico" src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853743597518c528b9b3_contacts.png" alt="">
    </li>
    <li class="li-5">
      <div class="name">Notes</div>
      <img class="ico" src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853c849ec3735b52cef9_notes.png" alt="">
    </li>
    <li class="li-6">
      <div class="name">Reminders</div>
      <img class="ico" src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853d44d99641ce69afeb_reminders.png" alt="">
    </li>
    <li class="li-7">
      <div class="name">Photos</div>
      <img class="ico" src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853c55558a2e1192ee09_photos.png" alt="">
    </li>
    <li class="li-8">
      <div class="name">Messages</div>
      <img class="ico" src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853a55558a68e192ee08_messages.png" alt="">
    </li>
    <li class="li-9">
      <div class="name">FaceTime</div>
      <img class="ico" src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f708537f18e2cb27247c904_facetime.png" alt="">
    </li>
    <li class="li-10">
      <div class="name">Music</div>
      <img class="ico" src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853ba0782d6ff2aca6b3_music.png" alt="">
    </li>
    <li class="li-11">
      <div class="name">Podcasts</div>
      <img class="ico" src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853cc718ba9ede6888f9_podcasts.png" alt="">
    </li>
    <li class="li-12">
      <div class="name">TV</div>
      <img class="ico" src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f708540dd82638d7b8eda70_tv.png" alt="">
    </li>
    <li class="li-12">
      <div class="name">App Store</div>
      <img class="ico" src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853270b5e2ccfd795b49_appstore.png" alt="">
    </li>
    <li class="li-14">
      <div class="name">Safari</div>
      <img class="ico" src="https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853ddd826358438eda6d_safari.png" alt="">
    </li>
    <li class="li-bin li-15">
      <div class="name">Bin</div>
      <img class="ico ico-bin" src="https://www.icons101.com/icons/98/Yosemite_Flat_Icons_by_dtafalonso/128/Trash%20Empty.png" alt="">
    </li>

  </div>
</div>
```

## CSS:
```css
*,
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: "San Francisco";
}

@font-face {
  font-family: "San Francisco";
  font-weight: 400;
  src: url("https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-regular-webfont.woff");
}

@font-face {
  font-family: "San Francisco";
  font-weight: 800;
  src: url("https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-bold-webfont.woff");
}

body {
  background: url(https://4kwallpapers.com/images/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-2880x1800-1455.jpg);
  background-size:cover;
}

.dock {
  width: auto;
  height: 60px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);

  .dock-container {
    padding: 3px;
    width: auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    background: rgba(83, 83, 83, 0.25);
    backdrop-filter: blur(13px);
    -webkit-backdrop-filter: blur(13px);
    border: 1px solid rgba(255, 255, 255, 0.18);

    .li-bin {
      margin-left: 20px;
      border-left: 1.5px solid rgba(255, 255, 255, 0.4);
      padding: 0px 10px;
    }
    .li-1 {
      &::after {
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        content: "";
        bottom: 2px;
      }
    }

    li {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      vertical-align: bottom;
      transition: 0.2s;
      transform-origin: 50% 100%;
      &:hover {
        margin: 0px 13px 0px 13px;
      }

      .name {
        position: absolute;
        top: -70px;
        background: rgba(0, 0, 0, 0.5);
        color: rgba(255, 255, 255, 0.9);
        height: 10px;
        padding: 10px 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        visibility: hidden;
        &::after {
          content: "";
          position: absolute;
          bottom: -10px;
          width: 0;
          height: 0;
          backdrop-filter: blur(13px);
          -webkit-backdrop-filter: blur(13px);
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid rgba(0, 0, 0, 0.5);
        }
      }

      .ico {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: 0.2s;
        display: inline-block;
        transition: transform 0.3s ease;
      }
      .ico-bin {
        width: 94% !important;
        height: 94% !important;
        object-fit: cover;
        transition: 0.2s;

        &:hover {
          margin-left: 10px;
        }
      }
    }
  }
}

@for $i from 1 through 15 {
  .li-#{$i}:hover {
    .name {
      visibility: visible !important;
    }
  }
}
```
---

## JS:
```javascript
const icons = document.querySelectorAll(".ico");

const resetIcons = () => {
  icons.forEach((item) => {
    item.style.transform = "scale(1) translateY(0px)";
  });
};

icons.forEach((item, index) => {
  item.addEventListener("mouseover", () => focus(index));
  item.addEventListener("mouseleave", resetIcons);
});

const focus = (index) => {
  resetIcons();
  const transformations = [
    { idx: index - 2, scale: 1.1, translateY: 0 },
    { idx: index - 1, scale: 1.2, translateY: -6 },
    { idx: index, scale: 1.5, translateY: -10 },
    { idx: index + 1, scale: 1.2, translateY: -6 },
    { idx: index + 2, scale: 1.1, translateY: 0 }
  ];

  transformations.forEach(({ idx, scale, translateY }) => {
    if (icons[idx]) {
      console.log(scale);
      icons[
        idx
      ].style.transform = `scale(${scale}) translateY(${translateY}px)`;
    }
  });
};
```