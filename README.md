# Track That

Track That is a small javascript library that makes implementing [Google Analytics Event Tracking][eventtracking] super easy.  
For many use cases you won't even need to modify your existing HTML structure or clutter your HTML tags with excess tracking attributes.

It requires jQuery 1.3 or greater to use.

## Features

* A DSL for grouping and defining tracking events 
* Allows you to keep tracking functionality seperate from other page logic
* A DevMode for ensuring the correct data is being sent to GA *before* you roll to production
* Uses jQuery's [on()][onfuction] function for event binding, so you can handle js events of all types (defaults is click)
* Can bind events to DOM elements that get loaded via AJAX

## Basic Usage

### Install and Setup

You first need to add the track_that.js code to your project and ensure it gets loaded by your pages.

Now you can start defining event definitions.  These will need to be run after the page is ready.  
It is also  a good idea to wrap this section in ``` if( TrackThat.enabled() ) ```.  
This is not required, but will speed things up if Google Analytics is not included on the page. 

``` javascript
$(document).ready( function(){
  if( TrackThat.enabled() ){
    // insert tracking definitions here
  }
});
```

Now that you know where to put your calls to TrackThat, lets look at some basic use cases.

### Tracking Clicks

The TrackThat.category() function is used to define a group of events that all share the same [GA Category][gacategories].

It's params are string specifying the category and an array of event definitions (which are also arrays).

``` javascript
TrackThat.category('Home Page', [
    ['Sidebar', 'Callout Click', $('#sidebar_callout')],
    ['Sidebar', 'Ad Click', $('.sidebar_ad')]
  ]
);
```

The first string in an event definition array is the [GA Action][gaaction] and the second is the [GA Label][galabel].
The third element in the array is a jQuery result of the elements you wish to bind the event to, by default the click event will be used.

When a user clicks the matching element, the specified strings will be sent to Google Analytics.  For example, any ```.sidebar_ad``` click will trigger the call
``` javascript
_gaq.push(['_trackEvent', 'Home Page', 'Sidebar', 'Ad Click']);
```

### Dynamic Values for Action and Label

The previous definitions are great if you want to send the same 3 strings to google for all similar events but we often need to track things more dynamically.

For example lets say you want to track usage of a navbar on your site:

``` html
<ul id='top_nav'>
  <li><a href='/home'>HomePage</a></li>
  <li><a href='/artists'>Artists</a></li>
  <li><a href='/help'>Help</a></li>
</ul>
```

You can track all three of these with one event definition

``` javascript
TrackThat.category('Navigation', [
  ['Top Nav Click', 'text()', $('#top_nav a')]
]);
```

When a link is clicked, the value for the Label will be obtained by calling [text()][jquerytext] on the clicked anchor tag.
So if the help link was clicked, it will send the event as 'Navigation', 'Top Nav Click', 'Help'

The following are all the available options:

* 'text()': calls [text()][jquerytext]
* 'val()': calls [val()][jqueryval]
* 'attr:xxx': will call [attr()][jqueryattr] with the parameter you specify (instead of xxx)

Action and Label values can both be obtained dynamically.  Category must always be a hardcoded string.


[eventtracking]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
[gacategories]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#Categories
[gaaction]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#Actions
[galabel]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#Labels
[jquerytext]: http://api.jquery.com/text/
[jqueryval]: http://api.jquery.com/val/
[jqueryattr]: http://api.jquery.com/attr/
[onfuction]: http://api.jquery.com/on/