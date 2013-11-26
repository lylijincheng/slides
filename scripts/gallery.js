// Gallery constructor.
function Gallery() {
    this.initialize.apply(this, arguments);
}

Gallery.prototype.initialize = function(el, onslide, deviceWidth) {
    this.el = el;
    this.slides = this.el.querySelectorAll('.slide');

    this.onslide = onslide;
    this.deviceWidth = deviceWidth || window.innerWidth;

    this.currentIndex = 0;
    this.endTranslation = 0;
    this.setDimension();
    this.listenEvents();
};

Gallery.prototype.setDimension = function() {
    [].slice.call(this.slides).forEach(function(slide, index) {
        slide.style.width = this.deviceWidth + 'px';
    }, this);

    this.el.style.width = this.deviceWidth * this.getElementLength() + 'px';
};

Gallery.prototype.listenEvents = function() {

    this.el.addEventListener(_EVT_DOWN, this, false);
    this.el.addEventListener(_EVT_MOVE, this, false);
    this.el.addEventListener(_EVT_UP,   this, false);

    this.el.addEventListener('resize', this, false);
    this.el.addEventListener('orientationchange', this, false);
};

Gallery.prototype.handleEvent = function(e) {
    // e.preventDefault();

    e = e.originalEvent || e;

    e.currentX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    e.currentY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    switch(e.type) {

        case _EVT_DOWN:
            return this.handleDown(e);

        case _EVT_MOVE:
            return this.handleMove(e);

        case _EVT_UP:
            return this.handleUp(e);

        case 'resize':
        case 'orientationchange':
            return this.handleResize(e);
    }
};

Gallery.prototype.handleDown = function(e) {
    this.startX = e.currentX;
    this.startY = e.currentY;

    this.disableTransition();
};

Gallery.prototype.handleMove = function(e) {
    var direction;

    this.endX = e.currentX;
    this.endY = e.currentY;

    direction = this.getDirection(this.endX,this.endY, this.startX,this.startY);
    if (direction === "LEFT" || direction === "RIGHT") {
        e.preventDefault();
        this.translate(this.endTranslation + this.endX - this.startX);
    }
};

Gallery.prototype.handleUp = function(e) {
    var maxIndex, translation, currentIndex;

    maxIndex     = this.getElementLength() - 1;
    translation  = this.getNextIndex(e) * this.deviceWidth;
    currentIndex = this.currentIndex;

    this.enableTransition();
    this.setEndTranslation( currentIndex < 0 ? 0 : (currentIndex > maxIndex) ? (-this.deviceWidth * maxIndex) : (-translation) );

    /* Callback: onslide */
    if (this.onslide && currentIndex >= 0 && currentIndex <= maxIndex) {
        setTimeout(bind(this.onslide, this), 3e2);
    }
    /* Callback: onslide end */
};

Gallery.prototype.handleResize = function(e) {
    this.deviceWidth = window.innerWidth;
    this.setDimension();
    this.setEndTranslation(-(this.currentIndex || 0) * this.deviceWidth);
};

Gallery.prototype.getNextIndex = function(e) {
    var direction = this.getDirection(this.endX,this.endY, this.startX,this.startY);
    return this.currentIndex = this.getTouchedIndex(e) + (direction === "LEFT" ? 1 : direction === 'RIGHT' ? -1 : 0);
};

Gallery.prototype.getTouchedIndex = function(e) {
    var target, i, len;

    target = e.target;
    while (!/\bslide\b/.test(target.className)) {
        target = target.parentNode;
    }

    len = this.slides.length;
    for (i = 0; i < len; i += 1) {
        if (this.slides[i] === target) {
            return i;
        }
    }

    return 0;
};

Gallery.prototype.getTranslate = function() {
    var transform = this.el.style[transformStyleName];
    return parseInt(transform.slice(12, transform.indexOf(',')), 10) || 0;
};

Gallery.prototype.setEndTranslation = function(translation) {
    this.translate(translation);
    this.endTranslation = translation;
};

Gallery.prototype.translate = function(x) {
    this.el.style[transformStyleName] = 'translate3d(' + x + 'px, 0, 0)';
};

Gallery.prototype.disableTransition = function() {
    this.el.style[transitionPropertyName] = 'none';
};

Gallery.prototype.enableTransition = function() {
    this.el.style[transitionPropertyName] = transformPropertyName + ' .3s ease';
};

Gallery.prototype.getElementLength = function() {
    return this.el.querySelectorAll('.slide').length;
};

Gallery.prototype.getDirection = function(x2,y2, x1,y1) {
    return this.direction = Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 > x2 ? 'LEFT' : 'RIGHT') : (y1 > y2 ? 'UP' : 'DOWN');
};
