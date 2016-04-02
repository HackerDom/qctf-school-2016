
var cellSize = 2;

var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);

var activeScene = 0;
var activeSceneChange = false;

var sunnySceneObjects = {'player': undefined, 'camera' : undefined, 'maze' : false, 'objects' : undefined, 'scene' : 'scene1', 'compositId' : 'sunnyScene'};
var catacombSceneObjects = {'player': undefined, 'camera' : undefined, 'maze' : false, 'objects' : undefined, 'scene' : 'scene2', 'compositId' : 'catacombMaze', 'light' : undefined};
    
var currentConfiguration = sunnySceneObjects;

var scene = undefined;
var scene2 = undefined;

var keysCount = 0;    

function createScene(){
    var scene = new BABYLON.Scene(engine);
    scene.actionManager = new BABYLON.ActionManager(scene); // чтоб можно было вешаться на кнопочки
    return scene;
}

function createCamera(scene, player){
    var camera = new BABYLON.TouchCamera('TouchCamera', new BABYLON.Vector3(player.position.x - 20, 20, player.position.z), scene); // вообще камера для сенсорных устройств. костыль.
    camera.rotation = new BABYLON.Vector3(Math.PI/4, Math.PI/2, Math.PI/4);
    camera.target = player;
    return camera;
}

function createPlayer (scene, playerPosition, playerId){
    var spriteManagerPlayer = new BABYLON.SpriteManager('playerManager', './textures/hero.png', 1000, 64, scene);
    var player = new BABYLON.Sprite(playerId, spriteManagerPlayer);
    player.position.x = playerPosition['x'] * cellSize;
    player.position.y = 1;
    player.position.z = playerPosition['z'] * cellSize;
    player.cellIndex = 9;
    player.size = cellSize;
    return player;
}

function createGround(scene, groundTextureFile, groundId, maze){
    var width = maze.length * cellSize;
    var height = maze[0].length * cellSize;

    var ground = BABYLON.Mesh.CreateGround('ground', width, height, 40, scene);
    ground.position.x = -cellSize / 2 + width / 2;
    ground.position.z = -cellSize / 2 + height / 2;
    var materialGround = new BABYLON.StandardMaterial('groundTexture', scene);
    materialGround.diffuseTexture = new BABYLON.Texture('./textures/grass3.png', scene);
    materialGround.diffuseTexture.hasAlpha = true;
    materialGround.diffuseTexture.uScale = width / cellSize;
    materialGround.diffuseTexture.vScale = height / cellSize;
    ground.material = materialGround;

    return ground;

}

function createObjectsOnMaze(scene, maze, compositId, objects){
    // (name, filename, maximum num of instances, cell size, scene)
    var spriteManagerTrees = new BABYLON.SpriteManager('treesManager', './textures/trees.png', 1000, 64, scene);
    
    var spriteManagerStones = new BABYLON.SpriteManager('stonesManager', './textures/stone.png', 1000, 64, scene);

    var spriteManagerKeys = new BABYLON.SpriteManager('keysManager', './textures/key.png', 550, 64, scene);

    var spriteManagerTeleports = new BABYLON.SpriteManager('teleportsManager', './textures/teleport.png', 550, 64, scene);
    var spriteManagerGirls = new BABYLON.SpriteManager("girlsManager", "./textures/girls.png", 550, 64, scene);
    var spriteManagerFences = new BABYLON.SpriteManager("fencesManager", "./textures/fences.png", 550, 64, scene);
    var spriteManagerDragons = new BABYLON.SpriteManager("dragonsManager", "./textures/dragons.png", 550, 64, scene);

    var typesFunctions = [];
    objects['keys'] = [];
    objects['trees'] = []
    objects['stones'] = [];
    objects["girls"] = [];
    objects["teleports"] = [];
    objects["fences"] = [];
    objects["dragons"] = [];

    typesFunctions['tree'] = function(i, j, id) {
        var tree = new BABYLON.Sprite(compositId + 'Tree' + id, spriteManagerTrees);
        tree.position.x = i * cellSize;
        tree.position.z = j * cellSize;
        tree.position.y = 1;
        tree.size = cellSize;
        idx = Math.floor(Math.random() * (15 + 1));
        tree.cellIndex = idx;
        objects['trees'][compositId + 'Tree' + id] = tree;
    };
    typesFunctions['stone'] = function(i, j, id) {
        var stone = new BABYLON.Sprite(compositId + 'Stone' + id, spriteManagerStones);
        stone.position.x = i * cellSize;
        stone.position.z = j * cellSize;
        stone.position.y = 1;
        stone.size = cellSize;
        objects['stones'][compositId + 'Stone' + id] = stone;
    };
    typesFunctions['key'] = function(i, j, id) {
        var key = new BABYLON.Sprite(compositId + 'Key' + id, spriteManagerKeys);
        key.position.x = i * cellSize;
        key.position.z = j * cellSize;
        key.position.y = 1;
        key.size = cellSize;
        key.showBoundingBox = true;
        objects['keys'][compositId + 'Key' + id] = key;
    };
    
    typesFunctions["girl"] = function(i, j, id) { 
        var girl = new BABYLON.Sprite(compositId + "Girl" + id, spriteManagerGirls);
        girl.position.x = i * cellSize;
        girl.position.z = j * cellSize;
        girl.position.y = 1;
        girl.size = cellSize;

        idx = Math.floor(Math.random() * (15 + 1));
        girl.cellIndex = idx;

        objects["girls"][compositId + "Girl" + id] = girl;
    };

    typesFunctions["dragon"] = function(i, j, id) { 
        var dragon = new BABYLON.Sprite(compositId + "Dragon" + id, spriteManagerDragons);
        dragon.position.x = i * cellSize;
        dragon.position.z = j * cellSize;
        dragon.position.y = 1;
        dragon.size = cellSize;

        idx = Math.floor(Math.random() * (15 + 1));
        dragon.cellIndex = idx;
        
        objects["dragons"][compositId + "Dragon" + id] = dragon;
    };

    typesFunctions['empty'] = function(i, j, id) { };

    typesFunctions['teleport'] = function(i, j, id) {
        var teleport = new BABYLON.Sprite(compositId + 'Teleport' + id, spriteManagerTeleports);
        teleport.position.x = i * cellSize;
        teleport.position.z = j * cellSize;
        teleport.position.y = 1;
        teleport.size = cellSize;
        teleport.playAnimation(0, 15, true, 100);
        objects['teleports'][compositId + 'Teleport' + id] = teleport;
    };

    for (var i = 0; i < maze.length; i++)
        for (var j = 0; j < maze[i].length; j++)
        {
            var f = typesFunctions[maze[i][j]['type']];
            f(i, j, maze[i][j]['id']);
        }
}

function createSunnyScene(maze, playerPosition){
    var scene = createScene();
    var player = createPlayer(scene, playerPosition, 'sunnyPlayer');
    var camera = createCamera(scene, player);
    var light = new BABYLON.HemisphericLight('sunnyLight', new BABYLON.Vector3(0,1,0), scene);

    sunnySceneObjects.player = player;
    sunnySceneObjects.camera = camera;
    sunnySceneObjects['objects'] = [];

    createObjectsOnMaze(scene, maze, sunnySceneObjects['compositId'], sunnySceneObjects['objects']);
    var ground = createGround(scene, './textures/grass3.png', 'sunnyGround', maze);

    // var skybox = BABYLON.Mesh.CreateBox('skyBox', 50.0, scene);
    // var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
    // skyboxMaterial.backFaceCulling = false;
    // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('./textures/skybox/TropicalSunnyDay', scene);
    // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    // skyboxMaterial.disableLighting = true;
    // skybox.material = skyboxMaterial;

    return scene;
}

function createCatacombScene(maze, playerPosition){
    var scene = createScene();
    var player = createPlayer(scene, playerPosition, 'catacombPlayer');
    var camera = createCamera(scene, player);

    // id, position, direction, angle, exponent
    var light = new BABYLON.SpotLight('catacombLight', new BABYLON.Vector3(player.position.x, 20, player.position.z), new BABYLON.Vector3(0, -1, 0), 1, 30, scene);

    catacombSceneObjects.player = player;
    catacombSceneObjects.camera = camera;
    catacombSceneObjects['objects'] = [];
    catacombSceneObjects.light = light;

    createObjectsOnMaze(scene, maze, catacombSceneObjects['compositId'], catacombSceneObjects['objects']);
    var ground = createGround(scene, './textures/ground.jpg', 'catacombGround', maze);

    return scene;
}

function move(player, camera, xFactor, zFactor) {
    hidePopup();
    player.position.x += cellSize*xFactor;
    camera.position.x += cellSize*xFactor;
    player.position.z += cellSize*zFactor;
    camera.position.z += cellSize*zFactor;
    if (currentConfiguration.light)
    {
        currentConfiguration.light.position.x += cellSize*xFactor;
        currentConfiguration.light.position.z += cellSize*zFactor;
    }

    var maze = currentConfiguration['maze'];

    var neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (var i = 0; i < 4; i++)
    {
        var cell = maze[parseInt(player.position.x / cellSize) + neighbors[i][0]][parseInt(player.position.z/cellSize) + neighbors[i][1]];
        if (cell['type'] == 'dragon')
        {
            talk(cell['id']);
        }
    }
}

function keyHandler(xFactor, zFactor) {
    player = currentConfiguration.player;
    camera = currentConfiguration.camera;
    maze = currentConfiguration['maze'];
    keys = currentConfiguration['objects']['keys'];
    var cell = maze[parseInt(player.position.x / cellSize) + 1*xFactor][parseInt(player.position.z/cellSize) + 1*zFactor];
    if (cell['type'] == 'key')
    {
        keysCount += 1;
        var id = currentConfiguration['compositId'] + 'Key' + cell['id'];
        keys[id].dispose();
        delete keys[id];
        cell['type'] = 'empty';
    }
    if (cell['type'] == 'empty')
    {
        move(player, camera, xFactor, zFactor);
    }

    if (cell['type'] == 'teleport')
    {
        move(player, camera, xFactor, zFactor);
        if (!activeSceneChange)
        {
            if (activeScene == 1)
            {
                var sameTeleport = undefined;
                for (var teleport in sunnySceneObjects['objects']['teleports'])
                    if (teleport == 'sunnySceneTeleport' + cell['id'])
                        sameTeleport = sunnySceneObjects['objects']['teleports'][teleport];

                deltaX = sameTeleport.position.x - sunnySceneObjects.player.position.x;
                deltaZ = sameTeleport.position.z - sunnySceneObjects.player.position.z;

                catacombSceneObjects.player.position.x += deltaX;
                catacombSceneObjects.player.position.z += deltaZ;

                catacombSceneObjects.camera.position.x += deltaX;
                catacombSceneObjects.camera.position.z += deltaZ;

                currentConfiguration = sunnySceneObjects;
                activeScene = 0;
            }
            else
            {
                var sameTeleport = undefined;
                for (var teleport in catacombSceneObjects['objects']['teleports'])
                    if (teleport == 'catacombMazeTeleport' + cell['id'])
                        sameTeleport = catacombSceneObjects['objects']['teleports'][teleport];

                deltaX = sameTeleport.position.x - catacombSceneObjects.player.position.x;
                deltaZ = sameTeleport.position.z - catacombSceneObjects.player.position.z;

                catacombSceneObjects.player.position.x += deltaX;
                catacombSceneObjects.player.position.z += deltaZ;

                catacombSceneObjects.camera.position.x += deltaX;
                catacombSceneObjects.camera.position.z += deltaZ;

                catacombSceneObjects.light.position.x += deltaX;
                catacombSceneObjects.light.position.z += deltaZ;

                console.log(catacombSceneObjects.camera.position)
                console.log(sunnySceneObjects.camera.position)

                currentConfiguration = catacombSceneObjects;
                activeScene = 1;
            }
            activeSceneChange = true;
        }
    }
    else
    {
        activeSceneChange = false;
    }
}

    
function map_loaded(maze)
{
    sunnyMaze = maze.sunnyMaze;
    catacombMaze = maze.catacombMaze;
    playerPosition = maze.playerPosition;

    sunnySceneObjects.maze = sunnyMaze;
    catacombSceneObjects.maze = catacombMaze;

    scene = createSunnyScene(sunnyMaze, playerPosition);
    scene2 = createCatacombScene(catacombMaze, playerPosition);                    

    var lastKeyDownTime = new Date();
    var lastDirection = undefined;

    // можно сделать combineCodeAction и должен быть массив функций
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function(event) {
        var now = new Date()
        if (lastDirection == event.sourceEvent.keyCode && now - lastKeyDownTime < 100)
        {
            return;
        }
        else
            lastKeyDownTime = now;
        if (event.sourceEvent.keyCode == 37) // left
        {
            keyHandler(0, 1);
            player.playAnimation(0, 3, false, 100);
            lastDirection = 37;
        }
        if (event.sourceEvent.keyCode == 39) // right
        {
            keyHandler(0, -1);
            player.playAnimation(4, 7, false, 100);
            lastDirection = 39;
        }
        if (event.sourceEvent.keyCode == 38) // up
        {
            keyHandler(1, 0);
            player.playAnimation(12, 15, false, 100);
            lastDirection = 38;
        }
        if (event.sourceEvent.keyCode == 40) // down
        {
            keyHandler(-1, 0); 
            player.playAnimation(8, 11, false, 100);
            lastDirection = 40;
        }
    }));

    var activePointFunction = function(){
        var docHeight = $(document).height();
        $("<div id='overlay'></div>") 
        .appendTo('body') 
        .height(docHeight) 
        .css({ 
            'opacity': 0.8, 
            'position': 'absolute', 
            'top': 0, 
            'left': 0, 
            'background-color': 'black', 
            'width': '100%', 
            'z-index': 1 
        });

        $("<button id='b'>close</button>") 
        .appendTo('body') 
        .height(docHeight) 
        .css({ 
            'position': 'absolute', 
            'top': 0, 
            'left': '1000px', 
            'width': '100px',
            'height': '20px',
            'position': 'absolute',
            'z-index': 2
        });

        $('#b').click(function() {
            $('#overlay').remove();
            $(this).remove();
            click_cont = 0;
        });

        $.getJSON('/get_task/7/77f87', function(answer){
            if (answer['status'] == 'ok')
            {
                $("<div id='overlay'>" + answer['text'] + '</div>') 
                .appendTo('body') 
                .height(docHeight) 
                .css({ 
                    'width' : '50%',
                    'margin' : 'auto',
                    'z-index': 2 
                });
            }
        });
    }

    engine.runRenderLoop(function(){
        if (activeScene == 0)
            scene.render();
        else {
            var player = catacombSceneObjects.player;
            for (var obj_type in catacombSceneObjects.objects) {
                console.log(obj_type);
                for (var obj_key in catacombSceneObjects.objects[obj_type]) {
                    var obj = catacombSceneObjects.objects[obj_type][obj_key];
                    var delta_x = obj.position.x - player.position.x;
                    var delta_z = obj.position.z - player.position.z;
                    if (delta_x * delta_x + delta_z * delta_z > 50)
                        obj.width = 0;
                    else
                        obj.width = 2;
                }
             }
            scene2.render();
        }
    });

    window.addEventListener('resize', function(){
        engine.resize();
    });
}