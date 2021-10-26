import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useParams } from "react-router";
import { CATEGORY_QUERY } from "../../utils/queries";
import {
  CategoryQuery,
  CategoryQueryVariables,
} from "./../../__generated__/CategoryQuery";

interface IParamsProps {
  slug: string;
}

const Category = () => {
  const params = useParams<IParamsProps>();

  const [page, setPage] = useState(2);

  const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: { page, slug: params.slug },
      },
    }
  );

  console.log({ data });
  return <div></div>;
};

export default Category;
