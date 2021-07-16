import { App } from './app';
import './footer.scss';
import store from './store/store';
import { Login } from './components/login/login';
import { AdminPage } from './components/admin-page/admin-page';
import { deleteEmptyCategoryRequest } from './module/request';
import { getLocation } from './components/admin-page/functions';

function login(rootElement:HTMLElement) {
  const loginForm = new Login(rootElement);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  loginForm.authorization().then(() => adminPage(rootElement), () => {});
}

async function mainPage() {
  await deleteEmptyCategoryRequest();
  const appElement = document.querySelector('body');
  if (!appElement) throw Error('App root element not found');
  if (appElement.nextElementSibling) appElement.nextElementSibling.innerHTML = '';

  if (getLocation()[0] === 'categories') {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    adminPage(appElement);
    return;
  }

  const app = new App(appElement);
  app.element.insertAdjacentHTML('afterend', ''
    + '<div class="footer" ><a href="https://rs.school/js/"> '
    + '<img src="svg/rs_school_js.svg" alt="rs.school"> </a></div>');
  const unsubscribe = store.subscribe(() => {
    if (store.getState().link === 'Login') {
      unsubscribe();
      login(appElement);
    }
  });
}
async function adminPage(rootElement:HTMLElement) {
  await new AdminPage(rootElement).render();
  rootElement.innerHTML = '';

  mainPage();
}

window.onload = () => {
  mainPage();
  console.log('index.ts запустился');
};
