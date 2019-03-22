const wlv = require("../../who-loves-voxels");

window.onload = function() {
  // Canvas
  var canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  canvas.style.border = "1px solid #A0A0A0";
  document.getElementById("main").appendChild(canvas);

  // Keyboard events
  var key = {};
  for (var i = 0; i < 255; ++i) { key[String.fromCharCode(i)] = 0; }
  document.body.onkeydown = (e) => key[e.key] = 1;
  document.body.onkeyup = (e) => key[e.key] = 0;

  // Camera
  var cam = wlv.cam([128, 128, 128]);
  cam.rot = wlv.quat_mul(cam.rot, wlv.quat_rot_x(Math.PI));
  cam.rot = wlv.quat_mul(cam.rot, wlv.quat_rot_y(-Math.PI * 0.25));
  cam.rot = wlv.quat_mul(cam.rot, wlv.quat_rot_z(Math.PI * 0.25));

  // Sprites
  var sprites = [];
  sprites.push(wlv.sprite({
    col: 0xD0F0E0FF,
    siz: [256, 256, 32],
    pos: [0, 0, -64]
  }));
  sprites.push(wlv.sprite({
    col: 0x606060FF,
    siz: [16, 16, 256],
    pos: [0, 0, 0]
  }));
  sprites.push(wlv.sprite({
    loc: [0, 0, 0], 
    siz: [32, 32, 32], 
    pos: [0, 0, 0], 
    vox: ([x,y,z]) => 0xFF000008
  }));
  sprites.push(wlv.sprite({
    loc: [64, 0, 0], 
    siz: [64, 64, 64], 
    pos: [72, 0, 0], 
    vox: ([x,y,z]) => (wlv.vec_dist([x,y,z], [32,32,32]) < 16 ? 0x00FF0008 : 0x00)
  }));
  sprites.push(wlv.sprite({
    loc: [128, 0, 0],
    siz: [32, 32, 32],
    pos: [0, 72, 0],
    vox: ([x,y,z]) => 0x0000FF04
  }));

  // Render loop
  function render() {
    cam.rot = wlv.quat_mul(cam.rot, wlv.quat_rot_x((key.k - key.i) * Math.PI * 0.006));
    cam.rot = wlv.quat_mul(cam.rot, wlv.quat_rot_y((key.l - key.j) * Math.PI * 0.006));
    cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale(wlv.cam_tox(cam), (key.f - key.s) * 3.0));
    cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale(wlv.cam_toy(cam), (key.r - key.w) * 3.0));
    cam.pos = wlv.vec_add(cam.pos, wlv.vec_scale(wlv.cam_toz(cam), (key.e - key.d) * 3.0));

    wlv.render(canvas, cam, sprites);
    window.requestAnimationFrame(render);
  }
  window.requestAnimationFrame(render);
}
