'use strict';

var getArrayFromLocalStorage = function (key) {
    var values = localStorage.getItem(key);

    if (values) {
        return JSON.parse(values);
    }

    return [];
};

var setArrayToLocalStorage = function (key, values) {
    localStorage.setItem(key, JSON.stringify(values));
};
