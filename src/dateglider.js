(function ( $ ) {
    
    /* function repository */
    /* function to output formatted date pattern for the slider */
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }
    
    /* function to output formatted date string for header */
    function formatDateString(date) {
        var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        var d = new Date(date),
            month = '' + (d.getMonth()),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (day.length < 2) 
            day = '0' + day;

        return [day, months[month], year].join(' ');
    }
    
    /* function to initialize the date slider with necessary html structure */
    function dateSliderInit(elem, options) {
        $(elem).empty();
        $(elem).html(`
            <div class="dg-content">
                ${options.header == true
                ?`<div class="dg-header">
                    <span class="dg-header-from">13 October 2020</span><i>&dash;</i><span class="dg-header-to">19 October 2020</span>
                </div>`
                : ''
                }
                <div class="dg-body">
                    <div class="dg-slider">
                        <a class="dg-slider-nav dg-slider-prev">&lt;</a>
                        <div class="dg-slider-slides-container">
                            <ul class="dg-slider-slides"></ul>
                        </div>
                        <a class="dg-slider-nav dg-slider-next">&gt;</a>
                    </div>
                    <div class="dg-calender">
                    </div>
                </div>
            </div>
        `);
    }
    
    /* function to update the date slider */
    function dateSliderUpdate(elem, options, middleDay='', setActive) {
       
        /* variable init */
        var days = 10;
        var daysShown = 7;
        var dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        var preAppending = false;
        var lastDateInserted = '';
        var storedForAddition = [];
        var markedForRemoval = [];
        var scrollBack = false;
        var today = new Date(); today.setHours(0,0,0,0);
        var setActive = typeof setActive=='undefined'?false:setActive;
        /* variable init - END */
        
        /* checking run-type */
        if(middleDay === '') {
            var middleDate = new Date(today.getTime());
            middleDate.setHours(0,0,0,0);
            setActive = true;
        } else {
            var middleDate = new Date(middleDay);
            middleDate.setHours(0,0,0,0);
        }
        /* checking run-type - END */
        
        var startDate = new Date(middleDate.getTime() - (days * 24 * 60 * 60 * 1000)); startDate.setHours(0,0,0,0);
        var endDate = new Date(middleDate.getTime() + (days * 24 * 60 * 60 * 1000)); endDate.setHours(0,0,0,0);
        
        /* updating the date header */
        $(elem).find('.dg-header > .dg-header-from').text(formatDateString(new Date(middleDate.getTime() - ((daysShown-1)/2 * 24 * 60 * 60 * 1000))));
        $(elem).find('.dg-header > .dg-header-to').text(formatDateString(new Date(middleDate.getTime() + ((daysShown-1)/2 * 24 * 60 * 60 * 1000))));
        /* updating the date header - END */
        
        /* main loop */
        for(var i=new Date(startDate.getTime()); i<=endDate; i.setDate(i.getDate() + 1)) {
            var classNames = '';
            var index = -1;
            index = options.availableDates.findIndex(function(item, x){
                return item.date === formatDate(i.toDateString());
            });
            if(index < 0 && options.datesFilter) {
                classNames = classNames + 'disabled';
            }
            if(formatDate(middleDate.toDateString()) === formatDate(i.toDateString())) {
                classNames = classNames + ' middle';
                if(setActive) {
                    classNames = classNames + ' active'; 
                }
            }

            if($(elem).find('.dg-slider-slides').find(`[data-date='${formatDate(i.toDateString())}']`).length == 0) {
                if(function() { var tDate = new Date($(elem).find('.dg-slider-slides > li:last').data('date')); tDate.setHours(0,0,0,0); return tDate; }() < endDate) {
                    scrollBack = true;
                    $(elem).find('.dg-slider-slides').append(`<li data-date="${formatDate(i.toDateString())}" class="${classNames}"><small>${dayNames[i.getDay()]}</small><span>${i.getDate()}</span></li>`);
                } else if(function() { var tDate = new Date($(elem).find('.dg-slider-slides > li:first').data('date')); tDate.setHours(0,0,0,0); return tDate; }() > startDate || preAppending) {
                    scrollBack = false;
                    storedForAddition.push(`<li data-date="${formatDate(i.toDateString())}" class="${classNames}"><small>${dayNames[i.getDay()]}</small><span>${i.getDate()}</span></li>`);
                    /*
                    if(!preAppending) {
                        $('.date-glider .dg-slider-slides').prepend(`<li data-date="${formatDate(i.toDateString())}" class="${classNames}"><small>${dayNames[i.getDay()]}</small><span>${i.getDate()}</span></li>`);
                        preAppending = true;
                        lastDateInserted = formatDate(i.toDateString());
                    } else {
                        $(`<li data-date="${formatDate(i.toDateString())}" class="${classNames}"><small>${dayNames[i.getDay()]}</small><span>${i.getDate()}</span></li>`).insertAfter($('.date-glider .dg-slider-slides').find(`[data-date='${lastDateInserted}']`));
                        lastDateInserted = formatDate(i.toDateString());
                    }
                    */
                } else {
                    scrollBack = true;
                    $(elem).find('.dg-slider-slides').append(`<li data-date="${formatDate(i.toDateString())}" class="${classNames}"><small>${dayNames[i.getDay()]}</small><span>${i.getDate()}</span></li>`);
                }
            } else {
                // nothing interesting here
            }
            //console.log(dayNames[i.getDay()] + " -- " + i.getDate());
        }
        /* main loop - END */
        
        $(elem).find('.dg-slider-slides > li').each(function() {
            if(function() { var tDate = new Date($(this).data('date')); tDate.setHours(0,0,0,0); return tDate; }() < startDate && !$(this).hasClass('marked-for-removal')) {
                markedForRemoval.push(this);
                $(this).addClass('marked-for-removal');
                //$('.date-glider .dg-slider-slides').css('transform', 'translateX(-'+($('.date-glider .dg-slider-slides > li').outerWidth()*((days*2+1-daysShown)/2+markedForRemoval.length))+'px)');
                //$(this).remove();
            } else if(function() { var tDate = new Date($(this).data('date')); tDate.setHours(0,0,0,0); return tDate; }() > endDate && !$(this).hasClass('marked-for-removal')) {
                markedForRemoval.push(this);
                $(this).addClass('marked-for-removal');
            }
        });
        
        /* set width and position of slider */
        $(elem).find('.dg-slider-slides-container').width(daysShown*$(elem).find('.dg-slider-slides > li').outerWidth());
        $(elem).find('.dg-slider-slides').css('transform', 'translateX(-'+($(elem).find('.dg-slider-slides > li').outerWidth()*(days*2+1-daysShown)/2)+'px)');
        if(scrollBack) {
            $(elem).find('.dg-slider-slides').css('transform', 'translateX(-'+($(elem).find('.dg-slider-slides > li').outerWidth()*((days*2+1-daysShown)/2+markedForRemoval.length))+'px)');
        } else {
            $(elem).find('.dg-slider-slides').css('transform', 'translateX(-'+($(elem).find('.dg-slider-slides > li').outerWidth()*((days*2+1-daysShown)/2-storedForAddition.length))+'px)');
        }
        /* set width and position of slider - END */
        
        /* lazy add & remove items 'on the left' */
        setTimeout(function() {
            if(storedForAddition.length > 0) {
                $(elem).find('.dg-slider-slides').css('transition', 'none');
                $(elem).find('.dg-slider-slides').prepend(storedForAddition);
                $(elem).find('.dg-slider-slides').css('transform', 'translateX(-'+($(elem).find('.dg-slider-slides > li').outerWidth()*(days*2+1-daysShown)/2)+'px)');
                setTimeout(function() {
                    $(elem).find('.dg-slider-slides').css('transition', 'all 0.3s ease');
                }, 50);
            }
            
            if(markedForRemoval.length > 0) {
                $(elem).find('.dg-slider-slides').css('transition', 'none');
                for(var n=0; n<markedForRemoval.length; n++) {
                    $(markedForRemoval).remove();
                }
                $(elem).find('.dg-slider-slides').css('transform', 'translateX(-'+($(elem).find('.dg-slider-slides > li').outerWidth()*(days*2+1-daysShown)/2)+'px)');
                setTimeout(function() {
                    $(elem).find('.dg-slider-slides').css('transition', 'all 0.3s ease');
                }, 50);
            }
        }, 300);
        /* lazy add & remove items 'on the left' - END */
    }
    /* function repository - END */
 
    $.fn.dateglider = function( options ) {
 
        // Default options
        var settings = $.extend({
            header: true,
            availableDates: [],
            datesFilter: false,
            middleDay: '',
            activeOnScroll: false,
            onDateClick: function() {}
        }, options );
        
        // Apply options
        var dg = this;
        dateSliderInit(dg, settings);
        dateSliderUpdate(dg, settings, settings.middleDay);
                
        
        // Public methods
        dg.selectDate = function(middleDay) {
            $(this).find('.dg-slider-slides > li.middle').removeClass('middle');
            $(this).find('.dg-slider-slides > li.active').removeClass('active');
            dateSliderUpdate(dg, settings, middleDay, true);
            //$(this).find('.dg-slider-slides').find(`[data-date='${middleDay}']`).addClass('middle');
            //$(this).find('.dg-slider-slides').find(`[data-date='${middleDay}']`).addClass('active');
        }
        
        // Event handlers
        $(dg).on('click', '.dg-slider-slides > li', function() {
            var middleDay = $(this).data('date');
            $(this).parent().find('li').removeClass('middle');
            $(this).parent().find('li').removeClass('active');
            $(this).addClass('middle');
            $(this).addClass('active');
            dateSliderUpdate(dg, settings, middleDay);
            
            // callBack
            settings.onDateClick.call(this);
        });
        
        // Sliding action - Nav button action
        $(dg).on('click', '.dg-slider-nav', function() {
            var middleNode = $(this).parent().find('.dg-slider-slides > li.middle');
            var middleDay = middleNode.data('date');
            middleNode.removeClass('middle');
            if(settings.activeOnScroll) {
                middleNode.removeClass('active');
            }
            if($(this).hasClass('dg-slider-next')) {
                var middleDay = formatDate(new Date((new Date(middleDay)).getTime() + (7 * 24 * 60 * 60 * 1000)));
            } else if($(this).hasClass('dg-slider-prev')) {
                var middleDay = formatDate(new Date((new Date(middleDay)).getTime() - (7 * 24 * 60 * 60 * 1000)));
            }
            middleNode = $(this).parent().find('.dg-slider-slides').find(`[data-date='${middleDay}']`);
            $(middleNode).addClass('middle');
            if(settings.activeOnScroll) {
                $(middleNode).addClass('active');
            }
            dateSliderUpdate(dg, settings, middleDay);
        });
        return dg;
    };
 
}( jQuery ));
