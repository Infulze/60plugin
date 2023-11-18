/**
 * @name 68
 * @version 0.0.1
 * @description Adds Stereo To Discord in a fancy way, credit to Suspect.
 * @invite mr2X589E2f
 */



module.exports = (() => {
  const config = {
      // configuration object for the plugin
      main: "index.js",
      info: {
          name: "68",
          authors: [{
              name: "68",
              discord_id: "792372560322756608"
          }],
          version: "0.0.3",
          description: "Adds Stereo To Discord, Original Patch By suspect but forked by Inful.",
      },
      changelog: [{
          title: "68 Changelog",
          items: ["Added Channel Options."],
      }, {
          title: "New Features",
          items: [
              "Added option to switch between audio channels (1.0 Mono Sound, 2.0 Normal Stereo Sound, 7.1 Surround Sound in settings.",
          ],
      }, ],
      defaultConfig: [{
          type: "switch",
          id: "enableToasts",
          name: "Enable notifications",
          note: "Warning for Discord Audio Features",
          value: true,
      }, {
          type: "radio",
          id: "stereoChannelOption",
          name: "Stereo Channel Option",
          note: "Select your preferred channel option:",
          value: "2.0",
          options: [{
              name: "1.0 Mono Sound",
              value: "1.0"
          }, {
              name: "2.0 Normal Stereo Sound",
              value: "2.0"
          }, {
              name: "7.1 Surround Sound (Default)",
              value: "7.1"
          }, ],
      }, {
          type: "radio",
          id: "bitrateSliderOption",
          name: "Bitrate Option",
          note: "Use this to set your bitrate.",
          value: "160000.0",
          options: [{
              name: "500 Bitrate (Hehehe mic)",
              value: "500.0"
          }, {
              name: "160k Bitrate",
              value: "160000.0"
          }, {
              name: "200k Bitrate",
              value: "200000.0"
          }, {
              name: "500k Bitrate",
              value: "500000.0"
          }, {
              name: "2M Bitrate",
              value: "2000000.0"
          }],
      }, {
          type: "radio",
          id: "priorityBypass",
          name: "Priority Bypass Option",
          note: "EXPERIEMTANL(POSSIBLY DOESN'T WORK",
          value: "2",
          options: [{
              name: "On",
              value: "1"
          }, {
              name: "Off",
              value: "2"
          }],
      }, {
          type: "radio",
          id: "prioritySpeaking",
          name: "Priority Speaking Option",
          note: "You must have priority bypass on to have this.",
          value: false,
          options: [{
              name: "On",
              value: true
          }, {
              name: "Off",
              value: false
          }],
      }, {
          type: "radio",
          id: "vadKrisp",
          name: "Add/Remove Krisp Option",
          value: false,
          options: [{
              name: "On",
              value: true
          }, {
              name: "Off",
              value: false
          }],
      }, {
            type: 'switch',
            id: 'setvolumemax',
            name: 'Auto-Set Max Input Volume on Voice Channel Join',
            note: 'Ensures Maximum Volume by Default for Convenience',
            value: false,
      }, {
            type: "dropdown",
            id: "videobr",
            name: "Infuls Screenshare Video Bitrate",
            note: "Adjust the bitrate of your video Screenshare",
            options: [
              {
                label: "(Experimental) 250 kbps",
                value: 250000
              },
              {
                label: "(Experimental) 500 kbps",
                value: 500000
              },
              {
                label: "1000 kbps",
                value: 1000000
              },
              {
                label: "2000 kbps",
                value: 2000000
              },
              {
                label: "(Default) 3000 kbps",
                value: 3000000
              },
              {
                label: "4000 kbps",
                value: 4000000
              },
              {
                label: "5000 kbps",
                value: 5000000
              },
              {
                label: "10000 kbps",
                value: 10000000
              }
            ],
      }, ],
  };
  
  return !global.ZeresPluginLibrary ?
  
      class {
          constructor() {
              this._config = config;
          }
          getName() {
              return config.info.name;
          }
          getAuthor() {
              return config.info.authors.map((a) => a.name).join(", ");
          }
          getDescription() {
              return config.info.description;
          }
          getVersion() {
              return config.info.version;
          }
          load() {
              // show modal to install zerespluginlibrary
              BdApi.showConfirmationModal(
                  "InfulsStereo Library Missing",
                  `ZeresPluginLibrary is missing. Click "Install Now" to download it.`, {
                      confirmText: "Install Now",
                      cancelText: "Cancel",
                      onConfirm: () => {
                          require("request").get(
                              "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                              async(error, response, body) => {
                                  if (error) {
                                      console.error("Error downloading ZeresPluginLibrary:", error);
                                      BdApi.showConfirmationModal(
                                          "Download Error",
                                          "An error occurred while downloading ZeresPluginLibrary. Please try again later or download it manually from the official website.", {
                                              confirmText: "OK",
                                              cancelText: "Cancel",
                                          }
                                      );
                                      return;
                                  }

                                  await new Promise((r) =>
                                      require("fs").writeFile(
                                          require("path").join(
                                              BdApi.Plugins.folder,
                                              "0PluginLibrary.plugin.js"
                                          ),
                                          body,
                                          r
                                      )
                                  );
                              }
                          );
                      },
                  }
              );
          }
          start() {}
          stop() {}
      } :
      (([Plugin, Api]) => {
        
          // actual plugin implementation when zerespluginlibrary is available
          const plugin = (Plugin, Library) => {
            
              const {
                  WebpackModules,
                  Patcher,
                  Toasts
              } = Library;
              
              return class InfulStereo extends Plugin {
                  // plugin start method
                  onStart() {
                      BdApi.UI.showNotice(
                          "68", {
                              type: "info",
                              timeout: 10000
                          }
                      );
                      this.settingsWarning();
                      const voiceModule = WebpackModules.getModule(
                          BdApi.Webpack.Filters.byPrototypeFields("updateVideoQuality")
                      );
                      // patch discords voice module to enable stereo sound
                      BdApi.Patcher.after(
                          "68 stereo",
                          voiceModule.prototype,
                          "updateVideoQuality",
                          (thisObj, _args, ret) => {
                              if (thisObj) {
                                  const objconfigure = thisObj
                                  const objvideos = thisObj.framerateReducer.sinkWants.qualityOverwrite
                                  const setTransportOptions = thisObj.conn.setTransportOptions;
                                  const channelOption = this.settings.stereoChannelOption;
                                  const bitrateOption = this.settings.bitrateSliderOption;
                                  const priorityOption = this.settings.priorityBypass;
                                  const prioritySpeaking = this.settings.prioritySpeaking;
                                  const usevadkrisp = this.settings.vadKrisp;
                                  const streambitrate = this.settings.videobr
                                  const button = document.querySelector('.statusWithPopout-1MDqs1');
        
                                if (button) {
                                    const div = button.querySelector('.contents-3NembX');
                                    if (div) {
                                        div.textContent = '68 stereo';
                                    }
                                }
                                  thisObj.conn.setTransportOptions = function(obj) {
                                      if (obj.audioEncoder) {
                                          obj.audioEncoder.params = {
                                              stereo: channelOption,
                                          };
                                          obj.audioEncoder.channels = parseFloat(channelOption);
                                      }
                                      if (obj.fec) {
                                          obj.fec = false;
                                      }
                                      if (obj.encodingVoiceBitRate) {
                                          obj.encodingVoiceBitRate = parseFloat(bitrateOption);
                                      }
                                      if (obj.prioritySpeakerDucking) {
                                          obj.prioritySpeakerDucking = parseFloat(priorityOption);
                                      }
                                      objconfigure.forceAudioPriority = parseFloat(prioritySpeaking);
                                      objconfigure.voiceBitrate = parseFloat(bitrateOption)
                                      objconfigure.vadUseKrisp = parseFloat(usevadkrisp)
                                      objvideos.bitrateMin = streambitrate
                                      objvideos.bitrateMax = streambitrate
                                      objvideos.bitrateTarget = streambitrate
                                      objconfigure.videoQualityManager.options.desktopBitrate.max - streambitrate
                                      objconfigure.videoQualityManager.options.desktopBitrate.min - streambitrate
                                      objconfigure.videoQualityManager.options.desktopBitrate.target - streambitrate
                                      objconfigure.videoQualityManager.options.videoBitrate.max = streambitrate
                                      objconfigure.videoQualityManager.options.videoBitrate.min = streambitrate
                                      objconfigure.videoQualityManager.options.videoBitrateFloor = streambitrate

                                      setTransportOptions.call(thisObj, obj);
                                  };
                                  return ret;
                              }
                          }
                      );
                  }

                  settingsWarning() {
                      const voiceSettingsStore = WebpackModules.getByProps(
                          "getEchoCancellation"
                      );
                      if (
                          voiceSettingsStore.getNoiseSuppression() ||
                          voiceSettingsStore.getNoiseCancellation() ||
                          voiceSettingsStore.getEchoCancellation()
                      ) {
                          if (this.settings.enableToasts) {
                              Toasts.show(
                                  "Please disable echo cancellation, noise reduction, and noise suppression for SuspectStereo", {
                                      type: "warning",
                                      timeout: 5000
                                  }
                              );
                          }
                          return true;
                      } else return false;
                  }

                  // plugin stop method
                  onStop() {
                      Patcher.unpatchAll();
                  }
                  getSettingsPanel() {
                      const panel = this.buildSettingsPanel();
                      return panel.getElement();
                  }
              };
          };
          return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
