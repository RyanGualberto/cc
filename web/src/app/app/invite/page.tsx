"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Loading } from "~/components/ui/loading";
import Show from "~/components/utils/show";
import { teamRequests } from "~/requests/team";

const Page = ({}) => {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
};

const Content = ({}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const queryParams = useSearchParams();
  const inviteToken = queryParams.get("token");

  const { data, isPending } = useQuery({
    queryKey: ["invite", { token: inviteToken }],
    queryFn: async () => {
      if (!inviteToken) {
        return null;
      }
      return await teamRequests.findTeamByInviteToken(inviteToken);
    },
  });

  const { mutateAsync: acceptInvite, isPending: isAccepting } = useMutation({
    mutationKey: ["invite", { token: inviteToken }, "accept"],
    mutationFn: async () => {
      if (!inviteToken) return null;
      return await teamRequests.acceptTeamInvite(inviteToken);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["teams"] });
      router.push(`/app/${data?.id}/dashboard`);
    },
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <section className="flex flex-1 flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            <h1>Convite</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center">
          <Show
            when={Boolean(data)}
            component={
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <h2>{data?.name}</h2>
                <p>
                  Você foi convidado para participar do time{" "}
                  <strong>{data?.name}</strong>.
                </p>
                <Button
                  onClick={async () => {
                    await acceptInvite();
                  }}
                  disabled={isAccepting}
                >
                  Aceitar Convite
                </Button>
              </div>
            }
            fallback={
              <div>
                <h2>Convite inválido</h2>
                <p>Este convite não é mais válido.</p>
              </div>
            }
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;
