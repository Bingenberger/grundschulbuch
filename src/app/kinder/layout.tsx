import SharedDeviceGuard from '@/components/SharedDeviceGuard';
import { currentChild, schoolEndHour } from '@/lib/child-auth';
export default async function ChildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SharedDeviceGuard
        enabled={!!(await currentChild())}
        schoolEndHour={schoolEndHour()}
      />
      {children}
    </>
  );
}
