import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "@src/pages/home";

export function Router () {
	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</HashRouter>
	)
}