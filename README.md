
<!--#echo json="package.json" key="name" underline="=" -->
parse-multipart-mixed-mail-pmb
==============================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Split a &#39;Content-Type: multipart/mixed&#39; email into parsed headers and
body parts.
<!--/#echo -->



API
---

This module exports one function, which carries another function:

### parseMail(raw)

Its API is the same as `splitParseHeaders()` from
[parse-mail-attachment-pmb][matt],
except that `body` will be an array of raw body parts as produced by
`.splitBody()`.
Use `splitParseHeaders()` or `parseAttachment()` to process them further.



### .splitBody(raw)

Split just the body parts, and return them.
Assumes the first line of `raw` is a boundary.
Whitespace at the end of (some) body parts may have been stripped.





<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;

  [matt]: https://github.com/mk-pmb/parse-mail-attachment-pmb-js

License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
