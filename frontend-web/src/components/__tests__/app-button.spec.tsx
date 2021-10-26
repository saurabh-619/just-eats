import { render } from "@testing-library/react";
import AppButton from "../AppButton";

describe("<AppButton/>", () => {
  it("should render OK with props", () => {
    const { getByText } = render(
      <AppButton canClick={true} loading={false} actionText="Test Button" />
    );

    getByText("Test Button");
  });

  it("should display loading", () => {
    const { debug, getByText, container } = render(
      <AppButton canClick={false} loading={true} actionText="test" />
    );
    getByText("loading...");
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});
