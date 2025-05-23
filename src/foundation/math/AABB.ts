import { Vector3 } from './Vector3';
import { Matrix44 } from './Matrix44';
import { MutableVector3 } from './MutableVector3';
import { Index } from '../../types/CommonTypes';
import { MathUtil } from './MathUtil';

/**
 * A 3D axis-aligned bounding box.
 */
export class AABB {
  private __min: MutableVector3 = MutableVector3.fromCopyArray([
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
  ]);
  private __max: MutableVector3 = MutableVector3.fromCopyArray([
    -Number.MAX_VALUE,
    -Number.MAX_VALUE,
    -Number.MAX_VALUE,
  ]);
  private __centerPoint = MutableVector3.zero();
  private __lengthCenterToCorner = 0;
  private __isCenterPointDirty = false;
  private __isLengthCenterToCornerDirty = false;
  private static __tmpVector3 = MutableVector3.zero();
  private __isVanilla = true;

  constructor() {}

  /**
   * Clone this AABB.
   * @returns a cloned AABB.
   */
  clone() {
    const instance = new AABB();
    instance.__max = this.__max.clone();
    instance.__min = this.__min.clone();
    instance.__centerPoint = this.__centerPoint.clone();
    instance.__lengthCenterToCorner = this.__lengthCenterToCorner;
    instance.__isCenterPointDirty = this.__isCenterPointDirty;
    instance.__isLengthCenterToCornerDirty = this.__isLengthCenterToCornerDirty;
    instance.__isVanilla = this.__isVanilla;

    return instance;
  }

  /**
   * Copy inner components from another AABB.
   * @param aabb
   * @returns this
   */
  copyComponents(aabb: AABB) {
    this.__max.copyComponents(aabb.__max);
    this.__min.copyComponents(aabb.__min);
    this.__centerPoint.copyComponents(aabb.__centerPoint);
    this.__lengthCenterToCorner = aabb.__lengthCenterToCorner;
    this.__isCenterPointDirty = aabb.__isCenterPointDirty;
    this.__isLengthCenterToCornerDirty = aabb.__isLengthCenterToCornerDirty;

    this.__isVanilla = false;
    return this;
  }

  /**
   * initialize this AABB.
   */
  initialize() {
    this.__min.setComponents(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    this.__max.setComponents(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    this.__centerPoint.zero();
    this.__lengthCenterToCorner = 0;
    this.__isCenterPointDirty = false;
    this.__isLengthCenterToCornerDirty = false;

    this.__isVanilla = true;
  }

  set minPoint(val: Vector3) {
    this.__min.copyComponents(val);
    this.__isCenterPointDirty = true;
    this.__isLengthCenterToCornerDirty = true;

    this.__isVanilla = false;
  }

  get minPoint() {
    return this.__min as Vector3;
  }

  set maxPoint(val: Vector3) {
    this.__max.copyComponents(val);
    this.__isCenterPointDirty = true;
    this.__isLengthCenterToCornerDirty = true;

    this.__isVanilla = false;
  }

  get maxPoint() {
    return this.__max as Vector3;
  }

  /**
   * return whether this AABB is vanilla (not initialized) or not.
   * @returns true if this AABB is vanilla.
   */
  isVanilla() {
    return this.__isVanilla;
  }

  /**
   * add a position for updating AABB.
   * @param positionVector
   * @returns given positionVector.
   */
  addPosition(positionVector: Vector3) {
    this.__min.x = positionVector.x < this.__min.x ? positionVector.x : this.__min.x;
    this.__min.y = positionVector.y < this.__min.y ? positionVector.y : this.__min.y;
    this.__min.z = positionVector.z < this.__min.z ? positionVector.z : this.__min.z;

    this.__max.x = this.__max.x < positionVector.x ? positionVector.x : this.__max.x;
    this.__max.y = this.__max.y < positionVector.y ? positionVector.y : this.__max.y;
    this.__max.z = this.__max.z < positionVector.z ? positionVector.z : this.__max.z;

    this.__isCenterPointDirty = true;
    this.__isLengthCenterToCornerDirty = true;

    this.__isVanilla = false;

    return positionVector;
  }

  /**
   * add a position for updating AABB.
   * @param array a position array.
   * @param index index of the position array to adding.
   * @returns given array.
   */
  addPositionWithArray(array: number[], index: Index) {
    this.__min.x = array[index + 0] < this.__min.x ? array[index + 0] : this.__min.x;
    this.__min.y = array[index + 1] < this.__min.y ? array[index + 1] : this.__min.y;
    this.__min.z = array[index + 2] < this.__min.z ? array[index + 2] : this.__min.z;
    this.__max.x = this.__max.x < array[index + 0] ? array[index + 0] : this.__max.x;
    this.__max.y = this.__max.y < array[index + 1] ? array[index + 1] : this.__max.y;
    this.__max.z = this.__max.z < array[index + 2] ? array[index + 2] : this.__max.z;

    this.__isCenterPointDirty = true;
    this.__isLengthCenterToCornerDirty = true;

    this.__isVanilla = false;

    return array;
  }

  /**
   * merge with another AABB.
   * @param aabb another AABB to merge
   * @returns merge succeeded or not.
   */
  mergeAABB(aabb: AABB) {
    if (aabb.isVanilla()) {
      return false; // can't merge with vanilla AABB.
    }

    this.__isCenterPointDirty = true;
    this.__isLengthCenterToCornerDirty = true;

    if (this.isVanilla()) {
      this.__min.copyComponents(aabb.minPoint);
      this.__max.copyComponents(aabb.maxPoint);
      this.__isVanilla = false;
      return true;
    }

    if (aabb.minPoint.x < this.__min.x) {
      this.__min.x = aabb.minPoint.x;
    }
    if (aabb.minPoint.y < this.__min.y) {
      this.__min.y = aabb.minPoint.y;
    }
    if (aabb.minPoint.z < this.__min.z) {
      this.__min.z = aabb.minPoint.z;
    }
    if (this.__max.x < aabb.maxPoint.x) {
      this.__max.x = aabb.maxPoint.x;
    }
    if (this.__max.y < aabb.maxPoint.y) {
      this.__max.y = aabb.maxPoint.y;
    }
    if (this.__max.z < aabb.maxPoint.z) {
      this.__max.z = aabb.maxPoint.z;
    }

    return true;
  }

  /**
   * the center of this AABB.
   */
  get centerPoint() {
    if (this.__isCenterPointDirty) {
      MutableVector3.addTo(this.__min, this.__max, this.__centerPoint).divide(2);
      this.__isCenterPointDirty = false;
    }
    return this.__centerPoint;
  }

  /**
   * the length from center to corner of this AABB.
   */
  get lengthCenterToCorner() {
    if (this.__isLengthCenterToCornerDirty) {
      this.__lengthCenterToCorner = Vector3.lengthBtw(this.centerPoint, this.maxPoint);
      this.__isLengthCenterToCornerDirty = false;
    }
    return this.__lengthCenterToCorner;
  }

  /**
   * the length from min x to max x of this AABB.
   */
  get sizeX() {
    return this.__max.x - this.__min.x;
  }

  /**
   * the length from min y to max y of this AABB.
   */
  get sizeY() {
    return this.__max.y - this.__min.y;
  }

  /**
   * the length from min z to max z of this AABB.
   */
  get sizeZ() {
    return this.__max.z - this.__min.z;
  }

  /**
   * multiply this AABB with a given matrix.
   * @param matrix a matrix to convert aabb.
   * @param aabb given AABB to convert.
   * @param outAabb converted AABB by given matrix.
   * @returns converted AABB.
   */
  static multiplyMatrixTo(matrix: Matrix44, aabb: AABB, outAabb: AABB) {
    if (aabb.isVanilla()) {
      return outAabb.copyComponents(aabb);
    }
    outAabb.initialize();

    AABB.__tmpVector3.x = aabb.__min.x;
    AABB.__tmpVector3.y = aabb.__min.y;
    AABB.__tmpVector3.z = aabb.__min.z;
    matrix.multiplyVector3To(AABB.__tmpVector3, AABB.__tmpVector3);
    outAabb.addPosition(AABB.__tmpVector3);

    AABB.__tmpVector3.x = aabb.__max.x;
    AABB.__tmpVector3.y = aabb.__min.y;
    AABB.__tmpVector3.z = aabb.__min.z;
    matrix.multiplyVector3To(AABB.__tmpVector3, AABB.__tmpVector3);
    outAabb.addPosition(AABB.__tmpVector3);

    AABB.__tmpVector3.x = aabb.__min.x;
    AABB.__tmpVector3.y = aabb.__max.y;
    AABB.__tmpVector3.z = aabb.__min.z;
    matrix.multiplyVector3To(AABB.__tmpVector3, AABB.__tmpVector3);
    outAabb.addPosition(AABB.__tmpVector3);

    AABB.__tmpVector3.x = aabb.__min.x;
    AABB.__tmpVector3.y = aabb.__min.y;
    AABB.__tmpVector3.z = aabb.__max.z;
    matrix.multiplyVector3To(AABB.__tmpVector3, AABB.__tmpVector3);
    outAabb.addPosition(AABB.__tmpVector3);

    AABB.__tmpVector3.x = aabb.__min.x;
    AABB.__tmpVector3.y = aabb.__max.y;
    AABB.__tmpVector3.z = aabb.__max.z;
    matrix.multiplyVector3To(AABB.__tmpVector3, AABB.__tmpVector3);
    outAabb.addPosition(AABB.__tmpVector3);

    AABB.__tmpVector3.x = aabb.__max.x;
    AABB.__tmpVector3.y = aabb.__min.y;
    AABB.__tmpVector3.z = aabb.__max.z;
    matrix.multiplyVector3To(AABB.__tmpVector3, AABB.__tmpVector3);
    outAabb.addPosition(AABB.__tmpVector3);

    AABB.__tmpVector3.x = aabb.__max.x;
    AABB.__tmpVector3.y = aabb.__max.y;
    AABB.__tmpVector3.z = aabb.__min.z;
    matrix.multiplyVector3To(AABB.__tmpVector3, AABB.__tmpVector3);
    outAabb.addPosition(AABB.__tmpVector3);

    AABB.__tmpVector3.x = aabb.__max.x;
    AABB.__tmpVector3.y = aabb.__max.y;
    AABB.__tmpVector3.z = aabb.__max.z;
    matrix.multiplyVector3To(AABB.__tmpVector3, AABB.__tmpVector3);
    outAabb.addPosition(AABB.__tmpVector3);

    return outAabb;
  }

  /**
   * toString method.
   */
  toString() {
    return (
      'AABB_min: ' +
      this.__min +
      '\n' +
      'AABB_max: ' +
      this.__max +
      '\n' +
      'centerPoint: ' +
      this.__centerPoint +
      '\n' +
      'lengthCenterToCorner: ' +
      this.__lengthCenterToCorner
    );
  }

  /**
   * toString method (the numbers are Approximate)
   */
  toStringApproximately() {
    return (
      'AABB_max: ' +
      this.__max.toStringApproximately() +
      '\n' +
      'AABB_min: ' +
      this.__min.toStringApproximately() +
      '\n' +
      'centerPoint: ' +
      this.centerPoint.toStringApproximately() +
      '\n' +
      'lengthCenterToCorner: ' +
      MathUtil.financial(this.lengthCenterToCorner)
    );
  }
}
