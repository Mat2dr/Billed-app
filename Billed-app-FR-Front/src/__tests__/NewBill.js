/**
 * @jest-environment jsdom
 */

//Import testing modules
import { screen, waitFor } from "@testing-library/dom";
import userEvent from '@testing-library/user-event';
//Import storage module
import store from "../__mocks__/store.js";
//Import routes and router modules
import Router from "../app/Router.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
//Import dashboards
import BillsUI from "../views/BillsUI.js";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      const user = JSON.stringify({
        type: "Employee",
        email: "a@a",
      });
      window.localStorage.setItem("user", user);

      const pathname = ROUTES_PATH["NewBill"];
      Object.defineProperty(window, "location", {
        value: {
          hash: pathname,
        },
      });

      document.body.innerHTML = `<div id="root"></div>`;
      Router();
     });

    test("Page loaded", () => {
      const title = screen.getByText("Envoyer une note de frais");
      expect(title).toBeTruthy();
    })

    test("Then mail icon in vertical layout should be highlighted", () => {
      expect(screen.getByTestId('icon-mail').classList.contains('active-icon')).toBe(true)
    })
  })

  describe("When I want to add a file", () => {
    test("The file is correct", async () => {
      //Set the test
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBillDash = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      
      //Testing
      const handleChangeFile = jest.fn(newBillDash.handleChangeFile);
      const addFileBtn = screen.getByTestId("file");
      addFileBtn.addEventListener("change", handleChangeFile);
      //Upload the file called file
      const file = new File(['hello.jpg'], 'hello.jpg', {type: 'image/jpeg'});
      userEvent.upload(addFileBtn, file);
      
      //Check to pass
      expect(handleChangeFile).toHaveBeenCalled();
      expect(addFileBtn.files.length).toEqual(1);
    })
  })
})