import React from "react";

interface IFormError {
  errorMessage?: string;
}

const FormError: React.FC<IFormError> = ({ errorMessage }) => {
  return errorMessage ? (
    <small role="alert" className="text-red-600">
      *{errorMessage}
    </small>
  ) : null;
};

export default FormError;
