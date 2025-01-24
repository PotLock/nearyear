import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NearContext } from "@/wallets/near";

export const useProjectForm = () => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await wallet.viewMethod({
          contractId: "social.near",
          method: "get",
          args: { keys: [`${signedAccountId}/profile/*`] },
        });
        setProfile(profile[signedAccountId]?.profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (signedAccountId) {
      fetchProfile();
    }
  }, [wallet, signedAccountId]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await wallet.callMethod({
        contractId: "social.near",
        method: "set",
        args: {
          data: {
            [signedAccountId]: {
              profile: data,
            },
          },
        },
        deposit: "1000000000000000000000000",
      });
    } catch (error) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    profile,
    isLoading,
    onSubmit,
  };
};
