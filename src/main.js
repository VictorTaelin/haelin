const wlv = require("../../who-loves-voxels");

window.onload = function() {
  console.log("Welcome to Haelin!");
  console.log("Commands:");
  console.log("[SPACE] toggle camera (3D or TIBIA)");
  console.log("[S , F] move left / right");
  console.log("[E , D] move forward / backward");
  console.log("[W , R] move up / down");
  console.log("[J , L] rotate left / right");
  console.log("[I , K] rotate up / ridown");
  console.log("[I , K] roll left / right");

  // Canvas
  var canvas = document.createElement("canvas");
  canvas.width = canvas.height = Math.min(window.innerWidth, window.innerHeight);
  //canvas.style.border = "1px solid #A0A0A0";
  document.body.style.backgroundColor = "black";
  document.getElementById("main").appendChild(canvas);
  document.body.style.display = "flex";
  document.body.style.alignItems = "center";
  document.body.style.justifyContent = "center";

  // Keyboard events
  var key = {};
  for (var i = 0; i < 255; ++i) { key[String.fromCharCode(i)] = 0; }
  document.body.onkeydown = (e) => key[e.key] = 1;
  document.body.onkeyup = (e) => key[e.key] = 0;
  document.body.onkeypress = (e) => { if (e.keyCode === 32) cam = init_cam(tibia_cam = !tibia_cam); /*console.log("cam.pos="+JSON.stringify(cam.pos)+"; cam.rot = "+JSON.stringify(cam.rot)+";")*/ };

  // Camera
  function init_cam(tibia_cam) {
    if (tibia_cam) {
      var cam = wlv.cam(wlv.TIBIA_CAM, [0, 0, 128]);
    } else {
      var cam = wlv.cam(wlv.PERSP_CAM, [0, 256, 256]);
      cam.rot = wlv.quat_mul(cam.rot, wlv.quat_rot_x(Math.PI * 0.75));
    }
    return cam;
  };
  var tibia_cam = true;
  var cam = init_cam(tibia_cam);

  //cam.pos = [156.6067645619414,-29.15571341204272,85.37594945235826];
  //cam.rot = [0.25274925542723903,0.5244215796699753,-0.6895393325845806,-0.4308541858636721];

  // Lights
  var lights = [];
  lights.push({pos: [64, 0, 64], pow: 1.0});

  // Sprites
  var sprites = [];

  // Flooat
  sprites.push(wlv.sprite({
    col: 0xa0a0a0FF,
    siz: [256, 256, 8],
    pos: [0, 0, -4]
  }));

  // Main pillar / box
  sprites.push(wlv.sprite({loc: [ 0, 0, 64], siz: [24, 24, 24], pos: [0, 0, 12], vox: ([x,y,z]) => 0xff00000c}));
  sprites.push(wlv.sprite({loc: [24, 0, 64], siz: [24, 24, 24], pos: [0, 0, 36], vox: ([x,y,z]) => 0x00ff000c}));
  sprites.push(wlv.sprite({loc: [48, 0, 64], siz: [24, 24, 24], pos: [0, 0, 58], vox: ([x,y,z]) => 0x0000ff0c}));
  sprites.push(wlv.sprite({loc: [72, 0, 64], siz: [24, 24, 24], pos: [0, 0, 82], vox: ([x,y,z]) => 0xffff000c}));

  // Pillars
  sprites.push(wlv.sprite({col: 0x60606080, siz: [16, 16, 64], pos: [-64, -64, 32]}));
  sprites.push(wlv.sprite({col: 0x606060FF, siz: [16, 16, 64], pos: [-64, +64, 32]}));
  sprites.push(wlv.sprite({col: 0x606060FF, siz: [16, 16, 64], pos: [+64, -64, 32]}));
  sprites.push(wlv.sprite({col: 0x606060FF, siz: [16, 16, 64], pos: [+64, +64, 32]}));

  // Ball
  sprites.push(wlv.sprite({loc: [ 0,  64, 0], siz: [32, 32, 32], pos: [ 64,   0, 16], vox: ([x,y,z]) => (wlv.vec_dist([x,y,z], [16,16,16]) < 16 ? 0xFF0000FF : 0x00)}));
  sprites.push(wlv.sprite({loc: [ 0, 128, 0], siz: [32, 32, 32], pos: [  0,  64, 16], vox: ([x,y,z]) => (wlv.vec_dist([x,y,z], [16,16,16]) < 16 ? 0x00FF00FF : 0x00)}));
  sprites.push(wlv.sprite({loc: [64,  64, 0], siz: [32, 32, 32], pos: [-64,   0, 16], vox: ([x,y,z]) => (wlv.vec_dist([x,y,z], [16,16,16]) < 16 ? 0x0000FFFF : 0x00)}));
  sprites.push(wlv.sprite({loc: [64, 128, 0], siz: [32, 32, 32], pos: [  0, -64, 16], vox: ([x,y,z]) => (wlv.vec_dist([x,y,z], [16,16,16]) < 16 ? 0x000000FF : 0x00)}));

  // Render loop
  function render() {
    var time = Date.now() / 1000;

    // Camera
    if (tibia_cam) {
      cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale([1,0,0], (key.f - key.s) * 3.0));
      cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale([0,1,0], (key.d - key.e) * 3.0));
      cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale([0,0,1], (key.r - key.w) * 3.0));
    } else {
      cam.rot = wlv.quat_mul(cam.rot, wlv.quat_rot_x((key.k - key.i) * Math.PI * 0.006));
      cam.rot = wlv.quat_mul(cam.rot, wlv.quat_rot_y((key.l - key.j) * Math.PI * 0.006));
      cam.rot = wlv.quat_mul(cam.rot, wlv.quat_rot_z((key.u - key.o) * Math.PI * 0.006));
      cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale(wlv.cam_tox(cam), (key.f - key.s) * 3.0));
      cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale(wlv.cam_toy(cam), (key.r - key.w) * 3.0));
      cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale(wlv.cam_toz(cam), (key.e - key.d) * 3.0));
    }

    // Title
    document.title = JSON.stringify(cam.pos.map(x => Math.floor(x)));

    // Lights
    var lights = [];
    for (var i = 0; i < 4; ++i) {
      lights.push({pos: [64 * Math.cos(time * (i + 1)), 64 * Math.sin(time * (i + 1)), 64], pow: 512.0});
    }
    if (time % 6 > 4) {
      var pow = 256.0 * 256.0 * 4.0 * Math.min(1.0 - (time % 6 - 5), 1.0);
      lights.push({pos: [256, 0, 128], pow});
    }

    wlv.render({canvas, lights, camera: cam, sprites, debug: 1});
    window.requestAnimationFrame(render);
  }
  window.requestAnimationFrame(render);
}
