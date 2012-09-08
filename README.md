# Track That

A small javascript library that makes implementing [Google Analytics Event Tracking][eventtracking] super easy

Requires jQuery 1.3 or greater

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

It is also  a good idea to wrap this section in ``` if( TrackThat.enabled() ) ```.  This is not required, but will speed things up if Google Analytics is not included on the page. 

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

The two params are a string and an array of event definitions (which are also arrays).

``` javascript
TrackThat.category('Home Page', [
    ['Sidebar', 'Callout Click', $('#sidebar_callout')],
    ['Sidebar', 'Ad Click', $('.sidebar_ad')]
  ]
);
```

The first string in the event definition array is the [Action][gaaction] and the second is the [Label][galabel].
The third element in the array is a jQuery result of the elements you wish to bind the event to, by default the click event will be used.

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

When a link is clicked, the value for the Label will be obtained by calling [text()][jquerytext] on the anchor tag.  If the help link was clicked, it will send the events as 'Navigation', 'Top Nav Click', 'Help'

Other options are:

* 'text()' - calls [text()][jquerytext]
* 'val()' - calls [val()][jqueryval]
* 'attr:xxx' - will call [attr()][jqueryattr] with the parameter you specify (instead of xxx)

[Action][gaaction] and [Label][galabel] values can both be obtained dynamically.  [Category][gacategories] must always be hardcoded.

## Advance Usage

### Tracking Elements Loaded Via AJAX 

The optional 4th element in an event definition is a jQuery selector string to be passed to [on()][onfuction].  For example let's say you have a recommendation widget that ajax loads some links:

``` html
<div id='recommendations'>
  <!-- contents loaded via AJAX -->
</div>
``` 

You could track clicks to anchor tags indside #recommendations like this:

``` javascript
TrackThat.category('Sidebar', [
  ['Recommendation Click', 'attr:href', $('#recommendations'), 'a.rec_link']
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

You can pass any event that [on()][onfuction] allows.

## Dev Mode

When writing a new event definition, it is helpful to test it out.  If you add the following before your event definitions:

``` javascript
TrackThat.devmode = true;
```

This will bypass checks that Google Analytics is actually on the page and will trigger a javascript alert containing the [Category][gacategories], [Action][gaaction] and [Label][galabel] values that would be sent seperated by the pipe character:

```
Sidebar | Recommendation Click | /help_page
```

Don't forget to remove the devmode line when you are done or it will behave the same way in production!


[eventtracking]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
[gacategories]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#Categories
[gaaction]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#Actions
[galabel]: https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#Labels
[jquerytext]: http://api.jquery.com/text/
[jqueryval]: http://api.jquery.com/val/
[jqueryattr]: http://api.jquery.com/attr/
[onfuction]: http://api.jquery.com/on/