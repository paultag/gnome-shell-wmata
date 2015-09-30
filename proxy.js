/* {{{ Copyright (c) Paul R. Tagliamonte <paultag@dc.cant.vote>, 2015
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE. }}} */

const Gio = imports.gi.Gio;
const Lang = imports.lang;
const GLib = imports.gi.GLib;

const WMATAInterface = '<node name="/org/anized/wmata"><interface name="org.anized.wmata.Rail"><method name="NextLocalTrains"><arg type="aa{ss}" direction="out"></arg></method><method name="NextTrains"><arg type="as" direction="in"></arg><arg type="aa{ss}" direction="out"></arg></method></interface><interface name="org.freedesktop.DBus.Introspectable"><method name="Introspect"><arg name="out" type="s" direction="out"></arg></method></interface></node>';


/**
 * WMATARailProxy is a wrapper around wmatad's dbus server interface,
 * allowing us to invoke methods on the API without having to do the API work
 * ourselves. */
const WMATARailProxy = new Lang.Class({
    Name: "WMATARailProxy",

    _init: function() {
        this.proxyWrapper = Gio.DBusProxy.makeProxyWrapper(WMATAInterface);
        this.proxy = new this.proxyWrapper(
                Gio.DBus.session,
                'org.anized.wmata.Rail',
                '/org/anized/wmata/Rail'
        );
    },

    /**
     * Get the next trains for the given stops (pass an array of station codes,
     * such as ["A03"] for Dupont Circle). */
    GetNextTrains: function(stops) {
        var ret = {"predictions": [], "error": null};
        try {
            ret.predictions = this.proxy.NextTrainsSync(stops)[0];
        } catch (e) {
            ret.error = e;
        }
        return ret;
    },

    /**
     * Get the next trains for the stop that the wmatad thinks we're after
     * by guessing against the network access points sitting around us. */
    GetNextLocalTrains: function() {
        var ret = {"predictions": [], "error": null};
        try {
            ret.predictions = this.proxy.NextLocalTrainsSync()[0];
        } catch (e) {
            ret.error = e;
        }
        return ret;
    }
});

// var railProxy = new WMATARailProxy();
// log(railProxy.GetNextLocalTrains().predictions.map(function(e) {
//     return e.cars + ", " + e.desitnation;
// }));

// vim: foldmethod=marker
