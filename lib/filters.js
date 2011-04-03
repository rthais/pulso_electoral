var map = {    
    'ppk' : [
        'ppk', 
        'ppkamigo',   
        'kuczynski'
    ],
    
    'toledo' : [
        'atoledomanrique', 
        'toledo'
    ],
    
    'keiko' : [
        'keikofujimori', 
        'keiko',
    ],
    
    'humala' : [
        'humala',
        'ollanta',
        'ollanta_humalat'
    ]
};

var discriminate = {
    'toledo': 'spanish',
    'keiko' : 'spanish'
}

var keywords = [];
for (key in map) keywords = keywords.concat(map[key]);

var names = []
for (key in map) names.push(key)

exports.MAP          = map;
exports.KEYWORDS     = keywords;
exports.NAMES        = names
exports.DISCRIMINATE = discriminate