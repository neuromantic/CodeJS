
# Fase.js Debug

### Some extremely useful gotchas

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


`*.* is not a function`

    you may have assigned a value to a setter function using = instead of ().

`Node was not found" code: "8`

    wtf?