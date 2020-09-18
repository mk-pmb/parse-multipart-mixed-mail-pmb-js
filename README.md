
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

### parseMail(raw[, opt])

`raw` should be a Buffer or "binary" (latin-1) String.
Its API is the same as `splitParseHeaders()` from
[parse-mail-attachment-pmb][matt],
except that `body` will be an array of raw body parts as produced by
`.splitBody()`.
Use `splitParseHeaders()` or `parseAttachment()` to process them further.

`opts` is an optional options object that supports these keys:

* `acceptJustText` (default: `false`):
  If truthy, and the Content-Type starts with `text/`,
  rather than lamenting that it's not a multipart mail,
  consider the entire mail as its first (and only) body part.




### .splitBody(raw)

`raw` should be a Buffer or "binary" (latin-1) String.
Split just the body parts, and return them, as an array of Buffers.
Assumes the first line of `raw` is a boundary.






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
