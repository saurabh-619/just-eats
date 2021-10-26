import { makeVar } from "@apollo/client";
import { IS_VERIFIED } from "../utils/constants";

export const appErrorVar = makeVar("");
export const isVerifiedVar = makeVar("false");
