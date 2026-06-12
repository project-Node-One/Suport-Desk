import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/main.css';
import { addRoute, startRouter } from './router/router.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { TicketsPage } from './pages/TicketsPage.js';
import { TicketDetailPage } from './pages/TicketDetailPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

addRoute('/login', LoginPage);
addRoute('/register', RegisterPage);
addRoute('/tickets', TicketsPage);
addRoute('/tickets/:id', TicketDetailPage);
addRoute('/dashboard', DashboardPage);
addRoute('/not-found', NotFoundPage);

startRouter();
