import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from '@/lib/supabase/queries';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { ScrollArea } from '../ui/scroll-area';
import FoldersDropdownList from './folders-dropdown-list';
import NativeNavigation from './native-navigation';
import PlanUsage from './plan-usage';
import UserCard from './user-card';
import WorkspaceDropdown from './workspace-dropdown';
interface SidebarProps {
  params: { workspaceId: string };
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = async ({ params, className }) => {
  const supabase = createServerComponentClient({ cookies });
  //user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  //subscr
  const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  //folders
  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    params.workspaceId
  );

  //error
  if (subscriptionError || foldersError) redirect('/dashboard');

  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ]);

  //get all the different workspaces private collaborating shared

  return (
    <aside
      className={twMerge(
        '  hidden   sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between',
        className
      )}
    >
      <div className='h-full flex flex-col justify-between'>
        <div>
          <WorkspaceDropdown
            privateWorkspaces={privateWorkspaces}
            sharedWorkspaces={sharedWorkspaces}
            collaboratingWorkspaces={collaboratingWorkspaces}
            defaultValue={[
              ...privateWorkspaces,
              ...collaboratingWorkspaces,
              ...sharedWorkspaces,
            ].find((workspace) => workspace.id === params.workspaceId)}
          />
          <PlanUsage
            foldersLength={workspaceFolderData?.length || 0}
            subscription={subscriptionData}
          />
          <NativeNavigation myWorkspaceId={params.workspaceId} />
          <ScrollArea
            className='overflow-auto relative
          h-[450px]
        '
          >
            <div
              className='pointer-events-none 
          w-full 
          absolute 
          bottom-0 
          h-20 
          bg-gradient-to-t 
          from-background 
          to-transparent 
          z-40
          '
            />
            <FoldersDropdownList
              workspaceFolders={workspaceFolderData || []}
              workspaceId={params.workspaceId}
            />
          </ScrollArea>
        </div>
        <div>
          <UserCard subscription={subscriptionData} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
