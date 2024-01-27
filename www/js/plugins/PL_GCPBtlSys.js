//=============================================================================
// PL_GCPBtlSys.js ver.2.17
//=============================================================================

/*:ja
 * @plugindesc ノーティアーズ独自システム。PL_Lib.jsとellye's_atb.jsを先に読み込んでいること前提。
 * @author R
 *
 * @param debug
 * @type boolean
 * @default false
 * @desc デバッグモード
 *
 * @param INT_BTL_ACTION_ENEMY_ID
 * @type number
 * @default 321
 * @desc 行動しているモンスターID
 *
 * @param OV_VIEW_X
 * @type number
 * @default 300
 * @desc 立ち絵のX座標
 *
 * @param OV_VIEW_Y
 * @type number
 * @default 0
 * @desc 立ち絵のY座標
 *
 * @param EV_VIEW_X
 * @type number
 * @default 300
 * @desc イベントCGのX座標
 *
 * @param EV_VIEW_Y
 * @type number
 * @default 0
 * @desc イベントCGのY座標
 *
 * @param EV_SECTION_X
 * @type number
 * @default 0
 * @desc 断面図のX座標
 *
 * @param EV_SECTION_Y
 * @type number
 * @default 730
 * @desc 断面図のY座標
 *
 * @help このプラグインは基本ハードコーディングです。
 */

// ■マニュアル

// サイドビューモードにすること（味方へのダメージ表示を使うため）

// PTは必ず一人の状態で戦闘すること

// ヒールなどの味方選択技は全体にするほうが良い

// グーチョキパーによってアイコンを変えたいスキルはアイコンID15（右上）に設定すること

// モンスターには gcp_unknown_rate:0-100 で 不明率指定可能defaultでは50％

// ----------------------------------------------------------------

// GCP_OrderLayerクラス
// オーダーウィンドウのアイテム

function GCP_OrderLayer(parent, x, y) {
  this.initialize.apply(this, arguments);
}

GCP_OrderLayer.prototype = Object.create(PL_Layer.prototype);
GCP_OrderLayer.prototype.constructor = GCP_OrderLayer;

GCP_OrderLayer.prototype.initialize = function (parent, x, y) {
  PL_Layer.prototype.initialize.call(this, parent, x, y);

  this._SPEED = 0.1;

  this._viewBattler = null; //現在表示しているバトラー
  this._toBattler = null; //表示を切り替えるバトラー
  this._isOpenPhase = false; //開く処理を行っているか
  this._scale = 0;

  this.scale.x = this._scale;
  this.scale.y = this._scale;

  this.bitmap = new Bitmap(48, 48);
};

GCP_OrderLayer.prototype.setToBattler = function (battler) {
  this._toBattler = battler;
};

GCP_OrderLayer.prototype.refresh = function () {
  //console.log('refresh');
  this._needsRefresh = false; // refreshが必要な時にtrueにするためのフラグ

  if (this._viewBattler != null) {
    this.bitmap.clear();
    var temp_bmp;
    // 以下、アクター／エネミーの処理
    if (this._viewBattler.isActor()) {
      temp_bmp = ImageManager.loadPicture("gcp_orderIconBg_actor");
      if (!temp_bmp.isReady()) return;
      this.bitmap.blt(
        temp_bmp,
        0,
        0,
        temp_bmp.width,
        temp_bmp.height,
        0,
        0,
        this.bitmap.width,
        this.bitmap.height
      );
      temp_bmp = ImageManager.loadPicture("gcp_orderIcon_actor");
    } else if (this._viewBattler.isEnemy()) {
      {
        temp_bmp = ImageManager.loadPicture("gcp_orderIconBg_enemy");
        if (!temp_bmp.isReady()) return;
        this.bitmap.blt(
          temp_bmp,
          0,
          0,
          temp_bmp.width,
          temp_bmp.height,
          0,
          0,
          this.bitmap.width,
          this.bitmap.height
        );
        var name = this._viewBattler.battlerName();
        var hue = this._viewBattler.battlerHue();
        if ($gameSystem.isSideView()) {
          temp_bmp = ImageManager.loadSvEnemy(name, hue);
        } else {
          temp_bmp = ImageManager.loadEnemy(name, hue);
        }
      }
    }

    //console.log('!temp_bmp.isReady'+temp_bmp.isReady());
    // 画像がまだ準備ができていない場合
    if (!temp_bmp.isReady()) {
      this._needsRefresh = true; // refreshの再試行を指示
      return; // 処理を終了し、画像がロードされるのを待つ
    }

    // 画像がロードされた場合のblt処理
    var x = 0;
    var y = 0;
    var w = this.bitmap.width;
    var h = this.bitmap.height;
    if (temp_bmp.width > temp_bmp.height) {
      h = (this.bitmap.height * temp_bmp.height) / temp_bmp.width;
      y = (this.bitmap.height - h) / 2;
    } else {
      w = (this.bitmap.width * temp_bmp.width) / temp_bmp.height;
      x = (this.bitmap.width - w) / 2;
    }
    this.bitmap.blt(
      temp_bmp,
      0,
      0,
      temp_bmp.width,
      temp_bmp.height,
      0,
      0,
      this.bitmap.width,
      this.bitmap.height
    );
  }
};

GCP_OrderLayer.prototype.update = function () {
  PL_Layer.prototype.update.call(this);

  // 前回の refresh でロードが完了していなかった場合
  if (this._needsRefresh) {
    this.refresh();
  }

  if (this.visible && this.alpha > 0) {
    if (this._viewBattler == this._toBattler) {
      if (this._viewBattler != null && this._scale != 1) {
        this._scale += this._SPEED;
        if (this._scale > 1) this._scale = 1;
        this.scale.x = this._scale;
        this.scale.y = this._scale;
      }
    } else {
      this._scale -= this._SPEED;
      if (this._scale <= 0) {
        this._scale = 0;
        this._viewBattler = this._toBattler;
        this.refresh();
      }
      this.scale.x = this._scale;
      this.scale.y = this._scale;
    }
  }
};

// ----------------------------------------------------------------

// ステータス関連
(function () {
  "use strict";

  var parameters = PluginManager.parameters("PL_GCPBtlSys");
  var debug = parameters["debug"];

  var INT_BTL_ACTION_ENEMY_ID = parameters["INT_BTL_ACTION_ENEMY_ID"]; // 最後に行動している敵のID

  var preloadPictures = [
    "gcp_number",
    "gcp_orderIconBg_actor",
    "gcp_orderIcon_actor",
    "gcp_orderIconBg_enemy",
    "gcp_gauge_hp",
    "gcp_gauge_mp",
    "gcp_gauge_tp",
  ];

  var OV_VIEW_X = parameters["OV_VIEW_X"];
  var OV_VIEW_Y = parameters["OV_VIEW_Y"];

  var EV_VIEW_X = parameters["EV_VIEW_X"];
  var EV_VIEW_Y = parameters["EV_VIEW_Y"];

  var EV_SECTION_X = parameters["EV_SECTION_X"];
  var EV_SECTION_Y = parameters["EV_SECTION_Y"];

  // 瀕死時のアニメID
  var DYING_ANIME_ID = 151;
  var DYING_ANIME_WAIT = 0;

  // 通常OV
  var lay_ov;

  // 通常EV
  var lay_ev;

  // spineOV
  var lay_spine_ov;
  var spine_ov;
  var sprite_spine_ov;

  // spine断面図
  var lay_spine_section;
  var spine_section;
  var sprite_spine_section;

  var lay_grd;

  var lay_icons;

  var lay_hp_header;
  var lay_hp_num;
  var lay_hp_gauge_bg;
  var lay_hp_gauge;
  var lay_mp_header;
  var lay_mp_num;
  var lay_mp_gauge_bg;
  var lay_mp_gauge;
  var lay_tp_header;
  var lay_tp_num;
  var lay_tp_gauge_bg;
  var lay_tp_gauge;

  var lay_order_bg;
  var lays_order;

  var lay_bg;

  // ダメージのイラストを表示する
  var damageImage = false;
  var damageImageTimer = 0;
  var dying = false;

  // ----------------

  // 立ち絵のファイル名を取得する
  // 最終的に 【 Battle{先頭のキャラID}_A_Normal 】などの文字列を作りたい。
  /*
    function getOVFileName_old() {

        var f_header = 'Battle';
        var f_charaId = '0001'; // キャラID4桁
        var f_bote = '0';	// ボテ腹か
        var f_dying = '0';	// 瀕死か
        var f_damage = '0';	// ダメージモーション中か

        // --------------------
        
        // パーティ先頭のキャラID
        var actorId = $gameParty.members()[0].actorId();

        // 先頭のアクターのポインタ
        var actor = $gameActors.actor(actorId);
        
        // 試作品：アクターが立ち絵強制変更ステート52番の状態異常にかかっているかどうか
				var isState52 = actor.isStateAffected(52);

        // --------------------

        // 先頭キャラのID
        var formattedActorId = String(actorId).padStart(4, '0'); // 4桁0埋め
        f_charaId = formattedActorId;	// 0000 のPT先頭のキャラID

        // --------------------
        // 先頭キャラがボテ腹か
        switch(actorId)
        {
            // キャラ0001:通常ヒロイン
            case 1:
                // 変数222が2以上の場合はボテ腹
                if($gameVariables.value(222)>=2)
                f_bote = "1Bote";
                break 
        }

        // --------------------
        // 先頭キャラが瀕死あるいは死んでいるか
        if (actor.isDead()||actor.isDying()) {
            f_dying = "1Dying";
        }

        // --------------------

        // 先頭キャラがダメージモーションをしているか
        if (damageImage) {
            f_damage = "1Damage";
        }

        // --------------------

        // キャラ別固定値 強制上書き
        switch(actorId)
        {
            // キャラ0002:ラスボス戦
            case 2:
                // キャラ0002:ラスボス戦はボテ腹にならない
                f_bote ="X";
                // キャラ0002:ラスボス戦は瀕死にならない
                f_dying = "X";
                break 
        }

        // --------------------

				if(isState52)
				{
        	var file = f_header+f_charaId+"_"+"_state52";
        }
        else
        {
        	var file = f_header+f_charaId+"_"+f_bote+"_"+f_dying+"_"+f_damage;
				}

        return file;
    };
    */

  // 立ち絵のファイル名を取得する
  // 最終的に 【 Battle{先頭のキャラID}_A_Normal 】などの文字列を作りたい。
  function getOVFileName() {
    // 通常時の立ち絵のファイル名
    var FILE_DEFAULT_NAME = "Battle{CharaID}_{Bote}_{Dying}_{Damage}";

    // 強制的に立ち絵を変更する『ステートID52』状態異常をうけている場合
    var FILE_STATE52_NAME = "Battle{CharaID}_{Bote}_state52";

    // キャラ0002:ラスボス戦専用立ち絵フォーマット
    // キャラ0002はボテ腹にならない = X
    // キャラ0002は瀕死にならない = X
    var FILE_ACTORId2_NAME = "Battle{CharaID}_X_X_{Damage}";

    // --------------------

    // 最終的なファイルのフォーマットの設定（ひとまずdefault_name）
    var file = FILE_DEFAULT_NAME;

    // --------------------
    // 各種情報

    // パーティ先頭のキャラID
    var actorId = $gameParty.members()[0].actorId();

    // 先頭のアクターのポインタ
    var actor = $gameActors.actor(actorId);

    // 先頭キャラのID（4桁）
    var formattedActorId = String(actorId).padStart(4, "0"); // PT先頭のキャラID 4桁0埋め

    // 試作品：アクターが立ち絵強制変更ステート52番の状態異常にかかっているかどうか
    var isState52 = actor.isStateAffected(52);

    // --------------------------------------------------------------------------------
    // 最終的なファイルのフォーマットの設定

    // ステート52の状態異常をうけている時はステート52のファイルフォーマットで強制上書き
    if (isState52) {
      var file = FILE_STATE52_NAME;
    }

    // キャラ0002:ラスボス戦
    if (actorId == 2) {
      var file = FILE_ACTORId2_NAME;
    }

    // --------------------------------------------------------------------------------

    // 先頭キャラのID

    file = file.replace("{CharaID}", formattedActorId);

    // --------------------
    // 先頭キャラがボテ腹か
    switch (actorId) {
      // キャラ0001:通常ヒロイン
      case 1:
        // 変数222が2以上の場合はボテ腹
        if ($gameVariables.value(222) >= 2)
          file = file.replace("{Bote}", "1Bote");
        else file = file.replace("{Bote}", "0");
        break;
      default:
        file = file.replace("{Bote}", "0");
        break;
    }

    // --------------------
    // 先頭キャラが瀕死あるいは死んでいるか
    switch (actorId) {
      // キャラ0001:通常ヒロイン
      case 1:
        if (actor.isDead() || actor.isDying())
          file = file.replace("{Dying}", "1Dying");
        else file = file.replace("{Dying}", "0");
        break;
      default:
        file = file.replace("{Bote}", "0");
        break;
    }

    // --------------------

    // 先頭キャラがダメージモーションをしているか
    if (damageImage) file = file.replace("{Damage}", "1Damage");
    else file = file.replace("{Damage}", "0");

    // --------------------

    return file;
  }

  // ----------------

  var _Scene_Battle_start = Scene_Battle.prototype.start;
  Scene_Battle.prototype.start = function () {
    _Scene_Battle_start.apply(this);

    init();
    refresh();
  };

  var _Window_BattleStatus_refresh = Window_BattleStatus.prototype.refresh;
  Window_BattleStatus.prototype.refresh = function () {
    _Window_BattleStatus_refresh.apply(this);
    refresh();
  };

  var _Window_BattleStatus_update = Window_BattleStatus.prototype.update;
  Window_BattleStatus.prototype.update = function () {
    _Window_BattleStatus_update.apply(this);
    update2();
  };

  var _Game_Actor_onDamage = Game_Actor.prototype.onDamage;
  Game_Actor.prototype.onDamage = function (value) {
    damageImage = true;
    damageImageTimer = 120;
    _Game_Actor_onDamage.call(this, value);
    //refresh();
  };

  BattleManager.displayTurnOrder = function () {
    var predictedTurnOrder = this._predictedTurnOrder;
    var symbols = this._predictedTurnSymbols;

    if (typeof this.lays_order === "undefined") {
      return;
    }

    for (var i = 0; i < predictedTurnOrder.length; i++) {
      if (i >= lays_order.length) {
        break;
      }

      lays_order[i].setToBattler(predictedTurnOrder[i]);
    }
  };

  // ステータスウィンドウは自前でやるので非表示
  var Scene_Battle_createStatusWindow =
    Scene_Battle.prototype.createStatusWindow;
  Scene_Battle.prototype.createStatusWindow = function () {
    Scene_Battle_createStatusWindow.call(this);
    this._statusWindow.visible = false;
  };

  // 指定対象が指定目標に対してのアクションを起動する。
  var BattleManager_invokeAction = BattleManager.invokeAction;
  BattleManager.invokeAction = function (subject, target) {
    //console.log("invokeAction:"+INT_BTL_ACTION_ENEMY_ID+":"+subject.enemyId());
    BattleManager_invokeAction.call(this, subject, target);

    // 行動者の情報
    var isEnemy = subject.isEnemy();

    // アクションしている人のID
    if (isEnemy)
      $gameVariables.setValue(INT_BTL_ACTION_ENEMY_ID, subject.enemyId());
  };

  // ----------------

  Game_Screen.prototype.hideTachie = function () {
    lay_ov.visible = false;
  };
  Game_Screen.prototype.showTachie = function () {
    lay_ov.visible = true;
  };
  /*
Game_Screen.prototype.visibleOv = function (visible) {
  lay_ov.visible = visible;
    };
    */

  Game_Screen.prototype.viewEv = function (file, fx, fy) {
    var x = EV_VIEW_X;
    var y = EV_VIEW_Y;
    //console.log("viewEv");
    if (typeof fx !== "undefined") {
      x = fx;
    }
    if (typeof fy !== "undefined") {
      y = fy;
    }
    lay_ev.setPos(x, y);
    lay_ev.bitmap = ImageManager.loadPicture(file);
    lay_ev.visible = true;
    lay_ov.visible = false;
  };

  Game_Screen.prototype.hideEv = function () {
    //console.log("hideEv");
    lay_ev.visible = false;
    lay_ov.visible = true;
  };

  Game_Screen.prototype.viewSectionSpine = function (skeleton, animation) {
    //console.log("viewSectionSpine");
    spine_section.setSkeleton(skeleton).setAnimation(0, animation);
    lay_spine_section.visible = true;
  };

  Game_Screen.prototype.hideSectionSpine = function () {
    //console.log("hideSectionSpine");
    lay_spine_section.visible = false;
  };

  var init = function () {
    for (var i = 0; i < preloadPictures.length; i++) {
      ImageManager.reservePicture(preloadPictures[i]);
    }

    var parent = SceneManager._scene._spriteset._battleField;

    // パーティ先頭のキャラID
    var actorId = $gameParty.members()[0].actorId();

    // 先頭のアクターのポインタ
    var actor = $gameActors.actor(actorId);

    lay_bg = new PL_Layer(SceneManager._scene._spriteset._backgroundSprite);
    lay_bg.bitmap = ImageManager.loadPicture("Floral");
    lay_bg.visible = true;

    // 呼吸あり立ち絵
    lay_ov = new PL_EffectLayer(parent, OV_VIEW_X, OV_VIEW_Y);
    lay_ov.setEffectBreath(true);
    lay_ov.visible = true;

    // ev絵
    lay_ev = new PL_EffectLayer(parent, EV_VIEW_X, EV_VIEW_Y);
    lay_ev.visible = false;

    // Spine断面図
    lay_spine_section = new PL_Layer(parent);
    spine_section = new Game_Spine();
    sprite_spine_section = new Sprite_Spine(spine_section);
    lay_spine_section.addChild(sprite_spine_section);
    //spine_section.setSkeleton('spineboy-pro/spineboy-pro').setAnimation(0, 'walk');
    lay_spine_section.setPos(EV_SECTION_X, EV_SECTION_Y);
    lay_spine_section.visible = false;

    // 背景黒グラデ
    var bitmap = new Bitmap(Graphics.boxWidth, 200);
    lay_grd = new PL_Layer(parent, 0, Graphics.boxHeight - bitmap.height);
    var c1 = "rgba(0, 0, 0, 0.0)";
    var c2 = "rgba(0, 0, 0, 0.5)";
    bitmap.gradientFillRect(0, 0, bitmap.width, bitmap.height, c1, c2, true);
    lay_grd.bitmap = bitmap;
    lay_grd.visible = true;

    // ゲージ類
    var OFFSET_HAED_X = 0;
    var OFFSET_HAED_Y = 10;
    var OFFSET_NUMBER_X = 90;
    var OFFSET_NUMBER_Y = 1;
    var OFFSET_GAUGE_X = 0;
    var OFFSET_GAUGE_Y = 20;

    var x = 620;
    var y = lay_grd.y + 80;

    lay_icons = new PL_Layer(parent, 0, y - 40);
    lay_icons.bitmap = new Bitmap(SceneManager._screenWidth, 32);
    lay_icons.visible = true;

    lay_hp_header = new PL_Layer(parent, x + OFFSET_HAED_X, y + OFFSET_HAED_Y);
    lay_hp_header.bitmap = ImageManager.loadPicture("gcp_gaugeHead_hp");
    lay_hp_header.visible = true;

    lay_hp_num = new PL_NumericLayer(parent, "gcp_number", 4, -3);
    lay_hp_num.setPos(x + OFFSET_NUMBER_X, y + OFFSET_NUMBER_Y);
    lay_hp_num.setNum(actor.hp);
    lay_hp_num.visible = true;

    lay_hp_gauge_bg = new PL_Layer(
      parent,
      x + OFFSET_GAUGE_X,
      y + OFFSET_GAUGE_Y
    );
    lay_hp_gauge_bg.bitmap = ImageManager.loadPicture("gcp_gauge_commonBlank");
    lay_hp_gauge_bg.visible = true;

    lay_hp_gauge = new PL_GaugeLayer(parent, "gcp_gauge_hp", 154, 2);
    lay_hp_gauge.setPos(x + OFFSET_GAUGE_X + 2, y + OFFSET_GAUGE_Y + 2);
    lay_hp_gauge.setRate(actor.hpRate());
    lay_hp_gauge.visible = true;

    x -= 10;
    y += 35;

    lay_mp_header = new PL_Layer(parent, x + OFFSET_HAED_X, y + OFFSET_HAED_Y);
    lay_mp_header.bitmap = ImageManager.loadPicture("gcp_gaugeHead_mp");
    lay_mp_header.visible = true;

    lay_mp_num = new PL_NumericLayer(parent, "gcp_number", 4, -3);
    lay_mp_num.setPos(x + OFFSET_NUMBER_X, y + OFFSET_NUMBER_Y);
    lay_mp_num.setNum(actor.mp);
    lay_mp_num.visible = true;

    lay_mp_gauge_bg = new PL_Layer(
      parent,
      x + OFFSET_GAUGE_X,
      y + OFFSET_GAUGE_Y
    );
    lay_mp_gauge_bg.bitmap = ImageManager.loadPicture("gcp_gauge_commonBlank");
    lay_mp_gauge_bg.visible = true;

    lay_mp_gauge = new PL_GaugeLayer(parent, "gcp_gauge_mp", 154, 2);
    lay_mp_gauge.setPos(x + OFFSET_GAUGE_X + 2, y + OFFSET_GAUGE_Y + 2);
    lay_mp_gauge.setRate(actor.mpRate());
    lay_mp_gauge.visible = true;

    x -= 10;
    y += 35;

    lay_tp_header = new PL_Layer(parent, x + OFFSET_HAED_X, y + OFFSET_HAED_Y);
    lay_tp_header.bitmap = ImageManager.loadPicture("gcp_gaugeHead_tp");
    lay_tp_header.visible = true;

    lay_tp_num = new PL_NumericLayer(parent, "gcp_number", 4, -3);
    lay_tp_num.setPos(x + OFFSET_NUMBER_X, y + OFFSET_NUMBER_Y);
    lay_tp_num.setNum(actor.tp);
    lay_tp_num.visible = true;

    lay_tp_gauge_bg = new PL_Layer(
      parent,
      x + OFFSET_GAUGE_X,
      y + OFFSET_GAUGE_Y
    );
    lay_tp_gauge_bg.bitmap = ImageManager.loadPicture("gcp_gauge_commonBlank");
    lay_tp_gauge_bg.visible = true;

    lay_tp_gauge = new PL_GaugeLayer(parent, "gcp_gauge_tp", 154, 2);
    lay_tp_gauge.setPos(x + OFFSET_GAUGE_X + 2, y + OFFSET_GAUGE_Y + 2);
    lay_tp_gauge.setRate(0);
    lay_tp_gauge.visible = true;

    // オーダーウィンドウ
    lay_order_bg = new PL_Layer(parent, 230, x + 32 + 4 + 1);
    lay_order_bg.bitmap = ImageManager.loadPicture("gcp_order");
    lay_order_bg.visible = true;

    lays_order = [];
    for (var i = 0; i < 7; i++) {
      var lay = new GCP_OrderLayer(
        parent,
        lay_order_bg.x + i * 48,
        lay_order_bg.y + 13
      );
      lay.opacity = 255 - 35 * i;
      lay.visible = true;
      lays_order.push(lay);
    }

    // アクセサ
    BattleManager.lays_order = lays_order;
    dying = actor.isDying();
  };

  //-----------------------------------------------------------------

  var refresh = function () {
    if (typeof lay_ov === "undefined") return;

    // パーティ先頭のキャラID
    var actorId = $gameParty.members()[0].actorId();

    // 先頭のアクターのポインタ
    var actor = $gameActors.actor(actorId);
    console.log(actorId);
    console.log(actor);
    // 立ち絵
    var file = getOVFileName();
    lay_ov.bitmap = ImageManager.loadPicture(file);

    // ステータス
    lay_icons.bitmap.clear();
    var bitmap = ImageManager.loadSystem("IconSet");
    var icons = actor.allIcons();
    for (var i = 0; i < icons.length; i++) {
      var pw = Window_Base._iconWidth;
      var ph = Window_Base._iconHeight;
      var sx = (icons[i] % 16) * pw;
      var sy = Math.floor(icons[i] / 16) * ph;
      lay_icons.bitmap.blt(
        bitmap,
        sx,
        sy,
        pw,
        ph,
        lay_icons.bitmap.width - Window_Base._iconWidth * (i + 1) - 25,
        0
      );
      // lay_icons.blt(bitmap, sx, sy, pw, ph, 0, 0);
    }

    lay_hp_num.setToNum(actor.hp);
    lay_hp_gauge.setToRate(actor.hpRate());
    lay_mp_num.setToNum(actor.mp);
    lay_mp_gauge.setToRate(actor.mpRate());
    lay_tp_num.setToNum(actor.tp);
    lay_tp_gauge.setToRate(actor.tpRate());

    if (dying != actor.isDying()) {
      if (actor.isDying()) {
        // 破れアニメーションを一体削除
        //$gameActors.actor(1).startAnimation(DYING_ANIME_ID, false, 0);
        //if(BattleManager._logWindow)
        //  BattleManager._logWindow._waitCount = DYING_ANIME_WAIT;
      }
      dying = actor.isDying();
    }
  };

  var update2 = function () {
    if (damageImage) {
      if (damageImageTimer <= 0) {
        damageImage = false;
        refresh();
      } else {
        damageImageTimer--;
      }
    }
  };
})();

// ----------------------------------------------------------------

// 既存戦闘アクターSVの処理とダメージ表示位置

(function () {
  "use strict";

  var DAMAGE_VIEW_X = 1000;
  var DAMAGE_VIEW_Y = 400;

  // 既存の影はいらないが、速度向上とリスクに見合わないので表示を消すだけの簡易対応
  Sprite_Actor.prototype.createShadowSprite = function () {
    this._shadowSprite = new Sprite();
    this._shadowSprite.bitmap = new Bitmap(1, 1);
    this._shadowSprite.anchor.x = 0.5;
    this._shadowSprite.anchor.y = 0.5;
    this._shadowSprite.visible = false;
    this.addChild(this._shadowSprite);
  };

  // 戦闘武器演出。同上。
  Sprite_Weapon.prototype.loadBitmap = function () {
    this.bitmap = ImageManager.loadSystem("");
  };

  // アクターSVの位置調整、ダメージ位置調整用
  Sprite_Actor.prototype.setActorHome = function (index) {
    this.setHome(DAMAGE_VIEW_X, DAMAGE_VIEW_Y);
  };

  // サイドビューモードだと味方のダメージ時に寂しいので、シェイクさせておく
  var _Game_Actor_performDamage = Game_Actor.prototype.performDamage;
  Game_Actor.prototype.performDamage = function () {
    $gameScreen.startShake(5, 20, 10);
    _Game_Actor_performDamage.call(this);
  };
})();

// ----------------------------------------------------------------

// コマンドとウィンドウ位置処理関連

(function () {
  // 通常攻撃がそもそもタイプ不明なのでいらない。
  // むしろパーティーコマンドがない分、視覚的な逃亡コマンドが必要。
  // ただ通常攻撃がない分ワンクリック攻撃ができない分、バトルテンポが悪くなるのでバランス調整の検討は必要
  Window_ActorCommand.prototype.makeCommandList = function () {
    if (this._actor) {
      this.addSkillCommands();
      //this.addGuardCommand();
      this.addItemCommand();
      this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
    }
  };

  Scene_Battle.prototype.createActorCommandWindow = function () {
    this._actorCommandWindow = new Window_ActorCommand();
    this._actorCommandWindow.setHandler(
      "attack",
      this.commandAttack.bind(this)
    );
    this._actorCommandWindow.setHandler("skill", this.commandSkill.bind(this));
    this._actorCommandWindow.setHandler("guard", this.commandGuard.bind(this));
    this._actorCommandWindow.setHandler("item", this.commandItem.bind(this));
    this._actorCommandWindow.setHandler(
      "cancel",
      this.selectPreviousCommand.bind(this)
    );
    this._actorCommandWindow.setHandler(
      "escape",
      this.commandEscape.bind(this)
    );
    this.addWindow(this._actorCommandWindow);
  };

  Window_ActorCommand.prototype.addEscapeCommand = function () {
    this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
  };

  Window_ActorCommand.prototype.numVisibleRows = function () {
    return 4;
  };

  Window_BattleEnemy.prototype.numVisibleRows = function () {
    return 4;
  };

  // オリジナルステータスウィンドウの行数書き換え　もろもろこのウィンドウの座標を参照している為
  Window_BattleStatus.prototype.numVisibleRows = function () {
    return 4;
  };

  /*
    var btl_loadWindowskin = function () {
        this.windowskin = ImageManager.loadPicture("gcp_window");
    };
    var btl_updateTone = function () {
        this.setTone(0, 0, 0);
    };
    var btl_standardBackOpacity = function () {
        return 192;
    };

    Window_BattleEnemy.prototype.loadWindowskin = btl_loadWindowskin;
    Window_BattleEnemy.prototype.updateTone = btl_updateTone;
    Window_BattleEnemy.prototype.standardBackOpacity = btl_standardBackOpacity;

    Window_ActorCommand.prototype.loadWindowskin = btl_loadWindowskin;
    Window_ActorCommand.prototype.updateTone = btl_updateTone;
    Window_ActorCommand.prototype.standardBackOpacity = btl_standardBackOpacity;

    Window_BattleItem.prototype.loadWindowskin = btl_loadWindowskin;
    Window_BattleItem.prototype.updateTone = btl_updateTone;
    Window_BattleItem.prototype.standardBackOpacity = btl_standardBackOpacity;

    Window_BattleSkill.prototype.loadWindowskin = btl_loadWindowskin;
    Window_BattleSkill.prototype.updateTone = btl_updateTone;
    Window_BattleSkill.prototype.standardBackOpacity = btl_standardBackOpacity;

    Window_Help.prototype.loadWindowskin = btl_loadWindowskin;
    Window_Help.prototype.updateTone = btl_updateTone;
    Window_Help.prototype.standardBackOpacity = btl_standardBackOpacity;
    */
})();

// ----------------------------------------------------------------

// 技関連
(function () {
  "use strict";

  // リネームモード
  //var ESCAPE = "□";
  //var REPLACE_G = "[G]";
  //var REPLACE_C = "[C]";
  //var REPLACE_P = "[P]";

  var ICON_INDEX_TARGET = 15;
  var ICON_INDEX_G = 12;
  var ICON_INDEX_C = 14;
  var ICON_INDEX_P = 13;

  var _DataManager_onLoad = DataManager.onLoad;
  DataManager.onLoad = function (object) {
    _DataManager_onLoad.apply(this, arguments);
    //console.log("_DataManager_onLoad");
    init(object);
  };

  var _Scene_Battle_start = Scene_Battle.prototype.start;
  Scene_Battle.prototype.start = function () {
    _Scene_Battle_start.apply(this);
    randGCP();
  };

  var _Game_Battler_onTurnEnd = Game_Battler.prototype.onTurnEnd;
  Game_Battler.prototype.onTurnEnd = function () {
    _Game_Battler_onTurnEnd.apply(this);
    //console.log("onTurnEnd");
    randGCP();
  };

  var _Game_Unit_onBattleEnd = Game_Unit.prototype.onBattleEnd;
  Game_Unit.prototype.onBattleEnd = function () {
    _Game_Unit_onBattleEnd.apply(this);
    //console.log("_Game_Unit_onBattleEnd");
    clearGCP();
  };

  // ----------------

  var init = function (object) {
    if (object === $dataSkills) {
      for (var i = 1; i < object.length; i++) {
        var data = object[i];
        if (data != null && data.name) {
          data.gcp = null;
          // リネームモード
          //data.name_org = data.name;
          data.iconIndex_org = data.iconIndex;

          //console.log("0" + data.gcp + data.name + ":" + (data != null) + ":" + (data.name_org != null));
        }
      }
    }
  };

  var clearGCP = function () {
    var actor = $gameActors.actor(1);
    var skills = actor.skills();
    for (var i = 0; i < skills.length; i++) {
      var skill = skills[i];
      skill.gcp = null;
    }
    refresh();
  };

  var randGCP = function () {
    var actor = $gameActors.actor(1);
    var skills = actor.skills();
    for (var i = 0; i < skills.length; i++) {
      var skill = skills[i];
      if (skill != null && skill.iconIndex_org == ICON_INDEX_TARGET) {
        switch (Math.floor(Math.random() * 3)) {
          case 0:
            skill.gcp = "g";
            break;
          case 1:
            skill.gcp = "c";
            break;
          case 2:
            skill.gcp = "p";
            break;
        }
      }
      //console.log("1" + skill.gcp);
    }
    refresh();
  };

  var refresh = function () {
    for (var i = 0; i < DataManager._databaseFiles.length; i++) {
      var object = window[DataManager._databaseFiles[i].name];
      if (object === $dataSkills) {
        for (var j = 1; j < object.length; j++) {
          var data = object[j];
          //console.log("2" + data.gcp + data.name + ":" + (data != null) + ":" + (data.name_org != null));

          // リネームモード
          //if (data != null && data.name_org != null) {
          //    switch(data.gcp)
          //    {
          //        case "g":
          //            data.name = data.name_org.replace(ESCAPE, REPLACE_G);
          //            break;
          //        case "c":
          //            data.name = data.name_org.replace(ESCAPE, REPLACE_C);
          //            break;
          //        case "p":
          //            data.name = data.name_org.replace(ESCAPE, REPLACE_P);
          //            break;
          //        default:
          //            data.name = data.name_org;
          //            break;
          //    }
          //}

          if (data != null && data.iconIndex_org == ICON_INDEX_TARGET) {
            switch (data.gcp) {
              case "g":
                data.iconIndex = ICON_INDEX_G;
                break;
              case "c":
                data.iconIndex = ICON_INDEX_C;
                break;
              case "p":
                data.iconIndex = ICON_INDEX_P;
                break;
              default:
                data.iconIndex = ICON_INDEX_TARGET;
                break;
            }
          }
        }
      }
    }
  };
})();

// ----------------------------------------------------------------
// モンスター属性・コモンイベント関連
(function () {
  "use strict";

  var parameters = $plugins.filter(function (p) {
    return p.description.contains("<Ellye ATB>");
  })[0].parameters; //Thanks to Iavra

  var full_atb = Number(parameters["Full ATB Gauge"] || 50000);

  var ICON_INDEX_UNKNOWN = 15; //不明時
  var ICON_INDEX_G = 12;
  var ICON_INDEX_C = 14;
  var ICON_INDEX_P = 13;

  // ジャンケン勝利時のアニメID
  //var WIN_ANIME_ID = 152;

  // ジャンケン勝利時のコモンイベントID
  var WIN_COMMON_EVENT_ID = 332;

  // ジャンケン勝利時の音声（PL_GCP_Win_ActorID{アクターID}）
  var PL_GCP_WIN_ACTOR = "PL_GCP_Win_ActorID";

  var WIN_MESSAGE = "じゃんけん属性で勝利！追撃発生！";
  var WIN_ANIME_ID_WAIT = 0; // 旧作のアニメ処理では必要だった。

  var _Scene_Battle_start = Scene_Battle.prototype.start;
  Scene_Battle.prototype.start = function () {
    _Scene_Battle_start.apply(this);
    allChange();
  };

  // 強制でアイコン表示に割り込む
  Game_Enemy.prototype.allIcons = function () {
    var icons = [];
    if (this.gcp_unknown) {
      icons.push(ICON_INDEX_UNKNOWN);
    } else {
      switch (this.gcp) {
        case "g":
          icons.push(ICON_INDEX_G);
          break;
        case "c":
          icons.push(ICON_INDEX_C);
          break;
        case "p":
          icons.push(ICON_INDEX_P);
          break;
      }
    }

    return icons.concat(this.stateIcons().concat(this.buffIcons()));
  };

  Game_Enemy.prototype.changeGCP = function () {
    var unknownRate = 50;

    var memo = "";
    if (this.isEnemy()) {
      memo = this.enemy().note.split(/[\r\n]+/);
    }

    for (var i = 0; i < memo.length; i++) {
      if (memo[i].indexOf("gcp_unknown_rate:") == 0) {
        unknownRate = Number(memo[i].replace("gcp_unknown_rate:", ""));
      }
      //console.log(memo[i]+"??");
    }
    //console.log(unknownRate+"???");
    //if (typeof this.meta !== 'undefined' && typeof this.meta.unknown !== 'undefined') {
    //    unknownRate = Number(this.meta.unknown);
    //}

    this.gcp_unknown = Math.random() * 100 < unknownRate;

    switch (Math.floor(Math.random() * 3)) {
      case 0:
        this.gcp = "g";
        break;
      case 1:
        this.gcp = "c";
        break;
      case 2:
        this.gcp = "p";
        break;
    }
  };

  //ダメージ計算は独自のもの
  //
  var _alias_ga_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function (target) {
    var result = target.result();
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = result.used && Math.random() >= this.itemHit(target);
    result.evaded = !result.missed && Math.random() < this.itemEva(target);
    result.physical = this.isPhysical();
    result.drain = this.isDrain();

    if (result.isHit()) {
      // 両者に属性がある
      if (target.gcp != null && this.item().gcp != null) {
        var r = 0; //lose=-1, draw=0, win=1
        //console.log("s" + this.item().gcp + ":" + target.gcp);
        switch (this.item().gcp) {
          case "g":
            switch (target.gcp) {
              case "c":
                r = 1;
                break;
              case "p":
                r = -1;
                break;
            }
            break;
          case "c":
            switch (target.gcp) {
              case "g":
                r = -1;
                break;
              case "p":
                r = 1;
                break;
            }
            break;
          case "p":
            switch (target.gcp) {
              case "g":
                r = 1;
                break;
              case "c":
                r = -1;
                break;
            }
            break;
        }

        //console.log("?0??" + r + ":" + this.item().damage.type);
        if (this.item().damage.type > 0) {
          if (r == 1) {
            // 勝利時確定クリティカル
            //result.critical = true;
            // 勝利時対象の属性は再抽選
            target.changeGCP();
            //console.log("??0?" + this.subject().atb + ":" + full_atb);
            // 勝利時強制もう1ターン

            // 演出
            //BattleManager._logWindow.push('clear');
            //_Window_BattleLog_addText.call(BattleManager._logWindow, WIN_MESSAGE);

            if (this.subject().atb != full_atb) {
              const actorId = $gameParty.members()[0].actorId(); // アクターIDを取得

              const seName = PL_GCP_WIN_ACTOR + actorId; // SEファイルの名前

              AudioManager.playSe({
                name: seName,
                volume: 100,
                pitch: 100,
                pan: 0,
              }); // SEを再生

              this.subject().atb = full_atb;
              BattleManager._logWindow.clear();
              BattleManager._logWindow.addItemNameText(WIN_MESSAGE);
              //BattleManager._logWindow.push('addText', WIN_MESSAGE);
              //BattleManager._logWindow.push('wait');
              //BattleManager._logWindow.addText("aiu");

              //this.subject().startAnimation(WIN_ANIME_ID, false, 0);
              BattleManager._logWindow._waitCount = WIN_ANIME_ID_WAIT;

              // 主にボイスを鳴らすのに使用するコモンイベント　ただし攻撃モーションより後に呼ばれるため注意。
              $gameTemp.reserveCommonEvent(WIN_COMMON_EVENT_ID);
            }
          }

          var value = this.makeDamageValue(target, result.critical);
          if (r == -1) {
            // 敗北時ダメージ半減
            value = Math.ceil((value /= 2));
          } else if (r == 0) {
            // 引き分け時
          }

          this.executeDamage(target, value);
        }
      } else {
        if (this.item().damage.type > 0) {
          result.critical = Math.random() < this.itemCri(target);
          var value = this.makeDamageValue(target, result.critical);
          this.executeDamage(target, value);
        }
      }
      this.item().effects.forEach(function (effect) {
        this.applyItemEffect(target, effect);
      }, this);
      this.applyItemUserEffect(target);
    }

    //--以下ellye's_atb.jsの計算--

    var default_delay_amount = 10;
    var default_delays = 1;
    if (target.result().isHit()) {
      var self_atb = this.evalATBFormula(this._item.selfATB(), target);
      var target_atb = this.evalATBFormula(this._item.targetATB(), target);
      this.subject().atb += self_atb;
      target.atb += target_atb;
      //Interrupts and delays:
      var delay_amount = 10;
      if (
        typeof this.item() !== "undefined" &&
        typeof this.item().meta !== "undefined"
      ) {
        if (this.item().meta.interrupt || this.item().meta.interrupts) {
          target.BreakCurrentCast();
        }
        if (
          typeof this.item().meta.delay_amount !== "undefined" &&
          !isNaN(Number(this.item().meta.delay_amount))
        ) {
          delay_amount = Number(this.item().meta.delay_amount);
        }
        //Care to not delay twice.
        if (
          (this.item().meta.delay || this.item().meta.delays) &&
          default_delays !== 1
        ) {
          target.delayCast(delay_amount);
        }
      }
      if (
        default_delays === 1 &&
        ((target.isActor() && this.subject().isEnemy()) ||
          (target.isEnemy() && this.subject().isActor()))
      ) {
        target.delayCast(delay_amount);
      }
    }
  };
  //----------------

  // 全員の属性を変更
  var allChange = function () {
    var enemies = $gameTroop.aliveMembers();
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].changeGCP();
    }
  };
})();

// ----------------------------------------------------------------

// ターンオーダーシステム
// Base program：ellye's_atb.js

(function () {
  "use strict";

  var parameters = $plugins.filter(function (p) {
    return p.description.contains("<Ellye ATB>");
  })[0].parameters; //Thanks to Iavra

  var turns_to_predict = 7;
  var full_atb = Number(parameters["Full ATB Gauge"] || 50000);
  var display_turn_order = 1;

  // 下記は、オリジナルがdisplay_turn_order==trueの条件で読み込まれる関連群

  //We need to modify the Select method of the BattleSkill and BattleItem windows so that they may predict ATB changes:
  Window_BattleSkill.prototype.select = function (index) {
    Window_SkillList.prototype.select.call(this, index);
    this.predictChanges(this.item());
  };

  //Same for BattleItem
  Window_BattleItem.prototype.select = function (index) {
    Window_ItemList.prototype.select.call(this, index);
    this.predictChanges(this.item());
  };

  //For the enemy selecting window, we also need to get our action. Same for actor selecting one later.
  var _alias_battle_enemy = Window_BattleEnemy.prototype.select;
  Window_BattleEnemy.prototype.select = function (index) {
    _alias_battle_enemy.call(this, index);
    var action = BattleManager.inputtingAction();
    var item = action === null ? null : action.item();
    this.predictChanges(item, this.enemy());
  };

  //And for actors
  var _alias_battle_actor = Window_BattleActor.prototype.select;
  Window_BattleActor.prototype.select = function (index) {
    _alias_battle_actor.call(this, index);
    var action = BattleManager.inputtingAction();
    var item = action === null ? null : action.item();
    this.predictChanges(item, this.actor());
  };

  //Affects prediction based on selectable option
  Window_Selectable.prototype.predictChanges = function (item, target) {
    if (
      item === null ||
      typeof item === "undefined" ||
      !$gameParty.inBattle()
    ) {
      return;
    }
    var a = BattleManager._subject;
    if (typeof target !== "undefined" && target !== null) {
      var b = target;
    } else if (item.scope === 11) {
      var b = a;
    } else if ([7, 8, 9, 10].contains(item.scope)) {
      var b = $gameParty.smoothTarget();
    } else {
      var b = $gameTroop.smoothTarget();
    }
    var v = $gameVariables._data;
    var selfATB =
      typeof item.meta.self_atb !== "undefined"
        ? Number(eval(item.meta.self_atb) || 0)
        : 0;
    var targetATB =
      typeof item.meta.target_atb !== "undefined"
        ? Number(eval(item.meta.target_atb) || 0)
        : 0;
    var castingTime =
      typeof item.meta.cast_time !== "undefined"
        ? Number(eval(item.meta.cast_time) || 0)
        : 0;
    var battlersAffected = [];
    var values = [];
    var battlerCasting = a;
    if (selfATB !== 0) {
      battlersAffected.push(a);
      values.push(selfATB);
    }
    if (targetATB !== 0) {
      if (typeof target !== "undefined" && target !== null) {
        battlersAffected.push(target);
        values.push(targetATB);
      } else if ([1, 3, 7].contains(item.scope)) {
        //Still hasen't clicked the single target skill
      } else if ([2, 4, 5, 6].contains(item.scope)) {
        $gameTroop.aliveMembers().forEach(function (enemy) {
          battlersAffected.push(enemy);
          values.push;
        }, this);
      } else if (item.scope === 8) {
        $gameParty.aliveMembers().forEach(function (ally) {
          battlersAffected.push(ally);
          values.push;
        }, this);
      } else if (item.scope === 10) {
        $gameParty.deadMembers().forEach(function (ally) {
          battlersAffected.push(ally);
          values.push;
        }, this);
      }
    }
    BattleManager.predictTurnOrder(
      battlersAffected,
      values,
      battlerCasting,
      castingTime
    );
  };

  //Reload Turn Order Predction when we cancel windows:
  var _alias_skill_cancel = Scene_Battle.prototype.onSkillCancel;
  Scene_Battle.prototype.onSkillCancel = function () {
    BattleManager.predictTurnOrder();
    _alias_skill_cancel.call(this);
  };
  var _alias_item_cancel = Scene_Battle.prototype.onItemCancel;
  Scene_Battle.prototype.onItemCancel = function () {
    BattleManager.predictTurnOrder();
    _alias_item_cancel.call(this);
  };
  var _alias_enemy_cancel = Scene_Battle.prototype.onEnemyCancel;
  Scene_Battle.prototype.onEnemyCancel = function () {
    BattleManager.predictTurnOrder();
    _alias_enemy_cancel.call(this);
  };

  // 計算系もオリジナル準拠

  //We'll need a function to predict the turn order for the next few turns, in case the developer wants to display this:
  BattleManager.predictTurnOrder = function (
    battlersToApplyModifiersTo,
    modifiersValues,
    battlerCasting,
    castingTime
  ) {
    if (display_turn_order !== 1) {
      return null;
    }
    if (typeof battlersToApplyModifiersTo === "undefined") {
      battlersToApplyModifiersTo = [];
    }
    if (typeof modifiersValues === "undefined") {
      modifiersValues = [];
    }
    if (
      typeof battlerCasting === "undefined" ||
      typeof castingTime === "undefined"
    ) {
      var battlerCasting = null;
      var castingTime = 0;
    }
    var numberOfTurns = turns_to_predict;
    var mmodifierValue = Number(mmodifierValue) || 0;
    var arrayOfATBValues = [];
    var arrayOfCastValues = [];
    var arrayOfCastingTimes = [];
    var arrayOfSymbols = [];
    var predictedTurnOrder = [];
    var predictedTurnOrderSymbols = [];
    var validBattlers = this.aliveBattleMembers();
    var delayedModForActiveActor = 0;
    var delayedModHasBeenApplied = false;
    if (numberOfTurns === 0) {
      return false;
    }
    //We cannot work directly on our Battlers for this simulation, or else we would mess their values
    //So instead we copy the numbers that are necessary, and we use them.
    validBattlers.forEach(function (battler) {
      var modIndex = battlersToApplyModifiersTo.indexOf(battler);
      var modValue = 0;
      var cast = 0;
      var symbol = false;
      if (modIndex >= 0) {
        modValue = modifiersValues[modIndex];
      }
      //Add the plus, minus or neutral symbol:
      if (modValue > 0) {
        symbol = ctb_bonus;
      } else if (modValue < 0) {
        symbol = ctb_malus;
      }
      arrayOfSymbols.push(symbol);
      //See if it's hovering over a casting skill:
      if (battlerCasting === battler && castingTime > 0) {
        cast += castingTime;
      }
      //If the battler is already casting something:
      cast += battler.target_cast_atb;

      //Compensate for the full ATB that casting battlers have behind the curtains:
      if (cast > 0 && battler.atb >= full_atb) {
        modValue -= full_atb;
      }
      //If we're selecting the action of an actor:
      if (typeof this.actor() !== "undefined" && this.actor() === battler) {
        arrayOfATBValues.push(battler.atb);
        delayedModForActiveActor = modValue;
      } else {
        arrayOfATBValues.push(battler.atb + modValue);
      }
      //Add the current cast time as normal:
      arrayOfCastValues.push(battler.current_cast_atb);
      //And the target cast time:
      arrayOfCastingTimes.push(cast);
    }, this);

    //Now we simulate until we have enough turns:
    while (predictedTurnOrder.length < numberOfTurns) {
      for (index = 0; index < arrayOfATBValues.length; index++) {
        var battler = validBattlers[index];
        var target_cast = arrayOfCastingTimes[index];
        if (
          typeof this.actor() !== "undefined" &&
          this.actor() === battler &&
          predictedTurnOrder.length >= 1 &&
          delayedModHasBeenApplied === false
        ) {
          arrayOfATBValues[index] += delayedModForActiveActor;
          delayedModHasBeenApplied = true;
        }

        //If is casting, check by cast time and don't increase virtual atb
        if (arrayOfCastValues[index] < target_cast) {
          arrayOfCastValues[index] +=
            battler._cast_rate * (battler.CastHaste() / 100);
          if (arrayOfCastValues[index] >= target_cast) {
            predictedTurnOrder.push(battler);
            predictedTurnOrderSymbols.push(ctb_cast);
          }
        } else {
          arrayOfATBValues[index] += battler.calculateATBRate();
          if (arrayOfATBValues[index] >= full_atb) {
            arrayOfATBValues[index] -= full_atb;
            predictedTurnOrder.push(battler);
            predictedTurnOrderSymbols.push(arrayOfSymbols[index]);
          }
        }
      }
    }
    predictedTurnOrder = predictedTurnOrder.slice(0, numberOfTurns);
    //Let's show them in our CTB Windows, if they are being used:
    this._predictedTurnOrder = predictedTurnOrder;
    this._predictedTurnSymbols = predictedTurnOrderSymbols;
    this.displayTurnOrder();
  };
})();

// ----------------------------------------------------------------
