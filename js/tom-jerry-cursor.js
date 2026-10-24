/* Source-integrated from assets/tom-and-jerry-cursor.html. Presets retained:
   Tom chase speed 5.5/frame; hitbox 36px; fight 2200ms.
   Disabled for touch input and Bin. Reduced motion keeps Jerry static. */
(()=>{'use strict';if(!matchMedia('(pointer:fine)').matches||document.body.dataset.page==='bin')return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const assetRoot=location.pathname.includes('/tracks/')?'../assets/':'assets/';
const root=document.createElement('div');root.id='tj-cursor-container';root.setAttribute('aria-hidden','true');root.innerHTML=`<img id="tj-jerry" class="tj-sprite" src="${assetRoot}jerry.png" alt=""><img id="tj-tom" class="tj-sprite" src="${assetRoot}tom.png" alt=""><img id="tj-fight" class="tj-sprite" alt="">`;document.body.append(root);document.body.classList.add('cursor-none');
const sync=()=>root.classList.toggle('cursor--loading',document.body.classList.contains('is-loading'));
new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});sync();
if(reduce){root.classList.add('static-cursor');window.addEventListener('mousemove',e=>{root.querySelector('#tj-jerry').style.transform=`translate(${e.clientX-25}px,${e.clientY-25}px)`},{passive:true});return;}
    class TomJerryCursor {
      constructor(options = {}) {
        // DOM Elements
        this.container = document.getElementById('tj-cursor-container');
        this.jerry = document.getElementById('tj-jerry');
        this.tom = document.getElementById('tj-tom');
        this.fight = document.getElementById('tj-fight');

        // Asset Fallbacks (handles online GitHub CDN fallback if local paths aren't found)
        this.setupFallbackAssets();

        // Configurable Physics Options
        this.speed = options.tomSpeed || 5.5;
        this.hitbox = options.hitboxDistance || 36;
        this.fightDuration = options.fightDurationMs || 2200;

        // Coordinates & State
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.jerryPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.tomPos = { x: window.innerWidth / 4, y: window.innerHeight / 4 };
        
        this.jerryFacing = 1; // 1 = right, -1 = left
        this.tomFacing = 1;

        this.isMouseDown = false;
        this.isFighting = false;
        this.hasMouseMoved = false;

        // Telemetry DOM (optional)
        this.uiDistance = document.getElementById('live-distance');
        this.uiState = document.getElementById('live-state');
        this.uiJerrySize = document.getElementById('live-jerry-size');

        this.init();
      }

      setupFallbackAssets() {
        const fallbacks = {
          'tj-jerry': assetRoot+'jerry.png',
          'tj-tom': assetRoot+'tom.png',
          'tj-fight': assetRoot+'fight.gif'
        };

        Object.keys(fallbacks).forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.addEventListener('error', () => {
              console.warn('Cursor asset missing:', id);
              el.src = fallbacks[id];
            }, { once: true });
          }
        });
      }

      init() {
        // Track mouse movement
        window.addEventListener('mousemove', (e) => {
          this.hasMouseMoved = true;
          this.mouse.x = e.clientX;
          this.mouse.y = e.clientY;

          // Check Jerry's movement direction to face left or right
          const dx = this.mouse.x - this.jerryPos.x;
          if (Math.abs(dx) > 1.5) {
            this.jerryFacing = dx > 0 ? 1 : -1;
          }
        }, { passive: true });

        // Click animations (Jerry shrinks from 50px to 32px)
        window.addEventListener('mousedown', () => {
          this.isMouseDown = true;
          this.jerry.classList.add('active-click');
          if (this.uiJerrySize) this.uiJerrySize.textContent = '32 × 32';
        });

        window.addEventListener('mouseup', () => {
          this.isMouseDown = false;
          this.jerry.classList.remove('active-click');
          if (this.uiJerrySize) this.uiJerrySize.textContent = '50 × 50';
        });

        // Start render loop
        requestAnimationFrame(() => this.tick());
      }

      triggerFight(x, y) {
        if (this.isFighting) return;
        this.isFighting = true;
        // Defer the 4 MB source sprite until a chase actually triggers a fight.
        if (!this.fight.getAttribute('src')) this.fight.src = assetRoot+'fight.gif';

        // Hide Tom and Jerry
        this.jerry.style.opacity = '0';
        this.tom.style.opacity = '0';

        // Position fight dust cloud (centered at x - 132.5, y - 60)
        const fightX = x - 132.5;
        const fightY = y - 60;
        
        this.fight.style.setProperty('--fight-x', `${fightX}px`);
        this.fight.style.setProperty('--fight-y', `${fightY}px`);
        this.fight.style.transform = `translate(${fightX}px, ${fightY}px)`;
        this.fight.classList.add('active-fight');

        if (this.uiState) {
          this.uiState.textContent = 'BRAWLING! 💥';
          this.uiState.style.color = '#ff7849';
        }

        setTimeout(() => {
          // Reset fight state
          this.fight.classList.remove('active-fight');
          this.isFighting = false;

          // Give Jerry a head start: knock Tom away
          const angle = Math.random() * Math.PI * 2;
          this.tomPos.x = Math.max(50, Math.min(window.innerWidth - 50, this.mouse.x + Math.cos(angle) * 220));
          this.tomPos.y = Math.max(50, Math.min(window.innerHeight - 50, this.mouse.y + Math.sin(angle) * 220));

          this.jerry.style.opacity = '1';
          this.tom.style.opacity = '1';

          if (this.uiState) {
            this.uiState.textContent = 'Chasing';
            this.uiState.style.color = '#38bdf8';
          }
        }, this.fightDuration);
      }

      teleportTom() {
        this.tomPos.x = Math.random() * (window.innerWidth - 100) + 50;
        this.tomPos.y = Math.random() * (window.innerHeight - 100) + 50;
      }

      tick() {
        if (this.hasMouseMoved && !this.isFighting) {
          // 1. Move Jerry immediately to mouse cursor
          this.jerryPos.x = this.mouse.x;
          this.jerryPos.y = this.mouse.y;

          const jerryOffset = this.isMouseDown ? 16 : 25;
          this.jerry.style.transform = `translate(${this.jerryPos.x - jerryOffset}px, ${this.jerryPos.y - jerryOffset}px) scaleX(${this.jerryFacing})`;

          // 2. Tom pursues Jerry
          const dx = this.jerryPos.x - this.tomPos.x;
          const dy = this.jerryPos.y - this.tomPos.y;
          const distance = Math.hypot(dx, dy);

          // Flip Tom to face Jerry
          if (Math.abs(dx) > 1.5) {
            this.tomFacing = dx > 0 ? 1 : -1;
          }

          // Tom moves towards Jerry
          if (distance > this.hitbox) {
            const vx = (dx / distance) * this.speed;
            const vy = (dy / distance) * this.speed;
            this.tomPos.x += vx;
            this.tomPos.y += vy;
          } else {
            // Collision caught!
            this.triggerFight(this.tomPos.x, this.tomPos.y);
          }

          this.tom.style.transform = `translate(${this.tomPos.x - 25}px, ${this.tomPos.y - 25}px) scaleX(${this.tomFacing})`;

          // Update Live Telemetry
          if (this.uiDistance) {
            this.uiDistance.textContent = `${Math.round(distance)} px`;
          }
        }

        requestAnimationFrame(() => this.tick());
      }
    }


const cursorEngine = new TomJerryCursor({tomSpeed:5.5,hitboxDistance:36,fightDurationMs:2200});
})();
