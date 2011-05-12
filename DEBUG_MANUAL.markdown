
# Code.js Troubleshooting

### Code.js for Dummies like me.

`*.extends is not a function`

    use _extends()

`window[parentClassName] is undefined`

    check _import

`window[parentClassName] is undefined`

    check self evaluating closure --> })(); at end

`missing } after property list`

    look for missing ',' between properties in class declaration

    look for  missing closing characters in class declaration

`missing ) in parenthetical`
 
	look for a getter not using ()

`* is undefined *`

	is your property private?

`*.* is not a function`

    you may have assigned a value to a setter function using = instead of ().

`this.\* is undefined OR this._\* is undefined`

	if * is a private property, reference it like this: this._.*