# Baseline Performance Metrics [Lighthouse]

Quick Note: This was done using "npm run preview" which is a more accurate build then the noraml "npm run dev" we usually use to work on the website. I did this to test that perfomance metrics more accurately because naturally in the dev build the performance is bad, which is an expected outcome. 

## Home Page 

### Performance Score: 96

- FCP (First Contentful Paint): 1.5 s
- LCP (Last Contentful Paint): 2.7 s
- TBT (Total Blocking Time): 0 ms
- CLS (Cumulative Layout Shift): 0
- Speed Index (how fast they load onto the page): 1.5 s

<br>
NOTES: There were no critcal bottlenecks in the review, if it's needed to improve we could change how the LCP is loaded (the text). The image delievery of the logo in the top right could also be changed, and there's so unused JS that doesn't need to be loaded in, but in the grand scheme of things there's no major improvement or change needed for the performance. 


## Services Page 

### Performance Score: 96

- FCP (First Contentful Paint): 1.5 s
- LCP (Last Contentful Paint): 2.7 s
- TBT (Total Blocking Time): 0 ms
- CLS (Cumulative Layout Shift): 0
- Speed Index (how fast they load onto the page): 1.5 s

<br>
NOTES: No major bottleneck in this page either, if the images we are to use do get approved and we put them on the website, we might get some unoptimized image issues which could ultimately slow the page down. Otherwise, some unused JS, and some warnings about chaining requests since this page is part of a folder or "chain", so reducing the length of the chain could improve the download size of resources, or deferring the download of unnecessary resources to improve page load

## Reviews Page

### Performance Score: 96

- FCP (First Contentful Paint): 1.5 s
- LCP (Last Contentful Paint): 2.7 s
- TBT (Total Blocking Time): 0 ms
- CLS (Cumulative Layout Shift): 0.012
- Speed Index (how fast they load onto the page): 1.5 s

<br>
NOTES: Again, not much here to fix either in terms of bottlenecks, I believe it needs to be established what the reviews are stored as, and if they need to be stamped on the page, or something that we think the client can change based on ones in the DB. Once that's established we can probably fix an image delivery issue that stalls the page a little. There's also some unused JS, so again just to save some bytes, fixing the unused JS until its actually needed would decrease bytes consumed by network activity.

## About Page 

### Performance Score: 87

- FCP (First Contentful Paint): 1.5 s
- LCP (Last Contentful Paint): 3.7 s
- TBT (Total Blocking Time): 10 ms
- CLS (Cumulative Layout Shift): 0 
- Speed Index (how fast they load onto the page): 1.5 s

<br>
NOTES: The biggest bottleneck here is that the size of the photo causes the LCP to be 3.7s which causes some delay. There's also a layout shift, which is caused by the large image on the about page, it would be wize to give the image a limited width and height so it fixes the layoutshift so it doesn't mess with how it's percieved on both deskptop and mobile. 

## Gallery Page 

### Performance Score: 96

- FCP (First Contentful Paint): 1.5 s
- LCP (Last Contentful Paint): 2.8 s
- TBT (Total Blocking Time): 20 ms
- CLS (Cumulative Layout Shift): 0
- Speed Index (how fast they load onto the page): 1.6 

<br>
NOTES: This has the same problems as the previous pages where the bottlenecks are very small, however it should without improvements not be this high of a score and that's due to the fact that gallery is either not downloading and presenting the images correctly, or the images in the gallery don't exist yet, not much to improve yet on the performance end. 

## Request a Quote Page  

### Performance Score: 96 

- FCP (First Contentful Paint): 1.5 s
- LCP (Last Contentful Paint): 2.7 s
- TBT (Total Blocking Time): 0 ms
- CLS (Cumulative Layout Shift): 0
- Speed Index (how fast they load onto the page): 1.5 s 

<br>
NOTES: Very basic page that's just meant for a user to fill out information into our DB, so the page itslef is good, there's just some unused java and some chain issues becuase this page is a child of a different chain, while also linking to our DB to store data, so that issue slows it up a little, but not much is really needed to be done to improve performaance

## Closing thoughts 

Performance overall is great, images really just need to be fixed based on how they load into our website, because it messes with the speeds. There's also just a lost of unused JS that can easily be fixed so it doesn't cause any delays. 