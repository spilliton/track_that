/*!
 * track_that javascript library
 *
 * Date: Sept 8, 2012
 * Requires: jQuery v1.3+
 *
 * Copyright 2012, Zachary Kloepping
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * More info at https://github.com/spilliton/track_that
*/

// Util function for checking if value is null or empty
(function($){$.isBlank = function(obj){return(!obj || $.trim(obj) === "");};})(jQuery);

var TrackThat = {

  /**
  *  Set TrackThat.devmode = true when you wish to test locally.
  *  This will bypass the checks to ensure that Google Analytics are
  *  loaded, and will run the track that code as it would in production
  *  except it will pop a js alert box instead of sending events to GA
  *  The alert box will contain the three strings it sends to GA like so
  *
  *  Your Category | Your Action | Your Label
  */
  devmode: false,

  /**
  *  The category function is the bread and butter of TrackThat.
  *  You specify a string that is the category to be sent to GA and
  *  an array of TrackThat event definitions.  Ex:
  *
  *  $(document).ready(function() {
  *    TrackThat.category('Home Page', [
  *      ['Sidebar', 'Callout Click', $('#sidebar_callout')],
  *      ['Sort Change', 'val()', $('#sorter'), 'select', 'change'],
  *      ['Banner Click', '', $('#banner')]
  *    ]);
  *  });
  *
  *  An event definition is an array of arguments that describe what
  *  elements should be tracked, what strings should be send to GA when
  *  they get triggered, and on what event they should be triggered.
  *  The order of the required params are as follows:
  *
  *  ['Action', 'Label', jQueryElement]
  *  
  *  The Action and Label params are the strings that get sent to GA.
  *  If you wish to omit Label, you must pass null or an empty string.
  *  Action/Label params may also specify special strings to obtain their
  *  values dynamically from the element on which the event is occurring.
  *  Special values for Action/Label are:
  *  
  *  'val()'    : will obtain the string by calling val() on the element
  *  'text()'   : same as val() but calls text()
  *  'attr:xxx' : where xxx is an attribute name on the element, ex: 'attr:href' or 'attr:data-label'
  *
  *  The last two optional params to the definition array are Scope and EventType.  
  *  click is the default event type (http://api.jquery.com/click/)  
  *
  *  TrackThat binds events to DOM elements using jQuery on() (http://api.jquery.com/on/)
  *  If you pass a Scope string, that string will be passed as the selector argument to the on function.
  *  This allows you to bind multiple analogous events with one event definition. For example lets say you have
  *  a menu bar that looks like this:
  *
  *  <ul id='top_nav'>
  *    <li><a href='/home'>HomePage</a></li>
  *    <li><a href='/artists'>Artists</a></li>
  *    <li><a href='/help'>Help</a></li>
  *  </ul>
  *   
  *  And you would like to track everytime one of the links is clicked.  You could use:
  *   ['Top Nav Click', 'text()', $('#top_nav'), 'a']
  * 
  *  or if you wanted to instead track the href:
  *   ['Top Nav Click', 'attr:href', $('#top_nav'), 'a']
  *
  *  This would work even if the contents of the ul were rendered via ajax because TrackThat
  *  uses the jquery on() method like so:
  *
  *   $('#top_nav').on('click', 'a', handler)
  *
  *  As mentioned above, 'click' is the assumed event, but you can pass any event 
  *  that the jquery on() method understands.  For example to track changes to a dropdown:
  *
  *  ['Dropdown Change', 'val()', $('#filter_controls'), 'select.sorter', 'change']
  */
  category: function (category, events){
    if(TrackThat.enabled){
      $.each(events, function(index, arr){
        opts = {
          category: category,
          action: arr[0], 
          label: arr[1], 
          element: arr[2]
        };

        if(arr.length > 3){
          opts.scope = arr[3];
          if(arr.length > 4){  
            opts.event_type = arr[4];
          }
        }
        TrackThat.attachEvent(opts);
      });
    }
  },

  /** 
  *  Used to manually trigger an event to be sent to google analytics.
  *  Calling this should be a last resort.  A common reason to use
  *  is another event handler is already bound (possibly by a plugin)
  *  and it is preventing the tracking action from being sent.  
  *  Then you would call something like this inline when you want it to track:
  *
  *  TrackThat.pushEvent($(this), {category: 'Homepage', action: 'Sidebar', label: 'text()'} )
  *
  *  label is the only optional param.
  */
  pushEvent: function (elem, opts){
    if(TrackThat.enabled()){
      if( !(elem instanceof jQuery) ){ console.log('TrackThat.pushEvent requires a jQuery element as first param!'); return; }
      if ( $.isBlank(opts.category) ){ console.log('TrackThat.pushEvent requires a non blank category to be passed in opts!'); return; }
      if ( $.isBlank(opts.action) ){ console.log('TrackThat.pushEvent requires a non blank action to be passed in opts!'); return; }

      var action = TrackThat.valueFromOption(elem, opts.action);
      var label = '';
      if(opts.label != null){ label = TrackThat.valueFromOption(elem, opts.label); }

      if( TrackThat.devmode ){ alert(opts.category+' | '+action+' | '+label); }
      else{ _gaq.push(['_trackEvent', opts.category, action, label]);  }
    }
  },

  /**
  *  You may wish to optimize your event definitions by never running them 
  *  if GA isn't installed or we are not in devmode.  You can do this by wrapping
  *  your definitions in a large 'if' block like so:
  *
  *  if( TrackThat.enabled() ){
  *   ...all your calls to TrackThat.category() ...
  *  } 
  *
  */
  enabled: function(){
    if( typeof _gaq != 'undefined' || TrackThat.devmode )
      return true;
    else
      return false;
  },

  /**
  *  Used internally by TrackThat
  *  Calls the jQuery on() function with the appropriate params
  */
  attachEvent: function (opts){
    if( opts.element != null && opts.element.length > 0 ){
      var event_type = "click";
      if(opts.event_type != null){
        event_type = opts.event_type;
      }
      opts.element.on(event_type, opts.scope, function(e){
        TrackThat.pushEvent($(this), opts);
      });
    }
  },

  /**
  * Used by TrackThat to parse dynamic valued options
  */
  valueFromOption: function (elem, option){
      if(option == 'val()') { return elem.val();  }
      if(option == 'text()'){ return elem.text(); }
      if(option.indexOf('attr:') == 0 ) {
        attr_name = option.split(':')[1];
        return elem.attr(attr_name);
      }
      return option;
  }
};