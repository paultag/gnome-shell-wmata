const Gio = imports.gi.Gio;
const Lang = imports.lang;
const GLib = imports.gi.GLib;

const WMATAInterface = '<node name="/org/anized/wmata"><interface name="org.anized.wmata.Rail"><method name="NextTrains"><arg type="as" direction="in"></arg><arg type="aa{ss}" direction="out"></arg></method></interface><interface name="org.freedesktop.DBus.Introspectable"><method name="Introspect"><arg name="out" type="s" direction="out"></arg></method></interface></node>';


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

    GetNextTrains: function(stops) {
        var ret = {"predictions": [], "error": null};
        try {
            ret.predictions = this.proxy.NextTrainsSync(stops)[0];
        } catch (e) {
            ret.error = e;
        }
        return ret;
    }
});

var railProxy = new WMATARailProxy();
log(railProxy.GetNextTrains(["A03"]).predictions.map(function(e) {
    return e.cars + ", " + e.desitnation;
}));
