import { useContext } from "react";
import { NearContext, Wallet } from "@/wallets/near";
import {
  Transaction,
  buildTransaction,
  calculateDepositByDataSize,
} from "@wpdas/naxios";
import { Big } from "big.js";
import { parseNearAmount } from "near-api-js/lib/utils/format";

const register = () => {
  return (
    <div>register</div>
  )
}

export default register