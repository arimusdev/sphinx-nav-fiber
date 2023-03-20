import {
  addNodeButtonHome,
  addNodeButtonSidebarOpen,
  addNodeCloseButton,
  addNodeModal,
  addNodeSubmitButton,
  checkbox,
  description,
  endTime,
  link,
  mainError,
  startTime,
  tagError,
  tags,
  toast,
} from "../support/constants/addNode";

describe("Add Node Form / Home interactions", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  // different Add Node + buttons depending on whether the sidebar is open or not
  const openButton = (setting: "home" | "sidebar") => {
    if (setting === "home") {
      return cy.get(addNodeButtonHome);
    }

    return cy.get(addNodeButtonSidebarOpen);
  };

  const modal = () => cy.get(addNodeModal);
  const submitButton = () => cy.get(addNodeSubmitButton);
  const closeButton = () => cy.get(addNodeCloseButton);
  const tagErrorMessage = () => cy.get(tagError);
  const mainErrorMessage = () => cy.get(mainError);
  const linkInput = () => cy.get(link);
  const startTimeInput = () => cy.get(startTime);
  const endTimeInput = () => cy.get(endTime);
  const descriptionInput = () => cy.get(description);
  const tagsInput = () => cy.get(tags);
  const toastBody = () => cy.get(toast);
  const checkboxButton = () => cy.get(checkbox);

  it("clicking the Add Content + button opens the Add Content Form modal, X button closes it", () => {
    openButton("home")
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Add Content +")
      .as("open_button");

    cy.get("@open_button").click({ waitForAnimations: false });

    modal().should("be.visible").and("contain.text", "Add Content");

    closeButton().click({ waitForAnimations: false });

    modal().should("not.exist");
  });

  it("submitting the form with all fields empty yields 5 error messages", () => {
    openButton("home").click();

    checkboxButton().click({ waitForAnimations: false });

    submitButton().click({ waitForAnimations: false });

    mainErrorMessage().should("not.be.visible").and("contain.text", "5 errors");

    cy.contains(/the field is required/i).should("be.visible");

    tagErrorMessage()
      .should("be.visible")
      .and(
        "contain.text",
        "You need to enter at least 1 topic tag to submit a node."
      );
  });

  it("all fields filled out correctly submits the form and checkbox checked, closes the modal and displays custom success message", () => {
    cy.intercept("POST", "https://knowledge-graph.sphinx.chat/add_node", {
      body: {
        success: true,
      },
      statusCode: 200,
    }).as("add_node");

    openButton("home").click();

    checkboxButton().click({ waitForAnimations: false });

    linkInput().type("youtube.com/watch?v=Midgx8bBDMk", {
      waitForAnimations: false,
    });

    startTimeInput().type("000000");
    endTimeInput().type("000030");
    descriptionInput().type("description");
    tagsInput().type("test").type("{enter}");

    submitButton().click();

    cy.wait("@add_node");

    modal().should("not.exist");

    // Waiting for Toast opacity keyframe to complete
    cy.wait(3000);

    toastBody()
      .should("be.visible")
      .and("contain.text", "Node submitted successfully!");
  });

  it("checkbox checked, submitting the form but receiving an error response from the server, displays custom error message", () => {
    cy.intercept("POST", "https://knowledge-graph.sphinx.chat/add_node", {
      body: { error: { message: "Payment required" } },
      statusCode: 402,
    }).as("add_node");

    openButton("home").click();

    checkboxButton().click({ waitForAnimations: false });

    linkInput().type("youtube.com/watch?v=Midgx8bBDMk", {
      waitForAnimations: false,
    });

    startTimeInput().type("000000");
    endTimeInput().type("000030");
    descriptionInput().type("description");
    tagsInput().type("test").type("{enter}");

    submitButton().click();

    cy.wait("@add_node");

    // Waiting for Toast opacity keyframe to complete
    cy.wait(3000);

    toastBody()
      .should("be.visible")
      .and("contain.text", "Node submission failed, please try again.");
  });
});
