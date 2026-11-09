// Console-only account administration; account creation/reset stays in bootstrap.mjs.
import { setAccountBlocked, listPublicAccounts } from '../src/lib/accounts.mjs';
const [command, name] = process.argv.slice(2);
try {
  if (command === 'liste')
    for (const user of await listPublicAccounts())
      console.log(`${user.name} (${user.role})`);
  else if (['sperren', 'entsperren'].includes(command) && name) {
    const user = await setAccountBlocked(name, command === 'sperren');
    console.log(
      `${user.name}: ${command === 'sperren' ? 'gesperrt' : 'entsperrt'}`,
    );
  } else
    throw new Error(
      'Aufruf: node scripts/accounts.mjs liste | sperren NAME | entsperren NAME',
    );
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
