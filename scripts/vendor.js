// Vendor detection
var vendorStyle = function(style) {
    var i, len, vendors, blank, camel;

    vendors = ['webkit', 'ms', 'Moz', 'O'];
    blank = document.createElement('div').style;

    if (style in blank) {
        vendorStyle['css-' + style] = style;
        return style;
    }

    camel = style.charAt(0).toUpperCase() + style.slice(1);
    for (i = 0, len = vendors.length; i < len; i += 1) {
        prefixStyle = vendors[i] + camel;

        if (prefixStyle in blank) {
            vendorStyle['css-' + style] = '-' + vendors[i].toLowerCase() + '-' + style;
            return prefixStyle;
        }
    }

    return style;
};