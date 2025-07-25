import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/home/HomePage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import NotFoundPage from "./pages/404/NotFoundPage";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/auth/LoginPage";

function App() {
	return (
		<>
			<Routes>
				{/* Páginas públicas */}
				<Route path='/auth' element={<Navigate to='/auth/login' replace />} />
				<Route path='/auth/login' element={<LoginPage />} />
				<Route path='/auth/signup' element={<></>} />

				{/* Rotas protegidas */}
				<Route
					element={
							<MainLayout />
					}
				>
					<Route path='/' element={<HomePage />} />
					<Route path='/albums/:albumId' element={<AlbumPage />} />
					<Route path='/admin' element={<AdminPage />} />
					<Route path='*' element={<NotFoundPage />} />
				</Route>
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
