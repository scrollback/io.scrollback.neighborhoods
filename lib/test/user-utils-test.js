/* eslint-env mocha */

"use strict";

var userUtils = require("../user-utils.js");
var assert = require('assert');

describe("User utils test", function() {
    describe("string as argument", function() {
        it("id of non guest user", function() {
            assert(!userUtils.isGuest("brucewayne"), "returned true instead of false for non guest");
        });
        it("id of non guest user", function() {
            assert(!userUtils.isGuest("brucewayne-guest"), "returned true instead of false for non guest");
        });
        it("non guest user", function() {
            assert(userUtils.isGuest("guest-brucewayne"), "returned false instead of true for guest");
        });
        it("empty string", function() {
            assert(!userUtils.isGuest(""), "returned true instead of false for empty string");
        });
    });
    describe("object as argument", function() {
        it("identities with just email", function() {
            assert(!userUtils.isGuest({
                id:"brucewayne",
                identities: ["mailto:brucewayne@wayneenterprises.com"]
            }), "returned true instead of false for non guest");
        });

        it("identities with just guest", function() {
            assert(userUtils.isGuest({
                id:"guest-brucewayne",
                identities: ["guest:guest-brucewayne"]
            }), "returned false instead of true for non guest");
        });

        it("identities with guest and email identities ", function() {
            assert(userUtils.isGuest({
                id:"guest-brucewayne",
                identities: ["guest:guest-brucewayne","mailto:brucewayne@wayneenterprises.com"]
            }), "returned false instead of true for non guest");
        });

        it("identities with guest and email identities ", function() {
            assert(userUtils.isGuest({
                id:"guest-brucewayne",
                identities: ["mailto:brucewayne@wayneenterprises.com", "guest:guest-brucewayne"]
            }), "returned false instead of true for non guest");
        });
        it("guest with no identities", function() {
            assert(userUtils.isGuest({
                id:"guest-brucewayne",
            }), "returned false instead of true for non guest");
        });
        it("non guest with no identities", function() {
            assert(!userUtils.isGuest({
                id:"brucewayne",
            }), "returned true instead of false for non guest");
        });
    });
});
