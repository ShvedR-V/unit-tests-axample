import { loadLocaleData } from "@/components/Providers/LocalizationProvider";
import { SnackbarProvider } from "@/components/Providers/SnackbarProvider";
import { Templates } from "@/components/Templates";
import Snackbar from "@/components/ui-component/SnackBar";
import { MockedProvider } from "@apollo/client/testing";
import { LicenseInfo } from "@mui/x-data-grid-pro";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { MockType } from "__mocks__/mockType";
import {
  Corner,
  TemplatesDocument,
  TemplatesQuery,
  TemplatesQueryVariables,
  Update_TemplateDocument,
  Update_TemplateMutation,
  Update_TemplateMutationVariables,
} from "../../../gql/gqlTypes";
import { randomString } from "../../../utils/randomString";

describe("Some component render", () => {
  let messages: any;

  beforeAll(async () => {
    LicenseInfo.setLicenseKey("LicenseKey");
    messages = (await loadLocaleData("en")).default;
  });

  const templateId = randomString(8);
  const templateUrl = randomString(10);
  const templates: TemplatesQuery["Templates"] = [
    {
      corner: Corner.BottomLeft,
      active: true,
      id: templateId,
      url: templateUrl,
      x: Number(randomString(10)),
      y: Number(randomString(10)),
      game: null,
    },
  ];
  const mockTemplates: MockType<TemplatesQuery, TemplatesQueryVariables> = {
    request: {
      query: TemplatesDocument,
      variables: {},
    },
    result: { data: { templates } },
  };

  const mockUpdateTemplate: MockType<
    Update_TemplateMutation,
    Update_TemplateMutationVariables
  > = {
    request: {
      query: Update_TemplateDocument,
      variables: {
        templateId: templateId,
        active: false,
      },
    },
    result: { data: { updateTemplate: randomString(10) } },
  };

  const mocks = [mockTemplates, mockUpdateTemplate];

  it("Should show Templates", async () => {
    const { getByText, getByRole } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <IntlProvider locale="en" messages={messages}>
          <Templates />
        </IntlProvider>
      </MockedProvider>
    );

    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(getByRole("grid")).toBeInTheDocument();
    expect(getByText("All Games")).toBeInTheDocument();
  });

  it("Should update template", async () => {
    const { getByTestId, getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <IntlProvider locale="en" messages={messages}>
          <SnackbarProvider>
            <Templates />
            <Snackbar />
          </SnackbarProvider>
        </IntlProvider>
      </MockedProvider>
    );

    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    fireEvent.click(getByTestId("icon-action"));

    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(getByText(/Updated template/i)).toBeInTheDocument();
  });

  it("Should error template", async () => {
    const mockUpdateTemplate: MockType<
      Update_TemplateMutation,
      Update_TemplateMutationVariables
    > = {
      request: {
        query: Update_TemplateDocument,
        variables: {
          templateId: templateId,
          active: true,
        },
      },
      result: { data: { updateTemplate: randomString(10) } },
    };

    const { getByTestId, getByText } = render(
      <MockedProvider
        mocks={[mockTemplates, mockUpdateTemplate]}
        addTypename={false}
      >
        <IntlProvider locale="en" messages={messages}>
          <SnackbarProvider>
            <Templates />
            <Snackbar />
          </SnackbarProvider>
        </IntlProvider>
      </MockedProvider>
    );

    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    fireEvent.click(getByTestId("icon-action"));

    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(getByText(/Failed to update template/i)).toBeInTheDocument();
  });

  it("Should open and close modal", async () => {
    const { getByTestId, getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <IntlProvider locale="en" messages={messages}>
          <Templates />
        </IntlProvider>
      </MockedProvider>
    );

    fireEvent.click(getByTestId("icon-add-new-template"));

    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(getByText("New Template")).toBeInTheDocument();

    fireEvent.click(getByText("Cancel"));

    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(queryByText("New Template")).not.toBeInTheDocument();
  });
});
