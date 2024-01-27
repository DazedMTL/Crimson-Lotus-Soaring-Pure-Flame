//=============================================================================
// RPGツクールMV - LL_StandingPictureMV.js v2.6.3
// LL_StandingPictureMV_Custom.js ver.1.09
//-----------------------------------------------------------------------------
// ルルの教会 (Lulu's Church)
// https://nine-yusha.com/
//
// URL below for license details.
// https://nine-yusha.com/plugin/
//=============================================================================
// memo
// SceneManager._scene.children
//=============================================================================

/*:
 * @target MV
 * @plugindesc メッセージウィンドウ表示時に立ち絵を表示します。
 * @author ルルの教会
 * @url https://nine-yusha.com/plugin-spicture/
 *
 * @help LL_StandingPictureMV.js
 *
 * メッセージ内に専用の制御文字を入力することで、
 * 立ち絵を表示できます。
 *
 * ・\FH[ON]を入力するとウィンドウ消去後も立ち絵が残り続けます。
 *   \FH[OFF]を入力すると解除されウィンドウ消去と同時に立ち絵が消えます。
 *   ウィンドウ表示時以外のタイミングで立ち絵を表示・消去したい場合は、
 *   プラグインコマンド「制御文字の実行」を使用してください。
 * ・立ち絵IDには半角英数字とアンダースコア(_)が使用できます。
 * ・立ち絵IDは変数で指定することも可能です。 【例】\F[\V[1]]
 * ・立ち絵は一度に4人まで表示することが可能です。
 *
 * 専用制御文字:
 *   \F[立ち絵ID]         立ち絵1を表示します。 【例】\F[reid]
 *   \FF[立ち絵ID]        立ち絵2を表示します。
 *   \FFF[立ち絵ID]       立ち絵3を表示します。
 *   \FFFF[立ち絵ID]      立ち絵4を表示します。
 *   \M[モーション名]     立ち絵1のモーションを再生します。 【例】\M[yes]
 *   \MM[モーション名]    立ち絵2のモーションを再生します。
 *   \MMM[モーション名]   立ち絵3のモーションを再生します。
 *   \MMMM[モーション名]  立ち絵4のモーションを再生します。
 *   \AA[F]               立ち絵1にフォーカスを当てます。 (立ち絵1以外を暗く)
 *   \AA[FF]              立ち絵2にフォーカスを当てます。 (立ち絵2以外を暗く)
 *   \AA[FFF]             立ち絵3にフォーカスを当てます。 (立ち絵3以外を暗く)
 *   \AA[FFFF]            立ち絵4にフォーカスを当てます。 (立ち絵4以外を暗く)
 *   \AA[N]               立ち絵を全て暗くします。
 *   \AA[R]               立ち絵のフォーカスをリセットします。
 *   \FH[ON]              ホールドモードをONにします (立ち絵が残り続ける)
 *   \FH[OFF]             ホールドモードをOFFにします
 *
 * 拡張専用制御文字:
 *   \FX[F]               FlipX:立ち絵1を左右反転します。
 *   \FX[FF]              FlipX:立ち絵2を左右反転します。
 *   \FX[FFF]             FlipX:立ち絵3を左右反転します。
 *   \FX[FFFF]            FlipX:立ち絵4を左右反転します。
 *   \FFFFF[立ち絵ID]     立ち絵5を表示します。
 *   \MMMMM[モーション名] 立ち絵5のモーションを再生します。
 *   \AA[FFFFF]           立ち絵5にフォーカスを当てます。 (立ち絵5以外を暗く)
 *
 * 立ち絵モーション一覧:
 *   yes(頷く)、yesyes(二回頷く)、no(横に揺れる)、noslow(ゆっくり横に揺れる)
 *   jump(跳ねる)、jumpjump(二回跳ねる)、jumploop(跳ね続ける)
 *   shake(ガクガク)、shakeloop(ガクガクし続ける)
 *   runleft(画面左へ走り去る)、runright(画面右へ走り去る)
 *   noslowloop(横に揺れ続ける)、huwahuwa(ふわふわ)
 *
 * 拡張立ち絵モーション一覧:
 *   InL(左から移動しつつ登場)、InR(右側から移動しつつ登場)、FadeIn(移動せずに登場)
 *   FadeL(左へ移動しつつ退場)、FadeR(右側へ移動しつつ退場)、FadeOut(移動せずに登場)、FadeDown(下側へ移動しつつ退場)、Down(フェードなしで下側へ移動しつつ退場)
 *
 * プラグインコマンド(制御文字の実行):
 *   LL_StandingPictureMV processChar 制御文字
 *   LL_StandingPictureMV processChar \F[s]\M[yes]\FH[ON]  # 立ち絵sを表示
 *   LL_StandingPictureMV processChar \FH[OFF]             # 立ち絵を消去
 *
 * プラグインコマンド:
 *   LL_StandingPictureMV setEnabled true       # 立ち絵を表示に設定 (初期値)
 *   LL_StandingPictureMV setEnabled false      # 立ち絵を非表示に設定
 *   LL_StandingPictureMV setTone 68,-34,-34,0  # 立ち絵の色調を夕暮れに変更
 *   LL_StandingPictureMV setTone -68,-68,68,0  # 立ち絵の色調を夜に変更
 *   LL_StandingPictureMV setTone 0,0,0,255     # 立ち絵の色調を白黒に変更
 *   LL_StandingPictureMV setTone 0,0,0,0       # 立ち絵の色調を通常に戻す
 *
 * 利用規約:
 *   ・著作権表記は必要ございません。
 *   ・利用するにあたり報告の必要は特にございません。
 *   ・商用・非商用問いません。
 *   ・R18作品にも使用制限はありません。
 *   ・ゲームに合わせて自由に改変していただいて問題ございません。
 *   ・プラグイン素材としての再配布（改変後含む）は禁止させていただきます。
 *
 * 作者: ルルの教会
 * 作成日: 2022/7/8
 *
 * @command processChar
 * @text 制御文字の実行
 * @desc ウィンドウ表示時以外のタイミングで立ち絵を操作します。
 *
 * @arg text
 * @text 制御文字
 * @desc [例]立ち絵の表示→\F[s] \FH[ON]、立ち絵の消去→\FH[OFF]
 * 文章表示時と同じように制御文字を入力してください。
 * @type multiline_string
 *
 * @command setEnabled
 * @text 立ち絵表示ON・OFF
 * @desc 立ち絵の表示・非表示を一括制御します。
 *
 * @arg enabled
 * @text 立ち絵表示
 * @desc OFFにすると立ち絵が一切表示されなくなります。
 * @default true
 * @type boolean
 *
 * @command setTone
 * @text 色調変更
 * @desc 立ち絵の色調を変更します。
 *
 * @arg toneR
 * @text 赤
 * @desc 色調のR成分です。 (-255～255)
 * @default 0
 * @type number
 * @min -255
 * @max 255
 *
 * @arg toneG
 * @text 緑
 * @desc 色調のG成分です。 (-255～255)
 * @default 0
 * @type number
 * @min -255
 * @max 255
 *
 * @arg toneB
 * @text 青
 * @desc 色調のB成分です。 (-255～255)
 * @default 0
 * @type number
 * @min -255
 * @max 255
 *
 * @arg toneC
 * @text グレー
 * @desc グレースケールの強さです。 (0～255)
 * @default 0
 * @type number
 * @min 0
 * @max 255
 *
 * @param sPictures
 * @text 立ち絵リスト
 * @desc メッセージウィンドウに表示する立ち絵を定義します。
 * @default []
 * @type struct<sPictures>[]
 *
 * @param picture1Settings
 * @text 立ち絵1(\F)の設定
 * @desc ※この項目は使用しません
 *
 * @param transition
 * @text 切替効果
 * @desc 出現・消去時の切替効果を指定します。
 * @type select
 * @default 1
 * @option なし
 * @value 0
 * @option フェード
 * @value 1
 * @option フロート左
 * @value 2
 * @option フロート右
 * @value 3
 * @option フロート下
 * @value 4
 * @option フロート上
 * @value 5
 * @parent picture1Settings
 *
 * @param foreFront
 * @text ウィンドウの前面に表示
 * @desc ONにするとメッセージウィンドウよりも前面に表示されます。
 * @type boolean
 * @default false
 * @parent picture1Settings
 *
 * @param picture2Settings
 * @text 立ち絵2(\FF)の設定
 * @desc ※この項目は使用しません
 *
 * @param transition2
 * @text 切替効果
 * @desc 出現・消去時の切替効果を指定します。
 * @type select
 * @default 1
 * @option なし
 * @value 0
 * @option フェード
 * @value 1
 * @option フロート左
 * @value 2
 * @option フロート右
 * @value 3
 * @option フロート下
 * @value 4
 * @option フロート上
 * @value 5
 * @parent picture2Settings
 *
 * @param foreFront2
 * @text ウィンドウの前面に表示
 * @desc ONにするとメッセージウィンドウよりも前面に表示されます。
 * @type boolean
 * @default false
 * @parent picture2Settings
 *
 * @param picture3Settings
 * @text 立ち絵3(\FFF)の設定
 * @desc ※この項目は使用しません
 *
 * @param transition3
 * @text 切替効果
 * @desc 出現・消去時の切替効果を指定します。
 * @type select
 * @default 1
 * @option なし
 * @value 0
 * @option フェード
 * @value 1
 * @option フロート左
 * @value 2
 * @option フロート右
 * @value 3
 * @option フロート下
 * @value 4
 * @option フロート上
 * @value 5
 * @parent picture3Settings
 *
 * @param foreFront3
 * @text ウィンドウの前面に表示
 * @desc ONにするとメッセージウィンドウよりも前面に表示されます。
 * @type boolean
 * @default false
 * @parent picture3Settings
 *
 * @param picture4Settings
 * @text 立ち絵4(\FFFF)の設定
 * @desc ※この項目は使用しません
 *
 * @param transition4
 * @text 切替効果
 * @desc 出現・消去時の切替効果を指定します。
 * @type select
 * @default 1
 * @option なし
 * @value 0
 * @option フェード
 * @value 1
 * @option フロート左
 * @value 2
 * @option フロート右
 * @value 3
 * @option フロート下
 * @value 4
 * @option フロート上
 * @value 5
 * @parent picture4Settings
 *
 * @param foreFront4
 * @text ウィンドウの前面に表示
 * @desc ONにするとメッセージウィンドウよりも前面に表示されます。
 * @type boolean
 * @default false
 * @parent picture4Settings
 *
 * @param picture5Settings
 * @text 立ち絵5(\FFFFF)の設定
 * @desc ※この項目は使用しません
 *
 * @param transition5
 * @text 切替効果
 * @desc 出現・消去時の切替効果を指定します。
 * @type select
 * @default 1
 * @option なし
 * @value 0
 * @option フェード
 * @value 1
 * @option フロート左
 * @value 2
 * @option フロート右
 * @value 3
 * @option フロート下
 * @value 4
 * @option フロート上
 * @value 5
 * @parent picture5Settings
 *
 * @param foreFront5
 * @text ウィンドウの前面に表示
 * @desc ONにするとメッセージウィンドウよりも前面に表示されます。
 * @type boolean
 * @default false
 * @parent picture5Settings
 *
 * @param focusToneAdjust
 * @text フォーカス時の暗さ
 * @desc AA[s]でフォーカスを当てた時の暗さ(-255～0)です。
 * 暗くなりすぎる場合に調整してください。(初期値: -96)
 * @default -96
 * @min -255
 * @max 0
 * @type number
 *
 * @param catheBootPicture
 * @text 立ち絵画像の事前読み込み
 * @desc アツマールなどブラウザプレイ時の読み込み待ちを解消します。
 * 画像数や回線速度により起動が遅くなる場合があります。
 * @default true
 * @type boolean
 */

/*~struct~sPictures:
 *
 * @param id
 * @text 立ち絵ID
 * @desc 立ち絵IDです。立ち絵を制御文字で呼び出す際に使用します。
 * 半角英数字(_)で入力してください。
 * @type string
 *
 * @param imageName
 * @text 画像ファイル名
 * @desc 立ち絵として表示する画像ファイルを選択してください。
 * @dir img/pictures
 * @type file
 * @require 1
 *
 * @param origin
 * @text 原点
 * @desc 立ち絵の原点です。
 * @default 0
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 *
 * @param x
 * @text X座標 (立ち絵1)
 * @desc 立ち絵1(F)で呼び出された時の表示位置(X)です。
 * @default 464
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param y
 * @text Y座標 (立ち絵1)
 * @desc 立ち絵1(F)で呼び出された時の表示位置(Y)です。
 * @default 96
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param x2
 * @text X座標 (立ち絵2)
 * @desc 立ち絵2(FF)で呼び出された時の表示位置(X)です。
 * @default 20
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param y2
 * @text Y座標 (立ち絵2)
 * @desc 立ち絵2(FF)で呼び出された時の表示位置(Y)です。
 * @default 96
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param x3
 * @text X座標 (立ち絵3)
 * @desc 立ち絵3(FFF)で呼び出された時の表示位置(X)です。
 * @default 364
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param y3
 * @text Y座標 (立ち絵3)
 * @desc 立ち絵3(FFF)で呼び出された時の表示位置(Y)です。
 * @default 96
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param x4
 * @text X座標 (立ち絵4)
 * @desc 立ち絵4(FFFF)で呼び出された時の表示位置(X)です。
 * @default 120
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param y4
 * @text Y座標 (立ち絵4)
 * @desc 立ち絵4(FFFF)で呼び出された時の表示位置(Y)です。
 * @default 96
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param x5
 * @text X座標 (立ち絵5)
 * @desc 立ち絵5(FFFFF)で呼び出された時の表示位置(X)です。
 * @default 242
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param y5
 * @text Y座標 (立ち絵5)
 * @desc 立ち絵5(FFFFF)で呼び出された時の表示位置(Y)です。
 * @default 96
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param reverse
 * @text 立ち絵2, 4の左右反転
 * @desc 立ち絵2(FF)、立ち絵4(FFFF)で呼び出された時に
 * 立ち絵を左右反転させるかの設定です。
 * @default 1
 * @type select
 * @option 左右反転しない
 * @value 1
 * @option 左右反転する
 * @value -1
 *
 * @param scaleX
 * @text X拡大率
 * @desc 立ち絵の拡大率(X)です。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param scaleY
 * @text Y拡大率
 * @desc 立ち絵の拡大率(Y)です。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param opacity
 * @text 不透明度
 * @desc 立ち絵の不透明度(0～255)です。
 * @default 255
 * @type number
 * @min 0
 * @max 255
 *
 * @param blendMode
 * @text 合成方法
 * @desc 立ち絵の合成方法です。
 * @default 0
 * @type select
 * @option 通常
 * @value 0
 * @option 加算
 * @value 1
 * @option 除算
 * @value 2
 * @option スクリーン
 * @value 3
 */

(function () {
  "use strict";
  var pluginName = "LL_StandingPictureMV_Custom";

  var parameters = PluginManager.parameters(pluginName);
  // 切替効果
  var transitions = [
    null,
    Number(parameters["transition"] || 1),
    Number(parameters["transition2"] || 1),
    Number(parameters["transition3"] || 1),
    Number(parameters["transition4"] || 1),
    Number(parameters["transition5"] || 1),
  ];
  // ウィンドウ前面表示
  var foreFronts = [
    null,
    eval(parameters["foreFront"] || "false"),
    eval(parameters["foreFront2"] || "false"),
    eval(parameters["foreFront3"] || "false"),
    eval(parameters["foreFront4"] || "false"),
    eval(parameters["foreFront5"] || "false"),
  ];

  var focusToneAdjust = Number(parameters["focusToneAdjust"] || -96);
  var catheBootPicture = eval(parameters["catheBootPicture"] || "true");
  var sPictures = JSON.parse(parameters["sPictures"] || "null");
  var sPictureLists = [];
  if (sPictures) {
    sPictures.forEach(function (elm) {
      sPictureLists.push(JSON.parse(elm));
    });
  }

  //-----------------------------------------------------------------------------
  // PluginCommand (for MV)
  //

  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === pluginName) {
      switch (args[0]) {
        case "processChar":
          var text = args[1];
          exStandingPictureParseChar(text);

          // ゲームデータにプラグインデータがない場合の処理
          if (
            typeof $gameSystem._LL_StandingPicture_picture1.flipX ===
            "undefined"
          ) {
            $gameSystem._LL_StandingPicture_picture1.flipX = false;
            $gameSystem._LL_StandingPicture_picture2.flipX = false;
            $gameSystem._LL_StandingPicture_picture3.flipX = false;
            $gameSystem._LL_StandingPicture_picture4.flipX = false;
            $gameSystem._LL_StandingPicture_picture5.flipX = false;
          }
          if (
            typeof $gameSystem._LL_StandingPicture_picture1.transition ===
            "undefined"
          ) {
            $gameSystem._LL_StandingPicture_picture1.transition = "";
            $gameSystem._LL_StandingPicture_picture2.transition = "";
            $gameSystem._LL_StandingPicture_picture3.transition = "";
            $gameSystem._LL_StandingPicture_picture4.transition = "";
            $gameSystem._LL_StandingPicture_picture5.transition = "";
          }

          // 立ち絵表示状態を継続
          if ($gameSystem._LL_StandingPicture_picture1.showSPicture) {
            $gameSystem._LL_StandingPicture_picture1.refSPicture = true;
            $gameSystem._LL_StandingPicture_picture1.animationCount =
              animationFrame[
                $gameSystem._LL_StandingPicture_picture1.motionSPicture
              ];
          }
          if ($gameSystem._LL_StandingPicture_picture2.showSPicture) {
            $gameSystem._LL_StandingPicture_picture2.refSPicture = true;
            $gameSystem._LL_StandingPicture_picture2.animationCount =
              animationFrame[
                $gameSystem._LL_StandingPicture_picture2.motionSPicture
              ];
          }
          if ($gameSystem._LL_StandingPicture_picture3.showSPicture) {
            $gameSystem._LL_StandingPicture_picture3.refSPicture = true;
            $gameSystem._LL_StandingPicture_picture3.animationCount =
              animationFrame[
                $gameSystem._LL_StandingPicture_picture3.motionSPicture
              ];
          }
          if ($gameSystem._LL_StandingPicture_picture4.showSPicture) {
            $gameSystem._LL_StandingPicture_picture4.refSPicture = true;
            $gameSystem._LL_StandingPicture_picture4.animationCount =
              animationFrame[
                $gameSystem._LL_StandingPicture_picture4.motionSPicture
              ];
          }
          if ($gameSystem._LL_StandingPicture_picture5.showSPicture) {
            $gameSystem._LL_StandingPicture_picture5.refSPicture = true;
            $gameSystem._LL_StandingPicture_picture5.animationCount =
              animationFrame[
                $gameSystem._LL_StandingPicture_picture5.motionSPicture
              ];
          }
          if (!$gameSystem._LL_StandingPicture_holdSPicture) {
            $gameSystem._LL_StandingPicture_picture1.showSPicture = false;
            $gameSystem._LL_StandingPicture_picture2.showSPicture = false;
            $gameSystem._LL_StandingPicture_picture3.showSPicture = false;
            $gameSystem._LL_StandingPicture_picture4.showSPicture = false;
            $gameSystem._LL_StandingPicture_picture5.showSPicture = false;
            $gameSystem._LL_StandingPicture_picture1.motionSPicture = "";
            $gameSystem._LL_StandingPicture_picture2.motionSPicture = "";
            $gameSystem._LL_StandingPicture_picture3.motionSPicture = "";
            $gameSystem._LL_StandingPicture_picture4.motionSPicture = "";
            $gameSystem._LL_StandingPicture_picture5.motionSPicture = "";
            $gameSystem._LL_StandingPicture_picture1.flipX = false;
            $gameSystem._LL_StandingPicture_picture2.flipX = false;
            $gameSystem._LL_StandingPicture_picture3.flipX = false;
            $gameSystem._LL_StandingPicture_picture4.flipX = false;
            $gameSystem._LL_StandingPicture_picture5.flipX = false;
            $gameSystem._LL_StandingPicture_picture1.transition = "";
            $gameSystem._LL_StandingPicture_picture2.transition = "";
            $gameSystem._LL_StandingPicture_picture3.transition = "";
            $gameSystem._LL_StandingPicture_picture4.transition = "";
            $gameSystem._LL_StandingPicture_picture5.transition = "";
          }
          break;
        case "setEnabled":
          var enabled = eval(args[1] || "true");
          $gameSystem._StandingPictureDisabled = !enabled;
          break;
        case "setTone":
          var setTone = args[1].split(",");
          var pictureTone = [
            Number(setTone[0]),
            Number(setTone[1]),
            Number(setTone[2]),
            Number(setTone[3]),
          ];
          $gameSystem._StandingPictureTone = pictureTone;
          break;
      }
    }
  };

  // アニメーションフレーム数定義
  var animationFrame = {
    yes: 24,
    yesyes: 48,
    no: 24,
    noslow: 48,
    jump: 24,
    jumpjump: 48,
    jumploop: 48,
    shake: 1,
    shakeloop: 1,
    runleft: 1,
    runright: 1,
    noslowloop: 96,
    breathing: 96,
    breathing2: 96,
    huwahuwa: 192,
    //		"InL":        0,
    //		"InR":        0,
    //		"FadeIn":     0,

    //		"FadeL":      1,
    //		"FadeR":      1,
    //		"FadeOut":    1,
    //		"FadeDown":   1,
    Down: 1,
    //		"FlipX":      1,
    none: 0,
  };

  // フォーカス状態リセット用
  let focusReset = false;

  //-----------------------------------------------------------------------------
  // Game_System
  //
  // 立ち絵制御用の独自配列を追加定義します。

  var _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.apply(this, arguments);

    this.iniLLStandingPictures();
    this._LL_StandingPicture_battleCache = null;
  };

  Game_System.prototype.iniLLStandingPictures = function () {
    // 立ち絵1 (F)
    this._LL_StandingPicture_picture1 = {
      animationCount: 0,
      spriteSPicture: null,
      showSPicture: false,
      refSPicture: false,
      motionSPicture: "",
      flipX: false,
      transition: "",
    };
    // 立ち絵2 (FF)
    this._LL_StandingPicture_picture2 = {
      animationCount: 0,
      spriteSPicture: null,
      showSPicture: false,
      refSPicture: false,
      motionSPicture: "",
      flipX: false,
      transition: "",
    };
    // 立ち絵3 (FFF)
    this._LL_StandingPicture_picture3 = {
      animationCount: 0,
      spriteSPicture: null,
      showSPicture: false,
      refSPicture: false,
      motionSPicture: "",
      flipX: false,
      transition: "",
    };
    // 立ち絵4 (FFFF)
    this._LL_StandingPicture_picture4 = {
      animationCount: 0,
      spriteSPicture: null,
      showSPicture: false,
      refSPicture: false,
      motionSPicture: "",
      flipX: false,
      transition: "",
    };
    // 立ち絵5 (FFFFF)
    this._LL_StandingPicture_picture5 = {
      animationCount: 0,
      spriteSPicture: null,
      showSPicture: false,
      refSPicture: false,
      motionSPicture: "",
      flipX: false,
      transition: "",
    };
    // フォーカス設定
    this._LL_StandingPicture_focusSPicture = {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    };
    // ホールド設定
    this._LL_StandingPicture_holdSPicture = false;
  };

  Game_System.prototype.inBattleMakeCacheLLStandingPictures = function () {
    if (!this._LL_StandingPicture_battleCache) {
      this._LL_StandingPicture_battleCache = {
        picture1: this._LL_StandingPicture_picture1,
        picture2: this._LL_StandingPicture_picture2,
        picture3: this._LL_StandingPicture_picture3,
        picture4: this._LL_StandingPicture_picture4,
        picture5: this._LL_StandingPicture_picture5,
        focusSPicture: this._LL_StandingPicture_focusSPicture,
        holdSPicture: this._LL_StandingPicture_holdSPicture,
      };
    }
    this.iniLLStandingPictures();
  };

  Game_System.prototype.refreshCacheLLStandingPictures = function () {
    if (this._LL_StandingPicture_battleCache) {
      this._LL_StandingPicture_picture1 =
        this._LL_StandingPicture_battleCache.picture1;
      this._LL_StandingPicture_picture2 =
        this._LL_StandingPicture_battleCache.picture2;
      this._LL_StandingPicture_picture3 =
        this._LL_StandingPicture_battleCache.picture3;
      this._LL_StandingPicture_picture4 =
        this._LL_StandingPicture_battleCache.picture4;
      this._LL_StandingPicture_picture5 =
        this._LL_StandingPicture_battleCache.picture5;
      this._LL_StandingPicture_focusSPicture =
        this._LL_StandingPicture_battleCache.focusSPicture;
      this._LL_StandingPicture_holdSPicture =
        this._LL_StandingPicture_battleCache.holdSPicture;
    }
    this._LL_StandingPicture_battleCache = null;
  };

  //-----------------------------------------------------------------------------

  // M[n]～MMMM[n]タグを解析して拡張するモノ
  var motionTagManager = function (param, sNumber) {
    var pLL_StandingPicture_picture = null;
    //var pSprite = null;
    if (sNumber == 1) {
      pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture1;
      //pSprite = elm._spSprite1;
    }
    if (sNumber == 2) {
      pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture2;
      //pSprite = elm._spSprite2;
    }
    if (sNumber == 3) {
      pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture3;
      //pSprite = elm._spSprite3;
    }
    if (sNumber == 4) {
      pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture4;
      //pSprite = elm._spSprite4;
    }
    if (sNumber == 5) {
      pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture5;
      //pSprite = elm._spSprite5;
    }

    if (param == "InL" || param == "InR" || param == "FadeIn") {
      pLL_StandingPicture_picture.transition = param;

      // 既に登場していても強制的に再表示
      pLL_StandingPicture_picture.showSPicture = true;
      pLL_StandingPicture_picture.refSPicture = true;
    }

    if (
      param == "FadeL" ||
      param == "FadeR" ||
      param == "FadeOut" ||
      param == "FadeDown"
    ) {
      pLL_StandingPicture_picture.transition = param;
      pLL_StandingPicture_picture.fadeOut = true;
      console.log(
        "sFadeL" + pLL_StandingPicture_picture.spriteSPicture + ":" + sNumber
      );
      //pSprite.closing = true;
    }
  };
  //-----------------------------------------------------------------------------
  // ExStandingPictureParseChar
  //
  // 立ち絵制御文字を解読する関数です。

  var exStandingPictureParseChar = function (text) {
    text = text.replace(
      /\\V\[(\d+)\]/gi,
      function () {
        return $gameVariables.value(parseInt(arguments[1]));
      }.bind(this)
    );

    // 専用制御文字を取得 (\F[s])
    var sPictureNumber = null;
    var processEscapeNumber = text.match(/\\F\[(\w+)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        sPictureNumber = processEscapeNumber[1];
      }
    }
    // 専用制御文字を取得 (\FF[s])
    var sPictureNumber2 = null;
    processEscapeNumber = text.match(/\\FF\[(\w+)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        sPictureNumber2 = processEscapeNumber[1];
      }
    }
    // 専用制御文字を取得 (\FFF[s])
    var sPictureNumber3 = null;
    processEscapeNumber = text.match(/\\FFF\[(\w+)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        sPictureNumber3 = processEscapeNumber[1];
      }
    }
    // 専用制御文字を取得 (\FFFF[s])
    var sPictureNumber4 = null;
    processEscapeNumber = text.match(/\\FFFF\[(\w+)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        sPictureNumber4 = processEscapeNumber[1];
      }
    }
    // 専用制御文字を取得 (\FFFFF[s])
    var sPictureNumber5 = null;
    processEscapeNumber = text.match(/\\FFFFF\[(\w+)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        sPictureNumber5 = processEscapeNumber[1];
      }
    }
    // 専用制御文字を取得 (\M[s])
    var sPictureMotion = null;
    processEscapeNumber = text.match(/\\M\[(\w+)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        sPictureMotion = processEscapeNumber[1];
        motionTagManager(sPictureMotion, 1);
      }
    }
    // 専用制御文字を取得 (\MM[s])
    var sPictureMotion2 = null;
    processEscapeNumber = text.match(/\\MM\[(\w+)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        sPictureMotion2 = processEscapeNumber[1];
        motionTagManager(sPictureMotion2, 2);
      }
    }
    // 専用制御文字を取得 (\MMM[s])
    var sPictureMotion3 = null;
    processEscapeNumber = text.match(/\\MMM\[(\w+)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        sPictureMotion3 = processEscapeNumber[1];
        motionTagManager(sPictureMotion3, 3);
      }
    }
    // 専用制御文字を取得 (\MMMM[s])
    var sPictureMotion4 = null;
    processEscapeNumber = text.match(/\\MMMM\[(\w+)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        sPictureMotion4 = processEscapeNumber[1];
        motionTagManager(sPictureMotion4, 4);
      }
    }
    // 専用制御文字を取得 (\MMMMM[s])
    var sPictureMotion5 = null;
    processEscapeNumber = text.match(/\\MMMMM\[(\w+)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        sPictureMotion5 = processEscapeNumber[1];
        motionTagManager(sPictureMotion5, 5);
      }
    }
    // 専用制御文字を取得 (\AA[s])
    var focusSPicture = false;
    processEscapeNumber = text.match(/\\AA\[(F|1)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        focusSPicture = true;
      }
    }
    var focusSPicture2 = false;
    processEscapeNumber = text.match(/\\AA\[(FF|2)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        focusSPicture2 = true;
      }
    }
    var focusSPicture3 = false;
    processEscapeNumber = text.match(/\\AA\[(FFF|3)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        focusSPicture3 = true;
      }
    }
    var focusSPicture4 = false;
    processEscapeNumber = text.match(/\\AA\[(FFFF|4)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        focusSPicture4 = true;
      }
    }
    var focusSPicture5 = false;
    processEscapeNumber = text.match(/\\AA\[(FFFFF|5)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        focusSPicture5 = true;
      }
    }
    var focusSPictureAllout = false;
    processEscapeNumber = text.match(/\\AA\[(N|0)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        focusSPictureAllout = true;
      }
    }
    $gameSystem._LL_StandingPicture_focusSPicture = {
      0: focusSPictureAllout,
      1: focusSPicture,
      2: focusSPicture2,
      3: focusSPicture3,
      4: focusSPicture4,
      5: focusSPicture5,
    };
    // フォーカス状態リセット (\AA[R])
    processEscapeNumber = text.match(/\\AA\[(R|0)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        focusReset = true;
      }
    }
    // 専用制御文字を取得 (\FH[s])
    var sPictureHold = null;
    processEscapeNumber = text.match(/\\FH\[(\w+)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        sPictureHold = processEscapeNumber[1];
      }
    }

    // 専用制御文字を取得 (\FX[s])
    $gameSystem._LL_StandingPicture_picture1.flipX = false;
    processEscapeNumber = text.match(/\\FX\[(F|1)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        $gameSystem._LL_StandingPicture_picture1.flipX = true;
        //console.log("ok");
      }
    }
    $gameSystem._LL_StandingPicture_picture2.flipX = false;
    processEscapeNumber = text.match(/\\FX\[(FF|2)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        $gameSystem._LL_StandingPicture_picture2.flipX = true;
      }
    }
    $gameSystem._LL_StandingPicture_picture3.flipX = false;
    processEscapeNumber = text.match(/\\FX\[(FFF|3)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        $gameSystem._LL_StandingPicture_picture3.flipX = true;
      }
    }
    $gameSystem._LL_StandingPicture_picture4.flipX = false;
    processEscapeNumber = text.match(/\\FX\[(FFFF|4)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        $gameSystem._LL_StandingPicture_picture4.flipX = true;
      }
    }
    $gameSystem._LL_StandingPicture_picture5.flipX = false;
    processEscapeNumber = text.match(/\\FX\[(FFFFF|5)\]/);
    if (processEscapeNumber) {
      if (processEscapeNumber[1]) {
        $gameSystem._LL_StandingPicture_picture5.flipX = true;
      }
    }

    // 立ち絵1を更新
    if (sPictureNumber) {
      var sPicture = sPictureLists.filter(function (item, index) {
        if (String(item.id) == sPictureNumber) return true;
      });
      $gameSystem._LL_StandingPicture_picture1.spriteSPicture = sPicture[0];
      if (sPicture[0]) {
        $gameSystem._LL_StandingPicture_picture1.showSPicture = true;
        $gameSystem._LL_StandingPicture_picture1.refSPicture = true;
      } else {
        $gameSystem._LL_StandingPicture_picture1.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture1.refSPicture = false;
      }
      // 再生モーション定義
      $gameSystem._LL_StandingPicture_picture1.motionSPicture = sPictureMotion
        ? sPictureMotion
        : "none";
      $gameSystem._LL_StandingPicture_picture1.animationCount =
        animationFrame[$gameSystem._LL_StandingPicture_picture1.motionSPicture];
    } else {
      if (!$gameSystem._LL_StandingPicture_holdSPicture) {
        $gameSystem._LL_StandingPicture_picture1.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture1.motionSPicture = "";
      } else if (sPictureMotion) {
        // 再生モーション更新
        $gameSystem._LL_StandingPicture_picture1.motionSPicture =
          sPictureMotion;
        $gameSystem._LL_StandingPicture_picture1.animationCount =
          animationFrame[
            $gameSystem._LL_StandingPicture_picture1.motionSPicture
          ];
      }
    }
    // 立ち絵2を更新
    if (sPictureNumber2) {
      var sPicture2 = sPictureLists.filter(function (item, index) {
        if (String(item.id) == sPictureNumber2) return true;
      });
      $gameSystem._LL_StandingPicture_picture2.spriteSPicture = sPicture2[0];
      if (sPicture2[0]) {
        $gameSystem._LL_StandingPicture_picture2.showSPicture = true;
        $gameSystem._LL_StandingPicture_picture2.refSPicture = true;
      } else {
        $gameSystem._LL_StandingPicture_picture2.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture2.refSPicture = false;
      }
      // 再生モーション定義
      $gameSystem._LL_StandingPicture_picture2.motionSPicture = sPictureMotion2
        ? sPictureMotion2
        : "none";
      $gameSystem._LL_StandingPicture_picture2.animationCount =
        animationFrame[$gameSystem._LL_StandingPicture_picture2.motionSPicture];
    } else {
      if (!$gameSystem._LL_StandingPicture_holdSPicture) {
        $gameSystem._LL_StandingPicture_picture2.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture2.motionSPicture = "";
      } else if (sPictureMotion2) {
        // 再生モーション更新
        $gameSystem._LL_StandingPicture_picture2.motionSPicture =
          sPictureMotion2;
        $gameSystem._LL_StandingPicture_picture2.animationCount =
          animationFrame[
            $gameSystem._LL_StandingPicture_picture2.motionSPicture
          ];
      }
    }
    // 立ち絵3を更新
    if (sPictureNumber3) {
      var sPicture3 = sPictureLists.filter(function (item, index) {
        if (String(item.id) == sPictureNumber3) return true;
      });
      $gameSystem._LL_StandingPicture_picture3.spriteSPicture = sPicture3[0];
      if (sPicture3[0]) {
        $gameSystem._LL_StandingPicture_picture3.showSPicture = true;
        $gameSystem._LL_StandingPicture_picture3.refSPicture = true;
      } else {
        $gameSystem._LL_StandingPicture_picture3.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture3.refSPicture = false;
      }
      // 再生モーション定義
      $gameSystem._LL_StandingPicture_picture3.motionSPicture = sPictureMotion3
        ? sPictureMotion3
        : "none";
      $gameSystem._LL_StandingPicture_picture3.animationCount =
        animationFrame[$gameSystem._LL_StandingPicture_picture3.motionSPicture];
    } else {
      if (!$gameSystem._LL_StandingPicture_holdSPicture) {
        $gameSystem._LL_StandingPicture_picture3.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture3.motionSPicture = "";
      } else if (sPictureMotion3) {
        // 再生モーション更新
        $gameSystem._LL_StandingPicture_picture3.motionSPicture =
          sPictureMotion3;
        $gameSystem._LL_StandingPicture_picture3.animationCount =
          animationFrame[
            $gameSystem._LL_StandingPicture_picture3.motionSPicture
          ];
      }
    }
    // 立ち絵4を更新
    if (sPictureNumber4) {
      var sPicture4 = sPictureLists.filter(function (item, index) {
        if (String(item.id) == sPictureNumber4) return true;
      });
      $gameSystem._LL_StandingPicture_picture4.spriteSPicture = sPicture4[0];
      if (sPicture4[0]) {
        $gameSystem._LL_StandingPicture_picture4.showSPicture = true;
        $gameSystem._LL_StandingPicture_picture4.refSPicture = true;
      } else {
        $gameSystem._LL_StandingPicture_picture4.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture4.refSPicture = false;
      }
      // 再生モーション定義
      $gameSystem._LL_StandingPicture_picture4.motionSPicture = sPictureMotion4
        ? sPictureMotion4
        : "none";
      $gameSystem._LL_StandingPicture_picture4.animationCount =
        animationFrame[$gameSystem._LL_StandingPicture_picture4.motionSPicture];
    } else {
      if (!$gameSystem._LL_StandingPicture_holdSPicture) {
        $gameSystem._LL_StandingPicture_picture4.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture4.motionSPicture = "";
      } else if (sPictureMotion4) {
        // 再生モーション更新
        $gameSystem._LL_StandingPicture_picture4.motionSPicture =
          sPictureMotion4;
        $gameSystem._LL_StandingPicture_picture4.animationCount =
          animationFrame[
            $gameSystem._LL_StandingPicture_picture4.motionSPicture
          ];
      }
    }
    // 立ち絵5を更新
    if (sPictureNumber5) {
      var sPicture5 = sPictureLists.filter(function (item, index) {
        if (String(item.id) == sPictureNumber5) return true;
      });
      $gameSystem._LL_StandingPicture_picture5.spriteSPicture = sPicture5[0];
      if (sPicture5[0]) {
        $gameSystem._LL_StandingPicture_picture5.showSPicture = true;
        $gameSystem._LL_StandingPicture_picture5.refSPicture = true;
      } else {
        $gameSystem._LL_StandingPicture_picture5.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture5.refSPicture = false;
      }
      // 再生モーション定義
      $gameSystem._LL_StandingPicture_picture5.motionSPicture = sPictureMotion5
        ? sPictureMotion5
        : "none";
      $gameSystem._LL_StandingPicture_picture5.animationCount =
        animationFrame[$gameSystem._LL_StandingPicture_picture5.motionSPicture];
    } else {
      if (!$gameSystem._LL_StandingPicture_holdSPicture) {
        $gameSystem._LL_StandingPicture_picture5.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture5.motionSPicture = "";
      } else if (sPictureMotion5) {
        // 再生モーション更新
        $gameSystem._LL_StandingPicture_picture5.motionSPicture =
          sPictureMotion5;
        $gameSystem._LL_StandingPicture_picture5.animationCount =
          animationFrame[
            $gameSystem._LL_StandingPicture_picture5.motionSPicture
          ];
      }
    }

    // ホールドモードを切替
    if (sPictureHold === "ON") {
      $gameSystem._LL_StandingPicture_holdSPicture = true;
    } else if (sPictureHold === "OFF") {
      $gameSystem._LL_StandingPicture_holdSPicture = false;
    }
  };

  //-----------------------------------------------------------------------------
  // ExStandingPicture
  //
  // 立ち絵を表示する独自のクラスを追加定義します。

  class ExStandingPicture {
    static create(elm) {
      // 立ち絵1
      elm._spSprite = new Sprite_LL_SPicture();
      elm.addChildAt(
        elm._spSprite,
        elm.children.indexOf(
          foreFronts[1] ? elm._windowLayer : elm._spriteset
        ) + 1
      );
      // 立ち絵2
      elm._spSprite2 = new Sprite_LL_SPicture();
      elm.addChildAt(
        elm._spSprite2,
        elm.children.indexOf(
          foreFronts[2] ? elm._windowLayer : elm._spriteset
        ) + 1
      );
      // 立ち絵3
      elm._spSprite3 = new Sprite_LL_SPicture();
      elm.addChildAt(
        elm._spSprite3,
        elm.children.indexOf(
          foreFronts[3] ? elm._windowLayer : elm._spriteset
        ) + 1
      );
      // 立ち絵4
      elm._spSprite4 = new Sprite_LL_SPicture();
      elm.addChildAt(
        elm._spSprite4,
        elm.children.indexOf(
          foreFronts[4] ? elm._windowLayer : elm._spriteset
        ) + 1
      );
      // 立ち絵5
      elm._spSprite5 = new Sprite_LL_SPicture();
      elm.addChildAt(
        elm._spSprite5,
        elm.children.indexOf(
          foreFronts[5] ? elm._windowLayer : elm._spriteset
        ) + 1
      );

      elm._spSprites = [
        elm._spSprite,
        elm._spSprite2,
        elm._spSprite3,
        elm._spSprite4,
        elm._spSprite5,
      ];
      for (var i = 0; i < elm._spSprites.length; i++) {
        elm._spSprites[i].orgNo = i + 1;
        //elm._spSprites[i].z = (i+1);
      }

      // ※下記は念のためMVでは無効 (v2.5.1)

      // 立ち絵画像を事前読み込み
      // if (catheBootPicture) {
      // 	sPictureLists.forEach(function(elm) {
      // 		ImageManager.loadPicture(elm.imageName);
      // 	});
      // }

      // 旧Ver.のセーブデータ読み込み対策
      if (typeof $gameSystem._LL_StandingPicture_picture1 === "undefined") {
        $gameSystem.iniLLStandingPictures();
      }

      // 戦闘時判定
      if (SceneManager._scene.constructor === Scene_Battle) {
        // 表示中の立ち絵を消去
        $gameSystem.inBattleMakeCacheLLStandingPictures();
      } else {
        $gameSystem.refreshCacheLLStandingPictures();
      }

      // 立ち絵表示状態を継続
      if ($gameSystem._LL_StandingPicture_picture1.showSPicture) {
        $gameSystem._LL_StandingPicture_picture1.refSPicture = true;
        $gameSystem._LL_StandingPicture_picture1.animationCount =
          animationFrame[
            $gameSystem._LL_StandingPicture_picture1.motionSPicture
          ];
      }
      if ($gameSystem._LL_StandingPicture_picture2.showSPicture) {
        $gameSystem._LL_StandingPicture_picture2.refSPicture = true;
        $gameSystem._LL_StandingPicture_picture2.animationCount =
          animationFrame[
            $gameSystem._LL_StandingPicture_picture2.motionSPicture
          ];
      }
      if ($gameSystem._LL_StandingPicture_picture3.showSPicture) {
        $gameSystem._LL_StandingPicture_picture3.refSPicture = true;
        $gameSystem._LL_StandingPicture_picture3.animationCount =
          animationFrame[
            $gameSystem._LL_StandingPicture_picture3.motionSPicture
          ];
      }
      if ($gameSystem._LL_StandingPicture_picture4.showSPicture) {
        $gameSystem._LL_StandingPicture_picture4.refSPicture = true;
        $gameSystem._LL_StandingPicture_picture4.animationCount =
          animationFrame[
            $gameSystem._LL_StandingPicture_picture4.motionSPicture
          ];
      }
      if ($gameSystem._LL_StandingPicture_picture5.showSPicture) {
        $gameSystem._LL_StandingPicture_picture5.refSPicture = true;
        $gameSystem._LL_StandingPicture_picture5.animationCount =
          animationFrame[
            $gameSystem._LL_StandingPicture_picture5.motionSPicture
          ];
      }
      //console.log("elm.children"+elm.children);
    }

    static update(elm) {
      // 立ち絵を非表示に設定している場合、処理を中断
      if ($gameSystem._StandingPictureDisabled) {
        elm._spSprite.opacity = 0;
        elm._spSprite2.opacity = 0;
        elm._spSprite3.opacity = 0;
        elm._spSprite4.opacity = 0;
        elm._spSprite5.opacity = 0;
        return;
      }

      // 立ち絵1ピクチャ作成
      if (
        $gameSystem._LL_StandingPicture_picture1.spriteSPicture &&
        $gameSystem._LL_StandingPicture_picture1.refSPicture
      ) {
        this.refresh(
          elm._spSprite,
          $gameSystem._LL_StandingPicture_picture1.spriteSPicture,
          1
        );
        $gameSystem._LL_StandingPicture_picture1.refSPicture = false;
      }
      // 立ち絵2ピクチャ作成
      if (
        $gameSystem._LL_StandingPicture_picture2.spriteSPicture &&
        $gameSystem._LL_StandingPicture_picture2.refSPicture
      ) {
        this.refresh(
          elm._spSprite2,
          $gameSystem._LL_StandingPicture_picture2.spriteSPicture,
          2
        );
        $gameSystem._LL_StandingPicture_picture2.refSPicture = false;
      }
      // 立ち絵3ピクチャ作成
      if (
        $gameSystem._LL_StandingPicture_picture3.spriteSPicture &&
        $gameSystem._LL_StandingPicture_picture3.refSPicture
      ) {
        this.refresh(
          elm._spSprite3,
          $gameSystem._LL_StandingPicture_picture3.spriteSPicture,
          3
        );
        $gameSystem._LL_StandingPicture_picture3.refSPicture = false;
      }
      // 立ち絵4ピクチャ作成
      if (
        $gameSystem._LL_StandingPicture_picture4.spriteSPicture &&
        $gameSystem._LL_StandingPicture_picture4.refSPicture
      ) {
        this.refresh(
          elm._spSprite4,
          $gameSystem._LL_StandingPicture_picture4.spriteSPicture,
          4
        );
        $gameSystem._LL_StandingPicture_picture4.refSPicture = false;
      }
      // 立ち絵5ピクチャ作成
      if (
        $gameSystem._LL_StandingPicture_picture5.spriteSPicture &&
        $gameSystem._LL_StandingPicture_picture5.refSPicture
      ) {
        this.refresh(
          elm._spSprite5,
          $gameSystem._LL_StandingPicture_picture5.spriteSPicture,
          5
        );
        $gameSystem._LL_StandingPicture_picture5.refSPicture = false;
      }

      // フォーカス状態リセット
      if (focusReset) {
        elm._spSprite.setBlendColor([0, 0, 0, 0]);
        elm._spSprite2.setBlendColor([0, 0, 0, 0]);
        elm._spSprite3.setBlendColor([0, 0, 0, 0]);
        elm._spSprite4.setBlendColor([0, 0, 0, 0]);
        elm._spSprite5.setBlendColor([0, 0, 0, 0]);
        focusReset = false;
      }

      for (var i = 0; i < elm._spSprites.length; i++) {
        for (var j = i + 1; j < elm._spSprites.length; j++) {
          if (
            elm.children.indexOf(elm._spSprites[i]) <
            elm.children.indexOf(elm._spSprites[j])
          ) {
            elm.swapChildren(elm._spSprites[i], elm._spSprites[j]);
          }
        }
        //elm._spSprites[i].z = elm._spSprites[i].orgNo;
      }

      // なぜか$gameSystem._LL_StandingPicture_focusSPictureが連想配列なのでこちらで処理
      for (var i in $gameSystem._LL_StandingPicture_focusSPicture) {
        if (i == 0 || i == 1)
          //0は全部対象でない、1はそもそも一番上にいるので不要
          continue;

        if ($gameSystem._LL_StandingPicture_focusSPicture[i] == true) {
          elm.swapChildren(elm._spSprite, elm._spSprites[i - 1]);
        }
      }

      // フォーカス処理
      if (
        $gameSystem._LL_StandingPicture_focusSPicture[0] !== false ||
        $gameSystem._LL_StandingPicture_focusSPicture[1] !== false ||
        $gameSystem._LL_StandingPicture_focusSPicture[2] !== false ||
        $gameSystem._LL_StandingPicture_focusSPicture[3] !== false ||
        $gameSystem._LL_StandingPicture_focusSPicture[4] !== false ||
        $gameSystem._LL_StandingPicture_focusSPicture[5] !== false
      ) {
        // フォーカス状態を一度リフレッシュ
        /*
				elm._spSprite.setBlendColor([0, 0, 0, 0]);
				elm._spSprite2.setBlendColor([0, 0, 0, 0]);
				elm._spSprite3.setBlendColor([0, 0, 0, 0]);
				elm._spSprite4.setBlendColor([0, 0, 0, 0]);
				elm._spSprite5.setBlendColor([0, 0, 0, 0]);
				*/
        if (
          $gameSystem._LL_StandingPicture_focusSPicture[1] === false ||
          $gameSystem._LL_StandingPicture_focusSPicture[0] === true
        ) {
          elm._spSprite.setBlendColor([0, 0, 0, focusToneAdjust * -1]);
          //console.log("_LL_StandingPicture_focusSPicture1"+$gameSystem._LL_StandingPicture_focusSPicture[1]);
        } else {
          elm._spSprite.setBlendColor([0, 0, 0, 0]);
        }

        if (
          $gameSystem._LL_StandingPicture_focusSPicture[2] === false ||
          $gameSystem._LL_StandingPicture_focusSPicture[0] === true
        ) {
          elm._spSprite2.setBlendColor([0, 0, 20, focusToneAdjust * -1]);
          //console.log("_LL_StandingPicture_focusSPicture2"+$gameSystem._LL_StandingPicture_focusSPicture[2]);
        } else {
          elm._spSprite2.setBlendColor([0, 0, 0, 0]);
        }
        if (
          $gameSystem._LL_StandingPicture_focusSPicture[3] === false ||
          $gameSystem._LL_StandingPicture_focusSPicture[0] === true
        ) {
          //console.log("_LL_StandingPicture_focusSPicture3"+$gameSystem._LL_StandingPicture_focusSPicture[3]);
          //console.log("focusToneAdjust"+focusToneAdjust);
          elm._spSprite3.setBlendColor([0, 0, 0, focusToneAdjust * -1]);
        } else {
          elm._spSprite3.setBlendColor([0, 0, 0, 0]);
        }
        if (
          $gameSystem._LL_StandingPicture_focusSPicture[4] === false ||
          $gameSystem._LL_StandingPicture_focusSPicture[0] === true
        ) {
          elm._spSprite4.setBlendColor([0, 0, 0, focusToneAdjust * -1]);
          //console.log("_LL_StandingPicture_focusSPicture4"+$gameSystem._LL_StandingPicture_focusSPicture[4]);
        } else {
          elm._spSprite4.setBlendColor([0, 0, 0, 0]);
        }
        if (
          $gameSystem._LL_StandingPicture_focusSPicture[5] === false ||
          $gameSystem._LL_StandingPicture_focusSPicture[0] === true
        ) {
          elm._spSprite5.setBlendColor([0, 0, 0, focusToneAdjust * -1]);
          //console.log("_LL_StandingPicture_focusSPicture5"+$gameSystem._LL_StandingPicture_focusSPicture[5]);
        } else {
          elm._spSprite5.setBlendColor([0, 0, 0, 0]);
        }
      }

      if ($gameSystem._LL_StandingPicture_picture1.fadeOut) {
        $gameSystem._LL_StandingPicture_picture1.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture1.fadeOut = false;
      }
      if ($gameSystem._LL_StandingPicture_picture2.fadeOut) {
        $gameSystem._LL_StandingPicture_picture2.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture2.fadeOut = false;
      }
      if ($gameSystem._LL_StandingPicture_picture3.fadeOut) {
        $gameSystem._LL_StandingPicture_picture3.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture3.fadeOut = false;
      }
      if ($gameSystem._LL_StandingPicture_picture4.fadeOut) {
        $gameSystem._LL_StandingPicture_picture4.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture4.fadeOut = false;
      }
      if ($gameSystem._LL_StandingPicture_picture5.fadeOut) {
        $gameSystem._LL_StandingPicture_picture5.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture5.fadeOut = false;
      }

      //console.log("showSPicture"+$gameSystem._LL_StandingPicture_picture2.showSPicture);
      // フェード処理
      if ($gameSystem._LL_StandingPicture_picture1.showSPicture) {
        this.fadeIn(
          elm._spSprite,
          $gameSystem._LL_StandingPicture_picture1.spriteSPicture,
          1
        );
      } else {
        this.fadeOut(
          elm._spSprite,
          $gameSystem._LL_StandingPicture_picture1.spriteSPicture,
          1
        );
      }
      if ($gameSystem._LL_StandingPicture_picture2.showSPicture) {
        this.fadeIn(
          elm._spSprite2,
          $gameSystem._LL_StandingPicture_picture2.spriteSPicture,
          2
        );
      } else {
        this.fadeOut(
          elm._spSprite2,
          $gameSystem._LL_StandingPicture_picture2.spriteSPicture,
          2
        );
      }
      if ($gameSystem._LL_StandingPicture_picture3.showSPicture) {
        this.fadeIn(
          elm._spSprite3,
          $gameSystem._LL_StandingPicture_picture3.spriteSPicture,
          3
        );
      } else {
        this.fadeOut(
          elm._spSprite3,
          $gameSystem._LL_StandingPicture_picture3.spriteSPicture,
          3
        );
      }
      if ($gameSystem._LL_StandingPicture_picture4.showSPicture) {
        this.fadeIn(
          elm._spSprite4,
          $gameSystem._LL_StandingPicture_picture4.spriteSPicture,
          4
        );
      } else {
        this.fadeOut(
          elm._spSprite4,
          $gameSystem._LL_StandingPicture_picture4.spriteSPicture,
          4
        );
      }
      //console.log("showSPicture"+$gameSystem._LL_StandingPicture_picture5.showSPicture);
      //console.log("showSPicture"+elm._spSprite5);
      if ($gameSystem._LL_StandingPicture_picture5.showSPicture) {
        this.fadeIn(
          elm._spSprite5,
          $gameSystem._LL_StandingPicture_picture5.spriteSPicture,
          5
        );
      } else {
        this.fadeOut(
          elm._spSprite5,
          $gameSystem._LL_StandingPicture_picture5.spriteSPicture,
          5
        );
      }

      //console.log("立ち絵モーション再生"+$gameSystem._LL_StandingPicture_focusSPicture[1]);
      // 立ち絵モーション再生
      if (
        !elm._spSprite.opening &&
        !elm._spSprite.closing &&
        $gameSystem._LL_StandingPicture_picture1.animationCount > 0
      ) {
        $gameSystem._LL_StandingPicture_picture1.animationCount =
          this.animation(
            elm._spSprite,
            $gameSystem._LL_StandingPicture_picture1.motionSPicture,
            $gameSystem._LL_StandingPicture_picture1.animationCount,
            $gameSystem._LL_StandingPicture_picture1.spriteSPicture,
            1
          );
      }
      if (
        !elm._spSprite2.opening &&
        !elm._spSprite2.closing &&
        $gameSystem._LL_StandingPicture_picture2.animationCount > 0
      ) {
        $gameSystem._LL_StandingPicture_picture2.animationCount =
          this.animation(
            elm._spSprite2,
            $gameSystem._LL_StandingPicture_picture2.motionSPicture,
            $gameSystem._LL_StandingPicture_picture2.animationCount,
            $gameSystem._LL_StandingPicture_picture2.spriteSPicture,
            2
          );
      }
      if (
        !elm._spSprite3.opening &&
        !elm._spSprite3.closing &&
        $gameSystem._LL_StandingPicture_picture3.animationCount > 0
      ) {
        $gameSystem._LL_StandingPicture_picture3.animationCount =
          this.animation(
            elm._spSprite3,
            $gameSystem._LL_StandingPicture_picture3.motionSPicture,
            $gameSystem._LL_StandingPicture_picture3.animationCount,
            $gameSystem._LL_StandingPicture_picture3.spriteSPicture,
            3
          );
      }
      if (
        !elm._spSprite4.opening &&
        !elm._spSprite4.closing &&
        $gameSystem._LL_StandingPicture_picture4.animationCount > 0
      ) {
        $gameSystem._LL_StandingPicture_picture4.animationCount =
          this.animation(
            elm._spSprite4,
            $gameSystem._LL_StandingPicture_picture4.motionSPicture,
            $gameSystem._LL_StandingPicture_picture4.animationCount,
            $gameSystem._LL_StandingPicture_picture4.spriteSPicture,
            4
          );
      }
      if (
        !elm._spSprite5.opening &&
        !elm._spSprite5.closing &&
        $gameSystem._LL_StandingPicture_picture5.animationCount > 0
      ) {
        $gameSystem._LL_StandingPicture_picture5.animationCount =
          this.animation(
            elm._spSprite5,
            $gameSystem._LL_StandingPicture_picture5.motionSPicture,
            $gameSystem._LL_StandingPicture_picture5.animationCount,
            $gameSystem._LL_StandingPicture_picture5.spriteSPicture,
            5
          );
      }
    }

    static refresh(sSprite, sPicture, sNumber) {
      //if(sNumber==2)
      //sSprite.z=100;
      //console.log(":"+ sSprite.z);
      var flipX = false;
      var transition = "";
      var pLL_StandingPicture_picture = null;
      if (sNumber == 1) {
        pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture1;
      }
      if (sNumber == 2) {
        pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture2;
      }
      if (sNumber == 3) {
        pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture3;
      }
      if (sNumber == 4) {
        pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture4;
      }
      if (sNumber == 5) {
        pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture5;
      }
      flipX = pLL_StandingPicture_picture.flipX;
      transition = pLL_StandingPicture_picture.transition;

      sSprite.setPicture(sPicture);
      sSprite.showing = false;
      var calcScaleX = Number(sPicture.scaleX);
      var calcScaleY = Number(sPicture.scaleY);
      // 左右反転させる場合 (立ち絵2, 4)
      //if (sNumber == 2 || sNumber == 4) calcScaleX *= Number(sPicture.reverse);
      if (flipX) {
        //sPicture.reverse = Number(sPicture.reverse) * -1;
        calcScaleX *= -1;
      }
      //console.log(sPicture.flipX);
      //console.log($gameSystem._LL_StandingPicture_picture1);
      // 画像が読み込まれたあとに実行
      sSprite.bitmap.addLoadListener(
        function () {
          /*if (Number(sPicture.origin) == 0) {
					// 左上原点
					if (sNumber == 1) {
						sSprite.x = Number(sPicture.x);
						sSprite.y = Number(sPicture.y);
						sSprite.originX = Number(sPicture.x);
						sSprite.originY = Number(sPicture.y);
					}
					if (sNumber == 2) {
						sSprite.x = Number(sPicture.x2);
						sSprite.y = Number(sPicture.y2);
						sSprite.originX = Number(sPicture.x2);
						sSprite.originY = Number(sPicture.y2);
					}
					if (sNumber == 3) {
						sSprite.x = Number(sPicture.x3);
						sSprite.y = Number(sPicture.y3);
						sSprite.originX = Number(sPicture.x3);
						sSprite.originY = Number(sPicture.y3);
					}
					if (sNumber == 4) {
						sSprite.x = Number(sPicture.x4);
						sSprite.y = Number(sPicture.y4);
						sSprite.originX = Number(sPicture.x4);
						sSprite.originY = Number(sPicture.y4);
					}
					if (sNumber == 5) {
						sSprite.x = Number(sPicture.x5);
						sSprite.y = Number(sPicture.y5);
						sSprite.originX = Number(sPicture.x5);
						sSprite.originY = Number(sPicture.y5);
					}
					if (sNumber >= 1 && sNumber <= 5 && flipX)
					{
						//console.log(sSprite.width * calcScaleX / 100)*Number(sPicture.reverse);
						sSprite.x += (sSprite.width * calcScaleX / 100)*Number(sPicture.reverse);
						sSprite.originX += (sSprite.width * calcScaleX / 100)*Number(sPicture.reverse);
					}
				} else {*/
          // 中央原点
          if (sNumber == 1) {
            sSprite.x =
              Number(sPicture.x) - (sSprite.width * calcScaleX) / 100 / 2;
            sSprite.y =
              Number(sPicture.y) - (sSprite.height * calcScaleY) / 100 / 2;
            sSprite.originX =
              Number(sPicture.x) - (sSprite.width * calcScaleX) / 100 / 2;
            sSprite.originY =
              Number(sPicture.y) - (sSprite.height * calcScaleY) / 100 / 2;
          }
          if (sNumber == 2) {
            sSprite.x =
              Number(sPicture.x2) - (sSprite.width * calcScaleX) / 100 / 2;
            sSprite.y =
              Number(sPicture.y2) - (sSprite.height * calcScaleY) / 100 / 2;
            sSprite.originX =
              Number(sPicture.x2) - (sSprite.width * calcScaleX) / 100 / 2;
            sSprite.originY =
              Number(sPicture.y2) - (sSprite.height * calcScaleY) / 100 / 2;
          }
          if (sNumber == 3) {
            sSprite.x =
              Number(sPicture.x3) - (sSprite.width * calcScaleX) / 100 / 2;
            sSprite.y =
              Number(sPicture.y3) - (sSprite.height * calcScaleY) / 100 / 2;
            sSprite.originX =
              Number(sPicture.x3) - (sSprite.width * calcScaleX) / 100 / 2;
            sSprite.originY =
              Number(sPicture.y3) - (sSprite.height * calcScaleY) / 100 / 2;
          }
          if (sNumber == 4) {
            sSprite.x =
              Number(sPicture.x4) - (sSprite.width * calcScaleX) / 100 / 2;
            sSprite.y =
              Number(sPicture.y4) - (sSprite.height * calcScaleY) / 100 / 2;
            sSprite.originX =
              Number(sPicture.x4) - (sSprite.width * calcScaleX) / 100 / 2;
            sSprite.originY =
              Number(sPicture.y4) - (sSprite.height * calcScaleY) / 100 / 2;
          }
          if (sNumber == 5) {
            sSprite.x =
              Number(sPicture.x5) - (sSprite.width * calcScaleX) / 100 / 2;
            sSprite.y =
              Number(sPicture.y5) - (sSprite.height * calcScaleY) / 100 / 2;
            sSprite.originX =
              Number(sPicture.x5) - (sSprite.width * calcScaleX) / 100 / 2;
            sSprite.originY =
              Number(sPicture.y5) - (sSprite.height * calcScaleY) / 100 / 2;
          }
          /*
					if (sNumber >= 1 && sNumber <= 5 && flipX)
					{
						console.log(sNumber +":"+ sSprite.x +":"+ sSprite.originX+":"+sSprite.scale.x+":"+sSprite.opacity);
						//console.log(sSprite.width * calcScaleX / 100)*Number(sPicture.reverse);
						//sSprite.x += (sSprite.width * calcScaleX / 100)*-1;
						console.log(sNumber +":"+sSprite.width +":"+calcScaleX+":"+(sSprite.width * calcScaleX / 100));
						//sSprite.originX += (sSprite.width * calcScaleX / 100)*-1;
						
						console.log(sNumber +":"+ sSprite.x +":"+ sSprite.originX+":"+sSprite.scale.x+":"+sSprite.opacity);
					}
					*/
          //}
          // 切替効果
          if (
            transition == "InL" ||
            transition == "InR" ||
            transition == "FadeIn"
          ) {
            sSprite.opacity = 0;
          }
          if (sSprite.opacity == 0) {
            if (transition != "") {
              //モーションタグで表示の演出が指定されている場合、強制でトランジション処理を上書き
              if (transition == "InL") {
                //sSprite.x = -200;
                sSprite.x -= 500;
              }
              if (transition == "InR") {
                //sSprite.x = SceneManager._screenWidth+200;
                sSprite.x += 500;
              }
              if (transition == "FadeIn") {
                // 移動無しでフェードイン
              }
              pLL_StandingPicture_picture.transition = null;
            } else {
              if (transitions[sNumber] == 0)
                sSprite.opacity = Number(sPicture.opacity);
              if (transitions[sNumber] == 2) sSprite.x -= 30;
              if (transitions[sNumber] == 3) sSprite.x += 30;
              if (transitions[sNumber] == 4) sSprite.y += 30;
              if (transitions[sNumber] == 5) sSprite.y -= 30;
            }
          }
          sSprite.setBlendMode(Number(sPicture.blendMode));
          sSprite.setColorTone(
            $gameSystem._StandingPictureTone
              ? $gameSystem._StandingPictureTone
              : [0, 0, 0, 0]
          );
          sSprite.setBlendColor([0, 0, 0, 0]);
          sSprite.scale.x = calcScaleX / 100;
          sSprite.scale.y = calcScaleY / 100;
          sSprite.showing = true;
          sSprite.fromX = sSprite.x;
          sSprite.fromY = sSprite.y;
        }.bind(this)
      );
    }

    static accel(now, max, acc) {
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
    }

    static fadeIn(sSprite, sPicture, sNumber) {
      //console.log("fadeIn"+sSprite.showing);
      if (!sSprite.showing) return;
      if (sSprite.opacity >= Number(sPicture.opacity)) {
        sSprite.opening = false;
        sSprite.opacity = Number(sPicture.opacity);
        return;
      }
      //console.log("fadeIn2"+sSprite.showing);
      sSprite.opening = true;
      sSprite.closing = false;
      // 切替効果

      if (sPicture.opacity > 0) {
        //var par = Number(sSprite.opacity)/Number(sPicture.opacity);
        var par = this.accel(
          Number(sSprite.opacity),
          Number(sPicture.opacity),
          -2
        );
        //console.log("par"+par);
        if (sSprite.originX != sSprite.x) {
          //console.log("(sSprite.x-sSprite.originX)"+(sSprite.x-sSprite.originX));
          sSprite.x =
            sSprite.originX + (sSprite.originX - sSprite.fromX) * (1 - par);
        }
      }

      /*
			if (sSprite.originX > sSprite.x) sSprite.x += 2;
			if (sSprite.originX < sSprite.x) sSprite.x -= 2;
			*/
      if (sSprite.originY < sSprite.y) sSprite.y -= 2;
      if (sSprite.originY > sSprite.y) sSprite.y += 2;

      //sSprite.opacity += Number(sPicture.opacity) / 16;
      sSprite.opacity += 12;
      //console.log("opacity"+sSprite.opacity);
    }

    static fadeOut(sSprite, sPicture, sNumber) {
      var transition = "";
      var pLL_StandingPicture_picture = null;
      if (sNumber == 1) {
        pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture1;
      }
      if (sNumber == 2) {
        pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture2;
      }
      if (sNumber == 3) {
        pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture3;
      }
      if (sNumber == 4) {
        pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture4;
      }
      if (sNumber == 5) {
        pLL_StandingPicture_picture = $gameSystem._LL_StandingPicture_picture5;
      }

      if (sSprite.opacity == 0) {
        sSprite.closing = false;
        pLL_StandingPicture_picture.transition = null;
        return;
      }
      sSprite.closing = true;
      if (!sPicture) {
        sSprite.opacity = 0;
        return;
      }

      // 切替効果
      //console.log("transition"+pLL_StandingPicture_picture.transition);
      /*
			if(pLL_StandingPicture_picture.transition!="")
			{
				//モーションタグで表示の演出が指定されている場合、強制でトランジション処理を上書き
				if(pLL_StandingPicture_picture.transition == "FadeL")
				{
					sSprite.originX -= 300;
				}
				if(pLL_StandingPicture_picture.transition == "FadeR")
				{
					sSprite.originX += 300;
				}
				if(pLL_StandingPicture_picture.transition == "FadeOut")
				{
				}
				if(pLL_StandingPicture_picture.transition == "FadeDown")
				{
					sSprite.originY += 200;
				}
				
				pLL_StandingPicture_picture.transition="Active";
			}
			*/

      sSprite.opacity -= Number(sPicture.opacity) / 16;

      if (pLL_StandingPicture_picture.transition == "Active" || true) {
        //独自機構のフェードアウトを毎フレーム動かす処理
        if (sPicture.opacity > 0) {
          /*
					var par = (sSprite.opacity - Number(sPicture.opacity))/Number(sPicture.opacity);
					console.log("par"+par);
					console.log("sSprite.originX");
					
					if (sSprite.originX != sSprite.x)
					{
							sSprite.x = sSprite.originX + (sSprite.originX - sSprite.x) * par;
					}
					if (sSprite.originY != sSprite.y)
					{
							sSprite.y = sSprite.originY + (sSprite.originY - sSprite.y) * par;
					}
					*/
          if (pLL_StandingPicture_picture.transition == "FadeL") {
            sSprite.x -= 30;
          }
          if (pLL_StandingPicture_picture.transition == "FadeR") {
            sSprite.x += 30;
          }
          if (pLL_StandingPicture_picture.transition == "FadeOut") {
          }
          if (pLL_StandingPicture_picture.transition == "FadeDown") {
            sSprite.y += 10;
          }
        }
      } else {
        //プラグインのオリジナル処理
        if (transitions[sNumber] == 0) sSprite.opacity = 0;
        if (transitions[sNumber] == 2 && sSprite.originX - 30 < sSprite.x)
          sSprite.x -= 2;
        if (transitions[sNumber] == 3 && sSprite.originX + 30 > sSprite.x)
          sSprite.x += 2;
        if (transitions[sNumber] == 4 && sSprite.originY + 30 > sSprite.y)
          sSprite.y += 2;
        if (transitions[sNumber] == 5 && sSprite.originY - 30 < sSprite.y)
          sSprite.y -= 2;
      }
    }

    static animation(sSprite, sMotion, animationCount, sPicture, sNumber) {
      if (!sSprite.showing) return animationCount;
      if (sMotion == "yes") {
        if (animationCount > 12) {
          sSprite.y += 10;
        } else {
          sSprite.y -= 10;
        }
        animationCount -= 1;
      }
      if (sMotion == "yesyes") {
        if (animationCount > 36) {
          sSprite.y += 10;
        } else if (animationCount > 24) {
          sSprite.y -= 10;
        } else if (animationCount > 12) {
          sSprite.y += 10;
        } else {
          sSprite.y -= 10;
        }
        animationCount -= 1;
      }
      if (sMotion == "no") {
        if (animationCount > 18) {
          sSprite.x += 10;
        } else if (animationCount > 6) {
          sSprite.x -= 10;
        } else {
          sSprite.x += 10;
        }
        animationCount -= 1;
      }
      if (sMotion == "noslow") {
        if (animationCount > 36) {
          sSprite.x += 5;
        } else if (animationCount > 12) {
          sSprite.x -= 5;
        } else {
          sSprite.x += 5;
        }
        animationCount -= 1;
      }
      if (sMotion == "jump") {
        if (animationCount > 12) {
          sSprite.y -= 10;
        } else {
          sSprite.y += 10;
        }
        animationCount -= 1;
      }
      if (sMotion == "jumpjump") {
        if (animationCount > 36) {
          sSprite.y -= 10;
        } else if (animationCount > 24) {
          sSprite.y += 10;
        } else if (animationCount > 12) {
          sSprite.y -= 10;
        } else {
          sSprite.y += 10;
        }
        animationCount -= 1;
      }
      if (sMotion == "jumploop") {
        if (animationCount > 36) {
          sSprite.y -= 10;
        } else if (animationCount > 24) {
          sSprite.y += 10;
        }
        animationCount -= 1;
        if (animationCount == 0) animationCount = 48;
      }
      if (sMotion == "shake") {
        if (animationCount <= 2) {
          sSprite.x -= 2;
          animationCount += 1;
        } else if (animationCount <= 4) {
          sSprite.y -= 2;
          animationCount += 1;
        } else if (animationCount <= 6) {
          sSprite.x += 4;
          sSprite.y += 4;
          animationCount += 1;
        } else if (animationCount <= 8) {
          sSprite.y -= 2;
          animationCount += 1;
        } else if (animationCount == 9) {
          sSprite.x -= 2;
          animationCount += 1;
        } else if (animationCount == 10) {
          sSprite.x -= 2;
          animationCount = 0;
        }
      }
      if (sMotion == "shakeloop") {
        if (animationCount <= 2) {
          sSprite.x -= 1;
          animationCount += 1;
        } else if (animationCount <= 4) {
          sSprite.y -= 1;
          animationCount += 1;
        } else if (animationCount <= 6) {
          sSprite.x += 2;
          sSprite.y += 2;
          animationCount += 1;
        } else if (animationCount <= 8) {
          sSprite.y -= 1;
          animationCount += 1;
        } else if (animationCount <= 10) {
          sSprite.x -= 1;
          animationCount += 1;
        }
        if (animationCount > 10) animationCount = 1;
      }
      if (sMotion == "runleft") {
        sSprite.x -= 16;
        if (sSprite.x < -2000) animationCount = 0;
      }
      if (sMotion == "runright") {
        sSprite.x += 16;
        if (sSprite.x > 2000) animationCount = 0;
      }
      if (sMotion == "noslowloop") {
        if (animationCount > 72) {
          sSprite.x += 0.25;
        } else if (animationCount > 24) {
          sSprite.x -= 0.25;
        } else {
          sSprite.x += 0.25;
        }
        animationCount -= 1;
        if (animationCount == 0) animationCount = animationFrame["noslowloop"];
      }
      if (sMotion == "breathing") {
        if (animationCount > 72) {
          sSprite.y += 0.5;
        } else if (animationCount > 48) {
          sSprite.y -= 0.5;
        } else {
        }
        animationCount -= 1;
        if (animationCount == 0) animationCount = animationFrame["breathing"];
      }
      if (sMotion == "breathing2") {
        if (animationCount > 48) {
          // sSprite.anchor.y = 1;
          sSprite.y -= sSprite.height * 0.0003;
          sSprite.scale.y += 0.0003;
        } else {
          // sSprite.anchor.y = 1;
          sSprite.y += sSprite.height * 0.0003;
          sSprite.scale.y -= 0.0003;
        }
        animationCount -= 1;
        if (animationCount == 0) animationCount = animationFrame["breathing2"];
      }
      if (sMotion == "huwahuwa") {
        if (animationCount > 144) {
          sSprite.y += 0.25;
        } else if (animationCount > 48) {
          sSprite.y -= 0.25;
        } else {
          sSprite.y += 0.25;
        }
        animationCount -= 1;
        if (animationCount == 0) animationCount = animationFrame["huwahuwa"];
      }
      /*
			if (sMotion == "InL") {
				if (animationCount == 2) {
					sSprite.opacity = 0;
					animationCount=1;
				}
				sSprite.opacity += 10;
				if (sSprite.opacity >= 255)
				{
					sPicture.opacity = 255;
					animationCount = 0;
				}
			}
			if (sMotion == "InR") {
				if (animationCount == 2) {
					sSprite.opacity = 0;
					animationCount=1;
				}
				sSprite.opacity += 10;
				if (sSprite.opacity >= 255)
				{
					sPicture.opacity = 255;
					animationCount = 0;
				}
			}
			if (sMotion == "FadeIn") {
				if (animationCount == 2) {
					sSprite.opacity = 0;
					animationCount=1;
				}
				sSprite.opacity += 10;
				if (sSprite.opacity >= 255)
				{
					sPicture.opacity = 255;
					animationCount = 0;
				}
			}
			*/
      /*
			if (sMotion == "FadeL") {
				/console.log(sSprite.opacity);
				sSprite.x -= 16;
				//sSprite.closing = true;
				//sSprite.opacity -= 10;
				sPicture.opacity -= 10;
				if (sSprite.opacity <= 1)
				{
					sSprite.opacity=255;
					sPicture.opacity = 255;
					sSprite.x = 4000
					animationCount = 0;
					//sSprite.closing = false;
					//sSprite.showing = true;
					//sPicture.showSPicture = false;
					//sPicture.refSPicture = true;
					//this.refresh(sSprite, sPicture, sNumber);
					//sSprite.closing = true;
				}
			}
			if (sMotion == "FadeR") {
				sSprite.x += 16;
				sPicture.opacity -= 10;
				if (sSprite.opacity <= 1)
				{
					sSprite.opacity=255;
					sPicture.opacity = 255;
					sSprite.x = 4000
					animationCount = 0;
				}
			}
			if (sMotion == "FadeOut") {
				sPicture.opacity -= 10;
				if (sSprite.opacity < 1)
				{
					sSprite.opacity=255;
					sPicture.opacity = 255;
					sSprite.x = 4000
					animationCount = 0;
				}
			}
			if (sMotion == "FadeDown") {
				sSprite.y += 16;
				sPicture.opacity -= 10;
				if (sSprite.opacity < 1)
				{
					sSprite.opacity=255;
					sPicture.opacity = 255;
					sSprite.x = 4000
					animationCount = 0;
				}
			}
			*/
      if (sMotion == "Down") {
        sSprite.y += 20;
        if (sSprite.y > SceneManager._screenHeight + 800) animationCount = 0;
      }
      /*
			if (sMotion == "FlipX") {
				sPicture.flipX = true;
				this.refresh(sSprite, sPicture, sNumber);
				animationCount = 0;
			}
			*/
      //console.log(sPicture.flipX+"?2");
      return animationCount;
    }
  }

  var _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update.apply(this, arguments);
    ExStandingPicture.update(this);
  };

  var _Scene_Map_createDisplayObjects =
    Scene_Map.prototype.createDisplayObjects;
  Scene_Map.prototype.createDisplayObjects = function () {
    _Scene_Map_createDisplayObjects.apply(this, arguments);
    ExStandingPicture.create(this);
  };

  var _Scene_Battle_update = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function () {
    _Scene_Battle_update.apply(this, arguments);
    ExStandingPicture.update(this);
  };

  var _Scene_Battle_createDisplayObjects =
    Scene_Battle.prototype.createDisplayObjects;
  Scene_Battle.prototype.createDisplayObjects = function () {
    _Scene_Battle_createDisplayObjects.apply(this, arguments);
    ExStandingPicture.create(this);
  };

  var _Window_Message_updateClose = Window_Message.prototype.updateClose;
  Window_Message.prototype.updateClose = function () {
    // ピクチャ消去判定
    if (this._closing && this.openness == 255) {
      if (!$gameSystem._LL_StandingPicture_holdSPicture) {
        $gameSystem._LL_StandingPicture_picture1.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture2.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture3.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture4.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture5.showSPicture = false;
        $gameSystem._LL_StandingPicture_picture1.motionSPicture = "";
        $gameSystem._LL_StandingPicture_picture2.motionSPicture = "";
        $gameSystem._LL_StandingPicture_picture3.motionSPicture = "";
        $gameSystem._LL_StandingPicture_picture4.motionSPicture = "";
        $gameSystem._LL_StandingPicture_picture5.motionSPicture = "";
        $gameSystem._LL_StandingPicture_picture1.flipX = false;
        $gameSystem._LL_StandingPicture_picture2.flipX = false;
        $gameSystem._LL_StandingPicture_picture3.flipX = false;
        $gameSystem._LL_StandingPicture_picture4.flipX = false;
        $gameSystem._LL_StandingPicture_picture5.flipX = false;
      }
    }
    _Window_Message_updateClose.apply(this, arguments);
  };

  var _Window_Message_startMessage = Window_Message.prototype.startMessage;
  Window_Message.prototype.startMessage = function () {
    var messageAllText = $gameMessage.allText();
    exStandingPictureParseChar(messageAllText);

    _Window_Message_startMessage.apply(this, arguments);
  };

  var _Window_Base_convertEscapeCharacters =
    Window_Base.prototype.convertEscapeCharacters;
  Window_Base.prototype.convertEscapeCharacters = function (text) {
    // 立ち絵呼び出し用の制御文字(\V[n]内包)を追加
    text = text.replace(/\\F\[\\V\[(\d+)\]\]/gi, "");
    text = text.replace(/\\FF\[\\V\[(\d+)\]\]/gi, "");
    text = text.replace(/\\FFF\[\\V\[(\d+)\]\]/gi, "");
    text = text.replace(/\\FFFF\[\\V\[(\d+)\]\]/gi, "");
    text = text.replace(/\\FFFFF\[\\V\[(\d+)\]\]/gi, "");

    // 立ち絵呼び出し用の制御文字を追加
    text = text.replace(/\\F\[(\w+)\]/gi, "");
    text = text.replace(/\\FF\[(\w+)\]/gi, "");
    text = text.replace(/\\FFF\[(\w+)\]/gi, "");
    text = text.replace(/\\FFFF\[(\w+)\]/gi, "");
    text = text.replace(/\\FFFFF\[(\w+)\]/gi, "");
    text = text.replace(/\\M\[(\w+)\]/gi, "");
    text = text.replace(/\\MM\[(\w+)\]/gi, "");
    text = text.replace(/\\MMM\[(\w+)\]/gi, "");
    text = text.replace(/\\MMMM\[(\w+)\]/gi, "");
    text = text.replace(/\\MMMMM\[(\w+)\]/gi, "");
    text = text.replace(/\\AA\[(\w+)\]/gi, "");
    text = text.replace(/\\FH\[(\w+)\]/gi, "");

    text = text.replace(/\\FX\[(\w+)\]/gi, "");

    return _Window_Base_convertEscapeCharacters.call(this, text);
  };

  var _Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
  Scene_Boot.loadSystemImages = function () {
    _Scene_Boot_loadSystemImages.call(this);

    if (!catheBootPicture) return;

    // 立ち絵画像を事前読み込み
    sPictureLists.forEach(function (elm) {
      ImageManager.loadPicture(elm.imageName);
    });
  };

  //-----------------------------------------------------------------------------
  // Sprite_LL_SPicture
  //
  // 立ち絵を表示するための独自のスプライトを追加定義します。

  function Sprite_LL_SPicture() {
    this.initialize.apply(this, arguments);
  }

  Sprite_LL_SPicture.prototype = Object.create(Sprite.prototype);
  Sprite_LL_SPicture.prototype.constructor = Sprite_LL_SPicture;

  Sprite_LL_SPicture.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);

    this.bitmap = null;
    this.opacity = 0;
    this.opening = false;
    this.closing = false;
    this.originX = 0;
    this.originY = 0;
    this.fromX = 0; // 移動前の座標
    this.fromY = 0; // 移動前の座標
    this.showing = false;

    this.orgNo = 0; // もともとの立ち絵ナンバー
    //this.z = 0; // 深度

    this.setOverlayBitmap();
    this.initMembers();
  };

  Sprite_LL_SPicture.prototype.setOverlayBitmap = function () {
    //
  };

  Sprite_LL_SPicture.prototype.initMembers = function () {
    //
  };

  Sprite_LL_SPicture.prototype.update = function () {
    Sprite.prototype.update.call(this);
  };

  Sprite_LL_SPicture.prototype.setPicture = function (sPicture) {
    // ベース画像
    this.bitmap = null;
    this.bitmap = ImageManager.loadPicture(sPicture.imageName);
  };

  Sprite_LL_SPicture.prototype.setBlendColor = function (color) {
    Sprite.prototype.setBlendColor.call(this, color);
  };

  Sprite_LL_SPicture.prototype.setColorTone = function (tone) {
    Sprite.prototype.setColorTone.call(this, tone);
  };

  Sprite_LL_SPicture.prototype.setBlendMode = function (mode) {
    this.blendMode = mode;
  };
})();
