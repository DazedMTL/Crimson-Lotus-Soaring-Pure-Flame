//=============================================================================
// PL_Lib.js
//=============================================================================

/*:ja
 * @plugindesc 各種ライブラリ
 * @author R
 *
 * @help 衝突する事考えてないので、使用する際は各ゲームで対応が必要
 */

"use strict";

// ----------------------------------------------------------------

// PL_Lib
// 各種細々した便利関数

function PL_Lib() {
  throw new Error("This is a static class");
}

PL_Lib.prototype.accel = function (now, max, acc) {
  if (now >= max) return 1;
  else if (now <= 0) return 0;

  var return_param = now / max;

  if (acc < 0) {
    // 上弦 ( 最初が動きが早く、徐々に遅くなる )
    return_param = 1.0 - Math.pow(1.0 - return_param, -acc);
  } else if (acc > 0) {
    // 下弦 ( 最初は動きが遅く、徐々に早くなる )
    return_param = Math.pow(return_param, acc);
  }
  return return_param;
};

// ----------------------------------------------------------------

// PL_ImageManager
// プリロード系の処理はPL_Lib読み込みからScene_Boot.loadSystemImages開始までに追加すること

function PL_ImageManager() {
  throw new Error("This is a static class");
}

PL_ImageManager._preloadPictureList = [];

PL_ImageManager.preloadPicture = function (filenames) {
  if (typeof filenames === "object") {
    for (var i = 0; i < filenames.length; i++) {
      PL_ImageManager._preloadPictureList.push(filenames[i]);
    }
  } else {
    PL_ImageManager._preloadPictureList.push(filenames);
  }
};

(function () {
  "use strict";
  var _Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
  Scene_Boot.loadSystemImages = function () {
    _Scene_Boot_loadSystemImages.call(this);
    for (var i = 0; i < PL_ImageManager._preloadPictureList.length; i++) {
      ImageManager.loadPicture(PL_ImageManager._preloadPictureList[i]);
    }
  };
})();

/*
// 他のフォルダを自前でやる場合は下記参考
var _Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
    Scene_Boot.prototype.loadSystemImages = function() {
        _Scene_Boot_loadSystemImages.call(this);
        ImageManager.loadSystem();
    };
*/

// ----------------------------------------------------------------

// PL_Layer
// 拡張Sprite

function PL_Layer() {
  this.initialize.apply(this, arguments);
}

PL_Layer.prototype = Object.create(Sprite.prototype);
PL_Layer.prototype.constructor = PL_Layer;

PL_Layer.prototype.initialize = function (parent, x, y) {
  Sprite.prototype.initialize.call(this);
  parent.addChild(this);
  this.x = x || 0;
  this.y = y || 0;
  this.visible = false;
};
PL_Layer.prototype.setPos = function (x, y) {
  this.x = x;
  this.y = y;
};

// ----------------------------------------------------------------

// PL_NumericLayer
// いつものPL_NumericLayer移植版、拡張。

function PL_NumericLayer(parent, image) {
  this.initialize.apply(this, arguments);
}

PL_NumericLayer.prototype = Object.create(PL_Layer.prototype);
PL_NumericLayer.prototype.constructor = PL_NumericLayer;

PL_NumericLayer.prototype.initialize = function (parent, image, digit, bc) {
  PL_Layer.prototype.initialize.call(this, parent);
  this._viewNum = 0; //実際に表示される数値
  this._toNum = 0; //この数値になるまでnumを自動で変化させる
  this._parent = parent; //親スプライト
  this._image = image; //使用画像
  this._digit = digit || 1; //桁数
  this._bc = bc || 0; //文字間スペース
  this._numBitmap = ImageManager.loadPicture(this._image);
  this.bitmap = new Bitmap(1, 1);
};

// 瞬間数値変更
PL_NumericLayer.prototype.setNum = function (num) {
  this._viewNum = Math.floor(num);
  this._toNum = num;
  this.refresh();
};

// 徐々に数値変更
PL_NumericLayer.prototype.setToNum = function (num) {
  this._toNum = Math.floor(num);
  this.refresh();
};

// 画像の変更
PL_NumericLayer.prototype.setImage = function (image) {
  this._image = image;
  this._numBitmap = ImageManager.loadPicture(this._image);
  this.refresh();
};

// 描画情報を更新
PL_NumericLayer.prototype.refresh = function () {
  var w = this._numBitmap.width / 10;
  var tempNum = this._viewNum;
  //console.log("PL_NumericLayer" + w + ":"+tempNum);

  // レイヤーのサイズ計算
  var layer_w = w * this._digit + this._bc * (this._digit - 1);
  if (
    this.bitmap.width != layer_w ||
    this.bitmap.height != this._numBitmap.height
  ) {
    //変化ないのにリフレッシュする危険回避
    //this.width = layer_w;
    //this.height = this._numBitmap.height;

    //this.bitmap.width = layer_w;
    //this.bitmap.height = this._numBitmap.height;

    this.bitmap = new Bitmap(layer_w, this._numBitmap.height);
    //console.log("?" + layer_w);
  }

  // 桁数チェック
  var tempDigit = 1;
  {
    if (tempNum < 0) tempNum *= -1;
    for (var i = tempNum; 9 < i; i /= 10) tempDigit++;
  }

  // 最大桁数より桁が多い場合は全桁を9にする。
  if (this._digit < tempDigit) {
    tempDigit = this.digit;
    tempNum = 0;
    for (var i = tempDigit; i >= 1; i--) tempNum = tempNum * 10 + 9;
  }

  this.bitmap.clear();
  for (var i = this._digit - 1; i >= 0; i--) {
    if (tempNum > 0 || i == this._digit - 1) {
      this.bitmap.blt(
        this._numBitmap,
        w * (tempNum % 10),
        0,
        w,
        this._numBitmap.height,
        0 + (w + this._bc) * i,
        0
      );
      tempNum = Math.floor(tempNum / 10);
    }
  }
};

// 毎フレーム実行
PL_NumericLayer.prototype.update = function () {
  PL_Layer.prototype.update.call(this);
  if (this.visible && this.alpha > 0 && this._viewNum != this._toNum) {
    var diff = this._toNum - this._viewNum;
    console.log(diff + "+" + this._toNum + "+" + this._viewNum);
    if (Math.abs(diff) < 30) {
      if (diff > 0) {
        this._viewNum++;
      } else {
        this._viewNum--;
      }
    } else {
      this._viewNum += Math.floor(diff / 2);
    }
    this.refresh();
  }
};

// ----------------------------------------------------------------

// PL_GaugeLayer
// ゲージの表示レイヤー
// anime_speedを0以外にする場合は、画像がループしてて横幅の2倍である必要がある

function PL_GaugeLayer(parent, image) {
  this.initialize.apply(this, arguments);
}

PL_GaugeLayer.prototype = Object.create(PL_Layer.prototype);
PL_GaugeLayer.prototype.constructor = PL_GaugeLayer;

PL_GaugeLayer.prototype.initialize = function (
  parent,
  image,
  width,
  anime_speed
) {
  PL_Layer.prototype.initialize.call(this, parent);
  this._CHANGE_SPEED = 0.01; //徐々に変化する速度
  this._viewRate = 0; //実際に表示される数値
  this._toRate = 0; //この数値になるまでRateを自動で変化させる
  this._parent = parent; //親スプライト
  this._image = image; //使用画像
  this._maxWidth = width; //最大横幅
  this.width = width;
  this._gaugeBitmap = ImageManager.loadPicture(this._image);
  this.bitmap = new Bitmap(width, 1);
  this._anime_speed = anime_speed || 0; //ゲージの画像を演出させる速度
  this._anime_position = 0; //ゲージ背景の位置
};

// 瞬間数値変更
PL_GaugeLayer.prototype.setRate = function (rate) {
  this._viewRate = rate;
  this._toRate = rate;
  this.refresh();
};

// 徐々に数値変更
PL_GaugeLayer.prototype.setToRate = function (rate) {
  this._toRate = rate;
};

// 画像の変更
PL_GaugeLayer.prototype.setImage = function (image) {
  this._image = image;
  this._gaugeBitmap = ImageManager.loadPicture(this._image);
  this.refresh();
};

// 描画情報を更新
PL_GaugeLayer.prototype.refresh = function () {
  if (!this._gaugeBitmap.isReady) {
    return;
  }
  // レイヤーのサイズ計算
  if (this.bitmap.height != this._gaugeBitmap.height) {
    //this.height = this._gaugeBitmap.height;
    this.bitmap = new Bitmap(this.width, this._gaugeBitmap.height);
  }
  this.bitmap.clear();
  this.bitmap.blt(
    this._gaugeBitmap,
    this._anime_position,
    0,
    this._maxWidth * this._viewRate,
    this._gaugeBitmap.height,
    0,
    0
  );
};

// 毎フレーム実行
PL_GaugeLayer.prototype.update = function () {
  PL_Layer.prototype.update.call(this);
  if (this.visible && this.alpha > 0) {
    var refresh = false;
    if (this._viewRate != this._toRate) {
      var diff = this._toRate - this._viewRate;
      if (Math.abs(diff) < this._CHANGE_SPEED) {
        this._viewRate = this._toRate;
      } else {
        if (diff > 0) {
          this._viewRate += this._CHANGE_SPEED;
        } else {
          this._viewRate -= this._CHANGE_SPEED;
        }
      }
      refresh = true;
    }

    if (this._anime_speed != 0 && this._gaugeBitmap.isReady) {
      this._anime_position += this._anime_speed;
      if (this._anime_position < 0) {
        this._anime_position += this._gaugeBitmap.width / 2;
      } else if (this._anime_position > this._gaugeBitmap.width / 2) {
        this._anime_position -= this._gaugeBitmap.width / 2;
      }
      refresh = true;
    }

    if (refresh) {
      this.refresh();
    }
  }
};

// ----------------------------------------------------------------

// PL_EffectLayer
// PL_Layer演出向け拡張

function PL_EffectLayer(parent, image) {
  this.initialize.apply(this, arguments);
}

PL_EffectLayer.prototype = Object.create(PL_Layer.prototype);
PL_EffectLayer.prototype.constructor = PL_EffectLayer;

PL_EffectLayer.prototype.initialize = function (parent, x, y) {
  PL_Layer.prototype.initialize.call(this, parent, x, y);

  // 呼吸演出
  this._breathSpeed = 0;
  this._breathMaxRate = 0.008;
  this._breathScale = 0;
  this._breathOut = false;
  this.org_x = x;
  this.org_y = y;
};

// 呼吸演出のON/OFF
PL_EffectLayer.prototype.setEffectBreath = function (
  enable,
  breathSpeed,
  breathMaxRate
) {
  if (enable) {
    this._breathSpeed = breathSpeed || 0.0001;
    this._breathMaxRate = breathMaxRate || 0.01;
    this._breathScale = 0;
  } else {
    this._breathSpeed = 0;
    this._breathMaxRate = 0;
    this.scale.y = 0.5;
    this.scale.x = 0.5;
  }
};

PL_EffectLayer.prototype.update = function () {
  PL_Layer.prototype.update.call(this);

  // 呼吸演出
  if (this.visible && this.alpha > 0 && this.bitmap != null) {
    //console.log("?" + this._breathScale);
    if (this._breathSpeed != 0) {
      if (!this._breathOut) {
        this._breathScale += this._breathSpeed;
        if (this._breathScale >= this._breathMaxRate) {
          this._breathScale = this._breathMaxRate;
          this._breathOut = true;
        }
      } else {
        this._breathScale -= this._breathSpeed;
        if (this._breathScale <= 0) {
          this._breathScale = 0;
          this._breathOut = false;
        }
      }
      this.scale.y = 0.5 + this._breathScale;
      this.scale.x = 0.5 + this._breathScale / 2;
      this.x = this.org_x - this.width * (this._breathScale / 4);
      this.y = this.org_y - this.height * (this._breathScale / 2);
    }
  }
};

// ----------------------------------------------------------------
