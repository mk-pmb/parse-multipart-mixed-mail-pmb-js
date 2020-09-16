// -*- coding: utf-8, tab-width: 2 -*-

import test from 'p-tape';

import muMix from '..';

function utf8buf(x) { return Buffer.from(x, 'UTF-8'); }
function binstr(x) { return (x || '').toString('latin1'); }
function arr2lat(x) { return binstr(utf8buf(x.join('\n') + '\n')); }

test('Split mail parts correctly', async(t) => {
  t.plan(3);
  const boundary = 'abc123_boundary_789xyz';
  const helloAtt = [
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    'Hello',
    'Übär',
  ];
  const fooBarAtt = [
    'Content-Type: text/plain; charset=ASCII',
    'Content-Transfer-Encoding: 8bit',
    '',
    'foo',
    'bar',
    'qux',
  ];
  const raw = utf8buf([
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed;\n    boundary="' + boundary + '"',
    'Content-Transfer-Encoding: 8bit',
    '',
    'This is a multi-part message in MIME format.',
    '',
    '--' + boundary,
    ...helloAtt,
    '',
    '--' + boundary,
    ...fooBarAtt,
    '',
    '--' + boundary + '--',
    '',
  ].join('\r\n'));
  const mail = muMix(raw);

  t.same(mail.body.length, 2);
  t.same(binstr(mail.body[0]), arr2lat(helloAtt));
  t.same(binstr(mail.body[1]), arr2lat(fooBarAtt));
  t.end();
});
