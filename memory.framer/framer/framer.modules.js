require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"flipComponent":[function(require,module,exports){
"FlipComponent\n\nfrontLayer <layer>\nbackLayer <layer>\n\nflip()\nflipToFront()\nflipToBack()";
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.FlipComponent = (function(superClass) {
  var FlipDirection, States;

  extend(FlipComponent, superClass);

  States = {
    Front: "frontState",
    Back: "backState"
  };

  FlipDirection = {
    Right: "right",
    Left: "left",
    Top: "top",
    Bottom: "bottom"
  };

  function FlipComponent(options) {
    if (options == null) {
      options = {};
    }
    FlipComponent.__super__.constructor.apply(this, arguments);
    options = _.defaults(options, {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      flipDirection: FlipDirection.Right,
      curve: "spring(300, 50, 0)",
      autoFlip: true,
      perspective: 1000
    });
    this.width = options.width;
    this.height = options.height;
    if (options.front == null) {
      options.front = new Layer({
        backgroundColor: "white"
      });
    }
    if (options.back == null) {
      options.back = new Layer({
        backgroundColor: "#2dd7aa"
      });
    }
    this.front = options.front;
    this.back = options.back;
    this.perspective = options.perspective;
    this.style["-webkit-transform-style"] = "preserve-3d";
    this._state = States.Front;
    this.flipDirection = options.flipDirection;
    this.autoFlip = options.autoFlip;
    this.curve = options.curve;
    this.backgroundColor = null;
    this.clip = false;
    this.on(Events.Click, function() {
      if (this.autoFlip) {
        return this.flip();
      }
    });
    this.on("change:width", (function(_this) {
      return function() {
        _this._front.width = _this.width;
        return _this._back.width = _this.width;
      };
    })(this));
    this.on("change:height", (function(_this) {
      return function() {
        _this._front.height = _this.height;
        return _this._back.height = _this.height;
      };
    })(this));
  }

  FlipComponent.prototype.state = function() {
    return this._state;
  };

  FlipComponent.define("front", {
    get: function() {
      return this._front;
    },
    set: function(layer) {
      var ref;
      if ((ref = this._front) != null) {
        ref.destroy();
      }
      this._front = layer;
      this._front.point = {
        x: 0,
        y: 0
      };
      this._front.width = this.width;
      this._front.height = this.height;
      this._front.superLayer = this;
      return this._front.style.webkitBackfaceVisibility = "hidden";
    }
  });

  FlipComponent.define("back", {
    get: function() {
      return this._back;
    },
    set: function(layer) {
      var ref;
      if ((ref = this._back) != null) {
        ref.destroy();
      }
      this._back = layer;
      this._back.point = {
        x: 0,
        y: 0
      };
      this._back.width = this.width;
      this._back.height = this.height;
      this._back.superLayer = this;
      return this._back.style.webkitBackfaceVisibility = "hidden";
    }
  });

  FlipComponent.define("flipDirection", {
    get: function() {
      return this._flipDirection;
    },
    set: function(direction) {
      this._flipDirection = direction;
      this._back.rotationY = 0;
      this._back.rotationX = 0;
      this._front.rotationY = 0;
      this._front.rotationX = 0;
      if (this._state === States.Front) {
        if (direction === FlipDirection.Right) {
          return this._back.rotationY = 180;
        } else if (direction === FlipDirection.Left) {
          return this._back.rotationY = -180;
        } else if (direction === FlipDirection.Top) {
          return this._back.rotationX = 180;
        } else {
          return this._back.rotationX = -180;
        }
      } else {
        if (direction === FlipDirection.Right) {
          return this._front.rotationY = -180;
        } else if (direction === FlipDirection.Left) {
          return this._front.rotationY = 180;
        } else if (direction === FlipDirection.Top) {
          return this._front.rotationX = -180;
        } else {
          return this._front.rotationX = 180;
        }
      }
    }
  });

  FlipComponent.prototype.flip = function() {
    if (this._state === States.Front) {
      return this.flipToBack();
    } else {
      return this.flipToFront();
    }
  };

  FlipComponent.prototype.flipToFront = function() {
    var props;
    if (this._state === States.Back) {
      this._state = States.Front;
      props = {};
      if (this.flipDirection === FlipDirection.Right) {
        props.rotationY = 180;
      } else if (this.flipDirection === FlipDirection.Left) {
        props.rotationY = -180;
      } else if (this.flipDirection === FlipDirection.Top) {
        props.rotationX = 180;
      } else if (this.flipDirection === FlipDirection.Bottom) {
        props.rotationX = -180;
      }
      this._front.animate({
        properties: {
          rotationY: 0,
          rotationX: 0
        },
        curve: this.curve
      });
      return this._back.animate({
        properties: props,
        curve: this.curve
      });
    }
  };

  FlipComponent.prototype.flipToBack = function() {
    var props;
    if (this._state === States.Front) {
      this._state = States.Back;
      props = {};
      if (this.flipDirection === FlipDirection.Right) {
        props.rotationY = -180;
      } else if (this.flipDirection === FlipDirection.Left) {
        props.rotationY = 180;
      } else if (this.flipDirection === FlipDirection.Top) {
        props.rotationX = -180;
      } else if (this.flipDirection === FlipDirection.Bottom) {
        props.rotationX = 180;
      }
      this._front.animate({
        properties: props,
        curve: this.curve
      });
      return this._back.animate({
        properties: {
          rotationY: 0,
          rotationX: 0
        },
        curve: this.curve
      });
    }
  };

  return FlipComponent;

})(Layer);



},{}],"flipComponent":[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
"FlipComponent\n\nfrontLayer <layer>\nbackLayer <layer>\n\nflip()\nflipToFront()\nflipToBack()";
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.FlipComponent = (function(superClass) {
  var FlipDirection, States;

  extend(FlipComponent, superClass);

  States = {
    Front: "frontState",
    Back: "backState"
  };

  FlipDirection = {
    Right: "right",
    Left: "left",
    Top: "top",
    Bottom: "bottom"
  };

  function FlipComponent(options) {
    if (options == null) {
      options = {};
    }
    FlipComponent.__super__.constructor.apply(this, arguments);
    options = _.defaults(options, {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      flipDirection: FlipDirection.Right,
      curve: "spring(300, 50, 0)",
      autoFlip: true,
      perspective: 1000
    });
    this.width = options.width;
    this.height = options.height;
    if (options.front == null) {
      options.front = new Layer({
        backgroundColor: "white"
      });
    }
    if (options.back == null) {
      options.back = new Layer({
        backgroundColor: "white"
      });
    }
    this.front = options.front;
    this.back = options.back;
    this.perspective = options.perspective;
    this.style["-webkit-transform-style"] = "preserve-3d";
    this._state = States.Front;
    this.flipDirection = options.flipDirection;
    this.autoFlip = options.autoFlip;
    this.curve = options.curve;
    this.backgroundColor = null;
    this.clip = false;
    this.on(Events.Click, function() {
      if (this.autoFlip) {
        return this.flip();
      }
    });
    this.on("change:width", (function(_this) {
      return function() {
        _this._front.width = _this.width;
        return _this._back.width = _this.width;
      };
    })(this));
    this.on("change:height", (function(_this) {
      return function() {
        _this._front.height = _this.height;
        return _this._back.height = _this.height;
      };
    })(this));
  }

  FlipComponent.prototype.state = function() {
    return this._state;
  };

  FlipComponent.define("front", {
    get: function() {
      return this._front;
    },
    set: function(layer) {
      var ref;
      if ((ref = this._front) != null) {
        ref.destroy();
      }
      this._front = layer;
      this._front.point = {
        x: 0,
        y: 0
      };
      this._front.width = this.width;
      this._front.height = this.height;
      this._front.superLayer = this;
      return this._front.style.webkitBackfaceVisibility = "hidden";
    }
  });

  FlipComponent.define("back", {
    get: function() {
      return this._back;
    },
    set: function(layer) {
      var ref;
      if ((ref = this._back) != null) {
        ref.destroy();
      }
      this._back = layer;
      this._back.point = {
        x: 0,
        y: 0
      };
      this._back.width = this.width;
      this._back.height = this.height;
      this._back.superLayer = this;
      return this._back.style.webkitBackfaceVisibility = "hidden";
    }
  });

  FlipComponent.define("flipDirection", {
    get: function() {
      return this._flipDirection;
    },
    set: function(direction) {
      this._flipDirection = direction;
      this._back.rotationY = 0;
      this._back.rotationX = 0;
      this._front.rotationY = 0;
      this._front.rotationX = 0;
      if (this._state === States.Front) {
        if (direction === FlipDirection.Right) {
          return this._back.rotationY = 180;
        } else if (direction === FlipDirection.Left) {
          return this._back.rotationY = -180;
        } else if (direction === FlipDirection.Top) {
          return this._back.rotationX = 180;
        } else {
          return this._back.rotationX = -180;
        }
      } else {
        if (direction === FlipDirection.Right) {
          return this._front.rotationY = -180;
        } else if (direction === FlipDirection.Left) {
          return this._front.rotationY = 180;
        } else if (direction === FlipDirection.Top) {
          return this._front.rotationX = -180;
        } else {
          return this._front.rotationX = 180;
        }
      }
    }
  });

  FlipComponent.prototype.flip = function() {
    if (this._state === States.Front) {
      return this.flipToBack();
    } else {
      return this.flipToFront();
    }
  };

  FlipComponent.prototype.flipToFront = function() {
    var props;
    if (this._state === States.Back) {
      this._state = States.Front;
      props = {};
      if (this.flipDirection === FlipDirection.Right) {
        props.rotationY = 180;
      } else if (this.flipDirection === FlipDirection.Left) {
        props.rotationY = -180;
      } else if (this.flipDirection === FlipDirection.Top) {
        props.rotationX = 180;
      } else if (this.flipDirection === FlipDirection.Bottom) {
        props.rotationX = -180;
      }
      this._front.animate({
        properties: {
          rotationY: 0,
          rotationX: 0
        },
        curve: this.curve
      });
      return this._back.animate({
        properties: props,
        curve: this.curve
      });
    }
  };

  FlipComponent.prototype.flipToBack = function() {
    var props;
    if (this._state === States.Front) {
      this._state = States.Back;
      props = {};
      if (this.flipDirection === FlipDirection.Right) {
        props.rotationY = -180;
      } else if (this.flipDirection === FlipDirection.Left) {
        props.rotationY = 180;
      } else if (this.flipDirection === FlipDirection.Top) {
        props.rotationX = -180;
      } else if (this.flipDirection === FlipDirection.Bottom) {
        props.rotationX = 180;
      }
      this._front.animate({
        properties: props,
        curve: this.curve
      });
      return this._back.animate({
        properties: {
          rotationY: 0,
          rotationX: 0
        },
        curve: this.curve
      });
    }
  };

  return FlipComponent;

})(Layer);

},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZWxsaW90bm9sdGVuL2FwcHMvbWVtb3J5LmZyYW1lci9tb2R1bGVzL2ZsaXBDb21wb25lbnQuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvZWxsaW90bm9sdGVuL2FwcHMvbWVtb3J5LmZyYW1lci9tb2R1bGVzL2ZsaXBDb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNJQSwrRkFBQSxDQUFBO0FBQUEsSUFBQTs2QkFBQTs7QUFBQSxPQVdhLENBQUM7QUFFYixNQUFBLHFCQUFBOztBQUFBLG1DQUFBLENBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQ0M7QUFBQSxJQUFBLEtBQUEsRUFBTyxZQUFQO0FBQUEsSUFDQSxJQUFBLEVBQU8sV0FEUDtHQURELENBQUE7O0FBQUEsRUFJQSxhQUFBLEdBQ0M7QUFBQSxJQUFBLEtBQUEsRUFBTyxPQUFQO0FBQUEsSUFDQSxJQUFBLEVBQU0sTUFETjtBQUFBLElBRUEsR0FBQSxFQUFLLEtBRkw7QUFBQSxJQUdBLE1BQUEsRUFBUSxRQUhSO0dBTEQsQ0FBQTs7QUFVYSxFQUFBLHVCQUFDLE9BQUQsR0FBQTs7TUFBQyxVQUFVO0tBQ3ZCO0FBQUEsSUFBQSxnREFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLElBQ0EsT0FBQSxHQUFVLENBQUMsQ0FBQyxRQUFGLENBQVcsT0FBWCxFQUNUO0FBQUEsTUFBQSxDQUFBLEVBQUcsQ0FBSDtBQUFBLE1BQ0EsQ0FBQSxFQUFHLENBREg7QUFBQSxNQUVBLEtBQUEsRUFBTyxHQUZQO0FBQUEsTUFHQSxNQUFBLEVBQVEsR0FIUjtBQUFBLE1BSUEsYUFBQSxFQUFlLGFBQWEsQ0FBQyxLQUo3QjtBQUFBLE1BS0EsS0FBQSxFQUFPLG9CQUxQO0FBQUEsTUFNQSxRQUFBLEVBQVUsSUFOVjtBQUFBLE1BT0EsV0FBQSxFQUFhLElBUGI7S0FE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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIFV0aWxzID0gcmVxdWlyZSBcIi4uL1V0aWxzXCJcbiMge0xheWVyfSA9IHJlcXVpcmUgXCIuLi9MYXllclwiXG4jIHtFdmVudHN9ID0gcmVxdWlyZSBcIi4uL0V2ZW50c1wiXG5cblwiXCJcIlxuRmxpcENvbXBvbmVudFxuXG5mcm9udExheWVyIDxsYXllcj5cbmJhY2tMYXllciA8bGF5ZXI+XG5cbmZsaXAoKVxuZmxpcFRvRnJvbnQoKVxuZmxpcFRvQmFjaygpXG5cIlwiXCJcblxuY2xhc3MgZXhwb3J0cy5GbGlwQ29tcG9uZW50IGV4dGVuZHMgTGF5ZXJcblxuXHRTdGF0ZXMgPVxuXHRcdEZyb250OiBcImZyb250U3RhdGVcIlxuXHRcdEJhY2s6ICBcImJhY2tTdGF0ZVwiXG5cdFx0XG5cdEZsaXBEaXJlY3Rpb24gPVxuXHRcdFJpZ2h0Olx0XCJyaWdodFwiXG5cdFx0TGVmdDpcdFwibGVmdFwiXG5cdFx0VG9wOlx0XCJ0b3BcIlxuXHRcdEJvdHRvbTogXCJib3R0b21cIlxuXHRcdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMgPSB7fSkgLT5cblx0XHRzdXBlclxuXHRcdG9wdGlvbnMgPSBfLmRlZmF1bHRzIG9wdGlvbnMsIFxuXHRcdFx0eDogMFxuXHRcdFx0eTogMFxuXHRcdFx0d2lkdGg6IDEwMFxuXHRcdFx0aGVpZ2h0OiAxMDBcblx0XHRcdGZsaXBEaXJlY3Rpb246IEZsaXBEaXJlY3Rpb24uUmlnaHRcblx0XHRcdGN1cnZlOiBcInNwcmluZygzMDAsIDUwLCAwKVwiXG5cdFx0XHRhdXRvRmxpcDogdHJ1ZVxuXHRcdFx0cGVyc3BlY3RpdmU6IDEwMDBcblxuXHRcdEB3aWR0aCA9IG9wdGlvbnMud2lkdGhcblx0XHRAaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHRcblxuXHRcdG9wdGlvbnMuZnJvbnQgPz0gbmV3IExheWVyKGJhY2tncm91bmRDb2xvcjogXCJ3aGl0ZVwiKVxuXHRcdG9wdGlvbnMuYmFjayAgPz0gbmV3IExheWVyKGJhY2tncm91bmRDb2xvcjogXCIjMmRkN2FhXCIpXG5cblx0XHRAZnJvbnQgPSBvcHRpb25zLmZyb250XG5cdFx0QGJhY2sgPSBvcHRpb25zLmJhY2tcblxuXHRcdEBwZXJzcGVjdGl2ZSA9IG9wdGlvbnMucGVyc3BlY3RpdmVcblx0XHRAc3R5bGVbXCItd2Via2l0LXRyYW5zZm9ybS1zdHlsZVwiXSA9IFwicHJlc2VydmUtM2RcIlxuXHRcdEBfc3RhdGUgPSBTdGF0ZXMuRnJvbnRcblxuXHRcdEBmbGlwRGlyZWN0aW9uID0gb3B0aW9ucy5mbGlwRGlyZWN0aW9uXG5cblx0XHRAYXV0b0ZsaXAgPSBvcHRpb25zLmF1dG9GbGlwXG5cdFx0QGN1cnZlID0gb3B0aW9ucy5jdXJ2ZVxuXHRcdEBiYWNrZ3JvdW5kQ29sb3IgPSBudWxsXG5cdFx0QGNsaXAgPSBmYWxzZVxuXG5cdFx0QG9uIEV2ZW50cy5DbGljaywgLT5cblx0XHRcdGlmIEBhdXRvRmxpcFxuXHRcdFx0XHRAZmxpcCgpXG5cblx0XHRAb24gXCJjaGFuZ2U6d2lkdGhcIiwgPT5cblx0XHRcdEBfZnJvbnQud2lkdGggPSBAd2lkdGhcblx0XHRcdEBfYmFjay53aWR0aCA9IEB3aWR0aFxuXHRcdEBvbiBcImNoYW5nZTpoZWlnaHRcIiwgPT5cblx0XHRcdEBfZnJvbnQuaGVpZ2h0ID0gQGhlaWdodFxuXHRcdFx0QF9iYWNrLmhlaWdodCA9IEBoZWlnaHRcblx0XG5cdHN0YXRlOiAtPiByZXR1cm4gQF9zdGF0ZVxuXG5cdEBkZWZpbmUgXCJmcm9udFwiLFxuXHRcdGdldDogLT4gQF9mcm9udFxuXHRcdHNldDogKGxheWVyKSAtPlxuXHRcdFx0QF9mcm9udD8uZGVzdHJveSgpXG5cdFx0XHRAX2Zyb250ID0gbGF5ZXJcblx0XHRcdEBfZnJvbnQucG9pbnQgPSB7eDowLCB5OjB9XG5cdFx0XHRAX2Zyb250LndpZHRoID0gQHdpZHRoXG5cdFx0XHRAX2Zyb250LmhlaWdodCA9IEBoZWlnaHRcblx0XHRcdEBfZnJvbnQuc3VwZXJMYXllciA9IEBcblx0XHRcdEBfZnJvbnQuc3R5bGUud2Via2l0QmFja2ZhY2VWaXNpYmlsaXR5ID0gXCJoaWRkZW5cIlxuXG5cdEBkZWZpbmUgXCJiYWNrXCIsXG5cdFx0Z2V0OiAtPiBAX2JhY2tcblx0XHRzZXQ6IChsYXllcikgLT5cblx0XHRcdEBfYmFjaz8uZGVzdHJveSgpXG5cdFx0XHRAX2JhY2sgPSBsYXllclxuXHRcdFx0QF9iYWNrLnBvaW50ID0ge3g6MCwgeTowfVxuXHRcdFx0QF9iYWNrLndpZHRoID0gQHdpZHRoXG5cdFx0XHRAX2JhY2suaGVpZ2h0ID0gQGhlaWdodFxuXHRcdFx0QF9iYWNrLnN1cGVyTGF5ZXIgPSBAXG5cdFx0XHRAX2JhY2suc3R5bGUud2Via2l0QmFja2ZhY2VWaXNpYmlsaXR5ID0gXCJoaWRkZW5cIlxuIFx0XG5cdEBkZWZpbmUgXCJmbGlwRGlyZWN0aW9uXCIsXG5cdFx0Z2V0OiAtPiBAX2ZsaXBEaXJlY3Rpb25cblx0XHRzZXQ6IChkaXJlY3Rpb24pIC0+XG5cdFx0XHRAX2ZsaXBEaXJlY3Rpb24gPSBkaXJlY3Rpb25cblx0XHRcdEBfYmFjay5yb3RhdGlvblkgPSAwXG5cdFx0XHRAX2JhY2sucm90YXRpb25YID0gMFxuXHRcdFx0QF9mcm9udC5yb3RhdGlvblkgPSAwXG5cdFx0XHRAX2Zyb250LnJvdGF0aW9uWCA9IDBcblx0XHRcdGlmIEBfc3RhdGUgPT0gU3RhdGVzLkZyb250XG5cdFx0XHRcdGlmIGRpcmVjdGlvbiA9PSBGbGlwRGlyZWN0aW9uLlJpZ2h0XG5cdFx0XHRcdFx0QF9iYWNrLnJvdGF0aW9uWSA9IDE4MFxuXHRcdFx0XHRlbHNlIGlmIGRpcmVjdGlvbiA9PSBGbGlwRGlyZWN0aW9uLkxlZnRcblx0XHRcdFx0XHRAX2JhY2sucm90YXRpb25ZID0gLTE4MFxuXHRcdFx0XHRlbHNlIGlmIGRpcmVjdGlvbiA9PSBGbGlwRGlyZWN0aW9uLlRvcFxuXHRcdFx0XHRcdEBfYmFjay5yb3RhdGlvblggPSAxODBcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdEBfYmFjay5yb3RhdGlvblggPSAtMTgwXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIGRpcmVjdGlvbiA9PSBGbGlwRGlyZWN0aW9uLlJpZ2h0XG5cdFx0XHRcdFx0QF9mcm9udC5yb3RhdGlvblkgPSAtMTgwXG5cdFx0XHRcdGVsc2UgaWYgZGlyZWN0aW9uID09IEZsaXBEaXJlY3Rpb24uTGVmdFxuXHRcdFx0XHRcdEBfZnJvbnQucm90YXRpb25ZID0gMTgwXG5cdFx0XHRcdGVsc2UgaWYgZGlyZWN0aW9uID09IEZsaXBEaXJlY3Rpb24uVG9wXG5cdFx0XHRcdFx0QF9mcm9udC5yb3RhdGlvblggPSAtMTgwXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRAX2Zyb250LnJvdGF0aW9uWCA9IDE4MFxuXG5cblx0ZmxpcDogLT5cblx0XHRpZiBAX3N0YXRlID09IFN0YXRlcy5Gcm9udFxuXHRcdFx0QGZsaXBUb0JhY2soKVxuXHRcdGVsc2Vcblx0XHRcdEBmbGlwVG9Gcm9udCgpXG5cdFx0XG5cdGZsaXBUb0Zyb250OiAtPlxuXHRcdGlmIEBfc3RhdGUgPT0gU3RhdGVzLkJhY2tcblx0XHRcdEBfc3RhdGUgPSBTdGF0ZXMuRnJvbnRcblx0XHRcdHByb3BzID0ge31cblx0XHRcdGlmIEBmbGlwRGlyZWN0aW9uID09IEZsaXBEaXJlY3Rpb24uUmlnaHRcblx0XHRcdFx0cHJvcHMucm90YXRpb25ZID0gMTgwXG5cdFx0XHRlbHNlIGlmIEBmbGlwRGlyZWN0aW9uID09IEZsaXBEaXJlY3Rpb24uTGVmdFxuXHRcdFx0XHRwcm9wcy5yb3RhdGlvblkgPSAtMTgwXG5cdFx0XHRlbHNlIGlmIEBmbGlwRGlyZWN0aW9uID09IEZsaXBEaXJlY3Rpb24uVG9wXG5cdFx0XHRcdHByb3BzLnJvdGF0aW9uWCA9IDE4MFxuXHRcdFx0ZWxzZSBpZiBAZmxpcERpcmVjdGlvbiA9PSBGbGlwRGlyZWN0aW9uLkJvdHRvbVxuXHRcdFx0XHRwcm9wcy5yb3RhdGlvblggPSAtMTgwXG5cdFx0XHRAX2Zyb250LmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRyb3RhdGlvblk6IDBcblx0XHRcdFx0XHRyb3RhdGlvblg6IDBcblx0XHRcdFx0Y3VydmU6IEBjdXJ2ZVxuXHRcdFx0QF9iYWNrLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRwcm9wc1xuXHRcdFx0XHRjdXJ2ZTogQGN1cnZlXG5cdFxuXHRmbGlwVG9CYWNrOiAtPlxuXHRcdGlmIEBfc3RhdGUgPT0gU3RhdGVzLkZyb250XG5cdFx0XHRAX3N0YXRlID0gU3RhdGVzLkJhY2tcblx0XHRcdHByb3BzID0ge31cblx0XHRcdGlmIEBmbGlwRGlyZWN0aW9uID09IEZsaXBEaXJlY3Rpb24uUmlnaHRcblx0XHRcdFx0cHJvcHMucm90YXRpb25ZID0gLTE4MFxuXHRcdFx0ZWxzZSBpZiBAZmxpcERpcmVjdGlvbiA9PSBGbGlwRGlyZWN0aW9uLkxlZnRcblx0XHRcdFx0cHJvcHMucm90YXRpb25ZID0gMTgwXG5cdFx0XHRlbHNlIGlmIEBmbGlwRGlyZWN0aW9uID09IEZsaXBEaXJlY3Rpb24uVG9wXG5cdFx0XHRcdHByb3BzLnJvdGF0aW9uWCA9IC0xODBcblx0XHRcdGVsc2UgaWYgQGZsaXBEaXJlY3Rpb24gPT0gRmxpcERpcmVjdGlvbi5Cb3R0b21cblx0XHRcdFx0cHJvcHMucm90YXRpb25YID0gMTgwXG5cdFx0XHRAX2Zyb250LmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRwcm9wc1xuXHRcdFx0XHRjdXJ2ZTogQGN1cnZlXG5cdFx0XHRAX2JhY2suYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHJvdGF0aW9uWTogMFxuXHRcdFx0XHRcdHJvdGF0aW9uWDogMFxuXHRcdFx0XHRjdXJ2ZTogQGN1cnZlIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjkuM1xuXCJGbGlwQ29tcG9uZW50XFxuXFxuZnJvbnRMYXllciA8bGF5ZXI+XFxuYmFja0xheWVyIDxsYXllcj5cXG5cXG5mbGlwKClcXG5mbGlwVG9Gcm9udCgpXFxuZmxpcFRvQmFjaygpXCI7XG52YXIgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbmV4cG9ydHMuRmxpcENvbXBvbmVudCA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIHZhciBGbGlwRGlyZWN0aW9uLCBTdGF0ZXM7XG5cbiAgZXh0ZW5kKEZsaXBDb21wb25lbnQsIHN1cGVyQ2xhc3MpO1xuXG4gIFN0YXRlcyA9IHtcbiAgICBGcm9udDogXCJmcm9udFN0YXRlXCIsXG4gICAgQmFjazogXCJiYWNrU3RhdGVcIlxuICB9O1xuXG4gIEZsaXBEaXJlY3Rpb24gPSB7XG4gICAgUmlnaHQ6IFwicmlnaHRcIixcbiAgICBMZWZ0OiBcImxlZnRcIixcbiAgICBUb3A6IFwidG9wXCIsXG4gICAgQm90dG9tOiBcImJvdHRvbVwiXG4gIH07XG5cbiAgZnVuY3Rpb24gRmxpcENvbXBvbmVudChvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBGbGlwQ29tcG9uZW50Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKG9wdGlvbnMsIHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwLFxuICAgICAgd2lkdGg6IDEwMCxcbiAgICAgIGhlaWdodDogMTAwLFxuICAgICAgZmxpcERpcmVjdGlvbjogRmxpcERpcmVjdGlvbi5SaWdodCxcbiAgICAgIGN1cnZlOiBcInNwcmluZygzMDAsIDUwLCAwKVwiLFxuICAgICAgYXV0b0ZsaXA6IHRydWUsXG4gICAgICBwZXJzcGVjdGl2ZTogMTAwMFxuICAgIH0pO1xuICAgIHRoaXMud2lkdGggPSBvcHRpb25zLndpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XG4gICAgaWYgKG9wdGlvbnMuZnJvbnQgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucy5mcm9udCA9IG5ldyBMYXllcih7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ3aGl0ZVwiXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYmFjayA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zLmJhY2sgPSBuZXcgTGF5ZXIoe1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwid2hpdGVcIlxuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuZnJvbnQgPSBvcHRpb25zLmZyb250O1xuICAgIHRoaXMuYmFjayA9IG9wdGlvbnMuYmFjaztcbiAgICB0aGlzLnBlcnNwZWN0aXZlID0gb3B0aW9ucy5wZXJzcGVjdGl2ZTtcbiAgICB0aGlzLnN0eWxlW1wiLXdlYmtpdC10cmFuc2Zvcm0tc3R5bGVcIl0gPSBcInByZXNlcnZlLTNkXCI7XG4gICAgdGhpcy5fc3RhdGUgPSBTdGF0ZXMuRnJvbnQ7XG4gICAgdGhpcy5mbGlwRGlyZWN0aW9uID0gb3B0aW9ucy5mbGlwRGlyZWN0aW9uO1xuICAgIHRoaXMuYXV0b0ZsaXAgPSBvcHRpb25zLmF1dG9GbGlwO1xuICAgIHRoaXMuY3VydmUgPSBvcHRpb25zLmN1cnZlO1xuICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gbnVsbDtcbiAgICB0aGlzLmNsaXAgPSBmYWxzZTtcbiAgICB0aGlzLm9uKEV2ZW50cy5DbGljaywgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5hdXRvRmxpcCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mbGlwKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5vbihcImNoYW5nZTp3aWR0aFwiLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMuX2Zyb250LndpZHRoID0gX3RoaXMud2lkdGg7XG4gICAgICAgIHJldHVybiBfdGhpcy5fYmFjay53aWR0aCA9IF90aGlzLndpZHRoO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgdGhpcy5vbihcImNoYW5nZTpoZWlnaHRcIiwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIF90aGlzLl9mcm9udC5oZWlnaHQgPSBfdGhpcy5oZWlnaHQ7XG4gICAgICAgIHJldHVybiBfdGhpcy5fYmFjay5oZWlnaHQgPSBfdGhpcy5oZWlnaHQ7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxuXG4gIEZsaXBDb21wb25lbnQucHJvdG90eXBlLnN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9O1xuXG4gIEZsaXBDb21wb25lbnQuZGVmaW5lKFwiZnJvbnRcIiwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZnJvbnQ7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKGxheWVyKSB7XG4gICAgICB2YXIgcmVmO1xuICAgICAgaWYgKChyZWYgPSB0aGlzLl9mcm9udCkgIT0gbnVsbCkge1xuICAgICAgICByZWYuZGVzdHJveSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5fZnJvbnQgPSBsYXllcjtcbiAgICAgIHRoaXMuX2Zyb250LnBvaW50ID0ge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwXG4gICAgICB9O1xuICAgICAgdGhpcy5fZnJvbnQud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgdGhpcy5fZnJvbnQuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICB0aGlzLl9mcm9udC5zdXBlckxheWVyID0gdGhpcztcbiAgICAgIHJldHVybiB0aGlzLl9mcm9udC5zdHlsZS53ZWJraXRCYWNrZmFjZVZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIH1cbiAgfSk7XG5cbiAgRmxpcENvbXBvbmVudC5kZWZpbmUoXCJiYWNrXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2JhY2s7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKGxheWVyKSB7XG4gICAgICB2YXIgcmVmO1xuICAgICAgaWYgKChyZWYgPSB0aGlzLl9iYWNrKSAhPSBudWxsKSB7XG4gICAgICAgIHJlZi5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9iYWNrID0gbGF5ZXI7XG4gICAgICB0aGlzLl9iYWNrLnBvaW50ID0ge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwXG4gICAgICB9O1xuICAgICAgdGhpcy5fYmFjay53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICB0aGlzLl9iYWNrLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgdGhpcy5fYmFjay5zdXBlckxheWVyID0gdGhpcztcbiAgICAgIHJldHVybiB0aGlzLl9iYWNrLnN0eWxlLndlYmtpdEJhY2tmYWNlVmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgfVxuICB9KTtcblxuICBGbGlwQ29tcG9uZW50LmRlZmluZShcImZsaXBEaXJlY3Rpb25cIiwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZmxpcERpcmVjdGlvbjtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG4gICAgICB0aGlzLl9mbGlwRGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgdGhpcy5fYmFjay5yb3RhdGlvblkgPSAwO1xuICAgICAgdGhpcy5fYmFjay5yb3RhdGlvblggPSAwO1xuICAgICAgdGhpcy5fZnJvbnQucm90YXRpb25ZID0gMDtcbiAgICAgIHRoaXMuX2Zyb250LnJvdGF0aW9uWCA9IDA7XG4gICAgICBpZiAodGhpcy5fc3RhdGUgPT09IFN0YXRlcy5Gcm9udCkge1xuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBGbGlwRGlyZWN0aW9uLlJpZ2h0KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2sucm90YXRpb25ZID0gMTgwO1xuICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gRmxpcERpcmVjdGlvbi5MZWZ0KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2sucm90YXRpb25ZID0gLTE4MDtcbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IEZsaXBEaXJlY3Rpb24uVG9wKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2sucm90YXRpb25YID0gMTgwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9iYWNrLnJvdGF0aW9uWCA9IC0xODA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09IEZsaXBEaXJlY3Rpb24uUmlnaHQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fZnJvbnQucm90YXRpb25ZID0gLTE4MDtcbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IEZsaXBEaXJlY3Rpb24uTGVmdCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9mcm9udC5yb3RhdGlvblkgPSAxODA7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSBGbGlwRGlyZWN0aW9uLlRvcCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9mcm9udC5yb3RhdGlvblggPSAtMTgwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9mcm9udC5yb3RhdGlvblggPSAxODA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIEZsaXBDb21wb25lbnQucHJvdG90eXBlLmZsaXAgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fc3RhdGUgPT09IFN0YXRlcy5Gcm9udCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmxpcFRvQmFjaygpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5mbGlwVG9Gcm9udCgpO1xuICAgIH1cbiAgfTtcblxuICBGbGlwQ29tcG9uZW50LnByb3RvdHlwZS5mbGlwVG9Gcm9udCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwcm9wcztcbiAgICBpZiAodGhpcy5fc3RhdGUgPT09IFN0YXRlcy5CYWNrKSB7XG4gICAgICB0aGlzLl9zdGF0ZSA9IFN0YXRlcy5Gcm9udDtcbiAgICAgIHByb3BzID0ge307XG4gICAgICBpZiAodGhpcy5mbGlwRGlyZWN0aW9uID09PSBGbGlwRGlyZWN0aW9uLlJpZ2h0KSB7XG4gICAgICAgIHByb3BzLnJvdGF0aW9uWSA9IDE4MDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mbGlwRGlyZWN0aW9uID09PSBGbGlwRGlyZWN0aW9uLkxlZnQpIHtcbiAgICAgICAgcHJvcHMucm90YXRpb25ZID0gLTE4MDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mbGlwRGlyZWN0aW9uID09PSBGbGlwRGlyZWN0aW9uLlRvcCkge1xuICAgICAgICBwcm9wcy5yb3RhdGlvblggPSAxODA7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZmxpcERpcmVjdGlvbiA9PT0gRmxpcERpcmVjdGlvbi5Cb3R0b20pIHtcbiAgICAgICAgcHJvcHMucm90YXRpb25YID0gLTE4MDtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2Zyb250LmFuaW1hdGUoe1xuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgcm90YXRpb25ZOiAwLFxuICAgICAgICAgIHJvdGF0aW9uWDogMFxuICAgICAgICB9LFxuICAgICAgICBjdXJ2ZTogdGhpcy5jdXJ2ZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5fYmFjay5hbmltYXRlKHtcbiAgICAgICAgcHJvcGVydGllczogcHJvcHMsXG4gICAgICAgIGN1cnZlOiB0aGlzLmN1cnZlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgRmxpcENvbXBvbmVudC5wcm90b3R5cGUuZmxpcFRvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwcm9wcztcbiAgICBpZiAodGhpcy5fc3RhdGUgPT09IFN0YXRlcy5Gcm9udCkge1xuICAgICAgdGhpcy5fc3RhdGUgPSBTdGF0ZXMuQmFjaztcbiAgICAgIHByb3BzID0ge307XG4gICAgICBpZiAodGhpcy5mbGlwRGlyZWN0aW9uID09PSBGbGlwRGlyZWN0aW9uLlJpZ2h0KSB7XG4gICAgICAgIHByb3BzLnJvdGF0aW9uWSA9IC0xODA7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZmxpcERpcmVjdGlvbiA9PT0gRmxpcERpcmVjdGlvbi5MZWZ0KSB7XG4gICAgICAgIHByb3BzLnJvdGF0aW9uWSA9IDE4MDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mbGlwRGlyZWN0aW9uID09PSBGbGlwRGlyZWN0aW9uLlRvcCkge1xuICAgICAgICBwcm9wcy5yb3RhdGlvblggPSAtMTgwO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmZsaXBEaXJlY3Rpb24gPT09IEZsaXBEaXJlY3Rpb24uQm90dG9tKSB7XG4gICAgICAgIHByb3BzLnJvdGF0aW9uWCA9IDE4MDtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2Zyb250LmFuaW1hdGUoe1xuICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wcyxcbiAgICAgICAgY3VydmU6IHRoaXMuY3VydmVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuX2JhY2suYW5pbWF0ZSh7XG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICByb3RhdGlvblk6IDAsXG4gICAgICAgICAgcm90YXRpb25YOiAwXG4gICAgICAgIH0sXG4gICAgICAgIGN1cnZlOiB0aGlzLmN1cnZlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIEZsaXBDb21wb25lbnQ7XG5cbn0pKExheWVyKTtcbiJdfQ==
