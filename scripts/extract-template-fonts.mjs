// Preserve the exact font files and weights of the supplied reference.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import fontkit from '@pdf-lib/fontkit';
const html=await fs.readFile('Lernsachen-Heft-komplett.html','utf8');
const ranges={latin:'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD','latin-ext':'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'};
const registry={},css=[],credits=['# Originalschriften der Seitenvorlagen\n','Unverändert aus der bereitgestellten `Lernsachen-Heft-komplett.html` (1.47.3). Die Dateien stehen unter SIL Open Font License; siehe OFL.txt und die eingebetteten Metadaten.\n'];
await fs.mkdir('public/fonts/reference',{recursive:true});
for(const match of html.matchAll(/<script\b[^>]*id="lh-pack-font-([^"]+)"[^>]*>([\s\S]*?)<\/script>/g)){
  const key=match[1],family=`LH Vorlage ${key}`;registry[key]=family;
  for(const [weight,subsets] of Object.entries(JSON.parse(match[2])))for(const [subset,base64] of Object.entries(subsets)){
    const bytes=Buffer.from(base64,'base64'),format=bytes.toString('ascii',0,4)==='wOF2'?'woff2':'woff',file=`${key}-${weight}-${subset}.${format}`,font=fontkit.create(bytes);
    await fs.writeFile(`public/fonts/reference/${file}`,bytes);
    css.push(`@font-face { font-family: '${family}'; src: url('/fonts/reference/${file}') format('${format}'); font-weight: ${weight}; font-style: normal; font-display: swap; unicode-range: ${ranges[subset]}; }`);
    credits.push(`- ${file}: ${font.fullName}; SHA-256 ${createHash('sha256').update(bytes).digest('hex')}\n  ${String(font.name.records.copyright?.en||'').replaceAll('\n',' ')}\n`);
  }
}
await fs.writeFile('src/lib/reference/template-fonts.json',JSON.stringify(registry,null,2)+'\n');
await fs.writeFile('src/lib/reference/template-fonts.css',css.join('\n')+'\n');
await fs.writeFile('public/fonts/reference/SOURCES.md',credits.join('\n'));
await fs.copyFile('public/fonts/andika/OFL.txt','public/fonts/reference/OFL.txt');
console.log(`${Object.keys(registry).length} original font families extracted.`);
