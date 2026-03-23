# Improved Performance Metrics [Lighthouse]

Quick Note: This was done with lighthouse testing a mobile device not a desktop device (setting in lighthouse). It provides a more accurate report of some of the bottlenecks the website currently faces. Another note, TBT can be delayed if you just click on another tab when the lighthouse scan is in effect. 

## Home Page 

### Performance Score: 99

- FCP (First Contentful Paint): 1.5 s
- LCP (Last Contentful Paint): 1.8 s
- TBT (Total Blocking Time): 0 ms
- CLS (Cumulative Layout Shift): 0
- Speed Index (how fast they load onto the page): 1.5 s

<br>
NOTES: The logo in the top right can be loaded differently, and there's still some unused JS, but otherwise it's almost perfect as it gets. 

## Services Page 

### Performance Score: 99

- FCP (First Contentful Paint): 1.5 s
- LCP (Last Contentful Paint): 2.8 s
- TBT (Total Blocking Time): 40 ms
- CLS (Cumulative Layout Shift): 0
- Speed Index (how fast they load onto the page): 1.5 s

<br>
NOTES: There's some rendering requests, but for right now, like the previous page it's near perfect, although the images suppose to fit in the service cards aren't applied yet, so that could be a future bottleneck, that could be fixed by adjusting the type of image if needed. 

## Reviews Page

### Performance Score: 99

- FCP (First Contentful Paint): 1.5 s
- LCP (Last Contentful Paint): 1.8 s
- TBT (Total Blocking Time): 0 ms
- CLS (Cumulative Layout Shift): 0.0
- Speed Index (how fast they load onto the page): 1.5 s

<br>
NOTES: Because the reviews aren't images, the only minor bottleneck is the unsused JS and some of the render blocking requests that are intially blocked when loading the page, but it's so minor and has already improved from the base performance metric that a change won't do to much. 

## About Page 

### Performance Score: 78

- FCP (First Contentful Paint): 1.5 s
- LCP (Last Contentful Paint): 3.7 s
- TBT (Total Blocking Time): 10 ms
- CLS (Cumulative Layout Shift): 0 
- Speed Index (how fast they load onto the page): 1.5 s

<br>
NOTES: I think the image type was changed again, because everything decreased in time besides the LCP which went up, meaning the image needs to limited on size, becuase it takes too long to load in. It's an easy bottlneck to fix, but as you can see it still remains an issue. 

## Gallery Page 

### Performance Score: 99

- FCP (First Contentful Paint): 1.5 s
- LCP (Last Contentful Paint): 1.8 s
- TBT (Total Blocking Time): 0 ms
- CLS (Cumulative Layout Shift): 0
- Speed Index (how fast they load onto the page): 1.5 s

<br>
NOTES: Gallery isn't implemeneted, same thing with the about page, if there's large images in terms of bytes the Speed Index and the FCP and LCP might get further delayed, that's really the only bottleneck that we'd have to worry about in the future, because otherwise the page is good in terms of performance 

## Request a Quote Page  

### Performance Score: 99 

- FCP (First Contentful Paint): 1.5 s
- LCP (Last Contentful Paint): 1.8 s
- TBT (Total Blocking Time): 0 ms
- CLS (Cumulative Layout Shift): 0
- Speed Index (how fast they load onto the page): 1.5 s 

<br>
NOTES: Isn't much here, again just so JS code that's probably not necessary, but no big bottleneck or anything that needs to be changed. 

Closing Thoughts: As we go into next sprint to make sure functionality is correct, the mobile display is correct, and anything thats added be implemented correctly, it's important that we make sure that everyhthing is performing at an addequate level, though based on our lab meeting, we'd do so before we deploy. 