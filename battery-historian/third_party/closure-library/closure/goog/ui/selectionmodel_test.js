// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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

goog.provide('goog.ui.SelectionModelTest');
goog.setTestOnly('goog.ui.SelectionModelTest');

goog.require('goog.array');
goog.require('goog.testing.jsunit');
goog.require('goog.testing.recordFunction');
goog.require('goog.ui.SelectionModel');

var selectionModel, items, addedItem, addedItems;

function setUp() {
  items = [1, 2, 3, 4];
  addedItem = 5;
  addedItems = [6, 7, 8];
  selectionModel = new goog.ui.SelectionModel(items);
}

function tearDown() {
  goog.dispose(selectionModel);
}

/*
 * Checks that the selection model returns the correct item count.
 */
function testGetItemCount() {
  assertEquals(items.length, selectionModel.getItemCount());
}

/*
 * Checks that the correct first element is returned by the selection model.
 */
function testGetFirst() {
  assertEquals(items[0], selectionModel.getFirst());
}

/*
 * Checks that the correct last element is returned by the selection model.
 */
function testGetLast() {
  assertEquals(items[items.length - 1], selectionModel.getLast());
}

/*
 * Tests the behavior of goog.ui.SelectionModel.getItemAt(index).
 */
function testGetItemAt() {
  goog.array.forEach(items, function(item, i) {
    assertEquals(item, selectionModel.getItemAt(i));
  });
}

/*
 * Checks that an item can be correctly added to the selection model.
 */
function testAddItem() {
  assertEquals(items.length, selectionModel.getItemCount());

  selectionModel.addItem(addedItem);

  assertEquals(items.length + 1, selectionModel.getItemCount());
  assertEquals(addedItem, selectionModel.getLast());
}

/*
 * Checks that an item can be added to the selection model at a specific index.
 */
function testAddItemAt() {
  assertEquals(items.length, selectionModel.getItemCount());

  var insertIndex = 2;
  assertEquals(items[insertIndex], selectionModel.getItemAt(insertIndex));

  selectionModel.addItemAt(addedItem, insertIndex);

  var resultArray = goog.array.clone(items);
  goog.array.insertAt(resultArray, addedItem, insertIndex);

  assertEquals(items.length + 1, selectionModel.getItemCount());
  assertEquals(addedItem, selectionModel.getItemAt(insertIndex));
  assertArrayEquals(resultArray, selectionModel.getItems());
}

/*
 * Checks that multiple items can be correctly added to the selection model.
 */
function testAddItems() {
  assertEquals(items.length, selectionModel.getItemCount());

  selectionModel.addItems(addedItems);

  assertEquals(items.length + addedItems.length, selectionModel.getItemCount());

  var resultArray = goog.array.concat(items, addedItems);
  assertArrayEquals(resultArray, selectionModel.getItems());
}

/*
 * Checks that all elements can be removed from the selection model.
 */
function testClear() {
  assertArrayEquals(items, selectionModel.getItems());

  selectionModel.clear();

  assertArrayEquals([], selectionModel.getItems());
}

/*
 * Checks that all items can be obtained from the selection model.
 */
function testGetItems() {
  assertArrayEquals(items, selectionModel.getItems());
}

/*
 * Checks that an item's index can be found in the selection model.
 */
function testIndexOfItem() {
  goog.array.forEach(items, function(item, i) {
    assertEquals(i, selectionModel.indexOfItem(item));
  });
}

/*
 * Checks that an item can be removed from the selection model.
 */
function testRemoveItem() {
  assertEquals(items.length, selectionModel.getItemCount());

  var resultArray = goog.array.clone(items);
  goog.array.removeAt(resultArray, 2);

  selectionModel.removeItem(items[2]);

  assertEquals(items.length - 1, selectionModel.getItemCount());
  assertArrayEquals(resultArray, selectionModel.getItems());
}

/*
 * Checks that an item at a particular index can be removed from the selection
 * model.
 */
function testRemoveItemAt() {
  assertEquals(items.length, selectionModel.getItemCount());

  var resultArray = goog.array.clone(items);
  var removeIndex = 2;

  goog.array.removeAt(resultArray, removeIndex);

  selectionModel.removeItemAt(removeIndex);

  assertEquals(items.length - 1, selectionModel.getItemCount());
  assertNotEquals(items[removeIndex], selectionModel.getItemAt(removeIndex));
  assertArrayEquals(resultArray, selectionModel.getItems());
}

/*
 * Checks that item selection at a particular index works.
 */
function testSelectedIndex() {
  // Default selected index is -1
  assertEquals(-1, selectionModel.getSelectedIndex());

  selectionModel.setSelectedIndex(2);

  assertEquals(2, selectionModel.getSelectedIndex());
  assertEquals(items[2], selectionModel.getSelectedItem());
}

/*
 * Checks that items can be selected in the selection model.
 */
function testSelectedItem() {
  assertNull(selectionModel.getSelectedItem());

  selectionModel.setSelectedItem(items[1]);

  assertNotNull(selectionModel.getSelectedItem());
  assertEquals(items[1], selectionModel.getSelectedItem());
  assertEquals(1, selectionModel.getSelectedIndex());
}

/*
 * Checks that an installed handler is called on selection change.
 */
function testSelectionHandler() {
  var myRecordFunction = new goog.testing.recordFunction();

  selectionModel.setSelectionHandler(myRecordFunction);

  // Select index 2
  selectionModel.setSelectedIndex(2);
  // De-select 2 and select 3
  selectionModel.setSelectedIndex(3);

  var recordCalls = myRecordFunction.getCalls();

  assertEquals(3, recordCalls.length);
  // Calls: Select items[2], de-select items[2], select items[3]
  assertArrayEquals([items[2], true], recordCalls[0].getArguments());
  assertArrayEquals([items[2], false], recordCalls[1].getArguments());
  assertArrayEquals([items[3], true], recordCalls[2].getArguments());
}
