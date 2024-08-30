/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import userEvent from "@testing-library/user-event";
import router from "../app/Router.js";
import { fireEvent } from "@testing-library/dom";
import { ROUTES, ROUTES_PATH } from "../constants/routes";


const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeAll(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = NewBillUI()
    })
    test("Then I click on 'choisir un fichier' button, handleChangeFile should be called", () => {
      //document.body.innerHTML = NewBillUI()
      // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      // window.localStorage.setItem('user', JSON.stringify({
      //   type: 'Employee'
      // }))
      // const onNavigate = (pathname) => {
      //   document.body.innerHTML = ROUTES({ pathname })
      // }
      const newBill = new NewBill({ document, onNavigate: onNavigate, store: mockStore, localStorage: window.localStorage })
      const fileInput = screen.getByTestId('file')
      newBill.handleChangeFile = jest.fn()
      const handleClickFileButton = jest.fn(newBill.handleChangeFile)
      fileInput.addEventListener('change', handleClickFileButton)
      fireEvent.change(fileInput, {
        target: {
          files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})],
        },
      })
      expect(handleClickFileButton).toHaveBeenCalled()
    })
  })
    test("When I am on NewBill Page and I click on 'Envoyer' Then I should be sent on Dashboard with big billed icon instead of form", () => {
      
      // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      // window.localStorage.setItem('user', JSON.stringify({
      //   type: 'Employee'
      // }))
      // const onNavigate = (pathname) => {
      //   document.body.innerHTML = ROUTES({ pathname })
      // }
      const newBill = new NewBill({ document, onNavigate: onNavigate, store: mockStore, localStorage: window.localStorage })
      const inputDepense = screen.getByTestId("expense-type");
      fireEvent.change(inputDepense, { target: { value: "Transports" } });

      const inputName = screen.getByTestId("expense-name");
      fireEvent.change(inputName, { target: { value: "Bus" } });


      const inputDate = screen.getByTestId("datepicker");
      fireEvent.change(inputDate, { target: { value: "2022-01-01" } });

      const inputMontant = screen.getByTestId("amount");
      fireEvent.change(inputMontant, { target: { value: "100" } });


      const inputComment = screen.getByTestId("vat");
      fireEvent.change(inputComment, { target: { value: "10" } });

      const inputPct = screen.getByTestId("pct");
      fireEvent.change(inputPct, { target: { value: "10" } });


      const inputAuthor = screen.getByTestId("commentary");
      fireEvent.change(inputAuthor, { target: { value: "test" } });


      const inputFile = screen.getByTestId("file");
      fireEvent.change(inputFile, {
        target: {
          //exemple lunette donné par la documentation 
          files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})],
        },
      });


      const handleSubmit = jest.fn(newBill.handleSubmit) //permet de surveiller le comportement de la fonction
      newBill.updateBill = jest.fn() //verifie quelle est appelee en lui assignant une fonction vide
      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(newBill.updateBill).toHaveBeenCalled()

      const titreDeListe = screen.getByText('Mes notes de frais') //recupere le titre de la page
      expect(titreDeListe).toBeTruthy()
    })

    
  })

