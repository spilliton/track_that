# Track That

Track That is a small javascript library that makes implementing [Google Analytics Event Tracking][eventtracking] super easy.  

It requires jQuery 1.3 or greater to use.

## Features

* A DSL for grouping and defining tracking events 
* Allows you to keep tracking functionality seperate from other page logic
* A DevMode for ensuring the correct data is being sent to GA *before* you roll to production
* Uses jQuery's [on()][onfuction] function for event binding, so you can handle js events of all types (defaults to click)
* Can bind events to DOM elements that get loaded via AJAX

## Usage

You first need to download the track_that.js code to your site and ensure it gets loaded by the page.

Now you can start defining event definitions.  These will need to be run after the page is ready.  You should 
also wrap all the definitions in ``` if( TrackThat.enabled() ) ```.  This is not required, but will speed things
up if Google Analytics is not included on the page. 

``` javascript
$(document).ready( function(){
  if( TrackThat.enabled() ){
    TrackThat.category("Home Page", [
      ['Sidebar', 'Callout Click', $('#sidebar_callout')],
      ['Sort Change', 'val()', $('#sorter'), 'select', 'change']
    ]);
  }
});
```

[eventtracking]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
[onfuction]: http://api.jquery.com/on/