
window.jQuery.fn.slider = function (options) {

    var value = parseInt(this.attr('value')) || 0;
    var minValue = options && options.hasOwnProperty('min') ? options.min : 0;
    var maxValue = options && options.hasOwnProperty('max') ? options.max : 100;
    var stepValue = options && options.hasOwnProperty('step') ? options.step : 1;
    var range = maxValue - minValue;
    var textOffset = (30 - 50)/2;

    function setValue(newValue, move) {
        value = Math.max(minValue, Math.min(newValue, maxValue));
        if (value > minValue && value < maxValue) {
            var offset = value - minValue;
            var rem = offset % stepValue;
            value -= rem;
        }

        if (options && options.onValue) {
            options.onValue(value);
        }

        this.find('.slider__value').text(Math.round(value));

        if (move){
            var movementRange = getMovementRangeBound();
            var progress = (value - minValue)/range;
            var left = progress * movementRange;
            this.find('.slider__thumb').css('left', left + 'px');
        }
    }

    var setValueBound = setValue.bind(this);

    this.html('<div class="slider">' +
        '<div class="slider__less"><div class="slider__less-thumb"></div></div>' +
        '<div class="slider__mid">' +
        '<div class="slider__thumb"><div class="slider__thumb-text slider__value">' + value + '</div></div>' +
        '<div class="slider__thumb-over-text"><div class="slider__thumb-over-text-inner slider__value">' + value + '</div></div>' +
        '</div>' +
        '<div class="slider__more"><div class="slider__more-thumb"></div></div>' +
        '</div>' /* +
     '<div class="feedback">' +
     '<p>mouseStart: <span class="mouseStart"></span></p>' +
     '<p>left: <span class="left"></span></p>' +
     '<p>firstMouse: <span class="firstMouse"></span></p>' +
     '<p>pageX: <span class="pageX"></span></p>' +
     '</div>' */);

    var thumbStart = 0;
    var firstMouse = true;
    var mouseStart = 0;

    this.find('.slider__less-thumb').click(function(){
        setValueBound(value - stepValue, true);
    });

    this.find('.slider__more-thumb').click(function(){
        setValueBound(value + stepValue, true);
    });

    function getMovementRange(){

        var thumbWidth = this.find('.slider__thumb').width();
        var width = this.find('.slider__mid').width();
        return width - thumbWidth;
    }

    var getMovementRangeBound = getMovementRange.bind(this);

    function onMove(event) {
        /*   this.find('.feedback .thumbStart').text(thumbStart);
         this.find('.feedback .firstMouse').text(firstMouse);
         this.find('.feedback .mouseStart').text(mouseStart);
         this.find('.feedback .pageX').text(event.pageX); */
        if (firstMouse) {
            mouseStart = event.pageX;
            thumbStart = this.find('.slider__thumb').position().left;
            firstMouse = false;
        } else {
            var mouseDiff = event.pageX - mouseStart;
            var left = (thumbStart + mouseDiff);

            var movementRange = getMovementRangeBound();
            left = Math.max(0, Math.min(left, movementRange));
            var progress = left / movementRange;
            setValueBound((progress * range) + minValue);
            this.find('.slider__thumb').css('left', left + 'px');

            this.find('.slider__thumb-over-text').css('left',  (left + textOffset) + 'px');
            /*   this.find('.feedback .left').text(left); */
        }
    }

    var onMoveBound = onMove.bind(this);

    function endTrackMouse() {
        this.off('mousemove', onMoveBound);
        this.find('.slider__mid').removeClass('slider__thumb-down');
        $(window.document).off('mouseup', endTrackMouseBound);
    }

    var endTrackMouseBound = endTrackMouse.bind(this);

    function trackMouse() {
        firstMouse = true;
        thumbStart = this.find('.slider__thumb').position().left;
        this.find('.slider__mid').addClass('slider__thumb-down');
        this.on('mousemove', onMoveBound);

        $(window.document).on('mouseup', endTrackMouseBound);
    }

    var trackMouseBound = trackMouse.bind(this);

    this.find('.slider__thumb').on('mousedown', trackMouseBound);

    return this;
};
