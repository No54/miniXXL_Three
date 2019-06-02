var camera;

var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function makeBigCube() {

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //事件监听 resize事件
    window.addEventListener('resize', onWindowResize, false);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(-200, 200, -200);
    //camera.lookAt(0, 0, 0); 貌似是视口方向


    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    //#region  生成大方块
    var colorSet1 = [];
    var colorSet = [];
    for (var i = 0; i <= 15; i++) {

        colorSet1.push({
            color: 0xFF0000
        }); //红色
        colorSet1.push({
            color: 0xFFFF00
        }); //黄色
        colorSet1.push({
            color: 0x0000FF
        }); //蓝色
        colorSet1.push({
            color: 0x00FF00
        }); //绿色

        if (i == 15) {
            for (var j = 0; j <= 63; j++) {
                var ran = parseInt(Math.random() * colorSet1.length);
                colorSet.push(colorSet1[ran]);
                colorSet1.splice(ran, 1);
            }
        }
    }

    var colorI = -1;
    for (var ix = -2; ix <= 1; ix++) {
        for (var iy = -2; iy <= 1; iy++) {
            for (var iz = -2; iz <= 1; iz++) {
                colorI = colorI + 1;
                var geometry = new THREE.BoxGeometry(20, 20, 20);
                var material = new THREE.MeshBasicMaterial(colorSet[colorI]);
                var cube = new THREE.Mesh(geometry, material);
                cube.position.set(ix * 20, iy * 20, iz * 20);
                scene.add(cube);
            }
        }
    }
    //#endregion

    renderer.render(scene, camera);

    animate();

    //resize事件
    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    var userName = prompt("点击两个相同颜色的方块，将方块消除。\r\n" +
        "看看你用多少时间消除全部方块。\r\n" +
        "输入昵称，然后点击确定后游戏开始！");

    var dt1 = new Date();
    var cubeNum = 64;
    var tempObj = null;
    window.addEventListener('click', startGame);
    window.addEventListener('touchend', startGame);

    function startGame(event) {

        if (event.touches) { 
            mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1; 
        } else {
            // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1) 
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; 
        } 

        window.requestAnimationFrame(function () {

            // 通过摄像机和鼠标位置更新射线
            raycaster.setFromCamera(mouse, camera);

            // 计算物体和射线的焦点
            var intersects = raycaster.intersectObjects(scene.children);

            if (intersects[0] != null) {
                if (tempObj != null) {
                    if (colorEq(intersects[0].object.material.color, tempObj.object.material.color) &&
                        intersects[0].object.uuid.toString() != tempObj.object.uuid.toString()) {
                        intersects[0].object.visible = false;
                        tempObj.object.visible = false;
                        tempObj = null;
                        cubeNum = cubeNum - 2;
                    } else {
                        tempObj = null;
                    }
                } else {
                    tempObj = intersects[0];
                }
            }

            renderer.render(scene, camera);

            if (cubeNum <= 0) {
                var dt2 = new Date();
                var span = new Date(dt2 - dt1);
                alert("恭喜" + userName + "！您共用了" +
                    span.getSeconds() + "." +
                    span.getMilliseconds() + "秒！");
            }
        });
    }



    function colorEq(inColor1, inColor2) {
        if (inColor1.r == inColor2.r &&
            inColor1.g == inColor2.g &&
            inColor1.b == inColor2.b) {
            return true;
        } else {
            return false;
        }
    }
}