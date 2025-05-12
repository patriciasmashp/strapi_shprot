import styled from "styled-components";
export const Wrapper = styled.div`
  .rsw-toolbar .rsw-btn {
    width: 4em;
    height: 4em;
  }

  .rsw-editor {
    font-size: 1.2em;
  }

  .drop-zone {
    height: 114px !important;
    margin: 20px 0px;
    max-width: 100% !important;
  }
  .strapi-block {
    padding-block-start: 24px;
    padding-block-end: 24px;
    padding-inline-start: 24px;
    padding-inline-end: 24px;
    background: #212134;
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    border-color: #32324d;
    box-shadow: 1px 1px 10px rgba(3, 3, 5, 0.2);
  }
  .strapi-alert {
    margin-inline-start: -250px;
    top: 4.6rem;
    left: 50%;
    width: 50rem;
    z-index: 700;
    position: fixed;
  }

  .strapi-textarea {
    min-width: 640px;
  }
`;
