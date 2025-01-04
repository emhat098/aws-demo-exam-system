import { getAccessToken } from "@auth0/nextjs-auth0";
import { cache } from "react";

const _token = async () => await getAccessToken();

const userToken = cache(async () => await _token());

export default userToken;
