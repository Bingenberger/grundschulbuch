import { listAdminAccounts } from './accounts.mjs';
import { listAllClasses } from './classes.mjs';
import { readSchoolTemplates } from './notebooks.mjs';

/** Everything the admin area shows at once. */
export async function adminOverview() {
  const school = await readSchoolTemplates();
  return {
    accounts: await listAdminAccounts(),
    classes: await listAllClasses(),
    templates: school.templates,
    hidden: school.hidden,
    policies: school.policies,
  };
}
export type AdminOverview = Awaited<ReturnType<typeof adminOverview>>;
