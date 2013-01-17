/*!*
*	Yellow Text
*	=========================================
*	This plugin is created to make text editing
*	more fun and to make it easy for the editor.
*
*	Version: 0.2
*	Author: Stefan Vermaas
*	URL: www.stefanvermaas.nl
*
*/
(function( $ ) {

	// Define the plugin methods
	var methods = {
		
		// Call the initialization function
		init: function( that, options ) {
			
			// Create the global this element
			this.el = that;
			
			/**
			*
			*	Settings
			*	=========================================
			*	This part of the plugin contains the settings
			*	that are default. Feel free to override them
			*	during intialization of the plugin.
			*
			*	For an example, see javascripts/demo.js
			*
			*/
			this.settings = $.extend( {
				"width"           : "100%",
				"height"          : "300px",
				"containerClass"  : "js-editor-container",
				"buttonsClass"    : "js-editor-buttons",
				"iFrameClass"     : "js-editor-iframe",
				"formID"          : "js-editor-form",
				"cleanOnSubmit"   : true,
				"defaultFont"     : "Helvetica Neue, Helvetica, arial, sans-serief",
				"defaultFontSize" : "1em",
				"defaultFontColor": "#000000",
				"defaultActions"  : "bold, underline, italic, strikethrough, align-left, align-center, align-right, unorderd-list, ordered-list, link, image"
			}, options);
			
			// Render the plugin
			this.render();
			
			// Grap the content and put it in the iframe
			this.getContent();			
			
			// React on clicks
			this.events();
			
		},
			
		/**
		*
		*	Render
		*	=========================================
		*	This function renders the whole plugin and 
		*	it's only used to build the plugin.
		*
		*/	
		render: function() {
			
			// Render the new text editor
			this.createTextEditor();
			
			// Render the buttons
			this.createButtons();
			
		},
		
		/**
		*
		*	createTextEditor
		*	=========================================
		*	This part of the plugin builds the main
		*	elements of the new text editor
		*
		*/
		createTextEditor: function() {
			
			// Hide the current text field
			$(this.el).hide();
			
	        // Create a container which will hold or text editor
	        this.container = $("<div />").addClass( this.settings.containerClass ).css({
	          "float"   : "left",
	          "width"   : this.settings.width,
	          "border"  : "1px solid #ccc"
	        });
	        
	        // Add the container after the element where we bind this plugin too
	        $(this.el).after( this.container );
	
	        // Create the iFrame and append to the previously created container
	        this.editor = $("<iframe />").addClass( this.settings.iFrameClass ).css({
	          "float"   : "left",
	          "width"   : this.settings.width,
	          "height"  : this.settings.height,
	          "border"  : "0",
	          "overflow": "hidden"
	        }).appendTo( this.container ).get(0);
	
	        // Make the editor work in all browsers
	        this.editor.contentWindow.document.open();
	        this.editor.contentWindow.document.close();
	        this.editor.contentWindow.document.designMode="on";
	
	        // Set the standard fonts etc
	        $(this.editor).contents().find("body").css({
	          "word-wrap"     : "break-word",
	          "font-family"   : this.settings.defaultFont,
	          "font-size"     : this.settings.defaultFontSize,
	          "color"         : this.settings.defaultFontColor
	        });
	
	        // Add some css to the iFrame
	        var iFrameCSS = '<style type="text/css">body{padding: 2%;} p { margin: 0; }</style>';
	        $(this.editor).contents().find("head").append(iFrameCSS);
	        
	        // Build the button container
	        this.buttons = $("<div />").addClass( this.settings.buttonsClass ).css({
	          "float"   : "left",
	          "width"   : this.settings.width
	        }).prependTo( this.container );	
		},
		
		/**
		*
		*	getContent
		*	=========================================
		*	This function is called after the plugin
		*	has initialized and it graps the content
		*	that's inside the text field where the plugin
		*	is attached too.
		*
		*/		
		getContent: function() {
	
	        // Grap the content of the textarea
	        var content = $(this.el).text();
	
	        // Put the content of the textarea into the editor
	        $( this.editor ).contents().find("body").append(content);
		},		
				
		/**
		*
		*	createButtons
		*	=========================================
		*	This part of the plugin build all the buttons
		*	that are defined by the user or it takes the 
		*	default buttons.
		*
		*/
		createButtons: function() {
			
			// Define the "to make buttons"
			var defaultOptions = this.settings.defaultActions.split(/, ?/);
			
			// Loop through all the buttons
			for( i = 0; i < defaultOptions.length; i++ ) {
				
				// Create a variable to store the object in
				var button;
				
				// Get the right value
				switch( defaultOptions[i] ) {
					case "bold" :
						button = { content : "b", command : "bold" };
					break;
					case "underline" :
						button = { content : "u", command : "underline" };
					break;
					case "italic" :
						button = { content : "i", command : "italic" };
					break;
					case "strikethrough" :
						button = { content : "s", command : "strikethrough" };
					break;
					case "align-left" :
						button = { content : "left", command : "JustifyLeft" };
					break;
					case "align-center" :
						button = { content : "center", command : "JustifyCenter" };
					break;
					case "align-right" :
						button = { content : "right", command : "JustifyRight" };
					break;
					case "unorderd-list" :
						button = { content : "ul", command : "InsertUnorderedList" };
					break;
					case "ordered-list" :
						button = { content : "ol", command : "InsertOrderedList" };
					break;
					case "image" :
						button = { content : "img", command : "image" };
					break;
					case "link" :
						button = { content : "link", command : "link" };
					break;
					default :
						button = { content : "", command : "" };
				}
				
		        // Build the buttons and add before the container
		        $("<a />")
		        	.addClass( button.command )
		        	.text( button.content )
		        	.attr( "data-command", button.command )
		        	.appendTo( this.buttons );
			}
		},
		
		/**
		*
		*	Events
		*	=========================================
		*	Listen to specific events. The events that 
		*	are justed in this plugin are click, keydown
		*	and submit event
		*
		*	With the click event we can detect a click on
		*	a button to modify the text.
		*
		*	With the keydown event we can detect or the 
		*	user uses shortkeys for editing text.
		*
		*/		
		events: function() {
		
			// Define that
			var that = this;
			
			// Bind to the click event on the buttons
			$("." + this.settings.buttonsClass + " a").on("click", function(e) {
				
				// React on the button event
				that.buttonClicked( e, this );
				
			});
			
			// Bind to the keypress event while typing
			$( this.editor ).contents().find("body").on("keydown", function(e) {
				
				// Check for a specific keycode
				if( e.ctrlKey || e.metaKey ) {
					that.shortkey( e, this );
				}
				
			});
			
			// Bind to the submit event of the form
			$( this.settings.formID ).on("submit", function(e) {
				
				// First clean the code
				this.cleanTheCode();
				
				// Put the content back in the textfield
				this.putContentBack();
				
				return false;
				
			}); 
			
		},
		
		/**
		*
		*	buttonClicked
		*	=========================================
		*	This function reacts on the fact that a
		*	button is clicked. Based on the button an
		*	action will be triggered
		*
		*/
		buttonClicked: function( e, that ) {

            // Get the command
            var command = $(that).attr("data-command");

            // Focus on the contentWindow
            this.editor.contentWindow.focus();

            // Take an other look at the command and look for the perfect action and execute it
            this.runCMD( command );

            // And focus back again on the contentWindow
            this.editor.contentWindow.focus();				
		}, 
		
		/**
		*
		*	shortkey
		*	=========================================
		*	Wanna use a shortkey? This function takes
		*	care for that. You can quickly edit the text
		*	by using those shortkeys.
		*
		*	Currently you can use cmd/ctrl + b, cmd/ctrl + i
		*	and cmd/ctrl + u to make your text bold, italic
		*	or underlined.
		*
		*/		
		shortkey: function( e ) {
			
			// Define command
			var command;			
			
			// Focus on the contentWindow
			this.editor.contentWindow.focus();
			
			// Detect for simple actions their functions
			if( e.which === 66 ) { 
				command = "bold";
			} else if( e.which === 73 ) { 
				command = "italic";
			} else if( e.which === 85 ) {
				command = "underline";
			} else {
				command = "";
			}
			
			// Run the command
			this.runCMD( command );
			
			// And focus back again on the contentWindow
			this.editor.contentWindow.focus();	
		},
		
		/**
		*
		*	runCMD
		*	=========================================
		*	This is the real deal. This part of the 
		*	script handles the actual commands and it 
		*	can be used by every other function as long
		*	as it provides a command to execute.
		*
		*/		
        runCMD: function( cmd ) {

          // Check the command and run it
          switch( cmd ) {
            case "image" :
              var image = prompt("URL (example: http://www.google.com): ");
              return this.editor.contentWindow.document.execCommand( "InsertImage", false, image);
            case "link" :
              var link = prompt("URL (example: http://www.google.com): ");
              return this.editor.contentWindow.document.execCommand( "CreateLink", false, link);
            default :
              return this.editor.contentWindow.document.execCommand( cmd );
          }
        },
        
		/**
		*
		*	cleanTheCode
		*	=========================================
		*	Now we're cleaning up someone's shit. The 
		*	browsers insert really nasty code ( not semantic )
		*	in our text editor, but that won't stop us!
		*
		*	We're gonna fight back. This function cleans
		*	the code and makes it pretty. Just like we want too.
		*
		*/        
        cleanTheCode: function() {
			
			// Define the body element
			var body = $(this.editor).contents().find("body");
			
			// Loop through each div tag and change it to a p tag
			body.find("div").each( function() {
				// Get the class if avaiable
				var hasStyle = ( $(this).attr("style") ) ? true : false;
			
				// Check or a element is not wrapped
				if( $(this).parent("p").not("p") ) {
			
					// Change the div elements to normal p tags
					if( hasStyle ) {
						// Wrap the content into p tags with the style
						$(this).wrap("<p style=\"" + $(this).attr('style') + "\"></p>");
					} else {
						// Wrap the content into p tags
						$(this).wrap("<p></p>");
					}
				}
			
				// Unwrap all the div tags
				$(this).contents().unwrap();
			});
			
			// Unwrap all br tags and remove the ugly div tags
			body.find("br").unwrap();
						
			// Find the first line
			var firstLine = body.contents()[0];
			
			// Check or the first line has a p tag surrounding it
			if( body.find(firstLine).not("p") ) {
				// The first line does not have a p tag
				body.find(firstLine).wrap("p");
			}
        },
        
		/**
		*
		*	putContentBack
		*	=========================================
		*	This function is triggered on the submit
		*	event and is needed to put the content of 
		*	the texteditor back in the text field
		*	where the plugin is binded too.
		*
		*/        
        putContentBack: function() {
			// Grap the content of the iframe
			var postData = $(this.editor).contents().find("body").html();

			// Add the data to the textarea, where this plugin is attached too
			this.el.html(postData);
        }
		
	};
	
	
	// Initialize the plugin	
	$.fn.texteditor = function( method ) {
	
		// Make sure the text editor can bind to all the HTML elements
		return this.each( function() {
		
			// Check for methods
			if ( methods[method] ) {
				
				// This is a method, make sure this happens ( not used in v0.2 )
				return methods[method].apply( this, Array.prototype.slice.call( method, 1 ));
			} else if ( typeof method === 'object' || ! method ) {
				
				// No specific method is found, just initialize the plugin
				return methods.init( this, method );
			} else {
				
				// Method doesn't excist for this plugin
				$.error( 'Method ' +  method + ' does not exist on jQuery.texteditor' );
			} 
		});

	};	

})( jQuery );