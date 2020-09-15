// -*- coding: utf-8, tab-width: 2 -*-

import mAtt from 'parse-mail-attachment-pmb';
import mustBe from 'typechecks-pmb/must-be';


const EX = function parseMail(raw) {
  const mail = mAtt.splitParseHeaders(raw);
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
    const body = mAtt.normText(raw);
    const boundary = mustBe.nest('MIME boundary in first line of body',
      (/^\-{2}\S+\n/.exec(body) || false)[0]);
    return body.slice(boundary.length).split('\n' + boundary);
  },
});


export default EX;
