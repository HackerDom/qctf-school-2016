/// <reference path="../../../dist/preview release/babylon.d.ts"/>

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var BABYLON;
(function (BABYLON) {
    var maxSimultaneousLights = 4;
    var TerrainMaterialDefines = (function (_super) {
        __extends(TerrainMaterialDefines, _super);
        function TerrainMaterialDefines() {
            _super.call(this);
            this.DIFFUSE = false;
            this.BUMP = false;
            this.CLIPPLANE = false;
            this.ALPHATEST = false;
            this.POINTSIZE = false;
            this.FOG = false;
            this.LIGHT0 = false;
            this.LIGHT1 = false;
            this.LIGHT2 = false;
            this.LIGHT3 = false;
            this.SPOTLIGHT0 = false;
            this.SPOTLIGHT1 = false;
            this.SPOTLIGHT2 = false;
            this.SPOTLIGHT3 = false;
            this.HEMILIGHT0 = false;
            this.HEMILIGHT1 = false;
            this.HEMILIGHT2 = false;
            this.HEMILIGHT3 = false;
            this.DIRLIGHT0 = false;
            this.DIRLIGHT1 = false;
            this.DIRLIGHT2 = false;
            this.DIRLIGHT3 = false;
            this.POINTLIGHT0 = false;
            this.POINTLIGHT1 = false;
            this.POINTLIGHT2 = false;
            this.POINTLIGHT3 = false;
            this.SHADOW0 = false;
            this.SHADOW1 = false;
            this.SHADOW2 = false;
            this.SHADOW3 = false;
            this.SHADOWS = false;
            this.SHADOWVSM0 = false;
            this.SHADOWVSM1 = false;
            this.SHADOWVSM2 = false;
            this.SHADOWVSM3 = false;
            this.SHADOWPCF0 = false;
            this.SHADOWPCF1 = false;
            this.SHADOWPCF2 = false;
            this.SHADOWPCF3 = false;
            this.SPECULARTERM = false;
            this.NORMAL = false;
            this.UV1 = false;
            this.UV2 = false;
            this.VERTEXCOLOR = false;
            this.VERTEXALPHA = false;
            this.BONES = false;
            this.BONES4 = false;
            this.BonesPerMesh = 0;
            this.INSTANCES = false;
            this._keys = Object.keys(this);
        }
        return TerrainMaterialDefines;
    })(BABYLON.MaterialDefines);
    var TerrainMaterial = (function (_super) {
        __extends(TerrainMaterial, _super);
        function TerrainMaterial(name, scene) {
            _super.call(this, name, scene);
            this.diffuseColor = new BABYLON.Color3(1, 1, 1);
            this.specularColor = new BABYLON.Color3(0, 0, 0);
            this.specularPower = 64;
            this.disableLighting = false;
            this._worldViewProjectionMatrix = BABYLON.Matrix.Zero();
            this._scaledDiffuse = new BABYLON.Color3();
            this._scaledSpecular = new BABYLON.Color3();
            this._defines = new TerrainMaterialDefines();
            this._cachedDefines = new TerrainMaterialDefines();
            this._cachedDefines.BonesPerMesh = -1;
        }
        TerrainMaterial.prototype.needAlphaBlending = function () {
            return (this.alpha < 1.0);
        };
        TerrainMaterial.prototype.needAlphaTesting = function () {
            return false;
        };
        TerrainMaterial.prototype.getAlphaTestTexture = function () {
            return null;
        };
        // Methods   
        TerrainMaterial.prototype._checkCache = function (scene, mesh, useInstances) {
            if (!mesh) {
                return true;
            }
            if (this._defines.INSTANCES !== useInstances) {
                return false;
            }
            if (mesh._materialDefines && mesh._materialDefines.isEqual(this._defines)) {
                return true;
            }
            return false;
        };
        TerrainMaterial.prototype.isReady = function (mesh, useInstances) {
            if (this.checkReadyOnlyOnce) {
                if (this._wasPreviouslyReady) {
                    return true;
                }
            }
            var scene = this.getScene();
            if (!this.checkReadyOnEveryCall) {
                if (this._renderId === scene.getRenderId()) {
                    if (this._checkCache(scene, mesh, useInstances)) {
                        return true;
                    }
                }
            }
            var engine = scene.getEngine();
            var needNormals = false;
            var needUVs = false;
            this._defines.reset();
            // Textures
            if (scene.texturesEnabled) {
                if (this.mixTexture && BABYLON.StandardMaterial.DiffuseTextureEnabled) {
                    if (!this.mixTexture.isReady()) {
                        return false;
                    }
                    else {
                        needUVs = true;
                        this._defines.DIFFUSE = true;
                    }
                }
                if ((this.bumpTexture1 || this.bumpTexture2 || this.bumpTexture3) && BABYLON.StandardMaterial.BumpTextureEnabled) {
                    needUVs = true;
                    needNormals = true;
                    this._defines.BUMP = true;
                }
            }
            // Effect
            if (scene.clipPlane) {
                this._defines.CLIPPLANE = true;
            }
            if (engine.getAlphaTesting()) {
                this._defines.ALPHATEST = true;
            }
            // Point size
            if (this.pointsCloud || scene.forcePointsCloud) {
                this._defines.POINTSIZE = true;
            }
            // Fog
            if (scene.fogEnabled && mesh && mesh.applyFog && scene.fogMode !== BABYLON.Scene.FOGMODE_NONE && this.fogEnabled) {
                this._defines.FOG = true;
            }
            var lightIndex = 0;
            if (scene.lightsEnabled && !this.disableLighting) {
                for (var index = 0; index < scene.lights.length; index++) {
                    var light = scene.lights[index];
                    if (!light.isEnabled()) {
                        continue;
                    }
                    // Excluded check
                    if (light._excludedMeshesIds.length > 0) {
                        for (var excludedIndex = 0; excludedIndex < light._excludedMeshesIds.length; excludedIndex++) {
                            var excludedMesh = scene.getMeshByID(light._excludedMeshesIds[excludedIndex]);
                            if (excludedMesh) {
                                light.excludedMeshes.push(excludedMesh);
                            }
                        }
                        light._excludedMeshesIds = [];
                    }
                    // Included check
                    if (light._includedOnlyMeshesIds.length > 0) {
                        for (var includedOnlyIndex = 0; includedOnlyIndex < light._includedOnlyMeshesIds.length; includedOnlyIndex++) {
                            var includedOnlyMesh = scene.getMeshByID(light._includedOnlyMeshesIds[includedOnlyIndex]);
                            if (includedOnlyMesh) {
                                light.includedOnlyMeshes.push(includedOnlyMesh);
                            }
                        }
                        light._includedOnlyMeshesIds = [];
                    }
                    if (!light.canAffectMesh(mesh)) {
                        continue;
                    }
                    needNormals = true;
                    this._defines["LIGHT" + lightIndex] = true;
                    var type;
                    if (light instanceof BABYLON.SpotLight) {
                        type = "SPOTLIGHT" + lightIndex;
                    }
                    else if (light instanceof BABYLON.HemisphericLight) {
                        type = "HEMILIGHT" + lightIndex;
                    }
                    else if (light instanceof BABYLON.PointLight) {
                        type = "POINTLIGHT" + lightIndex;
                    }
                    else {
                        type = "DIRLIGHT" + lightIndex;
                    }
                    this._defines[type] = true;
                    // Specular
                    if (!light.specular.equalsFloats(0, 0, 0)) {
                        this._defines.SPECULARTERM = true;
                    }
                    // Shadows
                    if (scene.shadowsEnabled) {
                        var shadowGenerator = light.getShadowGenerator();
                        if (mesh && mesh.receiveShadows && shadowGenerator) {
                            this._defines["SHADOW" + lightIndex] = true;
                            this._defines.SHADOWS = true;
                            if (shadowGenerator.useVarianceShadowMap || shadowGenerator.useBlurVarianceShadowMap) {
                                this._defines["SHADOWVSM" + lightIndex] = true;
                            }
                            if (shadowGenerator.usePoissonSampling) {
                                this._defines["SHADOWPCF" + lightIndex] = true;
                            }
                        }
                    }
                    lightIndex++;
                    if (lightIndex === maxSimultaneousLights)
                        break;
                }
            }
            // Attribs
            if (mesh) {
                if (needNormals && mesh.isVerticesDataPresent(BABYLON.VertexBuffer.NormalKind)) {
                    this._defines.NORMAL = true;
                }
                if (needUVs) {
                    if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.UVKind)) {
                        this._defines.UV1 = true;
                    }
                    if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.UV2Kind)) {
                        this._defines.UV2 = true;
                    }
                }
                if (mesh.useVertexColors && mesh.isVerticesDataPresent(BABYLON.VertexBuffer.ColorKind)) {
                    this._defines.VERTEXCOLOR = true;
                    if (mesh.hasVertexAlpha) {
                        this._defines.VERTEXALPHA = true;
                    }
                }
                if (mesh.useBones && mesh.computeBonesUsingShaders) {
                    this._defines.BONES = true;
                    this._defines.BonesPerMesh = (mesh.skeleton.bones.length + 1);
                    this._defines.BONES4 = true;
                }
                // Instances
                if (useInstances) {
                    this._defines.INSTANCES = true;
                }
            }
            // Get correct effect      
            if (!this._defines.isEqual(this._cachedDefines)) {
                this._defines.cloneTo(this._cachedDefines);
                scene.resetCachedMaterial();
                // Fallbacks
                var fallbacks = new BABYLON.EffectFallbacks();
                if (this._defines.FOG) {
                    fallbacks.addFallback(1, "FOG");
                }
                for (lightIndex = 0; lightIndex < maxSimultaneousLights; lightIndex++) {
                    if (!this._defines["LIGHT" + lightIndex]) {
                        continue;
                    }
                    if (lightIndex > 0) {
                        fallbacks.addFallback(lightIndex, "LIGHT" + lightIndex);
                    }
                    if (this._defines["SHADOW" + lightIndex]) {
                        fallbacks.addFallback(0, "SHADOW" + lightIndex);
                    }
                    if (this._defines["SHADOWPCF" + lightIndex]) {
                        fallbacks.addFallback(0, "SHADOWPCF" + lightIndex);
                    }
                    if (this._defines["SHADOWVSM" + lightIndex]) {
                        fallbacks.addFallback(0, "SHADOWVSM" + lightIndex);
                    }
                }
                if (this._defines.BONES4) {
                    fallbacks.addFallback(0, "BONES4");
                }
                //Attributes
                var attribs = [BABYLON.VertexBuffer.PositionKind];
                if (this._defines.NORMAL) {
                    attribs.push(BABYLON.VertexBuffer.NormalKind);
                }
                if (this._defines.UV1) {
                    attribs.push(BABYLON.VertexBuffer.UVKind);
                }
                if (this._defines.UV2) {
                    attribs.push(BABYLON.VertexBuffer.UV2Kind);
                }
                if (this._defines.VERTEXCOLOR) {
                    attribs.push(BABYLON.VertexBuffer.ColorKind);
                }
                if (this._defines.BONES) {
                    attribs.push(BABYLON.VertexBuffer.MatricesIndicesKind);
                    attribs.push(BABYLON.VertexBuffer.MatricesWeightsKind);
                }
                if (this._defines.INSTANCES) {
                    attribs.push("world0");
                    attribs.push("world1");
                    attribs.push("world2");
                    attribs.push("world3");
                }
                // Legacy browser patch
                var shaderName = "terrain";
                var join = this._defines.toString();
                this._effect = scene.getEngine().createEffect(shaderName, attribs, ["world", "view", "viewProjection", "vEyePosition", "vLightsType", "vDiffuseColor", "vSpecularColor",
                    "vLightData0", "vLightDiffuse0", "vLightSpecular0", "vLightDirection0", "vLightGround0", "lightMatrix0",
                    "vLightData1", "vLightDiffuse1", "vLightSpecular1", "vLightDirection1", "vLightGround1", "lightMatrix1",
                    "vLightData2", "vLightDiffuse2", "vLightSpecular2", "vLightDirection2", "vLightGround2", "lightMatrix2",
                    "vLightData3", "vLightDiffuse3", "vLightSpecular3", "vLightDirection3", "vLightGround3", "lightMatrix3",
                    "vFogInfos", "vFogColor", "pointSize",
                    "vTextureInfos",
                    "mBones",
                    "vClipPlane", "textureMatrix",
                    "shadowsInfo0", "shadowsInfo1", "shadowsInfo2", "shadowsInfo3",
                    "diffuse1Infos", "diffuse2Infos", "diffuse3Infos"
                ], ["textureSampler", "diffuse1Sampler", "diffuse2Sampler", "diffuse3Sampler",
                    "bump1Sampler", "bump2Sampler", "bump3Sampler",
                    "shadowSampler0", "shadowSampler1", "shadowSampler2", "shadowSampler3"
                ], join, fallbacks, this.onCompiled, this.onError);
            }
            if (!this._effect.isReady()) {
                return false;
            }
            this._renderId = scene.getRenderId();
            this._wasPreviouslyReady = true;
            if (mesh) {
                if (!mesh._materialDefines) {
                    mesh._materialDefines = new TerrainMaterialDefines();
                }
                this._defines.cloneTo(mesh._materialDefines);
            }
            return true;
        };
        TerrainMaterial.prototype.bindOnlyWorldMatrix = function (world) {
            this._effect.setMatrix("world", world);
        };
        TerrainMaterial.prototype.bind = function (world, mesh) {
            var scene = this.getScene();
            // Matrices        
            this.bindOnlyWorldMatrix(world);
            this._effect.setMatrix("viewProjection", scene.getTransformMatrix());
            // Bones
            if (mesh && mesh.useBones && mesh.computeBonesUsingShaders) {
                this._effect.setMatrices("mBones", mesh.skeleton.getTransformMatrices(mesh));
            }
            if (scene.getCachedMaterial() !== this) {
                // Textures        
                if (this.mixTexture) {
                    this._effect.setTexture("textureSampler", this.mixTexture);
                    this._effect.setFloat2("vTextureInfos", this.mixTexture.coordinatesIndex, this.mixTexture.level);
                    this._effect.setMatrix("textureMatrix", this.mixTexture.getTextureMatrix());
                    if (BABYLON.StandardMaterial.DiffuseTextureEnabled) {
                        if (this.diffuseTexture1) {
                            this._effect.setTexture("diffuse1Sampler", this.diffuseTexture1);
                            this._effect.setFloat2("diffuse1Infos", this.diffuseTexture1.uScale, this.diffuseTexture1.vScale);
                        }
                        if (this.diffuseTexture2) {
                            this._effect.setTexture("diffuse2Sampler", this.diffuseTexture2);
                            this._effect.setFloat2("diffuse2Infos", this.diffuseTexture2.uScale, this.diffuseTexture2.vScale);
                        }
                        if (this.diffuseTexture3) {
                            this._effect.setTexture("diffuse3Sampler", this.diffuseTexture3);
                            this._effect.setFloat2("diffuse3Infos", this.diffuseTexture3.uScale, this.diffuseTexture3.vScale);
                        }
                    }
                    if (BABYLON.StandardMaterial.BumpTextureEnabled && scene.getEngine().getCaps().standardDerivatives) {
                        if (this.bumpTexture1) {
                            this._effect.setTexture("bump1Sampler", this.bumpTexture1);
                        }
                        if (this.bumpTexture2) {
                            this._effect.setTexture("bump2Sampler", this.bumpTexture2);
                        }
                        if (this.bumpTexture3) {
                            this._effect.setTexture("bump3Sampler", this.bumpTexture3);
                        }
                    }
                }
                // Clip plane
                if (scene.clipPlane) {
                    var clipPlane = scene.clipPlane;
                    this._effect.setFloat4("vClipPlane", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
                }
                // Point size
                if (this.pointsCloud) {
                    this._effect.setFloat("pointSize", this.pointSize);
                }
                this._effect.setVector3("vEyePosition", scene._mirroredCameraPosition ? scene._mirroredCameraPosition : scene.activeCamera.position);
            }
            this._effect.setColor4("vDiffuseColor", this._scaledDiffuse, this.alpha * mesh.visibility);
            if (this._defines.SPECULARTERM) {
                this._effect.setColor4("vSpecularColor", this.specularColor, this.specularPower);
            }
            if (scene.lightsEnabled && !this.disableLighting) {
                var lightIndex = 0;
                for (var index = 0; index < scene.lights.length; index++) {
                    var light = scene.lights[index];
                    if (!light.isEnabled()) {
                        continue;
                    }
                    if (!light.canAffectMesh(mesh)) {
                        continue;
                    }
                    if (light instanceof BABYLON.PointLight) {
                        // Point Light
                        light.transferToEffect(this._effect, "vLightData" + lightIndex);
                    }
                    else if (light instanceof BABYLON.DirectionalLight) {
                        // Directional Light
                        light.transferToEffect(this._effect, "vLightData" + lightIndex);
                    }
                    else if (light instanceof BABYLON.SpotLight) {
                        // Spot Light
                        light.transferToEffect(this._effect, "vLightData" + lightIndex, "vLightDirection" + lightIndex);
                    }
                    else if (light instanceof BABYLON.HemisphericLight) {
                        // Hemispheric Light
                        light.transferToEffect(this._effect, "vLightData" + lightIndex, "vLightGround" + lightIndex);
                    }
                    light.diffuse.scaleToRef(light.intensity, this._scaledDiffuse);
                    this._effect.setColor4("vLightDiffuse" + lightIndex, this._scaledDiffuse, light.range);
                    if (this._defines.SPECULARTERM) {
                        light.specular.scaleToRef(light.intensity, this._scaledSpecular);
                        this._effect.setColor3("vLightSpecular" + lightIndex, this._scaledSpecular);
                    }
                    // Shadows
                    if (scene.shadowsEnabled) {
                        var shadowGenerator = light.getShadowGenerator();
                        if (mesh.receiveShadows && shadowGenerator) {
                            this._effect.setMatrix("lightMatrix" + lightIndex, shadowGenerator.getTransformMatrix());
                            this._effect.setTexture("shadowSampler" + lightIndex, shadowGenerator.getShadowMapForRendering());
                            this._effect.setFloat3("shadowsInfo" + lightIndex, shadowGenerator.getDarkness(), shadowGenerator.getShadowMap().getSize().width, shadowGenerator.bias);
                        }
                    }
                    lightIndex++;
                    if (lightIndex === maxSimultaneousLights)
                        break;
                }
            }
            // View
            if (scene.fogEnabled && mesh.applyFog && scene.fogMode !== BABYLON.Scene.FOGMODE_NONE) {
                this._effect.setMatrix("view", scene.getViewMatrix());
            }
            // Fog
            if (scene.fogEnabled && mesh.applyFog && scene.fogMode !== BABYLON.Scene.FOGMODE_NONE) {
                this._effect.setFloat4("vFogInfos", scene.fogMode, scene.fogStart, scene.fogEnd, scene.fogDensity);
                this._effect.setColor3("vFogColor", scene.fogColor);
            }
            _super.prototype.bind.call(this, world, mesh);
        };
        TerrainMaterial.prototype.getAnimatables = function () {
            var results = [];
            if (this.mixTexture && this.mixTexture.animations && this.mixTexture.animations.length > 0) {
                results.push(this.mixTexture);
            }
            return results;
        };
        TerrainMaterial.prototype.dispose = function (forceDisposeEffect) {
            if (this.mixTexture) {
                this.mixTexture.dispose();
            }
            _super.prototype.dispose.call(this, forceDisposeEffect);
        };
        TerrainMaterial.prototype.clone = function (name) {
            var _this = this;
            return BABYLON.SerializationHelper.Clone(function () { return new TerrainMaterial(name, _this.getScene()); }, this);
        };
        TerrainMaterial.prototype.serialize = function () {
            var serializationObject = BABYLON.SerializationHelper.Serialize(this);
            serializationObject.customType = "BABYLON.TerrainMaterial";
            return serializationObject;
        };
        // Statics
        TerrainMaterial.Parse = function (source, scene, rootUrl) {
            return BABYLON.SerializationHelper.Parse(function () { return new TerrainMaterial(source.name, scene); }, source, scene, rootUrl);
        };
        __decorate([
            BABYLON.serializeAsTexture()
        ], TerrainMaterial.prototype, "mixTexture");
        __decorate([
            BABYLON.serializeAsTexture()
        ], TerrainMaterial.prototype, "diffuseTexture1");
        __decorate([
            BABYLON.serializeAsTexture()
        ], TerrainMaterial.prototype, "diffuseTexture2");
        __decorate([
            BABYLON.serializeAsTexture()
        ], TerrainMaterial.prototype, "diffuseTexture3");
        __decorate([
            BABYLON.serializeAsTexture()
        ], TerrainMaterial.prototype, "bumpTexture1");
        __decorate([
            BABYLON.serializeAsTexture()
        ], TerrainMaterial.prototype, "bumpTexture2");
        __decorate([
            BABYLON.serializeAsTexture()
        ], TerrainMaterial.prototype, "bumpTexture3");
        __decorate([
            BABYLON.serializeAsColor3()
        ], TerrainMaterial.prototype, "diffuseColor");
        __decorate([
            BABYLON.serializeAsColor3()
        ], TerrainMaterial.prototype, "specularColor");
        __decorate([
            BABYLON.serialize()
        ], TerrainMaterial.prototype, "specularPower");
        __decorate([
            BABYLON.serialize()
        ], TerrainMaterial.prototype, "disableLighting");
        return TerrainMaterial;
    })(BABYLON.Material);
    BABYLON.TerrainMaterial = TerrainMaterial;
})(BABYLON || (BABYLON = {}));

BABYLON.Effect.ShadersStore['terrainVertexShader'] = "precision highp float;\n\nattribute vec3 position;\n#ifdef NORMAL\nattribute vec3 normal;\n#endif\n#ifdef UV1\nattribute vec2 uv;\n#endif\n#ifdef UV2\nattribute vec2 uv2;\n#endif\n#ifdef VERTEXCOLOR\nattribute vec4 color;\n#endif\n#ifdef BONES\nattribute vec4 matricesIndices;\nattribute vec4 matricesWeights;\n#endif\n\n#ifdef INSTANCES\nattribute vec4 world0;\nattribute vec4 world1;\nattribute vec4 world2;\nattribute vec4 world3;\n#else\nuniform mat4 world;\n#endif\nuniform mat4 view;\nuniform mat4 viewProjection;\n#ifdef DIFFUSE\nvarying vec2 vTextureUV;\nuniform mat4 textureMatrix;\nuniform vec2 vTextureInfos;\n#endif\n#ifdef BONES\nuniform mat4 mBones[BonesPerMesh];\n#endif\n#ifdef POINTSIZE\nuniform float pointSize;\n#endif\n\nvarying vec3 vPositionW;\n#ifdef NORMAL\nvarying vec3 vNormalW;\n#endif\n#ifdef VERTEXCOLOR\nvarying vec4 vColor;\n#endif\n#ifdef CLIPPLANE\nuniform vec4 vClipPlane;\nvarying float fClipDistance;\n#endif\n#ifdef FOG\nvarying float fFogDistance;\n#endif\n#ifdef SHADOWS\n#if defined(SPOTLIGHT0) || defined(DIRLIGHT0)\nuniform mat4 lightMatrix0;\nvarying vec4 vPositionFromLight0;\n#endif\n#if defined(SPOTLIGHT1) || defined(DIRLIGHT1)\nuniform mat4 lightMatrix1;\nvarying vec4 vPositionFromLight1;\n#endif\n#if defined(SPOTLIGHT2) || defined(DIRLIGHT2)\nuniform mat4 lightMatrix2;\nvarying vec4 vPositionFromLight2;\n#endif\n#if defined(SPOTLIGHT3) || defined(DIRLIGHT3)\nuniform mat4 lightMatrix3;\nvarying vec4 vPositionFromLight3;\n#endif\n#endif\nvoid main(void) {\nmat4 finalWorld;\n#ifdef INSTANCES\nfinalWorld=mat4(world0,world1,world2,world3);\n#else\nfinalWorld=world;\n#endif\n#ifdef BONES\nmat4 m0=mBones[int(matricesIndices.x)]*matricesWeights.x;\nmat4 m1=mBones[int(matricesIndices.y)]*matricesWeights.y;\nmat4 m2=mBones[int(matricesIndices.z)]*matricesWeights.z;\n#ifdef BONES4\nmat4 m3=mBones[int(matricesIndices.w)]*matricesWeights.w;\nfinalWorld=finalWorld*(m0+m1+m2+m3);\n#else\nfinalWorld=finalWorld*(m0+m1+m2);\n#endif \n#endif\ngl_Position=viewProjection*finalWorld*vec4(position,1.0);\nvec4 worldPos=finalWorld*vec4(position,1.0);\nvPositionW=vec3(worldPos);\n#ifdef NORMAL\nvNormalW=normalize(vec3(finalWorld*vec4(normal,0.0)));\n#endif\n\n#ifndef UV1\nvec2 uv=vec2(0.,0.);\n#endif\n#ifndef UV2\nvec2 uv2=vec2(0.,0.);\n#endif\n#ifdef DIFFUSE\nif (vTextureInfos.x == 0.)\n{\nvTextureUV=vec2(textureMatrix*vec4(uv,1.0,0.0));\n}\nelse\n{\nvTextureUV=vec2(textureMatrix*vec4(uv2,1.0,0.0));\n}\n#endif\n\n#ifdef CLIPPLANE\nfClipDistance=dot(worldPos,vClipPlane);\n#endif\n\n#ifdef FOG\nfFogDistance=(view*worldPos).z;\n#endif\n\n#ifdef SHADOWS\n#if defined(SPOTLIGHT0) || defined(DIRLIGHT0)\nvPositionFromLight0=lightMatrix0*worldPos;\n#endif\n#if defined(SPOTLIGHT1) || defined(DIRLIGHT1)\nvPositionFromLight1=lightMatrix1*worldPos;\n#endif\n#if defined(SPOTLIGHT2) || defined(DIRLIGHT2)\nvPositionFromLight2=lightMatrix2*worldPos;\n#endif\n#if defined(SPOTLIGHT3) || defined(DIRLIGHT3)\nvPositionFromLight3=lightMatrix3*worldPos;\n#endif\n#endif\n\n#ifdef VERTEXCOLOR\nvColor=color;\n#endif\n\n#ifdef POINTSIZE\ngl_PointSize=pointSize;\n#endif\n}\n";
BABYLON.Effect.ShadersStore['terrainPixelShader'] = "precision highp float;\n\nuniform vec3 vEyePosition;\nuniform vec4 vDiffuseColor;\n#ifdef SPECULARTERM\nuniform vec4 vSpecularColor;\n#endif\n\nvarying vec3 vPositionW;\n#ifdef NORMAL\nvarying vec3 vNormalW;\n#endif\n#ifdef VERTEXCOLOR\nvarying vec4 vColor;\n#endif\n\n#ifdef LIGHT0\nuniform vec4 vLightData0;\nuniform vec4 vLightDiffuse0;\n#ifdef SPECULARTERM\nuniform vec3 vLightSpecular0;\n#endif\n#ifdef SHADOW0\n#if defined(SPOTLIGHT0) || defined(DIRLIGHT0)\nvarying vec4 vPositionFromLight0;\nuniform sampler2D shadowSampler0;\n#else\nuniform samplerCube shadowSampler0;\n#endif\nuniform vec3 shadowsInfo0;\n#endif\n#ifdef SPOTLIGHT0\nuniform vec4 vLightDirection0;\n#endif\n#ifdef HEMILIGHT0\nuniform vec3 vLightGround0;\n#endif\n#endif\n#ifdef LIGHT1\nuniform vec4 vLightData1;\nuniform vec4 vLightDiffuse1;\n#ifdef SPECULARTERM\nuniform vec3 vLightSpecular1;\n#endif\n#ifdef SHADOW1\n#if defined(SPOTLIGHT1) || defined(DIRLIGHT1)\nvarying vec4 vPositionFromLight1;\nuniform sampler2D shadowSampler1;\n#else\nuniform samplerCube shadowSampler1;\n#endif\nuniform vec3 shadowsInfo1;\n#endif\n#ifdef SPOTLIGHT1\nuniform vec4 vLightDirection1;\n#endif\n#ifdef HEMILIGHT1\nuniform vec3 vLightGround1;\n#endif\n#endif\n#ifdef LIGHT2\nuniform vec4 vLightData2;\nuniform vec4 vLightDiffuse2;\n#ifdef SPECULARTERM\nuniform vec3 vLightSpecular2;\n#endif\n#ifdef SHADOW2\n#if defined(SPOTLIGHT2) || defined(DIRLIGHT2)\nvarying vec4 vPositionFromLight2;\nuniform sampler2D shadowSampler2;\n#else\nuniform samplerCube shadowSampler2;\n#endif\nuniform vec3 shadowsInfo2;\n#endif\n#ifdef SPOTLIGHT2\nuniform vec4 vLightDirection2;\n#endif\n#ifdef HEMILIGHT2\nuniform vec3 vLightGround2;\n#endif\n#endif\n#ifdef LIGHT3\nuniform vec4 vLightData3;\nuniform vec4 vLightDiffuse3;\n#ifdef SPECULARTERM\nuniform vec3 vLightSpecular3;\n#endif\n#ifdef SHADOW3\n#if defined(SPOTLIGHT3) || defined(DIRLIGHT3)\nvarying vec4 vPositionFromLight3;\nuniform sampler2D shadowSampler3;\n#else\nuniform samplerCube shadowSampler3;\n#endif\nuniform vec3 shadowsInfo3;\n#endif\n#ifdef SPOTLIGHT3\nuniform vec4 vLightDirection3;\n#endif\n#ifdef HEMILIGHT3\nuniform vec3 vLightGround3;\n#endif\n#endif\n\n#ifdef DIFFUSE\nvarying vec2 vTextureUV;\nuniform sampler2D textureSampler;\nuniform vec2 vTextureInfos;\nuniform sampler2D diffuse1Sampler;\nuniform sampler2D diffuse2Sampler;\nuniform sampler2D diffuse3Sampler;\nuniform vec2 diffuse1Infos;\nuniform vec2 diffuse2Infos;\nuniform vec2 diffuse3Infos;\n#endif\n#ifdef BUMP\nuniform sampler2D bump1Sampler;\nuniform sampler2D bump2Sampler;\nuniform sampler2D bump3Sampler;\n#endif\n\n#ifdef SHADOWS\nfloat unpack(vec4 color)\n{\nconst vec4 bit_shift=vec4(1.0/(255.0*255.0*255.0),1.0/(255.0*255.0),1.0/255.0,1.0);\nreturn dot(color,bit_shift);\n}\n#if defined(POINTLIGHT0) || defined(POINTLIGHT1) || defined(POINTLIGHT2) || defined(POINTLIGHT3)\nfloat computeShadowCube(vec3 lightPosition,samplerCube shadowSampler,float darkness,float bias)\n{\nvec3 directionToLight=vPositionW-lightPosition;\nfloat depth=length(directionToLight);\ndepth=clamp(depth,0.,1.0);\ndirectionToLight=normalize(directionToLight);\ndirectionToLight.y =-directionToLight.y;\nfloat shadow=unpack(textureCube(shadowSampler,directionToLight))+bias;\nif (depth>shadow)\n{\nreturn darkness;\n}\nreturn 1.0;\n}\nfloat computeShadowWithPCFCube(vec3 lightPosition,samplerCube shadowSampler,float mapSize,float bias,float darkness)\n{\nvec3 directionToLight=vPositionW-lightPosition;\nfloat depth=length(directionToLight);\ndepth=clamp(depth,0.,1.0);\nfloat diskScale=2.0/mapSize;\ndirectionToLight=normalize(directionToLight);\ndirectionToLight.y=-directionToLight.y;\nfloat visibility=1.;\nvec3 poissonDisk[4];\npoissonDisk[0]=vec3(-1.0,1.0,-1.0);\npoissonDisk[1]=vec3(1.0,-1.0,-1.0);\npoissonDisk[2]=vec3(-1.0,-1.0,-1.0);\npoissonDisk[3]=vec3(1.0,-1.0,1.0);\n\nfloat biasedDepth=depth-bias;\nif (unpack(textureCube(shadowSampler,directionToLight+poissonDisk[0]*diskScale))<biasedDepth) visibility-=0.25;\nif (unpack(textureCube(shadowSampler,directionToLight+poissonDisk[1]*diskScale))<biasedDepth) visibility-=0.25;\nif (unpack(textureCube(shadowSampler,directionToLight+poissonDisk[2]*diskScale))<biasedDepth) visibility-=0.25;\nif (unpack(textureCube(shadowSampler,directionToLight+poissonDisk[3]*diskScale))<biasedDepth) visibility-=0.25;\nreturn min(1.0,visibility+darkness);\n}\n#endif\n#if defined(SPOTLIGHT0) || defined(SPOTLIGHT1) || defined(SPOTLIGHT2) || defined(SPOTLIGHT3) || defined(DIRLIGHT0) || defined(DIRLIGHT1) || defined(DIRLIGHT2) || defined(DIRLIGHT3)\nfloat computeShadow(vec4 vPositionFromLight,sampler2D shadowSampler,float darkness,float bias)\n{\nvec3 depth=vPositionFromLight.xyz/vPositionFromLight.w;\ndepth=0.5*depth+vec3(0.5);\nvec2 uv=depth.xy;\nif (uv.x<0. || uv.x>1.0 || uv.y<0. || uv.y>1.0)\n{\nreturn 1.0;\n}\nfloat shadow=unpack(texture2D(shadowSampler,uv))+bias;\nif (depth.z>shadow)\n{\nreturn darkness;\n}\nreturn 1.;\n}\nfloat computeShadowWithPCF(vec4 vPositionFromLight,sampler2D shadowSampler,float mapSize,float bias,float darkness)\n{\nvec3 depth=vPositionFromLight.xyz/vPositionFromLight.w;\ndepth=0.5*depth+vec3(0.5);\nvec2 uv=depth.xy;\nif (uv.x<0. || uv.x>1.0 || uv.y<0. || uv.y>1.0)\n{\nreturn 1.0;\n}\nfloat visibility=1.;\nvec2 poissonDisk[4];\npoissonDisk[0]=vec2(-0.94201624,-0.39906216);\npoissonDisk[1]=vec2(0.94558609,-0.76890725);\npoissonDisk[2]=vec2(-0.094184101,-0.92938870);\npoissonDisk[3]=vec2(0.34495938,0.29387760);\n\nfloat biasedDepth=depth.z-bias;\nif (unpack(texture2D(shadowSampler,uv+poissonDisk[0]/mapSize))<biasedDepth) visibility-=0.25;\nif (unpack(texture2D(shadowSampler,uv+poissonDisk[1]/mapSize))<biasedDepth) visibility-=0.25;\nif (unpack(texture2D(shadowSampler,uv+poissonDisk[2]/mapSize))<biasedDepth) visibility-=0.25;\nif (unpack(texture2D(shadowSampler,uv+poissonDisk[3]/mapSize))<biasedDepth) visibility-=0.25;\nreturn min(1.0,visibility+darkness);\n}\n\nfloat unpackHalf(vec2 color)\n{\nreturn color.x+(color.y/255.0);\n}\nfloat linstep(float low,float high,float v) {\nreturn clamp((v-low)/(high-low),0.0,1.0);\n}\nfloat ChebychevInequality(vec2 moments,float compare,float bias)\n{\nfloat p=smoothstep(compare-bias,compare,moments.x);\nfloat variance=max(moments.y-moments.x*moments.x,0.02);\nfloat d=compare-moments.x;\nfloat p_max=linstep(0.2,1.0,variance/(variance+d*d));\nreturn clamp(max(p,p_max),0.0,1.0);\n}\nfloat computeShadowWithVSM(vec4 vPositionFromLight,sampler2D shadowSampler,float bias,float darkness)\n{\nvec3 depth=vPositionFromLight.xyz/vPositionFromLight.w;\ndepth=0.5*depth+vec3(0.5);\nvec2 uv=depth.xy;\nif (uv.x<0. || uv.x>1.0 || uv.y<0. || uv.y>1.0 || depth.z>=1.0)\n{\nreturn 1.0;\n}\nvec4 texel=texture2D(shadowSampler,uv);\nvec2 moments=vec2(unpackHalf(texel.xy),unpackHalf(texel.zw));\nreturn min(1.0,1.0-ChebychevInequality(moments,depth.z,bias)+darkness);\n}\n#endif\n#endif\n#ifdef CLIPPLANE\nvarying float fClipDistance;\n#endif\n\n#ifdef FOG\n#define FOGMODE_NONE 0.\n#define FOGMODE_EXP 1.\n#define FOGMODE_EXP2 2.\n#define FOGMODE_LINEAR 3.\n#define E 2.71828\nuniform vec4 vFogInfos;\nuniform vec3 vFogColor;\nvarying float fFogDistance;\nfloat CalcFogFactor()\n{\nfloat fogCoeff=1.0;\nfloat fogStart=vFogInfos.y;\nfloat fogEnd=vFogInfos.z;\nfloat fogDensity=vFogInfos.w;\nif (FOGMODE_LINEAR == vFogInfos.x)\n{\nfogCoeff=(fogEnd-fFogDistance)/(fogEnd-fogStart);\n}\nelse if (FOGMODE_EXP == vFogInfos.x)\n{\nfogCoeff=1.0/pow(E,fFogDistance*fogDensity);\n}\nelse if (FOGMODE_EXP2 == vFogInfos.x)\n{\nfogCoeff=1.0/pow(E,fFogDistance*fFogDistance*fogDensity*fogDensity);\n}\nreturn clamp(fogCoeff,0.0,1.0);\n}\n#endif\n\n#ifdef BUMP\n#extension GL_OES_standard_derivatives : enable\n\nmat3 cotangent_frame(vec3 normal,vec3 p,vec2 uv)\n{\n\nvec3 dp1=dFdx(p);\nvec3 dp2=dFdy(p);\nvec2 duv1=dFdx(uv);\nvec2 duv2=dFdy(uv);\n\nvec3 dp2perp=cross(dp2,normal);\nvec3 dp1perp=cross(normal,dp1);\nvec3 tangent=dp2perp*duv1.x+dp1perp*duv2.x;\nvec3 binormal=dp2perp*duv1.y+dp1perp*duv2.y;\n\nfloat invmax=inversesqrt(max(dot(tangent,tangent),dot(binormal,binormal)));\nreturn mat3(tangent*invmax,binormal*invmax,normal);\n}\nvec3 perturbNormal(vec3 viewDir,vec3 mixColor)\n{ \nvec3 bump1Color=texture2D(bump1Sampler,vTextureUV*diffuse1Infos).xyz;\nvec3 bump2Color=texture2D(bump2Sampler,vTextureUV*diffuse2Infos).xyz;\nvec3 bump3Color=texture2D(bump3Sampler,vTextureUV*diffuse3Infos).xyz;\nbump1Color.rgb*=mixColor.r;\nbump2Color.rgb=mix(bump1Color.rgb,bump2Color.rgb,mixColor.g);\nvec3 map=mix(bump2Color.rgb,bump3Color.rgb,mixColor.b);\nmap=map*255./127.-128./127.;\nmat3 TBN=cotangent_frame(vNormalW*vTextureInfos.y,-viewDir,vTextureUV);\nreturn normalize(TBN*map);\n}\n#endif\n\nstruct lightingInfo\n{\nvec3 diffuse;\n#ifdef SPECULARTERM\nvec3 specular;\n#endif\n};\nlightingInfo computeLighting(vec3 viewDirectionW,vec3 vNormal,vec4 lightData,vec3 diffuseColor,vec3 specularColor,float range,float glossiness) {\nlightingInfo result;\nvec3 lightVectorW;\nfloat attenuation=1.0;\nif (lightData.w == 0.)\n{\nvec3 direction=lightData.xyz-vPositionW;\nattenuation=max(0.,1.0-length(direction)/range);\nlightVectorW=normalize(direction);\n}\nelse\n{\nlightVectorW=normalize(-lightData.xyz);\n}\n\nfloat ndl=max(0.,dot(vNormal,lightVectorW));\nresult.diffuse=ndl*diffuseColor*attenuation;\n#ifdef SPECULARTERM\n\nvec3 angleW=normalize(viewDirectionW+lightVectorW);\nfloat specComp=max(0.,dot(vNormal,angleW));\nspecComp=pow(specComp,max(1.,glossiness));\nresult.specular=specComp*specularColor*attenuation;\n#endif\nreturn result;\n}\nlightingInfo computeSpotLighting(vec3 viewDirectionW,vec3 vNormal,vec4 lightData,vec4 lightDirection,vec3 diffuseColor,vec3 specularColor,float range,float glossiness) {\nlightingInfo result;\nvec3 direction=lightData.xyz-vPositionW;\nvec3 lightVectorW=normalize(direction);\nfloat attenuation=max(0.,1.0-length(direction)/range);\n\nfloat cosAngle=max(0.,dot(-lightDirection.xyz,lightVectorW));\nfloat spotAtten=0.0;\nif (cosAngle>=lightDirection.w)\n{\ncosAngle=max(0.,pow(cosAngle,lightData.w));\nspotAtten=clamp((cosAngle-lightDirection.w)/(1.-cosAngle),0.0,1.0);\n\nfloat ndl=max(0.,dot(vNormal,-lightDirection.xyz));\nresult.diffuse=ndl*spotAtten*diffuseColor*attenuation;\n#ifdef SPECULARTERM\n\nvec3 angleW=normalize(viewDirectionW-lightDirection.xyz);\nfloat specComp=max(0.,dot(vNormal,angleW));\nspecComp=pow(specComp,max(1.,glossiness));\nresult.specular=specComp*specularColor*spotAtten*attenuation;\n#endif\nreturn result;\n}\nresult.diffuse=vec3(0.);\n#ifdef SPECULARTERM\nresult.specular=vec3(0.);\n#endif\nreturn result;\n}\nlightingInfo computeHemisphericLighting(vec3 viewDirectionW,vec3 vNormal,vec4 lightData,vec3 diffuseColor,vec3 specularColor,vec3 groundColor,float glossiness) {\nlightingInfo result;\n\nfloat ndl=dot(vNormal,lightData.xyz)*0.5+0.5;\nresult.diffuse=mix(groundColor,diffuseColor,ndl);\n#ifdef SPECULARTERM\n\nvec3 angleW=normalize(viewDirectionW+lightData.xyz);\nfloat specComp=max(0.,dot(vNormal,angleW));\nspecComp=pow(specComp,max(1.,glossiness));\nresult.specular=specComp*specularColor;\n#endif\nreturn result;\n}\nvoid main(void) {\n\n#ifdef CLIPPLANE\nif (fClipDistance>0.0)\ndiscard;\n#endif\nvec3 viewDirectionW=normalize(vEyePosition-vPositionW);\n\nvec4 baseColor=vec4(1.,1.,1.,1.);\nvec3 diffuseColor=vDiffuseColor.rgb;\n#ifdef SPECULARTERM\nfloat glossiness=vSpecularColor.a;\nvec3 specularColor=vSpecularColor.rgb;\n#else\nfloat glossiness=0.;\n#endif\n\nfloat alpha=vDiffuseColor.a;\n\n#ifdef NORMAL\nvec3 normalW=normalize(vNormalW);\n#else\nvec3 normalW=vec3(1.0,1.0,1.0);\n#endif\n#ifdef DIFFUSE\nbaseColor=texture2D(textureSampler,vTextureUV);\n#if defined(BUMP) && defined(DIFFUSE)\nnormalW=perturbNormal(viewDirectionW,baseColor.rgb);\n#endif\n#ifdef ALPHATEST\nif (baseColor.a<0.4)\ndiscard;\n#endif\nbaseColor.rgb*=vTextureInfos.y;\nvec4 diffuse1Color=texture2D(diffuse1Sampler,vTextureUV*diffuse1Infos);\nvec4 diffuse2Color=texture2D(diffuse2Sampler,vTextureUV*diffuse2Infos);\nvec4 diffuse3Color=texture2D(diffuse3Sampler,vTextureUV*diffuse3Infos);\ndiffuse1Color.rgb*=baseColor.r;\ndiffuse2Color.rgb=mix(diffuse1Color.rgb,diffuse2Color.rgb,baseColor.g);\nbaseColor.rgb=mix(diffuse2Color.rgb,diffuse3Color.rgb,baseColor.b);\n#endif\n#ifdef VERTEXCOLOR\nbaseColor.rgb*=vColor.rgb;\n#endif\n\nvec3 diffuseBase=vec3(0.,0.,0.);\n#ifdef SPECULARTERM\nvec3 specularBase=vec3(0.,0.,0.);\n#endif\nfloat shadow=1.;\n#ifdef LIGHT0\n#ifndef SPECULARTERM\nvec3 vLightSpecular0=vec3(0.0);\n#endif\n#ifdef SPOTLIGHT0\nlightingInfo info=computeSpotLighting(viewDirectionW,normalW,vLightData0,vLightDirection0,vLightDiffuse0.rgb,vLightSpecular0,vLightDiffuse0.a,glossiness);\n#endif\n#ifdef HEMILIGHT0\nlightingInfo info=computeHemisphericLighting(viewDirectionW,normalW,vLightData0,vLightDiffuse0.rgb,vLightSpecular0,vLightGround0,glossiness);\n#endif\n#if defined(POINTLIGHT0) || defined(DIRLIGHT0)\nlightingInfo info=computeLighting(viewDirectionW,normalW,vLightData0,vLightDiffuse0.rgb,vLightSpecular0,vLightDiffuse0.a,glossiness);\n#endif\n#ifdef SHADOW0\n#ifdef SHADOWVSM0\nshadow=computeShadowWithVSM(vPositionFromLight0,shadowSampler0,shadowsInfo0.z,shadowsInfo0.x);\n#else\n#ifdef SHADOWPCF0\n#if defined(POINTLIGHT0)\nshadow=computeShadowWithPCFCube(vLightData0.xyz,shadowSampler0,shadowsInfo0.y,shadowsInfo0.z,shadowsInfo0.x);\n#else\nshadow=computeShadowWithPCF(vPositionFromLight0,shadowSampler0,shadowsInfo0.y,shadowsInfo0.z,shadowsInfo0.x);\n#endif\n#else\n#if defined(POINTLIGHT0)\nshadow=computeShadowCube(vLightData0.xyz,shadowSampler0,shadowsInfo0.x,shadowsInfo0.z);\n#else\nshadow=computeShadow(vPositionFromLight0,shadowSampler0,shadowsInfo0.x,shadowsInfo0.z);\n#endif\n#endif\n#endif\n#else\nshadow=1.;\n#endif\ndiffuseBase+=info.diffuse*shadow;\n#ifdef SPECULARTERM\nspecularBase+=info.specular*shadow;\n#endif\n#endif\n#ifdef LIGHT1\n#ifndef SPECULARTERM\nvec3 vLightSpecular1=vec3(0.0);\n#endif\n#ifdef SPOTLIGHT1\ninfo=computeSpotLighting(viewDirectionW,normalW,vLightData1,vLightDirection1,vLightDiffuse1.rgb,vLightSpecular1,vLightDiffuse1.a,glossiness);\n#endif\n#ifdef HEMILIGHT1\ninfo=computeHemisphericLighting(viewDirectionW,normalW,vLightData1,vLightDiffuse1.rgb,vLightSpecular1,vLightGround1,glossiness);\n#endif\n#if defined(POINTLIGHT1) || defined(DIRLIGHT1)\ninfo=computeLighting(viewDirectionW,normalW,vLightData1,vLightDiffuse1.rgb,vLightSpecular1,vLightDiffuse1.a,glossiness);\n#endif\n#ifdef SHADOW1\n#ifdef SHADOWVSM1\nshadow=computeShadowWithVSM(vPositionFromLight1,shadowSampler1,shadowsInfo1.z,shadowsInfo1.x);\n#else\n#ifdef SHADOWPCF1\n#if defined(POINTLIGHT1)\nshadow=computeShadowWithPCFCube(vLightData1.xyz,shadowSampler1,shadowsInfo1.y,shadowsInfo1.z,shadowsInfo1.x);\n#else\nshadow=computeShadowWithPCF(vPositionFromLight1,shadowSampler1,shadowsInfo1.y,shadowsInfo1.z,shadowsInfo1.x);\n#endif\n#else\n#if defined(POINTLIGHT1)\nshadow=computeShadowCube(vLightData1.xyz,shadowSampler1,shadowsInfo1.x,shadowsInfo1.z);\n#else\nshadow=computeShadow(vPositionFromLight1,shadowSampler1,shadowsInfo1.x,shadowsInfo1.z);\n#endif\n#endif\n#endif\n#else\nshadow=1.;\n#endif\ndiffuseBase+=info.diffuse*shadow;\n#ifdef SPECULARTERM\nspecularBase+=info.specular*shadow;\n#endif\n#endif\n#ifdef LIGHT2\n#ifndef SPECULARTERM\nvec3 vLightSpecular2=vec3(0.0);\n#endif\n#ifdef SPOTLIGHT2\ninfo=computeSpotLighting(viewDirectionW,normalW,vLightData2,vLightDirection2,vLightDiffuse2.rgb,vLightSpecular2,vLightDiffuse2.a,glossiness);\n#endif\n#ifdef HEMILIGHT2\ninfo=computeHemisphericLighting(viewDirectionW,normalW,vLightData2,vLightDiffuse2.rgb,vLightSpecular2,vLightGround2,glossiness);\n#endif\n#if defined(POINTLIGHT2) || defined(DIRLIGHT2)\ninfo=computeLighting(viewDirectionW,normalW,vLightData2,vLightDiffuse2.rgb,vLightSpecular2,vLightDiffuse2.a,glossiness);\n#endif\n#ifdef SHADOW2\n#ifdef SHADOWVSM2\nshadow=computeShadowWithVSM(vPositionFromLight2,shadowSampler2,shadowsInfo2.z,shadowsInfo2.x);\n#else\n#ifdef SHADOWPCF2\n#if defined(POINTLIGHT2)\nshadow=computeShadowWithPCFCube(vLightData2.xyz,shadowSampler2,shadowsInfo2.y,shadowsInfo2.z,shadowsInfo2.x);\n#else\nshadow=computeShadowWithPCF(vPositionFromLight2,shadowSampler2,shadowsInfo2.y,shadowsInfo2.z,shadowsInfo2.x);\n#endif\n#else\n#if defined(POINTLIGHT2)\nshadow=computeShadowCube(vLightData2.xyz,shadowSampler2,shadowsInfo2.x,shadowsInfo2.z);\n#else\nshadow=computeShadow(vPositionFromLight2,shadowSampler2,shadowsInfo2.x,shadowsInfo2.z);\n#endif\n#endif \n#endif \n#else\nshadow=1.;\n#endif\ndiffuseBase+=info.diffuse*shadow;\n#ifdef SPECULARTERM\nspecularBase+=info.specular*shadow;\n#endif\n#endif\n#ifdef LIGHT3\n#ifndef SPECULARTERM\nvec3 vLightSpecular3=vec3(0.0);\n#endif\n#ifdef SPOTLIGHT3\ninfo=computeSpotLighting(viewDirectionW,normalW,vLightData3,vLightDirection3,vLightDiffuse3.rgb,vLightSpecular3,vLightDiffuse3.a,glossiness);\n#endif\n#ifdef HEMILIGHT3\ninfo=computeHemisphericLighting(viewDirectionW,normalW,vLightData3,vLightDiffuse3.rgb,vLightSpecular3,vLightGround3,glossiness);\n#endif\n#if defined(POINTLIGHT3) || defined(DIRLIGHT3)\ninfo=computeLighting(viewDirectionW,normalW,vLightData3,vLightDiffuse3.rgb,vLightSpecular3,vLightDiffuse3.a,glossiness);\n#endif\n#ifdef SHADOW3\n#ifdef SHADOWVSM3\nshadow=computeShadowWithVSM(vPositionFromLight3,shadowSampler3,shadowsInfo3.z,shadowsInfo3.x);\n#else\n#ifdef SHADOWPCF3\n#if defined(POINTLIGHT3)\nshadow=computeShadowWithPCFCube(vLightData3.xyz,shadowSampler3,shadowsInfo3.y,shadowsInfo3.z,shadowsInfo3.x);\n#else\nshadow=computeShadowWithPCF(vPositionFromLight3,shadowSampler3,shadowsInfo3.y,shadowsInfo3.z,shadowsInfo3.x);\n#endif\n#else\n#if defined(POINTLIGHT3)\nshadow=computeShadowCube(vLightData3.xyz,shadowSampler3,shadowsInfo3.x,shadowsInfo3.z);\n#else\nshadow=computeShadow(vPositionFromLight3,shadowSampler3,shadowsInfo3.x,shadowsInfo3.z);\n#endif\n#endif \n#endif \n#else\nshadow=1.;\n#endif\ndiffuseBase+=info.diffuse*shadow;\n#ifdef SPECULARTERM\nspecularBase+=info.specular*shadow;\n#endif\n#endif\n#ifdef VERTEXALPHA\nalpha*=vColor.a;\n#endif\n#ifdef SPECULARTERM\nvec3 finalSpecular=specularBase*specularColor;\n#else\nvec3 finalSpecular=vec3(0.0);\n#endif\nvec3 finalDiffuse=clamp(diffuseBase*diffuseColor*baseColor.rgb,0.0,1.0);\n\nvec4 color=vec4(finalDiffuse+finalSpecular,alpha);\n#ifdef FOG\nfloat fog=CalcFogFactor();\ncolor.rgb=fog*color.rgb+(1.0-fog)*vFogColor;\n#endif\ngl_FragColor=color;\n}\n";
