/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var cc = cc || {};

/**
 * Offer a VERY simple interface to play music & sound effect.
 * @class
 * @extends   cc.Class
 */
cc.AudioEngine = cc.Class.extend(/** @lends cc.AudioEngine# */{
    _supportedFormat:[],
    _soundEnable:false,
    _effectList:{},
    _muiscList:{},
    _soundList:{},
    _isMusicPlaying:false,
    _playingMusic:null,
    _effectsVolume:1,
    _maxAudioInstance:10,
    _capabilities:{
        mp3:false,
        ogg:false,
        wav:false
    },

    /**
     * Constructor
     */
    ctor:function () {
        this._supportedFormat = [];
        // init audio
        var au = document.createElement('audio');
        if (au.canPlayType) {
            this._capabilities.mp3 = ("no" != au.canPlayType("audio/mpeg"))
                && ("" != au.canPlayType("audio/mpeg"));

            this._capabilities.ogg = ("no" != au.canPlayType('audio/ogg; codecs="vorbis"'))
                && ("" != au.canPlayType('audio/ogg; codecs="vorbis"'));

            this._capabilities.wav = ("no" != au.canPlayType('audio/wav; codecs="1"'))
                && ("" != au.canPlayType('audio/wav; codecs="1"'));

            // enable sound if any of the audio format is supported
            this._soundEnable = this._capabilities.mp3 || this._capabilities.ogg || this._capabilities.wav;
        }
    },

    /**
     * Initialize sound type
     * @return {Boolean}
     */
    init:function () {
        // detect the prefered audio format
        this._getSupportedAudioFormat();
        return this._soundEnable;
    },

    /**
     * Preload music resource.<br />
     * This method is called when cc.Loader preload  resources.
     * @param {String} path The path of the music file with filename extension.
     */
    preloadSound:function (path) {
        if (this._soundEnable) {
            var extName = this._getExtFromFullPath(path);
            var keyname = this._getPathWithoutExt(path);
            if (this._checkAudioFormatSupported(extName) && !this._soundList.hasOwnProperty(keyname)) {
                var soundCache = new Audio(path);
                soundCache.preload = 'auto';

                soundCache.addEventListener('canplaythrough', function (e) {
                    this.removeEventListener('canplaythrough', arguments.callee, false);
                }, false);

                soundCache.addEventListener("error", function (e) {
                    this.removeEventListener('error', arguments.callee, false);
                    cc.Loader.getInstance().onResLoadingErr();
                }, false);

                this._soundList[keyname] = true;
                // load it
                soundCache.load();
            }
        }
        cc.Loader.getInstance().onResLoaded();
    },

    /**
     * Play music.
     * @param {String} path The path of the music file without filename extension.
     * @param {Boolean} loop Whether the music loop or not.
     * @example
     * //example
     * cc.AudioEngine.getInstance().playMusic(path, false);
     */
    playMusic:function (path, loop) {
        var keyname = this._getPathWithoutExt(path);
        var actExt = this._supportedFormat[0];
        var au;
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            this._muiscList[this._playingMusic].pause();
        }
        this._playingMusic = keyname;
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            au = this._muiscList[this._playingMusic];
        }
        else {
            au = new Audio(keyname + "." + actExt);
            au.preload = 'auto';
            this._muiscList[this._playingMusic] = au;

            au.addEventListener("playing", function (e) {
                cc.AudioEngine._instance._isMusicPlaying = true;
            }, false);

            au.addEventListener("pause", function (e) {
                cc.AudioEngine._instance._isMusicPlaying = false;
            }, false);
        }

        au.loop = loop || false;
        au.play();
    },

    /**
     * Stop playing music.
     * @param {Boolean} releaseData If release the music data or not.As default value is false.
     * @example
     * //example
     * cc.AudioEngine.getInstance().stopMusic();
     */
    stopMusic:function (releaseData) {
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            var au = this._muiscList[this._playingMusic];
            au.pause();
            au.currentTime = au.duration;
            if (releaseData) {
                delete this._muiscList[this._playingMusic];
            }
        }
    },

    /**
     * Pause playing music.
     * @example
     * //example
     * cc.AudioEngine.getInstance().pauseMusic();
     */
    pauseMusic:function () {
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            this._muiscList[this._playingMusic].pause();
        }
    },

    /**
     * Resume playing music.
     * @example
     * //example
     * cc.AudioEngine.getInstance().resumeMusic();
     */
    resumeMusic:function () {
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            this._muiscList[this._playingMusic].play();
        }
    },

    /**
     * Rewind playing music.
     * @example
     * //example
     * cc.AudioEngine.getInstance().rewindMusic();
     */
    rewindMusic:function () {
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            this._muiscList[this._playingMusic].currentTime = 0;
            this._muiscList[this._playingMusic].play();
        }
    },

    willPlayMusic:function () {
        return false;
    },

    /**
     * Whether the music is playing.
     * @return {Boolean} If is playing return true,or return false.
     * @example
     * //example
     *  if (cc.AudioEngine.getInstance().isMusicPlaying()) {
     *      cc.log("music is playing");
     *  }
     *  else {
     *      cc.log("music is not playing");
     *  }
     */
    isMusicPlaying:function () {
        return this._isMusicPlaying;
    },

    /**
     * The volume of the music max value is 1.0,the min value is 0.0 .
     * @return {Number}
     * @example
     * //example
     * var volume = cc.AudioEngine.getInstance().getMusicVolume();
     */
    getMusicVolume:function () {
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            return this._muiscList[this._playingMusic].volume;
        }
        return 0;
    },

    /**
     * Set the volume of music.
     * @param {Number} volume Volume must be in 0.0~1.0 .
     * @example
     * //example
     * cc.AudioEngine.getInstance().setMusicVolume(0.5);
     */
    setMusicVolume:function (volume) {
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            var music = this._muiscList[this._playingMusic];
            if (volume > 1) {
                music.volume = 1;
            }
            else if (volume < 0) {
                music.volume = 0;
            }
            else {
                music.volume = volume;
            }
        }
    },

    /**
     * Play sound effect.
     * @param {String} path The path of the sound effect with filename extension.
     * @param {Boolean} loop Whether to loop the effect playing, default value is false
     * @example
     * //example
     * var soundId = cc.AudioEngine.getInstance().playEffect(path);
     */
    playEffect:function (path, loop) {
        var keyname = this._getPathWithoutExt(path);
        var actExt = this._supportedFormat[0];
        var reclaim = this._getEffectList(keyname), au;
        if (reclaim.length > 0) {
            for (var i = 0; i < reclaim.length; i++) {
                //if one of the effect ended, play it
                if (reclaim[i].ended) {
                    au = reclaim[i];
                    au.currentTime = 0;
                    break;
                }
            }
        }

        if (!au) {
            if (reclaim.length >= this._maxAudioInstance) {
                cc.log("Error: " + path + " greater than " + this._maxAudioInstance);
                return keyname;
            }
            au = new Audio(keyname + "." + actExt);
            reclaim.push(au);
        }

        if (loop) {
            au.loop = loop;
        }
        au.play();
        return keyname;
    },

    /**
     *The volume of the effects max value is 1.0,the min value is 0.0 .
     * @return {Number}
     * @example
     * //example
     * var effectVolume = cc.AudioEngine.getInstance().getEffectsVolume();
     */
    getEffectsVolume:function () {
        return this._effectsVolume;
    },

    /**
     * Set the volume of sound effecs.
     * @param {Number} volume Volume must be in 0.0~1.0 .
     * @example
     * //example
     * cc.AudioEngine.getInstance().setEffectsVolume(0.5);
     */
    setEffectsVolume:function (volume) {
        if (volume > 1) {
            this._effectsVolume = 1;
        }
        else if (volume < 0) {
            this._effectsVolume = 0;
        }
        else {
            this._effectsVolume = volume;
        }

        var tmpArr, au;
        for (var i in this._effectList) {
            tmpArr = this._effectList[i];
            if (tmpArr.length > 0) {
                for (var j = 0; j < tmpArr.length; j++) {
                    au = tmpArr[j];
                    au.volume = this._effectsVolume;
                }
            }
        }
    },

    /**
     * Pause playing sound effect.
     * @param {String} path The return value of function playEffect.
     * @example
     * //example
     * cc.AudioEngine.getInstance().pauseEffect(path);
     */
    pauseEffect:function (path) {
        var keyname = this._getPathWithoutExt(path);
        if (this._effectList.hasOwnProperty(keyname)) {
            var tmpArr = this._effectList[keyname], au;
            for (var i = tmpArr.length - 1; i >= 0; i--) {
                au = tmpArr[i];
                if (!au.ended) {
                    au.pause();
                }
            }
        }
    },

    /**
     * Pause all playing sound effect.
     * @example
     * //example
     * cc.AudioEngine.getInstance().pauseAllEffects();
     */
    pauseAllEffects:function () {
        var tmpArr, au;
        for (var i in this._effectList) {
            tmpArr = this._effectList[i];
            for (var j = 0; j < tmpArr.length; j++) {
                au = tmpArr[j];
                if (!au.ended) {
                    au.pause();
                }
            }
        }
    },

    /**
     * Resume playing sound effect.
     * @param {String} path The return value of function playEffect.
     * @example
     * //example
     * cc.AudioEngine.getInstance().resumeEffect(path);
     */
    resumeEffect:function (path) {
        var tmpArr, au;
        var keyname = this._getPathWithoutExt(path);
        if (this._effectList.hasOwnProperty(keyname)) {
            tmpArr = this._effectList[keyname];
            if (tmpArr.length > 0) {
                for (var i = 0; i < tmpArr.length; i++) {
                    au = tmpArr[i];
                    if (!au.ended) {
                        au.play();
                    }
                }
            }
        }
    },

    /**
     * Resume all playing sound effect
     * @example
     * //example
     * cc.AudioEngine.getInstance().resumeAllEffects();
     */
    resumeAllEffects:function () {
        var tmpArr, au;
        for (var i in this._effectList) {
            tmpArr = this._effectList[i];
            if (tmpArr.length > 0) {
                for (var j = 0; j < tmpArr.length; j++) {
                    au = tmpArr[j];
                    if (!au.ended) {
                        au.play();
                    }
                }
            }
        }
    },

    /**
     * Stop playing sound effect.
     * @param {String} path The return value of function playEffect.
     * @example
     * //example
     * cc.AudioEngine.getInstance().stopEffect(path);
     */
    stopEffect:function (path) {
        var tmpArr, au;
        var keyname = this._getPathWithoutExt(path);
        if (this._effectList.hasOwnProperty(keyname)) {
            tmpArr = this._effectList[keyname];
            if (tmpArr.length > 0) {
                for (var i = 0; i < tmpArr.length; i++) {
                    au = tmpArr[i];
                    if (!au.ended) {
                        au.loop = false;
                        au.currentTime = au.duration;
                    }
                }
            }
        }
    },

    /**
     * Stop all playing sound effects.
     * @example
     * //example
     * cc.AudioEngine.getInstance().stopAllEffects();
     */
    stopAllEffects:function () {
        var tmpArr, au;
        for (var i in this._effectList) {
            tmpArr = this._effectList[i];
            for (var j = 0; j < tmpArr.length; j++) {
                au = tmpArr[j];
                if (!au.ended) {
                    au.loop = false;
                    au.currentTime = au.duration;
                }
            }
        }
    },

    /**
     * Unload the preloaded effect from internal buffer
     * @param {String} path
     * @example
     * //example
     * cc.AudioEngine.getInstance().unloadEffect(EFFECT_FILE);
     */
    unloadEffect:function (path) {
        var keyname = this._getPathWithoutExt(path);
        if (this._effectList.hasOwnProperty(keyname)) {
            this.stopEffect(path);
            delete this._effectList[keyname];
        }
    },

    /**
     *  Stop all music and sound effects
     * @example
     * //example
     * cc.AudioEngine.getInstance().end();
     */
    end:function () {
        this.stopMusic();
        this.stopAllEffects();
    },

    _getEffectList:function (elt) {
        if (this._effectList.hasOwnProperty(elt)) {
            return this._effectList[elt];
        }
        else {
            this._effectList[elt] = [];
            return this._effectList[elt];
        }
    },

    _getPathWithoutExt:function (fullpath) {
        var endPos = fullpath.lastIndexOf(".");
        if (endPos != -1) {
            return fullpath.substring(0, endPos);
        }
        return fullpath;
    },

    _getExtFromFullPath:function (fullpath) {
        var startPos = fullpath.lastIndexOf(".");
        if (startPos != -1) {
            return fullpath.substring(startPos + 1, fullpath.length);
        }
        return -1;
    },

    _checkAudioFormatSupported:function (ext) {
        var tmpExt;
        for (var i = 0; i < this._supportedFormat.length; i++) {
            tmpExt = this._supportedFormat[i];
            if (tmpExt == ext) {
                return true;
            }
        }
        return false;
    },

    _getSupportedAudioFormat:function () {
        // check for sound support by the browser
        if (!this._soundEnable) {
            return;
        }

        // check for MP3
        if (this._capabilities.mp3) {
            this._supportedFormat.push("mp3");
        }

        // check for OGG/Vorbis
        if (this._capabilities.ogg) {
            this._supportedFormat.push("ogg");
        }

        // check for WAV
        if (this._capabilities.wav) {
            this._supportedFormat.push("wav");
        }
    }
});

cc.AudioEngine._instance = null;

/**
 * Get the shared Engine object, it will new one when first time be called.
 * @return {cc.AudioEngine}
 */
cc.AudioEngine.getInstance = function () {
    if (!this._instance) {
        this._instance = new cc.AudioEngine();
        this._instance.init();
    }
    return this._instance;
};
