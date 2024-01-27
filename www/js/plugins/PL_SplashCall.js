/*=============================================================================
 PL_SplashCall.js v.1.01
=============================================================================*/

/*:
 * @plugindesc スプラッシュ画面でボイスを鳴らすプラグイン
 * @author -
 *
 * @help MadeWithMv.jsあるいは MOG_TitleSplashScreen.jsの後
 *
 * @param name
 * @text SEファイル名
 * @desc 演奏するSEのファイル名です。
 * @default
 * @type file
 * @dir audio/se
 *
 * @param volume
 * @text SE音量
 * @desc 演奏するSEの音量です。
 * @default 90
 * @type number
 * @max 100
 *
 * @param pitch
 * @text SEピッチ
 * @desc 演奏するSEのピッチです。
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @text SE位相
 * @desc 演奏するSEの位相（定位）です。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 *
 * @param delay
 * @text 遅延(ミリ秒)
 * @desc SE演奏を指定したミリ秒ぶんだけ遅らせます。
 * @default 0
 * @type number
 * @max 99999
 *
 * @param randomList
 * @text スプラッシュ画面時のランダムSEファイルリスト
 * @desc 設定しておくとリストの中からランダムで再生されます。
 * @default []
 * @type file[]
 * @dir audio/se
 *
 * @help PL_SplashCall.js
 *
 * ブランド画面を表示したときに指定した効果音を演奏します。
 */

(function () {
  "use strict";

  /**
   * Create plugin parameter. param[paramName] ex. param.commandPrefix
   * @param pluginName plugin name(EncounterSwitchConditions)
   * @returns {Object} Created parameter
   */
  var createPluginParameter = function (pluginName) {
    var paramReplacer = function (key, value) {
      if (value === "null") {
        return value;
      }
      if (value[0] === '"' && value[value.length - 1] === '"') {
        return value;
      }
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    };
    var parameter = JSON.parse(
      JSON.stringify(PluginManager.parameters(pluginName), paramReplacer)
    );
    PluginManager.setParameters(pluginName, parameter);
    return parameter;
  };

  var param = createPluginParameter("PL_SplashCall");

  //------------
  // MadeWithMv.jsをフック
  /*

		var _Scene_Splash_start = Scene_Splash.prototype.start;
		Scene_Splash.prototype.start = function () {
				var list = param.randomList;
				if (list && list.length > 0) {
						param.name = list[Math.randomInt(list.length)];
				}
				if (param.delay) {
						setTimeout(AudioManager.playSe.bind(AudioManager, param), param.delay);
				} else {
						AudioManager.playSe(param);
				}

				_Scene_Splash_start.apply(this, arguments);
		*/

  //------------
  // MOG_TitleSplashScreen.jsをフック

  var Scene_Splash_Screen_create = Scene_Splash_Screen.prototype.create;
  Scene_Splash_Screen.prototype.create = function () {
    var list = param.randomList;
    if (list && list.length > 0) {
      param.name = list[Math.randomInt(list.length)];
    }
    if (param.delay) {
      setTimeout(AudioManager.playSe.bind(AudioManager, param), param.delay);
    } else {
      AudioManager.playSe(param);
    }

    Scene_Splash_Screen_create.apply(this, arguments);
  };
})();
