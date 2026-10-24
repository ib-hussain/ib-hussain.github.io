# Hero 04

## Context
Flexnative UI block — a reusable, composable section reference implementation from the shadcn/ui registry (@flx).

## Description
A two-column editorial hero with a soft background wash and a layered collage of two overlapping images.

## Registry Item
@flx/hero-04

## Stack
- UI: shadcn/ui
- Styling: Tailwind CSS
- shadcn components: Button
- npm: react-wrap-balancer

## Registry Source
https://ui.flexnative.com/r/hero-04.json

## Preview
https://ui.flexnative.com/blocks/hero/hero-04

## Reference Implementation
```tsx
// hero-04.tsx
import Balancer from 'react-wrap-balancer'

import { Button } from '@/components/ui/button'

import { Hero04ArtCollage } from './hero-04-art-collage'

export function Hero04() {
  return (
    <section className="bg-background relative isolate w-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 aspect-2/3 mask-radial-[75%_100%] mask-radial-from-45% mask-radial-to-75% mask-radial-at-top opacity-75 blur-xl md:aspect-square lg:aspect-video dark:opacity-5"
      >
        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2198&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover object-top grayscale"
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-5">
          <h1 className="text-foreground font-serif text-3xl font-normal tracking-tight text-balance sm:text-4xl md:text-5xl">
            <Balancer>A gallery for the work</Balancer>
            <br />
            <Balancer>you are proud of.</Balancer>
          </h1>
          <p className="text-muted-foreground max-w-md text-sm sm:text-base">
            <Balancer>
              Collect, arrange, and publish your art in a space that feels like
              a studio, not a spreadsheet.
            </Balancer>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-3">
            <Button
              className="w-fit rounded-full px-4"
              nativeButton={false}
              render={<a href="#" />}
            >
              Start your gallery
            </Button>
            <Button
              variant="link"
              className="w-fit rounded-full px-4"
              nativeButton={false}
              render={<a href="#" />}
            >
              See examples
            </Button>
          </div>
        </div>

        <div className="w-full">
          <Hero04ArtCollage
            primaryImage="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1131&auto=format&fit=crop"
            secondaryImage="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1144&auto=format&fit=crop"
            primaryAlt="Alt 1"
            secondaryAlt="Alt 2"
          />
        </div>
      </div>
    </section>
  )
}
```

```tsx
// hero-04-art-collage.tsx
export function Hero04ArtCollage({
  primaryImage,
  secondaryImage,
  primaryAlt = '',
  secondaryAlt = '',
}: Readonly<{
  primaryImage: string
  secondaryImage: string
  primaryAlt?: string
  secondaryAlt?: string
}>) {
  return (
    <div className="relative mx-auto w-full max-w-md sm:max-w-lg">
      <div
        aria-hidden
        className="bg-primary/10 pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-40 blur-3xl dark:opacity-25"
      />

      <div className="relative aspect-[4/5] w-[82%] overflow-hidden rounded-2xl shadow-xl outline outline-black/10 dark:outline-white/10">
        <img
          src={primaryImage}
          alt={primaryAlt}
          decoding="async"
          className="size-full object-cover grayscale"
        />
        <div className="from-background/20 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>

      <div className="absolute -right-2 bottom-6 aspect-square w-[42%] rotate-3 overflow-hidden rounded-xl shadow-lg outline outline-black/10 sm:-right-4 dark:outline-white/10">
        <img
          src={secondaryImage}
          alt={secondaryAlt}
          decoding="async"
          className="size-full object-cover grayscale"
        />
      </div>
    </div>
  )
}
```
