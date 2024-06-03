import Button from './Button';
import { toast } from 'react-toastify';
import interactImg from '../../../assets/interact.svg';
import { useConvex, useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
// import { SignInButton } from '@clerk/clerk-react';
import { ConvexError } from 'convex/values';
import { Id } from '../../../convex/_generated/dataModel';
import { useCallback } from 'react';
import { waitForInput } from '../../hooks/sendInput';
import { useServerGame } from '../../hooks/serverGame';

export default function InteractButton() {
  // const { isAuthenticated } = useConvexAuth();
  const worldStatus = useQuery(api.world.defaultWorldStatus);
  const worldId = worldStatus?.worldId;
  const game = useServerGame(worldId);
  const oauth = JSON.parse(localStorage.getItem('oauth'));
  const oauthToken = oauth ? oauth.userInfo.fullname : undefined;
  console.log(oauthToken)
  const humanTokenIdentifier = useQuery(api.world.userStatus, worldId ? { worldId, oauthToken } : 'skip');
  const userPlayerId =
    game && [...game.world.players.values()].find((p) => p.human === humanTokenIdentifier)?.id;
  const join = useMutation(api.world.joinWorld);
  const leave = useMutation(api.world.leaveWorld);
  const isPlaying = !!userPlayerId;

  const convex = useConvex();
  const joinInput = useCallback(
    async (worldId: Id<'worlds'>) => {
      let inputId;
      try {
        inputId = await join({ worldId, oauthToken });
      } catch (e: any) {
        if (e instanceof ConvexError) {
          toast.error(e.data);
          return;
        }
        throw e;
      }
      try {
        await waitForInput(convex, inputId);
      } catch (e: any) {
        toast.error(e.message);
      }
    },
    [convex, join, oauthToken],
  );


  const joinOrLeaveGame = () => {
    if (
      !worldId ||
      // || !isAuthenticated
      game === undefined
    ) {
      return;
    }
    if (isPlaying) {
      console.log(`Leaving game for player ${userPlayerId}`);
      void leave({ worldId , oauthToken});
    } else {
      console.log(`Joining game`);
      void joinInput(worldId);
    }
  };
  // if (!isAuthenticated || game === undefined) {
  //   return (
  //     <SignInButton>
  //       <button className="button text-white shadow-solid text-2xl pointer-events-auto">
  //         <div className="inline-block bg-clay-700">
  //           <span>
  //             <div className="inline-flex h-full items-center gap-4">
  //               <img className="w-4 h-4 sm:w-[30px] sm:h-[30px]" src={interactImg} />
  //               Interact
  //             </div>
  //           </span>
  //         </div>
  //       </button>
  //     </SignInButton>
  //   );
  // }
  return (
    <Button imgUrl={interactImg} onClick={joinOrLeaveGame}>
      {isPlaying ? 'Leave' : 'Interact'}
    </Button>
  );
}
