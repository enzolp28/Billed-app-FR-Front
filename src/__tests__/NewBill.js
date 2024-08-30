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

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I click on 'choisir un fichier' button, handleChangeFile should be called", () => {
      document.body.innerHTML = NewBillUI()
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
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

  describe("When I am on NewBill Page and I click on 'Envoyer'", () => {
    test("Then I should be sent on Dashboard with big billed icon instead of form", () => {
      document.body.innerHTML = NewBillUI()
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const newBill = new NewBill({ document, onNavigate: onNavigate, store: mockStore, localStorage: window.localStorage })
      const handleSubmit = jest.fn(newBill.handleSubmit)
      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})
