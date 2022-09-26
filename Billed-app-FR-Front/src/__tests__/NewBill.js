/**
 * @jest-environment jsdom
 */

//Import testing modules
import '@testing-library/jest-dom';
import { getByRole, getByTestId, getByLabelText } from '@testing-library/dom'
import { fireEvent,screen, waitFor } from "@testing-library/dom";
import userEvent from '@testing-library/user-event';
//Import storage module
import store from "../__mocks__/store.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
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
    test("file is correct and I click on the btn envoyer", () => {
      const mockedFormEvent = {
        target: { querySelector: jest.fn() },
        preventDefault: jest.fn(),
      };
      mockedFormEvent.target.querySelector.mockReturnValue("valeur de test");
  
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBillDash = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
  
      const handleSubmit = jest.fn(() =>
        newBillDash.handleSubmit(mockedFormEvent)
      );
  
      //Test handleSubmit
      const envoyerBtn = screen.getByTestId("envoyer-btn");
      envoyerBtn.addEventListener("click", handleSubmit);
      userEvent.click(envoyerBtn);
      expect(handleSubmit).toHaveBeenCalled();
    });
  })
})

// test d'intégration Post
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to NewBillDash", () => {
    test("POST", async () => {
      //Set the test
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBillDash = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      const billTest = {
        id: "10000",
        status: "pending",
        pct: 30,
        amount: 500,
        email: "dragovic.mathias@gmail.com",
        name: "Le remois",
        vat: "15",
        fileName: "test.jpg",
        date: "2022-09-10",
        commentary: "postMockNewBill",
        type: "Restaurants et bars",
        fileUrl: "https://test.jpg",
      };

      const handleSubmit = jest.fn(newBillDash.handleSubmit);
      const formNewBills = screen.getByTestId('form-new-bill')
			formNewBills.addEventListener('submit', handleSubmit)
			fireEvent.submit(formNewBills)
			expect(handleSubmit).toHaveBeenCalled()
    })
   describe("When an error occurs on API", () => {
    //Set the test
    beforeEach(() => {
      jest.spyOn(store, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "e@e"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      Router()
    })
    test("Fails with 404 message error", () => {
      store.bills.mockImplementationOnce(() => {
        return Promise.reject(new Error("Erreur 404"))
      })
      document.body.innerHTML =  BillsUI({ error: "Erreur 404" });
      const message = screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("Fails with 500 message error", () => {

      store.bills.mockImplementationOnce(() => {
        return Promise.reject(new Error("Erreur 500"))
      })
      document.body.innerHTML =  BillsUI({ error: "Erreur 500" });
      const message = screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })

  })
})