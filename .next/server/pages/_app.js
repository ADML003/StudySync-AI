/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./lib/auth.tsx":
/*!**********************!*\
  !*** ./lib/auth.tsx ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/supabase */ \"./lib/supabase.ts\");\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({\n    user: null,\n    session: null,\n    loading: true,\n    signOut: async ()=>{}\n});\nfunction AuthProvider({ children }) {\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [session, setSession] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Get initial session\n        _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.getSession().then(({ data: { session } })=>{\n            setSession(session);\n            setUser(session?.user ?? null);\n            setLoading(false);\n        });\n        // Listen for auth changes\n        const { data: { subscription } } = _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.onAuthStateChange(async (event, session)=>{\n            setSession(session);\n            setUser(session?.user ?? null);\n            setLoading(false);\n        });\n        return ()=>subscription.unsubscribe();\n    }, []);\n    const signOut = async ()=>{\n        await _lib_supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.signOut();\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            user,\n            session,\n            loading,\n            signOut\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/ADML/Desktop/cerebras/lib/auth.tsx\",\n        lineNumber: 49,\n        columnNumber: 5\n    }, this);\n}\nfunction useAuth() {\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (context === undefined) {\n        throw new Error(\"useAuth must be used within an AuthProvider\");\n    }\n    return context;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvYXV0aC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBdUU7QUFFN0I7QUFTMUMsTUFBTUssNEJBQWNMLG9EQUFhQSxDQUFrQjtJQUNqRE0sTUFBTTtJQUNOQyxTQUFTO0lBQ1RDLFNBQVM7SUFDVEMsU0FBUyxXQUFhO0FBQ3hCO0FBRU8sU0FBU0MsYUFBYSxFQUFFQyxRQUFRLEVBQWlDO0lBQ3RFLE1BQU0sQ0FBQ0wsTUFBTU0sUUFBUSxHQUFHVCwrQ0FBUUEsQ0FBYztJQUM5QyxNQUFNLENBQUNJLFNBQVNNLFdBQVcsR0FBR1YsK0NBQVFBLENBQWlCO0lBQ3ZELE1BQU0sQ0FBQ0ssU0FBU00sV0FBVyxHQUFHWCwrQ0FBUUEsQ0FBQztJQUV2Q0QsZ0RBQVNBLENBQUM7UUFDUixzQkFBc0I7UUFDdEJFLG1EQUFRQSxDQUFDVyxJQUFJLENBQUNDLFVBQVUsR0FBR0MsSUFBSSxDQUFDLENBQUMsRUFBRUMsTUFBTSxFQUFFWCxPQUFPLEVBQUUsRUFBRTtZQUNwRE0sV0FBV047WUFDWEssUUFBUUwsU0FBU0QsUUFBUTtZQUN6QlEsV0FBVztRQUNiO1FBRUEsMEJBQTBCO1FBQzFCLE1BQU0sRUFDSkksTUFBTSxFQUFFQyxZQUFZLEVBQUUsRUFDdkIsR0FBR2YsbURBQVFBLENBQUNXLElBQUksQ0FBQ0ssaUJBQWlCLENBQUMsT0FBT0MsT0FBT2Q7WUFDaERNLFdBQVdOO1lBQ1hLLFFBQVFMLFNBQVNELFFBQVE7WUFDekJRLFdBQVc7UUFDYjtRQUVBLE9BQU8sSUFBTUssYUFBYUcsV0FBVztJQUN2QyxHQUFHLEVBQUU7SUFFTCxNQUFNYixVQUFVO1FBQ2QsTUFBTUwsbURBQVFBLENBQUNXLElBQUksQ0FBQ04sT0FBTztJQUM3QjtJQUVBLHFCQUNFLDhEQUFDSixZQUFZa0IsUUFBUTtRQUFDQyxPQUFPO1lBQUVsQjtZQUFNQztZQUFTQztZQUFTQztRQUFRO2tCQUM1REU7Ozs7OztBQUdQO0FBRU8sU0FBU2M7SUFDZCxNQUFNQyxVQUFVekIsaURBQVVBLENBQUNJO0lBQzNCLElBQUlxQixZQUFZQyxXQUFXO1FBQ3pCLE1BQU0sSUFBSUMsTUFBTTtJQUNsQjtJQUNBLE9BQU9GO0FBQ1QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jZXJlYnJhcy1hcHAvLi9saWIvYXV0aC50c3g/ZjU0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBVc2VyLCBTZXNzaW9uIH0gZnJvbSBcIkBzdXBhYmFzZS9zdXBhYmFzZS1qc1wiO1xuaW1wb3J0IHsgc3VwYWJhc2UgfSBmcm9tIFwiQC9saWIvc3VwYWJhc2VcIjtcblxudHlwZSBBdXRoQ29udGV4dFR5cGUgPSB7XG4gIHVzZXI6IFVzZXIgfCBudWxsO1xuICBzZXNzaW9uOiBTZXNzaW9uIHwgbnVsbDtcbiAgbG9hZGluZzogYm9vbGVhbjtcbiAgc2lnbk91dDogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbn07XG5cbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxBdXRoQ29udGV4dFR5cGU+KHtcbiAgdXNlcjogbnVsbCxcbiAgc2Vzc2lvbjogbnVsbCxcbiAgbG9hZGluZzogdHJ1ZSxcbiAgc2lnbk91dDogYXN5bmMgKCkgPT4ge30sXG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhQcm92aWRlcih7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSB7XG4gIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlPFVzZXIgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW3Nlc3Npb24sIHNldFNlc3Npb25dID0gdXNlU3RhdGU8U2Vzc2lvbiB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIEdldCBpbml0aWFsIHNlc3Npb25cbiAgICBzdXBhYmFzZS5hdXRoLmdldFNlc3Npb24oKS50aGVuKCh7IGRhdGE6IHsgc2Vzc2lvbiB9IH0pID0+IHtcbiAgICAgIHNldFNlc3Npb24oc2Vzc2lvbik7XG4gICAgICBzZXRVc2VyKHNlc3Npb24/LnVzZXIgPz8gbnVsbCk7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIC8vIExpc3RlbiBmb3IgYXV0aCBjaGFuZ2VzXG4gICAgY29uc3Qge1xuICAgICAgZGF0YTogeyBzdWJzY3JpcHRpb24gfSxcbiAgICB9ID0gc3VwYWJhc2UuYXV0aC5vbkF1dGhTdGF0ZUNoYW5nZShhc3luYyAoZXZlbnQsIHNlc3Npb24pID0+IHtcbiAgICAgIHNldFNlc3Npb24oc2Vzc2lvbik7XG4gICAgICBzZXRVc2VyKHNlc3Npb24/LnVzZXIgPz8gbnVsbCk7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IHNpZ25PdXQgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgc3VwYWJhc2UuYXV0aC5zaWduT3V0KCk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgdXNlciwgc2Vzc2lvbiwgbG9hZGluZywgc2lnbk91dCB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlQXV0aCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoQXV0aENvbnRleHQpO1xuICBpZiAoY29udGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidXNlQXV0aCBtdXN0IGJlIHVzZWQgd2l0aGluIGFuIEF1dGhQcm92aWRlclwiKTtcbiAgfVxuICByZXR1cm4gY29udGV4dDtcbn1cbiJdLCJuYW1lcyI6WyJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwic3VwYWJhc2UiLCJBdXRoQ29udGV4dCIsInVzZXIiLCJzZXNzaW9uIiwibG9hZGluZyIsInNpZ25PdXQiLCJBdXRoUHJvdmlkZXIiLCJjaGlsZHJlbiIsInNldFVzZXIiLCJzZXRTZXNzaW9uIiwic2V0TG9hZGluZyIsImF1dGgiLCJnZXRTZXNzaW9uIiwidGhlbiIsImRhdGEiLCJzdWJzY3JpcHRpb24iLCJvbkF1dGhTdGF0ZUNoYW5nZSIsImV2ZW50IiwidW5zdWJzY3JpYmUiLCJQcm92aWRlciIsInZhbHVlIiwidXNlQXV0aCIsImNvbnRleHQiLCJ1bmRlZmluZWQiLCJFcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lib/auth.tsx\n");

/***/ }),

/***/ "./lib/supabase.ts":
/*!*************************!*\
  !*** ./lib/supabase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);\n\nconst supabaseUrl = \"https://fpkxqbzaxpihkeysmhsv.supabase.co\";\nconst supabaseAnonKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwa3hxYnpheHBpaGtleXNtaHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTU1NDIsImV4cCI6MjA3NDczMTU0Mn0.y0D-xq9aj1BvFilzKG2Jjq8NNO5h6JWwqZDrKqRoCIs\";\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvc3VwYWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXFEO0FBRXJELE1BQU1DLGNBQWNDLDBDQUFvQztBQUN4RCxNQUFNRyxrQkFBa0JILGtOQUF5QztBQUUxRCxNQUFNSyxXQUFXUCxtRUFBWUEsQ0FBQ0MsYUFBYUksaUJBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2VyZWJyYXMtYXBwLy4vbGliL3N1cGFiYXNlLnRzP2M5OWYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSBcIkBzdXBhYmFzZS9zdXBhYmFzZS1qc1wiO1xuXG5jb25zdCBzdXBhYmFzZVVybCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCE7XG5jb25zdCBzdXBhYmFzZUFub25LZXkgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSE7XG5cbmV4cG9ydCBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudChzdXBhYmFzZVVybCwgc3VwYWJhc2VBbm9uS2V5KTtcblxuZXhwb3J0IHR5cGUgUHJvZmlsZSA9IHtcbiAgaWQ6IHN0cmluZztcbiAgZW1haWw6IHN0cmluZztcbiAgZnVsbF9uYW1lPzogc3RyaW5nO1xuICBhdmF0YXJfdXJsPzogc3RyaW5nO1xuICBjcmVhdGVkX2F0OiBzdHJpbmc7XG4gIHVwZGF0ZWRfYXQ6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFN0dWR5UGxhbiA9IHtcbiAgaWQ6IHN0cmluZztcbiAgdXNlcl9pZDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgZGlmZmljdWx0eTogXCJiZWdpbm5lclwiIHwgXCJpbnRlcm1lZGlhdGVcIiB8IFwiYWR2YW5jZWRcIjtcbiAgZXN0aW1hdGVkX2hvdXJzOiBudW1iZXI7XG4gIHRvcGljczogc3RyaW5nW107XG4gIGNyZWF0ZWRfYXQ6IHN0cmluZztcbiAgdXBkYXRlZF9hdDogc3RyaW5nO1xuICBzdGF0dXM6IFwiYWN0aXZlXCIgfCBcImNvbXBsZXRlZFwiIHwgXCJwYXVzZWRcIjtcbn07XG5cbmV4cG9ydCB0eXBlIFF1aXpSZXN1bHQgPSB7XG4gIGlkOiBzdHJpbmc7XG4gIHVzZXJfaWQ6IHN0cmluZztcbiAgdG9waWM6IHN0cmluZztcbiAgc2NvcmU6IG51bWJlcjtcbiAgdG90YWxfcXVlc3Rpb25zOiBudW1iZXI7XG4gIGRpZmZpY3VsdHk6IFwiZWFzeVwiIHwgXCJtZWRpdW1cIiB8IFwiaGFyZFwiO1xuICB0aW1lX3Rha2VuOiBudW1iZXI7XG4gIGNvbXBsZXRlZF9hdDogc3RyaW5nO1xufTtcbiJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnQiLCJzdXBhYmFzZVVybCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwiLCJzdXBhYmFzZUFub25LZXkiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSIsInN1cGFiYXNlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./lib/supabase.ts\n");

/***/ }),

/***/ "./lib/theme.tsx":
/*!***********************!*\
  !*** ./lib/theme.tsx ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ThemeProvider: () => (/* binding */ ThemeProvider),\n/* harmony export */   useThemeContext: () => (/* binding */ useThemeContext)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst ThemeContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({\n    theme: \"light\",\n    toggleTheme: ()=>{}\n});\nfunction ThemeProvider({ children }) {\n    const [theme, setTheme] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"light\");\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Get theme from localStorage or system preference\n        const savedTheme = localStorage.getItem(\"theme\");\n        const systemTheme = window.matchMedia(\"(prefers-color-scheme: dark)\").matches ? \"dark\" : \"light\";\n        const initialTheme = savedTheme || systemTheme;\n        setTheme(initialTheme);\n        document.documentElement.classList.toggle(\"dark\", initialTheme === \"dark\");\n    }, []);\n    const toggleTheme = ()=>{\n        const newTheme = theme === \"light\" ? \"dark\" : \"light\";\n        setTheme(newTheme);\n        localStorage.setItem(\"theme\", newTheme);\n        document.documentElement.classList.toggle(\"dark\", newTheme === \"dark\");\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(ThemeContext.Provider, {\n        value: {\n            theme,\n            toggleTheme\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/ADML/Desktop/cerebras/lib/theme.tsx\",\n        lineNumber: 39,\n        columnNumber: 5\n    }, this);\n}\nfunction useThemeContext() {\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ThemeContext);\n    if (context === undefined) {\n        throw new Error(\"useTheme must be used within a ThemeProvider\");\n    }\n    return context;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvdGhlbWUudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBdUU7QUFTdkUsTUFBTUksNkJBQWVKLG9EQUFhQSxDQUFtQjtJQUNuREssT0FBTztJQUNQQyxhQUFhLEtBQU87QUFDdEI7QUFFTyxTQUFTQyxjQUFjLEVBQUVDLFFBQVEsRUFBaUM7SUFDdkUsTUFBTSxDQUFDSCxPQUFPSSxTQUFTLEdBQUdOLCtDQUFRQSxDQUFRO0lBRTFDRCxnREFBU0EsQ0FBQztRQUNSLG1EQUFtRDtRQUNuRCxNQUFNUSxhQUFhQyxhQUFhQyxPQUFPLENBQUM7UUFDeEMsTUFBTUMsY0FBY0MsT0FBT0MsVUFBVSxDQUFDLGdDQUNuQ0MsT0FBTyxHQUNOLFNBQ0E7UUFDSixNQUFNQyxlQUFlUCxjQUFjRztRQUVuQ0osU0FBU1E7UUFDVEMsU0FBU0MsZUFBZSxDQUFDQyxTQUFTLENBQUNDLE1BQU0sQ0FBQyxRQUFRSixpQkFBaUI7SUFDckUsR0FBRyxFQUFFO0lBRUwsTUFBTVgsY0FBYztRQUNsQixNQUFNZ0IsV0FBV2pCLFVBQVUsVUFBVSxTQUFTO1FBQzlDSSxTQUFTYTtRQUNUWCxhQUFhWSxPQUFPLENBQUMsU0FBU0Q7UUFDOUJKLFNBQVNDLGVBQWUsQ0FBQ0MsU0FBUyxDQUFDQyxNQUFNLENBQUMsUUFBUUMsYUFBYTtJQUNqRTtJQUVBLHFCQUNFLDhEQUFDbEIsYUFBYW9CLFFBQVE7UUFBQ0MsT0FBTztZQUFFcEI7WUFBT0M7UUFBWTtrQkFDaERFOzs7Ozs7QUFHUDtBQUVPLFNBQVNrQjtJQUNkLE1BQU1DLFVBQVUxQixpREFBVUEsQ0FBQ0c7SUFDM0IsSUFBSXVCLFlBQVlDLFdBQVc7UUFDekIsTUFBTSxJQUFJQyxNQUFNO0lBQ2xCO0lBQ0EsT0FBT0Y7QUFDVCIsInNvdXJjZXMiOlsid2VicGFjazovL2NlcmVicmFzLWFwcC8uL2xpYi90aGVtZS50c3g/NGY1OCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5cbnR5cGUgVGhlbWUgPSBcImxpZ2h0XCIgfCBcImRhcmtcIjtcblxudHlwZSBUaGVtZUNvbnRleHRUeXBlID0ge1xuICB0aGVtZTogVGhlbWU7XG4gIHRvZ2dsZVRoZW1lOiAoKSA9PiB2b2lkO1xufTtcblxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxUaGVtZUNvbnRleHRUeXBlPih7XG4gIHRoZW1lOiBcImxpZ2h0XCIsXG4gIHRvZ2dsZVRoZW1lOiAoKSA9PiB7fSxcbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gVGhlbWVQcm92aWRlcih7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSB7XG4gIGNvbnN0IFt0aGVtZSwgc2V0VGhlbWVdID0gdXNlU3RhdGU8VGhlbWU+KFwibGlnaHRcIik7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBHZXQgdGhlbWUgZnJvbSBsb2NhbFN0b3JhZ2Ugb3Igc3lzdGVtIHByZWZlcmVuY2VcbiAgICBjb25zdCBzYXZlZFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0aGVtZVwiKSBhcyBUaGVtZSB8IG51bGw7XG4gICAgY29uc3Qgc3lzdGVtVGhlbWUgPSB3aW5kb3cubWF0Y2hNZWRpYShcIihwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyaylcIilcbiAgICAgIC5tYXRjaGVzXG4gICAgICA/IFwiZGFya1wiXG4gICAgICA6IFwibGlnaHRcIjtcbiAgICBjb25zdCBpbml0aWFsVGhlbWUgPSBzYXZlZFRoZW1lIHx8IHN5c3RlbVRoZW1lO1xuXG4gICAgc2V0VGhlbWUoaW5pdGlhbFRoZW1lKTtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImRhcmtcIiwgaW5pdGlhbFRoZW1lID09PSBcImRhcmtcIik7XG4gIH0sIFtdKTtcblxuICBjb25zdCB0b2dnbGVUaGVtZSA9ICgpID0+IHtcbiAgICBjb25zdCBuZXdUaGVtZSA9IHRoZW1lID09PSBcImxpZ2h0XCIgPyBcImRhcmtcIiA6IFwibGlnaHRcIjtcbiAgICBzZXRUaGVtZShuZXdUaGVtZSk7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0aGVtZVwiLCBuZXdUaGVtZSk7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJkYXJrXCIsIG5ld1RoZW1lID09PSBcImRhcmtcIik7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8VGhlbWVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IHRoZW1lLCB0b2dnbGVUaGVtZSB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1RoZW1lQ29udGV4dC5Qcm92aWRlcj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVRoZW1lQ29udGV4dCgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcbiAgaWYgKGNvbnRleHQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInVzZVRoZW1lIG11c3QgYmUgdXNlZCB3aXRoaW4gYSBUaGVtZVByb3ZpZGVyXCIpO1xuICB9XG4gIHJldHVybiBjb250ZXh0O1xufVxuIl0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJUaGVtZUNvbnRleHQiLCJ0aGVtZSIsInRvZ2dsZVRoZW1lIiwiVGhlbWVQcm92aWRlciIsImNoaWxkcmVuIiwic2V0VGhlbWUiLCJzYXZlZFRoZW1lIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInN5c3RlbVRoZW1lIiwid2luZG93IiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJpbml0aWFsVGhlbWUiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImNsYXNzTGlzdCIsInRvZ2dsZSIsIm5ld1RoZW1lIiwic2V0SXRlbSIsIlByb3ZpZGVyIiwidmFsdWUiLCJ1c2VUaGVtZUNvbnRleHQiLCJjb250ZXh0IiwidW5kZWZpbmVkIiwiRXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./lib/theme.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _styles_layout_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/styles/layout.css */ \"./styles/layout.css\");\n/* harmony import */ var _styles_layout_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_layout_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/auth */ \"./lib/auth.tsx\");\n/* harmony import */ var _lib_theme__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/theme */ \"./lib/theme.tsx\");\n/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-hot-toast */ \"react-hot-toast\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([react_hot_toast__WEBPACK_IMPORTED_MODULE_5__]);\nreact_hot_toast__WEBPACK_IMPORTED_MODULE_5__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_lib_theme__WEBPACK_IMPORTED_MODULE_4__.ThemeProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_lib_auth__WEBPACK_IMPORTED_MODULE_3__.AuthProvider, {\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/Users/ADML/Desktop/cerebras/pages/_app.tsx\",\n                    lineNumber: 12,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_hot_toast__WEBPACK_IMPORTED_MODULE_5__.Toaster, {\n                    position: \"top-right\",\n                    toastOptions: {\n                        duration: 4000,\n                        className: \"dark:bg-gray-800 dark:text-white dark:border-gray-700\",\n                        style: {\n                            background: \"white\",\n                            color: \"black\",\n                            border: \"1px solid #e5e7eb\"\n                        }\n                    }\n                }, void 0, false, {\n                    fileName: \"/Users/ADML/Desktop/cerebras/pages/_app.tsx\",\n                    lineNumber: 13,\n                    columnNumber: 9\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"/Users/ADML/Desktop/cerebras/pages/_app.tsx\",\n            lineNumber: 11,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/ADML/Desktop/cerebras/pages/_app.tsx\",\n        lineNumber: 10,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUM4QjtBQUNEO0FBQ2E7QUFDRTtBQUNGO0FBRTNCLFNBQVNHLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDNUQscUJBQ0UsOERBQUNKLHFEQUFhQTtrQkFDWiw0RUFBQ0QsbURBQVlBOzs4QkFDWCw4REFBQ0k7b0JBQVcsR0FBR0MsU0FBUzs7Ozs7OzhCQUN4Qiw4REFBQ0gsb0RBQU9BO29CQUNOSSxVQUFTO29CQUNUQyxjQUFjO3dCQUNaQyxVQUFVO3dCQUNWQyxXQUFXO3dCQUNYQyxPQUFPOzRCQUNMQyxZQUFZOzRCQUNaQyxPQUFPOzRCQUNQQyxRQUFRO3dCQUNWO29CQUNGOzs7Ozs7Ozs7Ozs7Ozs7OztBQUtWIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2VyZWJyYXMtYXBwLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSBcIm5leHQvYXBwXCI7XG5pbXBvcnQgXCJAL3N0eWxlcy9nbG9iYWxzLmNzc1wiO1xuaW1wb3J0IFwiQC9zdHlsZXMvbGF5b3V0LmNzc1wiO1xuaW1wb3J0IHsgQXV0aFByb3ZpZGVyIH0gZnJvbSBcIkAvbGliL2F1dGhcIjtcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tIFwiQC9saWIvdGhlbWVcIjtcbmltcG9ydCB7IFRvYXN0ZXIgfSBmcm9tIFwicmVhY3QtaG90LXRvYXN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XG4gIHJldHVybiAoXG4gICAgPFRoZW1lUHJvdmlkZXI+XG4gICAgICA8QXV0aFByb3ZpZGVyPlxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICAgIDxUb2FzdGVyXG4gICAgICAgICAgcG9zaXRpb249XCJ0b3AtcmlnaHRcIlxuICAgICAgICAgIHRvYXN0T3B0aW9ucz17e1xuICAgICAgICAgICAgZHVyYXRpb246IDQwMDAsXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFyazpiZy1ncmF5LTgwMCBkYXJrOnRleHQtd2hpdGUgZGFyazpib3JkZXItZ3JheS03MDBcIixcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwid2hpdGVcIixcbiAgICAgICAgICAgICAgY29sb3I6IFwiYmxhY2tcIixcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjZTVlN2ViXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICA8L0F1dGhQcm92aWRlcj5cbiAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiQXV0aFByb3ZpZGVyIiwiVGhlbWVQcm92aWRlciIsIlRvYXN0ZXIiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJwb3NpdGlvbiIsInRvYXN0T3B0aW9ucyIsImR1cmF0aW9uIiwiY2xhc3NOYW1lIiwic3R5bGUiLCJiYWNrZ3JvdW5kIiwiY29sb3IiLCJib3JkZXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "./styles/layout.css":
/*!***************************!*\
  !*** ./styles/layout.css ***!
  \***************************/
/***/ (() => {



/***/ }),

/***/ "@supabase/supabase-js":
/*!****************************************!*\
  !*** external "@supabase/supabase-js" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@supabase/supabase-js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react-hot-toast":
/*!**********************************!*\
  !*** external "react-hot-toast" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = import("react-hot-toast");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();