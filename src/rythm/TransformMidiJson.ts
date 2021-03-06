export class TransformMidiJson {

    public Transform() {
        // Change to midi-file that should be transformed... :-)
        this.loadJSON("assets/audio/enter_darkness/track3.json", (response) => {
        
            var midijson = JSON.parse(response);
            //console.log('JSON Level load:' + response);
            //console.log('JSON Level load:' + JSON.stringify(midijson));

            this.TransformToGameJson(midijson);
        });
    }

    private TransformToGameJson(midijson) {
        console.log('Transform, Midi json is ' + JSON.stringify(midijson));

        var jsonDataGame = { 
            "musicmeta": {
            "title": "TODO-TITLE",
            "path": "TODO-PATH",
            "background": "TODO-BKG",
            "offset": "0",
            "bpm": "0",
            "duration": "0"
            },
            "notes": [
            ]
        };

        jsonDataGame.musicmeta.bpm = midijson.header.bpm;
        jsonDataGame.musicmeta.duration = midijson.duration;

        for(var i = 0; i < midijson.tracks[0].notes.length; i++) {
            var midiobjnote = midijson.tracks[0].notes[i];
            var gameNote = this.GameNote(midiobjnote.name);
            var gameTime = this.ToMilliSeconds(midiobjnote.time);

            var currnote = {[gameTime]: gameNote};

            jsonDataGame.notes.push(currnote);
        }

        console.log("Transformed to GameJson:"+JSON.stringify(jsonDataGame));

        return jsonDataGame;
    }

    private GameNote(midiNote) {
        if(midiNote == "C2") {
            return 0; // blue
        }
        if(midiNote == "D2") {
            return 1; // green 
        }
        if(midiNote == "D#2") {
            return 2; // red
        }
        if(midiNote == "F#2") {
            return 3; // yellow
        }
        return 0;
    }

    private ToMilliSeconds(secondswhole) {
        let secondsAsFloat = parseFloat(secondswhole);
        let secondsWhole = Math.floor(secondsAsFloat);
        let secondsDecimalPart = secondsAsFloat-secondsWhole;

        return secondsWhole * 1000 + secondsDecimalPart * 1000;
    }

    private loadJSON(file, callback) {   

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', file, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == 200) {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);  
    }

}