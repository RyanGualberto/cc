"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Loading } from "~/components/ui/loading";
import Show from "~/components/utils/show";
import { teamRequests } from "~/requests/team";

const Page = ({}) => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const inviteToken = queryParams.get("token");

  const { data, isPending } = useQuery({
    queryKey: ["invite", { token: inviteToken }],
    queryFn: async () => {
      if (!inviteToken) return null;

      return await teamRequests.findTeamByInviteToken(inviteToken);
    },
    enabled: !!inviteToken,
  });

  const { mutateAsync: acceptInvite, isPending: isAccepting } = useMutation({
    mutationKey: ["invite", { token: inviteToken }, "accept"],
    mutationFn: async () => {
      if (!inviteToken) return null;
      return await teamRequests.acceptTeamInvite(inviteToken);
    },
    onSuccess: () => {
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
          <CardTitle>
            <h1>Convite</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Show
            when={Boolean(data)}
            component={
              <div>
                <h2>{data?.name}</h2>
                <p>
                  Você foi convidado para participar do time{" "}
                  <strong>{data?.name}</strong>.
                </p>
              </div>
            }
            fallback={
              <div>
                <h2>Convite inválido</h2>
                <p>Este convite não é mais válido.</p>
              </div>
            }
          />
          <Button
            onClick={async () => {
              await acceptInvite();
            }}
            disabled={isAccepting}
          >
            Aceitar Convite
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;
