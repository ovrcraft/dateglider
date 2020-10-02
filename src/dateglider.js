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
    function dateSliderUpdate(elem, options, activeDay='') {
       
        /* variable init */
        var days = 10;
        var daysShown = 7;
        var dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        var preAppending = false;
        var lastDateInserted = '';
        var storedForAddition = [];
        var markedForRemoval = [];
        var scrollBack = false;
        var today = new Date();
        /* variable init - END */
        
        /* checking run-type */
        if(activeDay === '') {
            var activeDate = new Date(today.getTime());
        } else {
            var activeDate = new Date(activeDay);
        }
        /* checking run-type - END */
        
        var startDate = new Date(activeDate.getTime() - (days * 24 * 60 * 60 * 1000));
        var endDate = new Date(activeDate.getTime() + (days * 24 * 60 * 60 * 1000));
        
        /* updating the date header */
        $(elem).find('.dg-header > .dg-header-from').text(formatDateString(new Date(activeDate.getTime() - ((daysShown-1)/2 * 24 * 60 * 60 * 1000))));
        $(elem).find('.dg-header > .dg-header-to').text(formatDateString(new Date(activeDate.getTime() + ((daysShown-1)/2 * 24 * 60 * 60 * 1000))));
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
            if(formatDate(activeDate.toDateString()) === formatDate(i.toDateString())) {
                classNames = classNames + ' active';
            }

            if($(elem).find('.dg-slider-slides').find(`[data-date='${formatDate(i.toDateString())}']`).length == 0) {
                if(new Date($(elem).find('.dg-slider-slides > li:last').data('date')) < endDate) {
                    scrollBack = true;
                    $(elem).find('.dg-slider-slides').append(`<li data-date="${formatDate(i.toDateString())}" class="${classNames}"><small>${dayNames[i.getDay()]}</small><span>${i.getDate()}</span></li>`);
                } else if(new Date($(elem).find('.dg-slider-slides > li:first').data('date')) > startDate || preAppending) {
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
                $(elem).find('.dg-slider-slides > li').each(function() {
                    if(new Date($(this).data('date')) < startDate && !$(this).hasClass('marked-for-removal')) {
                        markedForRemoval.push(this);
                        $(this).addClass('marked-for-removal');
                        //$('.date-glider .dg-slider-slides').css('transform', 'translateX(-'+($('.date-glider .dg-slider-slides > li').outerWidth()*((days*2+1-daysShown)/2+markedForRemoval.length))+'px)');
                        //$(this).remove();
                    } else if(new Date($(this).data('date')) > endDate && !$(this).hasClass('marked-for-removal')) {
                        markedForRemoval.push(this);
                        $(this).addClass('marked-for-removal');
                    }
                });
            }
            //console.log(dayNames[i.getDay()] + " -- " + i.getDate());
        }
        /* main loop - END */
        
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
            activeDay: '',
            onDateClick: function() {}
        }, options );
        
        // Apply options
        var dg = this;
        dateSliderInit(dg, settings);
        dateSliderUpdate(dg, settings, settings.activeDay);
                
        
        // Public methods
        dg.selectDate = function(activeDay) {
            $(this).find('.dg-slider-slides > li.active').removeClass('active');
            $(this).find('.dg-slider-slides').find(`[data-date='${activeDay}']`).addClass('active');
            dateSliderUpdate(dg, settings, activeDay);
        }
        
        // Event handlers
        $(dg).on('click', '.dg-slider-slides > li', function() {
            var activeDay = $(this).data('date');
            $(this).parent().find('li').removeClass('active');
            $(this).addClass('active');
            dateSliderUpdate(dg, settings, activeDay);
            
            // callBack
            settings.onDateClick.call(this);
        });
        
        $(dg).on('click', '.dg-slider-nav', function() {
            var activeNode = $(this).parent().find('.dg-slider-slides > li.active');
            var activeDay = activeNode.data('date');
            activeNode.removeClass('active');
            if($(this).hasClass('dg-slider-next')) {
                var activeDay = formatDate(new Date((new Date(activeDay)).getTime() + (6 * 24 * 60 * 60 * 1000)));
            } else if($(this).hasClass('dg-slider-prev')) {
                var activeDay = formatDate(new Date((new Date(activeDay)).getTime() - (6 * 24 * 60 * 60 * 1000)));
            }
            activeNode = $(this).parent().find('.dg-slider-slides').find(`[data-date='${activeDay}']`);
            $(activeNode).addClass('active');
            dateSliderUpdate(dg, settings, activeDay);
        });
        return dg;
    };
 
}( jQuery ));


