/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import userEvent from "@testing-library/user-event";
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')

      expect(windowIcon.classList.value).toBe("active-icon")

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Then I click on newBill button, handleClickNewBill should be called", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const billsDashboard = new Bills({ document, onNavigate: onNavigate, store: null, localStorage: window.localStorage })
      const newBillButton = screen.getByTestId('btn-new-bill')
      const handleClickNewBill = jest.fn(billsDashboard.handleClickNewBill)
      newBillButton.addEventListener('click', handleClickNewBill)
      userEvent.click(newBillButton)
      expect(handleClickNewBill).toHaveBeenCalled()
    })

    test("Then I click on icon eye, handleClickIconEye should be called", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const billsDashboard = new Bills({ document, onNavigate: onNavigate, store: null, localStorage: window.localStorage })
      const iconEye = screen.getAllByTestId('icon-eye')
      const handleClickIconEye = jest.fn(billsDashboard.handleClickIconEye)
      $.fn.modal = jest.fn();
      iconEye.forEach(icon => {
        icon.addEventListener('click', ()=>handleClickIconEye(icon))
        userEvent.click(icon)
        expect(handleClickIconEye).toHaveBeenCalled()
      })
    })

    test("When I enter bills page, getBills should return the store bills ", async () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const billsDashboard = new Bills({ document, onNavigate: onNavigate, store: mockStore, localStorage: window.localStorage })
      const getBills = jest.fn(billsDashboard.getBills)
      const billsResult = await billsDashboard.getBills()
      expect(billsResult.length).toBe(4)
    })
  })
})  
