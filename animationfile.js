(function() { "use strict";

  const SPRITE_SIZE = 16;

/
  var Animation = function(frame_set, delay) {

    this.count = 0;
    this.delay = delay;
    this.frame = 0;
    this.frame_index = 0;
    this.frame_set = frame_set;

  };

  Animation.prototype = {
    change:function(frame_set, delay = 15) {
      if (this.frame_set != frame_set) {
        this.count = 0;
        this.delay = delay;
        this.frame_index = 0;
        this.frame_set = frame_set;
        this.frame = this.frame_set[this.frame_index];
      }
    },
    update:function() {
      this.count ++;
      if (this.count >= this.delay) {
        this.count = 0;
        this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
        this.frame = this.frame_set[this.frame_index];
      }
    }
  };

  var buffer, controller, display, loop, player, render, resize, sprite_sheet;

  buffer = document.createElement("canvas").getContext("2d");
  display = document.querySelector("canvas").getContext("2d");

  controller = {
    left:  { active:false, state:false },
    right: { active:false, state:false },
    up:    { active:false, state:false },

    keyUpDown:function(event) {
      var key_state = (event.type == "keydown") ? true : false;
      switch(event.keyCode) {
        case 37:
          if (controller.left.state != key_state) controller.left.active = key_state;
          controller.left.state  = key_state;
        break;
        case 38:
          if (controller.up.state != key_state) controller.up.active = key_state;
          controller.up.state  = key_state;
        break;
        case 39:
          if (controller.right.state != key_state) controller.right.active = key_state;
          controller.right.state  = key_state;
        break;
      }
    }
  };

 
  player = {
    animation:new Animation(),
    jumping:true,
    height:16,    width:16,
    x:0,          y:40 - 18,
    x_velocity:0, y_velocity:0
  };


  sprite_sheet = {
    frame_sets:[[0, 1], [2, 3], [4, 5]],
    image:new Image()
  };

  loop = function(time_stamp) {
    if (controller.up.active && !player.jumping) {
      controller.up.active = false;
      player.jumping = true;
      player.y_velocity -= 2.5;
    }
    if (controller.left.active) {
      player.animation.change(sprite_sheet.frame_sets[2], 15);
      player.x_velocity -= 0.05;
    }

    if (controller.right.active) {
      player.animation.change(sprite_sheet.frame_sets[1], 15);
      player.x_velocity += 0.05;
    }
    if (!controller.left.active && !controller.right.active) {
      player.animation.change(sprite_sheet.frame_sets[0], 20);
    }
    player.y_velocity += 0.25;
    player.x += player.x_velocity;
    player.y += player.y_velocity;
    player.x_velocity *= 0.9;
    player.y_velocity *= 0.9;
    if (player.y + player.height > buffer.canvas.height - 2) {
      player.jumping = false;
      player.y = buffer.canvas.height - 2 - player.height;
      player.y_velocity = 0;
    }
    if (player.x + player.width < 0) {
      player.x = buffer.canvas.width;
    } else if (player.x > buffer.canvas.width) {
      player.x = - player.width;
    }
    player.animation.update();
    render();
    window.requestAnimationFrame(loop);
  };
