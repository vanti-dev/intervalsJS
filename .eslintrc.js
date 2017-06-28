module.exports = {
    "extends": "airbnb",
    "plugins": [
        "import"
    ],
    "rules": {
        "linebreak-style": "off",
        "no-underscore-dangle": "off",
        "no-param-reassign": "off",
        "class-methods-use-this": "off",
        'no-restricted-syntax': [
                                'error',
                                'ForInStatement',
                                'LabeledStatement',
                                'WithStatement',
                                ]
    }
};
