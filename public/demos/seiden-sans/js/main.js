'use strict';

$(document).ready(function() {
    /* ----------------------------------------
    Shared Variables
    ---------------------------------------- */
    var bodyObj = $(document.body),
        windowObj = $(window),
        view = $('html, body');
    
    /* ----------------------------------------
    Web Font Functions
    ---------------------------------------- */
    var documentFonts = document.fonts;
    
    if (typeof(documentFonts) !== 'undefined') {
        documentFonts.ready.then(function() {
            bodyObj.addClass('fonts-loaded');
        });
    } else {
        bodyObj.addClass('fonts-loaded');
    }
    
    /* ----------------------------------------
    User Text Functions
    ---------------------------------------- */
    var userText = $('#user-text'),
        defaultVal = userText.val();
    
    function autoResize() {
        userText.innerHeight(0);
        
        var contentHeight = userText[0].scrollHeight;
        
        userText.innerHeight(contentHeight);
    }
    
    autoResize();
    userText.keyup(autoResize);
    windowObj.resize(autoResize);
    
    userText.focus()
        .text(defaultVal);
    
    /* ----------------------------------------
    Anchor Link Functions
    ---------------------------------------- */
    var anchorLink = $('a[href*="#"]');
    
    anchorLink.click(function(e) {
        e.preventDefault();
        
        var targetPos = $($(this).attr('href')).offset().top;
        
        view.animate({
            scrollTop: targetPos
        }, 750);
    });
    
    /* ----------------------------------------
    Weight Select Functions
    ---------------------------------------- */
    var weight = $('#weight');
    
    weight.change(function() {
        userText.removeClass()
            .addClass($(this).val());
    });
});