/* ----------------------------------------
Accordion Functions
---------------------------------------- */
$(document).ready(function() {
   var accordion = $('.accordion');
    
    accordion.click(function(e) {
        e.preventDefault();
        
        if ($('+ .accordion-content', this).length > 0) {
            $(this).toggleClass('open');
            $('+ .accordion-content', this).stop()
                .slideToggle(250);
        } else {
            console.error('No immediate sibling with the "accordion-content" class exists.');
        }
    });
});

/* ----------------------------------------
Alert Functions
---------------------------------------- */
$(document).ready(function() {
    var alertElement = $('.alert'),
        openAlertLink = $('.js-open-alert'),
        closeAlertLink = $('.close-alert');
    
    closeAlertLink.click(function() {
        $(this).parent()
            .stop()
            .slideUp(250);
    });
    
    openAlertLink.click(function(e) {
        e.preventDefault();
        
        var alertId = $(this).data('alert-id'),
            targetAlert = $('#' + alertId);
        
        targetAlert.stop()
            .slideDown(250);
    });
});

/* ----------------------------------------
Dropdown Button Functions
---------------------------------------- */
$(document).ready(function() {
    var dropdown = $('.dropdown'),
        dropdownOptions = $('.dropdown-options');
    
    dropdown.each(function() { // Set options width to match button on load
        var buttonWidth = $(this).outerWidth();
        $('+ .dropdown-options', this).css('min-width', buttonWidth + 'px');
    });
    
    $(document).click(function() {
        dropdownOptions.hide();
    });
    
    dropdown.click(function(e) {
        e.stopPropagation(); // Don't alert document of this click
        e.preventDefault();
        
        if ($('+ .dropdown-options', this).length > 0) {
            dropdownOptions.hide(); // Close currently opened options
            
            var positionX = $(this).offset().left,
                positionY = $(this).offset().top,
                offsetY = $(this).outerHeight();
            
            $('+ .dropdown-options', this).css('left', positionX + 'px')
                .css('top', positionY + offsetY + 'px')
                .show();
        } else {
            console.error('No immediate sibling with the "dropdown-options" class exists.');
        }
    });
});

/* ----------------------------------------
Loading Functions
---------------------------------------- */
$(document).ready(function() {
    var loadingButton = $('.js-loading');
    
    loadingButton.click(function() {
        $(this).addClass('loading');
    });
});

/* ----------------------------------------
Progress Functions
---------------------------------------- */
$(document).ready(function() {
    $('.progress').each(function() {
        var progressPercentage = $(this).data('percentage');
        
        $(this).css('width', progressPercentage + '%');
    });
});

/* ----------------------------------------
Reveal Functions
---------------------------------------- */
$(document).ready(function() {
    var revealElement = $('.reveal'),
        revealLength = revealElement.length,
        revealCount = 0;
    
    if (revealLength > 0) {
        var windowHeight = $(window).height(),
            positionTrigger = windowHeight * 0.75;
        
        $(window).resize(function() { // Reset if window is resized
            windowHeight = $(window).height();
            positionTrigger = windowHeight * 0.75;
        });
        
        function reveal() {
            revealElement.each(function() {
                if (!$(this).hasClass('visible') && $(document).scrollTop() + positionTrigger >= $(this).offset().top) {
                    $(this).addClass('visible');
                    revealCount++;
                }
            });
            if (revealCount >= revealLength) { // Unbind if all elements have been revealed
                $(window).off('scroll', reveal);
            }
        }
        
        reveal(); // Show visisble elements on load
        
        $(window).on('scroll', reveal);
    }
});

/* ----------------------------------------
Quick Modal v1.03 Plugin (by Kevin Beronilla; edited for Salesforce1)
---------------------------------------- */
(function($) { // Protect the $ alias (IIF)
    $.fn.setSpeed = function(speed) {
        this.css('-webkit-transition-duration', speed + 'ms')
            .css('-moz-transition-duration', speed + 'ms')
            .css('-ms-transition-duration', speed + 'ms')
            .css('-o-transition-duration', speed + 'ms')
            .css('transition-duration', speed + 'ms');
    }
    
    $.fn.setTiming = function(timing) {
        this.css('-webkit-transition-timing-function', timing)
            .css('-moz-transition-timing-function', timing)
            .css('-ms-transition-timing-function', timing)
            .css('-o-transition-timing-function', timing)
            .css('transition-timing-function', timing);
    }
    
    function checkSettings(modalObj, backgroundObj, settings) {
        modalObj.setSpeed(null);
        modalObj.setTiming(null);
        backgroundObj.setSpeed(null);
        backgroundObj.setTiming(null);
        
        if (settings.speed != 250 || settings.timing != 'ease') { // Set CSS if settings not equal to default
            modalObj.setSpeed(settings.speed);
            modalObj.setTiming(settings.timing);
            backgroundObj.setSpeed(settings.speed);
            backgroundObj.setTiming(settings.timing);
        }
    }
    
    $.fn.quickModal = function(args, options) {
        if (!$('#modal-background').length) $('body .scope').append('<div id="modal-background"></div>'); // Append background; do not append if background already exists
        
        if (args !== null && typeof args === 'string') { // If calling a method
            var settings = $.extend({ // Extend the default settings established below
                    animation: 'fade-up',
                    speed: 250,
                    timing: 'ease',
                    closeModalSelector: '.close-modal',
                    enableEsc: true,
                    enableClickAway: true
                }, options),
                bodyTag = $('body'),
                closeModalLink = $(settings.closeModalSelector),
                modalBackground = $('#modal-background'),
                selector = this,
                modal = $('.modal');
            
            checkSettings(selector, modalBackground, settings);
            
            modal.removeClass()
                .addClass('modal')
                .addClass('animation-' + settings.animation);
            
            switch (args) {
                case 'open':
                    function keyUpCheck(e) {
                        if (e.keyCode == 27 && modal.is(':visible') && settings.enableEsc) { // Esc
                            selector.quickModal('close', settings);
                        }
                    }
                    
                    modal.hide(); // Hide any currently visible modals
                    $(document).unbind('keyup', keyUpCheck); // Unbind lingering events
                    bodyTag.addClass('disable-scroll');
                    modalBackground.show();
                    selector.show();
                    setTimeout(function() { // Ensure elements are displayed before adding classes
                        modalBackground.addClass('visible');
                        selector.addClass('visible');
                    }, 25);
                    selector.trigger('modalopen'); // Trigger custom 'open' event
                    
                    closeModalLink.unbind('click') // Unbind previously bound events to remove lingering settings
                        .click(function(e) { // Bind events based on options
                            e.preventDefault();
                            selector.quickModal('close', settings);
                        });
                    
                    $(document).keyup(keyUpCheck);
                    
                    modalBackground.unbind('click'); // Unbind previously bound events to remove lingering settings
                    
                    if (settings.enableClickAway) {
                        modalBackground.click(function() {
                            selector.quickModal('close', settings);
                        });
                    }
                    break;
                    
                case 'close':
                    bodyTag.removeClass('disable-scroll');
                    modalBackground.removeClass('visible');
                    selector.removeClass('visible');
                    setTimeout(function() {
                        modalBackground.hide();
                        selector.hide();
                        selector.trigger('modalclose'); // Trigger custom 'close' event
                    }, settings.speed);
                    break;
                    
                case 'trigger':
                    var modalId = selector.data('modal-id'),
                    targetModal = $('#' + modalId);
                    
                    targetModal.quickModal('open', settings);
                    break;
                    
                default:
                    console.error('The method you entered does not exist.');
            }
        } else { // If initializing plugin with options
            var openModalLink = this;
            
            openModalLink.click(function(e) {
                e.preventDefault();
                
                var modalId = $(this).data('modal-id'),
                    targetModal = $('#' + modalId);
                
                if (modalId === undefined) console.error('No "data-modal-id" attribute is set.');
                else targetModal.quickModal('open', args);
            });
        }
        
        return this; // Return the object to enable chaining
    }
}(jQuery));

$(document).ready(function() {
    $('.js-open-modal').quickModal(); // Initialize plugin
});

/* ----------------------------------------
TinyMCE Initialize
---------------------------------------- */
$(document).ready(function() {
    tinymce.init({
        selector: 'textarea.js-rich-text',
        statusbar: false,
        resize: true,
        height: 208
    });
});

/* ----------------------------------------
Tag-it Initialize
---------------------------------------- */
$(document).ready(function() {
    $('.js-tags').tagit({
        allowSpaces: true
    });
});

/* ----------------------------------------
Tooltipster Initialize
---------------------------------------- */
$(document).ready(function() {
    $('.js-tooltip').tooltipster({
        delay: 0,
        animation: 'fade',
        touchDevices: true,
        trigger: 'hover',
        speed: 250
    });
});

/* ----------------------------------------
jQuery UI Autocomplete Initialize
---------------------------------------- */
$(document).ready(function() {
    $('.js-autocomplete').each(function() { // Set list data for each
        var autocompleteList = eval($(this).data('list')); // Use eval() to interpolate
        
        $(this).autocomplete({
            source: autocompleteList
        });
    });
});

/* ----------------------------------------
jQuery UI Date Picker Initialize
---------------------------------------- */
$(document).ready(function() {
    $('.js-date-picker').datepicker({
        dateFormat: 'mm/dd/yy',
        showAnim: ''
    });
});
