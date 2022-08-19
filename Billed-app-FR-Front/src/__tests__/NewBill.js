/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from '@testing-library/user-event';
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null;
      const newBillDash = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      });
     });

    test("Page loaded", () => {
      const title = screen.getByText("Envoyer une note de frais");
      expect(title).toBeTruthy();
    })

    test("Then mail icon in vertical layout should be highlighted", async () => {
      await waitFor(() => screen.getByTestId('icon-mail'))

      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains('active-icon')).toBe(true)
    })

    describe("When I want to add a file", () => {
      test("The file is correct", () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        document.body.innerHTML = NewBillUI();
        const store = null;
      
        const newBillDash = new NewBill({
          document, onNavigate, store, localStorage: window.localStorage
        });
      
        const handleChangeFile = jest.fn(newBillDash.handleChangeFile);
        const addFileBtn = screen.getByTestId("file");
        addFileBtn.addEventListener("change", handleChangeFile);
      
        const file = new File(['hello.jpg'], 'hello.jpg', {type: 'image/jpeg'});
        userEvent.upload(addFileBtn, file);
      
        //expect(handleChangeFile).toHaveBeenCalled();
        expect(addFileBtn.files.length).toEqual(1);
      })
    })

  })
})