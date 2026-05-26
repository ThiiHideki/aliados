import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trophy, Sparkles } from "lucide-react";
import type { Raffle } from "@shared/schema";

export function RaffleWinnerAlert() {
  const { isAuthenticated } = useAuth();
  const { data: wins } = useQuery<Raffle[]>({
    queryKey: ["/api/raffles/my-unseen-wins"],
    enabled: isAuthenticated,
    refetchInterval: 60_000,
  });

  const ack = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/raffles/${id}/mark-seen`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/raffles/my-unseen-wins"] });
    },
  });

  const win = wins?.[0];
  if (!win) return null;

  return (
    <AlertDialog open onOpenChange={() => { /* keep open until ack */ }}>
      <AlertDialogContent data-testid="dialog-raffle-win">
        <AlertDialogHeader>
          <div className="mx-auto h-16 w-16 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center mb-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <AlertDialogTitle className="text-center flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Você ganhou um sorteio!
            <Sparkles className="h-5 w-5 text-primary" />
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            Parabéns! Você foi sorteado em <span className="font-bold text-foreground">{win.title}</span>.
            Procure um administrador para receber seu prêmio.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => ack.mutate(win.id)}
            disabled={ack.isPending}
            data-testid="button-ack-raffle-win"
          >
            Que demais!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
