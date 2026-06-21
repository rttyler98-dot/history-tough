const fs = require('fs');

const createLoading = () => {
    return {
        "v": "5.5.2",
        "fr": 60,
        "ip": 0,
        "op": 120,
        "w": 500,
        "h": 500,
        "nm": "Loading",
        "ddd": 0,
        "assets": [],
        "layers": [
            {
                "ddd": 0, "ind": 1, "ty": 4, "nm": "Circle 1", "sr": 1,
                "ks": {
                    "o": { "a": 1, "k": [{ "i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [100] }, { "i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 60, "s": [0] }, { "t": 120, "s": [100] }] },
                    "r": { "a": 1, "k": [{ "i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [0] }, { "t": 120, "s": [360] }] },
                    "p": { "a": 0, "k": [250, 250, 0] },
                    "a": { "a": 0, "k": [0, 0, 0] },
                    "s": { "a": 0, "k": [100, 100, 100] }
                },
                "ao": 0,
                "shapes": [
                    {
                        "ty": "gr", "it": [
                            { "d": 1, "ty": "el", "s": { "a": 0, "k": [150, 150] }, "p": { "a": 0, "k": [0, 0] } },
                            { "ty": "st", "c": { "a": 0, "k": [0.76, 0.60, 0.30, 1] }, "o": { "a": 0, "k": 100 }, "w": { "a": 0, "k": 4 }, "lc": 2, "lj": 2 },
                            { "ty": "tr", "p": { "a": 0, "k": [0, 0] }, "a": { "a": 0, "k": [0, 0] }, "s": { "a": 0, "k": [100, 100] }, "r": { "a": 0, "k": 0 }, "o": { "a": 0, "k": 100 } }
                        ]
                    }
                ]
            },
            {
                "ddd": 0, "ind": 2, "ty": 4, "nm": "Circle 2", "sr": 1,
                "ks": {
                    "o": { "a": 1, "k": [{ "i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [0] }, { "i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 60, "s": [100] }, { "t": 120, "s": [0] }] },
                    "r": { "a": 1, "k": [{ "i": {"x": [0.833], "y": [0.833]}, "o": {"x": [0.167], "y": [0.167]}, "t": 0, "s": [360] }, { "t": 120, "s": [0] }] },
                    "p": { "a": 0, "k": [250, 250, 0] },
                    "a": { "a": 0, "k": [0, 0, 0] },
                    "s": { "a": 0, "k": [100, 100, 100] }
                },
                "ao": 0,
                "shapes": [
                    {
                        "ty": "gr", "it": [
                            { "d": 1, "ty": "el", "s": { "a": 0, "k": [120, 120] }, "p": { "a": 0, "k": [0, 0] } },
                            { "ty": "st", "c": { "a": 0, "k": [0.48, 0.13, 0.08, 1] }, "o": { "a": 0, "k": 100 }, "w": { "a": 0, "k": 8 }, "lc": 2, "lj": 2 },
                            { "ty": "tr", "p": { "a": 0, "k": [0, 0] }, "a": { "a": 0, "k": [0, 0] }, "s": { "a": 0, "k": [100, 100] }, "r": { "a": 0, "k": 0 }, "o": { "a": 0, "k": 100 } }
                        ]
                    }
                ]
            }
        ]
    };
};

const createAccent = () => {
    return {
        "v": "5.5.2",
        "fr": 60,
        "ip": 0,
        "op": 240,
        "w": 500,
        "h": 500,
        "nm": "Accent",
        "ddd": 0,
        "assets": [],
        "layers": [
            {
                "ddd": 0, "ind": 1, "ty": 4, "nm": "Particle 1", "sr": 1,
                "ks": {
                    "o": { "a": 1, "k": [{ "t": 0, "s": [0] }, { "t": 120, "s": [50] }, { "t": 240, "s": [0] }] },
                    "r": { "a": 1, "k": [{ "t": 0, "s": [0] }, { "t": 240, "s": [180] }] },
                    "p": { "a": 0, "k": [250, 250, 0] },
                    "a": { "a": 0, "k": [0, 0, 0] },
                    "s": { "a": 1, "k": [{ "t": 0, "s": [50, 50, 100] }, { "t": 120, "s": [150, 150, 100] }, { "t": 240, "s": [50, 50, 100] }] }
                },
                "ao": 0,
                "shapes": [
                    {
                        "ty": "gr", "it": [
                            { "ty": "sr", "sy": 2, "d": 1, "pt": {"a": 0, "k": 8}, "p": {"a": 0, "k": [0, 0]}, "r": {"a": 0, "k": 0}, "ir": {"a": 0, "k": 10}, "is": {"a": 0, "k": 0}, "or": {"a": 0, "k": 100}, "os": {"a": 0, "k": 0} },
                            { "ty": "fl", "c": { "a": 0, "k": [0.76, 0.60, 0.30, 1] }, "o": { "a": 0, "k": 100 } },
                            { "ty": "tr", "p": { "a": 0, "k": [0, 0] }, "a": { "a": 0, "k": [0, 0] }, "s": { "a": 0, "k": [100, 100] }, "r": { "a": 0, "k": 0 }, "o": { "a": 0, "k": 100 } }
                        ]
                    }
                ]
            }
        ]
    };
};

fs.writeFileSync('src/assets/lottie/loading.json', JSON.stringify(createLoading()));
fs.writeFileSync('src/assets/lottie/accent.json', JSON.stringify(createAccent()));

// Apply to others as well for a cooler effect
fs.writeFileSync('src/assets/lottie/dagger.json', JSON.stringify(createAccent()));
fs.writeFileSync('src/assets/lottie/senator.json', JSON.stringify(createAccent()));
fs.writeFileSync('src/assets/lottie/sleep.json', JSON.stringify(createAccent()));
fs.writeFileSync('src/assets/lottie/crown.json', JSON.stringify(createAccent()));

console.log("Sophisticated Lotties Generated!");
