System.register(["jimu-core","jimu-ui/advanced/setting-components","jimu-ui/advanced/data-source-selector","jimu-ui"], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {
	var __WEBPACK_EXTERNAL_MODULE_jimu_core__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_data_source_selector__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui__ = {};
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_core__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_data_source_selector__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui__, "__esModule", { value: true });
	return {
		setters: [
			function(module) {
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_core__[key] = module[key];
				});
			},
			function(module) {
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__[key] = module[key];
				});
			},
			function(module) {
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_data_source_selector__[key] = module[key];
				});
			},
			function(module) {
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui__[key] = module[key];
				});
			}
		],
		execute: function() {
			__WEBPACK_DYNAMIC_EXPORT__(
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "jimu-core":
/*!****************************!*\
  !*** external "jimu-core" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_core__;

/***/ }),

/***/ "jimu-ui":
/*!**************************!*\
  !*** external "jimu-ui" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_ui__;

/***/ }),

/***/ "jimu-ui/advanced/data-source-selector":
/*!********************************************************!*\
  !*** external "jimu-ui/advanced/data-source-selector" ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_data_source_selector__;

/***/ }),

/***/ "jimu-ui/advanced/setting-components":
/*!******************************************************!*\
  !*** external "jimu-ui/advanced/setting-components" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
(() => {
/*!******************************************!*\
  !*** ./jimu-core/lib/set-public-path.ts ***!
  \******************************************/
/**
 * Webpack will replace __webpack_public_path__ with __webpack_require__.p to set the public path dynamically.
 * The reason why we can't set the publicPath in webpack config is: we change the publicPath when download.
 * */
__webpack_require__.p = window.jimuConfig.baseUrl;

})();

// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!***********************************************************************!*\
  !*** ./your-extensions/widgets/relatorio_MCR/src/setting/setting.tsx ***!
  \***********************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __set_webpack_public_path__: () => (/* binding */ __set_webpack_public_path__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jimu-core */ "jimu-core");
/* harmony import */ var jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jimu-ui/advanced/setting-components */ "jimu-ui/advanced/setting-components");
/* harmony import */ var jimu_ui_advanced_data_source_selector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jimu-ui/advanced/data-source-selector */ "jimu-ui/advanced/data-source-selector");
/* harmony import */ var jimu_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jimu-ui */ "jimu-ui");
/** @jsx jsx */
/** @jsxFrag React.Fragment */




const styles = (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.css) `
  & * {
    writing-mode: horizontal-tb !important;
    white-space: normal !important;
    word-break: normal !important;
  }
  .jimu-ui_setting-row__label { min-width: 160px; }
`;
const anosValidos = (anos) => {
    const min = 2019, max = 2030;
    return Array.from(new Set(anos))
        .filter((a) => Number.isFinite(a))
        .filter((a) => a >= min && a <= max)
        .sort((a, b) => a - b);
};
const parseCsvAnos = (value) => {
    const nums = value
        .split(/[,\s;]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => Number(s));
    return anosValidos(nums);
};
const Setting = (props) => {
    var _a;
    const { id, useDataSources, useMapWidgetIds, onSettingChange, config } = props;
    const anos = (_a = config === null || config === void 0 ? void 0 : config.anosProdes) !== null && _a !== void 0 ? _a : [];
    const handleDataSourceChange = (newUseDataSources) => {
        onSettingChange === null || onSettingChange === void 0 ? void 0 : onSettingChange({ id, useDataSources: (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.Immutable)(newUseDataSources) });
    };
    const handleAnosChange = (value) => {
        const novosAnos = parseCsvAnos(value);
        onSettingChange === null || onSettingChange === void 0 ? void 0 : onSettingChange({ id, config: Object.assign(Object.assign({}, config), { anosProdes: novosAnos }) });
    };
    const handleMapWidgetSelect = (ids) => {
        onSettingChange === null || onSettingChange === void 0 ? void 0 : onSettingChange({ id, useMapWidgetIds: ids });
    };
    return ((0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "widget-setting-relatorio-mcr", css: styles },
        (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_1__.SettingSection, { title: "Dados" },
            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_1__.SettingRow, { label: "Selecionar camada (Feature Layer)" },
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_data_source_selector__WEBPACK_IMPORTED_MODULE_2__.DataSourceSelector, { isMultiple: false, mustUseDataSource: true, types: (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.Immutable)([jimu_core__WEBPACK_IMPORTED_MODULE_0__.AllDataSourceTypes.FeatureLayer]), useDataSources: useDataSources, onChange: handleDataSourceChange, widgetId: id })),
            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_1__.SettingRow, { label: "Anos PRODES (CSV)" },
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { display: 'flex', flexDirection: 'column', gap: 6, width: '100%' } },
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_3__.TextInput, { size: "sm", placeholder: "Ex.: 2023, 2024", defaultValue: anos.join(', '), onAcceptValue: handleAnosChange }),
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { fontSize: 12, color: '#6b6b6b' } },
                        "Informe anos entre 2019 e 2030 separados por v\u00EDrgula. Ex.: ",
                        (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("code", null, "2023, 2024"))))),
        (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_1__.SettingSection, { title: "Mapa no PDF" },
            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_1__.SettingRow, { label: "Widget de mapa" },
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_1__.MapWidgetSelector, { useMapWidgetIds: useMapWidgetIds, onSelect: handleMapWidgetSelect, autoSelect: true, showLabel: true })),
            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { fontSize: 12, color: '#6b6b6b', padding: '0 16px 8px' } }, "O relat\u00F3rio inclui uma captura do mapa com o zoom da fei\u00E7\u00E3o selecionada. Vincule o mesmo mapa da experience ou deixe em branco para detectar automaticamente."))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Setting);
function __set_webpack_public_path__(url) { __webpack_require__.p = url; }

})();

/******/ 	return __webpack_exports__;
/******/ })()

			);
		}
	};
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0cy9yZWxhdG9yaW9fTUNSL2Rpc3Qvc2V0dGluZy9zZXR0aW5nLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7Ozs7Ozs7O0FDQUE7OztLQUdLO0FBQ0wscUJBQXVCLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSG5ELGVBQWU7QUFDZiw4QkFBOEI7QUFLWjtBQUNpRjtBQUN6QjtBQUN2QztBQVduQyxNQUFNLE1BQU0sR0FBRyw4Q0FBRzs7Ozs7OztDQU9qQjtBQUVELE1BQU0sV0FBVyxHQUFHLENBQUMsSUFBYyxFQUFFLEVBQUU7SUFDckMsTUFBTSxHQUFHLEdBQUcsSUFBSSxFQUFFLEdBQUcsR0FBRyxJQUFJO0lBQzVCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUM7U0FD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QyxLQUFLLEVBQUMsZ0JBQWdCO2dCQUNoQywrQ0FBQyxrRkFBaUIsSUFDaEIsZUFBZSxFQUFFLGVBQWUsRUFDaEMsUUFBUSxFQUFFLHFCQUFxQixFQUMvQixVQUFVLFFBQ1YsU0FBUyxTQUNULENBQ1M7WUFDYix3REFBSyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxtTEFHL0QsQ0FDUyxDQUNiLENBQ1A7QUFDSCxDQUFDO0FBRUQsaUVBQWUsT0FBTztBQUVkLFNBQVMsMkJBQTJCLENBQUMsR0FBRyxJQUFJLHFCQUF1QixHQUFHLEdBQUcsRUFBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZXhiLWNsaWVudC9leHRlcm5hbCBzeXN0ZW0gXCJqaW11LWNvcmVcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtdWlcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtdWkvYWR2YW5jZWQvZGF0YS1zb3VyY2Utc2VsZWN0b3JcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtdWkvYWR2YW5jZWQvc2V0dGluZy1jb21wb25lbnRzXCIiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL2ppbXUtY29yZS9saWIvc2V0LXB1YmxpYy1wYXRoLnRzIiwid2VicGFjazovL2V4Yi1jbGllbnQvLi95b3VyLWV4dGVuc2lvbnMvd2lkZ2V0cy9yZWxhdG9yaW9fTUNSL3NyYy9zZXR0aW5nL3NldHRpbmcudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X2NvcmVfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfamltdV91aV9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X3VpX2FkdmFuY2VkX2RhdGFfc291cmNlX3NlbGVjdG9yX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2ppbXVfdWlfYWR2YW5jZWRfc2V0dGluZ19jb21wb25lbnRzX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiOyIsIi8qKlxyXG4gKiBXZWJwYWNrIHdpbGwgcmVwbGFjZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB3aXRoIF9fd2VicGFja19yZXF1aXJlX18ucCB0byBzZXQgdGhlIHB1YmxpYyBwYXRoIGR5bmFtaWNhbGx5LlxyXG4gKiBUaGUgcmVhc29uIHdoeSB3ZSBjYW4ndCBzZXQgdGhlIHB1YmxpY1BhdGggaW4gd2VicGFjayBjb25maWcgaXM6IHdlIGNoYW5nZSB0aGUgcHVibGljUGF0aCB3aGVuIGRvd25sb2FkLlxyXG4gKiAqL1xyXG5fX3dlYnBhY2tfcHVibGljX3BhdGhfXyA9IHdpbmRvdy5qaW11Q29uZmlnLmJhc2VVcmxcclxuIiwiXHJcbi8qKiBAanN4IGpzeCAqL1xyXG4vKiogQGpzeEZyYWcgUmVhY3QuRnJhZ21lbnQgKi9cclxuaW1wb3J0IHtcclxuICBSZWFjdCwganN4LCBjc3MsIEltbXV0YWJsZSxcclxuICB0eXBlIEltbXV0YWJsZUFycmF5LCB0eXBlIFVzZURhdGFTb3VyY2UsXHJcbiAgQWxsRGF0YVNvdXJjZVR5cGVzXHJcbn0gZnJvbSAnamltdS1jb3JlJ1xyXG5pbXBvcnQgeyBTZXR0aW5nU2VjdGlvbiwgU2V0dGluZ1JvdywgTWFwV2lkZ2V0U2VsZWN0b3IgfSBmcm9tICdqaW11LXVpL2FkdmFuY2VkL3NldHRpbmctY29tcG9uZW50cydcclxuaW1wb3J0IHsgRGF0YVNvdXJjZVNlbGVjdG9yIH0gZnJvbSAnamltdS11aS9hZHZhbmNlZC9kYXRhLXNvdXJjZS1zZWxlY3RvcidcclxuaW1wb3J0IHsgVGV4dElucHV0IH0gZnJvbSAnamltdS11aSdcclxuaW1wb3J0IHsgdHlwZSBJTUNvbmZpZyB9IGZyb20gJy4uL2NvbmZpZydcclxuXHJcbmludGVyZmFjZSBQcm9wcyB7XHJcbiAgaWQ6IHN0cmluZ1xyXG4gIHVzZURhdGFTb3VyY2VzPzogSW1tdXRhYmxlQXJyYXk8VXNlRGF0YVNvdXJjZT5cclxuICB1c2VNYXBXaWRnZXRJZHM/OiBJbW11dGFibGVBcnJheTxzdHJpbmc+XHJcbiAgb25TZXR0aW5nQ2hhbmdlPzogKHNldHRpbmc6IGFueSkgPT4gdm9pZFxyXG4gIGNvbmZpZz86IElNQ29uZmlnXHJcbn1cclxuXHJcbmNvbnN0IHN0eWxlcyA9IGNzc2BcclxuICAmICoge1xyXG4gICAgd3JpdGluZy1tb2RlOiBob3Jpem9udGFsLXRiICFpbXBvcnRhbnQ7XHJcbiAgICB3aGl0ZS1zcGFjZTogbm9ybWFsICFpbXBvcnRhbnQ7XHJcbiAgICB3b3JkLWJyZWFrOiBub3JtYWwgIWltcG9ydGFudDtcclxuICB9XHJcbiAgLmppbXUtdWlfc2V0dGluZy1yb3dfX2xhYmVsIHsgbWluLXdpZHRoOiAxNjBweDsgfVxyXG5gXHJcblxyXG5jb25zdCBhbm9zVmFsaWRvcyA9IChhbm9zOiBudW1iZXJbXSkgPT4ge1xyXG4gIGNvbnN0IG1pbiA9IDIwMTksIG1heCA9IDIwMzBcclxuICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFub3MpKVxyXG4gICAgLmZpbHRlcigoYSkgPT4gTnVtYmVyLmlzRmluaXRlKGEpKVxyXG4gICAgLmZpbHRlcigoYSkgPT4gYSA+PSBtaW4gJiYgYSA8PSBtYXgpXHJcbiAgICAuc29ydCgoYSwgYikgPT4gYSAtIGIpXHJcbn1cclxuXHJcbmNvbnN0IHBhcnNlQ3N2QW5vcyA9ICh2YWx1ZTogc3RyaW5nKSA9PiB7XHJcbiAgY29uc3QgbnVtcyA9IHZhbHVlXHJcbiAgICAuc3BsaXQoL1ssXFxzO10rLylcclxuICAgIC5tYXAoKHMpID0+IHMudHJpbSgpKVxyXG4gICAgLmZpbHRlcihCb29sZWFuKVxyXG4gICAgLm1hcCgocykgPT4gTnVtYmVyKHMpKVxyXG4gIHJldHVybiBhbm9zVmFsaWRvcyhudW1zKVxyXG59XHJcblxyXG5jb25zdCBTZXR0aW5nID0gKHByb3BzOiBQcm9wcykgPT4ge1xyXG4gIGNvbnN0IHsgaWQsIHVzZURhdGFTb3VyY2VzLCB1c2VNYXBXaWRnZXRJZHMsIG9uU2V0dGluZ0NoYW5nZSwgY29uZmlnIH0gPSBwcm9wc1xyXG4gIGNvbnN0IGFub3MgPSBjb25maWc/LmFub3NQcm9kZXMgPz8gW11cclxuXHJcbiAgY29uc3QgaGFuZGxlRGF0YVNvdXJjZUNoYW5nZSA9IChuZXdVc2VEYXRhU291cmNlczogVXNlRGF0YVNvdXJjZVtdKSA9PiB7XHJcbiAgICBvblNldHRpbmdDaGFuZ2U/Lih7IGlkLCB1c2VEYXRhU291cmNlczogSW1tdXRhYmxlKG5ld1VzZURhdGFTb3VyY2VzKSB9KVxyXG4gIH1cclxuXHJcbiAgY29uc3QgaGFuZGxlQW5vc0NoYW5nZSA9ICh2YWx1ZTogc3RyaW5nKSA9PiB7XHJcbiAgICBjb25zdCBub3Zvc0Fub3MgPSBwYXJzZUNzdkFub3ModmFsdWUpXHJcbiAgICBvblNldHRpbmdDaGFuZ2U/Lih7IGlkLCBjb25maWc6IHsgLi4uY29uZmlnLCBhbm9zUHJvZGVzOiBub3Zvc0Fub3MgfSB9KVxyXG4gIH1cclxuXHJcbiAgY29uc3QgaGFuZGxlTWFwV2lkZ2V0U2VsZWN0ID0gKGlkczogc3RyaW5nW10pID0+IHtcclxuICAgIG9uU2V0dGluZ0NoYW5nZT8uKHsgaWQsIHVzZU1hcFdpZGdldElkczogaWRzIH0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ3aWRnZXQtc2V0dGluZy1yZWxhdG9yaW8tbWNyXCIgY3NzPXtzdHlsZXN9PlxyXG4gICAgICA8U2V0dGluZ1NlY3Rpb24gdGl0bGU9XCJEYWRvc1wiPlxyXG4gICAgICAgIDxTZXR0aW5nUm93IGxhYmVsPVwiU2VsZWNpb25hciBjYW1hZGEgKEZlYXR1cmUgTGF5ZXIpXCI+XHJcbiAgICAgICAgICA8RGF0YVNvdXJjZVNlbGVjdG9yXHJcbiAgICAgICAgICAgIGlzTXVsdGlwbGU9e2ZhbHNlfVxyXG4gICAgICAgICAgICBtdXN0VXNlRGF0YVNvdXJjZVxyXG4gICAgICAgICAgICB0eXBlcz17SW1tdXRhYmxlKFtBbGxEYXRhU291cmNlVHlwZXMuRmVhdHVyZUxheWVyXSl9XHJcbiAgICAgICAgICAgIHVzZURhdGFTb3VyY2VzPXt1c2VEYXRhU291cmNlc31cclxuICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZURhdGFTb3VyY2VDaGFuZ2V9XHJcbiAgICAgICAgICAgIHdpZGdldElkPXtpZH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9TZXR0aW5nUm93PlxyXG5cclxuICAgICAgICA8U2V0dGluZ1JvdyBsYWJlbD1cIkFub3MgUFJPREVTIChDU1YpXCI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogNiwgd2lkdGg6ICcxMDAlJyB9fT5cclxuICAgICAgICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgICAgICAgIHNpemU9XCJzbVwiXHJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFeC46IDIwMjMsIDIwMjRcIlxyXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17YW5vcy5qb2luKCcsICcpfVxyXG4gICAgICAgICAgICAgIG9uQWNjZXB0VmFsdWU9e2hhbmRsZUFub3NDaGFuZ2V9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6IDEyLCBjb2xvcjogJyM2YjZiNmInIH19PlxyXG4gICAgICAgICAgICAgIEluZm9ybWUgYW5vcyBlbnRyZSAyMDE5IGUgMjAzMCBzZXBhcmFkb3MgcG9yIHbDrXJndWxhLiBFeC46IDxjb2RlPjIwMjMsIDIwMjQ8L2NvZGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9TZXR0aW5nUm93PlxyXG4gICAgICA8L1NldHRpbmdTZWN0aW9uPlxyXG5cclxuICAgICAgPFNldHRpbmdTZWN0aW9uIHRpdGxlPVwiTWFwYSBubyBQREZcIj5cclxuICAgICAgICA8U2V0dGluZ1JvdyBsYWJlbD1cIldpZGdldCBkZSBtYXBhXCI+XHJcbiAgICAgICAgICA8TWFwV2lkZ2V0U2VsZWN0b3JcclxuICAgICAgICAgICAgdXNlTWFwV2lkZ2V0SWRzPXt1c2VNYXBXaWRnZXRJZHN9XHJcbiAgICAgICAgICAgIG9uU2VsZWN0PXtoYW5kbGVNYXBXaWRnZXRTZWxlY3R9XHJcbiAgICAgICAgICAgIGF1dG9TZWxlY3RcclxuICAgICAgICAgICAgc2hvd0xhYmVsXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvU2V0dGluZ1Jvdz5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAxMiwgY29sb3I6ICcjNmI2YjZiJywgcGFkZGluZzogJzAgMTZweCA4cHgnIH19PlxyXG4gICAgICAgICAgTyByZWxhdMOzcmlvIGluY2x1aSB1bWEgY2FwdHVyYSBkbyBtYXBhIGNvbSBvIHpvb20gZGEgZmVpw6fDo28gc2VsZWNpb25hZGEuXHJcbiAgICAgICAgICBWaW5jdWxlIG8gbWVzbW8gbWFwYSBkYSBleHBlcmllbmNlIG91IGRlaXhlIGVtIGJyYW5jbyBwYXJhIGRldGVjdGFyIGF1dG9tYXRpY2FtZW50ZS5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9TZXR0aW5nU2VjdGlvbj5cclxuICAgIDwvZGl2PlxyXG4gIClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2V0dGluZ1xyXG5cbiBleHBvcnQgZnVuY3Rpb24gX19zZXRfd2VicGFja19wdWJsaWNfcGF0aF9fKHVybCkgeyBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyA9IHVybCB9Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9