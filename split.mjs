// -*- coding: utf-8, tab-width: 2 -*-

import mAtt from 'parse-mail-attachment-pmb';
import mustBe from 'typechecks-pmb/must-be';
import splitOnce from 'split-string-or-buffer-once-pmb';


function rebufferize(x) {
  return Buffer.from(x, 'latin1');
  // … to remind users that we do not know the charset.
}


const EX = function parseMail(raw, opt) {
  if (!opt) { return parseMail(raw, true); }
  const mail = mAtt.splitParseHeaders(raw);
  if (opt.acceptJustText && (mail.cType || '').startsWith('text/')) {
    mail.body = [rebufferize(raw)];
    return mail;
  }
  mustBe([['oneOf', EX.supportedMimeTypes]], 'MIME type')(mail.cType);
  const boundary = mustBe.nest('MIME boundary in mail headers',
    mail.ctDetails.boundary);
  let { body } = mail;
  body = body.replace(/^This is a multi-part message in MIME format\.\s*/i, '');
  if (!body.startsWith('--' + boundary + '\n')) {
    throw new Error('The body must start with the MIME boundary.');
  }
  mail.body = EX.splitBody(body);
  return mail;
};


Object.assign(EX, {

  supportedMimeTypes: [
    'multipart/alternative',
    'multipart/mixed',
    'multipart/related',
  ],

  splitBody(raw) {
    let body = mAtt.normText(raw);
    let boundary = mustBe.nest('MIME boundary in first line of body',
      (/^\-{2}(\S{1,160})\n/.exec(body) || false)[1]);
    const preBound = '\n--';
    let part = body.slice(-32 - preBound.length - boundary.length);
    part = splitOnce({ sep: preBound, last: true }, part)[1];
    if ((part || '').trimRight() !== (boundary + '--')) {
      throw new Error('Missing end mark. Incomplete download?');
    }
    body = body.slice(boundary.length + 3, -preBound.length - part.length);
    boundary = preBound + boundary + '\n';
    const parts = [];
    while (body) {
      [part, body] = (splitOnce(boundary, body) || [body]);
      parts.push(rebufferize(part));
    }
    return parts;
  },
});


export default EX;
