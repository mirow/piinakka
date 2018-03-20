"use strict";
exports.__esModule = true;
var Util = /** @class */ (function () {
    function Util() {
    }
    /**
     * Sorts the first count integers in the given array in ascending order.
     * Preserves the original length of the array.
     *
     * @param arr int[]  array to sort
     * @param count int  number of items to sort
     * @return int[] sorted array
     */
    Util.ArraySort = function (arr, count) {
        var swapped;
        var n;
        var tmp;
        n = count;
        do {
            swapped = false;
            for (var i = 0; i < n - 1; i++) {
                if (arr[i] > arr[i + 1]) {
                    // swap cards
                    tmp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = tmp;
                    swapped = true;
                }
            }
            n--;
        } while (swapped);
        //     return arr;
        return;
    };
    /**
     * Sorts two arrays based on the values in the first array (in ascending order).
     *
     * @param arr int[] array to sort in ascending order
     * @param arr2 int[] array that is also arranged
     * @return int[][] sorted arrays
     */
    Util.SortCardsByOdds = function (arr, arr2) {
        var swapped;
        var n;
        var tmp;
        n = arr.length;
        do {
            swapped = false;
            for (var i = 0; i < n - 1; i++) {
                if (arr[i] > arr[i + 1]) {
                    // swap cards
                    tmp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = tmp;
                    tmp = arr2[i];
                    arr2[i] = arr2[i + 1];
                    arr2[i + 1] = tmp;
                    swapped = true;
                }
            }
            n--;
        } while (swapped);
        //     return new int[][] {arr, arr2};
        return;
    };
    return Util;
}());
exports["default"] = Util;
//# sourceMappingURL=Util.js.map