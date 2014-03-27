var js2xmlparser = require("../lib/js2xmlparser.js");

console.log("EXAMPLE 1");
console.log("=========");

var example1 = {
    "firstName": "John",
    "lastName": "Smith"
};

console.log(js2xmlparser("person", example1));
console.log();

console.log("EXAMPLE 2");
console.log("=========");

var example2 = {
    "firstName": "John",
    "lastName": "Smith",
    "dateOfBirth": new Date(1964, 7, 26),
    "address": {
        "@": {
            "type": "home"
        },
        "streetAddress": "3212 22nd St",
        "city": "Chicago",
        "state": "Illinois",
        "zip": 10000
    },
    "phone": [
        {
            "@": {
                "type": "home"
            },
            "#": "123-555-4567"
        },
        {
            "@": {
                "type": "cell"
            },
            "#": "456-555-7890"
        }
    ],
    "email": function() {return "john@smith.com";},
    "notes": "John's profile is not complete."
};

console.log(js2xmlparser("person", example2));
console.log();

console.log("EXAMPLE 3");
console.log("=========");

var example3  = {
    "phone": [
        {
            "@": {
                "type": "home"
            },
            "#": "123-555-4567"
        },
        {
            "@": {
                "type": "cell"
            },
            "#": "456-555-7890"
        }
    ]
};

var example3Options = {
    wrapArray: {
        enabled: true
    }
};

console.log(js2xmlparser("person", example3, example3Options));
console.log();

console.log("EXAMPLE 4");
console.log("=========");

var example4 = {
    "notes": "John's profile is not complete."
};

var example4Options = {
    useCDATA: true
};

console.log(js2xmlparser("person", example4, example4Options));
console.log();

console.log("EXAMPLE 5");
console.log("=========");

var example5 = {
    "dateOfBirth": new Date(1964, 7, 26)
};

var example5Options = {
    convertMap: {
        "[object Date]": function(date) {
            return date.toISOString();
        }
    }
};

console.log(js2xmlparser("person", example5, example5Options));
console.log();

console.log("EXAMPLE 6");
console.log("=========");

var example6 = {
    ">": [{
        "Car": {
            "@": {type: "passenger"},
            "wheels": 4,
            "doors": 4
        }
    }, {
        "Car": {
            "@": {type: "transport"},
            "wheels": 18,
            "doors": 2
        }
    }]
};

var example6Options = {};

console.log(js2xmlparser("Vehicles", example6, example6Options));
console.log();

