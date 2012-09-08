# Track That

A small javascript library that makes implementing [Google Analytics Event Tracking][eventtracking] super easy

Requires jQuery 1.3 or greater

## Features

* A DSL for grouping and defining tracking events 
* DevMode for ensuring the correct data is being sent to GA *before* you roll to production
* Uses of jQuery's [on()][onfuction] function means you can handle js events of all types (default is click)
* Bind events to DOM elements that get loaded via AJAX
* Allows you to keep tracking functionality seperate from other page logic

## Basic Usage

### Install and Setup

Add track_that.js to your project and ensure it gets loaded by your pages.

Now you can start defining event definitions.  These will need to be run after the page is ready.  

It is also  a good idea to wrap this section in a call to ```TrackThat.enabled()```.  This is not required, but will speed things up if Google Analytics is not included on the page. 

``` javascript
$(document).ready( function(){
  if( TrackThat.enabled() ){
    // insert tracking definitions here
  }
});
```

Now that you know where to put your calls to TrackThat, lets look at some basic use cases.

### Click Tracking

category() is used to define a group of events that all share the same [Category][gacategories].

The two params are a string and an array of event definitions (also arrays).

``` javascript
TrackThat.category('Home Page', [
    ['Sidebar', 'Callout Click', $('#sidebar_callout')], // event definition 1
    ['Sidebar', 'Ad Click', $('.sidebar_ad')]  // event definition 2
  ]
);
```

The first param in the event definition ('Sidebar') is the [Action][gaaction] and the second ('Callout Click') is the [Label][galabel].
The third is a jQuery result of the element(s) you wish to bind the event to.

When a user clicks the matching element, the specified strings will be sent to Google Analytics.  For example, any ```.sidebar_ad``` click will trigger a
``` javascript
_gaq.push(['_trackEvent', 'Home Page', 'Sidebar', 'Ad Click']);
```

Google Analytics only requires a [Category][gacategories] and [Action][gaaction].  If you wish to omit [Label][galabel], you can pass ```''``` or ```null``` for the label param. 

### Dynamic Values

The previous definitions are great if you want to send the same 3 strings to google for similar events but we often need to track things more dynamically.  For example lets say you want to track usage of a navbar:

``` html
<ul id='top_nav'>
  <li><a href='/home'>HomePage</a></li>
  <li><a href='/artists'>Artists</a></li>
  <li><a href='/help'>Help</a></li>
</ul>
```

You can track all three with one event definition

``` javascript
TrackThat.category('Navigation', [
  ['Top Nav Click', 'text()', $('#top_nav a')]
]);
```

When a link is clicked, the value for the Label will be obtained by calling [text()][jquerytext] on the anchor tag.  For example if the help link was clicked, it would send 'Navigation', 'Top Nav Click' and 'Help'.

Other dynamic options are:

* 'text()' - calls [text()][jquerytext]
* 'val()' - calls [val()][jqueryval]
* 'attr:xxx' - will call [attr()][jqueryattr] with the parameter you specify in place of xxx

[Action][gaaction] and [Label][galabel] values can both be obtained dynamically but [Category][gacategories] must be a hardcoded string.

## Advance Usage

### AJAX Loaded Elements  

The optional 4th param in an event definition is a jQuery selector to be passed to [on()][onfuction].  For example let's say you have a recommendation widget that loads some links in after the fact:

``` html
<div id='recommendations'>
  <!-- contents loaded via AJAX -->
</div>
``` 

You could track clicks to anchor tags indside #recommendations like this:

``` javascript
TrackThat.category('Sidebar', [
  ['Recommendation Click', 'attr:href', $('#recommendations'), 'a']
]);
```

### Non-Click Event Types

The final param to the event definition array is an event type.  By default this is 'click', but let's say you have a select tag and you would like to track when a user changes it's value.  You could do the following:

``` javascript
TrackThat.category('Filter Controls', [
  ['Dropdown Change', 'val()', $('#filter_controls'), 'select.sorter', 'change']
 ]
);
```

You can pass any event name that [on()][onfuction] understands.

## Dev Mode

If you set the following before your calls to ```category()``` ( and to TrackThat.enabled() )

``` javascript
TrackThat.devmode = true;
```

a javascript alert will trigger containing the [Category][gacategories], [Action][gaaction] and [Label][galabel] values that would be sent seperated by the pipe character.  It looks like:

```
Sidebar | Recommendation Click | /help_page
```

Don't forget to remove the devmode line when you are done or it will behave the same way in production!

## Thanks

To my co-workers at [Moxie Software][moxiesoft] for their feedback and input on this


[eventtracking]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
[gacategories]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#Categories
[gaaction]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#Actions
[galabel]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#Labels
[jquerytext]: http://api.jquery.com/text/
[jqueryval]: http://api.jquery.com/val/
[jqueryattr]: http://api.jquery.com/attr/
[onfuction]: http://api.jquery.com/on/
[moxiesoft]: http://www.moxiesoft.com/