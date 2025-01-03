import { getSession } from "@auth0/nextjs-auth0";
import { cache } from "react";

const _session = async () => await getSession();

export const userSession = cache(_session);
