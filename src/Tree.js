import React from "react";
import "./tree.css";
import { TreeViz } from "./tree-visualizer";
import _ from "lodash";

// class Tree {
//   add(num) {
//     // needs this
//   }
//   toObject() {
//     // returns a root node with
//     // {
//     //   value:  <number>
//     //   left:   <object>
//     //   right:  <object>
//     //   height: <number, optional>
//     // }
//     return { value: 1, left: null, right: null, height: 1 };
//   }
// }

// // BINARY SEARCH TREE
// class Tree {
//   constructor() {
//     this.root = null;
//   }
//   add(value) {
//     // some logic around if this is the root
//     // find the correct place to add
//     if (this.root === null) {
//       this.root = new Node(value); // creo el root
//     } else {
//       let current = this.root;
//       while (true) {
//         if (current.value > value) {
//           // go left
//           if (current.left) {
//             current = current.left;
//           } else {
//             current.left = new Node(value);
//             break; // o return, stop the loop
//           }
//         } else {
//           // go right
//           if (current.right) {
//             current = current.right;
//           } else {
//             current.right = new Node(value);
//             break;
//           }
//         }
//       }
//     }
//     return this; // return the tree
//   }
//   toObject() {
//     return this.root;
//   }
// }

// class Node {
//   constructor(value) {
//     this.value = value;
//     this.left = null;
//     this.right = null;
//   }
// }

// AVL TREE

class Tree {
  constructor() {
    this.root = null;
  }
  add(value) {
    if (!this.root) {
      this.root = new Node(value);
    } else {
      this.root.add(value);
    }
  }
  toObject() {
    return this.root;
  }
}

class Node {
  constructor(value) {
    this.left = null;
    this.right = null;
    this.value = value;
    this.height = 1; // to know when rotate
  }
  add(value) {
    // the same idea an add to a BST recursively
    // STEPS:
    // decide to go left or right
    // find the correct place to add
    // make sure you're updating heights

    // go left
    if (value < this.value) {
      if (this.left) {
        this.left.add(value);
      } else {
        this.left = new Node(value);
      }
      if (!this.right || this.right.height < this.left.height) {
        this.height = this.left.height + 1;
      }
    } else {
      // go right
      if (this.right) {
        this.right.add(value);
      } else {
        this.right = new Node(value);
      }
      if (!this.left || this.right.height > this.left.height) {
        this.height = this.right.height + 1;
      }
    }
    this.balance();
  }
  balance() {
    // STEPS:
    // ask is this node out of balance?
    // if not out of balance, do nothing
    // if it is out of balance, do I need to single or double rotate
    // if single, justo call rotate on self
    // if double, call rotate on child then on self
    const rightHeight = this.right ? this.right.height : 0;
    const leftHeight = this.left ? this.left.height : 0;

    if (leftHeight > rightHeight + 1) {
      const leftRightHeight = this.left.right ? this.left.right.height : 0; // si esta doblado
      const leftLeftHeight = this.left.left ? this.left.left.height : 0;
      // doble routation
      if (leftRightHeight > leftLeftHeight) {
        this.left.rotateRR(); // si necesito doble rotation en el left child
      }
      this.rotateLL(); // sino, no importa que, pasa esto
    } else if (rightHeight > leftHeight + 1) {
      const rightRightHeight = this.right.right ? this.right.right.height : 0;
      const rightLeftHeight = this.right.left ? this.right.left.height : 0;
      // double rotation
      if (rightLeftHeight > rightRightHeight) {
        this.right.rotateLL(); // si necesito doble
      }
      this.rotateRR(); // sino, no importa qué, pasa esto
    }
  }
  rotateRR() {
    // right child is heavy
    const valueBefore = this.value;
    const leftBefore = this.left;
    this.value = this.right.value;
    this.left = this.right;
    this.right = this.right.right;
    this.left.right = this.left.left;
    this.left.left = leftBefore;
    this.left.value = valueBefore;
    this.left.updateInNewLocation();
    this.updateInNewLocation();
  }
  rotateLL() {
    // left child is heavy
    const valueBefore = this.value;
    const rightBefore = this.right;
    this.value = this.left.value;
    this.right = this.left;
    this.left = this.left.left;
    this.right.left = this.right.right;
    this.right.right = rightBefore;
    this.right.value = valueBefore;
    this.right.updateInNewLocation();
    this.updateInNewLocation();
  }
  updateInNewLocation() {
    // calculate the new height
    // la height entonces va a ser 1 mas que el children
    if (!this.right && !this.left) {
      this.height = 1;
      // si mi rama left tiene 1 nodo mas que la right:
    } else if (
      !this.right ||
      (this.left && this.right.height < this.left.height)
    ) {
      this.height = this.left.height + 1;
    } else {
      this.height = this.right.height + 1;
    }
  }
}

export default function TreeComponent() {
  const nums = _.shuffle(_.range(900));
  const tree = new Tree();
  nums.map((num) => tree.add(num));
  const objs = tree.toObject();
  return <TreeViz root={objs} />;
}
