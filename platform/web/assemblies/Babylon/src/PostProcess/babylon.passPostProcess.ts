﻿module BABYLON {
    export class PassPostProcess extends PostProcess {
        constructor(name: string, ratio: number, camera: Camera, samplingMode?: number, engine?: Engine, reusable?: boolean) {
            super(name, "pass", null, null, ratio, camera, samplingMode, engine, reusable);
        }
    }
} 