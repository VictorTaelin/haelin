const wlv = require("../../who-loves-voxels");

window.onload = function() {
  var TIBIA_CAM = true;

  // Canvas
  var canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.border = "1px solid #A0A0A0";
  document.getElementById("main").appendChild(canvas);
  //canvas.getContext('2d').scale(2,2);

  // Keyboard events
  var key = {};
  for (var i = 0; i < 255; ++i) { key[String.fromCharCode(i)] = 0; }
  document.body.onkeydown = (e) => key[e.key] = 1;
  document.body.onkeyup = (e) => key[e.key] = 0;

  // Camera
  if (TIBIA_CAM) {
    var cam = wlv.cam(wlv.TIBIA_CAM, [0, 0, 100]);
  } else {
    var cam = wlv.cam(wlv.PERSP_CAM, [128, 128, 128]);
    cam.rot = wlv.quat_mul(cam.rot, wlv.quat_rot_x(Math.PI));
    cam.rot = wlv.quat_mul(cam.rot, wlv.quat_rot_y(-Math.PI * 0.25));
    cam.rot = wlv.quat_mul(cam.rot, wlv.quat_rot_z(Math.PI * 0.25));
  }

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
  sprites.push(wlv.sprite({col: 0x606060FF, siz: [16, 16, 64], pos: [-64, -64, 32]}));
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
    if (TIBIA_CAM) {
      cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale([1,0,0], (key.f - key.s) * 3.0));
      cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale([0,1,0], (key.e - key.d) * 3.0));
      cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale([0,0,1], (key.r - key.w) * 3.0));
    } else {
      cam.rot = wlv.quat_mul(cam.rot, wlv.quat_rot_x((key.k - key.i) * Math.PI * 0.006));
      cam.rot = wlv.quat_mul(cam.rot, wlv.quat_rot_y((key.l - key.j) * Math.PI * 0.006));
      cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale(wlv.cam_tox(cam), (key.f - key.s) * 3.0));
      cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale(wlv.cam_toy(cam), (key.r - key.w) * 3.0));
      cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale(wlv.cam_toz(cam), (key.e - key.d) * 3.0));
    }
    document.title = JSON.stringify(cam.pos);

    wlv.render({canvas, camera: cam, sprites});
    window.requestAnimationFrame(render);
  }
  window.requestAnimationFrame(render);
}
