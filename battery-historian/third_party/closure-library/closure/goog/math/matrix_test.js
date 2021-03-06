// Copyright 2007 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('goog.math.MatrixTest');
goog.setTestOnly('goog.math.MatrixTest');

goog.require('goog.math.Matrix');
goog.require('goog.testing.jsunit');

function testConstuctorWithGoodArray() {
  var a1 = [[1, 2], [2, 3], [4, 5]];
  var m1 = new goog.math.Matrix(a1);
  assertArrayEquals('1. Internal array should be the same', m1.toArray(), a1);
  assertEquals(3, m1.getSize().height);
  assertEquals(2, m1.getSize().width);

  var a2 = [[-61, 45, 123], [11112, 343, 1235]];
  var m2 = new goog.math.Matrix(a2);
  assertArrayEquals('2. Internal array should be the same', m2.toArray(), a2);
  assertEquals(2, m2.getSize().height);
  assertEquals(3, m2.getSize().width);

  var a3 = [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4]];
  var m3 = new goog.math.Matrix(a3);
  assertArrayEquals('3. Internal array should be the same', m3.toArray(), a3);
  assertEquals(4, m3.getSize().height);
  assertEquals(4, m3.getSize().width);
}


function testConstructorWithBadArray() {
  assertThrows('1. All arrays should be of equal length', function() {
    new goog.math.Matrix([[1, 2, 3], [1, 2], [1]]);
  });

  assertThrows('2. All arrays should be of equal length', function() {
    new goog.math.Matrix([[1, 2], [1, 2], [1, 2, 3, 4]]);
  });

  assertThrows('3. Arrays should contain only numeric values', function() {
    new goog.math.Matrix([[1, 2], [1, 2], [1, 'a']]);
  });

  assertThrows('4. Arrays should contain only numeric values', function() {
    new goog.math.Matrix([[1, 2], [1, 2], [1, {a: 3}]]);
  });

  assertThrows('5. Arrays should contain only numeric values', function() {
    new goog.math.Matrix([[1, 2], [1, 2], [1, [1, 2, 3]]]);
  });
}


function testConstructorWithGoodNumbers() {
  var m1 = new goog.math.Matrix(2, 2);
  assertEquals('Height should be 2', 2, m1.getSize().height);
  assertEquals('Width should be 2', 2, m1.getSize().width);

  var m2 = new goog.math.Matrix(4, 2);
  assertEquals('Height should be 4', 4, m2.getSize().height);
  assertEquals('Width should be 2', 2, m2.getSize().width);

  var m3 = new goog.math.Matrix(4, 6);
  assertEquals('Height should be 4', 4, m3.getSize().height);
  assertEquals('Width should be 6', 6, m3.getSize().width);
}


function testConstructorWithBadNumbers() {
  assertThrows('1. Negative argument should have errored', function() {
    new goog.math.Matrix(-4, 6);
  });

  assertThrows('2. Negative argument should have errored', function() {
    new goog.math.Matrix(4, -6);
  });

  assertThrows('3. Zero argument should have errored', function() {
    new goog.math.Matrix(4, 0);
  });

  assertThrows('4. Zero argument should have errored', function() {
    new goog.math.Matrix(0, 1);
  });
}


function testConstructorWithMatrix() {
  var a1 = [[1, 2], [2, 3], [4, 5]];
  var m1 = new goog.math.Matrix(a1);
  var m2 = new goog.math.Matrix(m1);
  assertArrayEquals(
      'Internal arrays should be the same', m1.toArray(), m2.toArray());
  assertNotEquals(
      'Should be different objects', goog.getUid(m1), goog.getUid(m2));
}


function testCreateIdentityMatrix() {
  var m1 = goog.math.Matrix.createIdentityMatrix(3);
  assertArrayEquals([[1, 0, 0], [0, 1, 0], [0, 0, 1]], m1.toArray());

  var m2 = goog.math.Matrix.createIdentityMatrix(4);
  assertArrayEquals(
      [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], m2.toArray());
}


function testIsValidArrayWithGoodArrays() {
  var fn = goog.math.Matrix.isValidArray;
  assertTrue('2x2 array should be fine', fn([[1, 2], [3, 5]]));
  assertTrue('3x2 array should be fine', fn([[1, 2, 3], [3, 5, 6]]));
  assertTrue(
      '3x3 array should be fine', fn([[1, 2, 3], [3, 5, 6], [10, 10, 10]]));
  assertTrue('[[1]] should be fine', fn([[1]]));
  assertTrue('1D array should work', fn([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]));
  assertTrue(
      'Negs and decimals should be ok',
      fn([[0], [-4], [-10], [1.2345], [123.53]]));
  assertTrue('Hex, Es and decimals are ok', fn([[0x100, 10E-2], [1.213, 213]]));
}


function testIsValidArrayWithBadArrays() {
  var fn = goog.math.Matrix.isValidArray;
  assertFalse('Arrays should have same size', fn([[1, 2], [3]]));
  assertFalse('Arrays should have same size 2', fn([[1, 2], [3, 4, 5]]));
  assertFalse('2D arrays are ok', fn([[1, 2], [3, 4], []]));
  assertFalse('Values should be numeric', fn([[1, 2], [3, 'a']]));
  assertFalse('Values can not be strings', fn([['bah'], ['foo']]));
  assertFalse('Flat array not supported', fn([1, 2, 3, 4, 5]));
}


function testForEach() {
  var m = new goog.math.Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  var count = 0, sum = 0, xs = '', ys = '';
  goog.math.Matrix.forEach(m, function(val, x, y) {
    count++;
    sum += val;
    xs += x;
    ys += y;
  });
  assertEquals('forEach should have visited every item', 9, count);
  assertEquals('forEach should have summed all values', 45, sum);
  assertEquals('Xs should have been visited in order', '000111222', xs);
  assertEquals('Ys should have been visited sequentially', '012012012', ys);
}


function testMap() {
  var m1 = new goog.math.Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  var m2 = goog.math.Matrix.map(m1, function(val, x, y) { return val + 1; });
  assertArrayEquals([[2, 3, 4], [5, 6, 7], [8, 9, 10]], m2.toArray());
}


function testSetValueAt() {
  var m = new goog.math.Matrix(3, 3);
  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      m.setValueAt(x, y, 3 * x - y);
    }
  }
  assertArrayEquals([[0, -1, -2], [3, 2, 1], [6, 5, 4]], m.toArray());
}


function testGetValueAt() {
  var m = new goog.math.Matrix([[0, -1, -2], [3, 2, 1], [6, 5, 4]]);
  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      assertEquals(
          'Value at (x, y) should equal 3x - y', 3 * x - y, m.getValueAt(x, y));
    }
  }
  assertNull('Out of bounds value should be null', m.getValueAt(-1, 2));
  assertNull('Out of bounds value should be null', m.getValueAt(-1, 0));
  assertNull('Out of bounds value should be null', m.getValueAt(0, 4));
}


function testSum1() {
  var m1 = new goog.math.Matrix([[1, 1, 1], [2, 2, 2], [3, 3, 3]]);
  var m2 = new goog.math.Matrix([[3, 3, 3], [2, 2, 2], [1, 1, 1]]);
  assertArrayEquals(
      'Sum should be all the 4s', [[4, 4, 4], [4, 4, 4], [4, 4, 4]],
      m1.add(m2).toArray());
  assertArrayEquals(
      'Addition should be commutative', m1.add(m2).toArray(),
      m2.add(m1).toArray());
}


function testSum2() {
  var m1 = new goog.math.Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  var m2 = new goog.math.Matrix([[-1, -2, -3], [-4, -5, -6], [-7, -8, -9]]);
  assertArrayEquals(
      'Sum should be all 0s', [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      m1.add(m2).toArray());
  assertArrayEquals(
      'Addition should be commutative', m1.add(m2).toArray(),
      m2.add(m1).toArray());
}


function testSubtract1() {
  var m1 = new goog.math.Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  var m2 = new goog.math.Matrix([[5, 5, 5], [5, 5, 5], [5, 5, 5]]);

  assertArrayEquals(
      [[-4, -3, -2], [-1, 0, 1], [2, 3, 4]], m1.subtract(m2).toArray());
  assertArrayEquals(
      [[4, 3, 2], [1, 0, -1], [-2, -3, -4]], m2.subtract(m1).toArray());
}


function testSubtract2() {
  var m1 = new goog.math.Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  var m2 = new goog.math.Matrix([[-1, -2, -3], [-4, -5, -6], [-7, -8, -9]]);
  assertArrayEquals(
      [[2, 4, 6], [8, 10, 12], [14, 16, 18]], m1.subtract(m2).toArray());
  assertArrayEquals(
      [[-2, -4, -6], [-8, -10, -12], [-14, -16, -18]],
      m2.subtract(m1).toArray());
}


function testScalarMultiplication() {
  var m1 = new goog.math.Matrix([[1, 1, 1], [2, 2, 2], [3, 3, 3]]);
  assertArrayEquals(
      [[2, 2, 2], [4, 4, 4], [6, 6, 6]], m1.multiply(2).toArray());
  assertArrayEquals(
      [[3, 3, 3], [6, 6, 6], [9, 9, 9]], m1.multiply(3).toArray());
  assertArrayEquals(
      [[4, 4, 4], [8, 8, 8], [12, 12, 12]], m1.multiply(4).toArray());

  var m2 = new goog.math.Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  assertArrayEquals(
      [[2, 4, 6], [8, 10, 12], [14, 16, 18]], m2.multiply(2).toArray());
}


function testMatrixMultiplication() {
  var m1 = new goog.math.Matrix([[1, 2], [3, 4]]);
  var m2 = new goog.math.Matrix([[3, 4], [5, 6]]);
  // m1 * m2
  assertArrayEquals(
      [[1 * 3 + 2 * 5, 1 * 4 + 2 * 6], [3 * 3 + 4 * 5, 3 * 4 + 4 * 6]],
      m1.multiply(m2).toArray());
  // m2 * m1 != m1 * m2
  assertArrayEquals(
      [[3 * 1 + 4 * 3, 3 * 2 + 4 * 4], [5 * 1 + 6 * 3, 5 * 2 + 6 * 4]],
      m2.multiply(m1).toArray());
  var m3 = new goog.math.Matrix([[1, 2, 3, 4], [5, 6, 7, 8]]);
  var m4 =
      new goog.math.Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]);
  // m3 * m4
  assertArrayEquals(
      [
        [
          1 * 1 + 2 * 4 + 3 * 7 + 4 * 10, 1 * 2 + 2 * 5 + 3 * 8 + 4 * 11,
          1 * 3 + 2 * 6 + 3 * 9 + 4 * 12
        ],
        [
          5 * 1 + 6 * 4 + 7 * 7 + 8 * 10, 5 * 2 + 6 * 5 + 7 * 8 + 8 * 11,
          5 * 3 + 6 * 6 + 7 * 9 + 8 * 12
        ]
      ],
      m3.multiply(m4).toArray());
  assertThrows(
      'Matrix dimensions should not line up.', function() { m4.multiply(m3); });
}

function testMatrixMultiplicationIsAssociative() {
  var A = new goog.math.Matrix([[1, 2], [3, 4]]);
  var B = new goog.math.Matrix([[3, 4], [5, 6]]);
  var C = new goog.math.Matrix([[2, 7], [9, 1]]);

  assertArrayEquals(
      'A(BC) == (AB)C', A.multiply(B.multiply(C)).toArray(),
      A.multiply(B).multiply(C).toArray());
}


function testMatrixMultiplicationIsDistributive() {
  var A = new goog.math.Matrix([[1, 2], [3, 4]]);
  var B = new goog.math.Matrix([[3, 4], [5, 6]]);
  var C = new goog.math.Matrix([[2, 7], [9, 1]]);

  assertArrayEquals(
      'A(B + C) = AB + AC', A.multiply(B.add(C)).toArray(),
      A.multiply(B).add(A.multiply(C)).toArray());

  assertArrayEquals(
      '(A + B)C = AC + BC', A.add(B).multiply(C).toArray(),
      A.multiply(C).add(B.multiply(C)).toArray());
}


function testTranspose() {
  var m = new goog.math.Matrix([[1, 3, 1], [0, -6, 0]]);
  var t = [[1, 0], [3, -6], [1, 0]];
  assertArrayEquals(t, m.getTranspose().toArray());
}


function testAppendColumns() {
  var m = new goog.math.Matrix([[1, 3, 2], [2, 0, 1], [5, 2, 2]]);
  var b = new goog.math.Matrix([[4], [3], [1]]);
  var result = [[1, 3, 2, 4], [2, 0, 1, 3], [5, 2, 2, 1]];
  assertArrayEquals(result, m.appendColumns(b).toArray());
}


function testAppendRows() {
  var m = new goog.math.Matrix([[1, 3, 2], [2, 0, 1], [5, 2, 2]]);
  var b = new goog.math.Matrix([[4, 3, 1]]);
  var result = [[1, 3, 2], [2, 0, 1], [5, 2, 2], [4, 3, 1]];
  assertArrayEquals(result, m.appendRows(b).toArray());
}


function testSubmatrixByDeletion() {
  var m = new goog.math.Matrix(
      [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]);
  var arr = [[1, 2, 3], [5, 6, 7], [13, 14, 15]];
  assertArrayEquals(arr, m.getSubmatrixByDeletion_(2, 3).toArray());
}


function testMinor() {
  var m = new goog.math.Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  assertEquals(-3, m.getMinor_(0, 0));
}


function testCofactor() {
  var m = new goog.math.Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  assertEquals(6, m.getCofactor_(0, 1));
}


function testDeterminantForOneByOneMatrix() {
  var m = new goog.math.Matrix([[3]]);
  assertEquals(3, m.getDeterminant());
}


function testDeterminant() {
  var m = new goog.math.Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  assertEquals(0, m.getDeterminant());
}


function testGetSubmatrix() {
  var m = new goog.math.Matrix(
      [[2, -1, 0, 1, 0, 0], [-1, 2, -1, 0, 1, 0], [0, -1, 2, 0, 0, 1]]);
  var sub1 = [[2, -1, 0], [-1, 2, -1], [0, -1, 2]];
  assertArrayEquals(sub1, m.getSubmatrixByCoordinates_(0, 0, 2, 2).toArray());

  var sub2 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  assertArrayEquals(sub2, m.getSubmatrixByCoordinates_(0, 3).toArray());
}


function testGetReducedRowEchelonForm() {
  var m = new goog.math.Matrix(
      [[2, -1, 0, 1, 0, 0], [-1, 2, -1, 0, 1, 0], [0, -1, 2, 0, 0, 1]]);

  var expected = new goog.math.Matrix(
      [[1, 0, 0, .75, .5, .25], [0, 1, 0, .5, 1, .5], [0, 0, 1, .25, .5, .75]]);

  assertTrue(expected.equals(m.getReducedRowEchelonForm()));
}


function testInverse() {
  var m1 = new goog.math.Matrix([[2, -1, 0], [-1, 2, -1], [0, -1, 2]]);
  var expected1 =
      new goog.math.Matrix([[.75, .5, .25], [.5, 1, .5], [.25, .5, .75]]);
  assertTrue(expected1.equals(m1.getInverse()));

  var m2 = new goog.math.Matrix([[4, 8], [7, -2]]);
  var expected2 = new goog.math.Matrix([[.03125, .125], [.10936, -.0625]]);
  assertTrue(expected2.equals(m2.getInverse(), .0001));
  var m3 = new goog.math.Matrix([[0, 0], [0, 0]]);
  assertNull(m3.getInverse());
  var m4 = new goog.math.Matrix([[2]]);
  var expected4 = new goog.math.Matrix([[.5]]);
  assertTrue(expected4.equals(m4.getInverse(), .0001));
  var m5 = new goog.math.Matrix([[0]]);
  assertNull(m5.getInverse());
}


function testEquals() {
  var a1 = new goog.math.Matrix(
      [[1, 0, 0, .75, .5, .25], [0, 1, 0, .5, 1, .5], [0, 0, 1, .25, .5, .75]]);

  var a2 = new goog.math.Matrix(
      [[1, 0, 0, .75, .5, .25], [0, 1, 0, .5, 1, .5], [0, 0, 1, .25, .5, .75]]);

  var a3 = new goog.math.Matrix([
    [1, 0, 0, .749, .5, .25], [0, 1, 0, .5, 1, .5], [0, 0, 1, .25, .5, .75]
  ]);

  assertTrue(a1.equals(a2));
  assertTrue(a1.equals(a3, .01));
  assertFalse(a1.equals(a3, .001));
}
