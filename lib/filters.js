var map = {    
    'ppk' : [
        'ppk', 
        'ppkamigo',   
    ],
    
    'keiko' : [
        'keikofujimori', 
        'keiko',
    ],
    
    'toledo' : [
        'atoledomanrique', 
        'toledo'
    ],
    
    'humala' : [
        'humala'
    ]
};

var keywords = [];
for (key in map) keywords = keywords.concat(map[key]);

var names = []
for (key in map) names.push(key)

exports.MAP      = map;
exports.KEYWORDS = keywords;
exports.NAMES    = names