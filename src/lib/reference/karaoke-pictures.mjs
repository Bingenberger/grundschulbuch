/* eslint-disable */
// Generated from Lernsachen-Heft.html; pure picture-selection rules.
var h_ = /^\s*(refrain|kehrvers|chorus|ref\.?)\s*:\s*$/i;
var g_ = /^\s*\(?\s*(refrain|kehrvers|chorus|ref\.?)\s*\)?\s*:?\s*$/i;
var __ = /^\s*-{3,}\s*(\d+(?:[.,]\d+)?)?\s*(.*)$/;
var v_ = /^\s*([A-Za-zÄÖÜäöüß]{1,16})\s*:\s+(\S.*)$/;
var S_ = `A-Za-z\xC4\xD6\xDC\xE4\xF6\xFC\xDF\xC0-\u024F`;
var Jre = RegExp(`\\[([^\\]\\n]{1,40})\\]|([${S_}]+(?:['\u2019][${S_}]+)*)|([^\\[${S_}]+|\\[)`, `g`);
var Yre = RegExp(`^[${S_}]+(?:['\u2019][${S_}]+)*$`);
var C_ = (e17) => e17.trim().toLocaleLowerCase(`de-DE`).replace(/['’]/g, ``);
function w_(e17) {
  let t10 = [];
  for (let n10 of e17.matchAll(Jre)) if (n10[1] !== void 0) {
    let e18 = n10[1].trim();
    Yre.test(e18) ? t10.push({ text: e18, key: C_(e18), instead: true }) : t10.push({ text: n10[0] });
  } else n10[2] === void 0 ? t10.push({ text: n10[0] }) : t10.push({ text: n10[2], key: C_(n10[2]) });
  return t10;
}
function T_(e17) {
  let t10 = /* @__PURE__ */ new Set(), n10 = [];
  for (let r10 of e17.replace(/\r/g, ``).split(`
`)) {
    if (__.test(r10) || h_.test(r10) || g_.test(r10)) continue;
    let e18 = v_.exec(r10);
    for (let i10 of w_(e18 ? e18[2] : r10)) !i10.key || t10.has(i10.key) || i10.key.length < 2 || (t10.add(i10.key), n10.push(i10.text));
  }
  return n10;
}
function nxe(e17) {
  let t10 = {};
  for (let n10 of e17.pics.split(/\s+/).filter(Boolean)) {
    let [e18, r10] = n10.split(`=`);
    t10[e18.toLocaleLowerCase(`de-DE`)] = r10 ?? e18;
  }
  return t10;
}
var LW = new Set(`ich du er sie es wir ihr und oder aber denn das dass ist sind war wird haben hat ein eine einen einem einer eines dem den der die des mit von zu in im am um f\xFCr auf aus bei nach zum zur an als wie auch nicht nur noch mich dich sich uns euch mir dir ihm ihnen mein dein sein unser euer kein keine doch mal ja nein man wer was wen wem wessen welche welcher welches dieser diese dieses diesem diesen jener jene jenes jemand niemand alle alles aller allen jeder jede jedes jedem jeden viele vieles einige manche mancher etwas nichts selbst einander meine meiner meines meinem meinen deine deiner deines deinem deinen seine seiner seines seinem seinen ihre ihrer ihres ihrem ihren unsere unserer unseres unserem unseren eure eurer eures eurem euren keiner keines keinem keinen ihn \xFCber unter vor hinter neben zwischen durch gegen ohne bis seit w\xE4hrend wegen trotz au\xDFer entlang weil wenn ob damit obwohl sondern sowie bevor nachdem indem sodass falls dann da dort hier jetzt heute gestern morgen immer nie niemals oft manchmal schon sehr so ganz fast wieder etwa vielleicht ziemlich gleich bald nun eben erst sogar also deshalb darum danach davor dabei dazu hin her mehr weniger wenig viel genug wohl halt dies dessen deren denen worden gar zwar bin bist seid sei seien w\xE4re w\xE4ren gewesen wesen werden werde wirst werdet wurde wurden w\xFCrde w\xFCrden geworden habe hast habt hatte hatten h\xE4tte h\xE4tten gehabt kann kannst k\xF6nnen k\xF6nnt konnte konnten k\xF6nnte k\xF6nnten gekonnt muss musst m\xFCssen m\xFCsst musste mussten m\xFCsste m\xFCssten will willst wollen wollt wollte wollten gewollt soll sollst sollen sollt sollte sollten darf darfst d\xFCrfen d\xFCrft durfte durften d\xFCrfte mag magst m\xF6gen m\xF6gt mochte mochten m\xF6chte m\xF6chten m\xF6chtest tut tun tue tust`.split(/\s+/));
var ixe = /(heit|keit|schaft|tum|ismus|ität|tion|ung|nis)$/;
var axe = new Set(`zeitung wohnung kleidung nahrung zeichnung leitung verpackung landschaft station portion universit\xE4t gef\xE4ngnis zeugnis rechnung einladung mannschaft bewegung`.split(` `));
var RW = (() => {
  let e17 = {};
  for (let t10 of `gehen=ging,gingen,gegangen,geht,gehst;kommen=kam,kamen,gekommen;sehen=sah,sahen,gesehen,sieht,siehst;fahren=fuhr,fuhren,gefahren,f\xE4hrt,f\xE4hrst;laufen=lief,liefen,gelaufen,l\xE4uft,l\xE4ufst;essen=a\xDF,a\xDFen,gegessen,isst;trinken=trank,tranken,getrunken;schlafen=schlief,schliefen,geschlafen,schl\xE4ft;fallen=fiel,fielen,gefallen,f\xE4llt;werfen=warf,warfen,geworfen,wirft;nehmen=nahm,nahmen,genommen,nimmt;geben=gab,gaben,gegeben,gibt;lesen=las,lasen,gelesen,liest;schreiben=schrieb,schrieben,geschrieben;singen=sang,sangen,gesungen;schwimmen=schwamm,schwammen,geschwommen;fliegen=flog,flogen,geflogen;stehen=stand,standen,gestanden;sitzen=sa\xDF,sa\xDFen,gesessen;liegen=lag,lagen,gelegen;tragen=trug,trugen,getragen,tr\xE4gt;fangen=fing,fingen,gefangen,f\xE4ngt;rufen=rief,riefen,gerufen;halten=hielt,hielten,gehalten,h\xE4lt;lassen=lie\xDF,lie\xDFen,gelassen,l\xE4sst;bringen=brachte,brachten,gebracht;denken=dachte,dachten,gedacht;steigen=stieg,stiegen,gestiegen;schneiden=schnitt,schnitten,geschnitten;binden=band,banden,gebunden;treten=trat,traten,getreten,tritt;helfen=half,halfen,geholfen,hilft;sprechen=sprach,sprachen,gesprochen,spricht;ziehen=zog,zogen,gezogen;schlie\xDFen=schloss,schlossen,geschlossen;gie\xDFen=goss,gossen,gegossen;brechen=brach,brachen,gebrochen,bricht;finden=fand,fanden,gefunden;reiten=ritt,ritten,geritten;rennen=rannte,rannten,gerannt;springen=sprang,sprangen,gesprungen;wachsen=wuchs,wuchsen,gewachsen,w\xE4chst;bleiben=blieb,blieben,geblieben;scheinen=schien,schienen,geschienen;schlagen=schlug,schlugen,geschlagen,schl\xE4gt;waschen=wusch,wuschen,gewaschen,w\xE4scht;backen=buk,gebacken,b\xE4ckt;braten=briet,gebraten,br\xE4t;heben=hob,hoben,gehoben;laden=lud,luden,geladen,l\xE4dt;bei\xDFen=biss,bissen,gebissen;rei\xDFen=riss,rissen,gerissen;pfeifen=pfiff,pfiffen,gepfiffen;greifen=griff,griffen,gegriffen;schieben=schob,schoben,geschoben;biegen=bog,bogen,gebogen;klingen=klang,klangen,geklungen;sinken=sank,sanken,gesunken;treffen=traf,trafen,getroffen,trifft;sterben=starb,starben,gestorben,stirbt;stehlen=stahl,stahlen,gestohlen,stiehlt;verlieren=verlor,verloren;gewinnen=gewann,gewannen,gewonnen;beginnen=begann,begannen,begonnen;nennen=nannte,nannten,genannt;kennen=kannte,kannten,gekannt;bitten=bat,baten,gebeten;fliehen=floh,flohen,geflohen;frieren=fror,froren,gefroren;riechen=roch,rochen,gerochen;schreien=schrie,schrien,geschrien;streiten=stritt,stritten,gestritten;wiegen=wog,wogen,gewogen;fressen=fra\xDF,fra\xDFen,gefressen,frisst;vergessen=verga\xDF,verga\xDFen,vergisst;ei=eier;auge=augen;fu\xDF=f\xFC\xDFe;mann=m\xE4nner;frau=frauen;kind=kinder;maus=m\xE4use;baum=b\xE4ume;haus=h\xE4user;wurm=w\xFCrmer`.split(`;`)) {
    let [n10, r10] = t10.split(`=`);
    for (let t11 of r10.split(`,`)) e17[t11] ??= n10;
  }
  return e17;
})();
var zW = (e17) => e17.toLocaleLowerCase(`de-DE`);
var oxe = (e17) => e17.replace(/ä/g, `a`).replace(/ö/g, `o`).replace(/ü/g, `u`);
function BW(e17) {
  let t10 = zW(e17.trim());
  return t10.length < 2 || /^\d+$/.test(t10) || LW.has(t10) ? false : /\s/.test(t10) ? true : !(ixe.test(t10) && t10.length > 5 && !axe.has(t10));
}
function VW(e17, t10 = null, n10 = false) {
  let r10 = /* @__PURE__ */ new Set([e17]);
  !n10 && RW[e17] && r10.add(RW[e17]);
  let i10 = /* @__PURE__ */ new Set(), a10 = /* @__PURE__ */ new Set(), o10 = [e17];
  !n10 && e17.length >= 6 && e17.startsWith(`ge`) && o10.push(e17.slice(2));
  let s10 = n10 ? [`innen`, `nen`, `en`, `er`, `es`, `e`, `n`, `s`] : `innen.esten.ester.estes.estem.este.sten.ster.stes.stem.ste.test.tet.ten.nen.ern.est.end.en.er.es.em.st.te.et.in.e.n.s.t`.split(`.`);
  for (let e18 of o10) for (let t11 of s10) {
    if (!e18.endsWith(t11) || e18.length - t11.length < 3) continue;
    let r11 = e18.slice(0, -t11.length), o11 = [r11], s11 = oxe(r11);
    s11 !== r11 && o11.push(s11), r11.endsWith(`ss`) && o11.push(r11.slice(0, -1), r11.slice(0, -2) + `\xDF`), s11.endsWith(`ss`) && o11.push(s11.slice(0, -2) + `\xDF`);
    for (let e19 of o11.slice()) e19.length > 3 && e19[e19.length - 1] === e19[e19.length - 2] && o11.push(e19.slice(0, -1));
    for (let e19 of o11) i10.add(e19), i10.add(e19 + `e`), n10 || (a10.add(e19 + `en`), a10.add(e19 + `n`));
  }
  for (let e18 of t10 === false ? [a10, i10] : [i10, a10]) for (let t11 of e18) r10.add(t11);
  return [...r10];
}
function sxe(e17, t10) {
  let n10 = [];
  if (e17.length < 8 || e17.includes(`-`)) return n10;
  for (let r10 = 3; r10 <= e17.length - 4; r10++) {
    let i10 = e17.slice(r10);
    if (!/^(innen|chen|lein|heit|keit|ung|ungen|schaft|lich|isch)$/.test(i10)) {
      for (let e18 of VW(i10, true, true)) e18.length >= 4 && t10.has(e18) && !LW.has(e18) && !n10.includes(e18) && n10.push(e18);
      if (n10.length >= 3) break;
    }
  }
  return n10;
}
function qW(e17, t10, n10) {
  let r10 = [];
  return e17.forEach((e18, i10) => {
    if (e18.violence || e18.sex) return;
    let a10 = e18.keywords ?? [], o10 = a10.findIndex((e19) => [2, 3, 4].includes(e19.type ?? 0) && zW(String(e19.keyword ?? ``).trim()) === t10);
    if (o10 < 0) return;
    let s10 = 100 - Math.min(i10, 30) - o10 * 6 - (a10.length - 1) * 2;
    n10 !== null && n10 === (a10[o10].type === 2) && (s10 += 12), e18.schematic && (s10 -= 8), e18.aac && (s10 += 3), r10.push({ p: e18, score: s10 });
  }), r10.sort((e18, t11) => t11.score - e18.score).map((e18) => e18.p);
}
var uxe = 60;
function pxe(e17, t10) {
  let n10 = new Set(e17.nopic ?? []), r10 = new Set([...e17.text.matchAll(/\[([^\]\n]{1,40})\]/g)].map((e18) => C_(e18[1]))), i10 = [];
  for (let a10 of T_(e17.text)) {
    let o10 = C_(a10);
    e17.pics[o10] || n10.has(o10) || (t10 ? (o10 in t10 || r10.has(o10)) && i10.push({ word: a10, key: o10, term: t10[o10] }) : (r10.has(o10) || /^[A-ZÄÖÜ]/.test(a10) && a10.length > 2 && BW(a10)) && i10.push({ word: a10, key: o10 }));
  }
  return i10.slice(0, uxe);
}
export { nxe as pictureHints, pxe as pictureCandidates, VW as wordVariants, BW as concreteWord, qW as rankPictures, LW as stopWords, sxe as compoundVariants };
