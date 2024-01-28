//=============================================================================
// PL_NT_MenuEx.js ver.1.02
//=============================================================================

/*
 * 参考
 * --------------------------------------------------
 * MNKR_AltMenuScreen3.js
 *   Ver.0.1.1
 * Copyright (c) 2020 Munokura
 * This software is released under the MIT license.
 * http://opensource.org/licenses/mit-license.php
 * --------------------------------------------------
 */

/*:ja
 * @plugindesc ノーティアーズ独自システム。PL_Lib.jsを先に読み込んでいること前提。
 * @author R
 *
 * @help このプラグインは基本ハードコーディングです。
 *
 * @param displayWindow
 * @text ウィンドウ枠表示
 * @desc ウィンドウ枠を表示。デフォルト:false
 * @type boolean
 * @on 表示
 * @off 非表示
 * @default false
 *
 * @param isDisplayStatusImage
 * @text ステータスのアイコンを表示
 * @desc ステータスのアイコンを表示するかしないかを選びます。
 * @type boolean
 * @on 表示
 * @off 非表示
 * @default false
 *
 * @param isDisplayGoldUnit
 * @text ゴールドの単位を表示
 * @desc ゴールドの単位を表示するかしないかを選びます。
 * @type boolean
 * @on 表示
 * @off 非表示
 * @default false
 *
 * @param menuCommandWindow_OffsetX
 * @type number
 * @desc メニュー画面のコマンドウィンドウのオフセットX
 * @default 64
 *
 * @param menuCommandWindow_OffsetY
 * @type number
 * @desc メニュー画面のコマンドウィンドウのオフセットY
 * @default 128
 *
 * @param bgBitmapMenu
 * @text メニュー背景
 * @desc メニュー背景にする画像ファイルです。
 * img/pictures に置いてください。
 * @default pl_menu
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param bgBitmapItem
 * @text アイテム画面背景
 * @desc アイテム画面背景にする画像ファイルです。
 * img/pictures に置いてください。
 * @default pl_menu_base
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param bgBitmapSkill
 * @text スキル画面背景
 * @desc スキル画面背景にする画像ファイルです。
 * img/pictures に置いてください。
 * @default pl_menu_base
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param bgBitmapEquip
 * @text 装備画面背景
 * @desc 装備画面背景にする画像ファイルです。
 * img/pictures に置いてください。
 * @default pl_menu_base
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param bgBitmapStatus
 * @text ステータス画面背景
 * @desc ステータス画面背景にする画像ファイルです。
 * img/pictures に置いてください。
 * @default pl_menu_base
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param bgBitmapOptions
 * @text オプション画面背景
 * @desc オプション画面背景にする画像ファイルです。
 * img/pictures に置いてください。
 * @default pl_menu_base
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param bgBitmapFile
 * @text セーブ／ロード画面背景
 * @desc セーブ／ロード画面背景にする画像ファイルです。
 * img/pictures に置いてください。
 * @default pl_menu_base
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param bgBitmapGameEnd
 * @text ゲーム終了画面背景
 * @desc ゲーム終了画面背景にする画像ファイルです。
 * img/pictures に置いてください。
 * @default pl_menu_base
 * @dir img/pictures/
 * @type file
 */

// ----------------------------------------------------------------

// GCP_OrderLayerクラス
// オーダーウィンドウのアイテム

(function () {
  "use strict";

  // set parameters
  var pluginName = document.currentScript.src
    .split("/")
    .pop()
    .replace(/\.js$/, "");
  var parameters = PluginManager.parameters(pluginName);
  var displayWindow = String(parameters["displayWindow"]) === "true";
  var isDisplayStatusImage = String(parameters["isDisplayStatus"]) === "true";
  var isDisplayGoldUnit = String(parameters["isDisplayGoldUnit"]) === "true";
  var menuCommandWindow_OffsetX = Number(
    parameters["menuCommandWindow_OffsetX"] || 64
  );
  var menuCommandWindow_OffsetY = Number(
    parameters["menuCommandWindow_OffsetY"] || 128
  );
  var bgBitmapMenu = parameters["bgBitmapMenu"] || "";
  var bgBitmapItem = parameters["bgBitmapItem"] || "";
  var bgBitmapSkill = parameters["bgBitmapSkill"] || "";
  var bgBitmapEquip = parameters["bgBitmapEquip"] || "";
  var bgBitmapStatus = parameters["bgBitmapStatus"] || "";
  var bgBitmapOptions = parameters["bgBitmapOptions"] || "";
  var bgBitmapFile = parameters["bgBitmapFile"] || "";
  var bgBitmapGameEnd = parameters["bgBitmapGameEnd"] || "";

  // コマンドウィンドウの作成など
  var _Scene_Menu_create = Scene_Menu.prototype.create;
  Scene_Menu.prototype.create = function () {
    _Scene_Menu_create.call(this);

    this._commandWindow.x += menuCommandWindow_OffsetX;
    this._commandWindow.y += menuCommandWindow_OffsetY;
    //this._commandWindow.width += menuCommandWindow_OffsetX;
    this._commandWindow.height += menuCommandWindow_OffsetY;

    this._statusWindow.x = 900;
    this._statusWindow.width = Graphics.boxWidth - this._statusWindow.x;
    this._statusWindow.y = this._commandWindow.y;
    this._statusWindow.height = Graphics.boxHeight - 320;

    /*
		// 左下
				this._statusWindow.x = this._commandWindow.x - 32 - 4;
				this._statusWindow.width = this._commandWindow.width;
				this._statusWindow.y = this._commandWindow.height - 16;
				this._statusWindow.height = this._commandWindow.height + 320;
				*/
    /*
		this._statusWindow.x = 900;
		this._statusWindow.width = Graphics.boxWidth - this._statusWindow.x;
		this._statusWindow.y = menuCommandWindow_OffsetY;
		this._statusWindow.height = Graphics.boxHeight - this._statusWindow.y;
		*/

    this._goldWindow.x = 1024 + 32 + 16;
    this._goldWindow.y = 640 - 16 + 8 + 4;

    // make transparent for all windows at menu scene.
    if (!displayWindow) {
      this._statusWindow.opacity = 0;
      this._goldWindow.opacity = 0;
      this._commandWindow.opacity = 0;
    }
    // this.createMapNameWindow();
  };

  // 背景処理
  var _Scene_Menu_createBackground = Scene_Menu.prototype.createBackground;
  Scene_Menu.prototype.createBackground = function () {
    if (bgBitmapMenu) {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = ImageManager.loadPicture(bgBitmapMenu);
      this.addChild(this._backgroundSprite);
      return;
    }
    // if background file is invalid, it does original process.
    _Scene_Menu_createBackground.call(this);
  };

  var _Scene_Item_createBackground = Scene_Item.prototype.createBackground;
  Scene_Item.prototype.createBackground = function () {
    if (bgBitmapItem) {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = ImageManager.loadPicture(bgBitmapItem);
      this.addChild(this._backgroundSprite);
      return;
    }
    // if background file is invalid, it does original process.
    _Scene_Item_createBackground.call(this);
  };

  var _Scene_Skill_createBackground = Scene_Skill.prototype.createBackground;
  Scene_Skill.prototype.createBackground = function () {
    if (bgBitmapSkill) {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = ImageManager.loadPicture(bgBitmapSkill);
      this.addChild(this._backgroundSprite);
      return;
    }
    // if background file is invalid, it does original process.
    _Scene_Skill_createBackground.call(this);
  };

  var _Scene_Equip_createBackground = Scene_Equip.prototype.createBackground;
  Scene_Equip.prototype.createBackground = function () {
    if (bgBitmapEquip) {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = ImageManager.loadPicture(bgBitmapEquip);
      this.addChild(this._backgroundSprite);
      return;
    }
    // if background file is invalid, it does original process.
    _Scene_Equip_createBackground.call(this);
  };

  var _Scene_Status_createBackground = Scene_Status.prototype.createBackground;
  Scene_Status.prototype.createBackground = function () {
    if (bgBitmapStatus) {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = ImageManager.loadPicture(bgBitmapStatus);
      this.addChild(this._backgroundSprite);
      return;
    }
    // if background file is invalid, it does original process.
    _Scene_Status_createBackground.call(this);
  };

  var _Scene_Options_createBackground =
    Scene_Options.prototype.createBackground;
  Scene_Options.prototype.createBackground = function () {
    if (bgBitmapOptions) {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = ImageManager.loadPicture(bgBitmapOptions);
      this.addChild(this._backgroundSprite);
      return;
    }
    // if background file is invalid, it does original process.
    _Scene_Options_createBackground.call(this);
  };

  var _Scene_File_createBackground = Scene_File.prototype.createBackground;
  Scene_File.prototype.createBackground = function () {
    if (bgBitmapFile) {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = ImageManager.loadPicture(bgBitmapFile);
      this.addChild(this._backgroundSprite);
      return;
    }
    // if background file is invalid, it does original process.
    _Scene_File_createBackground.call(this);
  };

  var _Scene_GameEnd_createBackground =
    Scene_GameEnd.prototype.createBackground;
  Scene_GameEnd.prototype.createBackground = function () {
    if (bgBitmapGameEnd) {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = ImageManager.loadPicture(bgBitmapGameEnd);
      this.addChild(this._backgroundSprite);
      return;
    }
    // if background file is invalid, it does original process.
    _Scene_GameEnd_createBackground.call(this);
  };

  // 顔アイコンの表示など
  var _Window_MenuStatus_drawItemImage =
    Window_MenuStatus.prototype.drawItemImage;
  Window_MenuStatus.prototype.drawItemImage = function (index) {
    if (!isDisplayStatusImage) return;
    /*
		var actor = $gameParty.members()[index];
		var rect = this.itemRectForText(index);
		// load stand_picture
		var bitmapName = $dataActors[actor.actorId()].meta.stand_picture;
		var bitmap = bitmapName ? ImageManager.loadPicture(bitmapName) : null;
		var offX = $dataActors[actor.actorId()].meta.stand_offset_x ? Number($dataActors[actor.actorId()].meta.stand_offset_x) : 0;
		var offY = $dataActors[actor.actorId()].meta.stand_offset_y ? Number($dataActors[actor.actorId()].meta.stand_offset_y) : 0;
		var w = Math.min(rect.width, (bitmapName ? bitmap.width : 144));
		var h = Math.min(rect.height, (bitmapName ? bitmap.height : 144));
		var lineHeight = this.lineHeight();
		this.changePaintOpacity(actor.isBattleMember());
		if (bitmap) {
			var sx = (bitmap.width > w) ? (bitmap.width - w) / 2 : 0;
			var sy = (bitmap.height > h) ? (bitmap.height - h) / 2 : 0;
			var dx = (bitmap.width > rect.width) ? rect.x :
				rect.x + (rect.width - bitmap.width) / 2;
			var dy = (bitmap.height > rect.height) ? rect.y :
				rect.y + (rect.height - bitmap.height) / 2;
			this.contents.bltStand(bitmap, sx - offX, sy - offY, w, h, dx, dy);
		} else { // when bitmap is not set, do the original process.
			this.drawActorFace(actor, rect.x, rect.y + lineHeight * 2.5, w, h);
		}
		this.changePaintOpacity(true);
		*/
  };

  // ステータス情報
  Window_MenuStatus.prototype.drawItemStatus = function (index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRectForText(index);
    var x = 0;
    var y = 0;
    var width = rect.width;
    var bottom = y + rect.height;
    var lineHeight = this.lineHeight();
    this.drawActorName(actor, x, y, width);

    this.drawActorLevelWidth(actor, x + 256 + 12, y, 64);
    //this.drawActorClass(actor, x, bottom - lineHeight * 4, width);

    this.drawActorHp(actor, x, y + 32, width);
    this.drawActorMp(actor, x, y + 32 + 16, width);

    this.drawActorIcons(actor, x, y + 64 + 32, width);

    /*
		var actor = $gameParty.members()[index];
		var rect = this.itemRectForText(index);
		var x = rect.x;
		var y = rect.y;
		var width = rect.width;
		var bottom = y + rect.height;
		var lineHeight = this.lineHeight();
		this.drawActorName(actor, x, y + lineHeight * 0, width);
		this.drawActorLevelWidth(actor, x, y + lineHeight * 1, width);
		this.drawActorClass(actor, x, bottom - lineHeight * 4, width);
		this.drawActorHp(actor, x, bottom - lineHeight * 3, width);
		this.drawActorMp(actor, x, bottom - lineHeight * 2, width);
		this.drawActorIcons(actor, x, bottom - lineHeight * 1, width);
		*/
  };

  //var _Window_Base_drawCurrencyValue = Window_Base.prototype.drawCurrencyValue;
  Window_Base.prototype.drawCurrencyValue = function (
    value,
    unit,
    x,
    y,
    width
  ) {
    var unitWidth = Math.min(80, this.textWidth(unit));
    this.resetTextColor();
    this.drawText(value, x, y, width - unitWidth - 6, "right");
    if (
      isDisplayGoldUnit ||
      SceneManager._scene instanceof Scene_Shop ||
      SceneManager._scene instanceof Scene_Battle
    ) {
      // ショップ中は単位を表示する
      this.changeTextColor(this.systemColor());
      this.drawText(unit, x + width - unitWidth, y, unitWidth, "right");
    }
  };

  /*
	Window_Base.prototype.drawCurrencyValue = function(value, unit, wx, wy, ww) {
		this.resetTextColor();
		this.contents.fontSize = Yanfly.Param.GoldFontSize;
		if (this.usingGoldIcon(unit)) {
			var cx = Window_Base._iconWidth;
		} else {
			var cx = this.textWidth(unit);
		}
		var text = Yanfly.Util.toGroup(value);
		if (this.textWidth(text) > ww - cx) {
			text = Yanfly.Param.GoldOverlap;
		}
		this.drawText(text, wx, wy, ww - cx - 4, 'right');
		if (this.usingGoldIcon(unit)) {
			this.drawIcon(Yanfly.Icon.Gold, wx + ww - Window_Base._iconWidth, wy + 2);
		} else {
			this.changeTextColor(this.systemColor());
			this.drawText(unit, wx, wy, ww, 'right');
		}
		this.resetFontSettings();
	};
	
	Window_Base.prototype.usingGoldIcon = function(unit) {
		if (unit !== TextManager.currencyUnit) return false;
		return Yanfly.Icon.Gold > 0;
	};
	*/

  Window_Base.prototype.pl_drawGauge = function (
    x,
    y,
    width,
    rate,
    color1,
    color2
  ) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + 8;
    this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
  };

  // Lv
  Window_MenuStatus.prototype.drawActorLevelWidth = function (
    actor,
    x,
    y,
    width
  ) {
    width = Math.min(width, 128);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.levelA, x, y, 48);
    this.resetTextColor();
    this.drawText(actor.level, x, y, width, "right");
  };

  // HPゲージ処理
  var Window_Base_drawActorHp = Window_Base.prototype.drawActorHp;
  Window_Base.prototype.drawActorHp = function (actor, x, y, width) {
    width = width || 186;
    var color1 = "#095064";
    var color2 = "#fff";
    this.pl_drawGauge(
      x + 32,
      y + 8 + 4,
      width - 64 - 32,
      actor.hpRate(),
      color1,
      color2
    );
    //this.changeTextColor(this.systemColor());
    //this.drawText(TextManager.hpA, x, y, 44);

    this.contents.fontSize = 16;
    this.drawCurrentAndMax(
      actor.hp,
      actor.mhp,
      x,
      y + 4,
      width,
      this.hpColor(actor),
      this.normalColor()
    );
    this.resetFontSettings();
  };

  // MPゲージ処理
  var Window_Base_drawActorMp = Window_Base.prototype.drawActorMp;
  Window_Base.prototype.drawActorMp = function (actor, x, y, width) {
    width = width || 186;
    var color1 = "#095064";
    var color2 = "#fff";
    this.pl_drawGauge(
      x + 32,
      y + 8 + 4 + 1,
      width - 64 - 32,
      actor.mpRate(),
      color1,
      color2
    );
    //this.changeTextColor(this.systemColor());
    //this.drawText(TextManager.mpA, x, y, 44);

    this.contents.fontSize = 16;
    this.drawCurrentAndMax(
      actor.mp,
      actor.mmp,
      x,
      y + 6,
      width,
      this.mpColor(actor),
      this.normalColor()
    );
    this.resetFontSettings();
  };
})();

var HStatusTextA = function () {
  var txt = "";

  txt += "\\fs[26]";

  txt += "First Partner: ";
  txt += $gameActors.actor(103).name();
  txt += "\n";
  txt += "Sex: ";
  txt += $gameVariables.value(345);
  txt += "x\n";

  txt += "\n";

  txt += "Semen in Pussy: ";
  txt += $gameVariables.value(347);
  txt += " ml\n";
  txt += "Ejaculate in Pussy: ";
  txt += $gameVariables.value(348);
  txt += " ml\n";

  txt += "\n";

  /*
	txt += "Number of Fertilizations: ";
	txt += $gameVariables.value(350);
	txt += " times\n";
	*/
  txt += "Pregnancies: ";
  txt += $gameVariables.value(351);
  txt += " times\n";
  txt += "Births: ";
  txt += $gameVariables.value(352);
  txt += " times\n";

  txt += "\n";

  txt += "Vaginal EXP: ";
  txt += $gameVariables.value(354);
  txt += "\n";
  txt += "Breast EXP: ";
  txt += $gameVariables.value(355);
  txt += "\n";
  txt += "Oral EXP: ";
  txt += $gameVariables.value(356);
  txt += "\n";
  txt += "Anal EXP: ";
  txt += $gameVariables.value(357);
  txt += "\n";

  txt += "\n";

  txt += "Condition: ";
  txt += $gameActors.actor(104).name();
  txt += "\n";
  if ($gameVariables.value(232) > 0) {
    txt += "Dependency: ";
    txt += $gameVariables.value(232);
    txt += "%\n";
  }

  return txt;
};

var HStatus2TextA = function () {
  var txt = "";

  txt += "Egg: ";
  txt += $gameActors.actor(105).name();

  txt += "\n";

  txt += "Father: ";
  txt += $gameActors.actor(106).name();
  txt += "\n";

  return txt;
};

var HStatus2TextB = function () {
  var txt = "";

  txt += "Sperm Cells in Pussy";

  txt += "\n";
  txt += "\n";

  if ($gameVariables.value(368) > 0) {
    txt += "Cores: ";
    txt += $gameVariables.value(368);
    txt += " 100 million\n";
  }

  if ($gameVariables.value(369) > 0) {
    txt += "Goblin: ";
    txt += $gameVariables.value(369);
    txt += " 100 million\n";
  }
  if ($gameVariables.value(370) > 0) {
    txt += "Slime: ";
    txt += $gameVariables.value(370);
    txt += " 100 million\n";
  }
  if ($gameVariables.value(371) > 0) {
    txt += "Tentacles: ";
    txt += $gameVariables.value(371);
    txt += " 100 million\n";
  }
  if ($gameVariables.value(372) > 0) {
    txt += "Wolf: ";
    txt += $gameVariables.value(372);
    txt += " 100 million\n";
  }
  if ($gameVariables.value(373) > 0) {
    txt += "Commoner: ";
    txt += $gameVariables.value(373);
    txt += " 100 million\n";
  }

  return txt;
};

//Window_Base.prototype.actorName(345);
//$gameActors.actor(n).name();

/*
初めての相手：\N[103]
エッチ回数：\V[345]
現在の膣内の精液：\V[347]
膣内出し総精液：\V[348]
受精回数：\V[350]
妊娠回数：\V[351]
出産回数：\V[352]
膣経験値：\V[354]
胸経験値：\V[355]
口経験値：\V[356]
アナル経験値：\V[357]

卵子の状態
\N[106]

父親
\N[108]

膣内精子数

人間：\V[368]
ゴブリン：\V[369]
オーク：\V[370]
触手：\V[371]
*/
