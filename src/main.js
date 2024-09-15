"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var GtiHubAPIcaller_1 = require("./GtiHubAPIcaller");
var npmAPICaller_1 = require("./npmAPICaller");
// Determine if the URL is for GitHub or NPM
function isGitHubURL(url) {
    return url.includes('github.com');
}
function isNPMURL(url) {
    return url.includes('npmjs.com');
}
function main(url) {
    return __awaiter(this, void 0, void 0, function () {
        var owner, repository, repositoryInfo, repositoryIssues, repositoryUsers, error_1, packageName, packageInfo, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!url) {
                        console.log('Please provide a URL.');
                        return [2 /*return*/];
                    }
                    if (!isGitHubURL(url)) return [3 /*break*/, 7];
                    owner = 'ECE-461-Team-16';
                    repository = 'ACME-Project';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, (0, GtiHubAPIcaller_1.default)(owner, repository)];
                case 2:
                    repositoryInfo = _a.sent();
                    return [4 /*yield*/, (0, GtiHubAPIcaller_1.fetchRepositoryIssues)(owner, repository)];
                case 3:
                    repositoryIssues = _a.sent();
                    return [4 /*yield*/, (0, GtiHubAPIcaller_1.fetchRepositoryUsers)(owner, repository)];
                case 4:
                    repositoryUsers = _a.sent();
                    (0, GtiHubAPIcaller_1.printRepositoryInfo)(repositoryInfo);
                    (0, GtiHubAPIcaller_1.printRepositoryIssues)(repositoryIssues);
                    (0, GtiHubAPIcaller_1.printRepositoryUsers)(repositoryUsers);
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('GitHub Error:', error_1);
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 13];
                case 7:
                    if (!isNPMURL(url)) return [3 /*break*/, 12];
                    packageName = url.split('/').pop();
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, (0, npmAPICaller_1.fetchNPMPackageInfo)(packageName || 'browserify')];
                case 9:
                    packageInfo = _a.sent();
                    (0, npmAPICaller_1.printNPMPackageInfo)(packageInfo);
                    return [3 /*break*/, 11];
                case 10:
                    error_2 = _a.sent();
                    console.error('NPM Error:', error_2);
                    return [3 /*break*/, 11];
                case 11: return [3 /*break*/, 13];
                case 12:
                    console.log('Unsupported URL format.');
                    _a.label = 13;
                case 13: return [2 /*return*/];
            }
        });
    });
}
// Call the function with a different URL for testing purposes
// main('https://www.npmjs.com/package/browserify');
main('https://www.npmjs.com/package/express');
