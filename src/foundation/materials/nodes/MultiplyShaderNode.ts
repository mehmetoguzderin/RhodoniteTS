import { CompositionType } from '../../definitions/CompositionType';
import MultiplyShaderityObjectGLSL from '../../../webgl/shaderity_shaders/nodes/Multiply.glsl';
import MultiplyShaderityObjectWGSL from '../../../webgpu/shaderity_shaders/nodes/Multiply.wgsl';
import { ComponentType, ComponentTypeEnum } from '../../../foundation/definitions/ComponentType';
import { CompositionTypeEnum } from '../../../foundation/definitions/CompositionType';
import { AbstractShaderNode } from '../core/AbstractShaderNode';
import { SystemState } from '../../system/SystemState';
import { ProcessApproach } from '../../definitions/ProcessApproach';

export class MultiplyShaderNode extends AbstractShaderNode {
  constructor(compositionType: CompositionTypeEnum, componentType: ComponentTypeEnum) {
    super('multiply', {
      codeGLSL: MultiplyShaderityObjectGLSL.code,
      codeWGSL: MultiplyShaderityObjectWGSL.code,
    });

    this.__inputs.push({
      compositionType: compositionType,
      componentType: componentType,
      name: 'lhs',
    });
    this.__inputs.push({
      compositionType: compositionType,
      componentType: componentType,
      name: 'rhs',
    });
    this.__outputs.push({
      compositionType: compositionType,
      componentType: componentType,
      name: 'outValue',
    });
  }

  getShaderFunctionNameDerivative(): string {
    if (SystemState.currentProcessApproach === ProcessApproach.WebGPU) {
      if (
        this.__inputs[0].compositionType === CompositionType.Scalar &&
        this.__inputs[1].compositionType === CompositionType.Scalar
      ) {
        if (
          this.__inputs[0].componentType === ComponentType.Float &&
          this.__inputs[1].componentType === ComponentType.Float
        ) {
          return this.__shaderFunctionName + 'F32F32';
        } else if (
          this.__inputs[0].componentType === ComponentType.Int &&
          this.__inputs[1].componentType === ComponentType.Int
        ) {
          return this.__shaderFunctionName + 'I32I32';
        } else {
          throw new Error('Not implemented');
        }
      } else if (
        this.__inputs[0].compositionType === CompositionType.Vec2 &&
        this.__inputs[1].compositionType === CompositionType.Vec2
      ) {
        return this.__shaderFunctionName + 'Vec2fVec2f';
      } else if (
        this.__inputs[0].compositionType === CompositionType.Vec3 &&
        this.__inputs[1].compositionType === CompositionType.Vec3
      ) {
        return this.__shaderFunctionName + 'Vec3fVec3f';
      } else if (
        this.__inputs[0].compositionType === CompositionType.Vec4 &&
        this.__inputs[1].compositionType === CompositionType.Vec4
      ) {
        return this.__shaderFunctionName + 'Vec4fVec4f';
      } else if (
        this.__inputs[0].compositionType === CompositionType.Mat2 &&
        this.__inputs[1].compositionType === CompositionType.Mat2
      ) {
        return this.__shaderFunctionName + 'Mat2x2fMat2x2f';
      } else if (
        this.__inputs[0].compositionType === CompositionType.Mat3 &&
        this.__inputs[1].compositionType === CompositionType.Mat3
      ) {
        return this.__shaderFunctionName + 'Mat3x3fMat3x3f';
      } else if (
        this.__inputs[0].compositionType === CompositionType.Mat4 &&
        this.__inputs[1].compositionType === CompositionType.Mat4
      ) {
        return this.__shaderFunctionName + 'Mat4x4fMat4x4f';
      } else {
        throw new Error('Not implemented');
      }
    } else {
      return this.__shaderFunctionName;
    }
  }
}
