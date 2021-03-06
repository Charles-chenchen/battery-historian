// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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

goog.provide('goog.structs.PoolTest');
goog.setTestOnly('goog.structs.PoolTest');

goog.require('goog.structs.Pool');
goog.require('goog.testing.MockClock');
goog.require('goog.testing.jsunit');

// Implementation of the Pool class with isObjectDead() always returning TRUE,
// so that the the Pool will not reuse any objects.
function NoObjectReusePool(opt_min, opt_max) {
  goog.structs.Pool.call(this, opt_min, opt_max);
}
goog.inherits(NoObjectReusePool, goog.structs.Pool);

NoObjectReusePool.prototype.objectCanBeReused = function(obj) {
  return false;
};


function testExceedMax1() {
  var p = new goog.structs.Pool(0, 3);
  var obj1 = p.getObject();
  var obj2 = p.getObject();
  var obj3 = p.getObject();
  var obj4 = p.getObject();
  var obj5 = p.getObject();

  assertNotUndefined(obj1);
  assertNotUndefined(obj2);
  assertNotUndefined(obj3);
  assertUndefined(obj4);
  assertUndefined(obj5);
}


function testExceedMax2() {
  var p = new goog.structs.Pool(0, 1);
  var obj1 = p.getObject();
  var obj2 = p.getObject();
  var obj3 = p.getObject();
  var obj4 = p.getObject();
  var obj5 = p.getObject();

  assertNotUndefined(obj1);
  assertUndefined(obj2);
  assertUndefined(obj3);
  assertUndefined(obj4);
  assertUndefined(obj5);
}


function testExceedMax3() {
  var p = new goog.structs.Pool();  // default: 10
  var objs = [];

  for (var i = 0; i < 12; i++) {
    objs[i] = p.getObject();
  }

  for (var i = 0; i < 10; i++) {
    assertNotNull('First 10 should be not null', objs[i]);
  }

  assertUndefined(objs[10]);
  assertUndefined(objs[11]);
}


function testReleaseAndGet1() {
  var p = new goog.structs.Pool(0, 10);
  var o = p.getObject();
  assertEquals(1, p.getCount());
  assertEquals(1, p.getInUseCount());
  assertEquals(0, p.getFreeCount());
  assertTrue('Result should be true', p.releaseObject(o));
  assertEquals(1, p.getCount());
  assertEquals(0, p.getInUseCount());
  assertEquals(1, p.getFreeCount());
}


function testReleaseAndGet2() {
  var p = new NoObjectReusePool(0, 10);
  var o = p.getObject();
  assertEquals(1, p.getCount());
  assertEquals(1, p.getInUseCount());
  assertEquals(0, p.getFreeCount());
  assertTrue('Result should be true', p.releaseObject(o));
  assertEquals(0, p.getCount());
  assertEquals(0, p.getInUseCount());
  assertEquals(0, p.getFreeCount());
}


function testReleaseAndGet3() {
  var p = new goog.structs.Pool(0, 10);
  var o1 = p.getObject();
  var o2 = p.getObject();
  var o3 = p.getObject();
  var o4 = {};
  assertEquals(3, p.getCount());
  assertEquals(3, p.getInUseCount());
  assertEquals(0, p.getFreeCount());
  assertTrue('Result should be true', p.releaseObject(o1));
  assertTrue('Result should be true', p.releaseObject(o2));
  assertFalse('Result should be false', p.releaseObject(o4));
  assertEquals(3, p.getCount());
  assertEquals(1, p.getInUseCount());
  assertEquals(2, p.getFreeCount());
}


function testReleaseAndGet4() {
  var p = new NoObjectReusePool(0, 10);
  var o1 = p.getObject();
  var o2 = p.getObject();
  var o3 = p.getObject();
  var o4 = {};
  assertEquals(3, p.getCount());
  assertEquals(3, p.getInUseCount());
  assertEquals(0, p.getFreeCount());
  assertTrue('Result should be true', p.releaseObject(o1));
  assertTrue('Result should be true', p.releaseObject(o2));
  assertFalse('Result should be false', p.releaseObject(o4));
  assertEquals(1, p.getCount());
  assertEquals(1, p.getInUseCount());
  assertEquals(0, p.getFreeCount());
}


function testIsInPool1() {
  var p = new goog.structs.Pool();
  var o1 = p.getObject();
  var o2 = p.getObject();
  var o3 = p.getObject();
  var o4 = {};
  var o5 = {};
  var o6 = o1;

  assertTrue(p.contains(o1));
  assertTrue(p.contains(o2));
  assertTrue(p.contains(o3));
  assertFalse(p.contains(o4));
  assertFalse(p.contains(o5));
  assertTrue(p.contains(o6));
}


function testSetMin1() {
  var p = new goog.structs.Pool(0, 10);

  assertEquals(0, p.getCount());
  assertEquals(0, p.getInUseCount());
  assertEquals(0, p.getFreeCount());

  p.setMinimumCount(10);

  assertEquals(10, p.getCount());
  assertEquals(0, p.getInUseCount());
  assertEquals(10, p.getFreeCount());
}


function testSetMin2() {
  var p = new goog.structs.Pool(0, 10);

  assertEquals(0, p.getCount());
  assertEquals(0, p.getInUseCount());
  assertEquals(0, p.getFreeCount());

  var o1 = p.getObject();

  assertEquals(1, p.getCount());
  assertEquals(1, p.getInUseCount());
  assertEquals(0, p.getFreeCount());

  p.setMinimumCount(10);

  assertEquals(10, p.getCount());
  assertEquals(1, p.getInUseCount());
  assertEquals(9, p.getFreeCount());
}


function testSetMax1() {
  var p = new goog.structs.Pool(0, 10);

  assertEquals(0, p.getCount());
  assertEquals(0, p.getInUseCount());
  assertEquals(0, p.getFreeCount());

  var o1 = p.getObject();
  var o2 = p.getObject();
  var o3 = p.getObject();
  var o4 = p.getObject();
  var o5 = p.getObject();

  assertEquals(5, p.getCount());
  assertEquals(5, p.getInUseCount());
  assertEquals(0, p.getFreeCount());

  assertTrue('Result should be true', p.releaseObject(o5));

  assertEquals(5, p.getCount());
  assertEquals(4, p.getInUseCount());
  assertEquals(1, p.getFreeCount());

  p.setMaximumCount(4);

  assertEquals(4, p.getCount());
  assertEquals(4, p.getInUseCount());
  assertEquals(0, p.getFreeCount());
}


function testInvalidMinMax1() {
  var p = new goog.structs.Pool(0, 10);

  assertEquals(0, p.getCount());
  assertEquals(0, p.getInUseCount());
  assertEquals(0, p.getFreeCount());

  assertThrows(function() { p.setMinimumCount(11); });
}


function testInvalidMinMax2() {
  var p = new goog.structs.Pool(5, 10);

  assertEquals(5, p.getCount());
  assertEquals(0, p.getInUseCount());
  assertEquals(5, p.getFreeCount());

  assertThrows(function() { p.setMaximumCount(4); });
}


function testInvalidMinMax3() {
  assertThrows(function() { new goog.structs.Pool(10, 1); });
}


function testRateLimiting() {
  var clock = new goog.testing.MockClock();
  clock.install();

  var p = new goog.structs.Pool(0, 3);
  p.setDelay(100);

  assertNotUndefined(p.getObject());
  assertUndefined(p.getObject());

  clock.tick(100);
  assertNotUndefined(p.getObject());
  assertUndefined(p.getObject());

  clock.tick(100);
  assertNotUndefined(p.getObject());
  assertUndefined(p.getObject());

  clock.tick(100);
  assertUndefined(p.getObject());

  goog.dispose(clock);
}
