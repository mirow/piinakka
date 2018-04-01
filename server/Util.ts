export default class Util {
  constructor() {
  }

  static m_w = 123456789;
  static m_z = 987654321;
  static mask = 0xffffffff;

  static seed(i) {
    Util.m_w = i;
    Util.m_z = 987654321;
  }

  // Returns number between 0 (inclusive) and 1.0 (exclusive),
  // just like Math.random().
  static random() {
    Util.m_z = (36969 * (Util.m_z & 65535) + (Util.m_z >> 16)) & Util.mask;
    Util.m_w = (18000 * (Util.m_w & 65535) + (Util.m_w >> 16)) & Util.mask;
    let result = ((Util.m_z << 16) + Util.m_w) & Util.mask;
    result /= 4294967296;
    return result + 0.5;
  }

  /**
   * Sorts the first count integers in the given array in ascending order.
   * Preserves the original length of the array.
   *
   * @param arr int[]  array to sort
   * @param count int  number of items to sort
   * @return int[] sorted array
   */
  static ArraySort(arr: number[], count: number) {
    let swapped;
    let n;
    let tmp;
    n = count;
    do {
      swapped = false;
      for (let i = 0; i < n - 1; i++) {
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
  }

  /**
   * Sorts two arrays based on the values in the first array (in ascending order).
   *
   * @param arr int[] array to sort in ascending order
   * @param arr2 int[] array that is also arranged
   * @return int[][] sorted arrays
   */
  static SortCardsByOdds(arr: number[], arr2: number[]) {
    let swapped;
    let n;
    let tmp;
    n = arr.length;
    do {
      swapped = false;
      for (let i = 0; i < n - 1; i++) {
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
  }

}
