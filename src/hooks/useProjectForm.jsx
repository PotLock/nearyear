import { useContext, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { NearContext } from "@/wallets/near";
import { deepObjectDiff } from "@/utils/object";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import calculateDepositByDataSize from "@/utils/calculateDepositByDataSize";
import { Big } from "big.js";

export const useProjectForm = () => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [isLoading, setIsLoading] = useState(false);
  const [socialProfileSnapshot, setSocialProfileSnapshot] = useState(null);

  const form = useForm({
    mode: "all",
    defaultValues: {
      name: "",
      description: "",
    },
    resetOptions: { keepDirty: false, keepTouched: false },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await wallet.viewMethod({
          contractId: "social.near",
          method: "get",
          args: { keys: [`${signedAccountId}/profile/*`] },
        });
        setSocialProfileSnapshot(profile[signedAccountId]?.profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (signedAccountId) {
      fetchProfile();
    }
  }, [wallet, signedAccountId]);

  const formInputs = useWatch({ control: form.control });

  console.log("formInputs", formInputs);

  //? Derive diff from the preexisting social profile
  const socialDbProfileUpdate = socialProfileSnapshot
    ? deepObjectDiff(socialProfileSnapshot, formInputs)
    : formInputs;

  const socialArgs = {
    data: {
      [signedAccountId]: {
        profile: socialDbProfileUpdate,
        /**
         *? Auto Follow and Star Potlock
         */

        index: {
          star: {
            key: { type: "social", path: `potlock.near/widget/Index` },
            value: { type: "star" },
          },

          notify: {
            key: "potlock.near",
            value: {
              type: "star",
              item: { type: "social", path: `potlock.near/widget/Index` },
            },
          },
        },

        graph: {
          star: { ["potlock.near"]: { widget: { Index: "" } } },
          follow: { ["potlock.near"]: "" },
        },
      },
    },
  };

  const isThereChanges =
    socialDbProfileUpdate && Object.keys(socialDbProfileUpdate).length > 0;

  const onSubmit = async (data) => {
    setIsLoading(true);

    //? Update the social profile
    let depositFloat = calculateDepositByDataSize(socialArgs);

    if (!signedAccountId) {
      depositFloat = Big(depositFloat).add(0.1).toString();
    }

    try {
      await wallet.callMethod({
        contractId: "social.near",
        method: "set",
        args: socialArgs,
        deposit: parseNearAmount(depositFloat),
      });
    } catch (error) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    socialProfileSnapshot,
    isLoading: form.formState.isSubmitting || isLoading || !socialProfileSnapshot,
    isThereChanges,
    onSubmit,
  };
};
