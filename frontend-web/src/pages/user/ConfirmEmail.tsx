import { useApolloClient, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import { appErrorVar } from "../../store/store";
import { VERIFY_EMAIL_MUTATION } from "../../utils/queries";
import { useMe } from "./../../hooks/useMe";
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from "../../__generated__/VerifyEmailMutation";
import { gql } from "@apollo/client";
import { Helmet } from "react-helmet-async";

const ConfirmEmail = () => {
  const { data: userData } = useMe();

  const location = useLocation();
  const history = useHistory();

  const client = useApolloClient();

  const onCompleted = (data: VerifyEmailMutation) => {
    const { verifyEmail } = data;
    if (verifyEmail.error) {
      appErrorVar(verifyEmail.error);
    }
    if (verifyEmail.ok && userData?.me.id) {
      // change the verifies from cache
      client.writeFragment({
        id: `User:${userData?.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
    }
    history.push("/restaurants");
  };

  const [verifyEmailMutation, { loading: isVerifying }] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION, { onCompleted });

  useEffect(() => {
    const code = location.search.split("?code=")[1];
    console.log({ code });
    verifyEmailMutation({ variables: { input: { code } } });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-36">
      <Helmet>
        <title>Verify email | just eats</title>
      </Helmet>
      <h2 className="mb-2 text-2xl font-medium">Confirming email</h2>
      <h4 className="text-sm text-gray-500">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};

export default ConfirmEmail;
